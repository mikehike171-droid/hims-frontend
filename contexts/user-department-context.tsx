"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react'
import { useBranch } from './branch-context'
import authService from '@/lib/authService'
import { apiCache } from '@/lib/apiCache'

// Global singleton to prevent duplicate department calls
class DepartmentFetcher {
  private static instance: DepartmentFetcher
  private pendingCall: Promise<any> | null = null
  private lastResult: any = null
  private lastKey: string = ''

  static getInstance(): DepartmentFetcher {
    if (!DepartmentFetcher.instance) {
      DepartmentFetcher.instance = new DepartmentFetcher()
    }
    return DepartmentFetcher.instance
  }

  async fetchDepartment(userId: string, locationId: string, token: string, apiUrl: string) {
    const key = `${userId}-${locationId}`
    
    // Return cached result if same key
    if (this.lastKey === key && this.lastResult) {
      return this.lastResult
    }

    // Return pending call if already in progress
    if (this.pendingCall) {
      return this.pendingCall
    }

    // Make new call
    this.pendingCall = this.makeCall(userId, locationId, token, apiUrl)
    
    try {
      const result = await this.pendingCall
      this.lastResult = result
      this.lastKey = key
      return result
    } finally {
      this.pendingCall = null
    }
  }

  private async makeCall(userId: string, locationId: string, token: string, apiUrl: string) {
    const response = await fetch(`${apiUrl}/settings/users/${userId}/department?locationId=${locationId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (response.ok) {
      return await response.json()
    }
    throw new Error('Failed to fetch department')
  }
}

const departmentFetcher = DepartmentFetcher.getInstance()

interface UserDepartmentContextType {
  userDepartment: string
  isLoading: boolean
  refreshDepartment: () => void
}

const UserDepartmentContext = createContext<UserDepartmentContextType | undefined>(undefined)

export function UserDepartmentProvider({ children }: { children: ReactNode }) {
  const [userDepartment, setUserDepartment] = useState<string>('General')
  const [isLoading, setIsLoading] = useState(false)
  const { currentBranch } = useBranch()
  const fetchingDepartmentRef = useRef(false)

  const fetchUserDepartment = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      const user = authService.getCurrentUser()
      const token = authService.getCurrentToken()
      const apiUrl = authService.getSettingsApiUrl()
      const locationId = currentBranch?.id || '1'
      
      const data = await departmentFetcher.fetchDepartment(
        user?.id?.toString() || '1',
        locationId,
        token,
        apiUrl
      )
      
      setUserDepartment(data.departmentName || 'General')
    } catch (error) {
      console.error('Failed to fetch user department:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserDepartment()
  }, [currentBranch])

  const refreshDepartment = () => {
    fetchUserDepartment()
  }

  return (
    <UserDepartmentContext.Provider value={{ userDepartment, isLoading, refreshDepartment }}>
      {children}
    </UserDepartmentContext.Provider>
  )
}

export function useUserDepartment() {
  const context = useContext(UserDepartmentContext)
  if (context === undefined) {
    throw new Error('useUserDepartment must be used within a UserDepartmentProvider')
  }
  return context
}
"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"
import authService from "../lib/authService"
import { apiCache } from "../lib/apiCache"

export interface Branch {
  id: string
  name: string
  locationCode: string
  address: string
  phone: string
  email: string
  isActive: boolean
}

interface BranchContextType {
  currentBranch: Branch | null
  branches: Branch[]
  switchBranch: (branchId: string) => void
  loading: boolean
}
const BranchContext = createContext<BranchContextType | undefined>(undefined)


export function BranchProvider({ children }: { children: React.ReactNode }) {
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null)
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const fetchingBranchesRef = useRef(false)

  useEffect(() => {
    // Use cached branches first for instant loading
    const cachedBranches = localStorage.getItem('cachedBranches')
    if (cachedBranches) {
      try {
        const parsed = JSON.parse(cachedBranches)
        setBranches(parsed)
        const selectedLocationId = localStorage.getItem('selected_location_id')
        const primaryLocationId = selectedLocationId?.replace(/"/g, '') || ''
        const defaultBranch = primaryLocationId
          ? parsed.find((b: Branch) => b.id === primaryLocationId) || parsed[0]
          : parsed[0]
        setCurrentBranch(defaultBranch)
        
        setLoading(false)
      } catch (e) {
        console.error('Error parsing cached branches:', e)
      }
    }

    const fetchBranches = async () => {
      if (fetchingBranchesRef.current) return
      
      try {
        fetchingBranchesRef.current = true
        const token = authService.getCurrentToken()
        const apiUrl = authService.getApiUrl()
        
        if (!token) {
          setLoading(false)
          return
        }

        const locations = await apiCache.get('user-branches', async () => {
          const response = await fetch(`${authService.getSettingsApiUrl()}/locations/user-branches`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          if (!response.ok) {
            if (response.status === 401) {
              authService.logout()
              return
            }
            throw new Error(`Failed to fetch branches: ${response.status}`)
          }
          
          return await response.json()
        })
        const formattedBranches: Branch[] = locations.map((loc: any) => ({
          id: loc.id.toString(),
          name: loc.name,
          locationCode: loc.locationCode,
          address: loc.address,
          phone: loc.phone || '',
          email: loc.email || '',
          isActive: loc.isActive,
        }))

        // Cache branches for next time
        localStorage.setItem('cachedBranches', JSON.stringify(formattedBranches))
        setBranches(formattedBranches)

        // Get selected_location_id (primary_location_id) from localStorage
        const selectedLocationId = localStorage.getItem('selected_location_id')
        let defaultBranch: Branch
        
        if (!selectedLocationId || selectedLocationId === '' || selectedLocationId === '""') {
          // Super admin/admin with empty selected_location_id - auto-select first branch
          defaultBranch = formattedBranches[0]
          if (defaultBranch) {
            localStorage.setItem('selected_location_id', defaultBranch.id)
            authService.setSelectedBranchId(defaultBranch.id)
          }
        } else {
          // Normal user - use selected_location_id (primary_location_id)
          const primaryLocationId = selectedLocationId.replace(/"/g, '')
          defaultBranch = formattedBranches.find((b) => b.id === primaryLocationId) || formattedBranches[0]
          if (defaultBranch) {
            authService.setSelectedBranchId(primaryLocationId)
          }
        }

        setCurrentBranch(defaultBranch)
      } catch (error) {
        console.error("Error fetching branches:", error)
      } finally {
        setLoading(false)
        fetchingBranchesRef.current = false
      }
    }

    // Fetch in background if no cache or after initial render
    if (!cachedBranches) {
      fetchBranches()
    } else {
      // Fetch fresh data in background
      setTimeout(fetchBranches, 100)
    }
  }, [])

  const switchBranch = async (branchId: string) => {
    const branch = branches.find((b) => b.id === branchId)
    if (branch) {
      setCurrentBranch(branch)
      authService.setSelectedBranchId(branchId)
      
      // Call API to update user info and permissions
      try {
        const token = authService.getCurrentToken()
        const user = authService.getCurrentUser()
        
        if (token && user) {
          const response = await fetch(`${authService.getSettingsApiUrl()}/auth/switch-location`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              locationId: parseInt(branchId)
            })
          })
          
          if (response.ok) {
            const data = await response.json()
            
            // Update localStorage with new user info and permissions
            const updatedUserInfo = { ...data.UserInfo, primary_location_id: parseInt(branchId) }
            localStorage.setItem('user', JSON.stringify(updatedUserInfo))
            localStorage.setItem('sidemenu', JSON.stringify(data.sidemenu))
            localStorage.setItem('moduleAccess', JSON.stringify(data.moduleAccess))
            localStorage.setItem('selected_location_id', branchId)
            
            // Reload page to refresh all components with new permissions
            window.location.reload()
          }
        }
      } catch (error) {
        console.error('Error switching location:', error)
      }
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent("branchChanged", {
            detail: { branch },
          }),
        )
      }
    }
  }



  return (
    <BranchContext.Provider
      value={{
        currentBranch,
        branches,
        switchBranch,
        loading,
      }}
    >
      {children}
    </BranchContext.Provider>
  )
}

export function useBranch() {
  const context = useContext(BranchContext)
  if (context === undefined) {
    throw new Error("useBranch must be used within a BranchProvider")
  }
  return context
}

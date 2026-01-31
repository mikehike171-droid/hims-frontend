"use client"

import { useState, useEffect, useRef } from "react"
import { User, LogOut, Settings, ChevronDown, UserCircle, Shield, Bell, HelpCircle, Moon, Sun, Key } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { useBranch } from "@/contexts/branch-context"
import { useUserDepartment } from "@/contexts/user-department-context"
import { ProfileForm } from "./profile-form"
import { ChangePasswordForm } from "./change-password-form"
import authService from "@/lib/authService"
import { apiCache } from "@/lib/apiCache"

interface UserProfile {
  id: number
  username: string
  firstName: string
  lastName: string
  email: string
  phone: string
  userInfo?: {
    userType: string
    alternatePhone?: string
    address?: string
    qualification?: string
    yearsOfExperience?: number
  }
}

export function ProfileDropdown() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const { userDepartment } = useUserDepartment()
  const { currentBranch } = useBranch()
  const fetchingProfileRef = useRef(false)

  useEffect(() => {
    const user = authService.getCurrentUser()
    setCurrentUser(user)
    if (!fetchingProfileRef.current) {
      fetchProfile()
    }
  }, [])



  const fetchProfile = async () => {
    try {
      const token = authService.getCurrentToken()
      const apiUrl = authService.getSettingsApiUrl()
      
      const profileData = await apiCache.get('profile', async () => {
        const response = await fetch(`${apiUrl}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (response.ok) {
          return await response.json()
        }
        throw new Error('Failed to fetch profile')
      })
      
      setProfile(profileData)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    }
  }

  const handleProfileClick = () => {
    window.location.href = '/admin/profile'
  }



  const handleLogout = () => {
    authService.logout()
  }

  const displayName = profile ? `${profile.firstName} ${profile.lastName}` : (currentUser ? `${currentUser.firstName || currentUser.first_name || ''} ${currentUser.lastName || currentUser.last_name || ''}`.trim() || 'User' : 'User')
  
  console.log('Current user data:', currentUser)
  console.log('Display name:', displayName)

  const userRole = profile?.userInfo?.userType || currentUser?.userType || 'staff'
  const isDoctor = userRole === 'doctor'
  const isAdmin = userRole === 'admin' || userRole === 'superadmin'

  if (!currentUser) {
    return (
      <button className="flex items-center gap-2 px-3 py-2 text-sm rounded-md">
        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
          <User className="h-4 w-4 text-gray-600" />
        </div>
        <span className="text-sm">Loading...</span>
      </button>
    )
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500">
            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
              <User className="h-4 w-4 text-red-600" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium">{displayName}</div>
              <div className="text-xs text-gray-500 capitalize">{userDepartment}</div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          
          <DropdownMenuItem onClick={handleProfileClick}>
            <UserCircle className="mr-3 h-4 w-4" />
            <span>View Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setShowPasswordDialog(true)}>
            <Key className="mr-3 h-4 w-4" />
            <span>Change Password</span>
          </DropdownMenuItem>
          
          {isAdmin && (
            <DropdownMenuItem>
              <Shield className="mr-3 h-4 w-4" />
              <span>Admin Panel</span>
            </DropdownMenuItem>
          )}
          
          {/* <DropdownMenuItem>
            <Bell className="mr-3 h-4 w-4" />
            <span>Notifications</span>
          </DropdownMenuItem> */}
          
          <DropdownMenuSeparator />
          
          {/* <DropdownMenuItem>
            <Moon className="mr-3 h-4 w-4" />
            <span>Dark Mode</span>
          </DropdownMenuItem> */}
          
          {/* <DropdownMenuItem>
            <HelpCircle className="mr-3 h-4 w-4" />
            <span>Help Center</span>
          </DropdownMenuItem> */}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
            <LogOut className="mr-3 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>



      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Change Password
            </DialogTitle>
          </DialogHeader>
          <ChangePasswordForm 
            username={currentUser?.user_name || ''}
            onClose={() => setShowPasswordDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
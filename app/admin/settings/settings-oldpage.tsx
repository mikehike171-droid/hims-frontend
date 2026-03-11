"use client"

import { useState, useEffect, useCallback } from "react"
import { settingsApi, User, Role } from "@/lib/settingsApi"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import {
  Users,
  Building2,
  Shield,
  MapPin,
  SettingsIcon,
  FileText,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Check,
  X,
  Calendar,
  Mail,
  Phone,
  UserCheck,
  UserX,
  Crown,
} from "lucide-react"



const mockDepartments = [
  {
    id: 1,
    name: "Cardiology",
    code: "CARD",
    head: "Dr. Rajesh Kumar",
    staffCount: 15,
    location: "Main Hospital",
    isActive: true,
  },
  {
    id: 2,
    name: "Neurology",
    code: "NEURO",
    head: "Dr. Priya Patel",
    staffCount: 12,
    location: "Main Hospital",
    isActive: true,
  },
  {
    id: 3,
    name: "Orthopedics",
    code: "ORTHO",
    head: "Dr. Suresh Reddy",
    staffCount: 18,
    location: "Main Hospital",
    isActive: true,
  },
  {
    id: 4,
    name: "Pediatrics",
    code: "PEDIA",
    head: "Dr. Anjali Singh",
    staffCount: 10,
    location: "Branch - Andheri",
    isActive: true,
  },
  {
    id: 5,
    name: "Emergency",
    code: "EMRG",
    head: "Dr. Vikram Joshi",
    staffCount: 25,
    location: "Main Hospital",
    isActive: true,
  },
  {
    id: 6,
    name: "Pharmacy",
    code: "PHARM",
    head: "Mr. Amit Sharma",
    staffCount: 8,
    location: "Main Hospital",
    isActive: true,
  },
]



const mockLocations = [
  {
    id: 1,
    name: "Pranam Main Hospital",
    code: "PMH001",
    address: "123 Medical Street, Mumbai",
    phone: "+91-22-12345678",
    email: "main@pranamhms.com",
    isMainBranch: true,
    isActive: true,
  },
  {
    id: 2,
    name: "Pranam Branch - Andheri",
    code: "PMH002",
    address: "456 Health Avenue, Andheri, Mumbai",
    phone: "+91-22-87654321",
    email: "andheri@pranamhms.com",
    isMainBranch: false,
    isActive: true,
  },
  {
    id: 3,
    name: "Pranam Branch - Pune",
    code: "PMH003",
    address: "789 Care Road, Pune",
    phone: "+91-20-11223344",
    email: "pune@pranamhms.com",
    isMainBranch: false,
    isActive: true,
  },
]

const mockAuditLogs = [
  {
    id: 1,
    user: "Dr. Rajesh Kumar",
    action: "Login",
    details: "Successful login",
    timestamp: "2024-01-10 09:30:15",
    ipAddress: "192.168.1.100",
    success: true,
  },
  {
    id: 2,
    user: "Sister Mary Joseph",
    action: "Update Patient",
    details: "Updated patient P001234 vitals",
    timestamp: "2024-01-10 09:25:30",
    ipAddress: "192.168.1.101",
    success: true,
  },
  {
    id: 3,
    user: "Mr. Amit Sharma",
    action: "Create Prescription",
    details: "Created prescription PR001567",
    timestamp: "2024-01-10 09:20:45",
    ipAddress: "192.168.1.102",
    success: true,
  },
  {
    id: 4,
    user: "Admin User",
    action: "System Settings",
    details: "Updated notification settings",
    timestamp: "2024-01-10 09:15:00",
    ipAddress: "192.168.1.103",
    success: true,
  },
  {
    id: 5,
    user: "Unknown User",
    action: "Failed Login",
    details: "Invalid credentials for user: test@example.com",
    timestamp: "2024-01-10 09:10:30",
    ipAddress: "192.168.1.104",
    success: false,
  },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("users")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const [selectedRole, setSelectedRole] = useState<any>(null)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [isNewRole, setIsNewRole] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false)
  const [isNewDepartment, setIsNewDepartment] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false)
  const [isNewLocation, setIsNewLocation] = useState(false)
  const [locationErrors, setLocationErrors] = useState<any>({})
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [locations, setLocations] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [modules, setModules] = useState<any[]>([])
  const [rolePermissions, setRolePermissions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [pageSize] = useState(5)
  const [selectedBranchId, setSelectedBranchId] = useState(authService.getSelectedBranchId())
  const [userErrors, setUserErrors] = useState<any>({})
  const [departmentErrors, setDepartmentErrors] = useState<any>({})
  const [isRoleViewMode, setIsRoleViewMode] = useState(false)

  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    general: {
      hospitalName: "Pranam Hospital Management System",
      timezone: "Asia/Kolkata",
      currency: "INR",
      dateFormat: "DD/MM/YYYY",
    },
    security: {
      passwordMinLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSymbols: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      enable2FA: false,
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      emailFrom: "noreply@pranamhms.com",
    },
    system: {
      maintenanceMode: false,
      backupFrequency: "daily",
      maxFileUploadSize: 10,
      enableAuditLogs: true,
    },
  })

  const fetchUsers = useCallback(async (page: number = 1) => {
    try {
      setLoading(true)
      const selectedBranchId = authService.getSelectedBranchId()
      //alert(selectedBranchId);
      const locationId = selectedBranchId ? parseInt(selectedBranchId) : undefined
      const data = await settingsApi.getUsers(locationId, page, pageSize)
      console.log('API Response:', data)
      if (Array.isArray(data)) {
        // Direct array response
        setUsers(data)
        setTotalPages(1)
        setTotalUsers(data.length)
        setCurrentPage(page)
      } else {
        // Paginated response
        setUsers(data.users || [])
        setTotalPages(data.totalPages || 1)
        setTotalUsers(data.total || 0)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [pageSize])

  const searchUsers = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      fetchUsers(1)
      return
    }
    try {
      setLoading(true)
      const selectedBranchId = authService.getSelectedBranchId()
      const locationId = selectedBranchId ? parseInt(selectedBranchId) : undefined
      const data = await settingsApi.searchUsers(searchTerm, locationId)
      setUsers(data)
      setTotalPages(1)
      setTotalUsers(data.length)
      setCurrentPage(1)
    } catch (error) {
      console.error('Error searching users:', error)
      toast({
        title: "Error",
        description: "Failed to search users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [fetchUsers])

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true)
      const selectedBranchId = authService.getSelectedBranchId()
      const locationId = selectedBranchId ? parseInt(selectedBranchId) : undefined
      const data = await settingsApi.getRoles(locationId)
      
      // Ensure data is always an array
      setRoles(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching roles:', error)
      // Set empty array on error to prevent map error
      setRoles([])
      toast({
        title: "Error",
        description: "Failed to fetch roles. Settings service may not be running.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchLocations = useCallback(async () => {
    try {
      const selectedBranchId = authService.getSelectedBranchId()
      const locationId = selectedBranchId ? parseInt(selectedBranchId) : undefined
      const data = await settingsApi.getLocations(locationId)
      setLocations(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching locations:', error)
      setLocations([])
      toast({
        title: "Error",
        description: "Failed to fetch locations",
        variant: "destructive",
      })
    }
  }, [])

  const fetchDepartments = useCallback(async () => {
    try {
      const selectedBranchId = authService.getSelectedBranchId()
      
      if (!selectedBranchId) {
        setDepartments([])
        return
      }

      const data = await settingsApi.getDepartmentsByLocation(parseInt(selectedBranchId))
      setDepartments(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching departments:', error)
      setDepartments([])
      toast({
        title: "Error",
        description: "Failed to fetch departments",
        variant: "destructive",
      })
    }
  }, [])

  const fetchModules = useCallback(async () => {
    try {
      const selectedBranchId = authService.getSelectedBranchId()
      const locationId = selectedBranchId ? parseInt(selectedBranchId) : undefined
      const data = await settingsApi.getModules(locationId)
      
      // Convert string IDs to numbers for compatibility
      const processedData = Array.isArray(data) ? data.map(module => ({
        ...module,
        id: parseInt(module.id),
        subModules: module.subModules ? module.subModules.map(sub => ({
          ...sub,
          id: parseInt(sub.id),
          moduleId: parseInt(sub.moduleId)
        })) : []
      })) : []
      
      console.log('Processed modules:', processedData.length)
      setModules(processedData)
    } catch (error) {
      console.error('Error fetching modules:', error)
      setModules([])
    }
  }, [])

  useEffect(() => {
    fetchUsers(currentPage)
    fetchLocations()
    fetchDepartments()
    fetchModules()
  }, [])

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        searchUsers(searchTerm)
      } else {
        setCurrentPage(1)
        fetchUsers(1)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, searchUsers, fetchUsers])

  useEffect(() => {
    if (users.length > 0) {
      fetchRoles()
    }
  }, [users, fetchRoles])

  useEffect(() => {
    if (activeTab === 'roles') {
      fetchRoles()
    } else if (activeTab === 'users') {
      fetchUsers(currentPage)
    } else if (activeTab === 'departments') {
      fetchDepartments()
    }
  }, [activeTab, fetchRoles, fetchUsers, fetchDepartments, currentPage])

  useEffect(() => {
    const handleStorageChange = () => {
      const currentBranchId = authService.getSelectedBranchId()
      if (currentBranchId !== selectedBranchId) {
        setSelectedBranchId(currentBranchId)
        const resetPage = 1
        setCurrentPage(resetPage)
        fetchUsers(resetPage)
        fetchRoles()
        fetchDepartments()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    const interval = setInterval(() => {
      const currentBranchId = authService.getSelectedBranchId()
      if (currentBranchId !== selectedBranchId) {
        setSelectedBranchId(currentBranchId)
        const resetPage = 1
        setCurrentPage(resetPage)
        fetchUsers(resetPage)
        fetchRoles()
        fetchDepartments()
      }
    }, 500)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [selectedBranchId, fetchUsers, fetchRoles, fetchDepartments])

  const validateUserForm = () => {
    const errors: any = {}
    
    if (!selectedUser?.username?.trim()) {
      errors.username = 'Username is required'
    }
    if (!selectedUser?.firstName?.trim()) {
      errors.firstName = 'First name is required'
    }
    if (!selectedUser?.lastName?.trim()) {
      errors.lastName = 'Last name is required'
    }
    if (isNewUser && !selectedUser?.password?.trim()) {
      errors.password = 'Password is required'
    }
    if (isNewUser && selectedUser?.password && selectedUser.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }
    if (!selectedUser?.roleId || selectedUser.roleId === 0) {
      errors.roleId = 'Role is required'
    }
    if (!selectedUser?.departmentId) {
      errors.departmentId = 'Department is required'
    }
    if (!selectedUser?.email?.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(selectedUser.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    setUserErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleUserSave = async () => {
    if (!validateUserForm()) {
      return
    }
    
    try {
      setLoading(true)
      console.log('Saving user data:', selectedUser)
      if (isNewUser) {
        await settingsApi.createUser(selectedUser)
      } else {
        await settingsApi.updateUser(selectedUser.id, selectedUser)
      }
      toast({
        title: isNewUser ? "User Created" : "User Updated",
        description: `User ${selectedUser?.firstName} ${selectedUser?.lastName} has been ${isNewUser ? "created" : "updated"} successfully.`,
      })
      setIsUserDialogOpen(false)
      setSelectedUser(null)
      setUserErrors({})
      fetchUsers(currentPage)
    } catch (error: any) {
      console.error('Error saving user:', error)
      const errorMessage = error?.response?.data?.message || error?.message || `Failed to ${isNewUser ? "create" : "update"} user`
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUserDelete = async (userId: number) => {
    try {
      setLoading(true)
      await settingsApi.deleteUser(userId)
      toast({
        title: "User Deleted",
        description: "User has been deleted successfully.",
        variant: "destructive",
      })
      fetchUsers(currentPage)
    } catch (error) {
      console.error('Error deleting user:', error)
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleUserStatus = async (userId: number) => {
    try {
      setLoading(true)
      await settingsApi.toggleUserStatus(userId)
      toast({
        title: "Status Updated",
        description: "User status has been updated successfully.",
      })
      fetchUsers(currentPage)
    } catch (error) {
      console.error('Error toggling user status:', error)
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSettingsSave = () => {
    toast({
      title: "Settings Saved",
      description: "System settings have been updated successfully.",
    })
  }

  const handleRoleSave = async () => {
    try {
      setLoading(true)
      if (isNewRole) {
        const newRole = await settingsApi.createRole(selectedRole)
        // Update permissions for new role
        if (rolePermissions.length > 0) {
          const permissionsToSave = rolePermissions.map(p => ({
            ...p,
            roleId: newRole.id
          }))
          await settingsApi.updateRolePermissions(newRole.id, permissionsToSave)
        }
      } else {
        // Only send role fields that the backend expects
        const roleData = {
          name: selectedRole.name,
          locationId: selectedRole.locationId,
          isActive: selectedRole.isActive
        }
        await settingsApi.updateRole(selectedRole.id, roleData)
        // Update permissions
        await settingsApi.updateRolePermissions(selectedRole.id, rolePermissions)
      }
      toast({
        title: isNewRole ? "Role Created" : "Role Updated",
        description: `Role ${selectedRole?.name} has been ${isNewRole ? "created" : "updated"} successfully.`,
      })
      setIsRoleDialogOpen(false)
      setSelectedRole(null)
      setRolePermissions([])
      // Refetch users first to get updated user count, then fetch roles
      await fetchUsers(currentPage)
      await fetchRoles()
    } catch (error) {
      console.error('Error saving role:', error)
      toast({
        title: "Error",
        description: `Failed to ${isNewRole ? "create" : "update"} role`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRoleDelete = async (roleId: number) => {
    try {
      setLoading(true)
      await settingsApi.updateRole(roleId, { isActive: 0 })
      toast({
        title: "Role Deactivated",
        description: "Role has been deactivated successfully.",
        variant: "destructive",
      })
      fetchRoles()
    } catch (error) {
      console.error('Error deactivating role:', error)
      toast({
        title: "Error",
        description: "Failed to deactivate role",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const validateDepartmentForm = () => {
    const errors: any = {}
    
    if (!selectedDepartment?.name?.trim()) {
      errors.name = 'Department name is required'
    }
    
    setDepartmentErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleDepartmentSave = async () => {
    if (!validateDepartmentForm()) {
      return
    }
    
    try {
      setLoading(true)
      const token = authService.getCurrentToken()
      const apiUrl = authService.getApiUrl()
      
      if (!token) return

      const url = isNewDepartment 
        ? `${apiUrl}settings/departments`
        : `${apiUrl}settings/departments/${selectedDepartment.id}`
      
      const method = isNewDepartment ? 'POST' : 'PATCH'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedDepartment)
      })

      if (response.ok) {
        toast({
          title: isNewDepartment ? "Department Created" : "Department Updated",
          description: `Department ${selectedDepartment?.name} has been ${isNewDepartment ? "created" : "updated"} successfully.`,
        })
        setIsDepartmentDialogOpen(false)
        setSelectedDepartment(null)
        setDepartmentErrors({})
        fetchDepartments()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to save department')
      }
    } catch (error: any) {
      console.error('Error saving department:', error)
      const errorMessage = error?.message || `Failed to ${isNewDepartment ? "create" : "update"} department`
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDepartmentDelete = (departmentId: number) => {
    toast({
      title: "Department Deleted",
      description: "Department has been deleted successfully.",
      variant: "destructive",
    })
    fetchDepartments()
  }

  const validateLocationForm = () => {
    const errors: any = {}
    
    if (!selectedLocation?.locationCode?.trim()) {
      errors.locationCode = 'Location code is required'
    }
    if (!selectedLocation?.name?.trim()) {
      errors.name = 'Location name is required'
    }
    if (!selectedLocation?.address?.trim()) {
      errors.address = 'Address is required'
    }
    if (!selectedLocation?.phone?.trim()) {
      errors.phone = 'Phone is required'
    }
    if (selectedLocation?.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(selectedLocation.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    setLocationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleLocationSave = async () => {
    if (!validateLocationForm()) {
      return
    }
    
    try {
      setLoading(true)
      const token = authService.getCurrentToken()
      const apiUrl = authService.getApiUrl()
      
      if (!token) return

      const url = isNewLocation 
        ? `${apiUrl}locations`
        : `${apiUrl}locations/${selectedLocation.id}`
      
      const method = isNewLocation ? 'POST' : 'PATCH'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedLocation)
      })

      if (response.ok) {
        toast({
          title: isNewLocation ? "Location Created" : "Location Updated",
          description: `Location ${selectedLocation?.name} has been ${isNewLocation ? "created" : "updated"} successfully.`,
        })
        setIsLocationDialogOpen(false)
        setSelectedLocation(null)
        fetchLocations()
      } else if (response.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Please login again",
          variant: "destructive",
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to save location')
      }
    } catch (error) {
      console.error('Error saving location:', error)
      toast({
        title: "Error",
        description: `Failed to ${isNewLocation ? "create" : "update"} location`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLocationDelete = async (locationId: number) => {
    try {
      setLoading(true)
      const token = authService.getCurrentToken()
      const apiUrl = authService.getApiUrl()
      
      if (!token) return

      const response = await fetch(`${apiUrl}locations/${locationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        toast({
          title: "Location Deleted",
          description: "Location has been deleted successfully.",
          variant: "destructive",
        })
        fetchLocations()
      } else {
        throw new Error('Failed to delete location')
      }
    } catch (error) {
      console.error('Error deleting location:', error)
      toast({
        title: "Error",
        description: "Failed to delete location",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users || []

  return (
    <PrivateRoute modulePath="admin/settings" action="view">
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage system settings, users, and permissions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-red-600 border-red-200">
            <Crown className="h-3 w-3 mr-1" />
            Admin Access
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span>Departments</span>
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Roles</span>
          </TabsTrigger>
          <TabsTrigger value="locations" className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span>Locations</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <SettingsIcon className="h-4 w-4" />
            <span>System</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Audit Logs</span>
          </TabsTrigger>
        </TabsList>

        {/* Users Management Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>User Management</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedUser({
                        username: "",
                        firstName: "",
                        lastName: "",
                        email: "",
                        phone: "",
                        password: "",
                        roleId: 0,
                        departmentId: 0,
                        locationId: "",
                        userType: 'staff',
                        isActive: true,
                      })
                      setUserErrors({})
                      setIsNewUser(true)
                      setIsUserDialogOpen(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users by name, email, or employee ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              {/* Users Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center">
                            Loading users...
                          </td>
                        </tr>
                      ) : filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback>
                                    {user.firstName[0]}
                                    {user.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {user.firstName} {user.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500">{user.email}</div>
                                  <div className="text-xs text-gray-400">Username: {user.username}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{user.departmentName || '-'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="secondary">{user.roleName || 'No Role'}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.locationNames || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                {user.isActive ? (
                                  <Badge variant="default" className="bg-green-100 text-green-800">
                                    <UserCheck className="h-3 w-3 mr-1" />
                                    Active
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                                    <UserX className="h-3 w-3 mr-1" />
                                    Inactive
                                  </Badge>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleUserStatus(user.id)}
                                  disabled={loading}
                                >
                                  {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                                </Button>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={async () => {
                                    try {
                                      // Fetch full user data including user_info
                                      const fullUserData = await settingsApi.getUser(user.id)
                                      console.log('Full user data:', fullUserData)
                                      setSelectedUser({
                                        ...fullUserData,
                                        departmentId: fullUserData.departmentId || null,
                                        userType: fullUserData.userType || 'staff'
                                      })
                                      setUserErrors({})
                                      setIsNewUser(false)
                                      setIsUserDialogOpen(true)
                                    } catch (error) {
                                      console.error('Error fetching user data:', error)
                                      // Fallback to existing data
                                      setSelectedUser({
                                        ...user,
                                        departmentId: user.departmentId || null,
                                        userType: user.userType || 'staff'
                                      })
                                      setUserErrors({})
                                      setIsNewUser(false)
                                      setIsUserDialogOpen(true)
                                    }
                                  }}
                                  disabled={loading}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" disabled={loading}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete User</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete {user.firstName} {user.lastName}? This action
                                        cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleUserDelete(user.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Pagination */}
              {!searchTerm.trim() && totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalUsers)} of {totalUsers} users
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchUsers(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => fetchUsers(page)}
                        disabled={loading}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchUsers(currentPage + 1)}
                      disabled={currentPage === totalPages || loading}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Search Results Info */}
              {searchTerm.trim() && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Found {totalUsers} users matching "{searchTerm}"
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('')
                      setCurrentPage(1)
                      fetchUsers(1)
                    }}
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Departments Management Tab */}
        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Department Management</span>
                </CardTitle>
                <Button
                  onClick={() => {
                    setSelectedDepartment({
                      name: "",
                      description: "",
                      headOfDepartment: "",
                      locationId: parseInt(authService.getSelectedBranchId() || "1"),
                      isActive: true,
                    })
                    setDepartmentErrors({})
                    setIsNewDepartment(true)
                    setIsDepartmentDialogOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Department
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(departments || []).map((dept) => (
                  <Card key={dept.id} className="border-l-4 border-l-red-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{dept.name}</CardTitle>
                          <p className="text-sm text-gray-500">{dept.description || 'No description'}</p>
                        </div>
                        <Badge variant={dept.isActive ? "default" : "secondary"}>
                          {dept.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {dept.headOfDepartment && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Crown className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">Head:</span>
                          <span>{dept.headOfDepartment}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">Staff:</span>
                        <span>{dept.staffCount || 0} members</span>
                      </div>
                      {/* <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-green-500" />
                        <span className="font-medium">Location:</span>
                        <span>{dept.location}</span>
                      </div> */}
                      <div className="flex items-center space-x-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 bg-transparent"
                          onClick={() => {
                            setSelectedDepartment({
                              id: dept.id,
                              name: dept.name,
                              description: dept.description,
                              headOfDepartment: dept.headOfDepartment,
                              locationId: dept.locationId,
                              isActive: dept.isActive
                            })
                            setDepartmentErrors({})
                            setIsNewDepartment(false)
                            setIsDepartmentDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Department</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {dept.name}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDepartmentDelete(dept.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {departments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No departments found for your location.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles & Permissions Tab */}
        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Role & Permission Management</span>
                </CardTitle>
                <Button
                  onClick={async () => {
                    setSelectedRole({
                      name: "",
                      locationId: parseInt(authService.getSelectedBranchId() || "1"),
                      isActive: 1
                    })
                    setRolePermissions([])
                    setIsNewRole(true)
                    setIsRoleViewMode(false)
                    // Load fresh modules for new role
                    try {
                      const freshModules = await settingsApi.getModules()
                      console.log('Loaded modules for new role:', freshModules.length)
                      setModules(freshModules)
                    } catch (error) {
                      console.error('Error loading modules:', error)
                    }
                    setIsRoleDialogOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Role
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading roles...
                  </div>
                ) : roles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No roles found for your location.
                  </div>
                ) : (
                  (roles || []).map((role) => (
                    <Card key={role.id} className="border">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-semibold">{role.name}</h3>
                              {role.code && <Badge variant="outline">{role.code}</Badge>}
                              <Badge variant="secondary">{role.userCount || 0} users</Badge>
                              <Badge variant={role.isActive === 1 || role.isActive === "1" ? "default" : "secondary"}>
                                {role.isActive === 1 || role.isActive === "1" ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            {/* <p className="text-sm text-gray-600 mt-1">Department: {role.department || 'N/A'}</p> */}
                            {role.description && (
                              <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                            )}
                            <div className="mt-3">
                              <p className="text-sm font-medium text-gray-700 mb-2">Modules:</p>
                              <div className="flex flex-wrap gap-2">
                                {(role.modules || []).length > 0 ? (
                                  role.modules.map((module, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {module}
                                    </Badge>
                                  ))
                                ) : (
                                  <Badge variant="outline" className="text-xs text-gray-400">
                                    No modules assigned
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={async () => {
                                console.log('Viewing role:', role)
                                setSelectedRole(role)
                                setIsNewRole(false)
                                setIsRoleViewMode(true)
                                try {
                                  const modulesWithPermissions = await settingsApi.getModulesWithPermissions(role.id)
                                  console.log('Loaded modules with permissions for view:', modulesWithPermissions)
                                  
                                  // Extract permissions from modules with permissions data
                                  const extractedPermissions = []
                                  modulesWithPermissions.forEach(module => {
                                    if (module.subModules && module.subModules.length > 0) {
                                      module.subModules.forEach(submodule => {
                                        if (submodule.permissions && (submodule.permissions.add || submodule.permissions.edit || submodule.permissions.delete || submodule.permissions.view)) {
                                          extractedPermissions.push({
                                            roleId: role.id,
                                            moduleId: module.id,
                                            subModuleId: submodule.id,
                                            add: submodule.permissions.add ? 1 : 0,
                                            edit: submodule.permissions.edit ? 1 : 0,
                                            delete: submodule.permissions.delete ? 1 : 0,
                                            view: submodule.permissions.view ? 1 : 0
                                          })
                                        }
                                      })
                                    }
                                    if (module.permissions && (module.permissions.add || module.permissions.edit || module.permissions.delete || module.permissions.view)) {
                                      extractedPermissions.push({
                                        roleId: role.id,
                                        moduleId: module.id,
                                        subModuleId: null,
                                        add: module.permissions.add ? 1 : 0,
                                        edit: module.permissions.edit ? 1 : 0,
                                        delete: module.permissions.delete ? 1 : 0,
                                        view: module.permissions.view ? 1 : 0
                                      })
                                    }
                                  })
                                  
                                  setModules(modulesWithPermissions)
                                  setRolePermissions(extractedPermissions)
                                  console.log('Extracted permissions for view:', extractedPermissions.length)
                                } catch (error) {
                                  console.error('Error loading role permissions for view:', error)
                                }
                                setIsRoleDialogOpen(true)
                              }}
                              disabled={loading}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={async () => {
                                console.log('Editing role:', role)
                                setSelectedRole(role)
                                setIsNewRole(false)
                                setIsRoleViewMode(false)
                                try {
                                  const modulesWithPermissions = await settingsApi.getModulesWithPermissions(role.id)
                                  console.log('Loaded modules with permissions:', modulesWithPermissions)
                                  
                                  // Extract permissions from modules with permissions data
                                  const extractedPermissions = []
                                  modulesWithPermissions.forEach(module => {
                                    if (module.subModules && module.subModules.length > 0) {
                                      module.subModules.forEach(submodule => {
                                        extractedPermissions.push({
                                          roleId: role.id,
                                          moduleId: module.id,
                                          subModuleId: submodule.id,
                                          add: submodule.permissions?.add === true || submodule.permissions?.add === 1 ? 1 : 0,
                                          edit: submodule.permissions?.edit === true || submodule.permissions?.edit === 1 ? 1 : 0,
                                          delete: submodule.permissions?.delete === true || submodule.permissions?.delete === 1 ? 1 : 0,
                                          view: submodule.permissions?.view === true || submodule.permissions?.view === 1 ? 1 : 0
                                        })
                                      })
                                    } else {
                                      extractedPermissions.push({
                                        roleId: role.id,
                                        moduleId: module.id,
                                        subModuleId: null,
                                        add: module.permissions?.add === true || module.permissions?.add === 1 ? 1 : 0,
                                        edit: module.permissions?.edit === true || module.permissions?.edit === 1 ? 1 : 0,
                                        delete: module.permissions?.delete === true || module.permissions?.delete === 1 ? 1 : 0,
                                        view: module.permissions?.view === true || module.permissions?.view === 1 ? 1 : 0
                                      })
                                    }
                                  })
                                  
                                  setModules(modulesWithPermissions)
                                  setRolePermissions(extractedPermissions)
                                  console.log('Extracted permissions:', extractedPermissions.length)
                                } catch (error) {
                                  console.error('Error loading role permissions:', error)
                                }
                                setIsRoleDialogOpen(true)
                              }}
                              disabled={loading}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 bg-transparent"
                                  disabled={loading}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Deactivate Role</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to deactivate the role "{role.name}"? This will make the role inactive and affect {role.userCount || 0} users.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleRoleDelete(role.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={loading}
                                  >
                                    Deactivate
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Management Tab */}
        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Location Management</span>
                </CardTitle>
                <Button
                  onClick={() => {
                    setSelectedLocation({
                      locationCode: "",
                      name: "",
                      address: "",
                      phone: "",
                      email: "",
                      isActive: true,
                    })
                    setIsNewLocation(true)
                    setIsLocationDialogOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(locations || []).map((location) => (
                  <Card
                    key={location.id}
                    className={`border ${location.isMainBranch ? "border-l-4 border-l-yellow-500" : ""}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold">{location.name}</h3>
                            <Badge variant="outline">{location.locationCode}</Badge>
                            {/* {location.isMainBranch && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Crown className="h-3 w-3 mr-1" />
                                Main Branch
                              </Badge>
                            )} */}
                            <Badge variant={location.isActive ? "default" : "secondary"}>
                              {location.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center space-x-2 text-sm">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>{location.address}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2 text-sm">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span>{location.phone}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-sm">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span>{location.email}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedLocation({
                                id: location.id,
                                locationCode: location.locationCode,
                                name: location.name,
                                address: location.address,
                                phone: location.phone,
                                email: location.email,
                                isActive: location.isActive
                              })
                              setIsNewLocation(false)
                              setIsLocationDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 bg-transparent"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Location</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {location.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleLocationDelete(location.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hospitalName">Hospital Name</Label>
                  <Input
                    id="hospitalName"
                    value={systemSettings.general.hospitalName}
                    onChange={(e) =>
                      setSystemSettings((prev) => ({
                        ...prev,
                        general: { ...prev.general, hospitalName: e.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={systemSettings.general.timezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={systemSettings.general.currency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={systemSettings.general.dateFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={systemSettings.security.passwordMinLength}
                    onChange={(e) =>
                      setSystemSettings((prev) => ({
                        ...prev,
                        security: { ...prev.security, passwordMinLength: Number.parseInt(e.target.value) },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireUppercase">Require Uppercase Letters</Label>
                  <Switch
                    id="requireUppercase"
                    checked={systemSettings.security.requireUppercase}
                    onCheckedChange={(checked) =>
                      setSystemSettings((prev) => ({
                        ...prev,
                        security: { ...prev.security, requireUppercase: checked },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireNumbers">Require Numbers</Label>
                  <Switch
                    id="requireNumbers"
                    checked={systemSettings.security.requireNumbers}
                    onCheckedChange={(checked) =>
                      setSystemSettings((prev) => ({
                        ...prev,
                        security: { ...prev.security, requireNumbers: checked },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable2FA">Enable Two-Factor Authentication</Label>
                  <Switch
                    id="enable2FA"
                    checked={systemSettings.security.enable2FA}
                    onCheckedChange={(checked) =>
                      setSystemSettings((prev) => ({
                        ...prev,
                        security: { ...prev.security, enable2FA: checked },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={systemSettings.security.sessionTimeout}
                    onChange={(e) =>
                      setSystemSettings((prev) => ({
                        ...prev,
                        security: { ...prev.security, sessionTimeout: Number.parseInt(e.target.value) },
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailEnabled">Email Notifications</Label>
                  <Switch
                    id="emailEnabled"
                    checked={systemSettings.notifications.emailEnabled}
                    onCheckedChange={(checked) =>
                      setSystemSettings((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, emailEnabled: checked },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="smsEnabled">SMS Notifications</Label>
                  <Switch
                    id="smsEnabled"
                    checked={systemSettings.notifications.smsEnabled}
                    onCheckedChange={(checked) =>
                      setSystemSettings((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, smsEnabled: checked },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="pushEnabled">Push Notifications</Label>
                  <Switch
                    id="pushEnabled"
                    checked={systemSettings.notifications.pushEnabled}
                    onCheckedChange={(checked) =>
                      setSystemSettings((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, pushEnabled: checked },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailFrom">Default Email Sender</Label>
                  <Input
                    id="emailFrom"
                    type="email"
                    value={systemSettings.notifications.emailFrom}
                    onChange={(e) =>
                      setSystemSettings((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, emailFrom: e.target.value },
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* System Settings */}
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <Switch
                    id="maintenanceMode"
                    checked={systemSettings.system.maintenanceMode}
                    onCheckedChange={(checked) =>
                      setSystemSettings((prev) => ({
                        ...prev,
                        system: { ...prev.system, maintenanceMode: checked },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select value={systemSettings.system.backupFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxFileUploadSize">Max File Upload Size (MB)</Label>
                  <Input
                    id="maxFileUploadSize"
                    type="number"
                    value={systemSettings.system.maxFileUploadSize}
                    onChange={(e) =>
                      setSystemSettings((prev) => ({
                        ...prev,
                        system: { ...prev.system, maxFileUploadSize: Number.parseInt(e.target.value) },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="enableAuditLogs">Enable Audit Logs</Label>
                  <Switch
                    id="enableAuditLogs"
                    checked={systemSettings.system.enableAuditLogs}
                    onCheckedChange={(checked) =>
                      setSystemSettings((prev) => ({
                        ...prev,
                        system: { ...prev.system, enableAuditLogs: checked },
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSettingsSave} className="bg-red-600 hover:bg-red-700">
              Save Settings
            </Button>
          </div>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Audit Logs</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Logs
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Timestamp
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          IP Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockAuditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{log.user}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant="outline">{log.action}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">{log.details}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-2" />
                              {log.timestamp}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ipAddress}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {log.success ? (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                <Check className="h-3 w-3 mr-1" />
                                Success
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="bg-red-100 text-red-800">
                                <X className="h-3 w-3 mr-1" />
                                Failed
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isNewUser ? "Add New User" : "Edit User"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Registered as <span className="text-red-500">*</span></Label>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="doctor"
                      name="userType"
                      value="doctor"
                      checked={selectedUser?.userType === 'doctor'}
                      onChange={(e) => setSelectedUser((prev) => ({ ...prev, userType: e.target.value as 'doctor' | 'staff' }))}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="doctor" className="text-sm font-medium">Doctor</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="staff"
                      name="userType"
                      value="staff"
                      checked={selectedUser?.userType === 'staff'}
                      onChange={(e) => setSelectedUser((prev) => ({ ...prev, userType: e.target.value as 'doctor' | 'staff' }))}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="staff" className="text-sm font-medium">Staff</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username <span className="text-red-500">*</span></Label>
              <Input
                id="username"
                value={selectedUser?.username || ""}
                onChange={(e) => {
                  setSelectedUser((prev) => ({ ...prev, username: e.target.value }))
                  if (userErrors.username) {
                    setUserErrors((prev) => ({ ...prev, username: null }))
                  }
                }}
                className={userErrors.username ? "border-red-500" : ""}
                placeholder="Enter username"
              />
              {userErrors.username && (
                <p className="text-sm text-red-500">{userErrors.username}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                <Input
                  id="firstName"
                  value={selectedUser?.firstName || ""}
                  onChange={(e) => {
                    setSelectedUser((prev) => ({ ...prev, firstName: e.target.value }))
                    if (userErrors.firstName) {
                      setUserErrors((prev) => ({ ...prev, firstName: null }))
                    }
                  }}
                  className={userErrors.firstName ? "border-red-500" : ""}
                  placeholder="Enter first name"
                />
                {userErrors.firstName && (
                  <p className="text-sm text-red-500">{userErrors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                <Input
                  id="lastName"
                  value={selectedUser?.lastName || ""}
                  onChange={(e) => {
                    setSelectedUser((prev) => ({ ...prev, lastName: e.target.value }))
                    if (userErrors.lastName) {
                      setUserErrors((prev) => ({ ...prev, lastName: null }))
                    }
                  }}
                  className={userErrors.lastName ? "border-red-500" : ""}
                  placeholder="Enter last name"
                />
                {userErrors.lastName && (
                  <p className="text-sm text-red-500">{userErrors.lastName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  value={selectedUser?.email || ""}
                  onChange={(e) => {
                    setSelectedUser((prev) => ({ ...prev, email: e.target.value }))
                    if (userErrors.email) {
                      setUserErrors((prev) => ({ ...prev, email: null }))
                    }
                  }}
                  className={userErrors.email ? "border-red-500" : ""}
                  placeholder="Enter email"
                />
                {userErrors.email && (
                  <p className="text-sm text-red-500">{userErrors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={selectedUser?.phone || ""}
                  onChange={(e) => setSelectedUser((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number (optional)"
                />
              </div>
            </div>



            {selectedUser?.userType === 'doctor' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="alternatePhone">Alternate Phone</Label>
                    <Input
                      id="alternatePhone"
                      value={selectedUser?.alternatePhone || ""}
                      onChange={(e) => setSelectedUser((prev) => ({ ...prev, alternatePhone: e.target.value }))}
                      placeholder="Enter alternate phone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qualification">Qualification</Label>
                    <Input
                      id="qualification"
                      value={selectedUser?.qualification || ""}
                      onChange={(e) => setSelectedUser((prev) => ({ ...prev, qualification: e.target.value }))}
                      placeholder="Enter qualification"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                    <Input
                      id="yearsOfExperience"
                      type="number"
                      value={selectedUser?.yearsOfExperience || ""}
                      onChange={(e) => setSelectedUser((prev) => ({ ...prev, yearsOfExperience: parseInt(e.target.value) || 0 }))}
                      placeholder="Enter years of experience"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicalRegistrationNumber">Medical Registration Number</Label>
                    <Input
                      id="medicalRegistrationNumber"
                      value={selectedUser?.medicalRegistrationNumber || ""}
                      onChange={(e) => setSelectedUser((prev) => ({ ...prev, medicalRegistrationNumber: e.target.value }))}
                      placeholder="Enter registration number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="registrationCouncil">Registration Council</Label>
                    <Select 
                      value={selectedUser?.registrationCouncil || ""}
                      onValueChange={(value) => setSelectedUser((prev) => ({ ...prev, registrationCouncil: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select council" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MCI">Medical Council of India</SelectItem>
                        <SelectItem value="NMC">National Medical Commission</SelectItem>
                        <SelectItem value="State">State Medical Council</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationValidUntil">Registration Valid Until</Label>
                    <Input
                      id="registrationValidUntil"
                      type="date"
                      value={selectedUser?.registrationValidUntil || ""}
                      onChange={(e) => setSelectedUser((prev) => ({ ...prev, registrationValidUntil: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseCopy">Upload License Copy</Label>
                    <Input
                      id="licenseCopy"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setSelectedUser((prev) => ({ ...prev, licenseCopy: file.name }))
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="degreeCertificates">Upload Degree Certificates</Label>
                    <Input
                      id="degreeCertificates"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files
                        if (files && files.length > 0) {
                          const fileNames = Array.from(files).map(f => f.name).join(', ')
                          setSelectedUser((prev) => ({ ...prev, degreeCertificates: fileNames }))
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employmentType">Employment Type</Label>
                    <Select 
                      value={selectedUser?.employmentType || ""}
                      onValueChange={(value) => setSelectedUser((prev) => ({ ...prev, employmentType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="part-time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="consultant">Consultant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joiningDate">Joining Date</Label>
                    <Input
                      id="joiningDate"
                      type="date"
                      value={selectedUser?.joiningDate || ""}
                      onChange={(e) => setSelectedUser((prev) => ({ ...prev, joiningDate: e.target.value }))}
                    />
                  </div>
                </div>
              </>
            )}

            {isNewUser && (
              <div className="space-y-2">
                <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                <Input
                  id="password"
                  type="password"
                  value={selectedUser?.password || ""}
                  onChange={(e) => {
                    setSelectedUser((prev) => ({ ...prev, password: e.target.value }))
                    if (userErrors.password) {
                      setUserErrors((prev) => ({ ...prev, password: null }))
                    }
                  }}
                  className={userErrors.password ? "border-red-500" : ""}
                  placeholder="Enter password (min 6 characters)"
                />
                {userErrors.password && (
                  <p className="text-sm text-red-500">{userErrors.password}</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role <span className="text-red-500">*</span></Label>
                <Select 
                  value={selectedUser?.roleId && selectedUser.roleId > 0 ? selectedUser.roleId.toString() : ""}
                  onValueChange={(value) => {
                    setSelectedUser((prev) => ({ ...prev, roleId: parseInt(value) }))
                    if (userErrors.roleId) {
                      setUserErrors((prev) => ({ ...prev, roleId: null }))
                    }
                  }}
                >
                  <SelectTrigger className={`${userErrors.roleId ? "border-red-500" : ""} w-full`}>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {(roles || []).map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {userErrors.roleId && (
                  <p className="text-sm text-red-500">{userErrors.roleId}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
                <Select 
                  value={selectedUser?.departmentId ? selectedUser.departmentId.toString() : ""}
                  onValueChange={(value) => {
                    setSelectedUser((prev) => ({ ...prev, departmentId: parseInt(value) }))
                    if (userErrors.departmentId) {
                      setUserErrors((prev) => ({ ...prev, departmentId: null }))
                    }
                  }}
                >
                  <SelectTrigger className={`${userErrors.departmentId ? "border-red-500" : ""} w-full`}>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {(departments || []).map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {userErrors.departmentId && (
                  <p className="text-sm text-red-500">{userErrors.departmentId}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={selectedUser?.pincode || ""}
                  onChange={(e) => setSelectedUser((prev) => ({ ...prev, pincode: e.target.value }))}
                  placeholder="Enter pincode"
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={selectedUser?.address || ""}
                onChange={(e) => setSelectedUser((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Enter address"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Locations</Label>
              <div className="border rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto">
                {(locations || []).map((location) => {
                  const userLocationIds = selectedUser?.locationId ? selectedUser.locationId.toString().split(',').map(id => parseInt(id.trim())) : [];
                  const isChecked = userLocationIds.includes(location.id);
                  return (
                    <div key={location.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`location-${location.id}`}
                        checked={isChecked}
                        onChange={(e) => {
                          const currentIds = selectedUser?.locationId ? selectedUser.locationId.toString().split(',').map(id => parseInt(id.trim())) : [];
                          let newIds;
                          if (e.target.checked) {
                            newIds = [...currentIds, location.id];
                          } else {
                            newIds = currentIds.filter(id => id !== location.id);
                          }
                          const locationIdString = newIds.length > 0 ? newIds.join(',') : null;
                          setSelectedUser((prev) => ({ ...prev, locationId: locationIdString }));
                        }}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`location-${location.id}`} className="text-sm flex-1">
                        {location.name}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Active Status</Label>
              <Switch
                id="isActive"
                checked={selectedUser?.isActive || false}
                onCheckedChange={(checked) => setSelectedUser((prev) => ({ ...prev, isActive: checked }))}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUserSave} className="bg-red-600 hover:bg-red-700" disabled={loading}>
                {loading ? "Saving..." : (isNewUser ? "Create User" : "Update User")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Role Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="w-[70vw] max-w-[70vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isRoleViewMode ? "View Role Permissions" : (isNewRole ? "Add New Role" : "Edit Role")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="roleName">Role Name</Label>
              <Input
                id="roleName"
                value={selectedRole?.name || ""}
                onChange={(e) => setSelectedRole((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Senior Doctor"
                disabled={isRoleViewMode}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="roleActive">Active Status</Label>
              <Switch
                id="roleActive"
                checked={selectedRole?.isActive === 1 || selectedRole?.isActive === "1"}
                onCheckedChange={(checked) => {
                  console.log('Switch changed:', checked, 'Current isActive:', selectedRole?.isActive)
                  setSelectedRole((prev) => ({ ...prev, isActive: checked ? 1 : 0 }))
                }}
                disabled={isRoleViewMode}
              />
            </div>


            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Module Permissions
                </Label>
                <div className="text-sm text-gray-500">
                  {modules.length} modules available
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  {modules.filter(module => {
                    if (!isRoleViewMode) return true
                    // In view mode, only show modules that have permissions
                    const hasModulePermission = rolePermissions.some(p => p.moduleId === module.id && !p.subModuleId && (p.add || p.edit || p.delete || p.view))
                    const hasSubmodulePermissions = module.subModules?.some(sub => 
                      rolePermissions.some(p => p.moduleId === module.id && p.subModuleId === sub.id && (p.add || p.edit || p.delete || p.view))
                    )
                    return hasModulePermission || hasSubmodulePermissions
                  }).map((module) => {
                    const getPermission = (moduleId: number, subModuleId?: number) => {
                      return rolePermissions.find(p => 
                        p.moduleId === moduleId && (subModuleId ? p.subModuleId === subModuleId : !p.subModuleId)
                      )
                    }
                    
                    const isDashboardModule = (moduleName: string, submoduleName?: string) => {
                      const name = (submoduleName || moduleName || '').toLowerCase()
                      return name.includes('dashboard')
                    }
                    
                    return (
                      <div key={module.id} className="border-b last:border-b-0">
                        <div className="bg-gray-50 p-4 border-b">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="font-semibold text-blue-700">{module.name}</div>
                              {module.subModules && module.subModules.length > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  {module.subModules.length} submodules
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="bg-white">
                          {module.subModules && module.subModules.length > 0 ? (
                            <div className="divide-y">
                              {module.subModules.filter(submodule => {
                                if (!isRoleViewMode) return true
                                // In view mode, only show submodules with permissions
                                const permission = getPermission(module.id, submodule.id)
                                return permission && (permission.add || permission.edit || permission.delete || permission.view)
                              }).map((submodule) => {
                                const permission = getPermission(module.id, submodule.id)
                                const hasAnyPermission = permission && (permission.add || permission.edit || permission.delete || permission.view)
                                
                                return (
                                  <div key={submodule.id} className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                      <div className="flex items-center gap-3">
                                        <div className="font-medium">{submodule.name}</div>
                                      </div>
                                      {!isRoleViewMode && (
                                        <div className="flex gap-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              const newPermissions = [...rolePermissions]
                                              const existingIndex = newPermissions.findIndex(p => 
                                                p.moduleId === module.id && p.subModuleId === submodule.id
                                              )
                                              if (isDashboardModule(module.name, submodule.name)) {
                                                if (existingIndex >= 0) {
                                                  newPermissions[existingIndex] = {
                                                    ...newPermissions[existingIndex],
                                                    view: 1
                                                  }
                                                } else {
                                                  newPermissions.push({
                                                    roleId: selectedRole?.id || 0,
                                                    moduleId: module.id,
                                                    subModuleId: submodule.id,
                                                    add: 0, edit: 0, delete: 0, view: 1
                                                  })
                                                }
                                              } else {
                                                if (existingIndex >= 0) {
                                                  newPermissions[existingIndex] = {
                                                    ...newPermissions[existingIndex],
                                                    add: 1, edit: 1, delete: 1, view: 1
                                                  }
                                                } else {
                                                  newPermissions.push({
                                                    roleId: selectedRole?.id || 0,
                                                    moduleId: module.id,
                                                    subModuleId: submodule.id,
                                                    add: 1, edit: 1, delete: 1, view: 1
                                                  })
                                                }
                                              }
                                              setRolePermissions(newPermissions)
                                            }}
                                            className="text-xs"
                                          >
                                            Grant All
                                          </Button>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              const newPermissions = rolePermissions.filter(p => 
                                                !(p.moduleId === module.id && p.subModuleId === submodule.id)
                                              )
                                              setRolePermissions(newPermissions)
                                            }}
                                            className="text-xs"
                                          >
                                            Remove All
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className={`grid gap-4 ${isDashboardModule(module.name, submodule.name) ? 'grid-cols-1' : 'grid-cols-4'}`}>
                                      <label className="flex items-center space-x-2">
                                        <input 
                                          type="checkbox" 
                                          className="rounded" 
                                          checked={permission?.view === 1 || false}
                                          onChange={(e) => {
                                            const newPermissions = [...rolePermissions]
                                            const existingIndex = newPermissions.findIndex(p => 
                                              p.moduleId === module.id && p.subModuleId === submodule.id
                                            )
                                            if (existingIndex >= 0) {
                                              newPermissions[existingIndex] = {
                                                ...newPermissions[existingIndex],
                                                view: e.target.checked ? 1 : 0
                                              }
                                            } else {
                                              newPermissions.push({
                                                roleId: selectedRole?.id || 0,
                                                moduleId: module.id,
                                                subModuleId: submodule.id,
                                                add: 0, edit: 0, delete: 0,
                                                view: e.target.checked ? 1 : 0
                                              })
                                            }
                                            setRolePermissions(newPermissions)
                                          }}
                                          disabled={isRoleViewMode}
                                        />
                                        <span className="text-sm flex items-center gap-1 text-gray-600">
                                          <Eye className="h-3 w-3" />
                                          View
                                        </span>
                                      </label>
                                      
                                      {!isDashboardModule(module.name, submodule.name) && (
                                        <>
                                          <label className="flex items-center space-x-2">
                                            <input 
                                              type="checkbox" 
                                              className="rounded" 
                                              checked={permission?.add === 1 || false}
                                              onChange={(e) => {
                                                const newPermissions = [...rolePermissions]
                                                const existingIndex = newPermissions.findIndex(p => 
                                                  p.moduleId === module.id && p.subModuleId === submodule.id
                                                )
                                                if (existingIndex >= 0) {
                                                  newPermissions[existingIndex] = {
                                                    ...newPermissions[existingIndex],
                                                    add: e.target.checked ? 1 : 0
                                                  }
                                                } else {
                                                  newPermissions.push({
                                                    roleId: selectedRole?.id || 0,
                                                    moduleId: module.id,
                                                    subModuleId: submodule.id,
                                                    view: 0, edit: 0, delete: 0,
                                                    add: e.target.checked ? 1 : 0
                                                  })
                                                }
                                                setRolePermissions(newPermissions)
                                              }}
                                              disabled={isRoleViewMode}
                                            />
                                            <span className="text-sm flex items-center gap-1 text-green-600">
                                              <Plus className="h-3 w-3" />
                                              Add
                                            </span>
                                          </label>
                                          
                                          <label className="flex items-center space-x-2">
                                            <input 
                                              type="checkbox" 
                                              className="rounded" 
                                              checked={permission?.edit === 1 || false}
                                              onChange={(e) => {
                                                const newPermissions = [...rolePermissions]
                                                const existingIndex = newPermissions.findIndex(p => 
                                                  p.moduleId === module.id && p.subModuleId === submodule.id
                                                )
                                                if (existingIndex >= 0) {
                                                  newPermissions[existingIndex] = {
                                                    ...newPermissions[existingIndex],
                                                    edit: e.target.checked ? 1 : 0
                                                  }
                                                } else {
                                                  newPermissions.push({
                                                    roleId: selectedRole?.id || 0,
                                                    moduleId: module.id,
                                                    subModuleId: submodule.id,
                                                    view: 0, add: 0, delete: 0,
                                                    edit: e.target.checked ? 1 : 0
                                                  })
                                                }
                                                setRolePermissions(newPermissions)
                                              }}
                                              disabled={isRoleViewMode}
                                            />
                                            <span className="text-sm flex items-center gap-1 text-blue-600">
                                              <Edit className="h-3 w-3" />
                                              Edit
                                            </span>
                                          </label>
                                          
                                          <label className="flex items-center space-x-2">
                                            <input 
                                              type="checkbox" 
                                              className="rounded" 
                                              checked={permission?.delete === 1 || false}
                                              onChange={(e) => {
                                                const newPermissions = [...rolePermissions]
                                                const existingIndex = newPermissions.findIndex(p => 
                                                  p.moduleId === module.id && p.subModuleId === submodule.id
                                                )
                                                if (existingIndex >= 0) {
                                                  newPermissions[existingIndex] = {
                                                    ...newPermissions[existingIndex],
                                                    delete: e.target.checked ? 1 : 0
                                                  }
                                                } else {
                                                  newPermissions.push({
                                                    roleId: selectedRole?.id || 0,
                                                    moduleId: module.id,
                                                    subModuleId: submodule.id,
                                                    view: 0, add: 0, edit: 0,
                                                    delete: e.target.checked ? 1 : 0
                                                  })
                                                }
                                                setRolePermissions(newPermissions)
                                              }}
                                              disabled={isRoleViewMode}
                                            />
                                            <span className="text-sm flex items-center gap-1 text-red-600">
                                              <Trash2 className="h-3 w-3" />
                                              Delete
                                            </span>
                                          </label>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          ) : (
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="font-medium">{module.name}</div>
                                </div>
                                {!isRoleViewMode && (
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const newPermissions = [...rolePermissions]
                                        const existingIndex = newPermissions.findIndex(p => 
                                          p.moduleId === module.id && !p.subModuleId
                                        )
                                        if (isDashboardModule(module.name)) {
                                          if (existingIndex >= 0) {
                                            newPermissions[existingIndex] = {
                                              ...newPermissions[existingIndex],
                                              view: 1
                                            }
                                          } else {
                                            newPermissions.push({
                                              roleId: selectedRole?.id || 0,
                                              moduleId: module.id,
                                              subModuleId: null,
                                              add: 0, edit: 0, delete: 0, view: 1
                                            })
                                          }
                                        } else {
                                          if (existingIndex >= 0) {
                                            newPermissions[existingIndex] = {
                                              ...newPermissions[existingIndex],
                                              add: 1, edit: 1, delete: 1, view: 1
                                            }
                                          } else {
                                            newPermissions.push({
                                              roleId: selectedRole?.id || 0,
                                              moduleId: module.id,
                                              subModuleId: null,
                                              add: 1, edit: 1, delete: 1, view: 1
                                            })
                                          }
                                        }
                                        setRolePermissions(newPermissions)
                                      }}
                                      className="text-xs"
                                    >
                                      Grant All
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const newPermissions = rolePermissions.filter(p => 
                                          !(p.moduleId === module.id && !p.subModuleId)
                                        )
                                        setRolePermissions(newPermissions)
                                      }}
                                      className="text-xs"
                                    >
                                      Remove All
                                    </Button>
                                  </div>
                                )}
                              </div>
                              
                              <div className={`grid gap-4 ${isDashboardModule(module.name) ? 'grid-cols-1' : 'grid-cols-4'}`}>
                                <label className="flex items-center space-x-2">
                                  <input 
                                    type="checkbox" 
                                    className="rounded" 
                                    checked={getPermission(module.id)?.view === 1 || false}
                                    onChange={(e) => {
                                      const newPermissions = [...rolePermissions]
                                      const existingIndex = newPermissions.findIndex(p => 
                                        p.moduleId === module.id && !p.subModuleId
                                      )
                                      if (existingIndex >= 0) {
                                        newPermissions[existingIndex] = {
                                          ...newPermissions[existingIndex],
                                          view: e.target.checked ? 1 : 0
                                        }
                                      } else {
                                        newPermissions.push({
                                          roleId: selectedRole?.id || 0,
                                          moduleId: module.id,
                                          subModuleId: null,
                                          add: 0, edit: 0, delete: 0,
                                          view: e.target.checked ? 1 : 0
                                        })
                                      }
                                      setRolePermissions(newPermissions)
                                    }}
                                    disabled={isRoleViewMode}
                                  />
                                  <span className="text-sm flex items-center gap-1 text-gray-600">
                                    <Eye className="h-3 w-3" />
                                    View
                                  </span>
                                </label>
                                
                                {!isDashboardModule(module.name) && (
                                  <>
                                    <label className="flex items-center space-x-2">
                                      <input 
                                        type="checkbox" 
                                        className="rounded" 
                                        checked={getPermission(module.id)?.add === 1 || false}
                                        onChange={(e) => {
                                          const newPermissions = [...rolePermissions]
                                          const existingIndex = newPermissions.findIndex(p => 
                                            p.moduleId === module.id && !p.subModuleId
                                          )
                                          if (existingIndex >= 0) {
                                            newPermissions[existingIndex] = {
                                              ...newPermissions[existingIndex],
                                              add: e.target.checked ? 1 : 0
                                            }
                                          } else {
                                            newPermissions.push({
                                              roleId: selectedRole?.id || 0,
                                              moduleId: module.id,
                                              subModuleId: null,
                                              view: 0, edit: 0, delete: 0,
                                              add: e.target.checked ? 1 : 0
                                            })
                                          }
                                          setRolePermissions(newPermissions)
                                        }}
                                        disabled={isRoleViewMode}
                                      />
                                      <span className="text-sm flex items-center gap-1 text-green-600">
                                        <Plus className="h-3 w-3" />
                                        Add
                                      </span>
                                    </label>
                                    
                                    <label className="flex items-center space-x-2">
                                      <input 
                                        type="checkbox" 
                                        className="rounded" 
                                        checked={getPermission(module.id)?.edit === 1 || false}
                                        onChange={(e) => {
                                          const newPermissions = [...rolePermissions]
                                          const existingIndex = newPermissions.findIndex(p => 
                                            p.moduleId === module.id && !p.subModuleId
                                          )
                                          if (existingIndex >= 0) {
                                            newPermissions[existingIndex] = {
                                              ...newPermissions[existingIndex],
                                              edit: e.target.checked ? 1 : 0
                                            }
                                          } else {
                                            newPermissions.push({
                                              roleId: selectedRole?.id || 0,
                                              moduleId: module.id,
                                              subModuleId: null,
                                              view: 0, add: 0, delete: 0,
                                              edit: e.target.checked ? 1 : 0
                                            })
                                          }
                                          setRolePermissions(newPermissions)
                                        }}
                                        disabled={isRoleViewMode}
                                      />
                                      <span className="text-sm flex items-center gap-1 text-blue-600">
                                        <Edit className="h-3 w-3" />
                                        Edit
                                      </span>
                                    </label>
                                    
                                    <label className="flex items-center space-x-2">
                                      <input 
                                        type="checkbox" 
                                        className="rounded" 
                                        checked={getPermission(module.id)?.delete === 1 || false}
                                        onChange={(e) => {
                                          const newPermissions = [...rolePermissions]
                                          const existingIndex = newPermissions.findIndex(p => 
                                            p.moduleId === module.id && !p.subModuleId
                                          )
                                          if (existingIndex >= 0) {
                                            newPermissions[existingIndex] = {
                                              ...newPermissions[existingIndex],
                                              delete: e.target.checked ? 1 : 0
                                            }
                                          } else {
                                            newPermissions.push({
                                              roleId: selectedRole?.id || 0,
                                              moduleId: module.id,
                                              subModuleId: null,
                                              view: 0, add: 0, edit: 0,
                                              delete: e.target.checked ? 1 : 0
                                            })
                                          }
                                          setRolePermissions(newPermissions)
                                        }}
                                        disabled={isRoleViewMode}
                                      />
                                      <span className="text-sm flex items-center gap-1 text-red-600">
                                        <Trash2 className="h-3 w-3" />
                                        Delete
                                      </span>
                                    </label>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {modules.length === 0 && (
                <div className="border rounded-lg p-6 text-center text-gray-500">
                  No modules available. Please contact your administrator.
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => {
                setIsRoleDialogOpen(false)
                setIsRoleViewMode(false)
              }}>
                {isRoleViewMode ? "Close" : "Cancel"}
              </Button>
              {!isRoleViewMode && (
                <Button onClick={handleRoleSave} className="bg-red-600 hover:bg-red-700" disabled={loading}>
                  {loading ? "Saving..." : (isNewRole ? "Create Role" : "Update Role")}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Department Dialog */}
      <Dialog open={isDepartmentDialogOpen} onOpenChange={setIsDepartmentDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isNewDepartment ? "Add New Department" : "Edit Department"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deptName">Department Name <span className="text-red-500">*</span></Label>
              <Input
                id="deptName"
                value={selectedDepartment?.name || ""}
                onChange={(e) => {
                  setSelectedDepartment((prev) => ({ ...prev, name: e.target.value }))
                  if (departmentErrors.name) {
                    setDepartmentErrors((prev) => ({ ...prev, name: null }))
                  }
                }}
                className={departmentErrors.name ? "border-red-500" : ""}
                placeholder="e.g., Cardiology"
              />
              {departmentErrors.name && (
                <p className="text-sm text-red-500">{departmentErrors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deptDescription">Description</Label>
              <Input
                id="deptDescription"
                value={selectedDepartment?.description || ""}
                onChange={(e) => setSelectedDepartment((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., Heart and cardiovascular care"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deptHead">Head of Department</Label>
              <Input
                id="deptHead"
                value={selectedDepartment?.headOfDepartment || ""}
                onChange={(e) => setSelectedDepartment((prev) => ({ ...prev, headOfDepartment: e.target.value }))}
                placeholder="e.g., Dr. John Smith"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="deptActive">Active Status</Label>
              <Switch
                id="deptActive"
                checked={selectedDepartment?.isActive || false}
                onCheckedChange={(checked) => setSelectedDepartment((prev) => ({ ...prev, isActive: checked }))}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDepartmentDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleDepartmentSave} className="bg-red-600 hover:bg-red-700" disabled={loading}>
                {loading ? "Saving..." : (isNewDepartment ? "Create Department" : "Update Department")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Location Dialog */}
      <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isNewLocation ? "Add New Location" : "Edit Location"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="locationCode">Location Code <span className="text-red-500">*</span></Label>
              <Input
                id="locationCode"
                value={selectedLocation?.locationCode || ""}
                onChange={(e) => {
                  setSelectedLocation((prev) => ({ ...prev, locationCode: e.target.value }))
                  if (locationErrors.locationCode) {
                    setLocationErrors((prev) => ({ ...prev, locationCode: null }))
                  }
                }}
                placeholder="e.g., LOC001"
                className={locationErrors.locationCode ? "border-red-500" : ""}
              />
              {locationErrors.locationCode && (
                <p className="text-sm text-red-500">{locationErrors.locationCode}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="locationName">Location Name <span className="text-red-500">*</span></Label>
              <Input
                id="locationName"
                value={selectedLocation?.name || ""}
                onChange={(e) => {
                  setSelectedLocation((prev) => ({ ...prev, name: e.target.value }))
                  if (locationErrors.name) {
                    setLocationErrors((prev) => ({ ...prev, name: null }))
                  }
                }}
                placeholder="e.g., Main Hospital"
                className={locationErrors.name ? "border-red-500" : ""}
              />
              {locationErrors.name && (
                <p className="text-sm text-red-500">{locationErrors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="locationAddress">Address <span className="text-red-500">*</span></Label>
              <Input
                id="locationAddress"
                value={selectedLocation?.address || ""}
                onChange={(e) => {
                  setSelectedLocation((prev) => ({ ...prev, address: e.target.value }))
                  if (locationErrors.address) {
                    setLocationErrors((prev) => ({ ...prev, address: null }))
                  }
                }}
                placeholder="e.g., 123 Medical Street"
                className={locationErrors.address ? "border-red-500" : ""}
              />
              {locationErrors.address && (
                <p className="text-sm text-red-500">{locationErrors.address}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="locationPhone">Phone <span className="text-red-500">*</span></Label>
              <Input
                id="locationPhone"
                value={selectedLocation?.phone || ""}
                onChange={(e) => {
                  setSelectedLocation((prev) => ({ ...prev, phone: e.target.value }))
                  if (locationErrors.phone) {
                    setLocationErrors((prev) => ({ ...prev, phone: null }))
                  }
                }}
                placeholder="e.g., +91 80 1234 5678"
                className={locationErrors.phone ? "border-red-500" : ""}
              />
              {locationErrors.phone && (
                <p className="text-sm text-red-500">{locationErrors.phone}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="locationEmail">Email</Label>
              <Input
                id="locationEmail"
                type="email"
                value={selectedLocation?.email || ""}
                onChange={(e) => {
                  setSelectedLocation((prev) => ({ ...prev, email: e.target.value }))
                  if (locationErrors.email) {
                    setLocationErrors((prev) => ({ ...prev, email: null }))
                  }
                }}
                placeholder="e.g., main@hospital.com"
                className={locationErrors.email ? "border-red-500" : ""}
              />
              {locationErrors.email && (
                <p className="text-sm text-red-500">{locationErrors.email}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="locationActive">Active Status</Label>
              <Switch
                id="locationActive"
                checked={selectedLocation?.isActive || false}
                onCheckedChange={(checked) => setSelectedLocation((prev) => ({ ...prev, isActive: checked }))}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsLocationDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleLocationSave} className="bg-red-600 hover:bg-red-700" disabled={loading}>
                {loading ? "Saving..." : (isNewLocation ? "Create Location" : "Update Location")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </PrivateRoute>
  )
}

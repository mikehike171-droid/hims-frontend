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

const mockRoles = [
  {
    id: 1,
    name: "Super Admin",
    code: "SUPER_ADMIN",
    department: "Administration",
    userCount: 2,
    permissions: ["All Permissions"],
  },
  {
    id: 2,
    name: "Doctor",
    code: "DOCTOR",
    department: "Medical",
    userCount: 45,
    permissions: ["Patients: Read/Write", "Prescriptions: Read/Write", "Reports: Read"],
  },
  {
    id: 3,
    name: "Nurse",
    code: "NURSE",
    department: "Nursing",
    userCount: 78,
    permissions: ["Patients: Read", "Vitals: Read/Write", "Reports: Read"],
  },
  {
    id: 4,
    name: "Pharmacist",
    code: "PHARMACIST",
    department: "Pharmacy",
    userCount: 12,
    permissions: ["Pharmacy: Read/Write", "Prescriptions: Read", "Inventory: Read/Write"],
  },
  {
    id: 5,
    name: "Lab Technician",
    code: "LAB_TECH",
    department: "Laboratory",
    userCount: 15,
    permissions: ["Lab: Read/Write", "Reports: Read/Write"],
  },
  {
    id: 6,
    name: "Receptionist",
    code: "RECEPTIONIST",
    department: "Administration",
    userCount: 20,
    permissions: ["Patients: Read/Write", "Appointments: Read/Write"],
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
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [pageSize] = useState(5)
  const [selectedBranchId, setSelectedBranchId] = useState(authService.getSelectedBranchId())

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

  const fetchRoles = async () => {
    try {
      const data = await settingsApi.getRoles()
      setRoles(data)
    } catch (error) {
      console.error('Error fetching roles:', error)
      toast({
        title: "Error",
        description: "Failed to fetch roles",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchUsers(currentPage)
    fetchRoles()
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      const currentBranchId = authService.getSelectedBranchId()
      if (currentBranchId !== selectedBranchId) {
        setSelectedBranchId(currentBranchId)
        const resetPage = 1
        setCurrentPage(resetPage)
        fetchUsers(resetPage)
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
      }
    }, 500)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [selectedBranchId, fetchUsers])

  const handleUserSave = async () => {
    try {
      setLoading(true)
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
      fetchUsers(currentPage)
    } catch (error) {
      console.error('Error saving user:', error)
      toast({
        title: "Error",
        description: `Failed to ${isNewUser ? "create" : "update"} user`,
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

  const handleRoleSave = () => {
    toast({
      title: isNewRole ? "Role Created" : "Role Updated",
      description: `Role ${selectedRole?.name} has been ${isNewRole ? "created" : "updated"} successfully.`,
    })
    setIsRoleDialogOpen(false)
    setSelectedRole(null)
  }

  const handleRoleDelete = (roleId: number) => {
    toast({
      title: "Role Deleted",
      description: "Role has been deleted successfully.",
      variant: "destructive",
    })
  }

  const filteredUsers = (users || []).filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
                        locationId: 0,
                        isActive: true,
                      })
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
                          Last Login
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 text-center">
                            Loading users...
                          </td>
                        </tr>
                      ) : filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
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
                              <div className="text-sm text-gray-900">-</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge variant="secondary">{user.role?.name || 'No Role'}</Badge>
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.updatedAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUser(user)
                                    setIsNewUser(false)
                                    setIsUserDialogOpen(true)
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
              {totalPages > 1 && (
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
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
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
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Department
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockDepartments.map((dept) => (
                  <Card key={dept.id} className="border-l-4 border-l-red-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{dept.name}</CardTitle>
                          <p className="text-sm text-gray-500">Code: {dept.code}</p>
                        </div>
                        <Badge variant={dept.isActive ? "default" : "secondary"}>
                          {dept.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Crown className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">Head:</span>
                        <span>{dept.head}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">Staff:</span>
                        <span>{dept.staffCount} members</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-green-500" />
                        <span className="font-medium">Location:</span>
                        <span>{dept.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
                  onClick={() => {
                    setSelectedRole({
                      name: "",
                      code: "",
                      department: "",
                      permissions: []
                    })
                    setIsNewRole(true)
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
                {mockRoles.map((role) => (
                  <Card key={role.id} className="border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold">{role.name}</h3>
                            <Badge variant="outline">{role.code}</Badge>
                            <Badge variant="secondary">{role.userCount} users</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Department: {role.department}</p>
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Permissions:</p>
                            <div className="flex flex-wrap gap-2">
                              {role.permissions.map((permission, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {permission}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedRole(role)
                              setIsNewRole(false)
                              setIsRoleDialogOpen(true)
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
                                <AlertDialogTitle>Delete Role</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the role "{role.name}"? This action cannot be undone and will affect {role.userCount} users.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRoleDelete(role.id)}
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

        {/* Locations Management Tab */}
        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Location Management</span>
                </CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockLocations.map((location) => (
                  <Card
                    key={location.id}
                    className={`border ${location.isMainBranch ? "border-l-4 border-l-yellow-500" : ""}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold">{location.name}</h3>
                            <Badge variant="outline">{location.code}</Badge>
                            {location.isMainBranch && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Crown className="h-3 w-3 mr-1" />
                                Main Branch
                              </Badge>
                            )}
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
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
              
              {/* Pagination */}
              {totalPages > 1 && (
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
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
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
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={selectedUser?.username || ""}
                onChange={(e) => setSelectedUser((prev) => ({ ...prev, username: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={selectedUser?.firstName || ""}
                  onChange={(e) => setSelectedUser((prev) => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={selectedUser?.lastName || ""}
                  onChange={(e) => setSelectedUser((prev) => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={selectedUser?.email || ""}
                  onChange={(e) => setSelectedUser((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={selectedUser?.phone || ""}
                  onChange={(e) => setSelectedUser((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>

            {isNewUser && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={selectedUser?.password || ""}
                  onChange={(e) => setSelectedUser((prev) => ({ ...prev, password: e.target.value }))}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={selectedUser?.roleId?.toString() || ""}
                  onValueChange={(value) => setSelectedUser((prev) => ({ ...prev, roleId: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location ID</Label>
                <Input
                  id="location"
                  type="number"
                  value={selectedUser?.locationId || ""}
                  onChange={(e) => setSelectedUser((prev) => ({ ...prev, locationId: parseInt(e.target.value) || null }))}
                  placeholder="Enter location ID"
                />
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isNewRole ? "Add New Role" : "Edit Role"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roleName">Role Name</Label>
                <Input
                  id="roleName"
                  value={selectedRole?.name || ""}
                  onChange={(e) => setSelectedRole((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Senior Doctor"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roleCode">Role Code</Label>
                <Input
                  id="roleCode"
                  value={selectedRole?.code || ""}
                  onChange={(e) => setSelectedRole((prev) => ({ ...prev, code: e.target.value }))}
                  placeholder="e.g., SR_DOCTOR"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roleDepartment">Department</Label>
              <Select 
                value={selectedRole?.department || ""}
                onValueChange={(value) => setSelectedRole((prev) => ({ ...prev, department: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administration">Administration</SelectItem>
                  <SelectItem value="Medical">Medical</SelectItem>
                  <SelectItem value="Nursing">Nursing</SelectItem>
                  <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                  <SelectItem value="Laboratory">Laboratory</SelectItem>
                  <SelectItem value="Radiology">Radiology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="border rounded-lg p-4 space-y-3 max-h-60 overflow-y-auto">
                {[
                  "Patients: Read",
                  "Patients: Write", 
                  "Prescriptions: Read",
                  "Prescriptions: Write",
                  "Reports: Read",
                  "Reports: Write",
                  "Pharmacy: Read",
                  "Pharmacy: Write",
                  "Lab: Read",
                  "Lab: Write",
                  "Appointments: Read",
                  "Appointments: Write",
                  "Billing: Read",
                  "Billing: Write",
                  "Settings: Read",
                  "Settings: Write",
                  "User Management",
                  "System Administration"
                ].map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={permission}
                      checked={selectedRole?.permissions?.includes(permission) || false}
                      onChange={(e) => {
                        const permissions = selectedRole?.permissions || []
                        if (e.target.checked) {
                          setSelectedRole((prev) => ({
                            ...prev,
                            permissions: [...permissions, permission]
                          }))
                        } else {
                          setSelectedRole((prev) => ({
                            ...prev,
                            permissions: permissions.filter(p => p !== permission)
                          }))
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={permission} className="text-sm">{permission}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsRoleDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRoleSave} className="bg-red-600 hover:bg-red-700">
                {isNewRole ? "Create Role" : "Update Role"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </PrivateRoute>
  )
}

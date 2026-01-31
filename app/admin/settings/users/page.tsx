"use client"

import { useState, useEffect, useCallback } from "react"
import { settingsApi, User } from "@/lib/settingsApi"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { usePermissions, hasPermission } from '@/contexts/permissions-context'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
} from "lucide-react"
import UserForm from "./user-form"

export default function UsersPage() {
  const permissions = usePermissions()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [userTypes, setUserTypes] = useState<any[]>([])

  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [pageSize] = useState(5)
  const [selectedBranchId, setSelectedBranchId] = useState(authService.getSelectedBranchId())

  const [initialized, setInitialized] = useState(false)

  const fetchUserTypes = useCallback(async () => {
    try {
      const types = await settingsApi.getUserTypes()
      setUserTypes(types || [])
    } catch (error) {
      console.error('Error fetching user types:', error)
    }
  }, [])

  const fetchUsers = useCallback(async (page: number = 1) => {
    try {
      setLoading(true)
      const selectedBranchId = authService.getSelectedBranchId()
      const locationId = selectedBranchId ? parseInt(selectedBranchId) : undefined
      const data = await settingsApi.getUsers(locationId, page, pageSize)
      if (Array.isArray(data)) {
        setUsers(data)
        setTotalPages(1)
        setTotalUsers(data.length)
        setCurrentPage(page)
      } else {
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
      if (Array.isArray(data)) {
        setUsers(data)
        setTotalPages(1)
        setTotalUsers(data.length)
      } else {
        setUsers(data.users || [])
        setTotalPages(data.totalPages || 1)
        setTotalUsers(data.total || 0)
        // User types are now fixed, no need to extract from search results
      }
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





  useEffect(() => {
    if (!initialized) {
      fetchUserTypes()
      fetchUsers(currentPage)
      setInitialized(true)
    }
  }, [initialized, fetchUsers, fetchUserTypes])

  useEffect(() => {
    if (!initialized) return
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        searchUsers(searchTerm)
      } else {
        setCurrentPage(1)
        fetchUsers(1)
      }
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  useEffect(() => {
    if (!initialized) return
    const handleBranchChange = () => {
      const currentBranchId = authService.getSelectedBranchId()
      if (currentBranchId !== selectedBranchId) {
        setSelectedBranchId(currentBranchId)
        const resetPage = 1
        setCurrentPage(resetPage)
        fetchUsers(resetPage)
      }
    }

    window.addEventListener('branchChanged', handleBranchChange)

    return () => {
      window.removeEventListener('branchChanged', handleBranchChange)
    }
  }, [selectedBranchId, initialized, fetchUsers])



  const handleUserDelete = async (userId: number) => {
    try {
      setLoading(true)
      await settingsApi.updateUser(userId, { isActive: false })
      toast({
        title: "User Deactivated",
        description: "User has been deactivated successfully.",
        variant: "destructive",
      })
      fetchUsers(currentPage)
    } catch (error) {
      console.error('Error deactivating user:', error)
      toast({
        title: "Error",
        description: "Failed to deactivate user",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }



  const filteredUsers = Array.isArray(users) ? users.filter(user => user.isActive) : []

  if (showForm) {
    return (
      <PrivateRoute modulePath="admin/settings" action="view">
        <UserForm
          user={selectedUser}
          isNew={isNewUser}
          userTypes={userTypes}
          onSave={() => {
            setShowForm(false)
            setSelectedUser(null)
            fetchUsers(currentPage)
          }}
          onCancel={() => {
            setShowForm(false)
            setSelectedUser(null)
          }}
        />
      </PrivateRoute>
    )
  }

  return (
    <PrivateRoute modulePath="admin/settings" action="view">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage system users and their permissions</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Users</span>
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
                {hasPermission(permissions, 'admin/settings/users', 'add') && (
                  <Button
                    onClick={() => {
                      setSelectedUser(null)
                      setIsNewUser(true)
                      setShowForm(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                )}
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Locations</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center">Loading users...</td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No users found</td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>
                                  {user.firstName[0]}{user.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                                <div className="text-xs text-gray-400">Username: {user.username}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.phone || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.locationNames || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.userType || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              {hasPermission(permissions, 'admin/settings/users', 'edit') && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={async () => {
                                    try {
                                      setLoading(true)
                                      const fullUserData = await settingsApi.getUser(user.id)
                                      setSelectedUser(fullUserData)
                                      setIsNewUser(false)
                                      setShowForm(true)
                                    } catch (error) {
                                      console.error('Error fetching user data:', error)
                                      toast({
                                        title: "Error",
                                        description: "Failed to load user data",
                                        variant: "destructive",
                                      })
                                    } finally {
                                      setLoading(false)
                                    }
                                  }}
                                  disabled={loading}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                              {hasPermission(permissions, 'admin/settings/users', 'delete') && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" disabled={loading}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Deactivate User</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to deactivate {user.firstName} {user.lastName}? The user will no longer be able to access the system.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleUserDelete(user.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Deactivate
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
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


      </div>
    </PrivateRoute>
  )
}
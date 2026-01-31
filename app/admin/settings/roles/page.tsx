"use client"

import { useState, useEffect, useCallback } from "react"
import { settingsApi, Role } from "@/lib/settingsApi"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { usePermissions, hasPermission } from '@/contexts/permissions-context'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"

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
  Shield,
  Plus,
  Edit,
  Trash2,
  Eye,
} from "lucide-react"
import RoleForm from "./role-form"

export default function RolesPage() {
  const permissions = usePermissions()
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [selectedBranchId, setSelectedBranchId] = useState(authService.getSelectedBranchId())
  const [selectedRole, setSelectedRole] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [isNewRole, setIsNewRole] = useState(false)

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true)
      const selectedBranchId = authService.getSelectedBranchId()
      const locationId = selectedBranchId ? parseInt(selectedBranchId) : undefined
      const data = await settingsApi.getRoles(locationId)
      setRoles(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching roles:', error)
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

  useEffect(() => {
    if (!initialized) {
      fetchRoles()
      setInitialized(true)
    }
  }, [initialized])

  useEffect(() => {
    if (!initialized) return
    const handleBranchChange = () => {
      const currentBranchId = authService.getSelectedBranchId()
      if (currentBranchId !== selectedBranchId) {
        setSelectedBranchId(currentBranchId)
        fetchRoles()
      }
    }

    window.addEventListener('branchChanged', handleBranchChange)

    return () => {
      window.removeEventListener('branchChanged', handleBranchChange)
    }
  }, [selectedBranchId, initialized, fetchRoles])



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

  if (showForm) {
    return (
      <PrivateRoute modulePath="admin/settings" action="view">
        <RoleForm
          role={selectedRole}
          isNew={isNewRole}
          onSave={() => {
            setShowForm(false)
            setSelectedRole(null)
            fetchRoles()
          }}
          onCancel={() => {
            setShowForm(false)
            setSelectedRole(null)
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
            <h1 className="text-3xl font-bold text-gray-900">Role & Permission Management</h1>
            <p className="text-gray-600">Define user roles and permission management</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Roles</span>
              </CardTitle>
              {hasPermission(permissions, 'admin/settings/roles', 'add') && (
                <Button
                  onClick={() => {
                    setSelectedRole(null)
                    setIsNewRole(true)
                    setShowForm(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Role
                </Button>
              )}
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
                            disabled={loading}
                            onClick={() => {
                              setSelectedRole({ ...role, viewMode: true })
                              setIsNewRole(false)
                              setShowForm(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          {hasPermission(permissions, 'admin/settings/roles', 'edit') && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={loading}
                              onClick={() => {
                                setSelectedRole(role)
                                setIsNewRole(false)
                                setShowForm(true)
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          )}
                          {hasPermission(permissions, 'admin/settings/roles', 'delete') && (
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
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>


      </div>
    </PrivateRoute>
  )
}
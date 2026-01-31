"use client"

import { useState, useEffect, useCallback } from "react"
import { settingsApi } from "@/lib/settingsApi"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { usePermissions, hasPermission } from '@/contexts/permissions-context'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
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
  Building2,
  Plus,
  Edit,
  Trash2,
  Crown,
  Users,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

export default function DepartmentsPage() {
  const permissions = usePermissions()
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null)
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false)
  const [isNewDepartment, setIsNewDepartment] = useState(false)
  const [departments, setDepartments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [departmentErrors, setDepartmentErrors] = useState<any>({})
  const [initialized, setInitialized] = useState(false)
  const [selectedBranchId, setSelectedBranchId] = useState(authService.getSelectedBranchId())

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

  useEffect(() => {
    if (!initialized) {
      fetchDepartments()
      setInitialized(true)
    }
  }, [initialized])

  useEffect(() => {
    if (!initialized) return
    const handleBranchChange = () => {
      const currentBranchId = authService.getSelectedBranchId()
      if (currentBranchId !== selectedBranchId) {
        setSelectedBranchId(currentBranchId)
        fetchDepartments()
      }
    }

    window.addEventListener('branchChanged', handleBranchChange)

    return () => {
      window.removeEventListener('branchChanged', handleBranchChange)
    }
  }, [selectedBranchId, initialized, fetchDepartments])

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
      const settingsApiUrl = authService.getSettingsApiUrl()

      if (!token) return

      // Clean and validate payload
      const payload = {
        name: selectedDepartment.name?.trim(),
        description: selectedDepartment.description?.trim() || null,
        headOfDepartment: selectedDepartment.headOfDepartment?.trim() || null,
        locationId: selectedDepartment.locationId,
        isActive: selectedDepartment.isActive
      }

      const url = isNewDepartment
        ? `${settingsApiUrl}/settings/departments`
        : `${settingsApiUrl}/settings/departments/${selectedDepartment.id}`

      const method = isNewDepartment ? 'POST' : 'PATCH'

      console.log('Sending request:', { method, url, payload })

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const responseText = await response.text()
      console.log('Response status:', response.status, 'Response:', responseText)

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
        let errorData
        try {
          errorData = JSON.parse(responseText)
        } catch {
          errorData = { message: responseText || 'Unknown error' }
        }
        
        if (response.status === 400 && errorData.message?.toLowerCase().includes('already exists')) {
          setDepartmentErrors({ name: errorData.message })
          return
        }
        
        throw new Error(errorData.message || `Server error (${response.status})`)
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

  const handleDepartmentDelete = async (departmentId: number) => {
    try {
      setLoading(true)
      const token = authService.getCurrentToken()
      const settingsApiUrl = authService.getSettingsApiUrl()

      if (!token) return

      const response = await fetch(`${settingsApiUrl}/settings/departments/${departmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        toast({
          title: "Department Deactivated",
          description: "Department has been deactivated successfully.",
          variant: "destructive",
        })
        fetchDepartments()
      } else {
        throw new Error('Failed to deactivate department')
      }
    } catch (error) {
      console.error('Error deactivating department:', error)
      toast({
        title: "Error",
        description: "Failed to deactivate department",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PrivateRoute modulePath="admin/settings" action="view">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
            <p className="text-gray-600">Configure hospital departments and organizational structure</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>Departments</span>
              </CardTitle>
              {hasPermission(permissions, 'admin/settings/departments', 'add') && (
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
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(departments || []).filter(dept => dept.isActive).map((dept) => (
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
                    <div className="flex items-center space-x-2 pt-2">
                      {hasPermission(permissions, 'admin/settings/departments', 'edit') && (
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
                      )}
                      {hasPermission(permissions, 'admin/settings/departments', 'delete') && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Deactivate Department</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to deactivate {dept.name}? The department will no longer be available for new assignments.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDepartmentDelete(dept.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Deactivate
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
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
      </div>
    </PrivateRoute>
  )
}
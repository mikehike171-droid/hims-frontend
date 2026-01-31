"use client"

import { useState, useEffect } from "react"
import { settingsApi } from "@/lib/settingsApi"
import authService from "@/lib/authService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Shield, Plus, Edit, Trash2, Eye } from "lucide-react"

interface RoleFormProps {
  role?: any
  isNew: boolean
  onSave: () => void
  onCancel: () => void
}

export default function RoleForm({ role, isNew, onSave, onCancel }: RoleFormProps) {
  const [selectedRole, setSelectedRole] = useState<any>(role || {
    name: "",
    isActive: 1,
    locationId: null
  })
  const [modules, setModules] = useState<any[]>([])
  const [rolePermissions, setRolePermissions] = useState<any[]>([])
  const [roleErrors, setRoleErrors] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [isViewMode, setIsViewMode] = useState(false)

  useEffect(() => {
    fetchModules()
    if (role && !isNew) {
      setSelectedRole(role)
      setIsViewMode(role.viewMode || false)
      loadRolePermissions(role.id)
    } else if (isNew) {
      // Set locationId from global branch selection for new roles
      const currentLocationId = authService.getSelectedBranchId()
      if (currentLocationId) {
        setSelectedRole(prev => ({
          ...prev,
          locationId: parseInt(currentLocationId)
        }))
      }
    }
  }, [role, isNew])

  const fetchModules = async () => {
    try {
      const data = await settingsApi.getModules()
      const processedData = Array.isArray(data) ? data.map(module => ({
        ...module,
        id: parseInt(module.id),
        subModules: module.subModules ? module.subModules.map(sub => ({
          ...sub,
          id: parseInt(sub.id),
          moduleId: parseInt(sub.moduleId)
        })) : []
      })) : []
      setModules(processedData)
    } catch (error) {
      console.error('Error fetching modules:', error)
      setModules([])
    }
  }

  const loadRolePermissions = async (roleId: number) => {
    try {
      const modulesWithPermissions = await settingsApi.getModulesWithPermissions(roleId)
      if (modulesWithPermissions && modulesWithPermissions.length > 0) {
        const extractedPermissions = []
        modulesWithPermissions.forEach(module => {
          if (module.subModules && module.subModules.length > 0) {
            module.subModules.forEach(submodule => {
              extractedPermissions.push({
                roleId: roleId,
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
              roleId: roleId,
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
      }
    } catch (error) {
      console.error('Error loading role permissions:', error)
    }
  }

  const validateForm = () => {
    const errors: any = {}
    if (!selectedRole?.name?.trim()) errors.name = 'Role name is required'
    setRoleErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return
    try {
      setLoading(true)
      
      // Ensure locationId is set from current branch selection
      const currentLocationId = authService.getSelectedBranchId()
      const roleData = {
        ...selectedRole,
        locationId: currentLocationId ? parseInt(currentLocationId) : selectedRole.locationId
      }
      
      if (isNew) {
        const newRole = await settingsApi.createRole(roleData)
        if (rolePermissions.length > 0) {
          const permissionsToSave = rolePermissions.map(p => ({
            ...p,
            roleId: newRole.id
          }))
          await settingsApi.updateRolePermissions(newRole.id, permissionsToSave)
        }
      } else {
        await settingsApi.updateRole(selectedRole.id, roleData)
        await settingsApi.updateRolePermissions(selectedRole.id, rolePermissions)
      }
      toast({
        title: isNew ? "Role Created" : "Role Updated",
        description: `Role ${selectedRole?.name} has been ${isNew ? "created" : "updated"} successfully.`,
      })
      onSave()
    } catch (error) {
      console.error('Error saving role:', error)
      toast({
        title: "Error",
        description: `Failed to ${isNew ? "create" : "update"} role`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">{isNew ? "Add New Role" : isViewMode ? "View Role" : "Edit Role"}</h1>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="roleName">Role Name <span className="text-red-500">*</span></Label>
              <Input
                id="roleName"
                value={selectedRole?.name || ""}
                onChange={(e) => {
                  setSelectedRole((prev) => ({ ...prev, name: e.target.value }))
                  if (roleErrors.name) {
                    setRoleErrors((prev) => ({ ...prev, name: null }))
                  }
                }}
                className={roleErrors.name ? "border-red-500" : ""}
                placeholder="e.g., Senior Doctor"
                disabled={isViewMode}
              />
              {roleErrors.name && (
                <p className="text-sm text-red-500">{roleErrors.name}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="roleActive">Active Status</Label>
              <Switch
                id="roleActive"
                checked={selectedRole?.isActive === 1 || selectedRole?.isActive === "1"}
                onCheckedChange={(checked) => {
                  setSelectedRole((prev) => ({ ...prev, isActive: checked ? 1 : 0 }))
                }}
                disabled={isViewMode}
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
                  {modules.map((module) => (
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
                            {module.subModules.map((submodule) => {
                              const permission = getPermission(module.id, submodule.id)
                              
                              return (
                                <div key={submodule.id} className="p-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                      <div className="font-medium">{submodule.name}</div>
                                    </div>
                                    {!isViewMode && (
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
                                        disabled={isViewMode}
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
                                            disabled={isViewMode}
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
                                            disabled={isViewMode}
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
                                            disabled={isViewMode}
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
                              {!isViewMode && (
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
                                  disabled={isViewMode}
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
                                      disabled={isViewMode}
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
                                      disabled={isViewMode}
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
                                      disabled={isViewMode}
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
                  ))}
                </div>
              </div>
              
              {modules.length === 0 && (
                <div className="border rounded-lg p-6 text-center text-gray-500">
                  No modules available. Please contact your administrator.
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={onCancel}>
                {isViewMode ? "Close" : "Cancel"}
              </Button>
              {!isViewMode && (
                <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700" disabled={loading}>
                  {loading ? "Saving..." : (isNew ? "Create Role" : "Update Role")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
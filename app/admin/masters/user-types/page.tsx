"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Users } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { settingsApi } from "@/lib/settingsApi"

export default function UserTypesPage() {
  const [userTypes, setUserTypes] = useState<any[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [editingType, setEditingType] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    isActive: true
  })

  useEffect(() => {
    fetchUserTypes()
  }, [])

  const fetchUserTypes = async () => {
    try {
      setLoading(true)
      const data = await settingsApi.getUserTypes()
      setUserTypes(data || [])
    } catch (error) {
      console.error('Error fetching user types:', error)
      toast({
        title: "Error",
        description: "Failed to fetch user types",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      if (editingType) {
        await settingsApi.updateUserType(editingType.id, formData)
        toast({
          title: "Success",
          description: "User type updated successfully",
        })
      } else {
        await settingsApi.createUserType(formData)
        toast({
          title: "Success", 
          description: "User type created successfully",
        })
      }
      setShowDialog(false)
      resetForm()
      fetchUserTypes()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save user type",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (userType: any) => {
    setEditingType(userType)
    setFormData({
      name: userType.name,
      code: userType.code,
      description: userType.description || "",
      isActive: userType.isActive
    })
    setShowDialog(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user type?')) return
    
    try {
      setLoading(true)
      await settingsApi.deleteUserType(id)
      toast({
        title: "Success",
        description: "User type deleted successfully",
      })
      fetchUserTypes()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user type",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      isActive: true
    })
    setEditingType(null)
  }

  const handleAddNew = () => {
    resetForm()
    setShowDialog(true)
  }

  return (
    <PrivateRoute modulePath="admin/settings" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Types</h1>
            <p className="text-gray-600">Manage user type categories</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>User Types</span>
              </CardTitle>
              <Button onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add User Type
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : userTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No user types found</TableCell>
                  </TableRow>
                ) : (
                  userTypes.map((userType) => (
                    <TableRow key={userType.id}>
                      <TableCell className="font-medium">{userType.name}</TableCell>
                      <TableCell>{userType.code}</TableCell>
                      <TableCell>{userType.description || '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          userType.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {userType.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(userType)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(userType.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingType ? 'Edit User Type' : 'Add User Type'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter user type name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  placeholder="Enter user type code"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter description"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading || !formData.name || !formData.code}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PrivateRoute>
  )
}
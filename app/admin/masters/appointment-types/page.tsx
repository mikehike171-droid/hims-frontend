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
import { Plus, Edit, Trash2, Calendar } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { settingsApi } from "@/lib/settingsApi"
import authService from "@/lib/authService"

export default function AppointmentTypesPage() {
  const [appointmentTypes, setAppointmentTypes] = useState<any[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [editingType, setEditingType] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    is_active: true
  })

  useEffect(() => {
    fetchAppointmentTypes()
  }, [])

  const fetchAppointmentTypes = async () => {
    try {
      setLoading(true)
      const locationId = authService.getLocationId()
      const data = await settingsApi.getAppointmentTypes(locationId ? parseInt(locationId) : undefined)
      setAppointmentTypes(data || [])
    } catch (error) {
      console.error('Error fetching appointment types:', error)
      toast({
        title: "Error",
        description: "Failed to fetch appointment types",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const locationId = authService.getLocationId()
      const data = {
        ...formData,
        location_id: locationId ? parseInt(locationId) : null
      }

      if (editingType) {
        await settingsApi.updateAppointmentType(editingType.id, data)
        toast({
          title: "Success",
          description: "Appointment type updated successfully",
        })
      } else {
        await settingsApi.createAppointmentType(data)
        toast({
          title: "Success", 
          description: "Appointment type created successfully",
        })
      }
      setShowDialog(false)
      resetForm()
      fetchAppointmentTypes()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save appointment type",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (appointmentType: any) => {
    setEditingType(appointmentType)
    setFormData({
      name: appointmentType.name,
      code: appointmentType.code,
      description: appointmentType.description || "",
      is_active: appointmentType.is_active
    })
    setShowDialog(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this appointment type?')) return
    
    try {
      setLoading(true)
      await settingsApi.deleteAppointmentType(id)
      toast({
        title: "Success",
        description: "Appointment type deleted successfully",
      })
      fetchAppointmentTypes()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete appointment type",
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
      is_active: true
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
            <h1 className="text-3xl font-bold text-gray-900">Appointment Types</h1>
            <p className="text-gray-600">Manage appointment categories</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Appointment Types</span>
              </CardTitle>
              <Button onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add Appointment Type
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
                ) : appointmentTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No appointment types found</TableCell>
                  </TableRow>
                ) : (
                  appointmentTypes.map((type) => (
                    <TableRow key={type.id}>
                      <TableCell className="font-medium">{type.name}</TableCell>
                      <TableCell>{type.code}</TableCell>
                      <TableCell>{type.description || '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          type.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {type.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(type)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(type.id)}
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
              <DialogTitle>{editingType ? 'Edit Appointment Type' : 'Add Appointment Type'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter appointment type name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  placeholder="Enter appointment type code"
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
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
                <Label htmlFor="is_active">Active</Label>
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

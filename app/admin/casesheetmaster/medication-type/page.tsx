"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, List, Edit } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { settingsApi } from "@/lib/settingsApi"
import authService from "@/lib/authService"

export default function MedicationTypePage() {
  const [medicationType, setMedicationType] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true
      fetchMedicationType()
    }
  }, [])

  const fetchMedicationType = async () => {
    try {
      setLoading(true)
      const locationId = authService.getLocationId()
      const data = await settingsApi.getMedicationType(locationId ? parseInt(locationId) : 1)
      setMedicationType(data || [])
    } catch (error) {
      console.error('Error fetching medication type:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter medication type title",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const locationId = authService.getLocationId()
      const dataToSave = {
        title: title.trim(),
        description: description.trim(),
        location_id: locationId ? parseInt(locationId) : 1
      }
      
      if (editingId) {
        await settingsApi.updateMedicationType(editingId, dataToSave)
        toast({
          title: "Success", 
          description: "Medication type updated successfully",
        })
      } else {
        await settingsApi.createMedicationType(dataToSave)
        toast({
          title: "Success", 
          description: "Medication type created successfully",
        })
      }
      
      // Reset form
      setTitle("")
      setDescription("")
      setEditingId(null)
      
      // Refresh data
      await fetchMedicationType()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save medication type",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item: any) => {
    setTitle(item.title)
    setDescription(item.description || "")
    setEditingId(item.id)
  }

  const handleCancel = () => {
    setTitle("")
    setDescription("")
    setEditingId(null)
  }

  return (
    <PrivateRoute modulePath="admin/casesheetmaster" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medication Type</h1>
            <p className="text-gray-600">Manage medication type categories</p>
          </div>
        </div>

        {/* Add/Edit Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>{editingId ? 'Edit Medication Type' : 'Add New Medication Type'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter medication type title"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  rows={1}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={handleSave} 
                  disabled={loading || !title.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Saving...' : editingId ? 'Update' : 'Save'}
                </Button>
                {editingId && (
                  <Button 
                    onClick={handleCancel}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medication Type Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <List className="h-5 w-5" />
              <span>All Medication Types</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : medicationType.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">No medication types found</TableCell>
                  </TableRow>
                ) : (
                  medicationType.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{item.description || '-'}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  )
}
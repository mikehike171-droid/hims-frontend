"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, FileText } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { settingsApi } from "@/lib/settingsApi"
import authService from "@/lib/authService"

export default function PersonalHistoryPage() {
  const [personalHistory, setPersonalHistory] = useState<any[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [editingHistory, setEditingHistory] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const hasLoadedRef = useRef(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location_id: 1
  })

  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true
      fetchPersonalHistory()
    }
  }, [])

  const fetchPersonalHistory = async () => {
    try {
      setLoading(true)
      const locationId = authService.getLocationId()
      const data = await settingsApi.getPersonalHistory(locationId ? parseInt(locationId) : 1)
      setPersonalHistory(data || [])
    } catch (error) {
      console.error('Error fetching personal history:', error)
      toast({
        title: "Error",
        description: "Failed to fetch personal history",
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
      const dataToSave = {
        ...formData,
        location_id: locationId ? parseInt(locationId) : 1
      }
      
      if (editingHistory) {
        await settingsApi.updatePersonalHistory(editingHistory.id, dataToSave)
        toast({
          title: "Success",
          description: "Personal history updated successfully",
        })
      } else {
        await settingsApi.createPersonalHistory(dataToSave)
        toast({
          title: "Success", 
          description: "Personal history created successfully",
        })
      }
      setShowDialog(false)
      resetForm()
      fetchPersonalHistory()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save personal history",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (history: any) => {
    setEditingHistory(history)
    setFormData({
      title: history.title,
      description: history.description || "",
      location_id: history.location_id || 1
    })
    setShowDialog(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location_id: 1
    })
    setEditingHistory(null)
  }

  const handleAddNew = () => {
    resetForm()
    setShowDialog(true)
  }

  return (
    <PrivateRoute modulePath="admin/casesheetmaster" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Personal History</h1>
            <p className="text-gray-600">Manage personal history categories</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Personal History Categories</span>
              </CardTitle>
              <Button onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add Personal History
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Location ID</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : personalHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">No personal history found</TableCell>
                  </TableRow>
                ) : (
                  personalHistory.map((history) => (
                    <TableRow key={history.id}>
                      <TableCell className="font-medium">{history.title}</TableCell>
                      <TableCell>{history.description || '-'}</TableCell>
                      <TableCell>{history.location_id || 'All'}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(history)}
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

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingHistory ? 'Edit Personal History' : 'Add Personal History'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter personal history title"
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading || !formData.title}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PrivateRoute>
  )
}
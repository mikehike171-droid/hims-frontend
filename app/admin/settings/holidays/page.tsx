"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Calendar } from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"
import authService from "@/lib/authService"

interface Holiday {
  id: number
  name: string
  date: string
  description: string
  status: 'active' | 'inactive'
  locationId: number
}

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [loading, setLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    description: '',
    status: 'active'
  })

  useEffect(() => {
    fetchHolidays()
  }, [])

  const fetchHolidays = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const locationId = authService.getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/settings/holidays?locationId=${locationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setHolidays(data)
      }
    } catch (error) {
      console.error('Error fetching holidays:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('authToken')
      const locationId = authService.getLocationId()
      const url = editingHoliday 
        ? `${authService.getSettingsApiUrl()}/settings/holidays/${editingHoliday.id}`
        : `${authService.getSettingsApiUrl()}/settings/holidays`
      
      const method = editingHoliday ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          locationId
        })
      })
      
      if (response.ok) {
        fetchHolidays()
        setShowDialog(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error saving holiday:', error)
    }
  }

  const handleEdit = (holiday: Holiday) => {
    setEditingHoliday(holiday)
    setFormData({
      name: holiday.name,
      date: holiday.date,
      description: holiday.description,
      status: holiday.status
    })
    setShowDialog(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this holiday?')) return
    
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/settings/holidays/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        fetchHolidays()
      }
    } catch (error) {
      console.error('Error deleting holiday:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      date: '',
      description: '',
      status: 'active'
    })
    setEditingHoliday(null)
  }

  const handleDialogClose = () => {
    setShowDialog(false)
    resetForm()
  }

  return (
    <PrivateRoute modulePath="admin/settings/holidays" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Holidays</h1>
            <p className="text-gray-600">Manage holiday calendar</p>
          </div>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => setShowDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Holiday
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingHoliday ? 'Edit Holiday' : 'Add New Holiday'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Holiday Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., New Year"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Optional description"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingHoliday ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Holidays List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Holiday Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
                  </TableRow>
                ) : holidays.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">No holidays found</TableCell>
                  </TableRow>
                ) : (
                  holidays.map((holiday) => (
                    <TableRow key={holiday.id}>
                      <TableCell className="font-medium">{holiday.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {new Date(holiday.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>{holiday.description || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={holiday.status === 'active' ? 'default' : 'secondary'}>
                          {holiday.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(holiday)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(holiday.id)}
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
      </div>
    </PrivateRoute>
  )
}

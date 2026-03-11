"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Network } from 'lucide-react'
import settingsApi from '@/lib/settingsApi'
import PrivateRoute from "@/components/auth/PrivateRoute"

interface LocationsIp {
  id: number
  ip: string
  locationId: number
  location_id: number
  location_name: string
  status: string
  createdBy: number
  createdAt: string
  updatedAt: string
}

interface Location {
  id: number
  name: string
}

export default function LocationsIpPage() {
  const [locationsIp, setLocationsIp] = useState<LocationsIp[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<LocationsIp | null>(null)
  const [formData, setFormData] = useState({
    ip: '',
    locationId: '',
    status: 'active'
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [ipData, locationData] = await Promise.all([
        settingsApi.getLocationsIp(),
        settingsApi.getLocations()
      ])
      setLocationsIp(ipData)
      setLocations(locationData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const data = {
        ...formData,
        locationId: parseInt(formData.locationId)
      }

      if (editingItem) {
        await settingsApi.updateLocationsIp(editingItem.id, data)
      } else {
        await settingsApi.createLocationsIp(data)
      }

      setShowDialog(false)
      resetForm()
      fetchData()
    } catch (error) {
      console.error('Error saving:', error)
    }
  }

  const handleEdit = (item: LocationsIp) => {
    setEditingItem(item)
    setFormData({
      ip: item.ip,
      locationId: (item.location_id || item.locationId).toString(),
      status: item.status
    })
    setShowDialog(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this IP configuration?')) return

    try {
      await settingsApi.deleteLocationsIp(id)
      fetchData()
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      ip: '',
      locationId: '',
      status: 'active'
    })
    setEditingItem(null)
  }

  const getLocationName = (item: LocationsIp) => {
    return item.location_name || 'Unknown'
  }

  const getStatusBadge = (status: string) => {
    return (
      <Badge className={status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
        {status.toUpperCase()}
      </Badge>
    )
  }

  return (
    <PrivateRoute modulePath="admin/settings/locations-ip" action="view">
      <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Locations IP Management</h1>
          <p className="text-gray-600">Manage IP addresses for different locations</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add IP Configuration
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Network className="h-5 w-5" />
            <span>IP Configurations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IP Address</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : locationsIp.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                    No IP configurations found
                  </TableCell>
                </TableRow>
              ) : (
                locationsIp.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono">{item.ip}</TableCell>
                    <TableCell>{getLocationName(item)}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
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
            <DialogTitle>
              {editingItem ? 'Edit IP Configuration' : 'Add IP Configuration'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="ip">IP Address</Label>
              <Input
                id="ip"
                placeholder="192.168.1.100"
                value={formData.ip}
                onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Select
                value={formData.locationId}
                onValueChange={(value) => setFormData({ ...formData, locationId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id.toString()}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </PrivateRoute>
  )
}
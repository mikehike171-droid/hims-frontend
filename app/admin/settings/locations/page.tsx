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
  MapPin,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

export default function LocationsPage() {
  const permissions = usePermissions()
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false)
  const [isNewLocation, setIsNewLocation] = useState(false)
  const [locationErrors, setLocationErrors] = useState<any>({})
  const [locations, setLocations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  const fetchLocations = useCallback(async () => {
    try {
      const selectedBranchId = authService.getSelectedBranchId()
      const locationId = selectedBranchId ? parseInt(selectedBranchId) : undefined
      const data = await settingsApi.getLocations(locationId)
      setLocations(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching locations:', error)
      setLocations([])
      toast({
        title: "Error",
        description: "Failed to fetch locations",
        variant: "destructive",
      })
    }
  }, [])

  useEffect(() => {
    if (!initialized) {
      fetchLocations()
      setInitialized(true)
    }
  }, [initialized])

  const validateLocationForm = () => {
    const errors: any = {}
    if (!selectedLocation?.locationCode?.trim()) errors.locationCode = 'Location code is required'
    if (!selectedLocation?.name?.trim()) errors.name = 'Location name is required'
    if (!selectedLocation?.address?.trim()) errors.address = 'Address is required'
    if (!selectedLocation?.phone?.trim()) errors.phone = 'Phone is required'
    if (selectedLocation?.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(selectedLocation.email)) {
      errors.email = 'Please enter a valid email address'
    }
    setLocationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleLocationSave = async () => {
    if (!validateLocationForm()) return

    try {
      setLoading(true)
      const token = authService.getCurrentToken()
      const settingsApiUrl = authService.getSettingsApiUrl()

      if (!token) return

      const url = isNewLocation
        ? `${settingsApiUrl}/locations`
        : `${settingsApiUrl}/locations/${selectedLocation.id}`

      const method = isNewLocation ? 'POST' : 'PATCH'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedLocation)
      })

      if (response.ok) {
        toast({
          title: isNewLocation ? "Location Created" : "Location Updated",
          description: `Location ${selectedLocation?.name} has been ${isNewLocation ? "created" : "updated"} successfully.`,
        })
        setIsLocationDialogOpen(false)
        setSelectedLocation(null)
        fetchLocations()
      } else if (response.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Please login again",
          variant: "destructive",
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to save location')
      }
    } catch (error) {
      console.error('Error saving location:', error)
      toast({
        title: "Error",
        description: `Failed to ${isNewLocation ? "create" : "update"} location`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLocationDelete = async (locationId: number) => {
    try {
      setLoading(true)
      const token = authService.getCurrentToken()
      const settingsApiUrl = authService.getSettingsApiUrl()

      if (!token) return

      const response = await fetch(`${settingsApiUrl}/locations/${locationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        toast({
          title: "Location Deleted",
          description: "Location has been deleted successfully.",
          variant: "destructive",
        })
        fetchLocations()
      } else {
        throw new Error('Failed to delete location')
      }
    } catch (error) {
      console.error('Error deleting location:', error)
      toast({
        title: "Error",
        description: "Failed to delete location",
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
            <h1 className="text-3xl font-bold text-gray-900">Location Management</h1>
            <p className="text-gray-600">Manage hospital locations and branch settings</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Locations</span>
              </CardTitle>
              {hasPermission(permissions, 'admin/settings/locations', 'add') && (
                <Button
                  onClick={() => {
                    setSelectedLocation({
                      locationCode: "",
                      name: "",
                      address: "",
                      phone: "",
                      email: "",
                      isActive: true,
                    })
                    setIsNewLocation(true)
                    setIsLocationDialogOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(locations || []).map((location) => (
                <Card
                  key={location.id}
                  className={`border ${location.isMainBranch ? "border-l-4 border-l-yellow-500" : ""}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold">{location.name}</h3>
                          <Badge variant="outline">{location.locationCode}</Badge>
                          <Badge variant={location.isActive ? "default" : "secondary"}>
                            {location.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center space-x-2 text-sm">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{location.address}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-sm">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span>{location.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span>{location.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {hasPermission(permissions, 'admin/settings/locations', 'edit') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedLocation({
                                id: location.id,
                                locationCode: location.locationCode,
                                name: location.name,
                                address: location.address,
                                phone: location.phone,
                                email: location.email,
                                isActive: location.isActive
                              })
                              setIsNewLocation(false)
                              setIsLocationDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        )}
                        {hasPermission(permissions, 'admin/settings/locations', 'delete') && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 bg-transparent"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Location</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {location.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleLocationDelete(location.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Location Dialog */}
        <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{isNewLocation ? "Add New Location" : "Edit Location"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="locationCode">Location Code <span className="text-red-500">*</span></Label>
                <Input
                  id="locationCode"
                  value={selectedLocation?.locationCode || ""}
                  onChange={(e) => {
                    setSelectedLocation((prev) => ({ ...prev, locationCode: e.target.value }))
                    if (locationErrors.locationCode) {
                      setLocationErrors((prev) => ({ ...prev, locationCode: null }))
                    }
                  }}
                  placeholder="e.g., LOC001"
                  className={locationErrors.locationCode ? "border-red-500" : ""}
                />
                {locationErrors.locationCode && (
                  <p className="text-sm text-red-500">{locationErrors.locationCode}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationName">Location Name <span className="text-red-500">*</span></Label>
                <Input
                  id="locationName"
                  value={selectedLocation?.name || ""}
                  onChange={(e) => {
                    setSelectedLocation((prev) => ({ ...prev, name: e.target.value }))
                    if (locationErrors.name) {
                      setLocationErrors((prev) => ({ ...prev, name: null }))
                    }
                  }}
                  placeholder="e.g., Main Hospital"
                  className={locationErrors.name ? "border-red-500" : ""}
                />
                {locationErrors.name && (
                  <p className="text-sm text-red-500">{locationErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationAddress">Address <span className="text-red-500">*</span></Label>
                <Input
                  id="locationAddress"
                  value={selectedLocation?.address || ""}
                  onChange={(e) => {
                    setSelectedLocation((prev) => ({ ...prev, address: e.target.value }))
                    if (locationErrors.address) {
                      setLocationErrors((prev) => ({ ...prev, address: null }))
                    }
                  }}
                  placeholder="e.g., 123 Medical Street"
                  className={locationErrors.address ? "border-red-500" : ""}
                />
                {locationErrors.address && (
                  <p className="text-sm text-red-500">{locationErrors.address}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationPhone">Phone <span className="text-red-500">*</span></Label>
                <Input
                  id="locationPhone"
                  value={selectedLocation?.phone || ""}
                  onChange={(e) => {
                    setSelectedLocation((prev) => ({ ...prev, phone: e.target.value }))
                    if (locationErrors.phone) {
                      setLocationErrors((prev) => ({ ...prev, phone: null }))
                    }
                  }}
                  placeholder="e.g., +91 80 1234 5678"
                  className={locationErrors.phone ? "border-red-500" : ""}
                />
                {locationErrors.phone && (
                  <p className="text-sm text-red-500">{locationErrors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationEmail">Email</Label>
                <Input
                  id="locationEmail"
                  type="email"
                  value={selectedLocation?.email || ""}
                  onChange={(e) => {
                    setSelectedLocation((prev) => ({ ...prev, email: e.target.value }))
                    if (locationErrors.email) {
                      setLocationErrors((prev) => ({ ...prev, email: null }))
                    }
                  }}
                  placeholder="e.g., main@hospital.com"
                  className={locationErrors.email ? "border-red-500" : ""}
                />
                {locationErrors.email && (
                  <p className="text-sm text-red-500">{locationErrors.email}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="locationActive">Active Status</Label>
                <Switch
                  id="locationActive"
                  checked={selectedLocation?.isActive || false}
                  onCheckedChange={(checked) => setSelectedLocation((prev) => ({ ...prev, isActive: checked }))}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsLocationDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleLocationSave} className="bg-red-600 hover:bg-red-700" disabled={loading}>
                  {loading ? "Saving..." : (isNewLocation ? "Create Location" : "Update Location")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PrivateRoute>
  )
}
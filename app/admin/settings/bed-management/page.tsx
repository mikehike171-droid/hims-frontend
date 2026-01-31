"use client"

import { useState } from "react"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Bed, Users, DollarSign } from "lucide-react"

const bedTypes = [
  {
    id: 1,
    name: "General Ward",
    category: "Standard",
    cashPrice: 1500,
    insurancePrice: 2000,
    sharing: "4-bed sharing",
    amenities: ["Basic bed", "Shared bathroom", "Visitor chair"],
    status: "active",
    totalBeds: 40,
    occupiedBeds: 32,
  },
  {
    id: 2,
    name: "Semi-Private",
    category: "Premium",
    cashPrice: 3000,
    insurancePrice: 3500,
    sharing: "2-bed sharing",
    amenities: ["Comfortable bed", "Shared bathroom", "TV", "Visitor sofa"],
    status: "active",
    totalBeds: 20,
    occupiedBeds: 15,
  },
  {
    id: 3,
    name: "Private Room",
    category: "Deluxe",
    cashPrice: 5000,
    insurancePrice: 6000,
    sharing: "Single occupancy",
    amenities: ["Premium bed", "Private bathroom", "TV", "Refrigerator", "Visitor bed"],
    status: "active",
    totalBeds: 15,
    occupiedBeds: 12,
  },
  {
    id: 4,
    name: "ICU Bed",
    category: "Critical",
    cashPrice: 8000,
    insurancePrice: 10000,
    sharing: "Single occupancy",
    amenities: ["ICU bed", "Ventilator support", "24/7 monitoring", "Specialized equipment"],
    status: "active",
    totalBeds: 10,
    occupiedBeds: 8,
  },
  {
    id: 5,
    name: "VIP Suite",
    category: "Luxury",
    cashPrice: 12000,
    insurancePrice: 15000,
    sharing: "Single occupancy",
    amenities: ["Luxury bed", "Private bathroom", "Living area", "Kitchenette", "Attendant bed"],
    status: "active",
    totalBeds: 5,
    occupiedBeds: 3,
  },
]

export default function BedManagementSettings() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedBedType, setSelectedBedType] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    cashPrice: "",
    insurancePrice: "",
    sharing: "",
    amenities: "",
    description: "",
    totalBeds: "",
  })

  const handleCreateBedType = () => {
    setFormData({
      name: "",
      category: "",
      cashPrice: "",
      insurancePrice: "",
      sharing: "",
      amenities: "",
      description: "",
      totalBeds: "",
    })
    setIsCreateDialogOpen(true)
  }

  const handleEditBedType = (bedType: any) => {
    setSelectedBedType(bedType)
    setFormData({
      name: bedType.name,
      category: bedType.category,
      cashPrice: bedType.cashPrice.toString(),
      insurancePrice: bedType.insurancePrice.toString(),
      sharing: bedType.sharing,
      amenities: bedType.amenities.join(", "),
      description: "",
      totalBeds: bedType.totalBeds.toString(),
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteBedType = (id: number) => {
    console.log("Deleting bed type:", id)
  }

  const handleSave = () => {
    console.log("Saving bed type:", formData)
    setIsCreateDialogOpen(false)
    setIsEditDialogOpen(false)
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "standard":
        return "bg-blue-100 text-blue-800"
      case "premium":
        return "bg-purple-100 text-purple-800"
      case "deluxe":
        return "bg-green-100 text-green-800"
      case "critical":
        return "bg-red-100 text-red-800"
      case "luxury":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <PrivateRoute modulePath="admin/settings/bed-management" action="view">
      <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bed Type Management</h1>
            <p className="text-gray-600 mt-1">Configure bed types, pricing, and categories</p>
          </div>
          <Button onClick={handleCreateBedType} className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Bed Type
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bed Types</p>
                  <p className="text-2xl font-bold text-gray-900">{bedTypes.length}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-50">
                  <Bed className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Beds</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {bedTypes.reduce((sum, bed) => sum + bed.totalBeds, 0)}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-50">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Occupied Beds</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {bedTypes.reduce((sum, bed) => sum + bed.occupiedBeds, 0)}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-orange-50">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(
                      (bedTypes.reduce((sum, bed) => sum + bed.occupiedBeds, 0) /
                        bedTypes.reduce((sum, bed) => sum + bed.totalBeds, 0)) *
                        100,
                    )}
                    %
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-50">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bed Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bedTypes.map((bedType) => (
            <Card key={bedType.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{bedType.name}</CardTitle>
                    <Badge className={`mt-2 ${getCategoryColor(bedType.category)}`}>{bedType.category}</Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditBedType(bedType)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteBedType(bedType.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Pricing */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Pricing (per day)</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="p-2 bg-green-50 rounded">
                        <p className="text-xs text-gray-600">Cash Price</p>
                        <p className="font-semibold text-green-700">₹{bedType.cashPrice.toLocaleString()}</p>
                      </div>
                      <div className="p-2 bg-blue-50 rounded">
                        <p className="text-xs text-gray-600">Insurance Price</p>
                        <p className="font-semibold text-blue-700">₹{bedType.insurancePrice.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Occupancy */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Occupancy</h4>
                    <div className="flex items-center justify-between text-sm">
                      <span>{bedType.sharing}</span>
                      <span className="font-medium">
                        {bedType.occupiedBeds}/{bedType.totalBeds}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-red-600 h-2 rounded-full"
                        style={{ width: `${(bedType.occupiedBeds / bedType.totalBeds) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-1">
                      {bedType.amenities.slice(0, 3).map((amenity, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {bedType.amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{bedType.amenities.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Bed Type Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Bed Type</DialogTitle>
              <DialogDescription>Configure a new bed type with pricing and amenities.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Bed Type Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter bed type name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="deluxe">Deluxe</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cashPrice">Cash Price (₹/day)</Label>
                  <Input
                    id="cashPrice"
                    type="number"
                    value={formData.cashPrice}
                    onChange={(e) => setFormData({ ...formData, cashPrice: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="insurancePrice">Insurance Price (₹/day)</Label>
                  <Input
                    id="insurancePrice"
                    type="number"
                    value={formData.insurancePrice}
                    onChange={(e) => setFormData({ ...formData, insurancePrice: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="sharing">Sharing Type</Label>
                  <Select
                    value={formData.sharing}
                    onValueChange={(value) => setFormData({ ...formData, sharing: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sharing type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single occupancy</SelectItem>
                      <SelectItem value="2-bed">2-bed sharing</SelectItem>
                      <SelectItem value="4-bed">4-bed sharing</SelectItem>
                      <SelectItem value="6-bed">6-bed sharing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="totalBeds">Total Beds</Label>
                  <Input
                    id="totalBeds"
                    type="number"
                    value={formData.totalBeds}
                    onChange={(e) => setFormData({ ...formData, totalBeds: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amenities">Amenities (comma separated)</Label>
                <Textarea
                  id="amenities"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  placeholder="Basic bed, Shared bathroom, Visitor chair"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter bed type description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
                Create Bed Type
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Bed Type Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Bed Type</DialogTitle>
              <DialogDescription>Update bed type configuration.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Bed Type Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter bed type name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="deluxe">Deluxe</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-cashPrice">Cash Price (₹/day)</Label>
                  <Input
                    id="edit-cashPrice"
                    type="number"
                    value={formData.cashPrice}
                    onChange={(e) => setFormData({ ...formData, cashPrice: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-insurancePrice">Insurance Price (₹/day)</Label>
                  <Input
                    id="edit-insurancePrice"
                    type="number"
                    value={formData.insurancePrice}
                    onChange={(e) => setFormData({ ...formData, insurancePrice: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-sharing">Sharing Type</Label>
                  <Select
                    value={formData.sharing}
                    onValueChange={(value) => setFormData({ ...formData, sharing: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sharing type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single occupancy</SelectItem>
                      <SelectItem value="2-bed">2-bed sharing</SelectItem>
                      <SelectItem value="4-bed">4-bed sharing</SelectItem>
                      <SelectItem value="6-bed">6-bed sharing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-totalBeds">Total Beds</Label>
                  <Input
                    id="edit-totalBeds"
                    type="number"
                    value={formData.totalBeds}
                    onChange={(e) => setFormData({ ...formData, totalBeds: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-amenities">Amenities (comma separated)</Label>
                <Textarea
                  id="edit-amenities"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  placeholder="Basic bed, Shared bathroom, Visitor chair"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter bed type description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
                Update Bed Type
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      </div>
    </PrivateRoute>
  )
}

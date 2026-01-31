"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, X, Building, User, MapPin, CreditCard } from "lucide-react"
import Link from "next/link"

export default function CreateVendorPage() {
  const [formData, setFormData] = useState({
    vendorName: "",
    vendorCode: "",
    contactPerson: "",
    designation: "",
    phone: "",
    email: "",
    alternatePhone: "",
    alternateEmail: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    gstin: "",
    pan: "",
    vendorType: "",
    category: "",
    creditDays: "",
    creditLimit: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    isActive: true,
    taxExempt: false,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-blue-50 via-green-50 to-orange-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/material-management/vendors">
            <Button
              variant="outline"
              size="sm"
              className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vendors
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Vendor</h1>
            <p className="text-gray-600">Create a new vendor profile</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription className="text-blue-100">Enter vendor basic details</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendorName" className="text-gray-700 font-medium">
                    Vendor Name *
                  </Label>
                  <Input
                    id="vendorName"
                    value={formData.vendorName}
                    onChange={(e) => handleInputChange("vendorName", e.target.value)}
                    placeholder="Enter vendor name"
                    className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendorCode" className="text-gray-700 font-medium">
                    Vendor Code *
                  </Label>
                  <Input
                    id="vendorCode"
                    value={formData.vendorCode}
                    onChange={(e) => handleInputChange("vendorCode", e.target.value)}
                    placeholder="Enter vendor code"
                    className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendorType" className="text-gray-700 font-medium">
                    Vendor Type *
                  </Label>
                  <Select value={formData.vendorType} onValueChange={(value) => handleInputChange("vendorType", value)}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-400 focus:ring-blue-400">
                      <SelectValue placeholder="Select vendor type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manufacturer">Manufacturer</SelectItem>
                      <SelectItem value="distributor">Distributor</SelectItem>
                      <SelectItem value="wholesaler">Wholesaler</SelectItem>
                      <SelectItem value="retailer">Retailer</SelectItem>
                      <SelectItem value="service-provider">Service Provider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-gray-700 font-medium">
                    Category *
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="border-gray-200 focus:border-blue-400 focus:ring-blue-400">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="surgical">Surgical</SelectItem>
                      <SelectItem value="medical-devices">Medical Devices</SelectItem>
                      <SelectItem value="consumables">Consumables</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange("isActive", checked as boolean)}
                  />
                  <Label htmlFor="isActive" className="text-gray-700">
                    Active Vendor
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="taxExempt"
                    checked={formData.taxExempt}
                    onCheckedChange={(checked) => handleInputChange("taxExempt", checked as boolean)}
                  />
                  <Label htmlFor="taxExempt" className="text-gray-700">
                    Tax Exempt
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-500 to-orange-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription className="text-green-100">Primary contact details</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson" className="text-gray-700 font-medium">
                    Contact Person *
                  </Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                    placeholder="Enter contact person name"
                    className="border-gray-200 focus:border-green-400 focus:ring-green-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation" className="text-gray-700 font-medium">
                    Designation
                  </Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) => handleInputChange("designation", e.target.value)}
                    placeholder="Enter designation"
                    className="border-gray-200 focus:border-green-400 focus:ring-green-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter phone number"
                    className="border-gray-200 focus:border-green-400 focus:ring-green-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter email address"
                    className="border-gray-200 focus:border-green-400 focus:ring-green-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="alternatePhone" className="text-gray-700 font-medium">
                    Alternate Phone
                  </Label>
                  <Input
                    id="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={(e) => handleInputChange("alternatePhone", e.target.value)}
                    placeholder="Enter alternate phone"
                    className="border-gray-200 focus:border-green-400 focus:ring-green-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alternateEmail" className="text-gray-700 font-medium">
                    Alternate Email
                  </Label>
                  <Input
                    id="alternateEmail"
                    type="email"
                    value={formData.alternateEmail}
                    onChange={(e) => handleInputChange("alternateEmail", e.target.value)}
                    placeholder="Enter alternate email"
                    className="border-gray-200 focus:border-green-400 focus:ring-green-400"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Address Information */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address Information
              </CardTitle>
              <CardDescription className="text-orange-100">Vendor address details</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-700 font-medium">
                  Address *
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter complete address"
                  className="border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-gray-700 font-medium">
                    City *
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Enter city"
                    className="border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-gray-700 font-medium">
                    State *
                  </Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="Enter state"
                    className="border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pincode" className="text-gray-700 font-medium">
                    Pincode *
                  </Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value)}
                    placeholder="Enter pincode"
                    className="border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-gray-700 font-medium">
                    Country *
                  </Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    placeholder="Enter country"
                    className="border-gray-200 focus:border-orange-400 focus:ring-orange-400"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-red-500 to-blue-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Financial Information
              </CardTitle>
              <CardDescription className="text-red-100">Tax and payment details</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gstin" className="text-gray-700 font-medium">
                    GSTIN
                  </Label>
                  <Input
                    id="gstin"
                    value={formData.gstin}
                    onChange={(e) => handleInputChange("gstin", e.target.value)}
                    placeholder="Enter GSTIN"
                    className="border-gray-200 focus:border-red-400 focus:ring-red-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pan" className="text-gray-700 font-medium">
                    PAN Number
                  </Label>
                  <Input
                    id="pan"
                    value={formData.pan}
                    onChange={(e) => handleInputChange("pan", e.target.value)}
                    placeholder="Enter PAN number"
                    className="border-gray-200 focus:border-red-400 focus:ring-red-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="creditDays" className="text-gray-700 font-medium">
                    Credit Days
                  </Label>
                  <Input
                    id="creditDays"
                    type="number"
                    value={formData.creditDays}
                    onChange={(e) => handleInputChange("creditDays", e.target.value)}
                    placeholder="Enter credit days"
                    className="border-gray-200 focus:border-red-400 focus:ring-red-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="creditLimit" className="text-gray-700 font-medium">
                    Credit Limit (₹)
                  </Label>
                  <Input
                    id="creditLimit"
                    type="number"
                    value={formData.creditLimit}
                    onChange={(e) => handleInputChange("creditLimit", e.target.value)}
                    placeholder="Enter credit limit"
                    className="border-gray-200 focus:border-red-400 focus:ring-red-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankName" className="text-gray-700 font-medium">
                  Bank Name
                </Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange("bankName", e.target.value)}
                  placeholder="Enter bank name"
                  className="border-gray-200 focus:border-red-400 focus:ring-red-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber" className="text-gray-700 font-medium">
                    Account Number
                  </Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                    placeholder="Enter account number"
                    className="border-gray-200 focus:border-red-400 focus:ring-red-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ifscCode" className="text-gray-700 font-medium">
                    IFSC Code
                  </Label>
                  <Input
                    id="ifscCode"
                    value={formData.ifscCode}
                    onChange={(e) => handleInputChange("ifscCode", e.target.value)}
                    placeholder="Enter IFSC code"
                    className="border-gray-200 focus:border-red-400 focus:ring-red-400"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex justify-end gap-4">
              <Link href="/material-management/vendors">
                <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Create Vendor
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

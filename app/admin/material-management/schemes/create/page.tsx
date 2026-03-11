"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ArrowLeft, Save, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function CreateSchemePage() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [formData, setFormData] = useState({
    schemeName: "",
    schemeType: "",
    vendor: "",
    description: "",
    targetValue: "",
    discountRate: "",
    paymentTerms: "",
    conditions: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", { ...formData, startDate, endDate })
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-red-50 via-orange-50 to-blue-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/material-management/schemes">
            <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Schemes
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Scheme</h1>
            <p className="text-gray-600">Set up a new vendor discount scheme</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription className="text-red-100">Enter the basic details of the scheme</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schemeName" className="text-gray-700 font-medium">
                      Scheme Name *
                    </Label>
                    <Input
                      id="schemeName"
                      value={formData.schemeName}
                      onChange={(e) => handleInputChange("schemeName", e.target.value)}
                      placeholder="Enter scheme name"
                      className="border-gray-200 focus:border-red-400 focus:ring-red-400"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schemeType" className="text-gray-700 font-medium">
                      Scheme Type *
                    </Label>
                    <Select
                      value={formData.schemeType}
                      onValueChange={(value) => handleInputChange("schemeType", value)}
                    >
                      <SelectTrigger className="border-gray-200 focus:border-red-400 focus:ring-red-400">
                        <SelectValue placeholder="Select scheme type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="volume-discount">Volume Discount</SelectItem>
                        <SelectItem value="payment-terms">Payment Terms Discount</SelectItem>
                        <SelectItem value="rebate">Quarterly Rebate</SelectItem>
                        <SelectItem value="annual-bonus">Annual Bonus</SelectItem>
                        <SelectItem value="loyalty-discount">Loyalty Discount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendor" className="text-gray-700 font-medium">
                    Vendor *
                  </Label>
                  <Select value={formData.vendor} onValueChange={(value) => handleInputChange("vendor", value)}>
                    <SelectTrigger className="border-gray-200 focus:border-red-400 focus:ring-red-400">
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="medsupply-corp">MedSupply Corporation</SelectItem>
                      <SelectItem value="pharma-plus">Pharma Plus Ltd</SelectItem>
                      <SelectItem value="surgical-supplies">Surgical Supplies Inc</SelectItem>
                      <SelectItem value="medical-devices">Medical Devices Co</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700 font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Enter scheme description"
                    className="border-gray-200 focus:border-red-400 focus:ring-red-400"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">Start Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal border-gray-200 focus:border-red-400",
                            !startDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Pick start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium">End Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal border-gray-200 focus:border-red-400",
                            !endDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "Pick end date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scheme Details */}
          <div>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-lg">
                <CardTitle>Scheme Details</CardTitle>
                <CardDescription className="text-blue-100">Configure scheme parameters</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="targetValue" className="text-gray-700 font-medium">
                    Target Value (₹)
                  </Label>
                  <Input
                    id="targetValue"
                    type="number"
                    value={formData.targetValue}
                    onChange={(e) => handleInputChange("targetValue", e.target.value)}
                    placeholder="Enter target value"
                    className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountRate" className="text-gray-700 font-medium">
                    Discount Rate (%)
                  </Label>
                  <Input
                    id="discountRate"
                    type="number"
                    step="0.1"
                    value={formData.discountRate}
                    onChange={(e) => handleInputChange("discountRate", e.target.value)}
                    placeholder="Enter discount rate"
                    className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentTerms" className="text-gray-700 font-medium">
                    Payment Terms
                  </Label>
                  <Select
                    value={formData.paymentTerms}
                    onValueChange={(value) => handleInputChange("paymentTerms", value)}
                  >
                    <SelectTrigger className="border-gray-200 focus:border-blue-400 focus:ring-blue-400">
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="15-days">15 Days</SelectItem>
                      <SelectItem value="30-days">30 Days</SelectItem>
                      <SelectItem value="45-days">45 Days</SelectItem>
                      <SelectItem value="60-days">60 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conditions" className="text-gray-700 font-medium">
                    Terms & Conditions
                  </Label>
                  <Textarea
                    id="conditions"
                    value={formData.conditions}
                    onChange={(e) => handleInputChange("conditions", e.target.value)}
                    placeholder="Enter terms and conditions"
                    className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex justify-end gap-4">
              <Link href="/material-management/schemes">
                <Button variant="outline" className="border-gray-300 text-gray-600 hover:bg-gray-50 bg-transparent">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Create Scheme
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

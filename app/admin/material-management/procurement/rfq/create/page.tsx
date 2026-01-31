"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function CreateRFQPage() {
  const [formData, setFormData] = useState({
    rfqNumber: "",
    rfqDate: "",
    quoteDueDate: "",
    terms: "",
    remarks: "",
  })

  const [selectedIndents, setSelectedIndents] = useState<string[]>([])
  const [selectedVendors, setSelectedVendors] = useState<string[]>([])

  const indents = [
    { id: "IND-2024-001234", department: "ICU", items: 12, value: 45000 },
    { id: "IND-2024-001235", department: "Pharmacy", items: 25, value: 125000 },
    { id: "IND-2024-001236", department: "OT-1", items: 8, value: 32000 },
  ]

  const vendors = [
    { id: "VEN001", name: "MedSupply Corporation", rating: 8.5 },
    { id: "VEN002", name: "Pharma Plus Ltd", rating: 9.2 },
    { id: "VEN003", name: "Surgical Supplies Inc", rating: 7.8 },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", { formData, selectedIndents, selectedVendors })
  }

  const toggleIndent = (indentId: string) => {
    setSelectedIndents((prev) => (prev.includes(indentId) ? prev.filter((id) => id !== indentId) : [...prev, indentId]))
  }

  const toggleVendor = (vendorId: string) => {
    setSelectedVendors((prev) => (prev.includes(vendorId) ? prev.filter((id) => id !== vendorId) : [...prev, vendorId]))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/material-management/procurement">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Procurement
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create RFQ</h1>
          <p className="text-muted-foreground">Create a new Request for Quotation</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* RFQ Details */}
          <Card>
            <CardHeader>
              <CardTitle>RFQ Details</CardTitle>
              <CardDescription>Enter the basic RFQ information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rfqNumber">RFQ Number *</Label>
                  <Input
                    id="rfqNumber"
                    value={formData.rfqNumber}
                    onChange={(e) => setFormData({ ...formData, rfqNumber: e.target.value })}
                    placeholder="Auto-generated"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rfqDate">RFQ Date *</Label>
                  <Input
                    id="rfqDate"
                    type="date"
                    value={formData.rfqDate}
                    onChange={(e) => setFormData({ ...formData, rfqDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quoteDueDate">Quote Due Date *</Label>
                <Input
                  id="quoteDueDate"
                  type="date"
                  value={formData.quoteDueDate}
                  onChange={(e) => setFormData({ ...formData, quoteDueDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  placeholder="Enter terms and conditions"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="Enter any additional remarks"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Select Indents */}
          <Card>
            <CardHeader>
              <CardTitle>Select Indents</CardTitle>
              <CardDescription>Choose approved indents to include in RFQ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {indents.map((indent) => (
                  <div key={indent.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={indent.id}
                      checked={selectedIndents.includes(indent.id)}
                      onCheckedChange={() => toggleIndent(indent.id)}
                    />
                    <div className="flex-1">
                      <div className="font-medium">{indent.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {indent.department} • {indent.items} items • ₹{indent.value.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Select Vendors */}
        <Card>
          <CardHeader>
            <CardTitle>Select Vendors</CardTitle>
            <CardDescription>Choose vendors to send RFQ to</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vendors.map((vendor) => (
                <div key={vendor.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={vendor.id}
                    checked={selectedVendors.includes(vendor.id)}
                    onCheckedChange={() => toggleVendor(vendor.id)}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{vendor.name}</div>
                    <div className="text-sm text-muted-foreground">Rating: {vendor.rating}/10</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/material-management/procurement">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Create RFQ
          </Button>
        </div>
      </form>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

export default function CreateGRNPage() {
  const [formData, setFormData] = useState({
    grnNumber: "",
    grnDate: "",
    poNumber: "",
    vendor: "",
    invoiceNumber: "",
    invoiceDate: "",
    vehicleNumber: "",
    receivedBy: "",
    remarks: "",
  })

  const [grnItems, setGrnItems] = useState([
    {
      itemCode: "",
      itemName: "",
      orderedQty: "",
      receivedQty: "",
      acceptedQty: "",
      rejectedQty: "",
      batchNumber: "",
      expiryDate: "",
      remarks: "",
    },
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", { formData, grnItems })
  }

  const addItem = () => {
    setGrnItems([
      ...grnItems,
      {
        itemCode: "",
        itemName: "",
        orderedQty: "",
        receivedQty: "",
        acceptedQty: "",
        rejectedQty: "",
        batchNumber: "",
        expiryDate: "",
        remarks: "",
      },
    ])
  }

  const removeItem = (index: number) => {
    setGrnItems(grnItems.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: string) => {
    const updated = grnItems.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    setGrnItems(updated)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/material-management/inbound">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inbound
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create GRN</h1>
          <p className="text-muted-foreground">Create a new Goods Receipt Note</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* GRN Details */}
        <Card>
          <CardHeader>
            <CardTitle>GRN Details</CardTitle>
            <CardDescription>Enter the basic GRN information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grnNumber">GRN Number *</Label>
                <Input
                  id="grnNumber"
                  value={formData.grnNumber}
                  onChange={(e) => setFormData({ ...formData, grnNumber: e.target.value })}
                  placeholder="Auto-generated"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grnDate">GRN Date *</Label>
                <Input
                  id="grnDate"
                  type="date"
                  value={formData.grnDate}
                  onChange={(e) => setFormData({ ...formData, grnDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="poNumber">PO Number *</Label>
                <Select
                  value={formData.poNumber}
                  onValueChange={(value) => setFormData({ ...formData, poNumber: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select PO" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PO-2024-001234">PO-2024-001234</SelectItem>
                    <SelectItem value="PO-2024-001235">PO-2024-001235</SelectItem>
                    <SelectItem value="PO-2024-001236">PO-2024-001236</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                <Input
                  id="vendor"
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  placeholder="Auto-filled from PO"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receivedBy">Received By *</Label>
                <Input
                  id="receivedBy"
                  value={formData.receivedBy}
                  onChange={(e) => setFormData({ ...formData, receivedBy: e.target.value })}
                  placeholder="e.g., Store Keeper"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  placeholder="e.g., INV-2024-001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoiceDate">Invoice Date</Label>
                <Input
                  id="invoiceDate"
                  type="date"
                  value={formData.invoiceDate}
                  onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                <Input
                  id="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                  placeholder="e.g., KA01AB1234"
                />
              </div>
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

        {/* GRN Items */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>GRN Items</CardTitle>
                <CardDescription>Record received items and quantities</CardDescription>
              </div>
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {grnItems.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-10 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label>Item Code</Label>
                    <Input
                      value={item.itemCode}
                      onChange={(e) => updateItem(index, "itemCode", e.target.value)}
                      placeholder="e.g., MED001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Item Name</Label>
                    <Input
                      value={item.itemName}
                      onChange={(e) => updateItem(index, "itemName", e.target.value)}
                      placeholder="e.g., Paracetamol 500mg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ordered Qty</Label>
                    <Input
                      type="number"
                      value={item.orderedQty}
                      onChange={(e) => updateItem(index, "orderedQty", e.target.value)}
                      placeholder="0"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Received Qty</Label>
                    <Input
                      type="number"
                      value={item.receivedQty}
                      onChange={(e) => updateItem(index, "receivedQty", e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Accepted Qty</Label>
                    <Input
                      type="number"
                      value={item.acceptedQty}
                      onChange={(e) => updateItem(index, "acceptedQty", e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rejected Qty</Label>
                    <Input
                      type="number"
                      value={item.rejectedQty}
                      onChange={(e) => updateItem(index, "rejectedQty", e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Batch Number</Label>
                    <Input
                      value={item.batchNumber}
                      onChange={(e) => updateItem(index, "batchNumber", e.target.value)}
                      placeholder="e.g., BAT001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Expiry Date</Label>
                    <Input
                      type="date"
                      value={item.expiryDate}
                      onChange={(e) => updateItem(index, "expiryDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Remarks</Label>
                    <Input
                      value={item.remarks}
                      onChange={(e) => updateItem(index, "remarks", e.target.value)}
                      placeholder="Optional"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={grnItems.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/material-management/inbound">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Create GRN
          </Button>
        </div>
      </form>
    </div>
  )
}

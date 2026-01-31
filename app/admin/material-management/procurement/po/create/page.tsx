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

export default function CreatePOPage() {
  const [formData, setFormData] = useState({
    poNumber: "",
    poDate: "",
    vendor: "",
    deliveryDate: "",
    deliveryAddress: "",
    terms: "",
    remarks: "",
  })

  const [poItems, setPoItems] = useState([
    { itemCode: "", itemName: "", orderedQty: "", unitPrice: "", discount: "", taxRate: "" },
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", { formData, poItems })
  }

  const addItem = () => {
    setPoItems([...poItems, { itemCode: "", itemName: "", orderedQty: "", unitPrice: "", discount: "", taxRate: "" }])
  }

  const removeItem = (index: number) => {
    setPoItems(poItems.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: string) => {
    const updated = poItems.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    setPoItems(updated)
  }

  const calculateItemTotal = (item: any) => {
    const qty = Number.parseFloat(item.orderedQty) || 0
    const price = Number.parseFloat(item.unitPrice) || 0
    const discount = Number.parseFloat(item.discount) || 0
    const taxRate = Number.parseFloat(item.taxRate) || 0

    const subtotal = qty * price
    const discountAmount = (subtotal * discount) / 100
    const taxableAmount = subtotal - discountAmount
    const taxAmount = (taxableAmount * taxRate) / 100

    return taxableAmount + taxAmount
  }

  const calculateGrandTotal = () => {
    return poItems.reduce((total, item) => total + calculateItemTotal(item), 0)
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
          <h1 className="text-3xl font-bold">Create Purchase Order</h1>
          <p className="text-muted-foreground">Create a new purchase order</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PO Details */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase Order Details</CardTitle>
            <CardDescription>Enter the basic PO information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="poNumber">PO Number *</Label>
                <Input
                  id="poNumber"
                  value={formData.poNumber}
                  onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                  placeholder="Auto-generated"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="poDate">PO Date *</Label>
                <Input
                  id="poDate"
                  type="date"
                  value={formData.poDate}
                  onChange={(e) => setFormData({ ...formData, poDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryDate">Delivery Date *</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor *</Label>
              <Select value={formData.vendor} onValueChange={(value) => setFormData({ ...formData, vendor: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medsupply">MedSupply Corporation</SelectItem>
                  <SelectItem value="pharmaplus">Pharma Plus Ltd</SelectItem>
                  <SelectItem value="surgical">Surgical Supplies Inc</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryAddress">Delivery Address</Label>
              <Textarea
                id="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                placeholder="Enter delivery address"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="terms">Terms & Conditions</Label>
              <Textarea
                id="terms"
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                placeholder="Enter terms and conditions"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                placeholder="Enter any additional remarks"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* PO Items */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Purchase Order Items</CardTitle>
                <CardDescription>Add items to be ordered</CardDescription>
              </div>
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {poItems.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-8 gap-4 p-4 border rounded-lg">
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
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit Price (₹)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Discount (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.discount}
                      onChange={(e) => updateItem(index, "discount", e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tax Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.taxRate}
                      onChange={(e) => updateItem(index, "taxRate", e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Total (₹)</Label>
                    <Input value={calculateItemTotal(item).toFixed(2)} disabled className="bg-muted" />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={poItems.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Summary */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Grand Total:</span>
                <span className="text-xl font-bold">₹{calculateGrandTotal().toFixed(2)}</span>
              </div>
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
            Create Purchase Order
          </Button>
        </div>
      </form>
    </div>
  )
}

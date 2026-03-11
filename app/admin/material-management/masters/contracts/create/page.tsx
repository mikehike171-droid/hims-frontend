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

export default function CreateContractPage() {
  const [formData, setFormData] = useState({
    contractNumber: "",
    contractName: "",
    vendor: "",
    startDate: "",
    endDate: "",
    description: "",
    terms: "",
  })

  const [contractItems, setContractItems] = useState([
    { itemCode: "", itemName: "", unitPrice: "", discountPercent: "" },
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", { formData, contractItems })
  }

  const addItem = () => {
    setContractItems([...contractItems, { itemCode: "", itemName: "", unitPrice: "", discountPercent: "" }])
  }

  const removeItem = (index: number) => {
    setContractItems(contractItems.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: string) => {
    const updated = contractItems.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    setContractItems(updated)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/material-management/masters">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Masters
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Create Rate Contract</h1>
          <p className="text-muted-foreground">Create a new vendor rate contract</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contract Details */}
        <Card>
          <CardHeader>
            <CardTitle>Contract Details</CardTitle>
            <CardDescription>Enter the basic contract information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contractNumber">Contract Number *</Label>
                <Input
                  id="contractNumber"
                  value={formData.contractNumber}
                  onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                  placeholder="e.g., RC-2024-001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contractName">Contract Name *</Label>
                <Input
                  id="contractName"
                  value={formData.contractName}
                  onChange={(e) => setFormData({ ...formData, contractName: e.target.value })}
                  placeholder="e.g., Annual Pharmacy Contract"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter contract description"
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
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contract Items */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Contract Items</CardTitle>
                <CardDescription>Add items and their contracted rates</CardDescription>
              </div>
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contractItems.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
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
                      value={item.discountPercent}
                      onChange={(e) => updateItem(index, "discountPercent", e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
                      disabled={contractItems.length === 1}
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
          <Link href="/material-management/masters">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Create Contract
          </Button>
        </div>
      </form>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Percent, DollarSign, Check } from "lucide-react"

interface DiscountRule {
  id: string
  name: string
  type: "percentage" | "fixed"
  value: number
  applicableTo: string
  conditions: any
  isActive: boolean
}

interface DiscountManagerProps {
  onDiscountApply: (discountAmount: number, discountName: string) => void
  consultationFee: number
}

export default function DiscountManager({ onDiscountApply, consultationFee }: DiscountManagerProps) {
  const [discountRules] = useState<DiscountRule[]>([
    {
      id: "1",
      name: "Senior Citizen (60+)",
      type: "percentage",
      value: 10,
      applicableTo: "all",
      conditions: { ageAbove: 60 },
      isActive: true,
    },
    {
      id: "2",
      name: "Staff Discount",
      type: "percentage",
      value: 20,
      applicableTo: "all",
      conditions: { employee: true },
      isActive: true,
    },
    {
      id: "3",
      name: "TCS Employee",
      type: "percentage",
      value: 15,
      applicableTo: "consultation",
      conditions: { company: "TCS" },
      isActive: true,
    },
    {
      id: "4",
      name: "Emergency Discount",
      type: "fixed",
      value: 500,
      applicableTo: "consultation",
      conditions: { emergency: true },
      isActive: true,
    },
    {
      id: "5",
      name: "Insurance Co-pay",
      type: "percentage",
      value: 80,
      applicableTo: "all",
      conditions: { insurance: true },
      isActive: true,
    },
  ])

  const [customDiscount, setCustomDiscount] = useState({
    type: "percentage" as "percentage" | "fixed",
    value: 0,
    reason: "",
  })

  const calculateDiscount = (rule: DiscountRule) => {
    if (rule.type === "percentage") {
      return (consultationFee * rule.value) / 100
    } else {
      return Math.min(rule.value, consultationFee)
    }
  }

  const handleRuleApply = (rule: DiscountRule) => {
    const discountAmount = calculateDiscount(rule)
    onDiscountApply(discountAmount, rule.name)
  }

  const handleCustomDiscount = () => {
    let discountAmount = 0
    if (customDiscount.type === "percentage") {
      discountAmount = (consultationFee * customDiscount.value) / 100
    } else {
      discountAmount = Math.min(customDiscount.value, consultationFee)
    }
    onDiscountApply(discountAmount, `Custom Discount - ${customDiscount.reason}`)
  }

  return (
    <div className="space-y-4">
      {/* Predefined Discount Rules */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Available Discounts</h3>
        {discountRules
          .filter((rule) => rule.isActive)
          .map((rule) => (
            <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${rule.type === "percentage" ? "bg-blue-100" : "bg-green-100"}`}>
                  {rule.type === "percentage" ? (
                    <Percent className="h-4 w-4 text-blue-600" />
                  ) : (
                    <DollarSign className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{rule.name}</p>
                  <p className="text-sm text-gray-600">
                    {rule.type === "percentage" ? `${rule.value}%` : `₹${rule.value}`} off
                    {rule.applicableTo !== "all" && ` on ${rule.applicableTo}`}
                  </p>
                  <p className="text-xs text-gray-500">Discount: ₹{calculateDiscount(rule).toFixed(2)}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRuleApply(rule)}
                className="hover:bg-red-50 hover:border-red-200"
              >
                Apply
              </Button>
            </div>
          ))}
      </div>

      {/* Custom Discount */}
      <Card className="border-orange-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-orange-800">Custom Discount (Requires Approval)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Discount Type</Label>
              <Select
                value={customDiscount.type}
                onValueChange={(value: "percentage" | "fixed") =>
                  setCustomDiscount((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Value</Label>
              <Input
                type="number"
                className="h-8"
                value={customDiscount.value}
                onChange={(e) => setCustomDiscount((prev) => ({ ...prev, value: Number(e.target.value) }))}
                placeholder={customDiscount.type === "percentage" ? "10" : "500"}
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">Reason</Label>
            <Input
              className="h-8"
              value={customDiscount.reason}
              onChange={(e) => setCustomDiscount((prev) => ({ ...prev, reason: e.target.value }))}
              placeholder="Enter reason for custom discount"
            />
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-gray-600">
              Discount: ₹
              {customDiscount.type === "percentage"
                ? ((consultationFee * customDiscount.value) / 100).toFixed(2)
                : Math.min(customDiscount.value, consultationFee).toFixed(2)}
            </span>
            <Button
              size="sm"
              onClick={handleCustomDiscount}
              disabled={!customDiscount.reason || customDiscount.value <= 0}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Request Approval
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Discount Suggestions */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-blue-800 flex items-center">
            <Check className="h-4 w-4 mr-2" />
            AI Discount Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="p-2 bg-white rounded border border-blue-200">
              <p className="text-sm font-medium text-blue-800">Loyalty Discount Eligible</p>
              <p className="text-xs text-blue-600">
                Patient has visited 5+ times this year. Suggest 5% loyalty discount.
              </p>
            </div>
            <div className="p-2 bg-white rounded border border-green-200">
              <p className="text-sm font-medium text-green-800">Insurance Pre-approval</p>
              <p className="text-xs text-green-600">Patient's insurance covers 80% of consultation fee.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

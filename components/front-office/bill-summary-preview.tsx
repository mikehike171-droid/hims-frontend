"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  User,
  Stethoscope,
  CalendarIcon,
  Clock,
  Printer,
  MessageSquare,
  CreditCard,
  Receipt,
  Phone,
  Mail,
} from "lucide-react"
import { format } from "date-fns"

interface BillItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
  category: "consultation" | "procedure" | "investigation" | "pharmacy" | "other"
}

interface Tax {
  name: string
  percentage: number
  amount: number
}

interface Discount {
  type: "percentage" | "fixed"
  percentage?: number
  amount?: number
  description: string
}

interface BillSummaryPreviewProps {
  patientName?: string
  patientId?: string
  doctorName?: string
  department?: string
  appointmentDate?: string
  appointmentTime?: string
  items?: BillItem[]
  taxes?: Tax[]
  discounts?: Discount[]
  onPrint?: () => void
  onSendWhatsApp?: () => void
  onCollectPayment?: () => void
}

export function BillSummaryPreview({
  patientName,
  patientId,
  doctorName,
  department,
  appointmentDate,
  appointmentTime,
  items = [],
  taxes = [],
  discounts = [],
  onPrint,
  onSendWhatsApp,
  onCollectPayment,
}: BillSummaryPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const calculations = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)

    let discountAmount = 0
    discounts.forEach((discount) => {
      if (discount.type === "percentage" && discount.percentage) {
        discountAmount += (subtotal * discount.percentage) / 100
      } else if (discount.type === "fixed" && discount.amount) {
        discountAmount += discount.amount
      }
    })

    const afterDiscount = subtotal - discountAmount

    let taxAmount = 0
    taxes.forEach((tax) => {
      const calculatedTax = (afterDiscount * tax.percentage) / 100
      taxAmount += calculatedTax
      tax.amount = calculatedTax
    })

    const total = afterDiscount + taxAmount

    return {
      subtotal,
      discountAmount,
      afterDiscount,
      taxAmount,
      total,
    }
  }, [items, taxes, discounts])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "consultation":
        return "bg-blue-100 text-blue-800"
      case "procedure":
        return "bg-green-100 text-green-800"
      case "investigation":
        return "bg-purple-100 text-purple-800"
      case "pharmacy":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!patientName) {
    return (
      <Card className="w-full h-fit sticky top-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Bill Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-sm">Select an appointment to view bill preview</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full h-fit sticky top-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Bill Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Patient Information */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-sm">{patientName}</p>
              <p className="text-xs text-gray-500">{patientId}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-sm">{doctorName}</p>
              <p className="text-xs text-gray-500">{department}</p>
            </div>
          </div>

          {appointmentDate && appointmentTime && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">{format(new Date(appointmentDate), "MMM dd, yyyy")}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {appointmentTime}
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Bill Items */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Services</h4>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="text-xs h-6 px-2">
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
          </div>

          <ScrollArea className={isExpanded ? "h-40" : "h-auto"}>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge className={getCategoryColor(item.category)} variant="secondary">
                        {item.category}
                      </Badge>
                    </div>
                    <p className="font-medium mt-1">{item.description}</p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} × ₹{item.rate.toLocaleString()}
                    </p>
                  </div>
                  <p className="font-semibold">₹{item.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        {/* Bill Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>₹{calculations.subtotal.toLocaleString()}</span>
          </div>

          {discounts.length > 0 && (
            <>
              {discounts.map((discount, index) => (
                <div key={index} className="flex justify-between text-sm text-green-600">
                  <span>{discount.description}</span>
                  <span>
                    -₹
                    {discount.type === "percentage" && discount.percentage
                      ? ((calculations.subtotal * discount.percentage) / 100).toLocaleString()
                      : discount.amount?.toLocaleString() || "0"}
                  </span>
                </div>
              ))}
              <div className="flex justify-between text-sm">
                <span>After Discount</span>
                <span>₹{calculations.afterDiscount.toLocaleString()}</span>
              </div>
            </>
          )}

          {taxes.length > 0 && (
            <>
              {taxes.map((tax, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>
                    {tax.name} ({tax.percentage}%)
                  </span>
                  <span>₹{tax.amount.toLocaleString()}</span>
                </div>
              ))}
            </>
          )}

          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total Amount</span>
            <span className="text-lg">₹{calculations.total.toLocaleString()}</span>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button onClick={onCollectPayment} className="w-full bg-green-600 hover:bg-green-700" size="sm">
            <CreditCard className="h-4 w-4 mr-2" />
            Collect Payment
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button onClick={onPrint} variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
            <Button onClick={onSendWhatsApp} variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-1" />
              WhatsApp
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-1" />
              Email
            </Button>
          </div>
        </div>

        {/* Bill Footer */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">Bill generated on {format(new Date(), "MMM dd, yyyy 'at' hh:mm a")}</p>
        </div>
      </CardContent>
    </Card>
  )
}

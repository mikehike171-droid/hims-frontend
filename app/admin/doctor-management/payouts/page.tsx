"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, FileText, TrendingUp, CheckCircle2 } from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function PayoutsPage() {
  const features = [
    {
      title: "Commission Models",
      description: "Configure revenue sharing rules",
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Payout Statements",
      description: "Monthly doctor statements",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Adjustments",
      description: "Handle refunds and deductions",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Payment Advice",
      description: "TDS and payment processing",
      icon: CheckCircle2,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <PrivateRoute modulePath="admin/doctor-management/payouts" action="view">
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Revenue Share & Payouts</h1>
            <p className="text-sm text-gray-600">Manage doctor commissions, revenue sharing, and payout statements</p>
          </div>
          <Button className="bg-black hover:bg-gray-800 text-white">Generate Statement</Button>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div
                  className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg ${feature.bgColor} ${feature.color}`}
                >
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-gray-200">
          <CardContent className="p-12 text-center">
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Payouts functionality will be implemented here</h3>
            <p className="text-gray-600">
              This page will include comprehensive payout management, commission calculations, and financial reporting.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
    </PrivateRoute>
  )
}

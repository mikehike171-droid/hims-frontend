"use client"

import { useState } from "react"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Users,
  FileText,
  BarChart3,
  Brain,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

// Mock data
const stats = [
  {
    title: "Total Items",
    value: "2,847",
    change: "+12%",
    icon: Package,
    color: "text-blue-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
    borderColor: "border-blue-200",
  },
  {
    title: "Active POs",
    value: "23",
    change: "+5",
    icon: ShoppingCart,
    color: "text-green-600",
    bgColor: "bg-gradient-to-br from-green-50 to-green-100",
    borderColor: "border-green-200",
  },
  {
    title: "Low Stock Items",
    value: "47",
    change: "-8",
    icon: AlertTriangle,
    color: "text-orange-600",
    bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
    borderColor: "border-orange-200",
  },
  {
    title: "Monthly Spend",
    value: "₹12.4L",
    change: "+18%",
    icon: TrendingUp,
    color: "text-purple-600",
    bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
    borderColor: "border-purple-200",
  },
]

const quickActions = [
  {
    title: "Create Indent",
    description: "Request materials from departments",
    icon: FileText,
    href: "/material-management/procurement/indents/create",
    color: "text-blue-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
    borderColor: "border-blue-200",
  },
  {
    title: "Add Vendor",
    description: "Register new supplier",
    icon: Users,
    href: "/material-management/vendors/create",
    color: "text-green-600",
    bgColor: "bg-gradient-to-br from-green-50 to-green-100",
    borderColor: "border-green-200",
  },
  {
    title: "Create PO",
    description: "Generate purchase order",
    icon: ShoppingCart,
    href: "/material-management/procurement/po/create",
    color: "text-purple-600",
    bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
    borderColor: "border-purple-200",
  },
  {
    title: "GRN Entry",
    description: "Record goods receipt",
    icon: Package,
    href: "/material-management/inbound/grn/create",
    color: "text-orange-600",
    bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
    borderColor: "border-orange-200",
  },
]

const modules = [
  {
    title: "Masters",
    description: "Manage items, vendors, and contracts",
    icon: Package,
    href: "/material-management/masters",
    color: "text-blue-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
    borderColor: "border-blue-200",
    features: ["Item Master", "Vendor Management", "Contract Management"],
  },
  {
    title: "Procurement",
    description: "Handle indents, RFQs, and purchase orders",
    icon: ShoppingCart,
    href: "/material-management/procurement",
    color: "text-green-600",
    bgColor: "bg-gradient-to-br from-green-50 to-green-100",
    borderColor: "border-green-200",
    features: ["Indent Management", "RFQ Process", "Purchase Orders"],
  },
  {
    title: "Inbound",
    description: "Manage goods receipt and quality checks",
    icon: TrendingUp,
    href: "/material-management/inbound",
    color: "text-purple-600",
    bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
    borderColor: "border-purple-200",
    features: ["GRN Management", "Quality Control", "Invoice Matching"],
  },
  {
    title: "Inventory",
    description: "Track stock levels and movements",
    icon: BarChart3,
    href: "/material-management/inventory",
    color: "text-orange-600",
    bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
    borderColor: "border-orange-200",
    features: ["Stock Management", "Location Tracking", "Cycle Counting"],
  },
  {
    title: "Issues",
    description: "Department requisitions and transfers",
    icon: FileText,
    href: "/material-management/issues",
    color: "text-red-600",
    bgColor: "bg-gradient-to-br from-red-50 to-red-100",
    borderColor: "border-red-200",
    features: ["Department Issues", "Inter-store Transfers", "Return Management"],
  },
  {
    title: "AI Insights",
    description: "Smart analytics and predictions",
    icon: Brain,
    href: "/material-management/ai-insights",
    color: "text-indigo-600",
    bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100",
    borderColor: "border-indigo-200",
    features: ["Demand Forecasting", "Cost Analytics", "Supplier Performance"],
  },
]

const recentActivities = [
  {
    id: 1,
    type: "indent",
    title: "New indent created",
    description: "Cardiology department requested 50 items",
    time: "2 hours ago",
    status: "pending",
  },
  {
    id: 2,
    type: "po",
    title: "PO approved",
    description: "Purchase order PO-2024-001 approved for ₹2.5L",
    time: "4 hours ago",
    status: "approved",
  },
  {
    id: 3,
    type: "grn",
    title: "GRN completed",
    description: "Goods received for PO-2024-002",
    time: "6 hours ago",
    status: "completed",
  },
  {
    id: 4,
    type: "alert",
    title: "Low stock alert",
    description: "15 items below minimum stock level",
    time: "8 hours ago",
    status: "warning",
  },
]

export default function MaterialManagementDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "warning":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <PrivateRoute modulePath="admin/material-management" action="view">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Material Management</h1>
          <p className="text-gray-600">Comprehensive supply chain and inventory management system</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className={`hover:shadow-lg transition-all duration-200 border-2 ${stat.borderColor}`}>
              <CardContent className={`p-6 ${stat.bgColor}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-white/50">
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card
                  className={`hover:shadow-lg transition-all duration-200 cursor-pointer border-2 ${action.borderColor} group`}
                >
                  <CardContent className={`p-4 ${action.bgColor}`}>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-white/50">
                        <action.icon className={`h-5 w-5 ${action.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Modules */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modules.map((module, index) => (
                <Link key={index} href={module.href}>
                  <Card
                    className={`hover:shadow-lg transition-all duration-200 cursor-pointer border-2 ${module.borderColor} group h-full`}
                  >
                    <CardHeader className={`${module.bgColor}`}>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-white/50">
                          <module.icon className={`h-6 w-6 ${module.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-gray-700">{module.title}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        {module.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${module.color.replace("text-", "bg-")}`} />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h2>
            <Card className="border-2 border-gray-200">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900">{activity.title}</h4>
                          <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6 border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Inventory Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Stock Turnover</span>
                    <span className="font-semibold">4.2x</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "84%" }}></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Order Fulfillment</span>
                    <span className="font-semibold">96%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "96%" }}></div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Supplier Performance</span>
                    <span className="font-semibold">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: "92%" }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PrivateRoute>
  )
}

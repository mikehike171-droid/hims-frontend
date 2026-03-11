"use client"

import { useState } from "react"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  TrendingUp,
  Star,
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

export default function VendorManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data
  const vendorData = [
    {
      id: 1,
      vendorCode: "VEN001",
      vendorName: "MedSupply Corporation",
      contactPerson: "Rajesh Kumar",
      phone: "+91-9876543210",
      email: "rajesh@medsupply.com",
      performanceScore: 8.5,
      totalPOs: 156,
      totalValue: 2500000,
      onTimeDelivery: 92,
      qualityRating: 4.2,
      status: "Active",
      lastOrder: "2024-01-18",
    },
    {
      id: 2,
      vendorCode: "VEN002",
      vendorName: "Pharma Plus Ltd",
      contactPerson: "Priya Sharma",
      phone: "+91-9876543211",
      email: "priya@pharmaplus.com",
      performanceScore: 9.2,
      totalPOs: 89,
      totalValue: 1800000,
      onTimeDelivery: 96,
      qualityRating: 4.6,
      status: "Active",
      lastOrder: "2024-01-17",
    },
    {
      id: 3,
      vendorCode: "VEN003",
      vendorName: "Surgical Supplies Inc",
      contactPerson: "Amit Patel",
      phone: "+91-9876543212",
      email: "amit@surgicalsupplies.com",
      performanceScore: 7.8,
      totalPOs: 234,
      totalValue: 3200000,
      onTimeDelivery: 85,
      qualityRating: 3.9,
      status: "Under Review",
      lastOrder: "2024-01-15",
    },
  ]

  const performanceData = [
    {
      id: 1,
      vendor: "MedSupply Corporation",
      metric: "On-Time Delivery",
      currentMonth: 92,
      lastMonth: 88,
      target: 90,
      trend: "up",
    },
    {
      id: 2,
      vendor: "MedSupply Corporation",
      metric: "Quality Rating",
      currentMonth: 4.2,
      lastMonth: 4.0,
      target: 4.0,
      trend: "up",
    },
    {
      id: 3,
      vendor: "Pharma Plus Ltd",
      metric: "On-Time Delivery",
      currentMonth: 96,
      lastMonth: 94,
      target: 90,
      trend: "up",
    },
    {
      id: 4,
      vendor: "Surgical Supplies Inc",
      metric: "Quality Rating",
      currentMonth: 3.9,
      lastMonth: 4.1,
      target: 4.0,
      trend: "down",
    },
  ]

  const scorecardData = [
    {
      id: 1,
      vendor: "MedSupply Corporation",
      period: "Q4 2024",
      overallScore: 8.5,
      deliveryScore: 9.2,
      qualityScore: 8.4,
      serviceScore: 8.0,
      complianceScore: 8.5,
      rank: 1,
    },
    {
      id: 2,
      vendor: "Pharma Plus Ltd",
      period: "Q4 2024",
      overallScore: 9.2,
      deliveryScore: 9.6,
      qualityScore: 9.2,
      serviceScore: 8.8,
      complianceScore: 9.0,
      rank: 1,
    },
    {
      id: 3,
      vendor: "Surgical Supplies Inc",
      period: "Q4 2024",
      overallScore: 7.8,
      deliveryScore: 8.5,
      qualityScore: 7.8,
      serviceScore: 7.2,
      complianceScore: 7.8,
      rank: 3,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "under review":
        return "bg-yellow-100 text-yellow-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 9) return "text-green-600"
    if (score >= 7) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <PrivateRoute modulePath="admin/material-management/vendors" action="view">
      <div className="space-y-6 bg-gradient-to-br from-indigo-50 via-blue-50 to-green-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-gray-600">Performance tracking and vendor scorecards</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-200 hover:bg-white/80 bg-transparent">
            <Download className="h-4 w-4 mr-2 text-blue-500" />
            Export
          </Button>
          <Link href="/material-management/vendors/create">
            <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Vendors</CardTitle>
            <Users className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">156</div>
            <p className="text-sm text-green-600 font-medium">+3 new this month</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Performance</CardTitle>
            <Star className="h-6 w-6 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">8.5/10</div>
            <p className="text-sm text-green-600 font-medium">+0.2 vs last quarter</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">On-Time Delivery</CardTitle>
            <CheckCircle className="h-6 w-6 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">91%</div>
            <p className="text-sm text-green-600 font-medium">+3% improvement</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Under Review</CardTitle>
            <AlertTriangle className="h-6 w-6 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">5</div>
            <p className="text-sm text-orange-600 font-medium">Performance issues</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="vendors" className="space-y-4">
        <TabsList className="bg-white/80 border border-gray-200">
          <TabsTrigger
            value="vendors"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
          >
            Vendor Directory
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
          >
            Performance Tracking
          </TabsTrigger>
          <TabsTrigger
            value="scorecards"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
          >
            Vendor Scorecards
          </TabsTrigger>
          <TabsTrigger
            value="contracts"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
          >
            Contracts
          </TabsTrigger>
        </TabsList>

        {/* Vendor Directory Tab */}
        <TabsContent value="vendors" className="space-y-4">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Vendor Directory</CardTitle>
                  <CardDescription className="text-indigo-100">
                    Comprehensive vendor information and performance metrics
                  </CardDescription>
                </div>
                <Link href="/material-management/vendors/create">
                  <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vendor
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search vendors by name, code, or contact..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 border-gray-200 focus:border-indigo-400 focus:ring-indigo-400"
                    />
                  </div>
                </div>
                <Button variant="outline" className="border-gray-200 hover:bg-gray-50 bg-transparent">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-gradient-to-r from-indigo-50 to-blue-50">
                      <tr>
                        <th className="text-left p-3 font-medium text-gray-700">Vendor Code</th>
                        <th className="text-left p-3 font-medium text-gray-700">Vendor Name</th>
                        <th className="text-left p-3 font-medium text-gray-700">Contact Person</th>
                        <th className="text-left p-3 font-medium text-gray-700">Performance Score</th>
                        <th className="text-left p-3 font-medium text-gray-700">Total POs</th>
                        <th className="text-left p-3 font-medium text-gray-700">Total Value</th>
                        <th className="text-left p-3 font-medium text-gray-700">On-Time %</th>
                        <th className="text-left p-3 font-medium text-gray-700">Quality Rating</th>
                        <th className="text-left p-3 font-medium text-gray-700">Status</th>
                        <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendorData.map((vendor) => (
                        <tr
                          key={vendor.id}
                          className="border-b hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50"
                        >
                          <td className="p-3">
                            <div className="font-medium text-gray-900">{vendor.vendorCode}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-medium text-gray-900">{vendor.vendorName}</div>
                            <div className="text-sm text-gray-600">{vendor.contactPerson}</div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm text-gray-900">{vendor.phone}</div>
                            <div className="text-sm text-gray-600">{vendor.email}</div>
                          </td>
                          <td className="p-3">
                            <div className={`font-medium ${getScoreColor(vendor.performanceScore)}`}>
                              {vendor.performanceScore}/10
                            </div>
                          </td>
                          <td className="p-3 text-gray-900">{vendor.totalPOs}</td>
                          <td className="p-3 text-gray-900">₹{(vendor.totalValue / 100000).toFixed(1)}L</td>
                          <td className="p-3">
                            <div
                              className={
                                vendor.onTimeDelivery >= 90 ? "text-green-600 font-medium" : "text-red-600 font-medium"
                              }
                            >
                              {vendor.onTimeDelivery}%
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="text-gray-900">{vendor.qualityRating}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge className={getStatusColor(vendor.status)}>{vendor.status}</Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" className="hover:bg-indigo-100">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="hover:bg-indigo-100">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tracking Tab */}
        <TabsContent value="performance" className="space-y-4">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
              <CardTitle>Performance Tracking</CardTitle>
              <CardDescription className="text-green-100">
                Monitor vendor performance metrics and trends
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="border rounded-lg overflow-hidden bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-gradient-to-r from-green-50 to-blue-50">
                      <tr>
                        <th className="text-left p-3 font-medium text-gray-700">Vendor</th>
                        <th className="text-left p-3 font-medium text-gray-700">Metric</th>
                        <th className="text-left p-3 font-medium text-gray-700">Current Month</th>
                        <th className="text-left p-3 font-medium text-gray-700">Last Month</th>
                        <th className="text-left p-3 font-medium text-gray-700">Target</th>
                        <th className="text-left p-3 font-medium text-gray-700">Trend</th>
                        <th className="text-left p-3 font-medium text-gray-700">Status</th>
                        <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {performanceData.map((performance) => (
                        <tr
                          key={performance.id}
                          className="border-b hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50"
                        >
                          <td className="p-3 text-gray-900">{performance.vendor}</td>
                          <td className="p-3 text-gray-900">{performance.metric}</td>
                          <td className="p-3">
                            <div className="font-medium text-gray-900">
                              {performance.metric === "Quality Rating"
                                ? performance.currentMonth
                                : `${performance.currentMonth}%`}
                            </div>
                          </td>
                          <td className="p-3 text-gray-900">
                            {performance.metric === "Quality Rating"
                              ? performance.lastMonth
                              : `${performance.lastMonth}%`}
                          </td>
                          <td className="p-3 text-gray-900">
                            {performance.metric === "Quality Rating" ? performance.target : `${performance.target}%`}
                          </td>
                          <td className="p-3">{getTrendIcon(performance.trend)}</td>
                          <td className="p-3">
                            <Badge
                              className={
                                performance.currentMonth >= performance.target
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {performance.currentMonth >= performance.target ? "On Target" : "Below Target"}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Button size="sm" variant="ghost" className="hover:bg-green-100">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vendor Scorecards Tab */}
        <TabsContent value="scorecards" className="space-y-4">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle>Vendor Scorecards</CardTitle>
              <CardDescription className="text-purple-100">Comprehensive vendor performance scorecards</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="border rounded-lg overflow-hidden bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
                      <tr>
                        <th className="text-left p-3 font-medium text-gray-700">Vendor</th>
                        <th className="text-left p-3 font-medium text-gray-700">Period</th>
                        <th className="text-left p-3 font-medium text-gray-700">Overall Score</th>
                        <th className="text-left p-3 font-medium text-gray-700">Delivery</th>
                        <th className="text-left p-3 font-medium text-gray-700">Quality</th>
                        <th className="text-left p-3 font-medium text-gray-700">Service</th>
                        <th className="text-left p-3 font-medium text-gray-700">Compliance</th>
                        <th className="text-left p-3 font-medium text-gray-700">Rank</th>
                        <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scorecardData.map((scorecard) => (
                        <tr
                          key={scorecard.id}
                          className="border-b hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50"
                        >
                          <td className="p-3 text-gray-900">{scorecard.vendor}</td>
                          <td className="p-3 text-gray-900">{scorecard.period}</td>
                          <td className="p-3">
                            <div className={`font-medium text-lg ${getScoreColor(scorecard.overallScore)}`}>
                              {scorecard.overallScore}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className={getScoreColor(scorecard.deliveryScore)}>{scorecard.deliveryScore}</div>
                          </td>
                          <td className="p-3">
                            <div className={getScoreColor(scorecard.qualityScore)}>{scorecard.qualityScore}</div>
                          </td>
                          <td className="p-3">
                            <div className={getScoreColor(scorecard.serviceScore)}>{scorecard.serviceScore}</div>
                          </td>
                          <td className="p-3">
                            <div className={getScoreColor(scorecard.complianceScore)}>{scorecard.complianceScore}</div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="border-purple-300 text-purple-700">
                              #{scorecard.rank}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" className="hover:bg-purple-100">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="hover:bg-purple-100">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contracts Tab */}
        <TabsContent value="contracts" className="space-y-4">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Vendor Contracts</CardTitle>
                  <CardDescription className="text-orange-100">Manage vendor contracts and agreements</CardDescription>
                </div>
                <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  <Plus className="h-4 w-4 mr-2" />
                  New Contract
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Contract Management</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  This feature will allow you to manage vendor contracts, renewals, and compliance tracking.
                </p>
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Contract
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </PrivateRoute>
  )
}

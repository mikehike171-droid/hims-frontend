"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DollarSign,
  TrendingUp,
  Percent,
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  CheckCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"

export default function SchemesDiscountsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data
  const schemeData = [
    {
      id: 1,
      schemeNumber: "SCH-2024-001",
      schemeName: "Annual Volume Discount",
      vendor: "MedSupply Corporation",
      schemeType: "Volume Discount",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      targetValue: 2500000,
      achievedValue: 1850000,
      discountRate: 5.5,
      accruedAmount: 101750,
      realizedAmount: 85000,
      status: "Active",
    },
    {
      id: 2,
      schemeNumber: "SCH-2024-002",
      schemeName: "Early Payment Discount",
      vendor: "Pharma Plus Ltd",
      schemeType: "Payment Terms",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      targetValue: 1800000,
      achievedValue: 1200000,
      discountRate: 2.0,
      accruedAmount: 24000,
      realizedAmount: 24000,
      status: "Active",
    },
    {
      id: 3,
      schemeNumber: "SCH-2024-003",
      schemeName: "Quarterly Rebate",
      vendor: "Surgical Supplies Inc",
      schemeType: "Rebate",
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      targetValue: 800000,
      achievedValue: 950000,
      discountRate: 3.0,
      accruedAmount: 28500,
      realizedAmount: 28500,
      status: "Completed",
    },
  ]

  const accrualData = [
    {
      id: 1,
      vendor: "MedSupply Corporation",
      scheme: "Annual Volume Discount",
      month: "January 2024",
      purchaseValue: 185000,
      accrualRate: 5.5,
      accrualAmount: 10175,
      cumulativeAccrual: 10175,
      status: "Accrued",
    },
    {
      id: 2,
      vendor: "Pharma Plus Ltd",
      scheme: "Early Payment Discount",
      month: "January 2024",
      purchaseValue: 120000,
      accrualRate: 2.0,
      accrualAmount: 2400,
      cumulativeAccrual: 2400,
      status: "Realized",
    },
    {
      id: 3,
      vendor: "Surgical Supplies Inc",
      scheme: "Quarterly Rebate",
      month: "January 2024",
      purchaseValue: 95000,
      accrualRate: 3.0,
      accrualAmount: 2850,
      cumulativeAccrual: 2850,
      status: "Pending",
    },
  ]

  const realizationData = [
    {
      id: 1,
      realizationNumber: "REL-2024-001",
      vendor: "Pharma Plus Ltd",
      scheme: "Early Payment Discount",
      accruedAmount: 24000,
      realizedAmount: 24000,
      realizationDate: "2024-01-31",
      method: "Credit Note",
      status: "Completed",
    },
    {
      id: 2,
      realizationNumber: "REL-2024-002",
      vendor: "Surgical Supplies Inc",
      scheme: "Quarterly Rebate",
      accruedAmount: 28500,
      realizedAmount: 28500,
      realizationDate: "2024-01-31",
      method: "Bank Transfer",
      status: "Completed",
    },
    {
      id: 3,
      realizationNumber: "REL-2024-003",
      vendor: "MedSupply Corporation",
      scheme: "Annual Volume Discount",
      accruedAmount: 101750,
      realizedAmount: 0,
      realizationDate: null,
      method: "Pending",
      status: "Pending",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "completed":
      case "realized":
        return "bg-green-100 text-green-800"
      case "pending":
      case "accrued":
        return "bg-yellow-100 text-yellow-800"
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schemes & Discounts</h1>
          <p className="text-gray-600">Accrual tracking and realization management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-200 hover:bg-white/80 bg-transparent">
            <Download className="h-4 w-4 mr-2 text-blue-500" />
            Export
          </Button>
          <Link href="/material-management/schemes/create">
            <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Scheme
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Accrued</CardTitle>
            <DollarSign className="h-6 w-6 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">₹2.8L</div>
            <p className="text-sm text-green-600 font-medium">+15% vs last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Realized</CardTitle>
            <CheckCircle className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">₹2.1L</div>
            <p className="text-sm text-blue-600 font-medium">75% realization rate</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Realization</CardTitle>
            <Clock className="h-6 w-6 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">₹70K</div>
            <p className="text-sm text-orange-600 font-medium">3 schemes pending</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Discount Rate</CardTitle>
            <Percent className="h-6 w-6 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">3.5%</div>
            <p className="text-sm text-green-600 font-medium">+0.2% improvement</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="schemes" className="space-y-4">
        <TabsList className="bg-white/80 border border-gray-200">
          <TabsTrigger
            value="schemes"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
          >
            Scheme Management
          </TabsTrigger>
          <TabsTrigger
            value="accruals"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
          >
            Accrual Tracking
          </TabsTrigger>
          <TabsTrigger
            value="realization"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
          >
            Realization
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Schemes Tab */}
        <TabsContent value="schemes" className="space-y-4">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Scheme Management</CardTitle>
                  <CardDescription className="text-yellow-100">
                    Manage vendor discount schemes and agreements
                  </CardDescription>
                </div>
                <Link href="/material-management/schemes/create">
                  <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Scheme
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
                      placeholder="Search schemes by number, name, or vendor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 border-gray-200 focus:border-yellow-400 focus:ring-yellow-400"
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
                    <thead className="border-b bg-gradient-to-r from-yellow-50 to-orange-50">
                      <tr>
                        <th className="text-left p-3 font-medium text-gray-700">Scheme Number</th>
                        <th className="text-left p-3 font-medium text-gray-700">Scheme Name</th>
                        <th className="text-left p-3 font-medium text-gray-700">Vendor</th>
                        <th className="text-left p-3 font-medium text-gray-700">Type</th>
                        <th className="text-left p-3 font-medium text-gray-700">Period</th>
                        <th className="text-left p-3 font-medium text-gray-700">Target/Achieved</th>
                        <th className="text-left p-3 font-medium text-gray-700">Discount Rate</th>
                        <th className="text-left p-3 font-medium text-gray-700">Accrued/Realized</th>
                        <th className="text-left p-3 font-medium text-gray-700">Status</th>
                        <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schemeData.map((scheme) => (
                        <tr
                          key={scheme.id}
                          className="border-b hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50"
                        >
                          <td className="p-3">
                            <div className="font-medium text-gray-900">{scheme.schemeNumber}</div>
                          </td>
                          <td className="p-3 text-gray-900">{scheme.schemeName}</td>
                          <td className="p-3 text-gray-900">{scheme.vendor}</td>
                          <td className="p-3">
                            <Badge variant="outline" className="border-yellow-300 text-yellow-700">
                              {scheme.schemeType}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="text-sm text-gray-700">
                              {scheme.startDate} to {scheme.endDate}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              <div className="text-gray-900">₹{(scheme.targetValue / 100000).toFixed(1)}L target</div>
                              <div className="text-gray-600">
                                ₹{(scheme.achievedValue / 100000).toFixed(1)}L achieved
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-gray-900">{scheme.discountRate}%</td>
                          <td className="p-3">
                            <div className="text-sm">
                              <div className="text-green-600 font-medium">
                                ₹{scheme.accruedAmount.toLocaleString()} accrued
                              </div>
                              <div className="text-blue-600 font-medium">
                                ₹{scheme.realizedAmount.toLocaleString()} realized
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge className={getStatusColor(scheme.status)}>{scheme.status}</Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" className="hover:bg-yellow-100">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="hover:bg-yellow-100">
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

        {/* Accruals Tab */}
        <TabsContent value="accruals" className="space-y-4">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
              <CardTitle>Accrual Tracking</CardTitle>
              <CardDescription className="text-green-100">Track monthly accruals for all schemes</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="border rounded-lg overflow-hidden bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-gradient-to-r from-green-50 to-blue-50">
                      <tr>
                        <th className="text-left p-3 font-medium text-gray-700">Vendor</th>
                        <th className="text-left p-3 font-medium text-gray-700">Scheme</th>
                        <th className="text-left p-3 font-medium text-gray-700">Month</th>
                        <th className="text-left p-3 font-medium text-gray-700">Purchase Value</th>
                        <th className="text-left p-3 font-medium text-gray-700">Accrual Rate</th>
                        <th className="text-left p-3 font-medium text-gray-700">Accrual Amount</th>
                        <th className="text-left p-3 font-medium text-gray-700">Cumulative</th>
                        <th className="text-left p-3 font-medium text-gray-700">Status</th>
                        <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accrualData.map((accrual) => (
                        <tr
                          key={accrual.id}
                          className="border-b hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50"
                        >
                          <td className="p-3 text-gray-900">{accrual.vendor}</td>
                          <td className="p-3 text-gray-900">{accrual.scheme}</td>
                          <td className="p-3 text-gray-900">{accrual.month}</td>
                          <td className="p-3 text-gray-900">₹{accrual.purchaseValue.toLocaleString()}</td>
                          <td className="p-3 text-gray-900">{accrual.accrualRate}%</td>
                          <td className="p-3 text-gray-900">₹{accrual.accrualAmount.toLocaleString()}</td>
                          <td className="p-3 text-gray-900">₹{accrual.cumulativeAccrual.toLocaleString()}</td>
                          <td className="p-3">
                            <Badge className={getStatusColor(accrual.status)}>{accrual.status}</Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" className="hover:bg-green-100">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="hover:bg-green-100">
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

        {/* Realization Tab */}
        <TabsContent value="realization" className="space-y-4">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Realization Management</CardTitle>
                  <CardDescription className="text-blue-100">Track and manage scheme realizations</CardDescription>
                </div>
                <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  <Plus className="h-4 w-4 mr-2" />
                  Process Realization
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="border rounded-lg overflow-hidden bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
                      <tr>
                        <th className="text-left p-3 font-medium text-gray-700">Realization Number</th>
                        <th className="text-left p-3 font-medium text-gray-700">Vendor</th>
                        <th className="text-left p-3 font-medium text-gray-700">Scheme</th>
                        <th className="text-left p-3 font-medium text-gray-700">Accrued Amount</th>
                        <th className="text-left p-3 font-medium text-gray-700">Realized Amount</th>
                        <th className="text-left p-3 font-medium text-gray-700">Realization Date</th>
                        <th className="text-left p-3 font-medium text-gray-700">Method</th>
                        <th className="text-left p-3 font-medium text-gray-700">Status</th>
                        <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {realizationData.map((realization) => (
                        <tr
                          key={realization.id}
                          className="border-b hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50"
                        >
                          <td className="p-3">
                            <div className="font-medium text-gray-900">{realization.realizationNumber}</div>
                          </td>
                          <td className="p-3 text-gray-900">{realization.vendor}</td>
                          <td className="p-3 text-gray-900">{realization.scheme}</td>
                          <td className="p-3 text-gray-900">₹{realization.accruedAmount.toLocaleString()}</td>
                          <td className="p-3 text-gray-900">₹{realization.realizedAmount.toLocaleString()}</td>
                          <td className="p-3 text-gray-900">{realization.realizationDate || "Pending"}</td>
                          <td className="p-3">
                            <Badge variant="outline" className="border-blue-300 text-blue-700">
                              {realization.method}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge className={getStatusColor(realization.status)}>{realization.status}</Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" className="hover:bg-blue-100">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="hover:bg-blue-100">
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

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle>Scheme Analytics</CardTitle>
              <CardDescription className="text-purple-100">Performance analytics and insights</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="shadow-md border-0 bg-gradient-to-br from-green-50 to-blue-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <TrendingUp className="h-6 w-6 text-green-500" />
                      <Badge variant="outline" className="border-green-300 text-green-700">
                        Monthly
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-gray-900">Accrual Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">₹2.8L</div>
                    <p className="text-sm text-green-600">+15% vs last month</p>
                  </CardContent>
                </Card>

                <Card className="shadow-md border-0 bg-gradient-to-br from-blue-50 to-purple-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Percent className="h-6 w-6 text-blue-500" />
                      <Badge variant="outline" className="border-blue-300 text-blue-700">
                        YTD
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-gray-900">Realization Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">75%</div>
                    <p className="text-sm text-blue-600">Target: 80%</p>
                  </CardContent>
                </Card>

                <Card className="shadow-md border-0 bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <DollarSign className="h-6 w-6 text-purple-500" />
                      <Badge variant="outline" className="border-purple-300 text-purple-700">
                        Total
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-gray-900">Cost Savings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">₹4.9L</div>
                    <p className="text-sm text-purple-600">This fiscal year</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

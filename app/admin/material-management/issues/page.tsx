"use client"

import { useState } from "react"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, Package, User, Search, Plus, Filter, Download, Eye, Edit, Clock, CheckCircle } from "lucide-react"

export default function IssuesConsumptionPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data
  const issueData = [
    {
      id: 1,
      issueNumber: "ISS-2024-001234",
      issueDate: "2024-01-18",
      department: "ICU",
      requestedBy: "Dr. Rajesh Kumar",
      totalItems: 8,
      totalValue: 15000,
      status: "Completed",
      issuedBy: "Store Keeper",
      patientCharged: true,
    },
    {
      id: 2,
      issueNumber: "ISS-2024-001235",
      issueDate: "2024-01-18",
      department: "OT-1",
      requestedBy: "Sister Mary",
      totalItems: 12,
      totalValue: 25000,
      status: "Pending",
      issuedBy: null,
      patientCharged: false,
    },
    {
      id: 3,
      issueNumber: "ISS-2024-001236",
      issueDate: "2024-01-17",
      department: "Emergency",
      requestedBy: "Dr. Amit Patel",
      totalItems: 5,
      totalValue: 8500,
      status: "Partial",
      issuedBy: "Store Keeper",
      patientCharged: true,
    },
  ]

  const consumptionData = [
    {
      id: 1,
      department: "ICU",
      itemName: "Paracetamol 500mg",
      consumedQty: 500,
      unitCost: 2.5,
      totalCost: 1250,
      consumptionDate: "2024-01-18",
      patientId: "PAT-001234",
      chargedAmount: 1500,
    },
    {
      id: 2,
      department: "OT-1",
      itemName: "Surgical Gloves",
      consumedQty: 20,
      unitCost: 45.0,
      totalCost: 900,
      consumptionDate: "2024-01-18",
      patientId: "PAT-001235",
      chargedAmount: 1080,
    },
    {
      id: 3,
      department: "Emergency",
      itemName: "IV Fluid 500ml",
      consumedQty: 10,
      unitCost: 85.0,
      totalCost: 850,
      consumptionDate: "2024-01-17",
      patientId: "PAT-001236",
      chargedAmount: 1020,
    },
  ]

  const patientChargingData = [
    {
      id: 1,
      patientId: "PAT-001234",
      patientName: "John Doe",
      department: "ICU",
      admissionDate: "2024-01-15",
      totalCharges: 15000,
      itemsCharged: 25,
      lastCharge: "2024-01-18",
      status: "Active",
    },
    {
      id: 2,
      patientId: "PAT-001235",
      patientName: "Jane Smith",
      department: "OT-1",
      admissionDate: "2024-01-16",
      totalCharges: 8500,
      itemsCharged: 12,
      lastCharge: "2024-01-18",
      status: "Discharged",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "partial":
        return "bg-blue-100 text-blue-800"
      case "discharged":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <PrivateRoute modulePath="admin/material-management/issues" action="view">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Issues & Consumption</h1>
          <p className="text-muted-foreground">Department issues and patient charging</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Issue
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Issues</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">₹1.2L total value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Issues</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">3</span> urgent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patient Charges</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹85.2K</div>
            <p className="text-xs text-muted-foreground">Today's charges</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consumption Rate</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5%</span> vs yesterday
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="issues" className="space-y-4">
        <TabsList>
          <TabsTrigger value="issues">Department Issues</TabsTrigger>
          <TabsTrigger value="consumption">Consumption Tracking</TabsTrigger>
          <TabsTrigger value="charging">Patient Charging</TabsTrigger>
          <TabsTrigger value="returns">Returns</TabsTrigger>
        </TabsList>

        {/* Issues Tab */}
        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Department Issues</CardTitle>
                  <CardDescription>Track material issues to departments</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Issue
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search issues by number, department, or requester..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">Issue Number</th>
                        <th className="text-left p-3 font-medium">Date</th>
                        <th className="text-left p-3 font-medium">Department</th>
                        <th className="text-left p-3 font-medium">Requested By</th>
                        <th className="text-left p-3 font-medium">Items</th>
                        <th className="text-left p-3 font-medium">Total Value</th>
                        <th className="text-left p-3 font-medium">Patient Charged</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {issueData.map((issue) => (
                        <tr key={issue.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <div className="font-medium">{issue.issueNumber}</div>
                          </td>
                          <td className="p-3">{issue.issueDate}</td>
                          <td className="p-3">{issue.department}</td>
                          <td className="p-3">{issue.requestedBy}</td>
                          <td className="p-3">{issue.totalItems}</td>
                          <td className="p-3">₹{issue.totalValue.toLocaleString()}</td>
                          <td className="p-3">
                            {issue.patientCharged ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            )}
                          </td>
                          <td className="p-3">
                            <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
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

        {/* Consumption Tab */}
        <TabsContent value="consumption" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consumption Tracking</CardTitle>
              <CardDescription>Monitor item consumption by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">Department</th>
                        <th className="text-left p-3 font-medium">Item Name</th>
                        <th className="text-left p-3 font-medium">Consumed Qty</th>
                        <th className="text-left p-3 font-medium">Unit Cost</th>
                        <th className="text-left p-3 font-medium">Total Cost</th>
                        <th className="text-left p-3 font-medium">Date</th>
                        <th className="text-left p-3 font-medium">Patient ID</th>
                        <th className="text-left p-3 font-medium">Charged Amount</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {consumptionData.map((consumption) => (
                        <tr key={consumption.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">{consumption.department}</td>
                          <td className="p-3">{consumption.itemName}</td>
                          <td className="p-3">{consumption.consumedQty}</td>
                          <td className="p-3">₹{consumption.unitCost}</td>
                          <td className="p-3">₹{consumption.totalCost.toLocaleString()}</td>
                          <td className="p-3">{consumption.consumptionDate}</td>
                          <td className="p-3">{consumption.patientId}</td>
                          <td className="p-3">₹{consumption.chargedAmount.toLocaleString()}</td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
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

        {/* Patient Charging Tab */}
        <TabsContent value="charging" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Charging</CardTitle>
              <CardDescription>Track charges applied to patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">Patient ID</th>
                        <th className="text-left p-3 font-medium">Patient Name</th>
                        <th className="text-left p-3 font-medium">Department</th>
                        <th className="text-left p-3 font-medium">Admission Date</th>
                        <th className="text-left p-3 font-medium">Total Charges</th>
                        <th className="text-left p-3 font-medium">Items Charged</th>
                        <th className="text-left p-3 font-medium">Last Charge</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patientChargingData.map((patient) => (
                        <tr key={patient.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <div className="font-medium">{patient.patientId}</div>
                          </td>
                          <td className="p-3">{patient.patientName}</td>
                          <td className="p-3">{patient.department}</td>
                          <td className="p-3">{patient.admissionDate}</td>
                          <td className="p-3">₹{patient.totalCharges.toLocaleString()}</td>
                          <td className="p-3">{patient.itemsCharged}</td>
                          <td className="p-3">{patient.lastCharge}</td>
                          <td className="p-3">
                            <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
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

        {/* Returns Tab */}
        <TabsContent value="returns" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Returns</CardTitle>
                  <CardDescription>Manage item returns from departments</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Process Return
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Returns Management</h3>
                <p className="text-muted-foreground mb-4">
                  This feature will allow you to process returns from departments and update inventory.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Process Return
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

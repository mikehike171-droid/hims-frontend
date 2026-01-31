"use client"

import { useState } from "react"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Truck,
  ClipboardCheck,
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

export default function InboundOperationsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data
  const asnData = [
    {
      id: 1,
      asnNumber: "ASN-2024-001234",
      poNumber: "PO-2024-001234",
      vendor: "MedSupply Corp",
      expectedDate: "2024-01-20",
      totalItems: 15,
      status: "Expected",
      vehicleNumber: "KA01AB1234",
    },
    {
      id: 2,
      asnNumber: "ASN-2024-001235",
      poNumber: "PO-2024-001235",
      vendor: "Pharma Plus Ltd",
      expectedDate: "2024-01-19",
      totalItems: 8,
      status: "In Transit",
      vehicleNumber: "KA02CD5678",
    },
  ]

  const grnData = [
    {
      id: 1,
      grnNumber: "GRN-2024-005678",
      poNumber: "PO-2024-001234",
      vendor: "MedSupply Corp",
      receivedDate: "2024-01-18",
      totalItems: 15,
      receivedItems: 15,
      acceptedItems: 12,
      rejectedItems: 3,
      status: "QC Pending",
      invoiceNumber: "INV-MS-2024-156",
    },
    {
      id: 2,
      grnNumber: "GRN-2024-005679",
      poNumber: "PO-2024-001235",
      vendor: "Surgical Supplies Inc",
      receivedDate: "2024-01-17",
      totalItems: 8,
      receivedItems: 8,
      acceptedItems: 8,
      rejectedItems: 0,
      status: "Completed",
      invoiceNumber: "INV-SS-2024-089",
    },
  ]

  const qcData = [
    {
      id: 1,
      qcNumber: "QC-2024-001",
      grnNumber: "GRN-2024-005678",
      itemName: "Paracetamol 500mg",
      batchNumber: "PAR2024A",
      expiryDate: "2026-12-31",
      qtyReceived: 1000,
      qtyTested: 100,
      testResult: "Pass",
      status: "Approved",
    },
    {
      id: 2,
      qcNumber: "QC-2024-002",
      grnNumber: "GRN-2024-005678",
      itemName: "Surgical Gloves",
      batchNumber: "SG2024B",
      expiryDate: "2025-06-30",
      qtyReceived: 500,
      qtyTested: 50,
      testResult: "Fail",
      status: "Rejected",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "approved":
      case "pass":
        return "bg-green-100 text-green-800"
      case "pending":
      case "qc pending":
      case "expected":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
      case "fail":
        return "bg-red-100 text-red-800"
      case "in transit":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <PrivateRoute modulePath="admin/material-management/inbound" action="view">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inbound Operations</h1>
          <p className="text-muted-foreground">Manage ASN, GRN, QC, and invoice matching</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New GRN
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expected Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">3</span> arriving today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending GRNs</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-orange-600">2</span> overdue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">QC Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">5</span> critical items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoice Matching</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">₹2.8L pending approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="asn" className="space-y-4">
        <TabsList>
          <TabsTrigger value="asn">ASN Tracking</TabsTrigger>
          <TabsTrigger value="grn">Goods Receipt</TabsTrigger>
          <TabsTrigger value="qc">Quality Control</TabsTrigger>
          <TabsTrigger value="invoice">Invoice Matching</TabsTrigger>
        </TabsList>

        {/* ASN Tab */}
        <TabsContent value="asn" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Advance Shipping Notice (ASN)</CardTitle>
                  <CardDescription>Track expected deliveries and shipments</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create ASN
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search ASN by number, PO, or vendor..."
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
                        <th className="text-left p-3 font-medium">ASN Number</th>
                        <th className="text-left p-3 font-medium">PO Number</th>
                        <th className="text-left p-3 font-medium">Vendor</th>
                        <th className="text-left p-3 font-medium">Expected Date</th>
                        <th className="text-left p-3 font-medium">Items</th>
                        <th className="text-left p-3 font-medium">Vehicle</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {asnData.map((asn) => (
                        <tr key={asn.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <div className="font-medium">{asn.asnNumber}</div>
                          </td>
                          <td className="p-3">{asn.poNumber}</td>
                          <td className="p-3">{asn.vendor}</td>
                          <td className="p-3">{asn.expectedDate}</td>
                          <td className="p-3">{asn.totalItems}</td>
                          <td className="p-3">{asn.vehicleNumber}</td>
                          <td className="p-3">
                            <Badge className={getStatusColor(asn.status)}>{asn.status}</Badge>
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

        {/* GRN Tab */}
        <TabsContent value="grn" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Goods Receipt Note (GRN)</CardTitle>
                  <CardDescription>Process incoming deliveries and create GRNs</CardDescription>
                </div>
                <Link href="/material-management/inbound/grn/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create GRN
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">GRN Number</th>
                        <th className="text-left p-3 font-medium">PO Number</th>
                        <th className="text-left p-3 font-medium">Vendor</th>
                        <th className="text-left p-3 font-medium">Received Date</th>
                        <th className="text-left p-3 font-medium">Items</th>
                        <th className="text-left p-3 font-medium">Accepted/Rejected</th>
                        <th className="text-left p-3 font-medium">Invoice</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grnData.map((grn) => (
                        <tr key={grn.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <div className="font-medium">{grn.grnNumber}</div>
                          </td>
                          <td className="p-3">{grn.poNumber}</td>
                          <td className="p-3">{grn.vendor}</td>
                          <td className="p-3">{grn.receivedDate}</td>
                          <td className="p-3">{grn.totalItems}</td>
                          <td className="p-3">
                            <div className="text-sm">
                              <span className="text-green-600">{grn.acceptedItems}</span> /{" "}
                              <span className="text-red-600">{grn.rejectedItems}</span>
                            </div>
                          </td>
                          <td className="p-3">{grn.invoiceNumber}</td>
                          <td className="p-3">
                            <Badge className={getStatusColor(grn.status)}>{grn.status}</Badge>
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

        {/* QC Tab */}
        <TabsContent value="qc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quality Control</CardTitle>
              <CardDescription>Manage quality testing and batch approvals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">QC Number</th>
                        <th className="text-left p-3 font-medium">GRN Number</th>
                        <th className="text-left p-3 font-medium">Item Name</th>
                        <th className="text-left p-3 font-medium">Batch Number</th>
                        <th className="text-left p-3 font-medium">Expiry Date</th>
                        <th className="text-left p-3 font-medium">Qty Tested</th>
                        <th className="text-left p-3 font-medium">Test Result</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {qcData.map((qc) => (
                        <tr key={qc.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <div className="font-medium">{qc.qcNumber}</div>
                          </td>
                          <td className="p-3">{qc.grnNumber}</td>
                          <td className="p-3">{qc.itemName}</td>
                          <td className="p-3">{qc.batchNumber}</td>
                          <td className="p-3">{qc.expiryDate}</td>
                          <td className="p-3">
                            {qc.qtyTested} / {qc.qtyReceived}
                          </td>
                          <td className="p-3">
                            <Badge className={getStatusColor(qc.testResult)}>{qc.testResult}</Badge>
                          </td>
                          <td className="p-3">
                            <Badge className={getStatusColor(qc.status)}>{qc.status}</Badge>
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

        {/* Invoice Matching Tab */}
        <TabsContent value="invoice" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Matching</CardTitle>
              <CardDescription>Match invoices with GRNs and approve payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ClipboardCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Invoice Matching</h3>
                <p className="text-muted-foreground mb-4">
                  This feature will allow you to match vendor invoices with GRNs and approve payments.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Start Invoice Matching
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

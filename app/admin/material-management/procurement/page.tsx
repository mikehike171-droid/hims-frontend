"use client"

import { useState } from "react"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  ShoppingCart,
  MessageSquare,
  TrendingUp,
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react"
import Link from "next/link"

export default function ProcurementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Mock data
  const indentData = [
    {
      id: 1,
      indentNumber: "IND-2024-001234",
      indentDate: "2024-01-15",
      department: "ICU",
      requestedBy: "Dr. Rajesh Kumar",
      priority: "Urgent",
      totalItems: 12,
      estimatedValue: 45000,
      approvalStatus: "Approved",
      status: "Open",
      approvedBy: "Dr. Priya Sharma",
      approvedAt: "2024-01-15 14:30",
    },
    {
      id: 2,
      indentNumber: "IND-2024-001235",
      indentDate: "2024-01-14",
      department: "Pharmacy",
      requestedBy: "Pharmacist Amit",
      priority: "High",
      totalItems: 25,
      estimatedValue: 125000,
      approvalStatus: "Pending",
      status: "Pending Approval",
      approvedBy: null,
      approvedAt: null,
    },
    {
      id: 3,
      indentNumber: "IND-2024-001236",
      indentDate: "2024-01-13",
      department: "OT-1",
      requestedBy: "Sister Mary",
      priority: "Normal",
      totalItems: 8,
      estimatedValue: 32000,
      approvalStatus: "Approved",
      status: "Converted to PO",
      approvedBy: "Dr. Suresh Patel",
      approvedAt: "2024-01-13 16:45",
    },
  ]

  const rfqData = [
    {
      id: 1,
      rfqNumber: "RFQ-2024-001",
      rfqDate: "2024-01-12",
      quoteDueDate: "2024-01-19",
      totalItems: 15,
      vendorsInvited: 5,
      quotesReceived: 3,
      status: "Open",
      linkedIndents: ["IND-2024-001230", "IND-2024-001231"],
    },
    {
      id: 2,
      rfqNumber: "RFQ-2024-002",
      rfqDate: "2024-01-10",
      quoteDueDate: "2024-01-17",
      totalItems: 8,
      vendorsInvited: 3,
      quotesReceived: 3,
      status: "Evaluation",
      linkedIndents: ["IND-2024-001228"],
    },
  ]

  const quoteData = [
    {
      id: 1,
      rfqNumber: "RFQ-2024-001",
      vendor: "MedSupply Corp",
      quoteNumber: "QT-MS-2024-156",
      quoteDate: "2024-01-15",
      validTill: "2024-01-30",
      totalValue: 125000,
      freightCharges: 2500,
      otherCharges: 1000,
      grandTotal: 128500,
      status: "Received",
      l1Status: "L1",
    },
    {
      id: 2,
      rfqNumber: "RFQ-2024-001",
      vendor: "Pharma Plus Ltd",
      quoteNumber: "QT-PP-2024-089",
      quoteDate: "2024-01-14",
      validTill: "2024-01-28",
      totalValue: 132000,
      freightCharges: 0,
      otherCharges: 500,
      grandTotal: 132500,
      status: "Received",
      l1Status: "L2",
    },
  ]

  const poData = [
    {
      id: 1,
      poNumber: "PO-2024-001234",
      poDate: "2024-01-15",
      vendor: "MedSupply Corp",
      totalItems: 15,
      subtotal: 125000,
      taxAmount: 22500,
      totalAmount: 147500,
      deliveryDate: "2024-01-25",
      approvalStatus: "Approved",
      status: "Open",
      receivedValue: 0,
      pendingValue: 147500,
    },
    {
      id: 2,
      poNumber: "PO-2024-001235",
      poDate: "2024-01-14",
      vendor: "Surgical Supplies Inc",
      totalItems: 8,
      subtotal: 89000,
      taxAmount: 16020,
      totalAmount: 105020,
      deliveryDate: "2024-01-24",
      approvalStatus: "Approved",
      status: "Partial",
      receivedValue: 52500,
      pendingValue: 52520,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "open":
      case "received":
        return "bg-green-100 text-green-800"
      case "pending":
      case "pending approval":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "partial":
      case "evaluation":
        return "bg-blue-100 text-blue-800"
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "normal":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <PrivateRoute modulePath="admin/material-management/procurement" action="view">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Procurement</h1>
          <p className="text-muted-foreground">Manage indents, RFQ, quotes, and purchase orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Indents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">5</span> urgent priority
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active RFQs</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">15</span> quotes pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open POs</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">₹28.5L pending delivery</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹42.8L</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-12%</span> vs last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="indents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="indents">Indents</TabsTrigger>
          <TabsTrigger value="rfq">RFQ & Quotes</TabsTrigger>
          <TabsTrigger value="quotes">Quote Comparison</TabsTrigger>
          <TabsTrigger value="po">Purchase Orders</TabsTrigger>
        </TabsList>

        {/* Indents Tab */}
        <TabsContent value="indents" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Indents / Requisitions</CardTitle>
                  <CardDescription>Manage department requisitions and approval workflow</CardDescription>
                </div>
                <Link href="/material-management/procurement/indents/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Indent
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filters */}
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search indents by number, department, or requester..."
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

              {/* Indents Table */}
              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">Indent Number</th>
                        <th className="text-left p-3 font-medium">Date</th>
                        <th className="text-left p-3 font-medium">Department</th>
                        <th className="text-left p-3 font-medium">Requested By</th>
                        <th className="text-left p-3 font-medium">Priority</th>
                        <th className="text-left p-3 font-medium">Items</th>
                        <th className="text-left p-3 font-medium">Est. Value</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {indentData.map((indent) => (
                        <tr key={indent.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <div className="font-medium">{indent.indentNumber}</div>
                          </td>
                          <td className="p-3">{indent.indentDate}</td>
                          <td className="p-3">{indent.department}</td>
                          <td className="p-3">{indent.requestedBy}</td>
                          <td className="p-3">
                            <Badge className={getStatusColor(indent.priority)}>{indent.priority}</Badge>
                          </td>
                          <td className="p-3">{indent.totalItems}</td>
                          <td className="p-3">₹{indent.estimatedValue.toLocaleString()}</td>
                          <td className="p-3">
                            <div className="space-y-1">
                              <Badge className={getStatusColor(indent.approvalStatus)}>{indent.approvalStatus}</Badge>
                              {indent.approvedBy && (
                                <div className="text-xs text-muted-foreground">by {indent.approvedBy}</div>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              {indent.approvalStatus === "Approved" && indent.status === "Open" && (
                                <Button size="sm" variant="ghost">
                                  <ShoppingCart className="h-4 w-4" />
                                </Button>
                              )}
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

        {/* RFQ Tab */}
        <TabsContent value="rfq" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Request for Quotation (RFQ)</CardTitle>
                  <CardDescription>Manage RFQs and vendor quote collection</CardDescription>
                </div>
                <Link href="/material-management/procurement/rfq/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create RFQ
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {/* RFQ Table */}
              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">RFQ Number</th>
                        <th className="text-left p-3 font-medium">RFQ Date</th>
                        <th className="text-left p-3 font-medium">Due Date</th>
                        <th className="text-left p-3 font-medium">Items</th>
                        <th className="text-left p-3 font-medium">Vendors</th>
                        <th className="text-left p-3 font-medium">Quotes</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rfqData.map((rfq) => (
                        <tr key={rfq.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <div className="font-medium">{rfq.rfqNumber}</div>
                            <div className="text-xs text-muted-foreground">Indents: {rfq.linkedIndents.join(", ")}</div>
                          </td>
                          <td className="p-3">{rfq.rfqDate}</td>
                          <td className="p-3">
                            <div className={new Date(rfq.quoteDueDate) < new Date() ? "text-red-600" : ""}>
                              {rfq.quoteDueDate}
                            </div>
                          </td>
                          <td className="p-3">{rfq.totalItems}</td>
                          <td className="p-3">{rfq.vendorsInvited}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span>
                                {rfq.quotesReceived}/{rfq.vendorsInvited}
                              </span>
                              {rfq.quotesReceived === rfq.vendorsInvited ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Clock className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge className={getStatusColor(rfq.status)}>{rfq.status}</Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              {rfq.quotesReceived > 0 && (
                                <Button size="sm" variant="ghost">
                                  <TrendingUp className="h-4 w-4" />
                                </Button>
                              )}
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

        {/* Quote Comparison Tab */}
        <TabsContent value="quotes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quote Comparison</CardTitle>
              <CardDescription>Compare vendor quotes and select L1/L2 suppliers</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Quote Comparison Table */}
              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">RFQ</th>
                        <th className="text-left p-3 font-medium">Vendor</th>
                        <th className="text-left p-3 font-medium">Quote Number</th>
                        <th className="text-left p-3 font-medium">Quote Date</th>
                        <th className="text-left p-3 font-medium">Valid Till</th>
                        <th className="text-left p-3 font-medium">Total Value</th>
                        <th className="text-left p-3 font-medium">Grand Total</th>
                        <th className="text-left p-3 font-medium">L1/L2</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quoteData.map((quote) => (
                        <tr key={quote.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">{quote.rfqNumber}</td>
                          <td className="p-3">{quote.vendor}</td>
                          <td className="p-3">{quote.quoteNumber}</td>
                          <td className="p-3">{quote.quoteDate}</td>
                          <td className="p-3">
                            <div className={new Date(quote.validTill) < new Date() ? "text-red-600" : ""}>
                              {quote.validTill}
                            </div>
                          </td>
                          <td className="p-3">
                            <div>₹{quote.totalValue.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">
                              +₹{quote.freightCharges + quote.otherCharges} charges
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="font-medium">₹{quote.grandTotal.toLocaleString()}</div>
                          </td>
                          <td className="p-3">
                            <Badge
                              className={
                                quote.l1Status === "L1" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                              }
                            >
                              {quote.l1Status}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {quote.l1Status === "L1" && (
                                <Button size="sm" variant="ghost">
                                  <ShoppingCart className="h-4 w-4" />
                                </Button>
                              )}
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

        {/* Purchase Orders Tab */}
        <TabsContent value="po" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Purchase Orders</CardTitle>
                  <CardDescription>Manage purchase orders and delivery tracking</CardDescription>
                </div>
                <Link href="/material-management/procurement/po/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create PO
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {/* PO Table */}
              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">PO Number</th>
                        <th className="text-left p-3 font-medium">PO Date</th>
                        <th className="text-left p-3 font-medium">Vendor</th>
                        <th className="text-left p-3 font-medium">Items</th>
                        <th className="text-left p-3 font-medium">Total Amount</th>
                        <th className="text-left p-3 font-medium">Delivery Date</th>
                        <th className="text-left p-3 font-medium">Received</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {poData.map((po) => (
                        <tr key={po.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <div className="font-medium">{po.poNumber}</div>
                          </td>
                          <td className="p-3">{po.poDate}</td>
                          <td className="p-3">{po.vendor}</td>
                          <td className="p-3">{po.totalItems}</td>
                          <td className="p-3">
                            <div className="font-medium">₹{po.totalAmount.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">+₹{po.taxAmount.toLocaleString()} tax</div>
                          </td>
                          <td className="p-3">
                            <div
                              className={
                                new Date(po.deliveryDate) < new Date() && po.status !== "Closed" ? "text-red-600" : ""
                              }
                            >
                              {po.deliveryDate}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              ₹{po.receivedValue.toLocaleString()} / ₹{po.totalAmount.toLocaleString()}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${(po.receivedValue / po.totalAmount) * 100}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge className={getStatusColor(po.status)}>{po.status}</Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              {po.status === "Open" || po.status === "Partial" ? (
                                <Button size="sm" variant="ghost">
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              ) : null}
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
      </Tabs>
      </div>
    </PrivateRoute>
  )
}

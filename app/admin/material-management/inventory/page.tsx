"use client"

import { useState } from "react"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  ArrowUpDown,
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  AlertTriangle,
  TrendingUp,
  MapPin,
} from "lucide-react"

export default function InventoryManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data
  const stockData = [
    {
      id: 1,
      itemCode: "MED001",
      itemName: "Paracetamol 500mg",
      location: "Main Pharmacy",
      currentStock: 2500,
      minStock: 500,
      maxStock: 5000,
      unitCost: 2.5,
      totalValue: 6250,
      lastMovement: "2024-01-18",
      status: "Normal",
    },
    {
      id: 2,
      itemCode: "SUR001",
      itemName: "Surgical Gloves (Medium)",
      location: "OT Store",
      currentStock: 75,
      minStock: 100,
      maxStock: 1000,
      unitCost: 45.0,
      totalValue: 3375,
      lastMovement: "2024-01-17",
      status: "Low Stock",
    },
    {
      id: 3,
      itemCode: "CON001",
      itemName: 'Cotton Bandage 4"',
      location: "Ward Store",
      currentStock: 0,
      minStock: 50,
      maxStock: 500,
      unitCost: 12.0,
      totalValue: 0,
      lastMovement: "2024-01-15",
      status: "Stock Out",
    },
  ]

  const transferData = [
    {
      id: 1,
      transferNumber: "TRF-2024-001",
      fromLocation: "Main Pharmacy",
      toLocation: "ICU Pharmacy",
      itemName: "Paracetamol 500mg",
      quantity: 100,
      transferDate: "2024-01-18",
      requestedBy: "ICU Pharmacist",
      status: "Completed",
    },
    {
      id: 2,
      transferNumber: "TRF-2024-002",
      fromLocation: "Central Store",
      toLocation: "OT Store",
      itemName: "Surgical Gloves",
      quantity: 50,
      transferDate: "2024-01-17",
      requestedBy: "OT Sister",
      status: "Pending",
    },
  ]

  const cycleCountData = [
    {
      id: 1,
      countNumber: "CC-2024-001",
      location: "Main Pharmacy",
      scheduledDate: "2024-01-20",
      itemsToCount: 150,
      itemsCounted: 120,
      discrepancies: 5,
      status: "In Progress",
      assignedTo: "Inventory Team A",
    },
    {
      id: 2,
      countNumber: "CC-2024-002",
      location: "Central Store",
      scheduledDate: "2024-01-15",
      itemsToCount: 200,
      itemsCounted: 200,
      discrepancies: 2,
      status: "Completed",
      assignedTo: "Inventory Team B",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "normal":
      case "completed":
        return "bg-green-100 text-green-800"
      case "low stock":
      case "pending":
      case "in progress":
        return "bg-yellow-100 text-yellow-800"
      case "stock out":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <PrivateRoute modulePath="admin/material-management/inventory" action="view">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Stock control, transfers, and cycle counts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Stock Adjustment
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45.2L</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5.2%</span> vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">12</span> stock out
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Transfers</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">3</span> urgent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Turnover</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2x</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.3</span> vs last quarter
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="stock" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stock">Stock Levels</TabsTrigger>
          <TabsTrigger value="transfers">Stock Transfers</TabsTrigger>
          <TabsTrigger value="cycle">Cycle Counts</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        {/* Stock Levels Tab */}
        <TabsContent value="stock" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Stock Levels</CardTitle>
                  <CardDescription>Monitor current stock levels across all locations</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Stock Adjustment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search items by code, name, or location..."
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
                        <th className="text-left p-3 font-medium">Item Code</th>
                        <th className="text-left p-3 font-medium">Item Name</th>
                        <th className="text-left p-3 font-medium">Location</th>
                        <th className="text-left p-3 font-medium">Current Stock</th>
                        <th className="text-left p-3 font-medium">Min/Max</th>
                        <th className="text-left p-3 font-medium">Unit Cost</th>
                        <th className="text-left p-3 font-medium">Total Value</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockData.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <div className="font-medium">{item.itemCode}</div>
                          </td>
                          <td className="p-3">{item.itemName}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {item.location}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="font-medium">{item.currentStock}</div>
                            {item.currentStock <= item.minStock && (
                              <div className="text-xs text-red-600">Below minimum</div>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              {item.minStock} / {item.maxStock}
                            </div>
                          </td>
                          <td className="p-3">₹{item.unitCost}</td>
                          <td className="p-3">₹{item.totalValue.toLocaleString()}</td>
                          <td className="p-3">
                            <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <ArrowUpDown className="h-4 w-4" />
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

        {/* Stock Transfers Tab */}
        <TabsContent value="transfers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Stock Transfers</CardTitle>
                  <CardDescription>Manage inter-location stock transfers</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Transfer
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">Transfer Number</th>
                        <th className="text-left p-3 font-medium">From Location</th>
                        <th className="text-left p-3 font-medium">To Location</th>
                        <th className="text-left p-3 font-medium">Item Name</th>
                        <th className="text-left p-3 font-medium">Quantity</th>
                        <th className="text-left p-3 font-medium">Transfer Date</th>
                        <th className="text-left p-3 font-medium">Requested By</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transferData.map((transfer) => (
                        <tr key={transfer.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <div className="font-medium">{transfer.transferNumber}</div>
                          </td>
                          <td className="p-3">{transfer.fromLocation}</td>
                          <td className="p-3">{transfer.toLocation}</td>
                          <td className="p-3">{transfer.itemName}</td>
                          <td className="p-3">{transfer.quantity}</td>
                          <td className="p-3">{transfer.transferDate}</td>
                          <td className="p-3">{transfer.requestedBy}</td>
                          <td className="p-3">
                            <Badge className={getStatusColor(transfer.status)}>{transfer.status}</Badge>
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

        {/* Cycle Counts Tab */}
        <TabsContent value="cycle" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Cycle Counts</CardTitle>
                  <CardDescription>Schedule and manage inventory cycle counts</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Count
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">Count Number</th>
                        <th className="text-left p-3 font-medium">Location</th>
                        <th className="text-left p-3 font-medium">Scheduled Date</th>
                        <th className="text-left p-3 font-medium">Items to Count</th>
                        <th className="text-left p-3 font-medium">Progress</th>
                        <th className="text-left p-3 font-medium">Discrepancies</th>
                        <th className="text-left p-3 font-medium">Assigned To</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cycleCountData.map((count) => (
                        <tr key={count.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <div className="font-medium">{count.countNumber}</div>
                          </td>
                          <td className="p-3">{count.location}</td>
                          <td className="p-3">{count.scheduledDate}</td>
                          <td className="p-3">{count.itemsToCount}</td>
                          <td className="p-3">
                            <div className="text-sm">
                              {count.itemsCounted} / {count.itemsToCount}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${(count.itemsCounted / count.itemsToCount) * 100}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="p-3">
                            {count.discrepancies > 0 ? (
                              <span className="text-red-600">{count.discrepancies}</span>
                            ) : (
                              <span className="text-green-600">{count.discrepancies}</span>
                            )}
                          </td>
                          <td className="p-3">{count.assignedTo}</td>
                          <td className="p-3">
                            <Badge className={getStatusColor(count.status)}>{count.status}</Badge>
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

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Storage Locations</CardTitle>
                  <CardDescription>Manage warehouse locations and storage areas</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Main Pharmacy", items: 1250, value: "₹15.2L", utilization: 85 },
                  { name: "Central Store", items: 890, value: "₹12.8L", utilization: 72 },
                  { name: "ICU Pharmacy", items: 156, value: "₹3.2L", utilization: 45 },
                  { name: "OT Store", items: 234, value: "₹5.1L", utilization: 68 },
                  { name: "Ward Store", items: 345, value: "₹2.8L", utilization: 55 },
                  { name: "Emergency Store", items: 89, value: "₹1.5L", utilization: 35 },
                ].map((location, index) => (
                  <Card key={index}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <MapPin className="h-5 w-5 text-primary" />
                        <Badge variant="outline">{location.utilization}% Full</Badge>
                      </div>
                      <CardTitle className="text-lg">{location.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Items:</span>
                          <span className="font-medium">{location.items}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Value:</span>
                          <span className="font-medium">{location.value}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${location.utilization}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </PrivateRoute>
  )
}

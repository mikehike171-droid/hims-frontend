"use client"

import { useState } from "react"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Package,
  Users,
  FileText,
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

export default function MastersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Mock data
  const itemMasterData = [
    {
      id: 1,
      itemCode: "MED001",
      itemName: "Paracetamol 500mg",
      category: "Pharmacy",
      domain: "Pharmacy",
      currentStock: 2500,
      minStock: 500,
      maxStock: 5000,
      unitCost: 2.5,
      status: "Active",
      criticality: "High",
      lastUpdated: "2024-01-15",
    },
    {
      id: 2,
      itemCode: "SUR001",
      itemName: "Surgical Gloves (Medium)",
      category: "Surgical",
      domain: "Store",
      currentStock: 150,
      minStock: 100,
      maxStock: 1000,
      unitCost: 45.0,
      status: "Active",
      criticality: "Critical",
      lastUpdated: "2024-01-14",
    },
    {
      id: 3,
      itemCode: "CON001",
      itemName: 'Cotton Bandage 4"',
      category: "Consumable",
      domain: "Store",
      currentStock: 75,
      minStock: 50,
      maxStock: 500,
      unitCost: 12.0,
      status: "Low Stock",
      criticality: "Medium",
      lastUpdated: "2024-01-13",
    },
  ]

  const vendorMasterData = [
    {
      id: 1,
      vendorCode: "VEN001",
      vendorName: "MedSupply Corporation",
      contactPerson: "Rajesh Kumar",
      phone: "+91-9876543210",
      email: "rajesh@medsupply.com",
      gstin: "29ABCDE1234F1Z5",
      creditDays: 30,
      performanceScore: 8.5,
      status: "Active",
      totalPOs: 156,
      lastOrder: "2024-01-14",
    },
    {
      id: 2,
      vendorCode: "VEN002",
      vendorName: "Pharma Plus Ltd",
      contactPerson: "Priya Sharma",
      phone: "+91-9876543211",
      email: "priya@pharmaplus.com",
      gstin: "29FGHIJ5678K2L6",
      creditDays: 45,
      performanceScore: 9.2,
      status: "Active",
      totalPOs: 89,
      lastOrder: "2024-01-15",
    },
    {
      id: 3,
      vendorCode: "VEN003",
      vendorName: "Surgical Supplies Inc",
      contactPerson: "Amit Patel",
      phone: "+91-9876543212",
      email: "amit@surgicalsupplies.com",
      gstin: "29MNOPQ9012R3S7",
      creditDays: 15,
      performanceScore: 7.8,
      status: "Hold",
      totalPOs: 234,
      lastOrder: "2024-01-10",
    },
  ]

  const rateContractData = [
    {
      id: 1,
      contractNumber: "RC-2024-001",
      contractName: "Annual Pharmacy Contract",
      vendor: "MedSupply Corporation",
      validFrom: "2024-01-01",
      validTo: "2024-12-31",
      totalItems: 450,
      totalValue: 2500000,
      status: "Active",
    },
    {
      id: 2,
      contractNumber: "RC-2024-002",
      contractName: "Surgical Items Contract",
      vendor: "Surgical Supplies Inc",
      validFrom: "2024-02-01",
      validTo: "2024-07-31",
      totalItems: 125,
      totalValue: 1200000,
      status: "Active",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800"
      case "low stock":
        return "bg-yellow-100 text-yellow-800"
      case "out of stock":
        return "bg-red-100 text-red-800"
      case "hold":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCriticalityColor = (criticality: string) => {
    switch (criticality.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <PrivateRoute modulePath="admin/material-management/masters" action="view">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Masters & Catalogs</h1>
          <p className="text-muted-foreground">Manage item master, vendor master, and rate contracts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12</span> added this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">3</span> pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Contracts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-orange-600">2</span> expiring soon
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">12</span> critical
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="items" className="space-y-4">
        <TabsList>
          <TabsTrigger value="items">Item Master</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Master</TabsTrigger>
          <TabsTrigger value="contracts">Rate Contracts</TabsTrigger>
          <TabsTrigger value="uom">UoM & Pack Sizes</TabsTrigger>
        </TabsList>

        {/* Item Master Tab */}
        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Item Master</CardTitle>
                  <CardDescription>Manage pharmacy and store items with dual domain support</CardDescription>
                </div>
                <Link href="/material-management/masters/items/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
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
                      placeholder="Search items by code, name, or category..."
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

              {/* Items Table */}
              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">Item Code</th>
                        <th className="text-left p-3 font-medium">Item Name</th>
                        <th className="text-left p-3 font-medium">Category</th>
                        <th className="text-left p-3 font-medium">Current Stock</th>
                        <th className="text-left p-3 font-medium">Min/Max</th>
                        <th className="text-left p-3 font-medium">Unit Cost</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemMasterData.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <div className="font-medium">{item.itemCode}</div>
                            <div className="text-sm text-muted-foreground">{item.domain}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-medium">{item.itemName}</div>
                            <Badge variant="outline" className={getCriticalityColor(item.criticality)}>
                              {item.criticality}
                            </Badge>
                          </td>
                          <td className="p-3">{item.category}</td>
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
                                <Trash2 className="h-4 w-4" />
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

        {/* Vendor Master Tab */}
        <TabsContent value="vendors" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Vendor Master</CardTitle>
                  <CardDescription>Manage vendor information and performance tracking</CardDescription>
                </div>
                <Link href="/material-management/masters/vendors/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vendor
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search vendors by code, name, or GSTIN..." className="pl-8" />
                  </div>
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Vendors Table */}
              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">Vendor Code</th>
                        <th className="text-left p-3 font-medium">Vendor Name</th>
                        <th className="text-left p-3 font-medium">Contact</th>
                        <th className="text-left p-3 font-medium">GSTIN</th>
                        <th className="text-left p-3 font-medium">Credit Days</th>
                        <th className="text-left p-3 font-medium">Performance</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendorMasterData.map((vendor) => (
                        <tr key={vendor.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <div className="font-medium">{vendor.vendorCode}</div>
                            <div className="text-sm text-muted-foreground">{vendor.totalPOs} POs</div>
                          </td>
                          <td className="p-3">
                            <div className="font-medium">{vendor.vendorName}</div>
                            <div className="text-sm text-muted-foreground">{vendor.contactPerson}</div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm">{vendor.phone}</div>
                            <div className="text-sm text-muted-foreground">{vendor.email}</div>
                          </td>
                          <td className="p-3">{vendor.gstin}</td>
                          <td className="p-3">{vendor.creditDays} days</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium">{vendor.performanceScore}/10</div>
                              {vendor.performanceScore >= 8 ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge className={getStatusColor(vendor.status)}>{vendor.status}</Badge>
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
                                <Trash2 className="h-4 w-4" />
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

        {/* Rate Contracts Tab */}
        <TabsContent value="contracts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Rate Contracts</CardTitle>
                  <CardDescription>Manage vendor rate contracts and price lists</CardDescription>
                </div>
                <Link href="/material-management/masters/contracts/create">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Contract
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {/* Contracts Table */}
              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">Contract Number</th>
                        <th className="text-left p-3 font-medium">Contract Name</th>
                        <th className="text-left p-3 font-medium">Vendor</th>
                        <th className="text-left p-3 font-medium">Validity</th>
                        <th className="text-left p-3 font-medium">Items</th>
                        <th className="text-left p-3 font-medium">Total Value</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rateContractData.map((contract) => (
                        <tr key={contract.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <div className="font-medium">{contract.contractNumber}</div>
                          </td>
                          <td className="p-3">{contract.contractName}</td>
                          <td className="p-3">{contract.vendor}</td>
                          <td className="p-3">
                            <div className="text-sm">{contract.validFrom}</div>
                            <div className="text-sm text-muted-foreground">to {contract.validTo}</div>
                          </td>
                          <td className="p-3">{contract.totalItems}</td>
                          <td className="p-3">₹{(contract.totalValue / 100000).toFixed(1)}L</td>
                          <td className="p-3">
                            <Badge className={getStatusColor(contract.status)}>{contract.status}</Badge>
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
                                <Trash2 className="h-4 w-4" />
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

        {/* UoM & Pack Sizes Tab */}
        <TabsContent value="uom" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>UoM & Pack Sizes</CardTitle>
                  <CardDescription>Manage units of measure and pack conversions</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add UoM
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Standard UoMs */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Standard Units</h3>
                  <div className="space-y-2">
                    {["Each", "Box", "Strip", "Bottle", "Vial", "Tube", "Packet", "Kg", "Liter", "Meter"].map((uom) => (
                      <div key={uom} className="flex items-center justify-between p-2 border rounded">
                        <span>{uom}</span>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pack Conversions */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Pack Conversions</h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded">
                      <div className="font-medium">Paracetamol 500mg</div>
                      <div className="text-sm text-muted-foreground">1 Box = 10 Strips = 100 Tablets</div>
                      <div className="text-xs text-muted-foreground mt-1">Purchase: Box | Issue: Tablet</div>
                    </div>
                    <div className="p-3 border rounded">
                      <div className="font-medium">Surgical Gloves</div>
                      <div className="text-sm text-muted-foreground">1 Box = 50 Pairs</div>
                      <div className="text-xs text-muted-foreground mt-1">Purchase: Box | Issue: Pair</div>
                    </div>
                    <div className="p-3 border rounded">
                      <div className="font-medium">IV Fluid 500ml</div>
                      <div className="text-sm text-muted-foreground">1 Case = 20 Bottles</div>
                      <div className="text-xs text-muted-foreground mt-1">Purchase: Case | Issue: Bottle</div>
                    </div>
                  </div>
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

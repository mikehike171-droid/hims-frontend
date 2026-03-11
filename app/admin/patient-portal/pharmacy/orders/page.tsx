"use client"

import { useState } from "react"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Receipt,
  Search,
  Filter,
  Download,
  RefreshCw,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Package,
  Star,
  MessageCircle,
} from "lucide-react"

export default function PharmacyOrders() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const orders = [
    {
      id: "ORD1738156890123",
      date: "2024-01-20",
      status: "delivered",
      items: [
        { name: "Metformin 500mg", quantity: 30, price: 375 },
        { name: "Lisinopril 10mg", quantity: 30, price: 262.5 },
      ],
      total: 637.5,
      deliveryMethod: "delivery",
      deliveryAddress: "123 Main Street, Apartment 4B, Mumbai - 400001",
      estimatedDelivery: "2024-01-21",
      actualDelivery: "2024-01-21",
      paymentMethod: "online",
      prescriptionUploaded: true,
    },
    {
      id: "ORD1738070490456",
      date: "2024-01-18",
      status: "out_for_delivery",
      items: [
        { name: "Paracetamol 500mg", quantity: 20, price: 65 },
        { name: "Vitamin D3 60000 IU", quantity: 8, price: 240 },
      ],
      total: 305,
      deliveryMethod: "delivery",
      deliveryAddress: "123 Main Street, Apartment 4B, Mumbai - 400001",
      estimatedDelivery: "2024-01-19",
      actualDelivery: null,
      paymentMethod: "cod",
      prescriptionUploaded: false,
    },
    {
      id: "ORD1737984090789",
      date: "2024-01-16",
      status: "processing",
      items: [
        { name: "Ibuprofen 400mg", quantity: 21, price: 136.5 },
        { name: "Calcium Carbonate 500mg", quantity: 60, price: 180 },
      ],
      total: 316.5,
      deliveryMethod: "pickup",
      deliveryAddress: "Pranam Branch - Andheri",
      estimatedDelivery: "2024-01-17",
      actualDelivery: null,
      paymentMethod: "online",
      prescriptionUploaded: true,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "out_for_delivery":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      case "out_for_delivery":
        return <Truck className="h-4 w-4" />
      case "processing":
        return <Clock className="h-4 w-4" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <PrivateRoute modulePath="admin/patient-portal/pharmacy/orders" action="view">
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
            <p className="text-gray-600">Track and manage your pharmacy orders</p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Orders
          </Button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by order ID or medicine name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                {/* Order Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Receipt className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold">Order #{order.id}</span>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status.replace("_", " ")}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Ordered: {order.date}</span>
                      <span>•</span>
                      <span>Items: {order.items.length}</span>
                      <span>•</span>
                      <span>Total: ₹{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {order.status === "delivered" && (
                      <>
                        <Button size="sm" variant="outline">
                          <Star className="h-4 w-4 mr-1" />
                          Rate
                        </Button>
                        <Button size="sm" variant="outline">
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Reorder
                        </Button>
                      </>
                    )}
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Invoice
                    </Button>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-2 mb-4">
                  <h4 className="font-medium text-gray-900">Items:</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-600 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-semibold">₹{item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Delivery Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Delivery Information</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        {order.deliveryMethod === "delivery" ? (
                          <Truck className="h-4 w-4 text-green-600" />
                        ) : (
                          <Package className="h-4 w-4 text-blue-600" />
                        )}
                        <span className="capitalize">{order.deliveryMethod}</span>
                      </div>
                      <p className="text-gray-600">{order.deliveryAddress}</p>
                      {order.actualDelivery ? (
                        <p className="text-green-600">Delivered on: {order.actualDelivery}</p>
                      ) : (
                        <p className="text-blue-600">Expected: {order.estimatedDelivery}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Payment & Prescription</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Payment Method:</span>
                        <span className="capitalize">{order.paymentMethod}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Prescription:</span>
                        <Badge
                          className={
                            order.prescriptionUploaded ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }
                        >
                          {order.prescriptionUploaded ? "Uploaded" : "Not Required"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {order.status === "out_for_delivery" && (
                      <Button size="sm" variant="outline">
                        <Truck className="h-4 w-4 mr-1" />
                        Track Order
                      </Button>
                    )}
                    {order.status === "processing" && (
                      <Button size="sm" variant="outline">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Cancel Order
                      </Button>
                    )}
                  </div>

                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">You haven't placed any pharmacy orders yet.</p>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Browse Medicines</Button>
          </div>
        )}
      </div>
      </div>
    </PrivateRoute>
  )
}

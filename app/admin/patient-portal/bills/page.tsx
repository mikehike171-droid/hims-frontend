"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CreditCard,
  Search,
  Filter,
  Download,
  Share,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  Receipt,
  Shield,
} from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function PatientBills() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const bills = [
    {
      id: "bill001",
      invoiceNumber: "INV-2024-001234",
      date: "2024-01-20",
      dueDate: "2024-01-25",
      type: "Outpatient",
      department: "Cardiology",
      doctor: "Dr. Sarah Wilson",
      services: [
        { name: "Consultation", amount: 800, quantity: 1 },
        { name: "ECG", amount: 500, quantity: 1 },
        { name: "Blood Test", amount: 1200, quantity: 1 },
      ],
      subtotal: 2500,
      discount: 250,
      tax: 225,
      total: 2475,
      paid: 0,
      balance: 2475,
      status: "pending",
      paymentMethod: null,
      insuranceClaim: null,
    },
    {
      id: "bill002",
      invoiceNumber: "INV-2024-001235",
      date: "2024-01-18",
      dueDate: "2024-01-23",
      type: "Pharmacy",
      department: "Pharmacy",
      doctor: null,
      services: [
        { name: "Metformin 500mg (60 tablets)", amount: 450, quantity: 1 },
        { name: "Lisinopril 10mg (30 tablets)", amount: 320, quantity: 1 },
      ],
      subtotal: 770,
      discount: 0,
      tax: 69,
      total: 839,
      paid: 839,
      balance: 0,
      status: "paid",
      paymentMethod: "UPI",
      paymentDate: "2024-01-18",
      insuranceClaim: null,
    },
    {
      id: "bill003",
      invoiceNumber: "INV-2024-001236",
      date: "2024-01-15",
      dueDate: "2024-01-20",
      type: "Lab Tests",
      department: "Laboratory",
      doctor: "Dr. Sarah Wilson",
      services: [
        { name: "Complete Blood Count", amount: 600, quantity: 1 },
        { name: "Lipid Profile", amount: 800, quantity: 1 },
        { name: "Thyroid Function Test", amount: 1200, quantity: 1 },
      ],
      subtotal: 2600,
      discount: 260,
      tax: 234,
      total: 2574,
      paid: 0,
      balance: 2574,
      status: "overdue",
      paymentMethod: null,
      insuranceClaim: {
        claimNumber: "CLM-2024-5678",
        status: "approved",
        approvedAmount: 2000,
        patientShare: 574,
      },
    },
  ]

  const paymentHistory = [
    {
      id: "pay001",
      date: "2024-01-18",
      billId: "bill002",
      invoiceNumber: "INV-2024-001235",
      amount: 839,
      method: "UPI",
      transactionId: "TXN123456789",
      status: "success",
    },
    {
      id: "pay002",
      date: "2024-01-10",
      billId: "bill004",
      invoiceNumber: "INV-2024-001200",
      amount: 1500,
      method: "Credit Card",
      transactionId: "TXN123456788",
      status: "success",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "partial":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bill.doctor && bill.doctor.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || bill.status === statusFilter
    const matchesType = typeFilter === "all" || bill.type.toLowerCase() === typeFilter.toLowerCase()
    return matchesSearch && matchesStatus && matchesType
  })

  const totalOutstanding = bills.filter((bill) => bill.status !== "paid").reduce((sum, bill) => sum + bill.balance, 0)

  const handlePayBill = (billId: string) => {
    // Handle payment logic
    console.log("Processing payment for bill:", billId)
  }

  return (
    <PrivateRoute modulePath="admin/patient-portal/bills" action="view">
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bills & Payments</h1>
            <p className="text-gray-600">Manage your medical bills and payment history</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Bills
            </Button>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Outstanding</p>
              <p className="text-2xl font-bold text-red-600">₹{totalOutstanding.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Tabs defaultValue="bills" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bills">Outstanding Bills</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
            <TabsTrigger value="insurance">Insurance Claims</TabsTrigger>
          </TabsList>

          <TabsContent value="bills" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by invoice number, department, or doctor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="outpatient">Outpatient</SelectItem>
                      <SelectItem value="inpatient">Inpatient</SelectItem>
                      <SelectItem value="pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="lab tests">Lab Tests</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Bills List */}
            <div className="space-y-4">
              {filteredBills.map((bill) => (
                <Card key={bill.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Receipt className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold">{bill.invoiceNumber}</span>
                          <Badge className={getStatusColor(bill.status)}>{bill.status}</Badge>
                          {bill.status === "overdue" && (
                            <Badge className="bg-red-100 text-red-800">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Overdue
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Bill Date: {bill.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Due: {bill.dueDate}
                          </div>
                          {bill.doctor && (
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {bill.doctor}
                            </div>
                          )}
                          <span>{bill.department}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">₹{bill.total.toLocaleString()}</p>
                        {bill.balance > 0 && (
                          <p className="text-sm text-red-600">Balance: ₹{bill.balance.toLocaleString()}</p>
                        )}
                        {bill.status === "paid" && (
                          <p className="text-sm text-green-600">
                            <CheckCircle className="h-4 w-4 inline mr-1" />
                            Paid on {bill.paymentDate}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Services */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Services:</h4>
                      <div className="space-y-2">
                        {bill.services.map((service, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{service.name}</span>
                            <div className="text-sm text-gray-600">
                              {service.quantity} × ₹{service.amount} = ₹{service.quantity * service.amount}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bill Summary */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>₹{bill.subtotal.toLocaleString()}</span>
                        </div>
                        {bill.discount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount:</span>
                            <span>-₹{bill.discount.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span>₹{bill.tax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-1">
                          <span>Total:</span>
                          <span>₹{bill.total.toLocaleString()}</span>
                        </div>
                        {bill.paid > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Paid:</span>
                            <span>₹{bill.paid.toLocaleString()}</span>
                          </div>
                        )}
                        {bill.balance > 0 && (
                          <div className="flex justify-between text-red-600 font-semibold">
                            <span>Balance:</span>
                            <span>₹{bill.balance.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Insurance Information */}
                    {bill.insuranceClaim && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Insurance Claim:</h4>
                        <div className="text-sm text-green-800 space-y-1">
                          <div className="flex justify-between">
                            <span>Claim Number:</span>
                            <span>{bill.insuranceClaim.claimNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <Badge className="bg-green-100 text-green-800">{bill.insuranceClaim.status}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Approved Amount:</span>
                            <span>₹{bill.insuranceClaim.approvedAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between font-semibold">
                            <span>Your Share:</span>
                            <span>₹{bill.insuranceClaim.patientShare.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      {bill.status !== "paid" && (
                        <Button onClick={() => handlePayBill(bill.id)} className="bg-green-600 hover:bg-green-700">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay Now
                        </Button>
                      )}
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline">
                        <Share className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      {bill.status === "paid" && (
                        <Button variant="outline">
                          <Receipt className="h-4 w-4 mr-2" />
                          Receipt
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {paymentHistory.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="font-semibold">{payment.invoiceNumber}</span>
                        <Badge className="bg-green-100 text-green-800">{payment.status}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {payment.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4" />
                          {payment.method}
                        </div>
                        <span>TXN: {payment.transactionId}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">₹{payment.amount.toLocaleString()}</p>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Receipt
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="insurance" className="space-y-4">
            {bills
              .filter((bill) => bill.insuranceClaim)
              .map((bill) => (
                <Card key={bill.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Shield className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold">{bill.insuranceClaim?.claimNumber}</span>
                          <Badge className="bg-green-100 text-green-800">{bill.insuranceClaim?.status}</Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Invoice: {bill.invoiceNumber}</p>
                          <p>Date: {bill.date}</p>
                          <p>Department: {bill.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between gap-8">
                            <span>Bill Amount:</span>
                            <span>₹{bill.total.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between gap-8 text-green-600">
                            <span>Approved:</span>
                            <span>₹{bill.insuranceClaim?.approvedAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between gap-8 text-red-600 font-semibold">
                            <span>Your Share:</span>
                            <span>₹{bill.insuranceClaim?.patientShare.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </PrivateRoute>
  )
}

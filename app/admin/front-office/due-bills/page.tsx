"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  Download,
  Eye,
  CreditCard,
  IndianRupee,
  AlertTriangle,
  Clock,
  Users,
  TrendingUp,
  FileText,
  Send,
} from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"

// Mock data for due bills
const dueBills = [
  {
    id: "DB001",
    patientId: "P001234",
    patientName: "John Doe",
    phone: "+91 9876543210",
    email: "john.doe@email.com",
    billDate: "2024-01-15",
    dueDate: "2024-02-15",
    totalAmount: 15000,
    paidAmount: 5000,
    dueAmount: 10000,
    status: "overdue",
    priority: "high",
    company: "ABC Insurance",
    services: ["Consultation", "Lab Tests", "Medicines"],
    lastPayment: "2024-01-20",
    daysPastDue: 15,
    paymentHistory: [{ date: "2024-01-20", amount: 5000, method: "Cash", reference: "R001" }],
  },
  {
    id: "DB002",
    patientId: "P001235",
    patientName: "Jane Smith",
    phone: "+91 9876543211",
    email: "jane.smith@email.com",
    billDate: "2024-01-20",
    dueDate: "2024-02-20",
    totalAmount: 8000,
    paidAmount: 0,
    dueAmount: 8000,
    status: "pending",
    priority: "medium",
    company: "Self Pay",
    services: ["Surgery", "Room Charges"],
    lastPayment: null,
    daysPastDue: 5,
    paymentHistory: [],
  },
  {
    id: "DB003",
    patientId: "P001236",
    patientName: "Mike Johnson",
    phone: "+91 9876543212",
    email: "mike.johnson@email.com",
    billDate: "2024-01-25",
    dueDate: "2024-02-25",
    totalAmount: 12000,
    paidAmount: 12000,
    dueAmount: 0,
    status: "paid",
    priority: "low",
    company: "XYZ TPA",
    services: ["Consultation", "Pharmacy"],
    lastPayment: "2024-02-01",
    daysPastDue: 0,
    paymentHistory: [{ date: "2024-02-01", amount: 12000, method: "Card", reference: "R002" }],
  },
]

const stats = [
  {
    title: "Total Due Amount",
    value: "₹18,000",
    change: "+12%",
    icon: IndianRupee,
    color: "text-red-600",
  },
  {
    title: "Overdue Bills",
    value: "1",
    change: "-5%",
    icon: AlertTriangle,
    color: "text-orange-600",
  },
  {
    title: "Average Days Overdue",
    value: "10",
    change: "+2%",
    icon: Clock,
    color: "text-blue-600",
  },
  {
    title: "Collection Rate",
    value: "75%",
    change: "+8%",
    icon: TrendingUp,
    color: "text-green-600",
  },
]

export default function DueBillsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [companyFilter, setCompanyFilter] = useState("all")
  const [selectedBill, setSelectedBill] = useState<any>(null)
  const [paymentDialog, setPaymentDialog] = useState(false)
  const [reminderDialog, setReminderDialog] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [paymentReference, setPaymentReference] = useState("")
  const [reminderType, setReminderType] = useState("sms")
  const [reminderMessage, setReminderMessage] = useState("")

  const filteredBills = dueBills.filter((bill) => {
    const matchesSearch =
      bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || bill.status === statusFilter
    const matchesPriority = priorityFilter === "all" || bill.priority === priorityFilter
    const matchesCompany = companyFilter === "all" || bill.company === companyFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesCompany
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handlePayment = () => {
    // Handle payment processing
    console.log("Processing payment:", {
      billId: selectedBill?.id,
      amount: paymentAmount,
      method: paymentMethod,
      reference: paymentReference,
    })
    setPaymentDialog(false)
    setPaymentAmount("")
    setPaymentMethod("")
    setPaymentReference("")
  }

  const handleReminder = () => {
    // Handle sending reminder
    console.log("Sending reminder:", {
      billId: selectedBill?.id,
      type: reminderType,
      message: reminderMessage,
    })
    setReminderDialog(false)
    setReminderMessage("")
  }

  return (
    <PrivateRoute modulePath="admin/front-office/due-bills" action="view">
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Due Bills Management</h1>
          <p className="text-gray-600">Track and manage outstanding patient bills</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search patients, bill ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                <SelectItem value="Self Pay">Self Pay</SelectItem>
                <SelectItem value="ABC Insurance">ABC Insurance</SelectItem>
                <SelectItem value="XYZ TPA">XYZ TPA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Due Bills List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Due Bills ({filteredBills.length})</CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBills.map((bill) => (
              <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{bill.patientName}</h3>
                      <Badge variant="outline">{bill.patientId}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Bill: {bill.id}</span>
                      <span>Due: {bill.dueDate}</span>
                      <span>{bill.company}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium text-red-600">₹{bill.dueAmount.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">of ₹{bill.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge className={getStatusColor(bill.status)}>{bill.status}</Badge>
                    <Badge className={getPriorityColor(bill.priority)}>{bill.priority}</Badge>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedBill(bill)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Bill Details - {bill.id}</DialogTitle>
                      </DialogHeader>
                      <Tabs defaultValue="details" className="w-full">
                        <TabsList>
                          <TabsTrigger value="details">Bill Details</TabsTrigger>
                          <TabsTrigger value="payments">Payment History</TabsTrigger>
                          <TabsTrigger value="actions">Actions</TabsTrigger>
                        </TabsList>
                        <TabsContent value="details" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Patient Information</h4>
                              <div className="space-y-2 text-sm">
                                <p>
                                  <strong>Name:</strong> {bill.patientName}
                                </p>
                                <p>
                                  <strong>ID:</strong> {bill.patientId}
                                </p>
                                <p>
                                  <strong>Phone:</strong> {bill.phone}
                                </p>
                                <p>
                                  <strong>Email:</strong> {bill.email}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Bill Information</h4>
                              <div className="space-y-2 text-sm">
                                <p>
                                  <strong>Bill Date:</strong> {bill.billDate}
                                </p>
                                <p>
                                  <strong>Due Date:</strong> {bill.dueDate}
                                </p>
                                <p>
                                  <strong>Days Past Due:</strong> {bill.daysPastDue}
                                </p>
                                <p>
                                  <strong>Company:</strong> {bill.company}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Services</h4>
                            <div className="flex gap-2">
                              {bill.services.map((service, index) => (
                                <Badge key={index} variant="outline">
                                  {service}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Total Amount</p>
                              <p className="text-lg font-bold">₹{bill.totalAmount.toLocaleString()}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Paid Amount</p>
                              <p className="text-lg font-bold text-green-600">₹{bill.paidAmount.toLocaleString()}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-gray-600">Due Amount</p>
                              <p className="text-lg font-bold text-red-600">₹{bill.dueAmount.toLocaleString()}</p>
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="payments" className="space-y-4">
                          {bill.paymentHistory.length > 0 ? (
                            <div className="space-y-2">
                              {bill.paymentHistory.map((payment, index) => (
                                <div key={index} className="flex justify-between items-center p-3 border rounded">
                                  <div>
                                    <p className="font-medium">₹{payment.amount.toLocaleString()}</p>
                                    <p className="text-sm text-gray-600">
                                      {payment.date} • {payment.method}
                                    </p>
                                  </div>
                                  <Badge variant="outline">{payment.reference}</Badge>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-center text-gray-500 py-8">No payments recorded</p>
                          )}
                        </TabsContent>
                        <TabsContent value="actions" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <Button onClick={() => setPaymentDialog(true)} className="w-full">
                              <CreditCard className="h-4 w-4 mr-2" />
                              Record Payment
                            </Button>
                            <Button variant="outline" onClick={() => setReminderDialog(true)} className="w-full">
                              <Send className="h-4 w-4 mr-2" />
                              Send Reminder
                            </Button>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={paymentDialog} onOpenChange={setPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Payment Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="method">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="reference">Reference Number</Label>
              <Input
                id="reference"
                placeholder="Enter reference number"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPaymentDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handlePayment}>Record Payment</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reminder Dialog */}
      <Dialog open={reminderDialog} onOpenChange={setReminderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Payment Reminder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reminderType">Reminder Type</Label>
              <Select value={reminderType} onValueChange={setReminderType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="both">SMS & Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Enter reminder message"
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setReminderDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleReminder}>
                <Send className="h-4 w-4 mr-2" />
                Send Reminder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </PrivateRoute>
  )
}

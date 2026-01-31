"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Search,
  CreditCard,
  Phone,
  MessageSquare,
  Calendar,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  IndianRupee,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import PrivateRoute from "@/components/auth/PrivateRoute"

// Mock data for pending payments
const mockPendingPayments = [
  {
    id: 1,
    patientId: "P001234",
    patientName: "Rajesh Kumar",
    phone: "+91 98765 43210",
    appointmentDate: "2024-01-15",
    doctor: "Dr. Patel",
    department: "Cardiology",
    consultationFee: 800,
    bookingFee: 100,
    totalAmount: 900,
    paidAmount: 100,
    pendingAmount: 800,
    paymentStatus: "partial",
    dueDate: "2024-01-15",
    daysPending: 3,
    lastReminder: "2024-01-12",
    priority: "high",
  },
  {
    id: 2,
    patientId: "P001235",
    patientName: "Priya Sharma",
    phone: "+91 98765 43211",
    appointmentDate: "2024-01-14",
    doctor: "Dr. Singh",
    department: "Dermatology",
    consultationFee: 600,
    bookingFee: 0,
    totalAmount: 600,
    paidAmount: 0,
    pendingAmount: 600,
    paymentStatus: "pending",
    dueDate: "2024-01-14",
    daysPending: 4,
    lastReminder: "2024-01-10",
    priority: "high",
  },
  {
    id: 3,
    patientId: "P001236",
    patientName: "Amit Singh",
    phone: "+91 98765 43212",
    appointmentDate: "2024-01-16",
    doctor: "Dr. Gupta",
    department: "Orthopedics",
    consultationFee: 700,
    bookingFee: 100,
    totalAmount: 800,
    paidAmount: 0,
    pendingAmount: 800,
    paymentStatus: "pending",
    dueDate: "2024-01-16",
    daysPending: 2,
    lastReminder: "2024-01-13",
    priority: "medium",
  },
  {
    id: 4,
    patientId: "P001237",
    patientName: "Sunita Devi",
    phone: "+91 98765 43213",
    appointmentDate: "2024-01-17",
    doctor: "Dr. Verma",
    department: "Pediatrics",
    consultationFee: 500,
    bookingFee: 0,
    totalAmount: 500,
    paidAmount: 0,
    pendingAmount: 500,
    paymentStatus: "pending",
    dueDate: "2024-01-17",
    daysPending: 1,
    lastReminder: null,
    priority: "low",
  },
]

export default function PendingPayments() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentNotes, setPaymentNotes] = useState("")

  const filteredPayments = mockPendingPayments.filter((payment) => {
    if (
      searchTerm &&
      !payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !payment.phone.includes(searchTerm) &&
      !payment.patientId.includes(searchTerm)
    ) {
      return false
    }
    if (statusFilter !== "all" && payment.paymentStatus !== statusFilter) return false
    if (priorityFilter !== "all" && payment.priority !== priorityFilter) return false
    return true
  })

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-red-100 text-red-800"
      case "partial":
        return "bg-yellow-100 text-yellow-800"
      case "paid":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSendReminder = (payment: any, channel: string) => {
    toast.success(`Payment reminder sent via ${channel} to ${payment.patientName}`)
  }

  const handleCallPatient = (payment: any) => {
    toast.success(`Initiating call to ${payment.patientName} (${payment.phone})`)
  }

  const handleProcessPayment = () => {
    if (!paymentMethod || !paymentAmount) {
      toast.error("Please fill all required fields")
      return
    }

    toast.success("Payment processed successfully!")
    setShowPaymentDialog(false)
    setSelectedPayment(null)
    setPaymentMethod("")
    setPaymentAmount("")
    setPaymentNotes("")
  }

  const handleGeneratePaymentLink = (payment: any) => {
    const paymentLink = `https://pay.pranamhms.com/payment/${payment.id}`
    navigator.clipboard.writeText(paymentLink)
    toast.success("Payment link copied to clipboard!")
  }

  const totalPendingAmount = filteredPayments.reduce((sum, payment) => sum + payment.pendingAmount, 0)
  const highPriorityCount = filteredPayments.filter((p) => p.priority === "high").length

  return (
    <PrivateRoute modulePath="admin/telecaller/pending-payments" action="view">
      <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pending Payments</h1>
            <p className="text-muted-foreground">Track and collect pending patient payments</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalPendingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{filteredPayments.length} patients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPriorityCount}</div>
            <p className="text-xs text-muted-foreground">Overdue payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partial Payments</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredPayments.filter((p) => p.paymentStatus === "partial").length}
            </div>
            <p className="text-xs text-muted-foreground">Require follow-up</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Collections</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12,500</div>
            <p className="text-xs text-muted-foreground">8 payments received</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Tracking</CardTitle>
          <CardDescription>Manage and collect pending patient payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name, phone, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment List */}
          <div className="space-y-3">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{payment.patientName}</h3>
                          <Badge className={getPriorityColor(payment.priority)}>{payment.priority}</Badge>
                          <Badge className={getStatusColor(payment.paymentStatus)}>{payment.paymentStatus}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mt-1">
                          <p className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            ID: {payment.patientId}
                          </p>
                          <p className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {payment.phone}
                          </p>
                          <p className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Appointment: {payment.appointmentDate}
                          </p>
                          <p>
                            Doctor: {payment.doctor} ({payment.department})
                          </p>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span>Total: ₹{payment.totalAmount}</span>
                          <span>Paid: ₹{payment.paidAmount}</span>
                          <span className="font-semibold text-red-600">Pending: ₹{payment.pendingAmount}</span>
                          <span className="text-muted-foreground">{payment.daysPending} days pending</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-1">
                      <Button size="sm" onClick={() => handleCallPatient(payment)}>
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleSendReminder(payment, "WhatsApp")}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleGeneratePaymentLink(payment)}>
                        <CreditCard className="h-4 w-4" />
                      </Button>
                    </div>
                    <Dialog
                      open={showPaymentDialog && selectedPayment?.id === payment.id}
                      onOpenChange={setShowPaymentDialog}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => setSelectedPayment(payment)}
                        >
                          Collect Payment
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Process Payment - {payment.patientName}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Total Amount</Label>
                              <div className="text-lg font-semibold">₹{payment.totalAmount}</div>
                            </div>
                            <div>
                              <Label>Pending Amount</Label>
                              <div className="text-lg font-semibold text-red-600">₹{payment.pendingAmount}</div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="payment-method">Payment Method *</Label>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="card">Card</SelectItem>
                                <SelectItem value="upi">UPI</SelectItem>
                                <SelectItem value="online">Online Transfer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="payment-amount">Payment Amount *</Label>
                            <Input
                              id="payment-amount"
                              type="number"
                              placeholder="Enter amount"
                              value={paymentAmount}
                              onChange={(e) => setPaymentAmount(e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="payment-notes">Notes</Label>
                            <Textarea
                              id="payment-notes"
                              placeholder="Payment notes..."
                              value={paymentNotes}
                              onChange={(e) => setPaymentNotes(e.target.value)}
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button onClick={handleProcessPayment} className="flex-1">
                              Process Payment
                            </Button>
                            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}
            {filteredPayments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No pending payments found matching your criteria
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </PrivateRoute>
  )
}

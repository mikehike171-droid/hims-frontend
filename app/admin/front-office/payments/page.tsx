"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  CreditCard,
  Banknote,
  QrCode,
  Receipt,
  RefreshCw,
  DollarSign,
  TrendingUp,
  Filter,
  Download,
  Printer,
  Eye,
  Clock,
  Plus,
  Calculator,
  Percent,
  Users,
  Building,
} from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"

interface PaymentMethod {
  type: string
  amount: number
  reference?: string
}

interface Payment {
  id: string
  patientId: string
  patientName: string
  billId: string
  totalAmount: number
  paidAmount: number
  balanceAmount: number
  paymentMethods: PaymentMethod[]
  status: "completed" | "partial" | "pending" | "failed"
  timestamp: string
  receiptNo: string
  isPartial: boolean
  dueDate?: string
  companyName?: string
  insuranceProvider?: string
}

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [multiplePayments, setMultiplePayments] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([{ type: "cash", amount: 0 }])

  const todayStats = {
    totalCollections: 125000,
    cashPayments: 45000,
    cardPayments: 35000,
    upiPayments: 28000,
    onlinePayments: 17000,
    pendingPayments: 8500,
    refundsProcessed: 2500,
    partialPayments: 12000,
    corporatePayments: 25000,
  }

  const recentPayments: Payment[] = [
    {
      id: "PAY001",
      patientId: "P001234",
      patientName: "Rajesh Kumar",
      billId: "BL001234",
      totalAmount: 2500,
      paidAmount: 2500,
      balanceAmount: 0,
      paymentMethods: [{ type: "Card", amount: 2500, reference: "TXN123456" }],
      status: "completed",
      timestamp: "2024-01-15 10:30 AM",
      receiptNo: "RC001234",
      isPartial: false,
    },
    {
      id: "PAY002",
      patientId: "P001235",
      patientName: "Priya Sharma",
      billId: "BL001235",
      totalAmount: 5000,
      paidAmount: 3000,
      balanceAmount: 2000,
      paymentMethods: [
        { type: "Cash", amount: 1500 },
        { type: "UPI", amount: 1500, reference: "UPI789012" },
      ],
      status: "partial",
      timestamp: "2024-01-15 10:25 AM",
      receiptNo: "RC001235",
      isPartial: true,
      dueDate: "2024-01-20",
    },
    {
      id: "PAY003",
      patientId: "P001236",
      patientName: "Amit Singh",
      billId: "BL001236",
      totalAmount: 8500,
      paidAmount: 0,
      balanceAmount: 8500,
      paymentMethods: [],
      status: "pending",
      timestamp: "2024-01-15 10:20 AM",
      receiptNo: "",
      isPartial: false,
      companyName: "TCS Limited",
      dueDate: "2024-01-25",
    },
  ]

  const pendingPayments = [
    {
      id: "PP001",
      patientId: "P001240",
      patientName: "Sunita Patel",
      billId: "BL001240",
      amount: 3500,
      dueDate: "2024-01-20",
      daysPending: 2,
      department: "Cardiology",
      paymentType: "Insurance",
      insuranceProvider: "HDFC ERGO",
    },
    {
      id: "PP002",
      patientId: "P001241",
      patientName: "Vikram Gupta",
      billId: "BL001241",
      amount: 1200,
      dueDate: "2024-01-18",
      daysPending: 5,
      department: "Orthopedics",
      paymentType: "Corporate",
      companyName: "Infosys Limited",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case "partial":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Partial</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const addPaymentMethod = () => {
    setPaymentMethods([...paymentMethods, { type: "cash", amount: 0 }])
  }

  const updatePaymentMethod = (index: number, field: string, value: string | number) => {
    const updated = paymentMethods.map((method, i) => (i === index ? { ...method, [field]: value } : method))
    setPaymentMethods(updated)
  }

  const removePaymentMethod = (index: number) => {
    setPaymentMethods(paymentMethods.filter((_, i) => i !== index))
  }

  const getTotalPaymentAmount = () => {
    return paymentMethods.reduce((sum, method) => sum + method.amount, 0)
  }

  const handlePaymentSubmit = () => {
    const paymentData = {
      paymentMethods,
      totalAmount: getTotalPaymentAmount(),
      isMultiple: multiplePayments,
      timestamp: new Date().toISOString(),
    }

    console.log("Processing payment:", paymentData)
    alert("Payment processed successfully!")

    // Reset form
    setPaymentMethods([{ type: "cash", amount: 0 }])
    setMultiplePayments(false)
    setShowPaymentDialog(false)
  }

  const handleRefund = (paymentId: string) => {
    alert(`Refund initiated for payment ${paymentId}`)
  }

  const handlePrintReceipt = (receiptNo: string) => {
    alert(`Printing receipt ${receiptNo}`)
  }

  const handlePartialPayment = (payment: Payment) => {
    setSelectedPayment(payment)
    setShowPaymentDialog(true)
  }

  const PaymentCollectionDialog = () => (
    <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Payment Collection</DialogTitle>
          <DialogDescription>
            {selectedPayment
              ? `Collect payment for ${selectedPayment.patientName} - Balance: ₹${selectedPayment.balanceAmount}`
              : "Process new payment"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {selectedPayment && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Patient</Label>
                    <p className="font-medium">{selectedPayment.patientName}</p>
                  </div>
                  <div>
                    <Label className="text-sm">Bill ID</Label>
                    <p className="font-medium">{selectedPayment.billId}</p>
                  </div>
                  <div>
                    <Label className="text-sm">Total Amount</Label>
                    <p className="font-medium">₹{selectedPayment.totalAmount}</p>
                  </div>
                  <div>
                    <Label className="text-sm">Balance Due</Label>
                    <p className="font-medium text-red-600">₹{selectedPayment.balanceAmount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox id="multiplePayments" checked={multiplePayments} onCheckedChange={setMultiplePayments} />
            <Label htmlFor="multiplePayments">Multiple Payment Methods</Label>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Payment Methods</Label>
              {multiplePayments && (
                <Button size="sm" onClick={addPaymentMethod}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Method
                </Button>
              )}
            </div>

            {paymentMethods.map((method, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Payment Type</Label>
                    <Select value={method.type} onValueChange={(value) => updatePaymentMethod(index, "type", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="netbanking">Net Banking</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                        <SelectItem value="insurance">Insurance</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={method.amount}
                      onChange={(e) => updatePaymentMethod(index, "amount", Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>Reference (Optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Transaction ID"
                        value={method.reference || ""}
                        onChange={(e) => updatePaymentMethod(index, "reference", e.target.value)}
                      />
                      {multiplePayments && paymentMethods.length > 1 && (
                        <Button size="sm" variant="destructive" onClick={() => removePaymentMethod(index)}>
                          ×
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Payment Amount:</span>
                <span className="text-xl font-bold text-green-600">₹{getTotalPaymentAmount().toFixed(2)}</span>
              </div>
              {selectedPayment && getTotalPaymentAmount() < selectedPayment.balanceAmount && (
                <p className="text-sm text-orange-600 mt-2">
                  Remaining Balance: ₹{(selectedPayment.balanceAmount - getTotalPaymentAmount()).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handlePaymentSubmit} disabled={getTotalPaymentAmount() <= 0}>
            <CreditCard className="h-4 w-4 mr-2" />
            Process Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <PrivateRoute modulePath="admin/front-office/payments" action="view">
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments & Receipts</h1>
          <p className="text-gray-600">Advanced payment processing with multiple methods and partial payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => setShowPaymentDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Payment
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Collections</p>
                <p className="text-2xl font-bold text-green-600">₹{todayStats.totalCollections.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cash</p>
                <p className="text-xl font-bold">₹{todayStats.cashPayments.toLocaleString()}</p>
              </div>
              <Banknote className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Card</p>
                <p className="text-xl font-bold">₹{todayStats.cardPayments.toLocaleString()}</p>
              </div>
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">UPI</p>
                <p className="text-xl font-bold">₹{todayStats.upiPayments.toLocaleString()}</p>
              </div>
              <QrCode className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Online</p>
                <p className="text-xl font-bold">₹{todayStats.onlinePayments.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Partial</p>
                <p className="text-xl font-bold text-blue-600">₹{todayStats.partialPayments.toLocaleString()}</p>
              </div>
              <Percent className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Corporate</p>
                <p className="text-xl font-bold text-purple-600">₹{todayStats.corporatePayments.toLocaleString()}</p>
              </div>
              <Building className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-xl font-bold text-yellow-600">₹{todayStats.pendingPayments.toLocaleString()}</p>
              </div>
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="space-y-4">
        <TabsList>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="pending">Pending Payments</TabsTrigger>
          <TabsTrigger value="partial">Partial Payments</TabsTrigger>
          <TabsTrigger value="corporate">Corporate Payments</TabsTrigger>
          <TabsTrigger value="receipts">Receipt Management</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>View and manage all payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by patient, bill ID, or receipt number"
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Patient Details</TableHead>
                    <TableHead>Amount Details</TableHead>
                    <TableHead>Payment Methods</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.patientName}</p>
                          <p className="text-sm text-gray-600">
                            {payment.patientId} • {payment.billId}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">₹{payment.totalAmount.toLocaleString()}</p>
                          {payment.isPartial && (
                            <>
                              <p className="text-sm text-green-600">Paid: ₹{payment.paidAmount}</p>
                              <p className="text-sm text-red-600">Balance: ₹{payment.balanceAmount}</p>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {payment.paymentMethods.map((method, index) => (
                            <div key={index} className="text-sm">
                              <Badge variant="outline" className="mr-1">
                                {method.type}
                              </Badge>
                              ₹{method.amount}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell className="text-sm">{payment.timestamp}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handlePrintReceipt(payment.receiptNo)}>
                            <Printer className="h-4 w-4" />
                          </Button>
                          {payment.status === "partial" && (
                            <Button size="sm" onClick={() => handlePartialPayment(payment)}>
                              <Calculator className="h-4 w-4" />
                            </Button>
                          )}
                          {payment.status === "completed" && (
                            <Button size="sm" variant="outline" onClick={() => handleRefund(payment.id)}>
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Payments</CardTitle>
              <CardDescription>Follow up on outstanding payments and dues</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Details</TableHead>
                    <TableHead>Amount Due</TableHead>
                    <TableHead>Days Pending</TableHead>
                    <TableHead>Payment Type</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.patientName}</p>
                          <p className="text-sm text-gray-600">
                            {payment.patientId} • {payment.billId}
                          </p>
                          <p className="text-sm text-gray-600">{payment.department}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-red-600">₹{payment.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={payment.daysPending > 3 ? "destructive" : "secondary"}>
                          {payment.daysPending} days
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <Badge variant="outline">{payment.paymentType}</Badge>
                          {payment.companyName && <p className="text-sm text-gray-600 mt-1">{payment.companyName}</p>}
                          {payment.insuranceProvider && (
                            <p className="text-sm text-gray-600 mt-1">{payment.insuranceProvider}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{payment.dueDate}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm">Collect Payment</Button>
                          <Button size="sm" variant="outline">
                            Send Reminder
                          </Button>
                          <Button size="sm" variant="outline">
                            Contact
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="partial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Partial Payments</CardTitle>
              <CardDescription>Manage bills with partial payments and outstanding balances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments
                  .filter((p) => p.status === "partial")
                  .map((payment) => (
                    <Card key={payment.id} className="border-blue-200 bg-blue-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold">{payment.patientName}</h4>
                            <p className="text-sm text-gray-600">
                              {payment.billId} • {payment.timestamp}
                            </p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">Partial Payment</Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <Label className="text-sm text-gray-600">Total Amount</Label>
                            <p className="font-medium">₹{payment.totalAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-600">Paid Amount</Label>
                            <p className="font-medium text-green-600">₹{payment.paidAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-600">Balance Due</Label>
                            <p className="font-medium text-red-600">₹{payment.balanceAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-600">Due Date</Label>
                            <p className="font-medium">{payment.dueDate}</p>
                          </div>
                        </div>

                        <div className="mb-4">
                          <Label className="text-sm text-gray-600">Payment Methods Used</Label>
                          <div className="flex gap-2 mt-1">
                            {payment.paymentMethods.map((method, index) => (
                              <Badge key={index} variant="outline">
                                {method.type}: ₹{method.amount}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handlePartialPayment(payment)}>
                            <Calculator className="h-4 w-4 mr-2" />
                            Collect Balance
                          </Button>
                          <Button size="sm" variant="outline">
                            <Receipt className="h-4 w-4 mr-2" />
                            Print Receipt
                          </Button>
                          <Button size="sm" variant="outline">
                            Send Reminder
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="corporate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Corporate Payments</CardTitle>
              <CardDescription>Manage company and insurance payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPayments
                  .filter((p) => p.companyName || p.insuranceProvider)
                  .map((payment) => (
                    <Card key={payment.id} className="border-purple-200 bg-purple-50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold">{payment.patientName}</h4>
                            <p className="text-sm text-gray-600">{payment.billId}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {payment.companyName && (
                              <Badge className="bg-purple-100 text-purple-800">
                                <Building className="h-3 w-3 mr-1" />
                                Corporate
                              </Badge>
                            )}
                            {payment.insuranceProvider && (
                              <Badge className="bg-blue-100 text-blue-800">
                                <Users className="h-3 w-3 mr-1" />
                                Insurance
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <Label className="text-sm text-gray-600">Amount</Label>
                            <p className="font-medium">₹{payment.totalAmount.toLocaleString()}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-600">Company/Insurance</Label>
                            <p className="font-medium">{payment.companyName || payment.insuranceProvider}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-600">Due Date</Label>
                            <p className="font-medium">{payment.dueDate}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm">Follow Up</Button>
                          <Button size="sm" variant="outline">
                            Send Invoice
                          </Button>
                          <Button size="sm" variant="outline">
                            Contact Company
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receipts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Receipt Management</CardTitle>
              <CardDescription>Manage receipts, reprints, and receipt configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-dashed">
                  <CardContent className="p-6 text-center">
                    <Receipt className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                    <h3 className="font-semibold mb-2">Generate Receipt</h3>
                    <p className="text-sm text-gray-600 mb-4">Create new receipt for manual payments</p>
                    <Button>Generate</Button>
                  </CardContent>
                </Card>

                <Card className="border-dashed">
                  <CardContent className="p-6 text-center">
                    <Printer className="h-12 w-12 mx-auto text-green-600 mb-4" />
                    <h3 className="font-semibold mb-2">Reprint Receipt</h3>
                    <p className="text-sm text-gray-600 mb-4">Reprint existing receipts with watermark</p>
                    <Button variant="outline">Reprint</Button>
                  </CardContent>
                </Card>

                <Card className="border-dashed">
                  <CardContent className="p-6 text-center">
                    <Download className="h-12 w-12 mx-auto text-purple-600 mb-4" />
                    <h3 className="font-semibold mb-2">Bulk Download</h3>
                    <p className="text-sm text-gray-600 mb-4">Download multiple receipts at once</p>
                    <Button variant="outline">Download</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Collection Dialog */}
      <PaymentCollectionDialog />
    </div>
    </PrivateRoute>
  )
}

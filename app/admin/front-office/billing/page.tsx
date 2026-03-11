"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Plus,
  CreditCard,
  Receipt,
  Save,
  UserCheck,
  Edit,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  X,
  Eye,
  Printer,
  Calculator,
} from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"

interface BillItem {
  id: string
  name: string
  category: string
  price: number
  quantity: number
  discount: number
  total: number
  canCancel: boolean
}

interface Bill {
  id: string
  patientId: string
  patientName: string
  patientPhone: string
  date: string
  items: BillItem[]
  subtotal: number
  discount: number
  tax: number
  total: number
  status: "draft" | "paid" | "cancelled" | "partial"
  paymentMethod?: string
  paidAmount?: number
  balanceAmount?: number
}

const mockServices = [
  { id: "S001", name: "Consultation - General Medicine", price: 500, category: "Consultation" },
  { id: "S002", name: "ECG", price: 200, category: "Investigation" },
  { id: "S003", name: "Blood Test - CBC", price: 300, category: "Lab" },
  { id: "S004", name: "X-Ray Chest", price: 400, category: "Radiology" },
  { id: "S005", name: "Physiotherapy Session", price: 600, category: "Treatment" },
  { id: "S006", name: "Ultrasound Abdomen", price: 800, category: "Radiology" },
  { id: "S007", name: "Injection", price: 100, category: "Treatment" },
]

const mockPatient = {
  id: "P001234",
  name: "Rajesh Kumar",
  phone: "+91-9876543210",
  age: 45,
  gender: "Male",
  insurance: "HDFC ERGO",
  policyNumber: "POL123456",
  corporateDiscount: 10,
}

const mockBills: Bill[] = [
  {
    id: "BILL001",
    patientId: "P001234",
    patientName: "Rajesh Kumar",
    patientPhone: "+91-9876543210",
    date: "2024-01-15",
    items: [
      {
        id: "1",
        name: "Consultation - Cardiology",
        category: "Consultation",
        price: 800,
        quantity: 1,
        discount: 0,
        total: 800,
        canCancel: true,
      },
      {
        id: "2",
        name: "ECG",
        category: "Investigation",
        price: 200,
        quantity: 1,
        discount: 0,
        total: 200,
        canCancel: true,
      },
      {
        id: "3",
        name: "Blood Test - CBC",
        category: "Lab",
        price: 300,
        quantity: 1,
        discount: 0,
        total: 300,
        canCancel: false,
      },
    ],
    subtotal: 1300,
    discount: 0,
    tax: 234,
    total: 1534,
    status: "paid",
    paymentMethod: "Card",
    paidAmount: 1534,
    balanceAmount: 0,
  },
]

export default function FrontOfficeBilling() {
  const [selectedServices, setSelectedServices] = useState<BillItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [patientSearch, setPatientSearch] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<typeof mockPatient | null>(null)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [discountType, setDiscountType] = useState("none")
  const [discountValue, setDiscountValue] = useState(0)
  const [showBillDetails, setShowBillDetails] = useState(false)
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [refundAmount, setRefundAmount] = useState(0)
  const [partialPayment, setPartialPayment] = useState(false)
  const [paidAmount, setPaidAmount] = useState(0)

  const addService = (service: (typeof mockServices)[0]) => {
    const existingService = selectedServices.find((s) => s.id === service.id)
    if (existingService) {
      setSelectedServices(
        selectedServices.map((s) =>
          s.id === service.id ? { ...s, quantity: s.quantity + 1, total: (s.quantity + 1) * s.price } : s,
        ),
      )
    } else {
      setSelectedServices([
        ...selectedServices,
        {
          ...service,
          quantity: 1,
          discount: 0,
          total: service.price,
          canCancel: true,
        },
      ])
    }
  }

  const removeService = (serviceId: string) => {
    setSelectedServices(selectedServices.filter((s) => s.id !== serviceId))
  }

  const updateQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeService(serviceId)
    } else {
      setSelectedServices(
        selectedServices.map((s) => (s.id === serviceId ? { ...s, quantity, total: quantity * s.price } : s)),
      )
    }
  }

  const updateItemDiscount = (serviceId: string, discount: number) => {
    setSelectedServices(
      selectedServices.map((s) =>
        s.id === serviceId ? { ...s, discount, total: s.quantity * s.price - discount } : s,
      ),
    )
  }

  const calculateSubtotal = () => {
    return selectedServices.reduce((total, service) => total + service.total, 0)
  }

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal()
    if (discountType === "percentage") {
      return (subtotal * discountValue) / 100
    } else if (discountType === "amount") {
      return discountValue
    } else if (discountType === "corporate" && selectedPatient?.corporateDiscount) {
      return (subtotal * selectedPatient.corporateDiscount) / 100
    }
    return 0
  }

  const calculateTax = () => {
    const subtotal = calculateSubtotal()
    const discount = calculateDiscount()
    return (subtotal - discount) * 0.18 // 18% GST
  }

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateTax()
  }

  const filteredServices = mockServices.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handlePatientSearch = () => {
    if (patientSearch.toLowerCase().includes("rajesh") || patientSearch.includes("P001234")) {
      setSelectedPatient(mockPatient)
    }
  }

  const handleBillGeneration = () => {
    const total = calculateTotal()

    if (partialPayment && paidAmount < total) {
      const newBill: Bill = {
        id: `BILL${Date.now()}`,
        patientId: selectedPatient?.id || "",
        patientName: selectedPatient?.name || "",
        patientPhone: selectedPatient?.phone || "",
        date: new Date().toISOString().split("T")[0],
        items: selectedServices,
        subtotal: calculateSubtotal(),
        discount: calculateDiscount(),
        tax: calculateTax(),
        total: total,
        status: "partial",
        paymentMethod,
        paidAmount: paidAmount,
        balanceAmount: total - paidAmount,
      }

      console.log("Partial payment bill generated:", newBill)
      alert(`Partial payment processed! Paid: ₹${paidAmount}, Balance: ₹${total - paidAmount}`)
    } else {
      console.log("Full payment bill generated")
      alert("Bill generated and payment completed successfully!")
    }

    // Reset form
    setSelectedServices([])
    setSelectedPatient(null)
    setPaidAmount(0)
    setPartialPayment(false)
  }

  const handleBillCancellation = (bill: Bill) => {
    setSelectedBill(bill)
    setRefundAmount(bill.paidAmount || 0)
    setShowCancelDialog(true)
  }

  const processBillCancellation = () => {
    if (!selectedBill) return

    console.log("Processing bill cancellation:", {
      billId: selectedBill.id,
      reason: cancelReason,
      refundAmount: refundAmount,
      cancelledItems: selectedBill.items.filter((item) => item.canCancel),
    })

    alert(`Bill ${selectedBill.id} cancelled successfully! Refund amount: ₹${refundAmount}`)
    setShowCancelDialog(false)
    setCancelReason("")
    setRefundAmount(0)
  }

  const BillDetailsDialog = ({ bill }: { bill: Bill }) => (
    <Dialog open={showBillDetails} onOpenChange={setShowBillDetails}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bill Details - {bill.id}</DialogTitle>
          <DialogDescription>Complete bill information with edit and cancel options</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Patient Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Patient Name</Label>
                  <p className="font-medium">{bill.patientName}</p>
                </div>
                <div>
                  <Label>Patient ID</Label>
                  <p className="font-medium">{bill.patientId}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="font-medium">{bill.patientPhone}</p>
                </div>
                <div>
                  <Label>Bill Date</Label>
                  <p className="font-medium">{bill.date}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bill Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bill Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bill.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>₹{item.price}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>₹{item.discount}</TableCell>
                      <TableCell>₹{item.total}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {item.canCancel && (
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{bill.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-₹{bill.discount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18% GST):</span>
                  <span>₹{bill.tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{bill.total.toFixed(2)}</span>
                </div>
                {bill.status === "partial" && (
                  <>
                    <div className="flex justify-between text-green-600">
                      <span>Paid Amount:</span>
                      <span>₹{bill.paidAmount}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Balance Amount:</span>
                      <span>₹{bill.balanceAmount}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Add New Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add New Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mockServices.slice(0, 6).map((service) => (
                  <Card key={service.id} className="cursor-pointer hover:bg-gray-50">
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm">{service.name}</h4>
                      <p className="text-xs text-gray-600">{service.category}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-semibold">₹{service.price}</span>
                        <Button size="sm">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowBillDetails(false)}>
            Close
          </Button>
          <Button variant="destructive" onClick={() => handleBillCancellation(bill)}>
            <X className="h-4 w-4 mr-2" />
            Cancel Bill
          </Button>
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  const BillCancellationDialog = () => (
    <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Bill - {selectedBill?.id}</DialogTitle>
          <DialogDescription>Cancel bill and process refund if applicable</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Cancellation Reason</Label>
            <Select value={cancelReason} onValueChange={setCancelReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patient_request">Patient Request</SelectItem>
                <SelectItem value="service_not_rendered">Service Not Rendered</SelectItem>
                <SelectItem value="billing_error">Billing Error</SelectItem>
                <SelectItem value="duplicate_bill">Duplicate Bill</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Refund Amount</Label>
            <Input
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(Number(e.target.value))}
              placeholder="Enter refund amount"
            />
            <p className="text-sm text-gray-600 mt-1">Original paid amount: ₹{selectedBill?.paidAmount || 0}</p>
          </div>

          <div>
            <Label>Additional Notes</Label>
            <Textarea placeholder="Enter any additional notes..." />
          </div>

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Cancellation Impact</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              This will adjust the total collection and generate a credit note.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={processBillCancellation} disabled={!cancelReason || refundAmount < 0}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Process Cancellation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  return (
    <PrivateRoute modulePath="admin/front-office/billing" action="view">
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">OP Billing</h1>
          <p className="text-gray-600">Outpatient billing with advanced bill management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Receipt className="h-4 w-4 mr-2" />
            Print Receipt
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Bill
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Selection & Services */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>Search and select patient for billing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, ID, or phone..."
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handlePatientSearch}>Search</Button>
              </div>

              {selectedPatient && (
                <div className="p-4 border rounded-lg bg-green-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{selectedPatient.name}</h3>
                      <p className="text-sm text-gray-600">
                        ID: {selectedPatient.id} • Phone: {selectedPatient.phone}
                      </p>
                      <p className="text-sm text-gray-600">
                        Age: {selectedPatient.age} • Gender: {selectedPatient.gender}
                      </p>
                      {selectedPatient.insurance && (
                        <p className="text-sm text-blue-600">
                          Insurance: {selectedPatient.insurance} • Policy: {selectedPatient.policyNumber}
                        </p>
                      )}
                    </div>
                    <Badge className="bg-green-600">
                      <UserCheck className="h-4 w-4 mr-1" />
                      Selected
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Service Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Services & Procedures</CardTitle>
              <CardDescription>Add services to the bill</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                  {filteredServices.map((service) => (
                    <Card
                      key={service.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => addService(service)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{service.name}</h4>
                            <p className="text-sm text-gray-600">{service.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{service.price}</p>
                            <Button size="sm" className="mt-1">
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Bills */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bills</CardTitle>
              <CardDescription>View and manage recent bills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBills.map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{bill.id}</h4>
                      <p className="text-sm text-gray-600">
                        {bill.patientName} • {bill.date}
                      </p>
                      <p className="text-sm text-gray-600">Total: ₹{bill.total.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          bill.status === "paid" ? "default" : bill.status === "partial" ? "secondary" : "destructive"
                        }
                      >
                        {bill.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedBill(bill)
                          setShowBillDetails(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Printer className="h-4 w-4 mr-1" />
                        Print
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bill Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Bill Summary
              </CardTitle>
              <CardDescription>Selected services and total amount</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedServices.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No services selected</p>
                ) : (
                  <>
                    {selectedServices.map((service) => (
                      <div key={service.id} className="space-y-2 p-3 border rounded">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{service.name}</p>
                            <p className="text-xs text-gray-600">₹{service.price} each</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(service.id, service.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{service.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(service.id, service.quantity + 1)}
                            >
                              +
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => removeService(service.id)}>
                              ×
                            </Button>
                          </div>
                        </div>

                        {/* Item Discount */}
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">Item Discount:</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={service.discount}
                            onChange={(e) => updateItemDiscount(service.id, Number(e.target.value))}
                            className="h-6 text-xs"
                          />
                        </div>

                        <div className="text-right">
                          <span className="font-semibold">₹{service.total}</span>
                        </div>
                      </div>
                    ))}

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{calculateSubtotal()}</span>
                      </div>

                      {/* Bill Discount Section */}
                      <div className="space-y-2">
                        <Label>Bill Discount Type</Label>
                        <Select value={discountType} onValueChange={setDiscountType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Discount</SelectItem>
                            <SelectItem value="percentage">Percentage</SelectItem>
                            <SelectItem value="amount">Fixed Amount</SelectItem>
                            {selectedPatient?.corporateDiscount && (
                              <SelectItem value="corporate">Corporate Discount</SelectItem>
                            )}
                          </SelectContent>
                        </Select>

                        {(discountType === "percentage" || discountType === "amount") && (
                          <Input
                            type="number"
                            placeholder={discountType === "percentage" ? "Enter %" : "Enter amount"}
                            value={discountValue}
                            onChange={(e) => setDiscountValue(Number(e.target.value))}
                          />
                        )}
                      </div>

                      {calculateDiscount() > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>-₹{calculateDiscount().toFixed(2)}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span>Tax (18% GST):</span>
                        <span>₹{calculateTax().toFixed(2)}</span>
                      </div>

                      <Separator />

                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>₹{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="partialPayment" checked={partialPayment} onCheckedChange={setPartialPayment} />
                  <Label htmlFor="partialPayment">Partial Payment</Label>
                </div>

                {partialPayment && (
                  <div>
                    <Label>Amount Paying Now</Label>
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={paidAmount}
                      onChange={(e) => setPaidAmount(Number(e.target.value))}
                      max={calculateTotal()}
                    />
                    <p className="text-sm text-gray-600 mt-1">Balance: ₹{(calculateTotal() - paidAmount).toFixed(2)}</p>
                  </div>
                )}

                <div>
                  <Label>Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="multiple">Multiple Methods</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethod === "multiple" && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Cash Amount</Label>
                        <Input type="number" placeholder="0" className="h-8" />
                      </div>
                      <div>
                        <Label className="text-xs">Card Amount</Label>
                        <Input type="number" placeholder="0" className="h-8" />
                      </div>
                      <div>
                        <Label className="text-xs">UPI Amount</Label>
                        <Input type="number" placeholder="0" className="h-8" />
                      </div>
                      <div>
                        <Label className="text-xs">Insurance Amount</Label>
                        <Input type="number" placeholder="0" className="h-8" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "corporate" && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-800">
                      <CheckCircle className="h-4 w-4 inline mr-1" />
                      Corporate billing - Payment will be processed by company
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={handleBillGeneration}
                    disabled={!selectedPatient || selectedServices.length === 0}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {partialPayment ? "Process Partial Payment" : "Generate Bill"}
                  </Button>
                  <Button variant="outline">
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bill Details Dialog */}
      {selectedBill && <BillDetailsDialog bill={selectedBill} />}

      {/* Bill Cancellation Dialog */}
      <BillCancellationDialog />
      </div>
    </PrivateRoute>
  )
}

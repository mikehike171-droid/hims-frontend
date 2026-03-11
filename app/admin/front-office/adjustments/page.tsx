"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, CreditCard, AlertTriangle, CheckCircle, Clock, X, Eye, Printer, DollarSign, Ban } from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"

const mockBills = [
  {
    id: "BILL001",
    patientName: "Rajesh Kumar",
    patientId: "P001234",
    amount: 2500,
    date: "2024-01-15",
    status: "paid",
    services: ["Consultation", "ECG", "Blood Test"],
    paymentMethod: "Cash",
  },
  {
    id: "BILL002",
    patientName: "Priya Sharma",
    patientId: "P001235",
    amount: 8500,
    date: "2024-01-14",
    status: "paid",
    services: ["CT Scan", "Consultation"],
    paymentMethod: "Card",
  },
  {
    id: "BILL003",
    patientName: "Amit Singh",
    patientId: "P001236",
    amount: 1200,
    date: "2024-01-13",
    status: "paid",
    services: ["X-Ray", "Consultation"],
    paymentMethod: "UPI",
  },
]

const mockAdjustments = [
  {
    id: "ADJ001",
    type: "cancellation",
    billId: "BILL004",
    patientName: "Sunita Devi",
    amount: 3500,
    reason: "service_not_rendered",
    status: "pending",
    requestedBy: "Cashier-001",
    requestedAt: "2024-01-15 14:30",
    approver: "Supervisor-001",
  },
  {
    id: "ADJ002",
    type: "credit_note",
    billId: "BILL005",
    patientName: "Mohammed Ali",
    amount: 1500,
    reason: "overcharge",
    status: "approved",
    requestedBy: "Cashier-002",
    requestedAt: "2024-01-14 16:20",
    approver: "Manager-001",
    approvedAt: "2024-01-15 09:15",
  },
  {
    id: "ADJ003",
    type: "rate_override",
    billId: "BILL006",
    patientName: "Lisa Williams",
    originalAmount: 2000,
    adjustedAmount: 1600,
    discountPercent: 20,
    reason: "senior_citizen_discount",
    status: "approved",
    requestedBy: "Cashier-001",
    requestedAt: "2024-01-13 11:45",
    approver: "Supervisor-001",
    approvedAt: "2024-01-13 12:00",
  },
]

const roleThresholds = {
  cashier: { cancellation: 1000, discount: 5 },
  supervisor: { cancellation: 5000, discount: 15 },
  manager: { cancellation: 15000, discount: 25 },
  admin: { cancellation: 50000, discount: 50 },
}

const cancellationReasons = [
  { value: "service_not_rendered", label: "Service Not Rendered" },
  { value: "patient_cancelled", label: "Patient Cancelled" },
  { value: "medical_emergency", label: "Medical Emergency" },
  { value: "system_error", label: "System Error" },
  { value: "duplicate_billing", label: "Duplicate Billing" },
  { value: "other", label: "Other" },
]

const creditNoteReasons = [
  { value: "overcharge", label: "Overcharge" },
  { value: "service_not_rendered", label: "Service Not Rendered" },
  { value: "courtesy", label: "Courtesy Adjustment" },
  { value: "price_correction", label: "Price Correction" },
  { value: "insurance_adjustment", label: "Insurance Adjustment" },
  { value: "other", label: "Other" },
]

export default function AdjustmentsCancellationsCredits() {
  const [activeTab, setActiveTab] = useState("cancellations")
  const [selectedBill, setSelectedBill] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentUserRole, setCurrentUserRole] = useState("cashier") // Simulate current user role

  // Cancellation form state
  const [cancellationForm, setCancellationForm] = useState({
    billId: "",
    reason: "",
    customReason: "",
    amount: 0,
    justification: "",
    requiresApproval: false,
  })

  // Credit note form state
  const [creditNoteForm, setCreditNoteForm] = useState({
    billId: "",
    reason: "",
    customReason: "",
    amount: 0,
    justification: "",
    requiresApproval: false,
  })

  // Rate override form state
  const [rateOverrideForm, setRateOverrideForm] = useState({
    billId: "",
    originalAmount: 0,
    discountType: "percentage",
    discountValue: 0,
    newAmount: 0,
    reason: "",
    justification: "",
    requiresApproval: false,
  })

  // Reprint form state
  const [reprintForm, setReprintForm] = useState({
    billId: "",
    reason: "",
    isDuplicate: true,
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <X className="h-4 w-4" />
      case "cancelled":
        return <Ban className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const checkApprovalRequired = (amount, type = "cancellation") => {
    const threshold = roleThresholds[currentUserRole]?.[type] || 0
    return amount > threshold
  }

  const handleBillSearch = () => {
    // Simulate bill search
    if (searchTerm) {
      const foundBill = mockBills.find(
        (bill) =>
          bill.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      if (foundBill) {
        setSelectedBill(foundBill)
      } else {
        alert("Bill not found")
      }
    }
  }

  const handleCancellation = () => {
    const requiresApproval = checkApprovalRequired(cancellationForm.amount)

    const cancellationData = {
      ...cancellationForm,
      requiresApproval,
      requestedBy: `${currentUserRole}-001`,
      requestedAt: new Date().toLocaleString(),
      status: requiresApproval ? "pending" : "approved",
    }

    console.log("Processing cancellation:", cancellationData)

    if (requiresApproval) {
      alert("Cancellation request submitted for approval")
    } else {
      alert("Bill cancelled successfully")
    }

    // Reset form
    setCancellationForm({
      billId: "",
      reason: "",
      customReason: "",
      amount: 0,
      justification: "",
      requiresApproval: false,
    })
    setSelectedBill(null)
  }

  const handleCreditNote = () => {
    const requiresApproval = checkApprovalRequired(creditNoteForm.amount)

    const creditData = {
      ...creditNoteForm,
      requiresApproval,
      requestedBy: `${currentUserRole}-001`,
      requestedAt: new Date().toLocaleString(),
      status: requiresApproval ? "pending" : "approved",
    }

    console.log("Processing credit note:", creditData)

    if (requiresApproval) {
      alert("Credit note request submitted for approval")
    } else {
      alert("Credit note created successfully")
    }

    // Reset form
    setCreditNoteForm({
      billId: "",
      reason: "",
      customReason: "",
      amount: 0,
      justification: "",
      requiresApproval: false,
    })
    setSelectedBill(null)
  }

  const handleRateOverride = () => {
    const discountPercent =
      rateOverrideForm.discountType === "percentage"
        ? rateOverrideForm.discountValue
        : (rateOverrideForm.discountValue / rateOverrideForm.originalAmount) * 100

    const requiresApproval = checkApprovalRequired(discountPercent, "discount")

    const overrideData = {
      ...rateOverrideForm,
      discountPercent,
      requiresApproval,
      requestedBy: `${currentUserRole}-001`,
      requestedAt: new Date().toLocaleString(),
      status: requiresApproval ? "pending" : "approved",
    }

    console.log("Processing rate override:", overrideData)

    if (requiresApproval) {
      alert("Rate override request submitted for approval")
    } else {
      alert("Rate override applied successfully")
    }

    // Reset form
    setRateOverrideForm({
      billId: "",
      originalAmount: 0,
      discountType: "percentage",
      discountValue: 0,
      newAmount: 0,
      reason: "",
      justification: "",
      requiresApproval: false,
    })
    setSelectedBill(null)
  }

  const handleReprint = () => {
    const reprintData = {
      ...reprintForm,
      reprintedBy: `${currentUserRole}-001`,
      reprintedAt: new Date().toLocaleString(),
      watermark: reprintForm.isDuplicate ? "DUPLICATE" : null,
    }

    console.log("Processing reprint:", reprintData)
    alert(`Bill ${reprintForm.isDuplicate ? "duplicate" : "original"} printed successfully`)

    // Reset form
    setReprintForm({
      billId: "",
      reason: "",
      isDuplicate: true,
    })
    setSelectedBill(null)
  }

  const handleApproval = (adjustmentId, action) => {
    console.log(`${action} adjustment ${adjustmentId}`)
    alert(`Adjustment ${adjustmentId} ${action}`)
  }

  const calculateNewAmount = () => {
    if (rateOverrideForm.discountType === "percentage") {
      return rateOverrideForm.originalAmount - (rateOverrideForm.originalAmount * rateOverrideForm.discountValue) / 100
    } else {
      return rateOverrideForm.originalAmount - rateOverrideForm.discountValue
    }
  }

  return (
    <PrivateRoute modulePath="admin/front-office/adjustments" action="view">
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Adjustments, Cancellations & Credits</h1>
          <p className="text-gray-600">Manage bill adjustments, cancellations, credit notes, and reprints</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">Role: {currentUserRole}</Badge>
          <Badge variant="outline">
            Cancellation Limit: ₹{roleThresholds[currentUserRole]?.cancellation.toLocaleString()}
          </Badge>
          <Badge variant="outline">Discount Limit: {roleThresholds[currentUserRole]?.discount}%</Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="cancellations">
            <Ban className="h-4 w-4 mr-2" />
            Cancellations
          </TabsTrigger>
          <TabsTrigger value="credit-notes">
            <CreditCard className="h-4 w-4 mr-2" />
            Credit Notes
          </TabsTrigger>
          <TabsTrigger value="rate-overrides">
            <DollarSign className="h-4 w-4 mr-2" />
            Rate Overrides
          </TabsTrigger>
          <TabsTrigger value="reprints">
            <Printer className="h-4 w-4 mr-2" />
            Reprints
          </TabsTrigger>
          <TabsTrigger value="pending-approvals">
            <Clock className="h-4 w-4 mr-2" />
            Approvals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cancellations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bill Cancellation</CardTitle>
                <CardDescription>Cancel bills with proper authorization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter Bill ID or Patient Name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleBillSearch}>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>

                  {selectedBill && (
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <h3 className="font-semibold">{selectedBill.id}</h3>
                      <p>Patient: {selectedBill.patientName}</p>
                      <p>Amount: ₹{selectedBill.amount.toLocaleString()}</p>
                      <p>Date: {selectedBill.date}</p>
                      <p>Services: {selectedBill.services.join(", ")}</p>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="cancellationReason">Cancellation Reason</Label>
                    <Select
                      value={cancellationForm.reason}
                      onValueChange={(value) => setCancellationForm({ ...cancellationForm, reason: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        {cancellationReasons.map((reason) => (
                          <SelectItem key={reason.value} value={reason.value}>
                            {reason.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {cancellationForm.reason === "other" && (
                    <div>
                      <Label htmlFor="customReason">Custom Reason</Label>
                      <Input
                        id="customReason"
                        value={cancellationForm.customReason}
                        onChange={(e) => setCancellationForm({ ...cancellationForm, customReason: e.target.value })}
                        placeholder="Enter custom reason"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="cancellationAmount">Cancellation Amount</Label>
                    <Input
                      id="cancellationAmount"
                      type="number"
                      value={cancellationForm.amount}
                      onChange={(e) => setCancellationForm({ ...cancellationForm, amount: Number(e.target.value) })}
                      placeholder="Enter amount to cancel"
                    />
                    {selectedBill && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-1 bg-transparent"
                        onClick={() => setCancellationForm({ ...cancellationForm, amount: selectedBill.amount })}
                      >
                        Full Amount (₹{selectedBill.amount})
                      </Button>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cancellationJustification">Justification</Label>
                    <Textarea
                      id="cancellationJustification"
                      value={cancellationForm.justification}
                      onChange={(e) => setCancellationForm({ ...cancellationForm, justification: e.target.value })}
                      placeholder="Provide detailed justification for cancellation"
                      rows={3}
                    />
                  </div>

                  {cancellationForm.amount > 0 && (
                    <div className="p-3 border rounded-lg bg-yellow-50">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium">
                          {checkApprovalRequired(cancellationForm.amount) ? "Approval Required" : "Auto-Approved"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {checkApprovalRequired(cancellationForm.amount)
                          ? `Amount exceeds your limit of ₹${roleThresholds[currentUserRole]?.cancellation.toLocaleString()}`
                          : "Amount is within your authorization limit"}
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleCancellation}
                    disabled={
                      !selectedBill ||
                      !cancellationForm.reason ||
                      !cancellationForm.amount ||
                      !cancellationForm.justification
                    }
                    className="w-full"
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Process Cancellation
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Cancellations</CardTitle>
                <CardDescription>Latest cancellation requests and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAdjustments
                    .filter((adj) => adj.type === "cancellation")
                    .map((adjustment) => (
                      <div key={adjustment.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{adjustment.id}</span>
                          <Badge className={getStatusColor(adjustment.status)}>
                            {getStatusIcon(adjustment.status)}
                            <span className="ml-1 capitalize">{adjustment.status}</span>
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>
                            Bill: {adjustment.billId} • Patient: {adjustment.patientName}
                          </p>
                          <p>Amount: ₹{adjustment.amount.toLocaleString()}</p>
                          <p>Reason: {adjustment.reason.replace("_", " ")}</p>
                          <p>Requested: {adjustment.requestedAt}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="credit-notes" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Credit Note</CardTitle>
                <CardDescription>Issue credit notes for adjustments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter Bill ID or Patient Name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleBillSearch}>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>

                  {selectedBill && (
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <h3 className="font-semibold">{selectedBill.id}</h3>
                      <p>Patient: {selectedBill.patientName}</p>
                      <p>Amount: ₹{selectedBill.amount.toLocaleString()}</p>
                      <p>Date: {selectedBill.date}</p>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="creditReason">Credit Note Reason</Label>
                    <Select
                      value={creditNoteForm.reason}
                      onValueChange={(value) => setCreditNoteForm({ ...creditNoteForm, reason: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select reason" />
                      </SelectTrigger>
                      <SelectContent>
                        {creditNoteReasons.map((reason) => (
                          <SelectItem key={reason.value} value={reason.value}>
                            {reason.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="creditAmount">Credit Amount</Label>
                    <Input
                      id="creditAmount"
                      type="number"
                      value={creditNoteForm.amount}
                      onChange={(e) => setCreditNoteForm({ ...creditNoteForm, amount: Number(e.target.value) })}
                      placeholder="Enter credit amount"
                    />
                  </div>

                  <div>
                    <Label htmlFor="creditJustification">Justification</Label>
                    <Textarea
                      id="creditJustification"
                      value={creditNoteForm.justification}
                      onChange={(e) => setCreditNoteForm({ ...creditNoteForm, justification: e.target.value })}
                      placeholder="Provide detailed justification for credit note"
                      rows={3}
                    />
                  </div>

                  {creditNoteForm.amount > 0 && (
                    <div className="p-3 border rounded-lg bg-yellow-50">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium">
                          {checkApprovalRequired(creditNoteForm.amount) ? "Approval Required" : "Auto-Approved"}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleCreditNote}
                    disabled={
                      !selectedBill || !creditNoteForm.reason || !creditNoteForm.amount || !creditNoteForm.justification
                    }
                    className="w-full"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Create Credit Note
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Credit Notes</CardTitle>
                <CardDescription>Latest credit note requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAdjustments
                    .filter((adj) => adj.type === "credit_note")
                    .map((adjustment) => (
                      <div key={adjustment.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{adjustment.id}</span>
                          <Badge className={getStatusColor(adjustment.status)}>
                            {getStatusIcon(adjustment.status)}
                            <span className="ml-1 capitalize">{adjustment.status}</span>
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>
                            Bill: {adjustment.billId} • Patient: {adjustment.patientName}
                          </p>
                          <p>Amount: ₹{adjustment.amount.toLocaleString()}</p>
                          <p>Reason: {adjustment.reason.replace("_", " ")}</p>
                          <p>Requested: {adjustment.requestedAt}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rate-overrides" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rate Override & Discounts</CardTitle>
                <CardDescription>Apply discounts and rate adjustments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter Bill ID or Patient Name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleBillSearch}>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>

                  {selectedBill && (
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <h3 className="font-semibold">{selectedBill.id}</h3>
                      <p>Patient: {selectedBill.patientName}</p>
                      <p>Original Amount: ₹{selectedBill.amount.toLocaleString()}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 bg-transparent"
                        onClick={() =>
                          setRateOverrideForm({ ...rateOverrideForm, originalAmount: selectedBill.amount })
                        }
                      >
                        Use This Amount
                      </Button>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="originalAmount">Original Amount</Label>
                    <Input
                      id="originalAmount"
                      type="number"
                      value={rateOverrideForm.originalAmount}
                      onChange={(e) =>
                        setRateOverrideForm({ ...rateOverrideForm, originalAmount: Number(e.target.value) })
                      }
                      placeholder="Enter original amount"
                    />
                  </div>

                  <div>
                    <Label htmlFor="discountType">Discount Type</Label>
                    <Select
                      value={rateOverrideForm.discountType}
                      onValueChange={(value) => setRateOverrideForm({ ...rateOverrideForm, discountType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="amount">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="discountValue">
                      Discount {rateOverrideForm.discountType === "percentage" ? "Percentage" : "Amount"}
                    </Label>
                    <Input
                      id="discountValue"
                      type="number"
                      value={rateOverrideForm.discountValue}
                      onChange={(e) =>
                        setRateOverrideForm({ ...rateOverrideForm, discountValue: Number(e.target.value) })
                      }
                      placeholder={rateOverrideForm.discountType === "percentage" ? "Enter percentage" : "Enter amount"}
                    />
                  </div>

                  {rateOverrideForm.originalAmount > 0 && rateOverrideForm.discountValue > 0 && (
                    <div className="p-3 border rounded-lg bg-green-50">
                      <p className="font-medium">New Amount: ₹{calculateNewAmount().toLocaleString()}</p>
                      <p className="text-sm text-gray-600">
                        Discount:{" "}
                        {rateOverrideForm.discountType === "percentage"
                          ? `${rateOverrideForm.discountValue}%`
                          : `₹${rateOverrideForm.discountValue}`}
                      </p>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="overrideReason">Reason</Label>
                    <Input
                      id="overrideReason"
                      value={rateOverrideForm.reason}
                      onChange={(e) => setRateOverrideForm({ ...rateOverrideForm, reason: e.target.value })}
                      placeholder="Enter reason for override"
                    />
                  </div>

                  <div>
                    <Label htmlFor="overrideJustification">Justification</Label>
                    <Textarea
                      id="overrideJustification"
                      value={rateOverrideForm.justification}
                      onChange={(e) => setRateOverrideForm({ ...rateOverrideForm, justification: e.target.value })}
                      placeholder="Provide detailed justification"
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleRateOverride}
                    disabled={
                      !rateOverrideForm.originalAmount || !rateOverrideForm.discountValue || !rateOverrideForm.reason
                    }
                    className="w-full"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Apply Rate Override
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Rate Overrides</CardTitle>
                <CardDescription>Latest rate override requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAdjustments
                    .filter((adj) => adj.type === "rate_override")
                    .map((adjustment) => (
                      <div key={adjustment.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{adjustment.id}</span>
                          <Badge className={getStatusColor(adjustment.status)}>
                            {getStatusIcon(adjustment.status)}
                            <span className="ml-1 capitalize">{adjustment.status}</span>
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>
                            Bill: {adjustment.billId} • Patient: {adjustment.patientName}
                          </p>
                          <p>
                            Original: ₹{adjustment.originalAmount} → Adjusted: ₹{adjustment.adjustedAmount}
                          </p>
                          <p>Discount: {adjustment.discountPercent}%</p>
                          <p>Reason: {adjustment.reason.replace("_", " ")}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reprints" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Reprint Bills</CardTitle>
                <CardDescription>Reprint original or duplicate bills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter Bill ID or Patient Name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleBillSearch}>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>

                  {selectedBill && (
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <h3 className="font-semibold">{selectedBill.id}</h3>
                      <p>Patient: {selectedBill.patientName}</p>
                      <p>Amount: ₹{selectedBill.amount.toLocaleString()}</p>
                      <p>Date: {selectedBill.date}</p>
                      <p>Status: {selectedBill.status}</p>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="reprintReason">Reason for Reprint</Label>
                    <Input
                      id="reprintReason"
                      value={reprintForm.reason}
                      onChange={(e) => setReprintForm({ ...reprintForm, reason: e.target.value })}
                      placeholder="Enter reason for reprinting"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isDuplicate"
                      checked={reprintForm.isDuplicate}
                      onCheckedChange={(checked) => setReprintForm({ ...reprintForm, isDuplicate: checked })}
                    />
                    <Label htmlFor="isDuplicate">Mark as Duplicate (adds watermark)</Label>
                  </div>

                  {reprintForm.isDuplicate && (
                    <div className="p-3 border rounded-lg bg-yellow-50">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium">Duplicate Watermark</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        This bill will be printed with "DUPLICATE" watermark and logged in audit trail
                      </p>
                    </div>
                  )}

                  <Button onClick={handleReprint} disabled={!selectedBill || !reprintForm.reason} className="w-full">
                    <Printer className="h-4 w-4 mr-2" />
                    {reprintForm.isDuplicate ? "Print Duplicate" : "Print Original"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reprint Audit Log</CardTitle>
                <CardDescription>Track all bill reprints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: "RPT001",
                      billId: "BILL001",
                      type: "duplicate",
                      reason: "Patient lost original",
                      reprintedBy: "Cashier-001",
                      reprintedAt: "2024-01-15 14:30",
                    },
                    {
                      id: "RPT002",
                      billId: "BILL002",
                      type: "original",
                      reason: "Printer error",
                      reprintedBy: "Cashier-002",
                      reprintedAt: "2024-01-14 16:20",
                    },
                  ].map((reprint) => (
                    <div key={reprint.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{reprint.id}</span>
                        <Badge variant={reprint.type === "duplicate" ? "secondary" : "outline"}>
                          {reprint.type.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Bill: {reprint.billId}</p>
                        <p>Reason: {reprint.reason}</p>
                        <p>
                          By: {reprint.reprintedBy} • At: {reprint.reprintedAt}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pending-approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Review and approve adjustment requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAdjustments
                  .filter((adj) => adj.status === "pending")
                  .map((adjustment) => (
                    <div key={adjustment.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{adjustment.id}</h3>
                          <Badge variant="outline" className="capitalize">
                            {adjustment.type.replace("_", " ")}
                          </Badge>
                        </div>
                        <Badge className={getStatusColor(adjustment.status)}>
                          {getStatusIcon(adjustment.status)}
                          <span className="ml-1 capitalize">{adjustment.status}</span>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Bill ID</p>
                          <p className="font-medium">{adjustment.billId}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Patient</p>
                          <p className="font-medium">{adjustment.patientName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Amount</p>
                          <p className="font-medium">₹{adjustment.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Requested By</p>
                          <p className="font-medium">{adjustment.requestedBy}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600">Reason</p>
                        <p className="font-medium">{adjustment.reason.replace("_", " ")}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproval(adjustment.id, "approved")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleApproval(adjustment.id, "rejected")}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}

                {mockAdjustments.filter((adj) => adj.status === "pending").length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">No pending approvals</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </PrivateRoute>
  )
}

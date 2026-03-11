"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BillSummaryPreview } from "@/components/front-office/bill-summary-preview"
import {
  Search,
  CalendarIcon,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Filter,
  Download,
  Phone,
  User,
  Stethoscope,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface Appointment {
  id: string
  patientName: string
  patientPhone: string
  patientId: string
  doctorName: string
  department: string
  appointmentDate: string
  appointmentTime: string
  status: "confirmed" | "cancelled" | "completed" | "no-show" | "rescheduled"
  type: string
  notes: string
  tokenNumber: string
  consultationFee: number
  paymentStatus: "paid" | "pending" | "refunded"
  bookedBy: string
  bookingDate: string
}

interface BillItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
  category: "consultation" | "procedure" | "investigation" | "pharmacy" | "other"
}

const mockAppointments: Appointment[] = [
  {
    id: "APT001",
    patientName: "Rajesh Kumar",
    patientPhone: "+91-9876543210",
    patientId: "P001234",
    doctorName: "Dr. Priya Sharma",
    department: "Cardiology",
    appointmentDate: "2024-01-20",
    appointmentTime: "10:00",
    status: "confirmed",
    type: "Consultation",
    notes: "Follow-up for chest pain",
    tokenNumber: "C001",
    consultationFee: 800,
    paymentStatus: "paid",
    bookedBy: "Front Office - John",
    bookingDate: "2024-01-18",
  },
  {
    id: "APT002",
    patientName: "Sunita Patel",
    patientPhone: "+91-9876543211",
    patientId: "P001235",
    doctorName: "Dr. Amit Singh",
    department: "Orthopedics",
    appointmentDate: "2024-01-20",
    appointmentTime: "11:30",
    status: "confirmed",
    type: "Follow-up",
    notes: "Knee pain assessment",
    tokenNumber: "O002",
    consultationFee: 700,
    paymentStatus: "pending",
    bookedBy: "Front Office - Sarah",
    bookingDate: "2024-01-19",
  },
  {
    id: "APT003",
    patientName: "Michael Johnson",
    patientPhone: "+91-9876543212",
    patientId: "P001236",
    doctorName: "Dr. Rajesh Kumar",
    department: "General Medicine",
    appointmentDate: "2024-01-20",
    appointmentTime: "14:00",
    status: "rescheduled",
    type: "Consultation",
    notes: "Diabetes check-up",
    tokenNumber: "G003",
    consultationFee: 500,
    paymentStatus: "pending",
    bookedBy: "Front Office - Mike",
    bookingDate: "2024-01-17",
  },
  {
    id: "APT004",
    patientName: "Sarah Wilson",
    patientPhone: "+91-9876543213",
    patientId: "P001237",
    doctorName: "Dr. Priya Sharma",
    department: "Cardiology",
    appointmentDate: "2024-01-19",
    appointmentTime: "16:30",
    status: "no-show",
    type: "Consultation",
    notes: "Hypertension follow-up",
    tokenNumber: "C004",
    consultationFee: 800,
    paymentStatus: "paid",
    bookedBy: "Front Office - Lisa",
    bookingDate: "2024-01-18",
  },
  {
    id: "APT005",
    patientName: "David Brown",
    patientPhone: "+91-9876543214",
    patientId: "P001238",
    doctorName: "Dr. Sunita Gupta",
    department: "Pediatrics",
    appointmentDate: "2024-01-21",
    appointmentTime: "09:00",
    status: "confirmed",
    type: "Vaccination",
    notes: "Routine vaccination",
    tokenNumber: "P001",
    consultationFee: 300,
    paymentStatus: "paid",
    bookedBy: "Front Office - Anna",
    bookingDate: "2024-01-20",
  },
]

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
]

export default function FrontOfficeManageBookings() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [cancellingAppointment, setCancellingAppointment] = useState<Appointment | null>(null)
  const [cancelReason, setCancelReason] = useState("")
  const [selectedAppointmentForBill, setSelectedAppointmentForBill] = useState<Appointment | null>(null)

  // Mock bill items for preview
  const generateBillItems = (appointment: Appointment): BillItem[] => {
    const items: BillItem[] = [
      {
        id: "1",
        description: "Consultation Fee",
        quantity: 1,
        rate: appointment.consultationFee,
        amount: appointment.consultationFee,
        category: "consultation",
      },
    ]

    // Add additional items based on appointment type
    if (appointment.type === "Follow-up") {
      items.push({
        id: "2",
        description: "Follow-up Consultation",
        quantity: 1,
        rate: 200,
        amount: 200,
        category: "consultation",
      })
    }

    if (appointment.department === "Cardiology") {
      items.push({
        id: "3",
        description: "ECG",
        quantity: 1,
        rate: 300,
        amount: 300,
        category: "investigation",
      })
    }

    if (appointment.department === "Orthopedics") {
      items.push({
        id: "4",
        description: "X-Ray",
        quantity: 1,
        rate: 400,
        amount: 400,
        category: "investigation",
      })
    }

    return items
  }

  // Filter appointments
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientPhone.includes(searchTerm) ||
      appointment.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter
    const matchesDate =
      format(new Date(appointment.appointmentDate), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")

    return matchesSearch && matchesStatus && matchesDate
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "no-show":
        return "bg-yellow-100 text-yellow-800"
      case "rescheduled":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "no-show":
        return <AlertTriangle className="h-4 w-4" />
      case "rescheduled":
        return <RefreshCw className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment({ ...appointment })
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (editingAppointment) {
      setAppointments((prev) => prev.map((apt) => (apt.id === editingAppointment.id ? editingAppointment : apt)))
      setIsEditDialogOpen(false)
      setEditingAppointment(null)
      // Update selected appointment if it's the same one being edited
      if (selectedAppointmentForBill?.id === editingAppointment.id) {
        setSelectedAppointmentForBill(editingAppointment)
      }
    }
  }

  const handleCancelAppointment = (appointment: Appointment) => {
    setCancellingAppointment(appointment)
    setIsCancelDialogOpen(true)
  }

  const confirmCancelAppointment = () => {
    if (cancellingAppointment) {
      const updatedAppointment = {
        ...cancellingAppointment,
        status: "cancelled" as const,
        notes: `${cancellingAppointment.notes} | Cancelled: ${cancelReason}`,
      }
      setAppointments((prev) => prev.map((apt) => (apt.id === cancellingAppointment.id ? updatedAppointment : apt)))
      // Update selected appointment if it's the same one being cancelled
      if (selectedAppointmentForBill?.id === cancellingAppointment.id) {
        setSelectedAppointmentForBill(updatedAppointment)
      }
      setIsCancelDialogOpen(false)
      setCancellingAppointment(null)
      setCancelReason("")
    }
  }

  const handleReschedule = (appointment: Appointment) => {
    setEditingAppointment({ ...appointment, status: "rescheduled" })
    setIsEditDialogOpen(true)
  }

  const stats = {
    total: filteredAppointments.length,
    confirmed: filteredAppointments.filter((a) => a.status === "confirmed").length,
    cancelled: filteredAppointments.filter((a) => a.status === "cancelled").length,
    completed: filteredAppointments.filter((a) => a.status === "completed").length,
    noShow: filteredAppointments.filter((a) => a.status === "no-show").length,
  }

  return (
    <div className="flex gap-6 p-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
            <p className="text-gray-600">View, edit, reschedule, and cancel appointments</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <CalendarIcon className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cancelled</p>
                  <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">No Show</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.noShow}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="no-show">No Show</SelectItem>
                  <SelectItem value="rescheduled">Rescheduled</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Button variant="outline" className="bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Appointments for {format(selectedDate, "MMMM dd, yyyy")} ({filteredAppointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Booked By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow
                      key={appointment.id}
                      className={cn(
                        "cursor-pointer hover:bg-gray-50 transition-colors",
                        selectedAppointmentForBill?.id === appointment.id && "bg-blue-50 border-blue-200",
                      )}
                      onClick={() => setSelectedAppointmentForBill(appointment)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{appointment.patientName}</div>
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <span>{appointment.patientId}</span>
                              <span>•</span>
                              <Phone className="h-3 w-3" />
                              <span>{appointment.patientPhone}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Stethoscope className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium">{appointment.doctorName}</div>
                            <div className="text-sm text-gray-500">{appointment.department}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium">{appointment.appointmentTime}</div>
                            <div className="text-sm text-gray-500">Token: {appointment.tokenNumber}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-medium">
                          {appointment.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1 capitalize">{appointment.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">₹{appointment.consultationFee.toLocaleString()}</div>
                          <Badge
                            variant={appointment.paymentStatus === "paid" ? "default" : "secondary"}
                            className={appointment.paymentStatus === "paid" ? "bg-green-600" : ""}
                          >
                            {appointment.paymentStatus}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium">{appointment.bookedBy}</div>
                          <div className="text-xs text-gray-500">{appointment.bookingDate}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditAppointment(appointment)}
                            disabled={appointment.status === "cancelled" || appointment.status === "completed"}
                            title="Edit Appointment"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReschedule(appointment)}
                            disabled={appointment.status === "cancelled" || appointment.status === "completed"}
                            title="Reschedule"
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelAppointment(appointment)}
                            disabled={appointment.status === "cancelled" || appointment.status === "completed"}
                            className="text-red-600 hover:text-red-700"
                            title="Cancel Appointment"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredAppointments.length === 0 && (
                <div className="text-center py-12">
                  <CalendarIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                  <p className="text-gray-500">No appointments match the selected criteria</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bill Summary Sidebar */}
      <div className="w-80 flex-shrink-0">
        <BillSummaryPreview
          patientName={selectedAppointmentForBill?.patientName}
          patientId={selectedAppointmentForBill?.patientId}
          doctorName={selectedAppointmentForBill?.doctorName}
          department={selectedAppointmentForBill?.department}
          appointmentDate={selectedAppointmentForBill?.appointmentDate}
          appointmentTime={selectedAppointmentForBill?.appointmentTime}
          items={selectedAppointmentForBill ? generateBillItems(selectedAppointmentForBill) : []}
          taxes={[{ name: "GST", percentage: 18, amount: 0 }]}
          discounts={[{ type: "percentage", percentage: 5, description: "Early Bird Discount" }]}
          onPrint={() => alert("Printing bill...")}
          onSendWhatsApp={() => alert("Sending bill via WhatsApp...")}
          onCollectPayment={() => alert("Opening payment collection...")}
        />
      </div>

      {/* Edit Appointment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
            <DialogDescription>Modify appointment details for {editingAppointment?.patientName}</DialogDescription>
          </DialogHeader>

          {editingAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Appointment Date</Label>
                  <Input
                    type="date"
                    value={editingAppointment.appointmentDate}
                    onChange={(e) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        appointmentDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Appointment Time</Label>
                  <Select
                    value={editingAppointment.appointmentTime}
                    onValueChange={(value) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        appointmentTime: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Appointment Type</Label>
                  <Select
                    value={editingAppointment.type}
                    onValueChange={(value) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        type: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Consultation">Consultation</SelectItem>
                      <SelectItem value="Follow-up">Follow-up</SelectItem>
                      <SelectItem value="Procedure">Procedure</SelectItem>
                      <SelectItem value="Vaccination">Vaccination</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={editingAppointment.status}
                    onValueChange={(value) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        status: value as any,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="rescheduled">Rescheduled</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="no-show">No Show</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={editingAppointment.notes}
                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      notes: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="Add any notes or special instructions..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} className="bg-red-600 hover:bg-red-700">
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Cancel Appointment Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel the appointment for {cancellingAppointment?.patientName}?
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Cancellation Reason *</Label>
              <Textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Enter reason for cancellation..."
                rows={3}
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Important Notice</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Cancelling this appointment will notify the patient via SMS and email. The appointment slot will
                    become available for other patients.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
                Keep Appointment
              </Button>
              <Button
                onClick={confirmCancelAppointment}
                className="bg-red-600 hover:bg-red-700"
                disabled={!cancelReason.trim()}
              >
                Cancel Appointment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
  CalendarIcon,
  Clock,
  User,
  Stethoscope,
  Phone,
  Mail,
  Plus,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Download,
  RefreshCw,
  Eye,
  MessageSquare,
  FileText,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import authService from "@/lib/authService"

const safeFormatDate = (dateString: string, formatStr: string) => {
  try {
    if (!dateString) return 'Invalid Date'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    return format(date, formatStr)
  } catch {
    return 'Invalid Date'
  }
}
import { BillSummaryWidget } from "@/components/billing/bill-summary-widget"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { appointmentsApi } from "@/lib/appointmentsApi"
import { useRouter } from "next/navigation"



const mockServices = [
  { id: "S001", name: "General Medicine Consultation", price: 500, category: "Consultation" },
  { id: "S002", name: "Cardiology Consultation", price: 800, category: "Consultation" },
  { id: "S003", name: "ECG", price: 200, category: "Investigation" },
  { id: "S004", name: "Blood Test - CBC", price: 300, category: "Lab" },
  { id: "S005", name: "X-Ray Chest", price: 400, category: "Radiology" },
]

export default function FrontOfficeAppointments() {
  const router = useRouter()
  const [fromDate, setFromDate] = useState<Date>(new Date())
  const [toDate, setToDate] = useState<Date>(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showBillDialog, setShowBillDialog] = useState(false)
  const [billItems, setBillItems] = useState<any[]>([])
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<any>(null)
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const loadingRef = useRef(false)





  useEffect(() => {
    const sessionKey = `appointments_loaded_${Date.now()}`
    const alreadyLoaded = sessionStorage.getItem('appointments_page_loaded')
    
    if (!alreadyLoaded && !isInitialized) {
      sessionStorage.setItem('appointments_page_loaded', 'true')
      const user = authService.getCurrentUser()
      setCurrentUser(user)
      setIsInitialized(true)
      loadAppointments()
    }
    
    return () => {
      sessionStorage.removeItem('appointments_page_loaded')
    }
  }, [])

  const loadAppointments = async () => {
    if (loading || loadingRef.current) return
    
    loadingRef.current = true
    setLoading(true)
    try {
      const filters: any = {
        page: 1,
        limit: 50
      }
      
      // Get current user and location from authService
      const user = authService.getCurrentUser()
      const locationId = authService.getLocationId()
      
      // Filter by doctor_id (user.id) and location_id
      if (user?.id) {
        filters.doctorId = parseInt(user.id)
      }
      if (locationId) {
        filters.locationId = parseInt(locationId)
      }
      
      if (fromDate) {
        filters.fromDate = format(fromDate, "yyyy-MM-dd")
      }
      if (toDate) {
        filters.toDate = format(toDate, "yyyy-MM-dd")
      }
      if (statusFilter !== "all") {
        filters.status = statusFilter
      }
      if (searchTerm) {
        filters.search = searchTerm
      }

      const response = await appointmentsApi.getAppointments(filters)
      setAppointments(response.data || [])
    } catch (error) {
      console.error('Failed to load appointments:', error)
      setAppointments([])
    } finally {
      setLoading(false)
      loadingRef.current = false
    }
  }

  const filteredAppointments = appointments

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "no_show":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "scheduled":
        return <Clock className="h-4 w-4" />
      case "in_progress":
        return <AlertCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      case "no_show":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const handleViewBill = (appointment: any) => {
    setSelectedAppointment(appointment)
    setBillItems(appointment.services || [])
    setShowBillDialog(true)
  }

  const handleGenerateBill = (billData: any) => {
    console.log("Generating bill:", billData)
    alert("Bill generated successfully!")
    setShowBillDialog(false)
  }

  const handleSaveDraft = (draftData: any) => {
    console.log("Saving draft:", draftData)
    alert("Draft saved successfully!")
  }

  const addServiceToBill = (service: any) => {
    const newItem = {
      id: service.id,
      name: service.name,
      price: service.price,
      quantity: 1,
      discount: 0,
      total: service.price,
      category: service.category,
    }

    const existingItem = billItems.find((item) => item.id === service.id)
    if (existingItem) {
      const updatedItems = billItems.map((item) =>
        item.id === service.id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price - item.discount }
          : item,
      )
      setBillItems(updatedItems)
    } else {
      setBillItems([...billItems, newItem])
    }
  }

  const handleEditAppointment = (appointment: any) => {
    setEditingAppointment({ ...appointment })
    setShowEditDialog(true)
  }

  const handleSaveEdit = () => {
    if (editingAppointment) {
      console.log("Updated appointment:", editingAppointment)
      alert("Appointment updated successfully!")
      setShowEditDialog(false)
      setEditingAppointment(null)
      loadAppointments() // Reload appointments
    }
  }

  return (
    <PrivateRoute modulePath="admin/front-office/appointments" action="view">
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Appointments
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage patient appointments and billing
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            size="sm" 
            className="w-full sm:w-auto"
            onClick={() => router.push('/admin/front-office/appointments/book')}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no_show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>From Date</Label>
              <Input
                type="date"
                value={format(fromDate, "yyyy-MM-dd")}
                onChange={(e) => setFromDate(new Date(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>To Date</Label>
              <Input
                type="date"
                value={format(toDate, "yyyy-MM-dd")}
                onChange={(e) => setToDate(new Date(e.target.value))}
              />
            </div>

            <div className="flex items-end gap-2">
              <Button
                className="w-full"
                onClick={loadAppointments}
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setFromDate(new Date())
                  setToDate(new Date())
                  loadAppointments()
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Appointments ({filteredAppointments.length})</CardTitle>
          <CardDescription className="text-sm">
            {`Appointments from ${format(fromDate, "PPP")} to ${format(toDate, "PPP")}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 mx-auto mb-4 text-gray-400 animate-spin" />
              <p className="text-gray-500">Loading appointments...</p>
            </div>
          ) : (
            <>
              {/* Mobile View */}
              <div className="block lg:hidden">
                <div className="space-y-4 p-4">
                  {filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{appointment.patientName}</p>
                            <p className="text-sm text-gray-600">{appointment.appointmentNumber}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusIcon(appointment.status)}
                          <span className="ml-1 capitalize">{appointment.status}</span>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Doctor</p>
                          <p className="font-medium">{appointment.doctorName}</p>
                          <p className="text-gray-600">{appointment.type}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Date & Time</p>
                          <p className="font-medium">{appointment.appointmentDate}</p>
                          <p className="text-gray-600">{appointment.appointmentTime}</p>
                        </div>
                      </div>
                      
                      {appointment.nextCallDate && (
                        <div className="mt-2 text-sm">
                          <span className="text-gray-600">Next Call: </span>
                          <span className="text-orange-600 font-medium">
                            {new Date(appointment.nextCallDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-end">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => router.push(`/admin/caseheetnew?patientId=${appointment.patientId}`)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

              {/* Desktop View */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Next Call</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{appointment.patientName}</p>
                              <p className="text-sm text-gray-600">{appointment.appointmentNumber}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-green-600" />
                            <div>
                              <p className="font-medium">{appointment.doctorName}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-purple-600" />
                            <div>
                              <p className="font-medium">{appointment.appointmentDate}</p>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {appointment.appointmentTime}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{appointment.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1 capitalize">{appointment.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {appointment.nextCallDate ? (
                              <span className="text-orange-600 font-medium">
                                {new Date(appointment.nextCallDate).toLocaleDateString()}
                              </span>
                            ) : (
                              <span className="text-gray-400">Not set</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => router.push(`/admin/caseheetnew?patientId=${appointment.patientId}`)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          {filteredAppointments.length === 0 && (
            <div className="text-center py-8">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No appointments found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bill Dialog */}
      <Dialog open={showBillDialog} onOpenChange={setShowBillDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Bill Management - {selectedAppointment?.patientName}
            </DialogTitle>
            <DialogDescription className="text-sm">
              Manage billing for appointment {selectedAppointment?.id}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Patient & Appointment Info */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Patient Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{selectedAppointment?.patientName}</p>
                      <p className="text-sm text-gray-600">{selectedAppointment?.patientId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-green-600" />
                    <p className="text-sm">{selectedAppointment?.patientPhone}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-purple-600" />
                    <p className="text-sm">{selectedAppointment?.patientEmail}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Add Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                    {mockServices.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => addServiceToBill(service)}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{service.name}</p>
                          <p className="text-xs text-gray-600">{service.category}</p>
                        </div>
                        <div className="text-right ml-2">
                          <p className="font-semibold">₹{service.price}</p>
                          <Button size="sm" className="mt-1">
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bill Summary Widget */}
            <div>
              <BillSummaryWidget
                items={billItems}
                onItemsChange={setBillItems}
                onGenerateBill={handleGenerateBill}
                onSaveDraft={handleSaveDraft}
                showPaymentOptions={true}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBillDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Appointment Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Edit Appointment</DialogTitle>
            <DialogDescription className="text-sm">
              Modify appointment details for {editingAppointment?.patientName}
            </DialogDescription>
          </DialogHeader>

          {editingAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Patient Name</Label>
                  <Input
                    value={editingAppointment.patientName}
                    onChange={(e) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        patientName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Patient Phone</Label>
                  <Input
                    value={editingAppointment.patientPhone}
                    onChange={(e) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        patientPhone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Doctor</Label>
                  <Select
                    value={editingAppointment.doctorName}
                    onValueChange={(value) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        doctorName: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr. Priya Sharma">Dr. Priya Sharma</SelectItem>
                      <SelectItem value="Dr. Amit Patel">Dr. Amit Patel</SelectItem>
                      <SelectItem value="Dr. Sunita Gupta">Dr. Sunita Gupta</SelectItem>
                      <SelectItem value="Dr. Rajesh Kumar">Dr. Rajesh Kumar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select
                    value={editingAppointment.department}
                    onValueChange={(value) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        department: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="General Medicine">General Medicine</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={editingAppointment.date}
                    onChange={(e) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Select
                    value={editingAppointment.time}
                    onValueChange={(value) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        time: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                      <SelectItem value="09:30 AM">09:30 AM</SelectItem>
                      <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                      <SelectItem value="10:30 AM">10:30 AM</SelectItem>
                      <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                      <SelectItem value="11:30 AM">11:30 AM</SelectItem>
                      <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                      <SelectItem value="02:30 PM">02:30 PM</SelectItem>
                      <SelectItem value="03:00 PM">03:00 PM</SelectItem>
                      <SelectItem value="03:30 PM">03:30 PM</SelectItem>
                      <SelectItem value="04:00 PM">04:00 PM</SelectItem>
                      <SelectItem value="04:30 PM">04:30 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
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
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Procedure">Procedure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editingAppointment.status}
                    onValueChange={(value) =>
                      setEditingAppointment({
                        ...editingAppointment,
                        status: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={editingAppointment.amount}
                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      amount: Number.parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="w-full sm:w-auto">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </PrivateRoute>
  )
}

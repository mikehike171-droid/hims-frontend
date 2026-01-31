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
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  CalendarIcon,
  Clock,
  User,
  Stethoscope,
  Phone,
  Plus,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Download,
  RefreshCw,
  MessageSquare,
  Trash2,
  PhoneCall,
  AlertTriangle,
  ChevronDown,
  Receipt,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"
import PrivateRoute from "@/components/auth/PrivateRoute"
import authService from "@/lib/authService"
import { useRouter, useSearchParams } from "next/navigation"

// Mock data for all appointments
const mockAllAppointments = [
  {
    id: "APT001",
    patientId: "P001234",
    patientName: "Rajesh Kumar",
    patientPhone: "+91 9876543210",
    patientEmail: "rajesh.kumar@email.com",
    doctorName: "Dr. Priya Sharma",
    department: "Cardiology",
    date: "2024-01-20",
    time: "10:00 AM",
    type: "Consultation",
    status: "confirmed",
    amount: 800,
    bookedBy: "Front Office",
    bookingDate: "2024-01-18",
    notes: "Follow-up for chest pain",
  },
  {
    id: "APT002",
    patientId: "P001235",
    patientName: "Priya Singh",
    patientPhone: "+91 9876543211",
    patientEmail: "priya.singh@email.com",
    doctorName: "Dr. Amit Patel",
    department: "General Medicine",
    date: "2024-01-20",
    time: "11:30 AM",
    type: "Follow-up",
    status: "pending",
    amount: 500,
    bookedBy: "Telecaller",
    bookingDate: "2024-01-19",
    notes: "Diabetes follow-up",
  },
  {
    id: "APT003",
    patientId: "P001236",
    patientName: "Amit Sharma",
    patientPhone: "+91 9876543212",
    patientEmail: "amit.sharma@email.com",
    doctorName: "Dr. Sunita Gupta",
    department: "Pediatrics",
    date: "2024-01-21",
    time: "02:00 PM",
    type: "Consultation",
    status: "confirmed",
    amount: 600,
    bookedBy: "Telecaller",
    bookingDate: "2024-01-20",
    notes: "Child vaccination",
  },
  {
    id: "APT004",
    patientId: "P001237",
    patientName: "Sarah Wilson",
    patientPhone: "+91 9876543213",
    patientEmail: "sarah.wilson@email.com",
    doctorName: "Dr. Rajesh Kumar",
    department: "Orthopedics",
    date: "2024-01-19",
    time: "04:00 PM",
    type: "Consultation",
    status: "completed",
    amount: 700,
    bookedBy: "Front Office",
    bookingDate: "2024-01-17",
    notes: "Knee pain assessment",
  },
  {
    id: "APT005",
    patientId: "P001238",
    patientName: "Michael Johnson",
    patientPhone: "+91 9876543214",
    patientEmail: "michael.johnson@email.com",
    doctorName: "Dr. Priya Sharma",
    department: "Cardiology",
    date: "2024-01-22",
    time: "09:30 AM",
    type: "Follow-up",
    status: "confirmed",
    amount: 800,
    bookedBy: "Telecaller",
    bookingDate: "2024-01-20",
    notes: "Hypertension check-up",
  },
  {
    id: "APT006",
    patientId: "P001239",
    patientName: "Lisa Brown",
    patientPhone: "+91 9876543215",
    patientEmail: "lisa.brown@email.com",
    doctorName: "Dr. Amit Patel",
    department: "General Medicine",
    date: "2024-01-18",
    time: "03:30 PM",
    type: "Consultation",
    status: "no-show",
    amount: 500,
    bookedBy: "Telecaller",
    bookingDate: "2024-01-16",
    notes: "Patient did not show up",
  },
  {
    id: "APT007",
    patientId: "P001240",
    patientName: "David Kumar",
    patientPhone: "+91 9876543216",
    patientEmail: "david.kumar@email.com",
    doctorName: "Dr. Sunita Gupta",
    department: "Pediatrics",
    date: "2024-01-17",
    time: "11:00 AM",
    type: "Emergency",
    status: "cancelled",
    amount: 600,
    bookedBy: "Front Office",
    bookingDate: "2024-01-17",
    notes: "Cancelled due to emergency resolved",
  },
]

const mockDoctors = [
  { id: "D001", name: "Dr. Priya Sharma", department: "Cardiology" },
  { id: "D002", name: "Dr. Amit Patel", department: "General Medicine" },
  { id: "D003", name: "Dr. Sunita Gupta", department: "Pediatrics" },
  { id: "D004", name: "Dr. Rajesh Kumar", department: "Orthopedics" },
  { id: "D005", name: "Dr. Neha Singh", department: "Dermatology" },
]

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
]

export default function TelecallerAppointments() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const fetchingRef = useRef(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<any>(null)
  const [cancellingAppointment, setCancellingAppointment] = useState<any>(null)
  const [cancelReason, setCancelReason] = useState("")
  const [doctors, setDoctors] = useState<any[]>([])
  const [editDoctorSearch, setEditDoctorSearch] = useState("")
  const [editFilteredDoctors, setEditFilteredDoctors] = useState<any[]>([])
  const [showEditDoctorDropdown, setShowEditDoctorDropdown] = useState(false)

  const filteredAppointments = Array.isArray(appointments) ? appointments.filter((appointment) => {
    const matchesSearch =
      (appointment.patientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (appointment.patientPhone || '').includes(searchTerm) ||
      (appointment.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (appointment.patientId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (appointment.doctorName || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || appointment.department === departmentFilter
    
    // Show appointments with no date OR appointments matching selected date
    const matchesDate = !selectedDate || 
      !appointment.appointmentDate || 
      (appointment.appointmentDate && new Date(appointment.appointmentDate).toDateString() === selectedDate.toDateString())

    return matchesSearch && matchesStatus && matchesDepartment && matchesDate
  }) : []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "no-show":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <AlertCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      case "no-show":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const handleEditAppointment = async (appointment: any) => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/appointments/${appointment.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const appointmentData = await response.json()
        
        const doctorName = appointmentData.doctorName || ''
        setEditDoctorSearch(doctorName)
        setEditFilteredDoctors(doctors)
        
        setEditingAppointment({
          ...appointmentData,
          date: appointmentData.appointmentDate ? new Date(appointmentData.appointmentDate).toISOString().split('T')[0] : '',
          time: appointmentData.appointmentTime ? appointmentData.appointmentTime.substring(0, 5) : '',
          type: appointmentData.type || 'consultation',
          status: appointmentData.status || 'scheduled'
        })
        setShowEditDialog(true)
      }
    } catch (error) {
    }
  }

  const handleSaveEdit = async () => {
    if (!editingAppointment) return
    
    try {
      const token = localStorage.getItem('authToken')
      const updateData = {
        patientId: editingAppointment.patientId,
        doctorId: editingAppointment.doctorId,
        appointmentDate: editingAppointment.date,
        appointmentTime: editingAppointment.time,
        appointmentType: editingAppointment.type,
        status: editingAppointment.status,
        notes: editingAppointment.notes
      }
      
      const response = await fetch(`${authService.getSettingsApiUrl()}/appointments/${editingAppointment.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })
      
      if (response.ok) {
        setShowEditDialog(false)
        setEditingAppointment(null)
        fetchAppointments()
      }
    } catch (error) {
    }
  }

  const handleCancelAppointment = (appointment: any) => {
    setCancellingAppointment(appointment)
    setShowCancelDialog(true)
  }

  const confirmCancelAppointment = () => {
    if (cancellingAppointment) {
      const updatedAppointment = {
        ...cancellingAppointment,
        status: "cancelled",
        notes: `${cancellingAppointment.notes} | Cancelled: ${cancelReason}`,
      }
      setAppointments((prev) => prev.map((apt) => (apt.id === cancellingAppointment.id ? updatedAppointment : apt)))

      setShowCancelDialog(false)
      setCancellingAppointment(null)
      setCancelReason("")
    }
  }

  const handleCallPatient = (appointment: any) => {
    window.location.href = `/admin/telecaller/call-patient?patientId=${appointment.patientId}`
  }

  const handleSendMessage = (appointment: any) => {
  }

  const handleBilling = (appointment: any) => {
    router.push(`/admin/manager/patient-bill-discuss/${appointment.patientId}`)
  }

  const fetchAppointments = async () => {
    if (fetchingRef.current) return
    
    try {
      fetchingRef.current = true
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const locationId = authService.getLocationId()
      
      if (!locationId) {
        return
      }

      const response = await fetch(`${authService.getSettingsApiUrl()}/appointments?locationId=${locationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setAppointments(Array.isArray(data) ? data : (data?.data || []))
      }
    } catch (error) {
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }

  useEffect(() => {
    // Check if date parameter exists in URL
    const dateParam = searchParams.get('date')
    if (dateParam) {
      setSelectedDate(new Date(dateParam))
    }
    
    fetchAppointments()
    fetchDoctors()
  }, [searchParams])

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const locationId = userData.locationId || userData.primary_location_id || authService.getLocationId() || 1
      
      const response = await fetch(`${authService.getSettingsApiUrl()}/doctors/users?locationId=${locationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const doctorsData = await response.json()
        setDoctors(doctorsData)
        setEditFilteredDoctors(doctorsData)
      }
    } catch (error) {
    }
  }

  const stats = {
    total: filteredAppointments.length,
    confirmed: filteredAppointments.filter((a) => a.status === "confirmed").length,
    pending: filteredAppointments.filter((a) => a.status === "pending").length,
    completed: filteredAppointments.filter((a) => a.status === "completed").length,
    cancelled: filteredAppointments.filter((a) => a.status === "cancelled").length,
    noShow: filteredAppointments.filter((a) => a.status === "no-show").length,
  }

  return (
    <PrivateRoute modulePath="admin/telecaller/appointments" action="view">
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Appointments</h1>
          <p className="text-gray-600 text-sm sm:text-base">View and manage all patient appointments</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm" className="w-full sm:w-auto bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button asChild size="sm" className="w-full sm:w-auto">
            <Link href="/telecaller/book-appointment">
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <CalendarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.confirmed}</p>
              </div>
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Pending</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Completed</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
              <XCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">No Show</p>
                <p className="text-xl sm:text-2xl font-bold text-orange-600">{stats.noShow}</p>
              </div>
              <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
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
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no-show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="General Medicine">General Medicine</SelectItem>
                  <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="Dermatology">Dermatology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setDepartmentFilter("all")
                  setSelectedDate(undefined)
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
            {selectedDate ? `Appointments for ${format(selectedDate, "PPP")}` : "All appointments across all dates"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile View */}
          <div className="block lg:hidden">
            <div className="space-y-4 p-4">
              {filteredAppointments.map((appointment) => (
                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{appointment.patientName}</p>
                            <p className="text-sm text-gray-600">{appointment.patientId}</p>
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
                          <p className="text-gray-600">{appointment.department}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Date & Time</p>
                          <p className="font-medium">{appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString() : 'N/A'}</p>
                          <p className="text-gray-600">{appointment.appointmentTime || 'N/A'}</p>
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
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBilling(appointment)}
                            title="Patient Billing"
                          >
                            <Receipt className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCallPatient(appointment)}
                            title="Call Patient"
                          >
                            <PhoneCall className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditAppointment(appointment)}
                            title="Edit Appointment"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
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
                  <TableHead>Booked By</TableHead>
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
                          {/* <p className="text-sm text-gray-600">{appointment.patientId}</p> */}
                          {/* <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {appointment.patientPhone}
                          </p> */}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="font-medium">{appointment.doctorName}</p>
                          <p className="text-sm text-gray-600">{appointment.department}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-purple-600" />
                        <div>
                          <p className="font-medium">{appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString() : 'N/A'}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {appointment.appointmentTime || 'N/A'}
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
                      <div>
                        <p className="text-sm font-medium">{appointment.createdBy}</p>
                        <p className="text-xs text-gray-500">{appointment.bookingDate}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleBilling(appointment)}
                          title="Patient Billing"
                        >
                          <Receipt className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCallPatient(appointment)}
                          title="Call Patient"
                        >
                          <PhoneCall className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditAppointment(appointment)}
                          title="Edit Appointment"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-12 w-12 mx-auto mb-4 text-gray-300 animate-spin" />
              <p className="text-gray-500">Loading appointments...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No appointments found</p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Edit Appointment Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Edit Appointment</DialogTitle>
            <DialogDescription className="text-sm">
              Modify appointment details for {editingAppointment?.patientName}
            </DialogDescription>
          </DialogHeader>

          {editingAppointment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                <div className="relative space-y-2">
                  <Label>Doctor</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search and select a doctor..."
                      value={editDoctorSearch}
                      onChange={(e) => {
                        setEditDoctorSearch(e.target.value)
                        const filtered = doctors.filter(doctor => {
                          const fullName = `${doctor.first_name || doctor.firstName || ''} ${doctor.last_name || doctor.lastName || ''}`.toLowerCase()
                          const username = (doctor.username || '').toLowerCase()
                          return fullName.includes(e.target.value.toLowerCase()) || username.includes(e.target.value.toLowerCase())
                        })
                        setEditFilteredDoctors(filtered)
                      }}
                      onFocus={() => setShowEditDoctorDropdown(true)}
                      className="pl-10 pr-10"
                    />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {showEditDoctorDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                      {editFilteredDoctors.length > 0 ? (
                        editFilteredDoctors.map((doctor) => (
                          <div
                            key={doctor.id}
                            onClick={() => {
                              const doctorName = `${doctor.first_name || doctor.firstName || ''} ${doctor.last_name || doctor.lastName || ''}`.trim()
                              setEditDoctorSearch(doctorName)
                              setShowEditDoctorDropdown(false)
                              setEditingAppointment({
                                ...editingAppointment,
                                doctorId: doctor.id,
                                doctorName: doctorName
                              })
                            }}
                            className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                              <Stethoscope className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{doctor.first_name || doctor.firstName} {doctor.last_name || doctor.lastName}</p>
                              <p className="text-sm text-gray-500">{doctor.username}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-gray-500 text-center">
                          No doctors found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
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
                        appointmentTime: value
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">09:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="14:00">02:00 PM</SelectItem>
                      <SelectItem value="15:00">03:00 PM</SelectItem>
                      <SelectItem value="16:00">04:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
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
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="no_show">No Show</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
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

      {/* Cancel Appointment Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Cancel Appointment</DialogTitle>
            <DialogDescription className="text-sm">
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
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800">Important Notice</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Cancelling this appointment will notify the patient via SMS and WhatsApp. The appointment slot will
                    become available for other patients.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCancelDialog(false)} className="w-full sm:w-auto">
                Keep Appointment
              </Button>
              <Button
                onClick={confirmCancelAppointment}
                className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                disabled={!cancelReason.trim()}
              >
                Cancel Appointment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </PrivateRoute>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
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
  PhoneCall,
  AlertTriangle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  List,
  UserPlus,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import Link from "next/link"
import PrivateRoute from "@/components/auth/PrivateRoute"
import authService from "@/lib/authService"
import { appointmentsApi } from "@/lib/appointmentsApi"
import { useRouter, useSearchParams } from "next/navigation"

// ─── Helpers ──────────────────────────────────────────────────
const safeFormatDate = (dateString: string, formatStr: string) => {
  try {
    if (!dateString) return "—"
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return "—"
    return format(d, formatStr)
  } catch {
    return "—"
  }
}

const maskPhoneNumber = (phone: string) => {
  if (!phone || phone === "N/A") return "******9999"
  const digits = phone.replace(/\D/g, "")
  if (digits.length <= 4) return "******" + digits
  return "******" + digits.slice(-4)
}

// ─── Component ────────────────────────────────────────────────
export default function OPPatientAppointments() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // ── List State ──
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const fetchingRef = useRef(false)

  // ── Filters ──
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return format(d, "yyyy-MM-dd")
  })
  const [toDate, setToDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return format(d, "yyyy-MM-dd")
  })

  // ── Pagination ──
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)

  // ── Doctors (for edit dialog) ──
  const [doctors, setDoctors] = useState<any[]>([])
  const [editDoctorSearch, setEditDoctorSearch] = useState("")
  const [editFilteredDoctors, setEditFilteredDoctors] = useState<any[]>([])
  const [showEditDoctorDropdown, setShowEditDoctorDropdown] = useState(false)

  // ── Edit / Cancel Dialog ──
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<any>(null)
  const [cancellingAppointment, setCancellingAppointment] = useState<any>(null)
  const [cancelReason, setCancelReason] = useState("")

  // ─── Fetch Appointments ──────────────────────────────────────
  const fetchAppointments = async (pageNum = page) => {
    fetchingRef.current = true
    setLoading(true)
    try {
      const locationId = authService.getLocationId()
      const filters: any = {
        page: pageNum,
        limit: 10,
      }
      if (locationId) filters.locationId = parseInt(locationId)
      if (!searchTerm) {
        if (fromDate) filters.fromDate = fromDate
        if (toDate) filters.toDate = toDate
      }
      if (statusFilter !== "all") filters.status = statusFilter
      if (searchTerm) filters.search = searchTerm

      const response = await appointmentsApi.getAppointments(filters)
      setAppointments(response.data || [])
      setPage(response.page || pageNum)
      setTotalPages(response.totalPages || Math.ceil((response.total || 0) / 10))
      setTotalRecords(response.total || 0)
    } catch {
      setAppointments([])
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }

  // ─── Fetch Doctors ───────────────────────────────────────────
  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const locationId = authService.getLocationId() || 1
      const res = await fetch(
        `${authService.getSettingsApiUrl()}/doctors/users?locationId=${locationId}`,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      )
      if (res.ok) {
        const data = await res.json()
        setDoctors(Array.isArray(data) ? data : [])
        setEditFilteredDoctors(Array.isArray(data) ? data : [])
      }
    } catch { /* silent */ }
  }

  useEffect(() => {
    const dateParam = searchParams.get("date")
    if (dateParam) {
      setFromDate(dateParam)
      setToDate(dateParam)
    }
    fetchAppointments(1)
    fetchDoctors()
  }, [searchParams])

  // ─── Status Helpers ──────────────────────────────────────────
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":   return "bg-green-100 text-green-800"
      case "scheduled":   return "bg-blue-100 text-blue-800"
      case "pending":     return "bg-yellow-100 text-yellow-800"
      case "in_progress": return "bg-orange-100 text-orange-800"
      case "completed":   return "bg-indigo-100 text-indigo-800"
      case "cancelled":   return "bg-red-100 text-red-800"
      case "no_show":
      case "no-show":     return "bg-gray-100 text-gray-800"
      default:            return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
      case "completed":   return <CheckCircle className="h-3.5 w-3.5" />
      case "cancelled":
      case "no_show":
      case "no-show":     return <XCircle className="h-3.5 w-3.5" />
      default:            return <AlertCircle className="h-3.5 w-3.5" />
    }
  }

  // ─── Edit Appointment ────────────────────────────────────────
  const handleEditAppointment = async (appointment: any) => {
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch(
        `${authService.getSettingsApiUrl()}/appointments/${appointment.id}`,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      )
      if (res.ok) {
        const data = await res.json()
        setEditDoctorSearch(data.doctorName || "")
        setEditFilteredDoctors(doctors)
        setEditingAppointment({
          ...data,
          date: data.appointmentDate ? new Date(data.appointmentDate).toISOString().split("T")[0] : "",
          time: data.appointmentTime ? data.appointmentTime.substring(0, 5) : "",
          type: data.type || "consultation",
          status: data.status || "scheduled",
        })
        setShowEditDialog(true)
      }
    } catch { /* silent */ }
  }

  const handleSaveEdit = async () => {
    if (!editingAppointment) return
    try {
      const token = localStorage.getItem("authToken")
      const payload = {
        patientId: editingAppointment.patientId,
        doctorId: editingAppointment.doctorId,
        appointmentDate: editingAppointment.date,
        appointmentTime: editingAppointment.time,
        appointmentType: editingAppointment.type,
        status: editingAppointment.status,
        notes: editingAppointment.notes,
      }
      const res = await fetch(
        `${authService.getSettingsApiUrl()}/appointments/${editingAppointment.id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )
      if (res.ok) {
        setShowEditDialog(false)
        setEditingAppointment(null)
        fetchAppointments(page)
      }
    } catch { /* silent */ }
  }

  // ─── Cancel Appointment ──────────────────────────────────────
  const handleCancelAppointment = (appointment: any) => {
    setCancellingAppointment(appointment)
    setShowCancelDialog(true)
  }

  const confirmCancelAppointment = async () => {
    if (!cancellingAppointment) return
    try {
      const token = localStorage.getItem("authToken")
      await fetch(
        `${authService.getSettingsApiUrl()}/appointments/${cancellingAppointment.id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            patientId: cancellingAppointment.patientId,
            doctorId: cancellingAppointment.doctorId,
            appointmentDate: cancellingAppointment.appointmentDate,
            appointmentTime: cancellingAppointment.appointmentTime,
            appointmentType: cancellingAppointment.type,
            status: "cancelled",
            notes: `${cancellingAppointment.notes || ""} | Cancelled: ${cancelReason}`,
          }),
        }
      )
      fetchAppointments(page)
    } catch { /* silent */ }
    setShowCancelDialog(false)
    setCancellingAppointment(null)
    setCancelReason("")
  }

  const handleCallPatient = (appointment: any) => {
    router.push(`/admin/telecaller/call-patient?patientId=${appointment.patientId}`)
  }

  // ─── Pagination helpers ──────────────────────────────────────
  const getPageNumbers = () => {
    const pages = []
    const win = 7
    let start = Math.max(1, page - Math.floor(win / 2))
    let end = Math.min(totalPages, start + win - 1)
    if (end - start + 1 < win) start = Math.max(1, end - win + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  // ─── Render ──────────────────────────────────────────────────
  return (
    <PrivateRoute modulePath="admin/telecaller/op-patient" action="view">
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">OP Patient Appointments</h1>
            <p className="text-gray-600 text-sm sm:text-base">View and manage all OP patient appointments</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild size="sm" variant="outline" className="w-full sm:w-auto">
              <Link href="/admin/telecaller/ol">
                <List className="h-4 w-4 mr-2" />
                OP List
              </Link>
            </Button>
            <Button asChild size="sm" className="w-full sm:w-auto">
              <Link href="/admin/telecaller/op-patient-create">
                <UserPlus className="h-4 w-4 mr-2" />
                OP Patient Create
              </Link>
            </Button>
          </div>
        </div>

        {/* ── Filters ── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Name, phone, ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchAppointments(1)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no_show">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* From Date */}
              <div className="space-y-2">
                <Label>From Date</Label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border-gray-200"
                />
              </div>

              {/* To Date */}
              <div className="space-y-2">
                <Label>To Date</Label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border-gray-200"
                />
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Button className="w-full" onClick={() => fetchAppointments(1)}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Appointments Table ── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">OP Patient Appointments ({totalRecords})</CardTitle>
            <CardDescription className="text-sm">
              {fromDate && toDate
                ? `From ${safeFormatDate(fromDate, "dd/MM/yyyy")} to ${safeFormatDate(toDate, "dd/MM/yyyy")} — Page ${page} of ${totalPages}`
                : "All appointments"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-12">
                <RefreshCw className="h-8 w-8 mx-auto mb-4 text-gray-400 animate-spin" />
                <p className="text-gray-500">Loading appointments...</p>
              </div>
            ) : (
              <>
                {/* Mobile View */}
                <div className="block lg:hidden">
                  <div className="space-y-4 p-4">
                    {appointments.map((appointment) => (
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
                                  <p className="text-xs text-gray-500">
                                    {maskPhoneNumber(appointment.patientPhone)}
                                  </p>
                                </div>
                              </div>
                              <Badge className={getStatusColor(appointment.status)}>
                                {getStatusIcon(appointment.status)}
                                <span className="ml-1 capitalize">{appointment.status}</span>
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-gray-500">Doctor</p>
                                <p className="font-medium">{appointment.doctorName}</p>
                                <p className="text-gray-500 text-xs">{appointment.department}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Date & Time</p>
                                <p className="font-medium">{safeFormatDate(appointment.appointmentDate, "dd/MM/yyyy")}</p>
                                <p className="text-gray-500 text-xs">{appointment.appointmentTime}</p>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleCallPatient(appointment)} title="Call Patient">
                                <PhoneCall className="h-4 w-4" />
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
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{appointment.patientName}</p>
                                <p className="text-xs text-gray-500">
                                  {maskPhoneNumber(appointment.patientPhone)}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Stethoscope className="h-4 w-4 text-green-600 shrink-0" />
                              <div>
                                <p className="font-medium text-sm">{appointment.doctorName}</p>
                                <p className="text-xs text-gray-500">{appointment.department}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4 text-purple-500 shrink-0" />
                              <div>
                                <p className="font-medium text-sm">{safeFormatDate(appointment.appointmentDate, "dd/MM/yyyy")}</p>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {appointment.appointmentTime || "—"}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs capitalize">
                              {appointment.type || "—"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn(getStatusColor(appointment.status), "text-xs")}>
                              {getStatusIcon(appointment.status)}
                              <span className="ml-1 capitalize">{appointment.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCallPatient(appointment)}
                                title="Call Patient"
                                className="h-8 w-8 p-0"
                              >
                                <PhoneCall className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}

            {/* Empty state */}
            {appointments.length === 0 && !loading && (
              <div className="text-center py-12">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No appointments found</p>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalRecords > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t gap-4">
                <div className="text-sm text-gray-600">
                  Showing {Math.min((page - 1) * 10 + 1, totalRecords)} to{" "}
                  {Math.min(page * 10, totalRecords)} of {totalRecords} appointments
                </div>
                <div className="flex gap-2 items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchAppointments(page - 1)}
                    disabled={page === 1 || loading}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Prev
                  </Button>
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((pNum) => (
                      <Button
                        key={pNum}
                        variant={page === pNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => fetchAppointments(pNum)}
                        disabled={loading}
                        className="w-9"
                      >
                        {pNum}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchAppointments(page + 1)}
                    disabled={page >= totalPages || loading}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Edit Appointment Dialog ── */}
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
                {/* Patient Name + Doctor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Patient Name</Label>
                    <Input
                      value={editingAppointment.patientName || ""}
                      onChange={(e) => setEditingAppointment({ ...editingAppointment, patientName: e.target.value })}
                    />
                  </div>
                  {/* Doctor search */}
                  <div className="relative space-y-2">
                    <Label>Doctor</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search doctor..."
                        value={editDoctorSearch}
                        onChange={(e) => {
                          setEditDoctorSearch(e.target.value)
                          const filtered = doctors.filter((d) => {
                            const name = `${d.first_name || d.firstName || ""} ${d.last_name || d.lastName || ""}`.toLowerCase()
                            return name.includes(e.target.value.toLowerCase()) || (d.username || "").toLowerCase().includes(e.target.value.toLowerCase())
                          })
                          setEditFilteredDoctors(filtered)
                        }}
                        onFocus={() => setShowEditDoctorDropdown(true)}
                        className="pl-10 pr-10"
                      />
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    {showEditDoctorDropdown && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-56 overflow-auto">
                        {editFilteredDoctors.length > 0 ? (
                          editFilteredDoctors.map((doctor) => (
                            <div
                              key={doctor.id}
                              onClick={() => {
                                const name = `${doctor.first_name || doctor.firstName || ""} ${doctor.last_name || doctor.lastName || ""}`.trim()
                                setEditDoctorSearch(name)
                                setShowEditDoctorDropdown(false)
                                setEditingAppointment({ ...editingAppointment, doctorId: doctor.id, doctorName: name })
                              }}
                              className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 shrink-0">
                                <Stethoscope className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">
                                  {doctor.first_name || doctor.firstName} {doctor.last_name || doctor.lastName}
                                </p>
                                <p className="text-xs text-gray-500">{doctor.username}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-gray-500 text-center text-sm">No doctors found</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Date / Time / Type / Status */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={editingAppointment.date || ""}
                      onChange={(e) => setEditingAppointment({ ...editingAppointment, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Select
                      value={editingAppointment.time || ""}
                      onValueChange={(v) => setEditingAppointment({ ...editingAppointment, time: v, appointmentTime: v })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"].map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={editingAppointment.type || ""}
                      onValueChange={(v) => setEditingAppointment({ ...editingAppointment, type: v })}
                    >
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="procedure">Procedure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={editingAppointment.status || ""}
                      onValueChange={(v) => setEditingAppointment({ ...editingAppointment, status: v })}
                    >
                      <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="no_show">No Show</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={editingAppointment.notes || ""}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, notes: e.target.value })}
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

        {/* ── Cancel Appointment Dialog ── */}
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
                <Label>Cancellation Reason <span className="text-red-500">*</span></Label>
                <Textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter reason for cancellation..."
                  rows={3}
                  className="mt-1.5"
                />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800 text-sm">Important Notice</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Cancelling this appointment will notify the patient. The slot will become available for other patients.
                  </p>
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

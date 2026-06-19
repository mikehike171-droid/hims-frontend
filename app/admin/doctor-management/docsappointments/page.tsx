"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Calendar, Clock, User, Users, CalendarIcon, CheckCircle, AlertCircle, XCircle, FileText, Search, PhoneCall, Loader2 } from "lucide-react"
import { format } from "date-fns"
import PrivateRoute from "@/components/auth/PrivateRoute"
import authService from "@/lib/authService"
import { useRouter } from "next/navigation"

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [apiStats, setApiStats] = useState({ total: 0, waiting: 0, withDoctor: 0, completed: 0 })
  const router = useRouter()

  const getTodayFormatted = () => {
    const date = new Date()
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const [fromDate, setFromDate] = useState(getTodayFormatted())
  const [toDate, setToDate] = useState(getTodayFormatted())
  const [fromDateObj, setFromDateObj] = useState<Date>(new Date())
  const [toDateObj, setToDateObj] = useState<Date>(new Date())
  const [searchTerm, setSearchTerm] = useState("")

  const convertToApiFormat = (ddmmyyyy: string) => {
    const [day, month, year] = ddmmyyyy.split('/')
    return `${year}-${month}-${day}`
  }
  const filteredAppointments = appointments.filter((appointment: any) => {
    const matchesSearch = searchTerm === "" ||
      appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientRegId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientPhone?.includes(searchTerm) ||
      appointment.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  useEffect(() => {
    fetchDoctorAppointments()
  }, [])

  const fetchDoctorAppointments = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("authToken")
      const userStr = localStorage.getItem("user")
      const user = userStr ? JSON.parse(userStr) : null
      const locationId = localStorage.getItem("selected_location_id") || user?.primary_location_id || user?.location_id || ""

      const params = new URLSearchParams()
      if (fromDate) params.append('fromDate', convertToApiFormat(fromDate))
      if (toDate) params.append('toDate', convertToApiFormat(toDate))
      if (user?.id) params.append('doctorId', user.id.toString())
      if (locationId) params.append('locationId', locationId.toString())
      params.append('page', '1')
      params.append('limit', '100')

      const response = await fetch(
        `${authService.getSettingsApiUrl()}/appointments?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      const result = await response.json()
      setAppointments(result.data || [])
      if (result.stats) {
        setApiStats(result.stats)
      }
    } catch (error) {
      console.error("Error fetching appointments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCaseSheetClick = (patientId: string) => {
    router.push(`/admin/caseheetnew?patientId=${patientId}`)
  }

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      setUpdatingId(appointmentId)
      const token = localStorage.getItem("authToken")
      await fetch(
        `${authService.getSettingsApiUrl()}/queue/appointments/${appointmentId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      )
      await fetchDoctorAppointments()
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "scheduled":
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "no-show":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
      case "scheduled":
        return <AlertCircle className="h-4 w-4" />
      case "cancelled":
      case "no-show":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <PrivateRoute modulePath="admin/doctor-management" action="view">
        <div className="flex h-screen items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </PrivateRoute>
    )
  }

  return (
    <PrivateRoute modulePath="admin/doctor-management" action="view">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600">View and manage your scheduled appointments</p>
        </div>

        {/* Today's Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="bg-blue-50 border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-1">Total</p>
                  <p className="text-4xl font-black text-blue-900">{apiStats.total}</p>
                </div>
                <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-7 w-7 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50 border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-yellow-600 uppercase tracking-wider mb-1">Waiting</p>
                  <p className="text-4xl font-black text-yellow-900">{apiStats.waiting}</p>
                </div>
                <div className="h-14 w-14 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="h-7 w-7 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50 border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-1">With Doctor</p>
                  <p className="text-4xl font-black text-emerald-900">{apiStats.withDoctor}</p>
                </div>
                <div className="h-14 w-14 bg-emerald-100 rounded-full flex items-center justify-center">
                  <PhoneCall className="h-7 w-7 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-50 border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-1">Completed</p>
                  <p className="text-4xl font-black text-gray-900">{apiStats.completed}</p>
                </div>
                <div className="h-14 w-14 bg-gray-200 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-7 w-7 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Date Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>From Date (DD/MM/YYYY)</Label>
                <div className="relative">
                  <input
                    id="fromDatePicker"
                    type="date"
                    value={fromDateObj.toISOString().split('T')[0]}
                    onChange={(e) => {
                      const date = new Date(e.target.value)
                      setFromDateObj(date)
                      const day = String(date.getDate()).padStart(2, '0')
                      const month = String(date.getMonth() + 1).padStart(2, '0')
                      const year = date.getFullYear()
                      setFromDate(`${day}/${month}/${year}`)
                    }}
                    style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 }}
                  />
                  <Input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={fromDate}
                    readOnly
                    className="w-full cursor-pointer"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>To Date (DD/MM/YYYY)</Label>
                <div className="relative">
                  <input
                    id="toDatePicker"
                    type="date"
                    value={toDateObj.toISOString().split('T')[0]}
                    onChange={(e) => {
                      const date = new Date(e.target.value)
                      setToDateObj(date)
                      const day = String(date.getDate()).padStart(2, '0')
                      const month = String(date.getMonth() + 1).padStart(2, '0')
                      const year = date.getFullYear()
                      setToDate(`${day}/${month}/${year}`)
                    }}
                    style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 2 }}
                  />
                  <Input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={toDate}
                    readOnly
                    className="w-full cursor-pointer"
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="flex items-end">
                <Button onClick={fetchDoctorAppointments} className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Appointments ({filteredAppointments.length})</CardTitle>
                <CardDescription>All your scheduled patient appointments</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No appointments found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.map((appointment: any) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{appointment.patientName}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-purple-600" />
                            <div>
                              <p className="font-medium">
                                {appointment.appointmentDate
                                  ? new Date(appointment.appointmentDate).toLocaleDateString('en-GB')
                                  : "N/A"}
                              </p>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {appointment.appointmentTime || "N/A"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{appointment.type || "consultation"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(appointment.status)}>
                            {getStatusIcon(appointment.status)}
                            <span className="ml-1 capitalize">{appointment.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600">{appointment.notes || "-"}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            {(() => {
                              const status = (appointment.status || '').toLowerCase()
                              if (status === 'completed' || status === 'done') {
                                return (
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" /> Completed
                                  </Badge>
                                )
                              } else if (status === 'with_doctor' || status === 'in_progress') {
                                return (
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                                    disabled={updatingId === appointment.id}
                                  >
                                    {updatingId === appointment.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                    ) : (
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                    )}
                                    Completed
                                  </Button>
                                )
                              } else {
                                return (
                                  <Button
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={() => updateAppointmentStatus(appointment.id, 'with_doctor')}
                                    disabled={updatingId === appointment.id}
                                  >
                                    {updatingId === appointment.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                    ) : (
                                      <PhoneCall className="h-4 w-4 mr-1" />
                                    )}
                                    Call Next
                                  </Button>
                                )
                              }
                            })()}
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Case Sheet"
                              onClick={() => handleCaseSheetClick(appointment.patientId)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  )
}

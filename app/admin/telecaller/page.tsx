"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Phone,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  PhoneCall,
  Target,
  BarChart3,
  UserCheck,
  Pill,
  TestTube,
  CreditCard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import authService from "@/lib/authService"

// Mock data - replace with actual API calls
const mockKPIs = {
  callsMade: 45,
  callsConnected: 32,
  appointmentsBooked: 12,
  conversions: 8,
  revenueInfluenced: 25000,
}

const mockTasks = [
  {
    id: 1,
    type: "new_lead",
    patient: "Rajesh Kumar",
    patientId: "P001234",
    phone: "+91 98765 43210",
    priority: "high",
    dueTime: "10:30 AM",
    campaign: "Health Checkup",
    status: "pending",
  },
  {
    id: 2,
    type: "follow_up",
    patient: "Priya Sharma",
    patientId: "P001235",
    phone: "+91 98765 43211",
    priority: "medium",
    dueTime: "11:00 AM",
    lastVisit: "2 days ago",
    doctor: "Dr. Patel",
    status: "pending",
  },
  {
    id: 3,
    type: "lab_reminder",
    patient: "Amit Singh",
    patientId: "P001236",
    phone: "+91 98765 43212",
    priority: "high",
    dueTime: "11:30 AM",
    labTest: "Blood Sugar",
    overdue: "3 days",
    status: "pending",
  },
  {
    id: 4,
    type: "rx_reminder",
    patient: "Sunita Devi",
    patientId: "P001237",
    phone: "+91 98765 43213",
    priority: "medium",
    dueTime: "12:00 PM",
    medication: "Diabetes medicines",
    partialPurchase: "50%",
    status: "pending",
  },
  {
    id: 5,
    type: "appointment_reminder",
    patient: "Vikram Gupta",
    patientId: "P001238",
    phone: "+91 98765 43214",
    priority: "low",
    dueTime: "2:00 PM",
    appointmentDate: "Tomorrow",
    doctor: "Dr. Singh",
    status: "completed",
  },
]

const mockRecentCalls = [
  {
    id: 1,
    patient: "Meera Joshi",
    patientId: "P001239",
    phone: "+91 98765 43215",
    duration: "5:30",
    outcome: "booked",
    time: "9:45 AM",
    notes: "Booked appointment for next Tuesday",
  },
  {
    id: 2,
    patient: "Ravi Patel",
    patientId: "P001240",
    phone: "+91 98765 43216",
    duration: "2:15",
    outcome: "call_later",
    time: "9:30 AM",
    notes: "Patient busy, call back at 3 PM",
  },
  {
    id: 3,
    patient: "Anjali Verma",
    patientId: "P001241",
    phone: "+91 98765 43217",
    duration: "8:45",
    outcome: "info_given",
    time: "9:15 AM",
    notes: "Explained lab test procedure",
  },
]

const getTaskIcon = (type: string) => {
  switch (type) {
    case "new_lead":
      return <Target className="h-4 w-4" />
    case "follow_up":
      return <UserCheck className="h-4 w-4" />
    case "lab_reminder":
      return <TestTube className="h-4 w-4" />
    case "rx_reminder":
      return <Pill className="h-4 w-4" />
    case "appointment_reminder":
      return <Calendar className="h-4 w-4" />
    default:
      return <Phone className="h-4 w-4" />
  }
}

const getTaskTypeLabel = (type: string) => {
  switch (type) {
    case "new_lead":
      return "New Lead"
    case "follow_up":
      return "Follow-up"
    case "lab_reminder":
      return "Lab Reminder"
    case "rx_reminder":
      return "Rx Reminder"
    case "appointment_reminder":
      return "Appointment Reminder"
    default:
      return type
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

const getOutcomeColor = (outcome: string) => {
  switch (outcome) {
    case "booked":
      return "bg-green-100 text-green-800"
    case "info_given":
      return "bg-blue-100 text-blue-800"
    case "call_later":
      return "bg-yellow-100 text-yellow-800"
    case "not_reachable":
      return "bg-gray-100 text-gray-800"
    case "declined":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function TelecallerDashboard() {
  const router = useRouter()
  const [selectedQueue, setSelectedQueue] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const fetchingRef = useRef(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [monthAppointments, setMonthAppointments] = useState({})
  const [todaysAppointments, setTodaysAppointments] = useState([])
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [showPatientDialog, setShowPatientDialog] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    fetchMonthAppointments()
  }, [])

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0]
  }

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(currentMonth.getMonth() + direction)
    setCurrentMonth(newMonth)
  }



  const fetchMonthAppointments = async () => {
    if (fetchingRef.current) return

    try {
      fetchingRef.current = true
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const locationId = authService.getLocationId()

      if (!locationId) return

      const response = await fetch(`${authService.getSettingsApiUrl()}/appointments?locationId=${locationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        const appointmentsArray = Array.isArray(data) ? data : (data?.data || [])

        // Group appointments by date
        const grouped = {}
        appointmentsArray.forEach(apt => {
          if (apt.appointmentDate) {
            const date = new Date(apt.appointmentDate).toISOString().split('T')[0]
            if (!grouped[date]) grouped[date] = []
            grouped[date].push(apt)
          }
        })

        setMonthAppointments(grouped)

        // Filter today's appointments
        const today = new Date()
        const todayStr = today.getFullYear() + '-' +
          String(today.getMonth() + 1).padStart(2, '0') + '-' +
          String(today.getDate()).padStart(2, '0')

        const todaysAppts = appointmentsArray.filter(apt => {
          if (apt.appointmentDate) {
            const aptDate = new Date(apt.appointmentDate)
            const aptDateStr = aptDate.getFullYear() + '-' +
              String(aptDate.getMonth() + 1).padStart(2, '0') + '-' +
              String(aptDate.getDate()).padStart(2, '0')
            return aptDateStr === todayStr
          }
          return false
        })
        setTodaysAppointments(todaysAppts)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }

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
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTasks = todaysAppointments.filter((appointment) => {
    if (searchTerm && !(appointment.patientName || '').toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  return (
    <PrivateRoute modulePath="admin/telecaller" action="view">
      <div className="flex-1 space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Telecaller Dashboard</h1>
            <p className="text-muted-foreground">
              {currentTime.toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              •{" "}
              {currentTime.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

        </div>



        {/* Appointments Calendar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Appointments Calendar</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>
                  ←
                </Button>
                <span className="font-medium min-w-[120px] text-center">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>
                  →
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/telecaller/appointments">
                    View All
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading calendar...</div>
            ) : (
              <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center font-medium text-sm text-gray-600 border-b">
                    {day}
                  </div>
                ))}

                {/* Calendar days */}
                {getDaysInMonth(currentMonth).map((day, index) => {
                  if (!day) {
                    return <div key={index} className="p-2 h-20"></div>
                  }

                  const dateKey = formatDateKey(day)
                  const dayAppointments = monthAppointments[dateKey] || []
                  const isToday = day.toDateString() === new Date().toDateString()

                  return (
                    <div
                      key={index}
                      className={`p-1 min-h-[5rem] h-auto border border-gray-200 ${isToday ? 'bg-blue-50' : 'bg-white'}`}
                    >
                      <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-1 mt-1">
                        {dayAppointments.map((apt, i) => (
                          <TooltipProvider key={i}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className={`text-xs p-1 rounded ${getStatusColor(apt.status)} cursor-pointer hover:opacity-80`}
                                  onClick={() => {
                                    setSelectedPatient(apt)
                                    setShowPatientDialog(true)
                                  }}
                                >
                                  <div className="truncate text-xs">
                                    <span className="font-medium text-blue-600">
                                      {apt.patientFirstName || apt.first_name || ''} {apt.patientLastName || apt.last_name || apt.patientName || ''}
                                    </span>
                                    <span className="text-red-600 ml-1">
                                      (Dr. {apt.doctorFirstName || apt.doctor_first_name || ''} {apt.doctorLastName || apt.doctor_last_name || apt.doctorName || ''})
                                    </span>
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Patient: {apt.patientFirstName || apt.first_name || ''} {apt.patientLastName || apt.last_name || apt.patientName || ''}</p>
                                <p>Doctor: {apt.doctorFirstName || apt.doctor_first_name || ''} {apt.doctorLastName || apt.doctor_last_name || apt.doctorName || ''}</p>
                                <p>Status: {apt.status}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid gap-12">
          {/* Work Queue */}
          <div className="md:col-span-2">

          </div>

          {/* Recent Calls & Quick Actions */}

        </div>

        {/* Patient Details Dialog */}
        <Dialog open={showPatientDialog} onOpenChange={setShowPatientDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Patient Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedPatient && (
                <>
                  <div>
                    <Label>Patient Name</Label>
                    <p className="text-lg font-medium">{selectedPatient.patientName}</p>
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <p className="text-lg font-medium">{selectedPatient.patientPhone}</p>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PrivateRoute>
  )
}

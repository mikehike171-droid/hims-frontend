"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  const [loading, setLoading] = useState(true)
  const fetchingRef = useRef(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [monthAppointments, setMonthAppointments] = useState({})
  const [todaysAppointments, setTodaysAppointments] = useState([])

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
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/telecaller/campaigns">
              <Target className="mr-2 h-4 w-4" />
              Campaigns
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/telecaller/reports">
              <BarChart3 className="mr-2 h-4 w-4" />
              Reports
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calls Made</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKPIs.callsMade}</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected</CardTitle>
            <PhoneCall className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKPIs.callsConnected}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockKPIs.callsConnected / mockKPIs.callsMade) * 100)}% connect rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKPIs.appointmentsBooked}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockKPIs.appointmentsBooked / mockKPIs.callsConnected) * 100)}% booking rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKPIs.conversions}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockKPIs.conversions / mockKPIs.callsConnected) * 100)}% conversion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Influenced</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{mockKPIs.revenueInfluenced.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+18% from yesterday</p>
          </CardContent>
        </Card>
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
                    className={`p-1 h-20 border border-gray-200 ${isToday ? 'bg-blue-50' : 'bg-white'}`}
                  >
                    <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                      {day.getDate()}
                    </div>
                    <div className="space-y-1 mt-1">
                      {dayAppointments.slice(0, 1).map((apt, i) => (
                        <div key={i} className={`text-xs p-1 rounded ${getStatusColor(apt.status)}`}>
                          <div className="truncate font-medium text-blue-600">
                            {apt.patientFirstName || apt.first_name || ''} {apt.patientLastName || apt.last_name || apt.patientName || ''}
                          </div>
                          <div className="truncate text-red-600">
                            Dr. {apt.doctorFirstName || apt.doctor_first_name || ''} {apt.doctorLastName || apt.doctor_last_name || apt.doctorName || ''}
                          </div>
                        </div>
                      ))}
                      {dayAppointments.length > 1 && (
                        <div className="text-xs text-gray-500">+{dayAppointments.length - 1} more</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Work Queue */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Today's Appointments</CardTitle>
                  <CardDescription>
                    {todaysAppointments.length} appointments scheduled for today
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Select value={selectedQueue} onValueChange={setSelectedQueue}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tasks</SelectItem>
                      <SelectItem value="new_lead">New Leads</SelectItem>
                      <SelectItem value="follow_up">Follow-ups</SelectItem>
                      <SelectItem value="lab_reminder">Lab Reminders</SelectItem>
                      <SelectItem value="rx_reminder">Rx Reminders</SelectItem>
                      <SelectItem value="appointment_reminder">Appointment Reminders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredTasks.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-blue-600">{appointment.patientName}</span>
                            <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <span className="text-red-600">Dr. {appointment.doctorName}</span> • {appointment.department}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString() : 'No date'} • {appointment.appointmentTime || 'No time'}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">{appointment.appointmentTime || 'No time'}</div>
                      <div className="flex gap-1">
                        <Button size="sm" asChild>
                          <Link href={`/admin/telecaller/call-patient?patientId=${appointment.patientId}`}>
                            <Phone className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredTasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No appointments scheduled for today
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Calls & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <Link href="/telecaller/patient-search">
                  <Search className="mr-2 h-4 w-4" />
                  Search & Book Patient
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/telecaller/follow-ups">
                  <Clock className="mr-2 h-4 w-4" />
                  Manage Follow-ups
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/telecaller/compliance">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Compliance Tracking
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <Link href="/telecaller/pending-payments">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pending Payments
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Calls */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Calls</CardTitle>
              <CardDescription>Last 3 calls made</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockRecentCalls.map((call) => (
                  <div key={call.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <div className="font-medium">{call.patient}</div>
                      <div className="text-sm text-muted-foreground">{call.phone}</div>
                      <div className="text-xs text-muted-foreground mt-1">{call.notes}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">{call.time}</div>
                      <div className="text-xs text-muted-foreground">{call.duration}</div>
                      <Badge className={getOutcomeColor(call.outcome)} size="sm">
                        {call.outcome.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-3 bg-transparent" asChild>
                <Link href="/telecaller/call-history">View All Calls</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </PrivateRoute>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Calendar,
  Phone,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  FileText,
  Stethoscope,
  Bell,
  Activity,
  Heart,
  Thermometer,
  ArrowRight,
} from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function DoctorsDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const todayStats = {
    totalPatients: 24,
    consultationsCompleted: 18,
    emergencyCalls: 3,
    pendingTasks: 7,
  }

  const todaySchedule = [
    { id: 1, time: "09:00", patient: "John Smith", type: "Follow-up", status: "completed" },
    { id: 2, time: "09:30", patient: "Sarah Johnson", type: "New Patient", status: "completed" },
    { id: 3, time: "10:00", patient: "Mike Wilson", type: "Consultation", status: "in-progress" },
    { id: 4, time: "10:30", patient: "Emma Davis", type: "Follow-up", status: "scheduled" },
    { id: 5, time: "11:00", patient: "Robert Brown", type: "Emergency", status: "scheduled" },
    { id: 6, time: "11:30", patient: "Lisa Anderson", type: "Consultation", status: "scheduled" },
  ]

  const alerts = [
    {
      id: 1,
      type: "critical",
      message: "Critical lab result for John Smith - Troponin elevated",
      time: "10 min ago",
      patientId: 1,
    },
    {
      id: 2,
      type: "warning",
      message: "Patient Emma Davis has drug allergy to Penicillin",
      time: "25 min ago",
      patientId: 4,
    },
    {
      id: 3,
      type: "info",
      message: "Follow-up reminder: Mike Wilson due for BP check",
      time: "1 hour ago",
      patientId: 3,
    },
    { id: 4, type: "task", message: "Pending discharge summary for Sarah Johnson", time: "2 hours ago", patientId: 2 },
  ]

  const performanceMetrics = {
    patientSatisfaction: 4.8,
    averageConsultationTime: 18,
    noShowRate: 5.2,
    adherenceRate: 87.5,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "scheduled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-red-500 bg-red-50"
      case "warning":
        return "border-yellow-500 bg-yellow-50"
      case "info":
        return "border-blue-500 bg-blue-50"
      case "task":
        return "border-purple-500 bg-purple-50"
      default:
        return "border-gray-500 bg-gray-50"
    }
  }

  const handleAlertClick = (alert: any) => {
    if (alert.patientId) {
      router.push(`/doctors/patient/${alert.patientId}`)
    }
  }

  const handleScheduleClick = (appointment: any) => {
    router.push(`/doctors/patient/${appointment.id}`)
  }

  return (
    <PrivateRoute modulePath="admin/doctors" action="view">
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, Dr. Admin • {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/doctors/communications">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
          </Link>
          <Link href="/doctors/patient/new">
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </Link>
        </div>
      </div>

      {/* Today's Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Link href="/patients">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Patients</p>
                  <p className="text-3xl font-bold text-gray-900">{todayStats.totalPatients}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Consultations</p>
                <p className="text-3xl font-bold text-gray-900">{todayStats.consultationsCompleted}</p>
              </div>
              <Stethoscope className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Emergency Calls</p>
                <p className="text-3xl font-bold text-gray-900">{todayStats.emergencyCalls}</p>
              </div>
              <Phone className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Link href="/doctors/reports">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                  <p className="text-3xl font-bold text-gray-900">{todayStats.pendingTasks}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaySchedule.map((appointment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium text-gray-900 w-16">{appointment.time}</div>
                    <div>
                      <p className="font-medium text-gray-900">{appointment.patient}</p>
                      <p className="text-sm text-gray-600">{appointment.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(appointment.status)}>{appointment.status.replace("-", " ")}</Badge>
                    <Button size="sm" variant="outline" onClick={() => handleScheduleClick(appointment)}>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alerts & Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 border rounded-lg cursor-pointer hover:shadow-sm transition-shadow ${getAlertColor(alert.type)}`}
                  onClick={() => handleAlertClick(alert)}
                >
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-600 mt-1">{alert.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Heart className="h-6 w-6 text-red-500 mr-2" />
                <span className="text-2xl font-bold text-gray-900">{performanceMetrics.patientSatisfaction}</span>
                <span className="text-gray-600">/5.0</span>
              </div>
              <p className="text-sm text-gray-600">Patient Satisfaction</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-6 w-6 text-blue-500 mr-2" />
                <span className="text-2xl font-bold text-gray-900">{performanceMetrics.averageConsultationTime}</span>
                <span className="text-gray-600">min</span>
              </div>
              <p className="text-sm text-gray-600">Avg Consultation Time</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Activity className="h-6 w-6 text-green-500 mr-2" />
                <span className="text-2xl font-bold text-gray-900">{performanceMetrics.noShowRate}</span>
                <span className="text-gray-600">%</span>
              </div>
              <p className="text-sm text-gray-600">No-Show Rate</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-purple-500 mr-2" />
                <span className="text-2xl font-bold text-gray-900">{performanceMetrics.adherenceRate}</span>
                <span className="text-gray-600">%</span>
              </div>
              <p className="text-sm text-gray-600">Adherence Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/doctors/patient/new">
              <Button variant="outline" className="h-20 flex-col bg-transparent w-full">
                <FileText className="h-6 w-6 mb-2" />
                New Clinical Note
              </Button>
            </Link>
            <Link href="/patients">
              <Button variant="outline" className="h-20 flex-col bg-transparent w-full">
                <Users className="h-6 w-6 mb-2" />
                Patient Search
              </Button>
            </Link>
            <Link href="/queue">
              <Button variant="outline" className="h-20 flex-col bg-transparent w-full">
                <Calendar className="h-6 w-6 mb-2" />
                Schedule Appointment
              </Button>
            </Link>
            <Link href="/vitals">
              <Button variant="outline" className="h-20 flex-col bg-transparent w-full">
                <Thermometer className="h-6 w-6 mb-2" />
                View Vitals
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      </div>
    </PrivateRoute>
  )
}

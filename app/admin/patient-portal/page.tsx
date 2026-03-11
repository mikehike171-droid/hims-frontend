"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  FileText,
  CreditCard,
  Download,
  Bell,
  Clock,
  Pill,
  TestTube,
  Heart,
  User,
  Shield,
  MessageCircle,
  BarChart3,
  Settings,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Stethoscope,
} from "lucide-react"
import Link from "next/link"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function PatientPortalDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedProfile, setSelectedProfile] = useState("self")

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Mock patient data
  const patientData = {
    name: "Rajesh Kumar",
    patientId: "P001234",
    phone: "+91-9876543210",
    email: "rajesh.kumar@email.com",
    profileImage: "/placeholder.svg?height=40&width=40",
    dependents: [
      { id: "dep1", name: "Priya Kumar", relation: "Spouse", age: 32 },
      { id: "dep2", name: "Arjun Kumar", relation: "Son", age: 8 },
    ],
  }

  const todaysAppointments = [
    {
      id: "apt1",
      time: "10:30 AM",
      doctor: "Dr. Sarah Wilson",
      department: "Cardiology",
      type: "Follow-up",
      status: "confirmed",
      tokenNumber: "C-15",
      estimatedWait: "25 mins",
    },
    {
      id: "apt2",
      time: "3:00 PM",
      doctor: "Dr. Michael Chen",
      department: "Orthopedics",
      type: "Consultation",
      status: "pending",
      tokenNumber: "O-08",
      estimatedWait: "45 mins",
    },
  ]

  const pendingBills = [
    {
      id: "bill1",
      date: "2024-01-15",
      amount: 2850,
      type: "Consultation",
      status: "pending",
      dueDate: "2024-01-20",
    },
    {
      id: "bill2",
      date: "2024-01-12",
      amount: 1200,
      type: "Lab Tests",
      status: "overdue",
      dueDate: "2024-01-18",
    },
  ]

  const recentReports = [
    {
      id: "rep1",
      name: "Blood Test - Complete",
      date: "2024-01-14",
      type: "Lab Report",
      status: "ready",
      critical: false,
    },
    {
      id: "rep2",
      name: "ECG Report",
      date: "2024-01-13",
      type: "Diagnostic",
      status: "ready",
      critical: true,
    },
  ]

  const medicationReminders = [
    {
      id: "med1",
      name: "Metformin 500mg",
      time: "8:00 AM",
      status: "pending",
      frequency: "Twice daily",
    },
    {
      id: "med2",
      name: "Lisinopril 10mg",
      time: "9:00 AM",
      status: "taken",
      frequency: "Once daily",
    },
  ]

  const followUpsDue = [
    {
      id: "fu1",
      doctor: "Dr. Sarah Wilson",
      department: "Cardiology",
      dueDate: "2024-01-25",
      type: "Routine Follow-up",
      priority: "medium",
    },
  ]

  return (
    <PrivateRoute modulePath="admin/patient-portal" action="view">
      <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 -mx-6 -mt-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/images/pranam-logo.png" alt="Pranam HMS" className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Patient Portal</h1>
              <p className="text-sm text-gray-600">Welcome back, {patientData.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Profile Selector */}
            <select
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="self">My Profile</option>
              {patientData.dependents.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.name} ({dep.relation})
                </option>
              ))}
            </select>

            {/* Notifications */}
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4" />
              <Badge className="ml-1 bg-red-500">3</Badge>
            </Button>

            {/* Profile */}
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={patientData.profileImage || "/placeholder.svg"} />
                <AvatarFallback>RK</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">{patientData.name}</p>
                <p className="text-gray-500">ID: {patientData.patientId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/patient-portal/appointments/book">
                <Button className="w-full h-20 flex flex-col gap-2 bg-blue-600 hover:bg-blue-700">
                  <Calendar className="h-6 w-6" />
                  <span className="text-sm">Book Appointment</span>
                </Button>
              </Link>

              <Link href="/patient-portal/prescriptions">
                <Button className="w-full h-20 flex flex-col gap-2 bg-green-600 hover:bg-green-700">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">View Prescriptions</span>
                </Button>
              </Link>

              <Link href="/patient-portal/bills">
                <Button className="w-full h-20 flex flex-col gap-2 bg-orange-600 hover:bg-orange-700">
                  <CreditCard className="h-6 w-6" />
                  <span className="text-sm">Pay Bills</span>
                </Button>
              </Link>

              <Link href="/patient-portal/reports">
                <Button className="w-full h-20 flex flex-col gap-2 bg-purple-600 hover:bg-purple-700">
                  <Download className="h-6 w-6" />
                  <span className="text-sm">Download Reports</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Today's Appointments
                </span>
                <Badge variant="outline">{todaysAppointments.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaysAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{apt.time}</span>
                      <Badge variant={apt.status === "confirmed" ? "default" : "secondary"}>{apt.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {apt.doctor} - {apt.department}
                    </p>
                    <p className="text-xs text-gray-500">
                      Token: {apt.tokenNumber} • Wait: {apt.estimatedWait}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              ))}

              <Link href="/patient-portal/appointments">
                <Button variant="outline" className="w-full bg-transparent">
                  View All Appointments
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pending Bills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-orange-600" />
                  Pending Bills
                </span>
                <Badge variant="outline" className="text-orange-600">
                  ₹{pendingBills.reduce((sum, bill) => sum + bill.amount, 0)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingBills.map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">₹{bill.amount}</span>
                      <Badge variant={bill.status === "overdue" ? "destructive" : "secondary"}>{bill.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {bill.type} - {bill.date}
                    </p>
                    <p className="text-xs text-gray-500">Due: {bill.dueDate}</p>
                  </div>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    Pay Now
                  </Button>
                </div>
              ))}

              <Link href="/patient-portal/bills">
                <Button variant="outline" className="w-full bg-transparent">
                  View All Bills
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5 text-purple-600" />
                Recent Reports & Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{report.name}</span>
                      {report.critical && <AlertCircle className="h-4 w-4 text-red-500" />}
                    </div>
                    <p className="text-sm text-gray-600">
                      {report.type} - {report.date}
                    </p>
                    <Badge variant="outline" className="text-green-600 mt-1">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Ready
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Link href="/patient-portal/reports">
                <Button variant="outline" className="w-full bg-transparent">
                  View All Reports
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Medication Reminders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-green-600" />
                Today's Medications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {medicationReminders.map((med) => (
                <div key={med.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{med.name}</span>
                      <Badge variant={med.status === "taken" ? "default" : "secondary"}>{med.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {med.time} - {med.frequency}
                    </p>
                  </div>
                  {med.status === "pending" && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Mark Taken
                    </Button>
                  )}
                </div>
              ))}

              <Link href="/patient-portal/medications">
                <Button variant="outline" className="w-full bg-transparent">
                  View All Medications
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Follow-ups Due */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-blue-600" />
              Follow-ups Due
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {followUpsDue.map((followUp) => (
                <div key={followUp.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{followUp.doctor}</span>
                      <Badge variant="outline">{followUp.priority}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {followUp.department} - {followUp.type}
                    </p>
                    <p className="text-xs text-gray-500">Due: {followUp.dueDate}</p>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Book Now
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Menu */}
        <Card>
          <CardHeader>
            <CardTitle>All Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Link
                href="/patient-portal/appointments"
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <Calendar className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium">Appointments</span>
              </Link>

              <Link
                href="/patient-portal/prescriptions"
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <FileText className="h-8 w-8 text-green-600 mb-2" />
                <span className="text-sm font-medium">Prescriptions</span>
              </Link>

              <Link
                href="/patient-portal/pharmacy"
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <Pill className="h-8 w-8 text-orange-600 mb-2" />
                <span className="text-sm font-medium">Pharmacy</span>
              </Link>

              <Link
                href="/patient-portal/lab-reports"
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <TestTube className="h-8 w-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium">Lab Reports</span>
              </Link>

              <Link
                href="/patient-portal/bills"
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <CreditCard className="h-8 w-8 text-red-600 mb-2" />
                <span className="text-sm font-medium">Bills & Payments</span>
              </Link>

              <Link
                href="/patient-portal/health-history"
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <Heart className="h-8 w-8 text-pink-600 mb-2" />
                <span className="text-sm font-medium">Health History</span>
              </Link>

              <Link
                href="/patient-portal/analytics"
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <BarChart3 className="h-8 w-8 text-indigo-600 mb-2" />
                <span className="text-sm font-medium">Health Analytics</span>
              </Link>

              <Link
                href="/patient-portal/support"
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <MessageCircle className="h-8 w-8 text-teal-600 mb-2" />
                <span className="text-sm font-medium">Support</span>
              </Link>

              <Link
                href="/patient-portal/notifications"
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <Bell className="h-8 w-8 text-yellow-600 mb-2" />
                <span className="text-sm font-medium">Notifications</span>
              </Link>

              <Link
                href="/patient-portal/consent"
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <Shield className="h-8 w-8 text-gray-600 mb-2" />
                <span className="text-sm font-medium">Privacy & Consent</span>
              </Link>

              <Link
                href="/patient-portal/profile"
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <User className="h-8 w-8 text-blue-500 mb-2" />
                <span className="text-sm font-medium">Profile</span>
              </Link>

              <Link
                href="/patient-portal/settings"
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50"
              >
                <Settings className="h-8 w-8 text-gray-500 mb-2" />
                <span className="text-sm font-medium">Settings</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </PrivateRoute>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Users, AlertTriangle, CheckCircle, Phone, CreditCard, XCircle, Tv, ExternalLink } from "lucide-react"
import Link from "next/link"
import PrivateRoute from "@/components/auth/PrivateRoute"

const departmentQueues = {
  cardiology: [
    {
      tokenNumber: "C001",
      patientName: "John Doe",
      patientId: "P001234",
      department: "Cardiology",
      doctor: "Dr. Rajesh Kumar",
      priority: "High",
      estimatedWait: 5,
      status: "waiting",
      phone: "+91-9876543210",
      paymentStatus: "paid",
      billAmount: 800,
      appointmentTime: "09:30",
      vitalsCompleted: true,
      hasCriticalVitals: false,
    },
    {
      tokenNumber: "C002",
      patientName: "Sarah Wilson",
      patientId: "P001238",
      department: "Cardiology",
      doctor: "Dr. Rajesh Kumar",
      priority: "Normal",
      estimatedWait: 25,
      status: "waiting",
      phone: "+91-9876543213",
      paymentStatus: "pending",
      billAmount: 800,
      appointmentTime: "10:00",
      vitalsCompleted: false,
      hasCriticalVitals: false,
    },
  ],
  orthopedics: [
    {
      tokenNumber: "O001",
      patientName: "Jane Smith",
      patientId: "P001235",
      department: "Orthopedics",
      doctor: "Dr. Priya Sharma",
      priority: "Normal",
      estimatedWait: 15,
      status: "waiting",
      phone: "+91-9876543211",
      paymentStatus: "paid",
      billAmount: 700,
      appointmentTime: "09:00",
      vitalsCompleted: true,
      hasCriticalVitals: false,
    },
    {
      tokenNumber: "O002",
      patientName: "Robert Brown",
      patientId: "P001239",
      department: "Orthopedics",
      doctor: "Dr. Priya Sharma",
      priority: "High",
      estimatedWait: 10,
      status: "called",
      phone: "+91-9876543214",
      paymentStatus: "paid",
      billAmount: 700,
      appointmentTime: "09:30",
      vitalsCompleted: true,
      hasCriticalVitals: true,
    },
  ],
  general: [
    {
      tokenNumber: "G001",
      patientName: "Mike Johnson",
      patientId: "P001236",
      department: "General Medicine",
      doctor: "Dr. Amit Singh",
      priority: "Emergency",
      estimatedWait: 0,
      status: "called",
      phone: "+91-9876543212",
      paymentStatus: "paid",
      billAmount: 500,
      appointmentTime: "Emergency",
      vitalsCompleted: true,
      hasCriticalVitals: true,
    },
    {
      tokenNumber: "G002",
      patientName: "Lisa Davis",
      patientId: "P001240",
      department: "General Medicine",
      doctor: "Dr. Amit Singh",
      priority: "Normal",
      estimatedWait: 20,
      status: "waiting",
      phone: "+91-9876543215",
      paymentStatus: "pending",
      billAmount: 500,
      appointmentTime: "10:30",
      vitalsCompleted: false,
      hasCriticalVitals: false,
    },
  ],
  pediatrics: [
    {
      tokenNumber: "P001",
      patientName: "Emma Thompson",
      patientId: "P001241",
      department: "Pediatrics",
      doctor: "Dr. Sunita Patel",
      priority: "Normal",
      estimatedWait: 12,
      status: "waiting",
      phone: "+91-9876543216",
      paymentStatus: "paid",
      billAmount: 600,
      appointmentTime: "11:00",
      vitalsCompleted: false,
      hasCriticalVitals: false,
    },
  ],
  emergency: [
    {
      tokenNumber: "E001",
      patientName: "David Wilson",
      patientId: "P001242",
      department: "Emergency",
      doctor: "Dr. Emergency",
      priority: "Emergency",
      estimatedWait: 0,
      status: "in-progress",
      phone: "+91-9876543217",
      paymentStatus: "pending",
      billAmount: 1000,
      appointmentTime: "Immediate",
      vitalsCompleted: true,
      hasCriticalVitals: true,
    },
  ],
}

export default function QueueManagement() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [activeTab, setActiveTab] = useState("cardiology")

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const getAllPatients = () => {
    return Object.values(departmentQueues).flat()
  }

  const getTotalStats = () => {
    const allPatients = getAllPatients()
    return {
      totalWaiting: allPatients.filter((p) => p.status === "waiting").length,
      emergency: allPatients.filter((p) => p.priority === "Emergency").length,
      avgWaitTime: Math.round(allPatients.reduce((acc, p) => acc + p.estimatedWait, 0) / allPatients.length),
      completedToday: 187,
      pendingPayments: allPatients.filter((p) => p.paymentStatus === "pending").length,
    }
  }

  const stats = getTotalStats()

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Emergency":
        return "bg-red-100 text-red-800 border-red-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Normal":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-100 text-yellow-800"
      case "called":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-red-100 text-red-800"
      case "partial":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderPatientCard = (patient: any) => (
    <div key={patient.tokenNumber} className="p-4 border rounded-lg hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{patient.tokenNumber}</div>
            <Badge className={getStatusColor(patient.status)}>
              {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
            </Badge>
          </div>
          <div>
            <h3 className="font-semibold text-lg">{patient.patientName}</h3>
            <p className="text-sm text-gray-600">ID: {patient.patientId}</p>
            <p className="text-sm text-gray-600">Doctor: {patient.doctor}</p>
            <p className="text-sm text-gray-600">Time: {patient.appointmentTime}</p>
          </div>
        </div>

        <div className="text-right space-y-2">
          <div className="flex gap-2">
            <Badge className={getPriorityColor(patient.priority)}>{patient.priority}</Badge>
            <Badge className={getPaymentStatusColor(patient.paymentStatus)}>
              {patient.paymentStatus === "paid" ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Paid
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  Pending
                </>
              )}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            Est. Wait: {patient.estimatedWait}m
          </div>
          <div className="text-sm font-medium">₹{patient.billAmount}</div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Call Next
            </Button>
            <Button size="sm" variant="outline">
              <Phone className="h-4 w-4" />
            </Button>
            {patient.paymentStatus === "pending" && (
              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                <CreditCard className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        {patient.vitalsCompleted ? (
          <Badge variant="default" className="flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            Vitals Complete
          </Badge>
        ) : (
          <Badge variant="secondary" className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Vitals Pending
          </Badge>
        )}

        {patient.hasCriticalVitals && (
          <Badge variant="destructive" className="flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Critical Vitals
          </Badge>
        )}
      </div>

      {patient.vitalsCompleted && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
          <p className="font-medium">Latest Vitals:</p>
          <div className="grid grid-cols-2 gap-1 mt-1">
            <span>Temp: 38.2°C ⚠️</span>
            <span>BP: 160/95 ⚠️</span>
            <span>HR: 105 bpm ⚠️</span>
            <span>SpO2: 94% ⚠️</span>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <PrivateRoute modulePath="admin/queue" action="view">
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Queue Management</h1>
          <p className="text-gray-600">Department-wise patient queues with payment tracking</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-red-600">{currentTime.toLocaleTimeString()}</p>
          <p className="text-sm text-gray-500">Live Queue Status</p>
        </div>
      </div>

      {/* TV Display Banner */}
      <Card className="border-4 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="bg-blue-600 text-white rounded-2xl p-6">
                <Tv className="h-16 w-16" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Queue Display for TV Screens</h2>
                <p className="text-lg text-gray-700 mb-4">
                  View all departments and available doctors on a single screen - Perfect for waiting areas
                </p>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    All Departments
                  </Badge>
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    Live Doctor Status
                  </Badge>
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    Real-time Updates
                  </Badge>
                </div>
              </div>
            </div>
            <a href="/admin/queue/display" target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white text-xl px-8 py-6 h-auto"
              >
                <Tv className="h-6 w-6 mr-3" />
                Open Queue Display
                <ExternalLink className="h-6 w-6 ml-3" />
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Queue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Waiting</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalWaiting}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Emergency Cases</p>
                <p className="text-2xl font-bold text-red-600">{stats.emergency}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Wait Time</p>
                <p className="text-2xl font-bold text-orange-600">{stats.avgWaitTime}m</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedToday}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-red-600">{stats.pendingPayments}</p>
              </div>
              <CreditCard className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department-wise Queue Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Department-wise Queues</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="cardiology">Cardiology ({departmentQueues.cardiology.length})</TabsTrigger>
              <TabsTrigger value="orthopedics">Orthopedics ({departmentQueues.orthopedics.length})</TabsTrigger>
              <TabsTrigger value="general">General ({departmentQueues.general.length})</TabsTrigger>
              <TabsTrigger value="pediatrics">Pediatrics ({departmentQueues.pediatrics.length})</TabsTrigger>
              <TabsTrigger value="emergency">Emergency ({departmentQueues.emergency.length})</TabsTrigger>
            </TabsList>

            {Object.entries(departmentQueues).map(([dept, patients]) => (
              <TabsContent key={dept} value={dept} className="space-y-4 mt-6">
                {patients.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No patients in queue for {dept.charAt(0).toUpperCase() + dept.slice(1)}
                  </div>
                ) : (
                  patients.map(renderPatientCard)
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">AI Queue Optimization & Payment Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-white rounded border border-red-200">
              <p className="font-medium text-red-800">Payment Alert</p>
              <p className="text-sm text-red-600">
                3 patients have pending payments. Consider processing before consultation.
              </p>
            </div>
            <div className="p-3 bg-white rounded border border-blue-200">
              <p className="font-medium text-blue-800">Queue Optimization</p>
              <p className="text-sm text-blue-600">
                Dr. Rajesh Kumar is running 15 minutes behind. Consider redistributing C002 to available slot.
              </p>
            </div>
            <div className="p-3 bg-white rounded border border-orange-200">
              <p className="font-medium text-orange-800">Priority Suggestion</p>
              <p className="text-sm text-orange-600">
                Patient G002 shows symptoms requiring immediate attention. Consider upgrading priority.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </PrivateRoute>
  )
}

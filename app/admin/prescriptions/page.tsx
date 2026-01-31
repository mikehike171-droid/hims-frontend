"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  FileText,
  History,
  Plus,
  LayoutTemplateIcon as Template,
  Clock,
  Users,
  AlertTriangle,
  Search,
  Phone,
  CreditCard,
  CheckCircle,
  XCircle,
  Stethoscope,
} from "lucide-react"
import Link from "next/link"
import PrivateRoute from "@/components/auth/PrivateRoute"

const patientQueue = [
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
    age: 45,
    gender: "Male",
    chiefComplaint: "Chest pain, shortness of breath",
    lastVisit: "2024-01-15",
    vitals: {
      temperature: "36.8°C",
      bloodPressure: "140/90",
      heartRate: "88 bpm",
      oxygenSaturation: "96%",
    },
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
    age: 38,
    gender: "Female",
    chiefComplaint: "Palpitations, fatigue",
    lastVisit: "2024-01-10",
    vitals: null,
  },
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
    age: 52,
    gender: "Female",
    chiefComplaint: "Knee pain, difficulty walking",
    lastVisit: "2024-01-12",
    vitals: {
      temperature: "37.1°C",
      bloodPressure: "130/85",
      heartRate: "72 bpm",
      oxygenSaturation: "98%",
    },
  },
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
    age: 35,
    gender: "Male",
    chiefComplaint: "High fever, severe headache",
    lastVisit: "2024-01-08",
    vitals: {
      temperature: "39.2°C",
      bloodPressure: "160/95",
      heartRate: "105 bpm",
      oxygenSaturation: "94%",
    },
  },
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
    age: 8,
    gender: "Female",
    chiefComplaint: "Cough, runny nose",
    lastVisit: "2024-01-05",
    vitals: null,
  },
  {
    tokenNumber: "C003",
    patientName: "Robert Brown",
    patientId: "P001239",
    department: "Cardiology",
    doctor: "Dr. Rajesh Kumar",
    priority: "High",
    estimatedWait: 30,
    status: "waiting",
    phone: "+91-9876543214",
    paymentStatus: "paid",
    billAmount: 800,
    appointmentTime: "10:30",
    vitalsCompleted: true,
    hasCriticalVitals: true,
    age: 62,
    gender: "Male",
    chiefComplaint: "Irregular heartbeat, dizziness",
    lastVisit: "2024-01-18",
    vitals: {
      temperature: "36.9°C",
      bloodPressure: "180/110",
      heartRate: "45 bpm",
      oxygenSaturation: "92%",
    },
  },
  {
    tokenNumber: "G002",
    patientName: "Lisa Davis",
    patientId: "P001240",
    department: "General Medicine",
    doctor: "Dr. Amit Singh",
    priority: "Normal",
    estimatedWait: 35,
    status: "waiting",
    phone: "+91-9876543215",
    paymentStatus: "pending",
    billAmount: 500,
    appointmentTime: "10:30",
    vitalsCompleted: false,
    hasCriticalVitals: false,
    age: 29,
    gender: "Female",
    chiefComplaint: "Stomach pain, nausea",
    lastVisit: "2024-01-14",
    vitals: null,
  },
  {
    tokenNumber: "O002",
    patientName: "David Wilson",
    patientId: "P001242",
    department: "Orthopedics",
    doctor: "Dr. Priya Sharma",
    priority: "Normal",
    estimatedWait: 40,
    status: "waiting",
    phone: "+91-9876543217",
    paymentStatus: "paid",
    billAmount: 700,
    appointmentTime: "11:30",
    vitalsCompleted: true,
    hasCriticalVitals: false,
    age: 41,
    gender: "Male",
    chiefComplaint: "Back pain, muscle stiffness",
    lastVisit: "2024-01-16",
    vitals: {
      temperature: "36.7°C",
      bloodPressure: "125/80",
      heartRate: "68 bpm",
      oxygenSaturation: "99%",
    },
  },
  {
    tokenNumber: "G003",
    patientName: "Maria Garcia",
    patientId: "P001243",
    department: "General Medicine",
    doctor: "Dr. Amit Singh",
    priority: "Normal",
    estimatedWait: 45,
    status: "waiting",
    phone: "+91-9876543218",
    paymentStatus: "paid",
    billAmount: 500,
    appointmentTime: "12:00",
    vitalsCompleted: false,
    hasCriticalVitals: false,
    age: 33,
    gender: "Female",
    chiefComplaint: "Headache, fatigue",
    lastVisit: "2024-01-11",
    vitals: null,
  },
  {
    tokenNumber: "C004",
    patientName: "James Anderson",
    patientId: "P001244",
    department: "Cardiology",
    doctor: "Dr. Rajesh Kumar",
    priority: "Normal",
    estimatedWait: 50,
    status: "waiting",
    phone: "+91-9876543219",
    paymentStatus: "pending",
    billAmount: 800,
    appointmentTime: "12:30",
    vitalsCompleted: true,
    hasCriticalVitals: false,
    age: 56,
    gender: "Male",
    chiefComplaint: "Chest discomfort, anxiety",
    lastVisit: "2024-01-09",
    vitals: {
      temperature: "36.6°C",
      bloodPressure: "135/88",
      heartRate: "78 bpm",
      oxygenSaturation: "97%",
    },
  },
]

export default function PrescriptionsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredQueue = patientQueue.filter(
    (patient) =>
      patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSelectPatient = (patient: any) => {
    // Store selected patient in localStorage or state management
    localStorage.setItem("selectedPatient", JSON.stringify(patient))
    router.push("/prescriptions/create")
  }

  return (
    <PrivateRoute modulePath="admin/prescriptions" action="view">
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">E-Prescription System</h1>
          <p className="text-gray-600">Digital prescription management with AI assistance</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-red-600">{new Date().toLocaleTimeString()}</p>
          <p className="text-sm text-gray-500">Live Queue Status</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/prescriptions/create">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-red-200 hover:border-red-300">
            <CardContent className="p-6 text-center">
              <Plus className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800">Create Prescription</h3>
              <p className="text-sm text-red-600 mt-2">Start new digital prescription</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/prescriptions/history">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-blue-200 hover:border-blue-300">
            <CardContent className="p-6 text-center">
              <History className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-blue-800">Prescription History</h3>
              <p className="text-sm text-blue-600 mt-2">View past prescriptions</p>
            </CardContent>
          </Card>
        </Link>

        <Card className="hover:shadow-md transition-shadow cursor-pointer border-green-200 hover:border-green-300">
          <CardContent className="p-6 text-center">
            <Template className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800">Templates</h3>
            <p className="text-sm text-green-600 mt-2">Manage prescription templates</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer border-purple-200 hover:border-purple-300">
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-purple-800">Reports</h3>
            <p className="text-sm text-purple-600 mt-2">Prescription analytics</p>
          </CardContent>
        </Card>
      </div>

      {/* Patient Queue Section */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-blue-800">
              <Users className="h-6 w-6 mr-2" />
              Patient Queue - Next 10 Patients
            </CardTitle>
            <Badge className="bg-blue-600 text-white">{filteredQueue.length} Patients Waiting</Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search patients by name, ID, or token..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredQueue.slice(0, 10).map((patient) => (
              <Card
                key={patient.tokenNumber}
                className="hover:shadow-md transition-all duration-200 border-l-4 border-l-red-500"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{patient.tokenNumber}</div>
                        <Badge className={getStatusColor(patient.status)} variant="secondary">
                          {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{patient.patientName}</h3>
                          <Badge variant="outline">
                            {patient.age}Y {patient.gender}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">ID: {patient.patientId}</p>
                        <p className="text-sm text-gray-600 mb-1">Dept: {patient.department}</p>
                        <p className="text-sm text-gray-600 mb-2">Time: {patient.appointmentTime}</p>
                        <p className="text-sm font-medium text-gray-800 mb-2">
                          Chief Complaint: {patient.chiefComplaint}
                        </p>

                        {/* Vitals Display */}
                        {patient.vitalsCompleted && patient.vitals ? (
                          <div className="bg-gray-50 p-2 rounded text-xs mb-2">
                            <p className="font-medium mb-1 flex items-center">
                              <Stethoscope className="h-3 w-3 mr-1" />
                              Latest Vitals:
                            </p>
                            <div className="grid grid-cols-2 gap-1">
                              <span>Temp: {patient.vitals.temperature}</span>
                              <span>BP: {patient.vitals.bloodPressure}</span>
                              <span>HR: {patient.vitals.heartRate}</span>
                              <span>SpO2: {patient.vitals.oxygenSaturation}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-yellow-50 p-2 rounded text-xs mb-2">
                            <p className="text-yellow-800 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Vitals Pending
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <div className="flex gap-1 flex-col">
                        <Badge className={getPriorityColor(patient.priority)} variant="outline">
                          {patient.priority}
                        </Badge>
                        <Badge className={getPaymentStatusColor(patient.paymentStatus)} variant="outline">
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
                        Wait: {patient.estimatedWait}m
                      </div>
                      <div className="text-sm font-medium">₹{patient.billAmount}</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-3">
                    <Button
                      onClick={() => handleSelectPatient(patient)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                      size="sm"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Create Prescription
                    </Button>
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                    {patient.paymentStatus === "pending" && (
                      <Button size="sm" variant="outline">
                        <CreditCard className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Critical Alerts */}
                  {patient.hasCriticalVitals && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                      <div className="flex items-center text-red-800">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">Critical Vitals Alert</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredQueue.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No patients found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">John Doe - Hypertension</p>
                <p className="text-sm text-gray-600">RX001234 | Today, 2:30 PM</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  View
                </Button>
                <Button size="sm" variant="outline">
                  Resend
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Jane Smith - Upper Respiratory Infection</p>
                <p className="text-sm text-gray-600">RX001235 | Today, 1:15 PM</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  View
                </Button>
                <Button size="sm" variant="outline">
                  Resend
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Mike Johnson - Diabetes Management</p>
                <p className="text-sm text-gray-600">RX001236 | Yesterday, 4:45 PM</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  View
                </Button>
                <Button size="sm" variant="outline">
                  Resend
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">24</p>
              <p className="text-sm text-gray-600">Today's Prescriptions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">156</p>
              <p className="text-sm text-gray-600">This Week</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">89%</p>
              <p className="text-sm text-gray-600">Digital Delivery</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">12</p>
              <p className="text-sm text-gray-600">Active Templates</p>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </PrivateRoute>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Stethoscope,
  Thermometer,
  Heart,
  Activity,
  AlertTriangle,
  Mic,
  MicOff,
  Save,
  Search,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Users,
  Clock,
  Phone,
  CreditCard,
  CheckCircle,
  XCircle,
} from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"

interface VitalSigns {
  temperature: string
  bloodPressureSystolic: string
  bloodPressureDiastolic: string
  heartRate: string
  respiratoryRate: string
  oxygenSaturation: string
  weight: string
  height: string
  bloodGlucose: string
  painScale: string
}

interface Allergy {
  id: string
  type: string
  allergen: string
  severity: string
  reaction: string
}

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
    vitalsCompleted: false,
    hasCriticalVitals: false,
    age: 45,
    gender: "Male",
    chiefComplaint: "Chest pain, shortness of breath",
    lastVisit: "2024-01-15",
    room: "101A",
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
    room: "102B",
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
    room: "103A",
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
    vitalsCompleted: false,
    hasCriticalVitals: false,
    age: 35,
    gender: "Male",
    chiefComplaint: "High fever, severe headache",
    lastVisit: "2024-01-08",
    room: "104B",
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
    room: "105A",
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
    vitalsCompleted: false,
    hasCriticalVitals: false,
    age: 62,
    gender: "Male",
    chiefComplaint: "Irregular heartbeat, dizziness",
    lastVisit: "2024-01-18",
    room: "106B",
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
    room: "107A",
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
    vitalsCompleted: false,
    hasCriticalVitals: false,
    age: 41,
    gender: "Male",
    chiefComplaint: "Back pain, muscle stiffness",
    lastVisit: "2024-01-16",
    room: "108B",
  },
]

export default function NurseVitals() {
  const [selectedPatient, setSelectedPatient] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [vitals, setVitals] = useState<VitalSigns>({
    temperature: "",
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    heartRate: "",
    respiratoryRate: "",
    oxygenSaturation: "",
    weight: "",
    height: "",
    bloodGlucose: "",
    painScale: "",
  })
  const [allergies, setAllergies] = useState<Allergy[]>([])
  const [newAllergy, setNewAllergy] = useState({
    type: "",
    allergen: "",
    severity: "",
    reaction: "",
  })
  const [nursingNotes, setNursingNotes] = useState("")
  const [voiceTranscript, setVoiceTranscript] = useState("")
  const [aiAlerts, setAiAlerts] = useState<any[]>([])

  const filteredQueue = patientQueue.filter(
    (patient) =>
      patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.tokenNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const vitalRanges = {
    temperature: { normal: [36.1, 37.2], critical: [35.0, 40.0], unit: "°C" },
    heartRate: { normal: [60, 100], critical: [40, 150], unit: "bpm" },
    systolicBP: { normal: [90, 140], critical: [70, 180], unit: "mmHg" },
    diastolicBP: { normal: [60, 90], critical: [40, 110], unit: "mmHg" },
    respiratoryRate: { normal: [12, 20], critical: [8, 30], unit: "/min" },
    oxygenSaturation: { normal: [95, 100], critical: [85, 100], unit: "%" },
    bloodGlucose: { normal: [70, 140], critical: [40, 400], unit: "mg/dL" },
  }

  // AI Analysis of vitals
  useEffect(() => {
    if (selectedPatient && Object.values(vitals).some((v) => v !== "")) {
      analyzeVitals()
    }
  }, [vitals, selectedPatient])

  const analyzeVitals = () => {
    const alerts = []

    // Temperature analysis
    if (vitals.temperature) {
      const temp = Number.parseFloat(vitals.temperature)
      if (temp < 35.0 || temp > 40.0) {
        alerts.push({
          type: "critical",
          vital: "Temperature",
          value: temp,
          message: temp < 35.0 ? "Hypothermia - Critical" : "Hyperthermia - Critical",
          action: "Immediate medical attention required",
        })
      } else if (temp < 36.1 || temp > 37.2) {
        alerts.push({
          type: "warning",
          vital: "Temperature",
          value: temp,
          message: temp < 36.1 ? "Below normal temperature" : "Elevated temperature",
          action: "Monitor closely and reassess",
        })
      }
    }

    // Heart Rate analysis
    if (vitals.heartRate) {
      const hr = Number.parseInt(vitals.heartRate)
      if (hr < 40 || hr > 150) {
        alerts.push({
          type: "critical",
          vital: "Heart Rate",
          value: hr,
          message: hr < 40 ? "Severe Bradycardia" : "Severe Tachycardia",
          action: "Immediate cardiac assessment required",
        })
      } else if (hr < 60 || hr > 100) {
        alerts.push({
          type: "warning",
          vital: "Heart Rate",
          value: hr,
          message: hr < 60 ? "Bradycardia" : "Tachycardia",
          action: "Continue monitoring",
        })
      }
    }

    // Blood Pressure analysis
    if (vitals.bloodPressureSystolic && vitals.bloodPressureDiastolic) {
      const systolic = Number.parseInt(vitals.bloodPressureSystolic)
      const diastolic = Number.parseInt(vitals.bloodPressureDiastolic)

      if (systolic > 180 || diastolic > 110) {
        alerts.push({
          type: "critical",
          vital: "Blood Pressure",
          value: `${systolic}/${diastolic}`,
          message: "Hypertensive Crisis",
          action: "Immediate intervention required",
        })
      } else if (systolic < 70 || diastolic < 40) {
        alerts.push({
          type: "critical",
          vital: "Blood Pressure",
          value: `${systolic}/${diastolic}`,
          message: "Severe Hypotension",
          action: "Check for shock, consider IV fluids",
        })
      }
    }

    // Oxygen Saturation analysis
    if (vitals.oxygenSaturation) {
      const spo2 = Number.parseFloat(vitals.oxygenSaturation)
      if (spo2 < 85) {
        alerts.push({
          type: "critical",
          vital: "Oxygen Saturation",
          value: spo2,
          message: "Severe Hypoxemia",
          action: "Oxygen therapy required immediately",
        })
      } else if (spo2 < 95) {
        alerts.push({
          type: "warning",
          vital: "Oxygen Saturation",
          value: spo2,
          message: "Mild Hypoxemia",
          action: "Consider oxygen supplementation",
        })
      }
    }

    setAiAlerts(alerts)
  }

  const startVoiceRecording = () => {
    setIsRecording(true)
    // Simulate voice recognition
    setTimeout(() => {
      setVoiceTranscript(
        "Patient appears alert and oriented. Temperature taken orally, blood pressure measured on right arm. Patient reports pain level of 3 out of 10. No acute distress observed.",
      )
      setIsRecording(false)
    }, 3000)
  }

  const stopVoiceRecording = () => {
    setIsRecording(false)
  }

  const addAllergy = () => {
    if (newAllergy.allergen && newAllergy.type) {
      const allergy: Allergy = {
        id: Date.now().toString(),
        ...newAllergy,
      }
      setAllergies([...allergies, allergy])
      setNewAllergy({ type: "", allergen: "", severity: "", reaction: "" })
    }
  }

  const removeAllergy = (id: string) => {
    setAllergies(allergies.filter((a) => a.id !== id))
  }

  const calculateBMI = () => {
    if (vitals.weight && vitals.height) {
      const weight = Number.parseFloat(vitals.weight)
      const height = Number.parseFloat(vitals.height) / 100 // convert cm to m
      const bmi = weight / (height * height)
      return bmi.toFixed(1)
    }
    return ""
  }

  const getVitalStatus = (vital: string, value: string) => {
    if (!value) return "normal"

    const numValue = Number.parseFloat(value)
    let range

    switch (vital) {
      case "temperature":
        range = vitalRanges.temperature
        break
      case "heartRate":
        range = vitalRanges.heartRate
        break
      case "oxygenSaturation":
        range = vitalRanges.oxygenSaturation
        break
      default:
        return "normal"
    }

    if (numValue < range.critical[0] || numValue > range.critical[1]) {
      return "critical"
    } else if (numValue < range.normal[0] || numValue > range.normal[1]) {
      return "warning"
    }
    return "normal"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case "warning":
        return <TrendingUp className="h-4 w-4 text-orange-600" />
      default:
        return <Minus className="h-4 w-4 text-green-600" />
    }
  }

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
    setSelectedPatient(patient.patientId)
    // Auto-scroll to vitals section
    setTimeout(() => {
      document.getElementById("vitals-section")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const saveVitals = () => {
    // Simulate saving vitals
    alert("Vitals saved successfully!")
  }

  return (
    <PrivateRoute modulePath="admin/vitals" action="view">
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nurse Vitals</h1>
          <p className="text-gray-600">Record patient vitals, allergies, and nursing assessments</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={saveVitals} className="bg-red-600 hover:bg-red-700">
            <Save className="h-4 w-4 mr-2" />
            Save Vitals
          </Button>
        </div>
      </div>

      {/* Patient Queue Section */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-green-800">
              <Users className="h-6 w-6 mr-2" />
              Patient Queue - Select Patient for Vitals
            </CardTitle>
            <Badge className="bg-green-600 text-white">{filteredQueue.length} Patients Waiting</Badge>
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
                className="hover:shadow-md transition-all duration-200 border-l-4 border-l-green-500"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{patient.tokenNumber}</div>
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
                        <p className="text-sm text-gray-600 mb-1">Room: {patient.room}</p>
                        <p className="text-sm text-gray-600 mb-1">Dept: {patient.department}</p>
                        <p className="text-sm text-gray-600 mb-2">Time: {patient.appointmentTime}</p>
                        <p className="text-sm font-medium text-gray-800 mb-2">
                          Chief Complaint: {patient.chiefComplaint}
                        </p>

                        {/* Vitals Status */}
                        {patient.vitalsCompleted ? (
                          <Badge variant="default" className="flex items-center w-fit">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Vitals Complete
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="flex items-center w-fit">
                            <Clock className="h-3 w-3 mr-1" />
                            Vitals Pending
                          </Badge>
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
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <Stethoscope className="h-4 w-4 mr-1" />
                      Record Vitals
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

      {/* Manual Patient Selection (Fallback) */}
      <Card id="vitals-section">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2 text-red-600" />
            Manual Patient Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedPatient} onValueChange={setSelectedPatient}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Or manually search and select patient..." />
            </SelectTrigger>
            <SelectContent>
              {patientQueue.map((patient) => (
                <SelectItem key={patient.patientId} value={patient.patientId}>
                  {patient.patientName} - {patient.patientId} - Room {patient.room}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedPatient && (
        <>
          {/* AI Alerts */}
          {aiAlerts.length > 0 && (
            <div className="space-y-2">
              {aiAlerts.map((alert, index) => (
                <Alert
                  key={index}
                  className={alert.type === "critical" ? "border-red-500 bg-red-50" : "border-orange-500 bg-orange-50"}
                >
                  <AlertTriangle
                    className={`h-4 w-4 ${alert.type === "critical" ? "text-red-600" : "text-orange-600"}`}
                  />
                  <AlertDescription>
                    <div className="flex justify-between items-start">
                      <div>
                        <p
                          className={`font-semibold ${alert.type === "critical" ? "text-red-800" : "text-orange-800"}`}
                        >
                          {alert.message}
                        </p>
                        <p className={`text-sm ${alert.type === "critical" ? "text-red-600" : "text-orange-600"}`}>
                          {alert.vital}: {alert.value} - {alert.action}
                        </p>
                      </div>
                      <Badge variant={alert.type === "critical" ? "destructive" : "secondary"}>
                        {alert.type.toUpperCase()}
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          <Tabs defaultValue="vitals" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
              <TabsTrigger value="allergies">Allergies</TabsTrigger>
              <TabsTrigger value="assessment">Nursing Assessment</TabsTrigger>
            </TabsList>

            {/* Vital Signs Tab */}
            <TabsContent value="vitals">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Primary Vitals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Stethoscope className="h-5 w-5 mr-2 text-red-600" />
                      Primary Vital Signs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="flex items-center">
                          <Thermometer className="h-4 w-4 mr-1" />
                          Temperature (°C)
                          {getStatusIcon(getVitalStatus("temperature", vitals.temperature))}
                        </Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={vitals.temperature}
                          onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                          placeholder="36.5"
                        />
                      </div>
                      <div>
                        <Label className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          Heart Rate (bpm)
                          {getStatusIcon(getVitalStatus("heartRate", vitals.heartRate))}
                        </Label>
                        <Input
                          type="number"
                          value={vitals.heartRate}
                          onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                          placeholder="72"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Blood Pressure (mmHg)</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={vitals.bloodPressureSystolic}
                            onChange={(e) => setVitals({ ...vitals, bloodPressureSystolic: e.target.value })}
                            placeholder="120"
                          />
                          <span className="flex items-center">/</span>
                          <Input
                            type="number"
                            value={vitals.bloodPressureDiastolic}
                            onChange={(e) => setVitals({ ...vitals, bloodPressureDiastolic: e.target.value })}
                            placeholder="80"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="flex items-center">
                          <Activity className="h-4 w-4 mr-1" />
                          Respiratory Rate (/min)
                        </Label>
                        <Input
                          type="number"
                          value={vitals.respiratoryRate}
                          onChange={(e) => setVitals({ ...vitals, respiratoryRate: e.target.value })}
                          placeholder="16"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="flex items-center">
                          O₂ Saturation (%)
                          {getStatusIcon(getVitalStatus("oxygenSaturation", vitals.oxygenSaturation))}
                        </Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={vitals.oxygenSaturation}
                          onChange={(e) => setVitals({ ...vitals, oxygenSaturation: e.target.value })}
                          placeholder="98"
                        />
                      </div>
                      <div>
                        <Label>Pain Scale (0-10)</Label>
                        <Select
                          value={vitals.painScale}
                          onValueChange={(value) => setVitals({ ...vitals, painScale: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select pain level" />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} - {num === 0 ? "No Pain" : num <= 3 ? "Mild" : num <= 6 ? "Moderate" : "Severe"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Secondary Measurements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Physical Measurements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Weight (kg)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={vitals.weight}
                          onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                          placeholder="70.0"
                        />
                      </div>
                      <div>
                        <Label>Height (cm)</Label>
                        <Input
                          type="number"
                          value={vitals.height}
                          onChange={(e) => setVitals({ ...vitals, height: e.target.value })}
                          placeholder="170"
                        />
                      </div>
                    </div>

                    {calculateBMI() && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">Calculated BMI: {calculateBMI()}</p>
                        <p className="text-xs text-blue-600">
                          {Number.parseFloat(calculateBMI()) < 18.5
                            ? "Underweight"
                            : Number.parseFloat(calculateBMI()) < 25
                              ? "Normal"
                              : Number.parseFloat(calculateBMI()) < 30
                                ? "Overweight"
                                : "Obese"}
                        </p>
                      </div>
                    )}

                    <div>
                      <Label>Blood Glucose (mg/dL)</Label>
                      <Input
                        type="number"
                        value={vitals.bloodGlucose}
                        onChange={(e) => setVitals({ ...vitals, bloodGlucose: e.target.value })}
                        placeholder="100"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Allergies Tab */}
            <TabsContent value="allergies">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Allergy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Allergy Type</Label>
                        <Select
                          value={newAllergy.type}
                          onValueChange={(value) => setNewAllergy({ ...newAllergy, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="drug">Drug</SelectItem>
                            <SelectItem value="food">Food</SelectItem>
                            <SelectItem value="environmental">Environmental</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Severity</Label>
                        <Select
                          value={newAllergy.severity}
                          onValueChange={(value) => setNewAllergy({ ...newAllergy, severity: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mild">Mild</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="severe">Severe</SelectItem>
                            <SelectItem value="life-threatening">Life-threatening</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Allergen</Label>
                      <Input
                        value={newAllergy.allergen}
                        onChange={(e) => setNewAllergy({ ...newAllergy, allergen: e.target.value })}
                        placeholder="e.g., Penicillin, Peanuts, Latex"
                      />
                    </div>
                    <div>
                      <Label>Reaction</Label>
                      <Textarea
                        value={newAllergy.reaction}
                        onChange={(e) => setNewAllergy({ ...newAllergy, reaction: e.target.value })}
                        placeholder="Describe the allergic reaction..."
                      />
                    </div>
                    <Button onClick={addAllergy} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Allergy
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Current Allergies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {allergies.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No allergies recorded</p>
                    ) : (
                      <div className="space-y-3">
                        {allergies.map((allergy) => (
                          <div key={allergy.id} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{allergy.type}</Badge>
                                  <Badge
                                    variant={
                                      allergy.severity === "life-threatening"
                                        ? "destructive"
                                        : allergy.severity === "severe"
                                          ? "destructive"
                                          : allergy.severity === "moderate"
                                            ? "secondary"
                                            : "outline"
                                    }
                                  >
                                    {allergy.severity}
                                  </Badge>
                                </div>
                                <h4 className="font-semibold mt-1">{allergy.allergen}</h4>
                                <p className="text-sm text-gray-600">{allergy.reaction}</p>
                              </div>
                              <Button size="sm" variant="outline" onClick={() => removeAllergy(allergy.id)}>
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Nursing Assessment Tab */}
            <TabsContent value="assessment">
              <Card>
                <CardHeader>
                  <CardTitle>Nursing Assessment & Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Voice Recording */}
                  <div className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">Voice-to-Text Notes</h3>
                      <Button
                        onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                        variant={isRecording ? "destructive" : "outline"}
                        size="sm"
                      >
                        {isRecording ? (
                          <>
                            <MicOff className="h-4 w-4 mr-2" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className="h-4 w-4 mr-2" />
                            Start Recording
                          </>
                        )}
                      </Button>
                    </div>
                    {isRecording && (
                      <div className="flex items-center gap-2 text-red-600">
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                        <span className="text-sm">Recording... Speak clearly</span>
                      </div>
                    )}
                    {voiceTranscript && (
                      <div className="mt-3 p-3 bg-white border rounded">
                        <p className="text-sm">{voiceTranscript}</p>
                      </div>
                    )}
                  </div>

                  {/* Assessment Categories */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>General Appearance</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select appearance" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="well-appearing">Well-appearing</SelectItem>
                          <SelectItem value="ill-appearing">Ill-appearing</SelectItem>
                          <SelectItem value="distressed">In distress</SelectItem>
                          <SelectItem value="lethargic">Lethargic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Consciousness Level</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select consciousness" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alert">Alert & Oriented</SelectItem>
                          <SelectItem value="drowsy">Drowsy</SelectItem>
                          <SelectItem value="confused">Confused</SelectItem>
                          <SelectItem value="unconscious">Unconscious</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Mobility Status</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mobility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ambulatory">Ambulatory</SelectItem>
                          <SelectItem value="wheelchair">Wheelchair</SelectItem>
                          <SelectItem value="bedbound">Bedbound</SelectItem>
                          <SelectItem value="assisted">Assisted mobility</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Fall Risk Score (0-10)</Label>
                      <Input type="number" min="0" max="10" placeholder="0" />
                    </div>
                  </div>

                  {/* Nursing Notes */}
                  <div>
                    <Label>Nursing Notes</Label>
                    <Textarea
                      value={nursingNotes}
                      onChange={(e) => setNursingNotes(e.target.value)}
                      placeholder="Enter detailed nursing assessment notes..."
                      rows={6}
                    />
                  </div>

                  {/* Care Plan */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nursing Diagnosis</Label>
                      <Textarea placeholder="Enter nursing diagnosis..." rows={3} />
                    </div>
                    <div>
                      <Label>Care Plan & Interventions</Label>
                      <Textarea placeholder="Enter care plan and interventions..." rows={3} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
      </div>
    </PrivateRoute>
  )
}

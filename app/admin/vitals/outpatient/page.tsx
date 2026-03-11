"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Stethoscope,
  Thermometer,
  Heart,
  Activity,
  AlertTriangle,
  Mic,
  MicOff,
  Save,
  TrendingUp,
  CheckCircle,
  Clock,
  User,
  ArrowRight,
} from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { prescriptionApi } from "@/lib/prescriptionApi"
import { toast } from "@/components/ui/use-toast"

interface OutpatientVitals {
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

interface QueuePatient {
  id: string
  patientId: string
  tokenNumber: string
  patientName: string
  age: number
  department: string
  doctor: string
  appointmentTime: string
  vitalsCompleted: boolean
  hasCriticalVitals: boolean
  paymentStatus: string
}

export default function OutpatientVitals() {
  const [selectedPatient, setSelectedPatient] = useState<QueuePatient | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [vitals, setVitals] = useState<OutpatientVitals>({
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
  const [nursingNotes, setNursingNotes] = useState("")
  const [voiceTranscript, setVoiceTranscript] = useState("")
  const [aiAlerts, setAiAlerts] = useState<any[]>([])
  const [workflowStep, setWorkflowStep] = useState("vitals_pending")

  // Mock queue data - patients waiting for vitals
  const queuePatients: QueuePatient[] = [
    {
      id: "1",
      patientId: "P001234",
      tokenNumber: "C001",
      patientName: "John Doe",
      age: 35,
      department: "Cardiology",
      doctor: "Dr. Rajesh Kumar",
      appointmentTime: "09:30",
      vitalsCompleted: false,
      hasCriticalVitals: false,
      paymentStatus: "paid",
    },
    {
      id: "2",
      patientId: "P001235",
      tokenNumber: "O001",
      patientName: "Jane Smith",
      age: 42,
      department: "Orthopedics",
      doctor: "Dr. Priya Sharma",
      appointmentTime: "10:00",
      vitalsCompleted: true,
      hasCriticalVitals: true,
      paymentStatus: "paid",
    },
    {
      id: "3",
      patientId: "P001236",
      tokenNumber: "G001",
      patientName: "Mike Johnson",
      age: 28,
      department: "General Medicine",
      doctor: "Dr. Amit Singh",
      appointmentTime: "10:30",
      vitalsCompleted: false,
      hasCriticalVitals: false,
      paymentStatus: "paid",
    },
  ]

  const vitalRanges = {
    temperature: { normal: [36.1, 37.2], warning: [37.3, 38.0], critical: [38.1, 42.0], unit: "°C" },
    heartRate: { normal: [60, 100], warning: [50, 120], critical: [40, 150], unit: "bpm" },
    systolicBP: { normal: [90, 139], warning: [140, 159], critical: [160, 200], unit: "mmHg" },
    diastolicBP: { normal: [60, 89], warning: [90, 99], critical: [100, 120], unit: "mmHg" },
    respiratoryRate: { normal: [12, 20], warning: [8, 24], critical: [6, 30], unit: "/min" },
    oxygenSaturation: { normal: [95, 100], warning: [90, 94], critical: [85, 89], unit: "%" },
    bloodGlucose: { normal: [70, 140], warning: [141, 200], critical: [201, 400], unit: "mg/dL" },
  }

  // AI Analysis of vitals with enhanced outpatient focus
  useEffect(() => {
    if (selectedPatient && Object.values(vitals).some((v) => v !== "")) {
      analyzeOutpatientVitals()
    }
  }, [vitals, selectedPatient])

  const analyzeOutpatientVitals = () => {
    const alerts = []
    let hasCritical = false

    // Temperature analysis
    if (vitals.temperature) {
      const temp = Number.parseFloat(vitals.temperature)
      if (temp >= 38.1) {
        hasCritical = true
        alerts.push({
          type: "critical",
          vital: "Temperature",
          value: temp,
          message: "High Fever - Requires Immediate Attention",
          action: "Consider fever management, investigate underlying cause, may need priority consultation",
          doctorAlert: true,
        })
      } else if (temp >= 37.3) {
        alerts.push({
          type: "warning",
          vital: "Temperature",
          value: temp,
          message: "Elevated Temperature",
          action: "Monitor closely, inform doctor during consultation",
          doctorAlert: true,
        })
      } else if (temp < 36.0) {
        alerts.push({
          type: "warning",
          vital: "Temperature",
          value: temp,
          message: "Low Temperature",
          action: "Check patient comfort, consider warming measures",
          doctorAlert: true,
        })
      }
    }

    // Blood Pressure analysis with outpatient context
    if (vitals.bloodPressureSystolic && vitals.bloodPressureDiastolic) {
      const systolic = Number.parseInt(vitals.bloodPressureSystolic)
      const diastolic = Number.parseInt(vitals.bloodPressureDiastolic)

      if (systolic >= 180 || diastolic >= 110) {
        hasCritical = true
        alerts.push({
          type: "critical",
          vital: "Blood Pressure",
          value: `${systolic}/${diastolic}`,
          message: "Hypertensive Crisis - Immediate Medical Attention Required",
          action: "Move patient to priority queue, notify doctor immediately, consider emergency protocols",
          doctorAlert: true,
        })
      } else if (systolic >= 160 || diastolic >= 100) {
        alerts.push({
          type: "warning",
          vital: "Blood Pressure",
          value: `${systolic}/${diastolic}`,
          message: "Stage 2 Hypertension",
          action: "Recheck BP in 5 minutes, ensure patient is calm, inform doctor",
          doctorAlert: true,
        })
      } else if (systolic >= 140 || diastolic >= 90) {
        alerts.push({
          type: "warning",
          vital: "Blood Pressure",
          value: `${systolic}/${diastolic}`,
          message: "Stage 1 Hypertension",
          action: "Document for doctor review, check patient history",
          doctorAlert: true,
        })
      } else if (systolic < 90 || diastolic < 60) {
        alerts.push({
          type: "warning",
          vital: "Blood Pressure",
          value: `${systolic}/${diastolic}`,
          message: "Hypotension",
          action: "Check for symptoms of dizziness, ensure patient safety",
          doctorAlert: true,
        })
      }
    }

    // Heart Rate analysis
    if (vitals.heartRate) {
      const hr = Number.parseInt(vitals.heartRate)
      if (hr > 120 || hr < 50) {
        if (hr > 150 || hr < 40) {
          hasCritical = true
          alerts.push({
            type: "critical",
            vital: "Heart Rate",
            value: hr,
            message: hr < 40 ? "Severe Bradycardia" : "Severe Tachycardia",
            action: "Immediate cardiac assessment required, consider ECG",
            doctorAlert: true,
          })
        } else {
          alerts.push({
            type: "warning",
            vital: "Heart Rate",
            value: hr,
            message: hr < 60 ? "Bradycardia" : "Tachycardia",
            action: "Monitor patient, check for symptoms, inform doctor",
            doctorAlert: true,
          })
        }
      }
    }

    // Oxygen Saturation analysis
    if (vitals.oxygenSaturation) {
      const spo2 = Number.parseFloat(vitals.oxygenSaturation)
      if (spo2 < 90) {
        hasCritical = true
        alerts.push({
          type: "critical",
          vital: "Oxygen Saturation",
          value: spo2,
          message: "Severe Hypoxemia - Oxygen Therapy Required",
          action: "Apply oxygen immediately, notify doctor, consider priority consultation",
          doctorAlert: true,
        })
      } else if (spo2 < 95) {
        alerts.push({
          type: "warning",
          vital: "Oxygen Saturation",
          value: spo2,
          message: "Mild Hypoxemia",
          action: "Monitor breathing, check for respiratory distress, inform doctor",
          doctorAlert: true,
        })
      }
    }

    setAiAlerts(alerts)

    // Update workflow step based on critical findings
    if (hasCritical) {
      setWorkflowStep("critical_vitals_priority")
    } else if (alerts.length > 0) {
      setWorkflowStep("abnormal_vitals_attention")
    } else {
      setWorkflowStep("normal_vitals_ready")
    }
  }

  const startVoiceRecording = () => {
    setIsRecording(true)
    setTimeout(() => {
      setVoiceTranscript(
        "Patient appears comfortable and alert. Vitals taken as per protocol. Patient reports feeling well today with no specific complaints. No acute distress observed.",
      )
      setIsRecording(false)
    }, 3000)
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
      case "systolicBP":
        range = vitalRanges.systolicBP
        break
      case "diastolicBP":
        range = vitalRanges.diastolicBP
        break
      case "oxygenSaturation":
        range = vitalRanges.oxygenSaturation
        break
      default:
        return "normal"
    }

    if (numValue >= range.critical[0] && numValue <= range.critical[1]) {
      return "critical"
    } else if (numValue >= range.warning[0] && numValue <= range.warning[1]) {
      return "warning"
    }
    return "normal"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "border-red-500 bg-red-50 text-red-700"
      case "warning":
        return "border-orange-500 bg-orange-50 text-orange-700"
      default:
        return "border-green-500 bg-green-50 text-green-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "warning":
        return <TrendingUp className="h-4 w-4 text-orange-600" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-600" />
    }
  }

  const saveVitalsAndUpdateWorkflow = async () => {
    if (!selectedPatient) return

    console.log('Save button clicked, selectedPatient:', selectedPatient);

    try {
      // Prepare vitals data for API
      const vitalsData = {
        patientId: 1, // Use a valid patient ID - you'll need to replace this with actual patient selection
        vitalsTemperature: vitals.temperature ? parseFloat(vitals.temperature) : undefined,
        vitalsBloodPressure: vitals.bloodPressureSystolic && vitals.bloodPressureDiastolic 
          ? `${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic}` 
          : undefined,
        vitalsHeartRate: vitals.heartRate ? parseInt(vitals.heartRate) : undefined,
        vitalsO2Saturation: vitals.oxygenSaturation ? parseFloat(vitals.oxygenSaturation) : undefined,
        vitalsRespiratoryRate: vitals.respiratoryRate ? parseInt(vitals.respiratoryRate) : undefined,
        vitalsWeight: vitals.weight ? parseFloat(vitals.weight) : undefined,
        vitalsHeight: vitals.height ? parseInt(vitals.height) : undefined,
        vitalsBloodGlucose: vitals.bloodGlucose ? parseInt(vitals.bloodGlucose) : undefined,
        vitalsPainScale: vitals.painScale ? parseInt(vitals.painScale) : undefined,
        nursingNotes: nursingNotes.trim() || voiceTranscript.trim() || undefined,
      }

      console.log('Vitals data to send:', vitalsData);

      // Save vitals to database
      console.log('Calling prescriptionApi.saveVitals...');
      const result = await prescriptionApi.saveVitals(vitalsData);
      console.log('API response:', result);

      const hasCritical = aiAlerts.some((alert) => alert.type === "critical")

      toast({
        title: "Success",
        description: `All vitals saved successfully for ${selectedPatient.patientName}!${hasCritical ? " Critical vitals detected - Patient moved to priority queue" : " Patient ready for doctor consultation"}`
      })

      // Reset form
      setVitals({
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
      setNursingNotes("")
      setVoiceTranscript("")
      setSelectedPatient(null)
      setAiAlerts([])
    } catch (error: any) {
      console.error('Error saving vitals:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to save vitals",
        variant: "destructive"
      })
    }
  }

  return (
    <PrivateRoute modulePath="admin/vitals/outpatient" action="view">
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Outpatient Vitals</h1>
          <p className="text-gray-600">Record vitals for outpatient consultations</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {queuePatients.filter((p) => !p.vitalsCompleted).length} Pending
          </Badge>
          {selectedPatient && (
            <Button onClick={saveVitalsAndUpdateWorkflow} className="bg-red-600 hover:bg-red-700">
              <Save className="h-4 w-4 mr-2" />
              Complete Vitals
            </Button>
          )}
        </div>
      </div>

      {/* Patient Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2 text-red-600" />
            Outpatient Queue - Vitals Pending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {queuePatients.map((patient) => (
              <div
                key={patient.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedPatient?.id === patient.id
                    ? "border-red-500 bg-red-50"
                    : patient.vitalsCompleted
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 hover:border-red-300 hover:bg-gray-50"
                }`}
                onClick={() => !patient.vitalsCompleted && setSelectedPatient(patient)}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="font-mono">
                    {patient.tokenNumber}
                  </Badge>
                  <div className="flex gap-1">
                    {patient.vitalsCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {patient.hasCriticalVitals && <AlertTriangle className="h-4 w-4 text-red-600" />}
                  </div>
                </div>
                <h3 className="font-semibold">{patient.patientName}</h3>
                <p className="text-sm text-gray-600">
                  Age: {patient.age} | {patient.patientId}
                </p>
                <p className="text-sm text-gray-600">{patient.department}</p>
                <p className="text-sm text-gray-600">Dr. {patient.doctor}</p>
                <p className="text-sm text-gray-600">Time: {patient.appointmentTime}</p>
                <div className="mt-2">
                  <Badge
                    variant={
                      patient.vitalsCompleted ? (patient.hasCriticalVitals ? "destructive" : "default") : "secondary"
                    }
                  >
                    {patient.vitalsCompleted
                      ? patient.hasCriticalVitals
                        ? "Critical Vitals"
                        : "Vitals Complete"
                      : "Vitals Pending"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedPatient && (
        <>
          {/* Current Patient Info */}
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-red-800">Recording Vitals: {selectedPatient.patientName}</h2>
                  <p className="text-red-600">
                    Token: {selectedPatient.tokenNumber} | {selectedPatient.department} | Dr. {selectedPatient.doctor}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-red-600" />
                  <Badge variant="outline">Ready for Doctor</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

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
                          🚨 {alert.message}
                        </p>
                        <p className={`text-sm ${alert.type === "critical" ? "text-red-600" : "text-orange-600"}`}>
                          {alert.vital}: {alert.value} - {alert.action}
                        </p>
                        {alert.doctorAlert && (
                          <p className="text-xs mt-1 font-medium">📋 Doctor will be notified of this finding</p>
                        )}
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

          {/* Vitals Recording */}
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
                    <Label className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4" />
                      Temperature (°C)
                      {getStatusIcon(getVitalStatus("temperature", vitals.temperature))}
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={vitals.temperature}
                      onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                      placeholder="36.5"
                      className={getStatusColor(getVitalStatus("temperature", vitals.temperature))}
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Heart Rate (bpm)
                      {getStatusIcon(getVitalStatus("heartRate", vitals.heartRate))}
                    </Label>
                    <Input
                      type="number"
                      value={vitals.heartRate}
                      onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                      placeholder="72"
                      className={getStatusColor(getVitalStatus("heartRate", vitals.heartRate))}
                    />
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    Blood Pressure (mmHg)
                    {(getVitalStatus("systolicBP", vitals.bloodPressureSystolic) === "critical" ||
                      getVitalStatus("diastolicBP", vitals.bloodPressureDiastolic) === "critical") && (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={vitals.bloodPressureSystolic}
                      onChange={(e) => setVitals({ ...vitals, bloodPressureSystolic: e.target.value })}
                      placeholder="120"
                      className={getStatusColor(getVitalStatus("systolicBP", vitals.bloodPressureSystolic))}
                    />
                    <span className="flex items-center text-lg font-bold">/</span>
                    <Input
                      type="number"
                      value={vitals.bloodPressureDiastolic}
                      onChange={(e) => setVitals({ ...vitals, bloodPressureDiastolic: e.target.value })}
                      placeholder="80"
                      className={getStatusColor(getVitalStatus("diastolicBP", vitals.bloodPressureDiastolic))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Respiratory Rate (/min)
                    </Label>
                    <Input
                      type="number"
                      value={vitals.respiratoryRate}
                      onChange={(e) => setVitals({ ...vitals, respiratoryRate: e.target.value })}
                      placeholder="16"
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      O₂ Saturation (%)
                      {getStatusIcon(getVitalStatus("oxygenSaturation", vitals.oxygenSaturation))}
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={vitals.oxygenSaturation}
                      onChange={(e) => setVitals({ ...vitals, oxygenSaturation: e.target.value })}
                      placeholder="98"
                      className={getStatusColor(getVitalStatus("oxygenSaturation", vitals.oxygenSaturation))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                  <div>
                    <Label>Blood Glucose (mg/dL)</Label>
                    <Input
                      type="number"
                      value={vitals.bloodGlucose}
                      onChange={(e) => setVitals({ ...vitals, bloodGlucose: e.target.value })}
                      placeholder="100"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Physical Measurements & Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Physical Measurements & Notes</CardTitle>
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

                <Separator />

                {/* Voice Recording */}
                <div className="p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-medium">Voice Notes</Label>
                    <Button
                      onClick={isRecording ? () => setIsRecording(false) : startVoiceRecording}
                      variant={isRecording ? "destructive" : "outline"}
                      size="sm"
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="h-4 w-4 mr-2" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4 mr-2" />
                          Record
                        </>
                      )}
                    </Button>
                  </div>
                  {isRecording && (
                    <div className="flex items-center gap-2 text-red-600 mb-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                      <span className="text-sm">Recording...</span>
                    </div>
                  )}
                  {voiceTranscript && <div className="p-2 bg-white border rounded text-sm">{voiceTranscript}</div>}
                </div>

                <div>
                  <Label>Additional Nursing Notes</Label>
                  <Textarea
                    value={nursingNotes}
                    onChange={(e) => setNursingNotes(e.target.value)}
                    placeholder="Enter any additional observations or notes..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
      </div>
    </PrivateRoute>
  )
}

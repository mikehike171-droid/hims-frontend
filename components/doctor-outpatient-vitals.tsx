"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Thermometer, Heart, Activity, AlertTriangle, TrendingUp, Eye, Clock, CheckCircle, User } from "lucide-react"

interface DoctorOutpatientVitalsProps {
  patientId: string
  patientName: string
  tokenNumber: string
  department: string
}

export default function DoctorOutpatientVitals({
  patientId,
  patientName,
  tokenNumber,
  department,
}: DoctorOutpatientVitalsProps) {
  // Mock data - in real app, this would come from API
  const patientVitals = {
    recordedAt: "2024-01-20 10:15",
    recordedBy: "Nurse Sarah Johnson",
    temperature: 38.2,
    bloodPressureSystolic: 160,
    bloodPressureDiastolic: 95,
    heartRate: 105,
    respiratoryRate: 22,
    oxygenSaturation: 94,
    weight: 72.5,
    height: 170,
    bmi: 25.1,
    bloodGlucose: 110,
    painScale: 3,
    nursingNotes:
      "Patient appears alert but slightly uncomfortable. Reports feeling warm and mild headache. No acute distress observed. Patient cooperative during vital sign measurement.",
  }

  const criticalAlerts = [
    {
      type: "warning",
      vital: "Temperature",
      value: "38.2°C",
      message: "Elevated Temperature - Fever Present",
      recommendation: "Consider fever management, investigate underlying cause",
      priority: "high",
    },
    {
      type: "warning",
      vital: "Blood Pressure",
      value: "160/95 mmHg",
      message: "Stage 2 Hypertension",
      recommendation: "Assess cardiovascular risk factors, consider antihypertensive therapy",
      priority: "high",
    },
    {
      type: "warning",
      vital: "Heart Rate",
      value: "105 bpm",
      message: "Mild Tachycardia",
      recommendation: "Monitor for underlying causes, may be related to fever",
      priority: "medium",
    },
    {
      type: "warning",
      vital: "Oxygen Saturation",
      value: "94%",
      message: "Borderline Low Oxygen Saturation",
      recommendation: "Monitor respiratory status, consider pulse oximetry trending",
      priority: "medium",
    },
  ]

  const getVitalStatusColor = (vital: string, value: number) => {
    switch (vital) {
      case "temperature":
        if (value >= 38.1) return "border-red-500 bg-red-50 text-red-700"
        if (value >= 37.3) return "border-orange-500 bg-orange-50 text-orange-700"
        return "border-green-500 bg-green-50 text-green-700"
      case "heartRate":
        if (value > 120 || value < 50) return "border-red-500 bg-red-50 text-red-700"
        if (value > 100 || value < 60) return "border-orange-500 bg-orange-50 text-orange-700"
        return "border-green-500 bg-green-50 text-green-700"
      case "bloodPressure":
        const systolic = patientVitals.bloodPressureSystolic
        const diastolic = patientVitals.bloodPressureDiastolic
        if (systolic >= 180 || diastolic >= 110) return "border-red-500 bg-red-50 text-red-700"
        if (systolic >= 140 || diastolic >= 90) return "border-orange-500 bg-orange-50 text-orange-700"
        return "border-green-500 bg-green-50 text-green-700"
      case "oxygenSaturation":
        if (value < 90) return "border-red-500 bg-red-50 text-red-700"
        if (value < 95) return "border-orange-500 bg-orange-50 text-orange-700"
        return "border-green-500 bg-green-50 text-green-700"
      default:
        return "border-gray-300 bg-gray-50 text-gray-700"
    }
  }

  const getVitalIcon = (vital: string, value: number) => {
    const status = getVitalStatusColor(vital, value)
    if (status.includes("red")) return <AlertTriangle className="h-4 w-4 text-red-600" />
    if (status.includes("orange")) return <TrendingUp className="h-4 w-4 text-orange-600" />
    return <CheckCircle className="h-4 w-4 text-green-600" />
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>
      case "medium":
        return <Badge variant="secondary">Medium Priority</Badge>
      default:
        return <Badge variant="outline">Low Priority</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Patient Vitals - {patientName} ({tokenNumber})
          </h2>
          <p className="text-gray-600">
            {department} | Recorded: {patientVitals.recordedAt} by {patientVitals.recordedBy}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            Doctor Review
          </Badge>
          <Badge variant="destructive" className="flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            {criticalAlerts.length} Alerts
          </Badge>
        </div>
      </div>

      {/* Critical Alerts */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-red-800 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Clinical Alerts & Recommendations
        </h3>
        {criticalAlerts.map((alert, index) => (
          <Alert key={index} className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-red-800">{alert.message}</p>
                    {getPriorityBadge(alert.priority)}
                  </div>
                  <p className="text-sm text-red-600 mb-1">
                    <strong>{alert.vital}:</strong> {alert.value}
                  </p>
                  <p className="text-sm text-red-700">
                    <strong>Recommendation:</strong> {alert.recommendation}
                  </p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Vitals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Thermometer className="h-5 w-5 mr-2 text-red-600" />
              Current Vital Signs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {/* Temperature */}
              <div
                className={`p-4 rounded-lg border-2 ${getVitalStatusColor("temperature", patientVitals.temperature)}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Temperature</p>
                    <p className="text-2xl font-bold">{patientVitals.temperature}°C</p>
                    <p className="text-xs">Normal: 36.1-37.2°C</p>
                  </div>
                  <div className="flex flex-col items-center">
                    {getVitalIcon("temperature", patientVitals.temperature)}
                    <Thermometer className="h-6 w-6 mt-1" />
                  </div>
                </div>
              </div>

              {/* Heart Rate */}
              <div className={`p-4 rounded-lg border-2 ${getVitalStatusColor("heartRate", patientVitals.heartRate)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Heart Rate</p>
                    <p className="text-2xl font-bold">{patientVitals.heartRate} bpm</p>
                    <p className="text-xs">Normal: 60-100 bpm</p>
                  </div>
                  <div className="flex flex-col items-center">
                    {getVitalIcon("heartRate", patientVitals.heartRate)}
                    <Heart className="h-6 w-6 mt-1" />
                  </div>
                </div>
              </div>

              {/* Blood Pressure */}
              <div className={`p-4 rounded-lg border-2 ${getVitalStatusColor("bloodPressure", 0)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Blood Pressure</p>
                    <p className="text-2xl font-bold">
                      {patientVitals.bloodPressureSystolic}/{patientVitals.bloodPressureDiastolic}
                    </p>
                    <p className="text-xs">Normal: &lt;140/90 mmHg</p>
                  </div>
                  <div className="flex flex-col items-center">
                    {getVitalIcon("bloodPressure", 0)}
                    <Activity className="h-6 w-6 mt-1" />
                  </div>
                </div>
              </div>

              {/* Oxygen Saturation */}
              <div
                className={`p-4 rounded-lg border-2 ${getVitalStatusColor("oxygenSaturation", patientVitals.oxygenSaturation)}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">O₂ Saturation</p>
                    <p className="text-2xl font-bold">{patientVitals.oxygenSaturation}%</p>
                    <p className="text-xs">Normal: ≥95%</p>
                  </div>
                  <div className="flex flex-col items-center">
                    {getVitalIcon("oxygenSaturation", patientVitals.oxygenSaturation)}
                    <Activity className="h-6 w-6 mt-1" />
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Additional Vitals */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-gray-600">Respiratory Rate</p>
                <p className="font-bold text-lg">{patientVitals.respiratoryRate}/min</p>
                <p className="text-xs text-gray-500">Normal: 12-20</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-gray-600">Pain Scale</p>
                <p className="font-bold text-lg">{patientVitals.painScale}/10</p>
                <p className="text-xs text-gray-500">
                  {patientVitals.painScale <= 3 ? "Mild" : patientVitals.painScale <= 6 ? "Moderate" : "Severe"}
                </p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded">
                <p className="text-gray-600">BMI</p>
                <p className="font-bold text-lg">{patientVitals.bmi}</p>
                <p className="text-xs text-gray-500">
                  {patientVitals.bmi < 18.5
                    ? "Underweight"
                    : patientVitals.bmi < 25
                      ? "Normal"
                      : patientVitals.bmi < 30
                        ? "Overweight"
                        : "Obese"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nursing Assessment & Actions */}
        <div className="space-y-6">
          {/* Nursing Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Nursing Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-800 font-medium">Nursing Observations:</p>
                  <p className="text-sm text-blue-700 mt-1">{patientVitals.nursingNotes}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Weight</p>
                    <p className="font-semibold">{patientVitals.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Height</p>
                    <p className="font-semibold">{patientVitals.height} cm</p>
                  </div>
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
              <div className="space-y-2">
                <Button className="w-full bg-transparent" variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Request Vital Recheck
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  <Activity className="h-4 w-4 mr-2" />
                  Order ECG
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  <Thermometer className="h-4 w-4 mr-2" />
                  Fever Management Protocol
                </Button>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Escalate to Senior Doctor
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Thermometer, Heart, Activity, AlertTriangle, TrendingUp, TrendingDown, Eye, Clock } from "lucide-react"

interface VitalsViewerProps {
  patientId: string
  patientName: string
}

export default function VitalsViewer({ patientId, patientName }: VitalsViewerProps) {
  // Mock data - in real app, this would come from API
  const latestVitals = {
    recordedAt: "2024-01-20 14:30",
    recordedBy: "Nurse Sarah Johnson",
    temperature: 37.8,
    bloodPressure: "140/90",
    heartRate: 95,
    respiratoryRate: 18,
    oxygenSaturation: 96,
    weight: 72.5,
    height: 170,
    bmi: 25.1,
    bloodGlucose: 110,
    painScale: 4,
  }

  const allergies = [
    { type: "Drug", allergen: "Penicillin", severity: "Severe", reaction: "Skin rash, difficulty breathing" },
    { type: "Food", allergen: "Peanuts", severity: "Moderate", reaction: "Hives, swelling" },
  ]

  const aiAlerts = [
    {
      type: "warning",
      message: "Elevated Temperature",
      detail: "Temperature 37.8°C is above normal range. Monitor for signs of infection.",
      vital: "Temperature",
    },
    {
      type: "info",
      message: "Blood Pressure Trending Up",
      detail: "BP has increased from 120/80 to 140/90 over the last 3 readings.",
      vital: "Blood Pressure",
    },
  ]

  const nursingNotes = {
    generalAppearance: "Patient appears alert but slightly uncomfortable",
    consciousness: "Alert & Oriented x3",
    mobility: "Ambulatory with assistance",
    notes:
      "Patient reports increased pain in lower back. Vital signs stable except for elevated temperature. Patient is cooperative and follows instructions well. No acute distress noted at this time.",
    fallRisk: 3,
    lastUpdated: "2024-01-20 14:35",
  }

  const getVitalStatus = (vital: string, value: number) => {
    switch (vital) {
      case "temperature":
        if (value > 38.0) return "critical"
        if (value > 37.2) return "warning"
        return "normal"
      case "heartRate":
        if (value > 120 || value < 50) return "critical"
        if (value > 100 || value < 60) return "warning"
        return "normal"
      case "oxygenSaturation":
        if (value < 90) return "critical"
        if (value < 95) return "warning"
        return "normal"
      default:
        return "normal"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      case "warning":
        return "text-orange-600 bg-orange-50 border-orange-200"
      default:
        return "text-green-600 bg-green-50 border-green-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical":
        return <TrendingDown className="h-4 w-4" />
      case "warning":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patient Vitals - {patientName}</h2>
          <p className="text-gray-600">
            Last updated: {latestVitals.recordedAt} by {latestVitals.recordedBy}
          </p>
        </div>
        <Badge variant="outline" className="flex items-center">
          <Eye className="h-4 w-4 mr-1" />
          Doctor View
        </Badge>
      </div>

      {/* AI Alerts */}
      {aiAlerts.length > 0 && (
        <div className="space-y-2">
          {aiAlerts.map((alert, index) => (
            <Alert
              key={index}
              className={alert.type === "warning" ? "border-orange-500 bg-orange-50" : "border-blue-500 bg-blue-50"}
            >
              <AlertTriangle className={`h-4 w-4 ${alert.type === "warning" ? "text-orange-600" : "text-blue-600"}`} />
              <AlertDescription>
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`font-semibold ${alert.type === "warning" ? "text-orange-800" : "text-blue-800"}`}>
                      {alert.message}
                    </p>
                    <p className={`text-sm ${alert.type === "warning" ? "text-orange-600" : "text-blue-600"}`}>
                      {alert.detail}
                    </p>
                  </div>
                  <Badge variant={alert.type === "warning" ? "secondary" : "outline"}>{alert.vital}</Badge>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

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
              <div
                className={`p-3 rounded-lg border ${getStatusColor(getVitalStatus("temperature", latestVitals.temperature))}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Temperature</p>
                    <p className="text-lg font-bold">{latestVitals.temperature}°C</p>
                  </div>
                  {getStatusIcon(getVitalStatus("temperature", latestVitals.temperature))}
                </div>
              </div>

              <div
                className={`p-3 rounded-lg border ${getStatusColor(getVitalStatus("heartRate", latestVitals.heartRate))}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Heart Rate</p>
                    <p className="text-lg font-bold">{latestVitals.heartRate} bpm</p>
                  </div>
                  <Heart className="h-5 w-5" />
                </div>
              </div>

              <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Blood Pressure</p>
                    <p className="text-lg font-bold">{latestVitals.bloodPressure} mmHg</p>
                  </div>
                  <Activity className="h-5 w-5 text-gray-600" />
                </div>
              </div>

              <div
                className={`p-3 rounded-lg border ${getStatusColor(getVitalStatus("oxygenSaturation", latestVitals.oxygenSaturation))}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">O₂ Saturation</p>
                    <p className="text-lg font-bold">{latestVitals.oxygenSaturation}%</p>
                  </div>
                  <Activity className="h-5 w-5" />
                </div>
              </div>

              <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Respiratory Rate</p>
                    <p className="text-lg font-bold">{latestVitals.respiratoryRate}/min</p>
                  </div>
                  <Activity className="h-5 w-5 text-gray-600" />
                </div>
              </div>

              <div className="p-3 rounded-lg border bg-gray-50 border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Pain Scale</p>
                    <p className="text-lg font-bold">{latestVitals.painScale}/10</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full ${latestVitals.painScale <= 3 ? "bg-green-500" : latestVitals.painScale <= 6 ? "bg-orange-500" : "bg-red-500"}`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Weight</p>
                  <p className="font-semibold">{latestVitals.weight} kg</p>
                </div>
                <div>
                  <p className="text-gray-600">Height</p>
                  <p className="font-semibold">{latestVitals.height} cm</p>
                </div>
                <div>
                  <p className="text-gray-600">BMI</p>
                  <p className="font-semibold">{latestVitals.bmi}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Allergies & Nursing Notes */}
        <div className="space-y-6">
          {/* Allergies */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">⚠️ Allergies</CardTitle>
            </CardHeader>
            <CardContent>
              {allergies.length === 0 ? (
                <p className="text-gray-500">No known allergies</p>
              ) : (
                <div className="space-y-2">
                  {allergies.map((allergy, index) => (
                    <div key={index} className="p-2 border rounded bg-red-50 border-red-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-red-800">{allergy.allergen}</p>
                          <p className="text-sm text-red-600">{allergy.reaction}</p>
                        </div>
                        <Badge variant="destructive">{allergy.severity}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Nursing Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Latest Nursing Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">General Appearance</p>
                  <p className="font-medium">{nursingNotes.generalAppearance}</p>
                </div>
                <div>
                  <p className="text-gray-600">Consciousness</p>
                  <p className="font-medium">{nursingNotes.consciousness}</p>
                </div>
                <div>
                  <p className="text-gray-600">Mobility</p>
                  <p className="font-medium">{nursingNotes.mobility}</p>
                </div>
                <div>
                  <p className="text-gray-600">Fall Risk Score</p>
                  <p className="font-medium">{nursingNotes.fallRisk}/10</p>
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Nursing Notes</p>
                <p className="text-sm mt-1">{nursingNotes.notes}</p>
              </div>
              <div className="text-xs text-gray-500 pt-2 border-t">Last updated: {nursingNotes.lastUpdated}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

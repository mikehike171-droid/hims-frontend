"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Activity, Calendar } from "lucide-react"

interface VitalsHistoryProps {
  patientId: string
}

export default function VitalsHistory({ patientId }: VitalsHistoryProps) {
  // Mock historical data
  const vitalsHistory = [
    {
      date: "2024-01-20 14:30",
      temperature: 37.8,
      heartRate: 95,
      bloodPressure: "140/90",
      oxygenSaturation: 96,
      recordedBy: "Nurse Sarah Johnson",
      alerts: ["High Temperature"],
    },
    {
      date: "2024-01-20 08:00",
      temperature: 37.2,
      heartRate: 88,
      bloodPressure: "135/85",
      oxygenSaturation: 98,
      recordedBy: "Nurse Mike Chen",
      alerts: [],
    },
    {
      date: "2024-01-19 20:00",
      temperature: 36.8,
      heartRate: 82,
      bloodPressure: "130/80",
      oxygenSaturation: 99,
      recordedBy: "Nurse Lisa Wong",
      alerts: [],
    },
    {
      date: "2024-01-19 14:00",
      temperature: 36.5,
      heartRate: 78,
      bloodPressure: "125/78",
      oxygenSaturation: 98,
      recordedBy: "Nurse Sarah Johnson",
      alerts: [],
    },
  ]

  const getTrend = (current: number, previous: number) => {
    if (current > previous) return "up"
    if (current < previous) return "down"
    return "stable"
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-green-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
          Vitals History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {vitalsHistory.map((record, index) => {
            const previousRecord = vitalsHistory[index + 1]
            return (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold">{new Date(record.date).toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Recorded by {record.recordedBy}</p>
                  </div>
                  {record.alerts.length > 0 && (
                    <div className="flex gap-1">
                      {record.alerts.map((alert, i) => (
                        <Badge key={i} variant="destructive" className="text-xs">
                          {alert}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Temperature</p>
                      <p className="font-semibold">{record.temperature}°C</p>
                    </div>
                    {previousRecord && getTrendIcon(getTrend(record.temperature, previousRecord.temperature))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Heart Rate</p>
                      <p className="font-semibold">{record.heartRate} bpm</p>
                    </div>
                    {previousRecord && getTrendIcon(getTrend(record.heartRate, previousRecord.heartRate))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Blood Pressure</p>
                      <p className="font-semibold">{record.bloodPressure}</p>
                    </div>
                    <Activity className="h-4 w-4 text-gray-500" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">O₂ Sat</p>
                      <p className="font-semibold">{record.oxygenSaturation}%</p>
                    </div>
                    {previousRecord && getTrendIcon(getTrend(record.oxygenSaturation, previousRecord.oxygenSaturation))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 text-center">
          <Button variant="outline">Load More History</Button>
        </div>
      </CardContent>
    </Card>
  )
}

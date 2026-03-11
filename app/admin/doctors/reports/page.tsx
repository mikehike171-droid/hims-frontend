"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Users, FileText, Download, Filter, Clock, Activity, Heart, Pill } from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function DoctorReports() {
  const [activeTab, setActiveTab] = useState("performance")
  const [dateRange, setDateRange] = useState("last-30-days")

  const performanceMetrics = {
    totalPatients: 156,
    consultationsCompleted: 142,
    averageConsultationTime: 18.5,
    patientSatisfaction: 4.7,
    noShowRate: 8.3,
    followUpCompliance: 92.1,
  }

  const patientStats = [
    { condition: "Hypertension", count: 45, percentage: 28.8 },
    { condition: "Diabetes", count: 38, percentage: 24.4 },
    { condition: "Respiratory Issues", count: 32, percentage: 20.5 },
    { condition: "Cardiac Conditions", count: 25, percentage: 16.0 },
    { condition: "Others", count: 16, percentage: 10.3 },
  ]

  const prescriptionStats = [
    { medication: "Lisinopril", prescribed: 28, adherence: 94 },
    { medication: "Metformin", prescribed: 25, adherence: 87 },
    { medication: "Atorvastatin", prescribed: 22, adherence: 91 },
    { medication: "Amlodipine", prescribed: 18, adherence: 89 },
    { medication: "Aspirin", prescribed: 15, adherence: 96 },
  ]

  const recentReports = [
    { id: 1, name: "Monthly Performance Report", date: "2024-01-15", type: "performance" },
    { id: 2, name: "Patient Satisfaction Survey", date: "2024-01-14", type: "satisfaction" },
    { id: 3, name: "Prescription Adherence Report", date: "2024-01-13", type: "medication" },
    { id: 4, name: "Clinical Outcomes Analysis", date: "2024-01-12", type: "clinical" },
  ]

  return (
    <PrivateRoute modulePath="admin/doctors/reports" action="view">
      <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 Days</SelectItem>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="last-90-days">Last 90 Days</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="patients">Patient Analytics</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="reports">Generated Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Patients</p>
                    <p className="text-3xl font-bold text-gray-900">{performanceMetrics.totalPatients}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Consultations</p>
                    <p className="text-3xl font-bold text-gray-900">{performanceMetrics.consultationsCompleted}</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Time (min)</p>
                    <p className="text-3xl font-bold text-gray-900">{performanceMetrics.averageConsultationTime}</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Patient Satisfaction</span>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="font-bold">{performanceMetrics.patientSatisfaction}/5.0</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">No-Show Rate</span>
                    <span className="font-bold text-red-600">{performanceMetrics.noShowRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Follow-up Compliance</span>
                    <span className="font-bold text-green-600">{performanceMetrics.followUpCompliance}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Consultation Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center border rounded-lg bg-gray-50">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Consultation trend chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Demographics & Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patientStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full bg-blue-500"
                        style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                      ></div>
                      <span className="font-medium">{stat.condition}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{stat.count} patients</span>
                      <p className="text-sm text-gray-600">{stat.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prescription Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prescriptionStats.map((med, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Pill className="h-5 w-5 text-purple-500" />
                      <span className="font-medium">{med.medication}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{med.prescribed} prescribed</p>
                      <Badge variant={med.adherence > 90 ? "default" : "secondary"}>{med.adherence}% adherence</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <p className="text-sm text-gray-600">{report.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{report.type}</Badge>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </PrivateRoute>
  )
}

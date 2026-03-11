"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import UserLayout from "@/components/layout/user-layout"
import { 
  Calendar, 
  Clock, 
  FileText, 
  Pill, 
  Activity,
  Stethoscope,
  TestTube,
  User
} from "lucide-react"

export default function UserDashboard() {

  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      date: "2024-01-15",
      time: "10:30 AM",
      type: "Follow-up"
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Dermatology", 
      date: "2024-01-18",
      time: "2:15 PM",
      type: "Consultation"
    }
  ]

  const recentReports = [
    {
      id: 1,
      type: "Blood Test",
      date: "2024-01-10",
      status: "Ready",
      doctor: "Dr. Sarah Johnson"
    },
    {
      id: 2,
      type: "X-Ray Chest",
      date: "2024-01-08",
      status: "Ready",
      doctor: "Dr. Robert Smith"
    }
  ]

  const medications = [
    {
      id: 1,
      name: "Lisinopril 10mg",
      dosage: "Once daily",
      remaining: 15,
      nextRefill: "2024-01-20"
    },
    {
      id: 2,
      name: "Metformin 500mg",
      dosage: "Twice daily",
      remaining: 8,
      nextRefill: "2024-01-16"
    }
  ]

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h2>
          <p className="text-gray-600">Here's your health overview for today</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Next Appointment</p>
                  <p className="text-2xl font-bold">2 Days</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Active Medications</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <Pill className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Pending Reports</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <FileText className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Health Score</p>
                  <p className="text-2xl font-bold">85%</p>
                </div>
                <Activity className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span>Upcoming Appointments</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Stethoscope className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{appointment.doctor}</h4>
                        <p className="text-sm text-gray-600">{appointment.specialty}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline">{appointment.type}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{appointment.date}</p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {appointment.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline">
                View All Appointments
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Pill className="h-4 w-4 mr-2" />
                  My Medications
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TestTube className="h-4 w-4 mr-2" />
                  Lab Results
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  Update Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports & Medications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-green-500" />
                <span>Recent Reports</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{report.type}</h4>
                      <p className="text-sm text-gray-600">by {report.doctor}</p>
                      <p className="text-xs text-gray-500">{report.date}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {report.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Medications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Pill className="h-5 w-5 text-purple-500" />
                <span>Current Medications</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {medications.map((med) => (
                  <div key={med.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{med.name}</h4>
                      <Badge variant={med.remaining < 10 ? "destructive" : "secondary"}>
                        {med.remaining} left
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{med.dosage}</p>
                    <p className="text-xs text-gray-500">Next refill: {med.nextRefill}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </UserLayout>
  )
}
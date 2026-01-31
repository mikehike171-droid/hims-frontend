"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building2,
  Stethoscope,
  Pill
} from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user) {
      router.push('/admin/login')
      return
    }
  }, [router])

  const stats = [
    {
      title: "Total Patients",
      value: "2,847",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "blue"
    },
    {
      title: "Today's Appointments",
      value: "156",
      change: "+8%",
      trend: "up",
      icon: Calendar,
      color: "green"
    },
    {
      title: "Revenue (Month)",
      value: "$284,750",
      change: "+15%",
      trend: "up",
      icon: DollarSign,
      color: "purple"
    },
    {
      title: "Bed Occupancy",
      value: "87%",
      change: "-3%",
      trend: "down",
      icon: Activity,
      color: "orange"
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: "New Patient",
      description: "John Smith registered as new patient",
      time: "5 minutes ago",
      status: "success"
    },
    {
      id: 2,
      type: "Emergency",
      description: "Emergency admission in Room 205",
      time: "12 minutes ago",
      status: "urgent"
    },
    {
      id: 3,
      type: "Discharge",
      description: "Patient P001234 discharged successfully",
      time: "25 minutes ago",
      status: "success"
    },
    {
      id: 4,
      type: "Lab Result",
      description: "Critical lab result requires attention",
      time: "1 hour ago",
      status: "warning"
    }
  ]

  const departmentStats = [
    { name: "Emergency", patients: 45, capacity: 50, utilization: 90 },
    { name: "Cardiology", patients: 32, capacity: 40, utilization: 80 },
    { name: "Orthopedics", patients: 28, capacity: 35, utilization: 80 },
    { name: "Pediatrics", patients: 18, capacity: 25, utilization: 72 },
    { name: "Neurology", patients: 15, capacity: 20, utilization: 75 }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "urgent": return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <PrivateRoute modulePath="admin/dashboard" action="view">
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, Administrator</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-red-600 border-red-200">
                <Building2 className="h-3 w-3 mr-1" />
                Main Hospital
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <div className="flex items-center mt-1">
                        {stat.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm ${
                          stat.trend === "up" ? "text-green-600" : "text-red-600"
                        }`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">vs last month</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      stat.color === "blue" ? "bg-blue-100" :
                      stat.color === "green" ? "bg-green-100" :
                      stat.color === "purple" ? "bg-purple-100" :
                      "bg-orange-100"
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        stat.color === "blue" ? "text-blue-600" :
                        stat.color === "green" ? "text-green-600" :
                        stat.color === "purple" ? "text-purple-600" :
                        "text-orange-600"
                      }`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-500" />
                <span>Recent Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    {getStatusIcon(activity.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{activity.type}</h4>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Activities
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
                <Button className="w-full justify-start bg-red-600 hover:bg-red-700" asChild>
                  <a href="/admin/patients/register">
                    <Users className="h-4 w-4 mr-2" />
                    Register New Patient
                  </a>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/admin/front-office/appointments">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Appointment
                  </a>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/admin/inpatient/admission">
                    <Building2 className="h-4 w-4 mr-2" />
                    Patient Admission
                  </a>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/admin/lab/orders">
                    <Activity className="h-4 w-4 mr-2" />
                    Lab Orders
                  </a>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/admin/pharmacy/dispensing">
                    <Pill className="h-4 w-4 mr-2" />
                    Pharmacy
                  </a>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/admin/settings">
                    <Building2 className="h-4 w-4 mr-2" />
                    System Settings
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Overview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-purple-500" />
              <span>Department Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentStats.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Stethoscope className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{dept.name}</h4>
                      <p className="text-sm text-gray-600">
                        {dept.patients} / {dept.capacity} patients
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          dept.utilization >= 90 ? "bg-red-500" :
                          dept.utilization >= 80 ? "bg-yellow-500" :
                          "bg-green-500"
                        }`}
                        style={{ width: `${dept.utilization}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12">
                      {dept.utilization}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      </div>
    </PrivateRoute>
  )
}

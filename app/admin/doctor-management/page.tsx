"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Calendar,
  Shield,
  DollarSign,
  CalendarCheck,
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  BarChart3,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function DoctorManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties")
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [activeTab, setActiveTab] = useState("doctors")

  const stats = [
    { title: "Total Doctors", value: "145", subtitle: "132 active", icon: Users, color: "text-blue-600" },
    {
      title: "Today Scheduled",
      value: "87",
      subtitle: "Avg 82% utilization",
      icon: CalendarCheck,
      color: "text-green-600",
    },
    { title: "Compliance Rate", value: "94%", subtitle: "5 pending", icon: Shield, color: "text-purple-600" },
    { title: "Pending Payouts", value: "12", subtitle: "This month", icon: DollarSign, color: "text-orange-600" },
  ]

  const doctors = [
    {
      id: "DOC001",
      name: "Dr. Rajesh Kumar",
      specialty: "Cardiology - Interventional",
      type: "Full Time",
      schedule: "Today 2:00 PM",
      patients: 42,
      utilization: 85,
      rating: 4.8,
      status: "ACTIVE",
    },
    {
      id: "DOC002",
      name: "Dr. Priya Sharma",
      specialty: "Pediatrics - Neonatology",
      type: "Full Time",
      schedule: "Today 3:00 PM",
      patients: 38,
      utilization: 92,
      rating: 4.9,
      status: "ACTIVE",
    },
    {
      id: "DOC003",
      name: "Dr. Anil Mehta",
      specialty: "Orthopedics - Joint Replacement",
      type: "Visiting",
      schedule: "Tomorrow 10:00 AM",
      patients: 28,
      utilization: 78,
      rating: 4.7,
      status: "ACTIVE",
    },
    {
      id: "DOC004",
      name: "Dr. Meera Reddy",
      specialty: "Gynecology - High-Risk Pregnancy",
      type: "Full Time",
      schedule: "Back on Jan 20",
      patients: 0,
      utilization: 0,
      rating: 4.6,
      status: "ON LEAVE",
    },
    {
      id: "DOC005",
      name: "Dr. Vijay Kumar",
      specialty: "General Medicine - Diabetology",
      type: "Part Time",
      schedule: "Today 4:00 PM",
      patients: 35,
      utilization: 88,
      rating: 4.5,
      status: "ACTIVE",
    },
  ]

  const complianceAlerts = [
    {
      doctor: "Dr. Rajesh Kumar",
      issue: "License Renewal Due",
      dueDate: "2025-10-15",
      severity: "high",
      status: "pending",
    },
    {
      doctor: "Dr. Priya Sharma",
      issue: "CME Credits Required",
      dueDate: "2025-11-01",
      severity: "medium",
      status: "pending",
    },
    {
      doctor: "Dr. Anil Mehta",
      issue: "Insurance Verification",
      dueDate: "2025-10-20",
      severity: "high",
      status: "pending",
    },
    {
      doctor: "Dr. Meera Reddy",
      issue: "Background Check Expiring",
      dueDate: "2025-12-01",
      severity: "low",
      status: "in-progress",
    },
    {
      doctor: "Dr. Vijay Kumar",
      issue: "Credentialing Update",
      dueDate: "2025-10-25",
      severity: "medium",
      status: "pending",
    },
  ]

  const performanceMetrics = [
    {
      doctor: "Dr. Rajesh Kumar",
      specialty: "Cardiology",
      avgConsultTime: "18 min",
      patientSatisfaction: 4.8,
      followUpRate: "92%",
      cancellationRate: "3%",
    },
    {
      doctor: "Dr. Priya Sharma",
      specialty: "Pediatrics",
      avgConsultTime: "15 min",
      patientSatisfaction: 4.9,
      followUpRate: "95%",
      cancellationRate: "2%",
    },
    {
      doctor: "Dr. Anil Mehta",
      specialty: "Orthopedics",
      avgConsultTime: "22 min",
      patientSatisfaction: 4.7,
      followUpRate: "88%",
      cancellationRate: "5%",
    },
    {
      doctor: "Dr. Meera Reddy",
      specialty: "Gynecology",
      avgConsultTime: "20 min",
      patientSatisfaction: 4.6,
      followUpRate: "90%",
      cancellationRate: "4%",
    },
    {
      doctor: "Dr. Vijay Kumar",
      specialty: "General Medicine",
      avgConsultTime: "16 min",
      patientSatisfaction: 4.5,
      followUpRate: "87%",
      cancellationRate: "6%",
    },
  ]

  return (
    <PrivateRoute modulePath="admin/doctor-management" action="view">
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Doctors Management</h1>
            <p className="text-sm text-gray-600">Complete doctor lifecycle management system</p>
          </div>
          <div className="flex gap-3">
            <Link href="/doctor-management/reports">
              <Button variant="outline" className="border-gray-300 bg-white hover:bg-gray-50">
                <BarChart3 className="mr-2 h-4 w-4" />
                Reports
              </Button>
            </Link>
            <Link href="/doctor-management/compliance">
              <Button variant="outline" className="border-gray-300 bg-white hover:bg-gray-50">
                <Shield className="mr-2 h-4 w-4" />
                Compliance
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-gray-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="mt-1 text-xs text-gray-500">{stat.subtitle}</p>
                  </div>
                  <div className={`rounded-lg bg-gray-50 p-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-4 flex gap-6 border-b border-gray-200 bg-white px-6">
          <button
            onClick={() => setActiveTab("doctors")}
            className={`pb-4 text-sm font-medium transition-colors ${
              activeTab === "doctors" ? "border-b-2 border-black text-black" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Doctors List
          </button>
          <button
            onClick={() => setActiveTab("compliance")}
            className={`pb-4 text-sm font-medium transition-colors ${
              activeTab === "compliance" ? "border-b-2 border-black text-black" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Compliance Alerts
          </button>
          <button
            onClick={() => setActiveTab("performance")}
            className={`pb-4 text-sm font-medium transition-colors ${
              activeTab === "performance" ? "border-b-2 border-black text-black" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Performance
          </button>
        </div>

        {activeTab === "doctors" && (
          <Card className="border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search doctors by name, code, or specialty..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-300"
                  />
                </div>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm bg-white"
                >
                  <option>All Specialties</option>
                  <option>Cardiology</option>
                  <option>Pediatrics</option>
                  <option>Orthopedics</option>
                </select>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm bg-white"
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>On Leave</option>
                </select>
                <Button variant="outline" size="icon" className="border-gray-300 bg-transparent">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="border-gray-300 bg-transparent">
                  <Download className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {doctors.map((doctor) => (
                  <Card key={doctor.id} className="border-gray-200 bg-white">
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600 font-semibold">
                            {doctor.name.split(" ")[1][0]}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                            <p className="text-xs text-gray-500">{doctor.id}</p>
                          </div>
                        </div>
                        <Badge
                          className={
                            doctor.status === "ACTIVE"
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                          }
                        >
                          {doctor.status}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>{doctor.specialty}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{doctor.type}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{doctor.schedule}</span>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-4 border-t border-gray-200 pt-4">
                        <div className="text-center">
                          <p className="text-xl font-bold text-blue-600">{doctor.patients}</p>
                          <p className="text-xs text-gray-500">Patients</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-green-600">{doctor.utilization}%</p>
                          <p className="text-xs text-gray-500">Utilization</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-purple-600">{doctor.rating}</p>
                          <p className="text-xs text-gray-500">Rating</p>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" className="flex-1 bg-white border-gray-300" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        <Button className="flex-1 bg-black hover:bg-gray-800 text-white" size="sm">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "compliance" && (
          <Card className="border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Compliance Alerts</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-gray-300 bg-transparent">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-3 text-left text-sm font-medium text-gray-600">Doctor</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-600">Issue</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-600">Due Date</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-600">Severity</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-600">Status</th>
                      <th className="pb-3 text-right text-sm font-medium text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complianceAlerts.map((alert, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-4 text-sm font-medium text-gray-900">{alert.doctor}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <AlertTriangle
                              className={`h-4 w-4 ${
                                alert.severity === "high"
                                  ? "text-red-600"
                                  : alert.severity === "medium"
                                    ? "text-yellow-600"
                                    : "text-blue-600"
                              }`}
                            />
                            <span className="text-sm text-gray-900">{alert.issue}</span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-gray-600">{alert.dueDate}</td>
                        <td className="py-4">
                          <Badge
                            className={
                              alert.severity === "high"
                                ? "bg-red-100 text-red-700 hover:bg-red-100"
                                : alert.severity === "medium"
                                  ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                  : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                            }
                          >
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <Badge
                            className={
                              alert.status === "pending"
                                ? "bg-gray-100 text-gray-700 hover:bg-gray-100"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                            }
                          >
                            {alert.status === "pending" ? "Pending" : "In Progress"}
                          </Badge>
                        </td>
                        <td className="py-4 text-right">
                          <Button size="sm" variant="outline" className="border-gray-300 bg-transparent">
                            Resolve
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "performance" && (
          <Card className="border-gray-200 bg-white">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Doctor Performance Metrics</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-gray-300 bg-transparent">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-3 text-left text-sm font-medium text-gray-600">Doctor</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-600">Specialty</th>
                      <th className="pb-3 text-center text-sm font-medium text-gray-600">Avg Consult Time</th>
                      <th className="pb-3 text-center text-sm font-medium text-gray-600">Patient Satisfaction</th>
                      <th className="pb-3 text-center text-sm font-medium text-gray-600">Follow-up Rate</th>
                      <th className="pb-3 text-center text-sm font-medium text-gray-600">Cancellation Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceMetrics.map((metric, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-4 text-sm font-medium text-gray-900">{metric.doctor}</td>
                        <td className="py-4 text-sm text-gray-600">{metric.specialty}</td>
                        <td className="py-4 text-center text-sm text-gray-900">{metric.avgConsultTime}</td>
                        <td className="py-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-sm font-semibold text-purple-600">{metric.patientSatisfaction}</span>
                            <span className="text-xs text-gray-500">/ 5.0</span>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <Badge
                            className={
                              Number.parseInt(metric.followUpRate) >= 90
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                            }
                          >
                            {metric.followUpRate}
                          </Badge>
                        </td>
                        <td className="py-4 text-center">
                          <Badge
                            className={
                              Number.parseInt(metric.cancellationRate) <= 3
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : Number.parseInt(metric.cancellationRate) <= 5
                                  ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                  : "bg-red-100 text-red-700 hover:bg-red-100"
                            }
                          >
                            {metric.cancellationRate}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    </PrivateRoute>
  )
}

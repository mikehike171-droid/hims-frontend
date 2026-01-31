"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, DollarSign, Clock, Award, Download } from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function DoctorReportsPage() {
  const [timePeriod, setTimePeriod] = useState("This Month")
  const [branch, setBranch] = useState("All Branches")
  const [specialty, setSpecialty] = useState("All Specialties")
  const [doctor, setDoctor] = useState("All Doctors")
  const [activeTab, setActiveTab] = useState("utilization")

  const metrics = [
    {
      title: "Avg Utilization",
      value: "86%",
      change: "↑ 5% from last month",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Revenue",
      value: "₹13.8L",
      change: "↑ 12% from last month",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Avg Wait Time",
      value: "11m",
      change: "↓ 3m from last month",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Patient Satisfaction",
      value: "4.75",
      change: "↑ 0.2 from last month",
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  const utilizationData = [
    { doctor: "Dr. Rajesh Kumar", specialty: "Cardiology", scheduled: 120, attended: 102, noShow: 8, utilization: 85 },
    { doctor: "Dr. Priya Sharma", specialty: "Pediatrics", scheduled: 140, attended: 129, noShow: 5, utilization: 92 },
    { doctor: "Dr. Anil Mehta", specialty: "Orthopedics", scheduled: 100, attended: 78, noShow: 12, utilization: 78 },
    { doctor: "Dr. Meera Reddy", specialty: "Gynecology", scheduled: 110, attended: 98, noShow: 7, utilization: 89 },
  ]

  const revenueData = [
    {
      doctor: "Dr. Rajesh Kumar",
      specialty: "Cardiology",
      consultations: 102,
      revenue: "₹2.04L",
      avgPerConsult: "₹2,000",
      growth: "+15%",
    },
    {
      doctor: "Dr. Priya Sharma",
      specialty: "Pediatrics",
      consultations: 129,
      revenue: "₹1.94L",
      avgPerConsult: "₹1,500",
      growth: "+22%",
    },
    {
      doctor: "Dr. Anil Mehta",
      specialty: "Orthopedics",
      consultations: 78,
      revenue: "₹2.34L",
      avgPerConsult: "₹3,000",
      growth: "+8%",
    },
    {
      doctor: "Dr. Meera Reddy",
      specialty: "Gynecology",
      consultations: 98,
      revenue: "₹1.96L",
      avgPerConsult: "₹2,000",
      growth: "+18%",
    },
  ]

  const performanceData = [
    {
      doctor: "Dr. Rajesh Kumar",
      specialty: "Cardiology",
      avgWaitTime: "12 min",
      satisfaction: 4.8,
      followUpRate: "92%",
      cancellationRate: "3%",
    },
    {
      doctor: "Dr. Priya Sharma",
      specialty: "Pediatrics",
      avgWaitTime: "8 min",
      satisfaction: 4.9,
      followUpRate: "95%",
      cancellationRate: "2%",
    },
    {
      doctor: "Dr. Anil Mehta",
      specialty: "Orthopedics",
      avgWaitTime: "15 min",
      satisfaction: 4.7,
      followUpRate: "88%",
      cancellationRate: "5%",
    },
    {
      doctor: "Dr. Meera Reddy",
      specialty: "Gynecology",
      avgWaitTime: "10 min",
      satisfaction: 4.6,
      followUpRate: "90%",
      cancellationRate: "4%",
    },
  ]

  const complianceData = [
    {
      doctor: "Dr. Rajesh Kumar",
      specialty: "Cardiology",
      licenseStatus: "Valid",
      insuranceStatus: "Valid",
      credentialing: "Complete",
      cmeCredits: "45/40",
    },
    {
      doctor: "Dr. Priya Sharma",
      specialty: "Pediatrics",
      licenseStatus: "Valid",
      insuranceStatus: "Valid",
      credentialing: "Complete",
      cmeCredits: "38/40",
    },
    {
      doctor: "Dr. Anil Mehta",
      specialty: "Orthopedics",
      licenseStatus: "Expiring Soon",
      insuranceStatus: "Valid",
      credentialing: "Pending",
      cmeCredits: "42/40",
    },
    {
      doctor: "Dr. Meera Reddy",
      specialty: "Gynecology",
      licenseStatus: "Valid",
      insuranceStatus: "Valid",
      credentialing: "Complete",
      cmeCredits: "40/40",
    },
  ]

  return (
    <PrivateRoute modulePath="admin/doctor-management/reports" action="view">
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Doctor Reports & Analytics</h1>
            <p className="text-sm text-gray-600">Comprehensive insights into doctor performance and utilization</p>
          </div>
          <Button className="bg-black hover:bg-gray-800 text-white">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Filters */}
        <Card className="mb-6 border-gray-200 bg-white">
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Time Period</label>
                <select
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm bg-white"
                >
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>Last 3 Months</option>
                  <option>Last 6 Months</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm bg-white"
                >
                  <option>All Branches</option>
                  <option>Main Branch</option>
                  <option>Branch 2</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Specialty</label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm bg-white"
                >
                  <option>All Specialties</option>
                  <option>Cardiology</option>
                  <option>Pediatrics</option>
                  <option>Orthopedics</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Doctor</label>
                <select
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm bg-white"
                >
                  <option>All Doctors</option>
                  <option>Dr. Rajesh Kumar</option>
                  <option>Dr. Priya Sharma</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics */}
        <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <Card key={metric.title} className="border-gray-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{metric.value}</p>
                    <p className="mt-1 text-xs text-green-600">{metric.change}</p>
                  </div>
                  <div className={`rounded-lg ${metric.bgColor} p-3 ${metric.color}`}>
                    <metric.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-4 flex gap-6 border-b border-gray-200 bg-white px-6">
          {["utilization", "revenue", "performance", "compliance"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-medium capitalize transition-colors ${
                activeTab === tab ? "border-b-2 border-black text-black" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "utilization" && (
          <Card className="border-gray-200 bg-white">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Doctor Utilization Report</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-3 text-left text-sm font-medium text-gray-600">Doctor</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-600">Specialty</th>
                      <th className="pb-3 text-right text-sm font-medium text-gray-600">Scheduled</th>
                      <th className="pb-3 text-right text-sm font-medium text-gray-600">Attended</th>
                      <th className="pb-3 text-right text-sm font-medium text-gray-600">No-Show</th>
                      <th className="pb-3 text-right text-sm font-medium text-gray-600">Utilization</th>
                    </tr>
                  </thead>
                  <tbody>
                    {utilizationData.map((row, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-4 text-sm text-gray-900">{row.doctor}</td>
                        <td className="py-4 text-sm text-gray-600">{row.specialty}</td>
                        <td className="py-4 text-right text-sm text-gray-900">{row.scheduled}</td>
                        <td className="py-4 text-right text-sm text-gray-900">{row.attended}</td>
                        <td className="py-4 text-right text-sm text-gray-900">{row.noShow}</td>
                        <td className="py-4 text-right">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                              row.utilization >= 90
                                ? "bg-green-100 text-green-700"
                                : row.utilization >= 80
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {row.utilization}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "revenue" && (
          <Card className="border-gray-200 bg-white">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Doctor Revenue Report</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-3 text-left text-sm font-medium text-gray-600">Doctor</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-600">Specialty</th>
                      <th className="pb-3 text-right text-sm font-medium text-gray-600">Consultations</th>
                      <th className="pb-3 text-right text-sm font-medium text-gray-600">Total Revenue</th>
                      <th className="pb-3 text-right text-sm font-medium text-gray-600">Avg per Consult</th>
                      <th className="pb-3 text-right text-sm font-medium text-gray-600">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueData.map((row, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-4 text-sm text-gray-900">{row.doctor}</td>
                        <td className="py-4 text-sm text-gray-600">{row.specialty}</td>
                        <td className="py-4 text-right text-sm text-gray-900">{row.consultations}</td>
                        <td className="py-4 text-right text-sm font-semibold text-green-600">{row.revenue}</td>
                        <td className="py-4 text-right text-sm text-gray-900">{row.avgPerConsult}</td>
                        <td className="py-4 text-right">
                          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                            {row.growth}
                          </span>
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
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Doctor Performance Report</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-3 text-left text-sm font-medium text-gray-600">Doctor</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-600">Specialty</th>
                      <th className="pb-3 text-center text-sm font-medium text-gray-600">Avg Wait Time</th>
                      <th className="pb-3 text-center text-sm font-medium text-gray-600">Satisfaction</th>
                      <th className="pb-3 text-center text-sm font-medium text-gray-600">Follow-up Rate</th>
                      <th className="pb-3 text-center text-sm font-medium text-gray-600">Cancellation Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceData.map((row, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-4 text-sm text-gray-900">{row.doctor}</td>
                        <td className="py-4 text-sm text-gray-600">{row.specialty}</td>
                        <td className="py-4 text-center text-sm text-gray-900">{row.avgWaitTime}</td>
                        <td className="py-4 text-center">
                          <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">
                            {row.satisfaction} / 5.0
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                              Number.parseInt(row.followUpRate) >= 90
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {row.followUpRate}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                              Number.parseInt(row.cancellationRate) <= 3
                                ? "bg-green-100 text-green-700"
                                : Number.parseInt(row.cancellationRate) <= 5
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {row.cancellationRate}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "compliance" && (
          <Card className="border-gray-200 bg-white">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Doctor Compliance Report</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="pb-3 text-left text-sm font-medium text-gray-600">Doctor</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-600">Specialty</th>
                      <th className="pb-3 text-center text-sm font-medium text-gray-600">License Status</th>
                      <th className="pb-3 text-center text-sm font-medium text-gray-600">Insurance Status</th>
                      <th className="pb-3 text-center text-sm font-medium text-gray-600">Credentialing</th>
                      <th className="pb-3 text-center text-sm font-medium text-gray-600">CME Credits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complianceData.map((row, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-4 text-sm text-gray-900">{row.doctor}</td>
                        <td className="py-4 text-sm text-gray-600">{row.specialty}</td>
                        <td className="py-4 text-center">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                              row.licenseStatus === "Valid"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {row.licenseStatus}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                            {row.insuranceStatus}
                          </span>
                        </td>
                        <td className="py-4 text-center">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                              row.credentialing === "Complete"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {row.credentialing}
                          </span>
                        </td>
                        <td className="py-4 text-center text-sm text-gray-900">{row.cmeCredits}</td>
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

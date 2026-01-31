"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  CalendarIcon,
  Download,
  Eye,
  FileText,
  BarChart3,
  PieChartIcon,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function FrontOfficeReportsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [reportType, setReportType] = useState("daily")

  // Sample analytics data
  const dailyStats = {
    registrations: 52,
    registrationsTrend: 8.5,
    revenue: 125000,
    revenueTrend: 12.3,
    appointments: 67,
    appointmentsTrend: -2.1,
    collections: 98000,
    collectionsTrend: 15.7,
  }

  const registrationData = [
    { name: "Mon", registrations: 45, revenue: 98000 },
    { name: "Tue", registrations: 52, revenue: 125000 },
    { name: "Wed", registrations: 38, revenue: 87000 },
    { name: "Thu", registrations: 61, revenue: 142000 },
    { name: "Fri", registrations: 55, revenue: 128000 },
    { name: "Sat", registrations: 73, revenue: 165000 },
    { name: "Sun", registrations: 42, revenue: 95000 },
  ]

  const departmentData = [
    { name: "General Medicine", value: 25, color: "#0088FE" },
    { name: "Cardiology", value: 20, color: "#00C49F" },
    { name: "Orthopedics", value: 15, color: "#FFBB28" },
    { name: "Pediatrics", value: 12, color: "#FF8042" },
    { name: "Others", value: 28, color: "#8884D8" },
  ]

  const paymentMethodData = [
    { name: "Cash", value: 45000, percentage: 45 },
    { name: "Card", value: 35000, percentage: 35 },
    { name: "UPI", value: 15000, percentage: 15 },
    { name: "Online", value: 5000, percentage: 5 },
  ]

  const AnalyticsDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Patient Registrations</p>
                <p className="text-2xl font-bold">{dailyStats.registrations}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2 flex items-center gap-1">
              {dailyStats.registrationsTrend > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={cn("text-sm", dailyStats.registrationsTrend > 0 ? "text-green-600" : "text-red-600")}>
                {Math.abs(dailyStats.registrationsTrend)}% from yesterday
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">₹{dailyStats.revenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">{dailyStats.revenueTrend}% from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Appointments</p>
                <p className="text-2xl font-bold">{dailyStats.appointments}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-2 flex items-center gap-1">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-600">{Math.abs(dailyStats.appointmentsTrend)}% from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Collections</p>
                <p className="text-2xl font-bold">₹{dailyStats.collections.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">{dailyStats.collectionsTrend}% from yesterday</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Weekly Registration Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={registrationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="registrations" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Department-wise Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={departmentData} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {departmentData.map((dept) => (
                <div key={dept.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }} />
                    <span>{dept.name}</span>
                  </div>
                  <span className="font-medium">{dept.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={registrationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethodData.map((method) => (
                <div key={method.name} className="flex items-center justify-between">
                  <span className="text-sm">{method.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${method.percentage}%` }} />
                    </div>
                    <span className="text-sm font-medium">₹{method.value.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const ReportTemplates = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:bg-gray-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Daily Registration Report</h3>
                <p className="text-sm text-gray-600">Patient registrations by date</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-gray-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold">Revenue Summary</h3>
                <p className="text-sm text-gray-600">Daily/monthly revenue breakdown</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-gray-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <CalendarIcon className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="font-semibold">Appointment Analytics</h3>
                <p className="text-sm text-gray-600">Booking patterns and trends</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-gray-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-8 w-8 text-orange-600" />
              <div>
                <h3 className="font-semibold">Staff Performance</h3>
                <p className="text-sm text-gray-600">Employee productivity metrics</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-gray-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="h-8 w-8 text-red-600" />
              <div>
                <h3 className="font-semibold">Department Utilization</h3>
                <p className="text-sm text-gray-600">Resource utilization by department</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-gray-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-8 w-8 text-indigo-600" />
              <div>
                <h3 className="font-semibold">Insurance Claims</h3>
                <p className="text-sm text-gray-600">Claims processing and status</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const CustomReportBuilder = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Custom Report Builder</CardTitle>
          <CardDescription>Create tailored reports with specific data points</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Report</SelectItem>
                  <SelectItem value="weekly">Weekly Report</SelectItem>
                  <SelectItem value="monthly">Monthly Report</SelectItem>
                  <SelectItem value="custom">Custom Date Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold">Select Data Points:</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "Patient Registrations",
                "Revenue Collection",
                "Appointment Bookings",
                "Payment Methods",
                "Department Statistics",
                "Staff Performance",
                "Insurance Claims",
                "Outstanding Payments",
                "Daily Reconciliation",
              ].map((dataPoint) => (
                <label key={dataPoint} className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">{dataPoint}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Email Recipients</Label>
              <Input placeholder="Enter email addresses (comma separated)" />
            </div>
          </div>

          <div className="flex gap-4">
            <Button className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <PrivateRoute modulePath="admin/front-office/reports" action="view">
      <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
        <p className="text-gray-600">Comprehensive reporting and business intelligence</p>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="custom">Custom Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="templates">
          <ReportTemplates />
        </TabsContent>

        <TabsContent value="custom">
          <CustomReportBuilder />
        </TabsContent>
      </Tabs>
      </div>
    </PrivateRoute>
  )
}

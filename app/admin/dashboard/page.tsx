"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { useBranch } from "@/contexts/branch-context"
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
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from "recharts"

export default function AdminDashboard() {
  const router = useRouter()
  const { currentBranch } = useBranch()
  const [patientCount, setPatientCount] = useState<string>("...")
  const [appointmentCount, setAppointmentCount] = useState<string>("...")
  const [revenue, setRevenue] = useState<string>("...")
  const [dueAmount, setDueAmount] = useState<string>("...")
  const [patientYearlyFlow, setPatientYearlyFlow] = useState<any[]>([])
  const [appointmentYearlyFlow, setAppointmentYearlyFlow] = useState<any[]>([])
  const [revenueYearlyFlow, setRevenueYearlyFlow] = useState<any[]>([])
  const [dueYearlyFlow, setDueYearlyFlow] = useState<any[]>([])
  const [paymentMethodFlow, setPaymentMethodFlow] = useState<any[]>([])
  const [paymentMethods, setPaymentMethods] = useState<string[]>([])

  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const user = authService.getCurrentUser()
    if (!user) {
      router.push('/admin/login')
      return
    }

    const fetchStats = async () => {
      try {
        const token = authService.getCurrentToken();
        const headers = {
          'Authorization': `Bearer ${token}`
        };

        const rawLocationId = authService.getLocationId();
        const locationId = rawLocationId ? rawLocationId.replace(/"/g, '').trim() : '';
        const hasLocation = locationId && locationId !== 'null' && locationId !== 'undefined';
        const url = `${authService.getSettingsApiUrl()}/patients/dashboard-stats${hasLocation ? `?locationId=${locationId}` : ''}`;
        const response = await fetch(url, { headers });
        if (response.ok) {
          const data = await response.json();
          setPatientCount(data.patients.month?.toString() || "0");
          setAppointmentCount(data.appointments.month?.toString() || "0");
          setRevenue(data.financials.revenue?.toLocaleString() || "0");
          setDueAmount(data.financials.dueAmount?.toLocaleString() || "0");

          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

          // Format flow data
          setPatientYearlyFlow(data.patientYearlyFlow.map((item: any) => ({
            name: monthNames[item.month - 1],
            patients: item.count
          })));

          setAppointmentYearlyFlow(data.appointmentYearlyFlow.map((item: any) => ({
            name: monthNames[item.month - 1],
            appointments: item.count
          })));

          setRevenueYearlyFlow(data.financialYearlyFlow.map((item: any) => ({
            name: monthNames[item.month - 1],
            revenue: item.paid
          })));

          setDueYearlyFlow(data.financialYearlyFlow.map((item: any) => ({
            name: monthNames[item.month - 1],
            due: item.due
          })));

          // Format payment method flow data
          const methodsSet = new Set<string>();
          const formattedPaymentFlow = data.paymentMethodYearlyFlow.map((item: any) => {
            const entry: any = { name: monthNames[item.month - 1] };
            Object.keys(item.methods).forEach(method => {
              entry[method] = item.methods[method];
              methodsSet.add(method);
            });
            return entry;
          });
          setPaymentMethodFlow(formattedPaymentFlow);
          setPaymentMethods(Array.from(methodsSet));
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    }

    fetchStats()
  }, [router])

  const stats = [
    {
      title: "New Patients (Month)",
      value: patientCount,
      change: currentBranch?.name || "All Locations",
      trend: "up",
      icon: Users,
      color: "blue"
    },
    {
      title: "Appointments (Month)",
      value: appointmentCount,
      change: currentBranch?.name || "All Locations",
      trend: "up",
      icon: Calendar,
      color: "green"
    },
    {
      title: "Revenue (Month)",
      value: revenue === "..." ? "..." : `₹${revenue}`,
      change: currentBranch?.name || "All Locations",
      trend: "up",
      icon: DollarSign,
      color: "purple"
    },
    {
      title: "Due Amount (Month)",
      value: dueAmount === "..." ? "..." : `₹${dueAmount}`,
      change: currentBranch?.name || "All Locations",
      trend: "down",
      icon: AlertTriangle,
      color: "orange"
    }
  ]


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
                  {currentBranch?.name || "All Locations"}
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
                          <span className={`text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"
                            }`}>
                            {stat.change}
                          </span>
                        </div>
                      </div>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color === "blue" ? "bg-blue-100" :
                        stat.color === "green" ? "bg-green-100" :
                          stat.color === "purple" ? "bg-purple-100" :
                            "bg-orange-100"
                        }`}>
                        <Icon className={`h-6 w-6 ${stat.color === "blue" ? "text-blue-600" :
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Patient Flow Graph */}
            <Card className="shadow-sm border-blue-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span>Patient Flow (Yearly)</span>
                  </div>
                  <Badge className="bg-blue-600">2026</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={patientYearlyFlow}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="patients"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorPatients)"
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Appointment Flow Graph */}
            <Card className="shadow-sm border-green-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <span>Appointment Flow (Yearly)</span>
                  </div>
                  <Badge className="bg-green-600">2026</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={appointmentYearlyFlow}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="appointments"
                        stroke="#10b981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorAppointments)"
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Flow Graph */}
            <Card className="shadow-sm border-purple-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-fuchsia-50 border-b">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                    <span>Revenue Flow (Yearly)</span>
                  </div>
                  <Badge className="bg-purple-600">2026</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={revenueYearlyFlow}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <Tooltip
                        formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
                        contentStyle={{
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#a855f7"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Due Amount Flow Graph */}
            <Card className="shadow-sm border-orange-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span>Due Amount Flow (Yearly)</span>
                  </div>
                  <Badge className="bg-orange-600">2026</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={dueYearlyFlow}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorDue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <Tooltip
                        formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Due Amount']}
                        contentStyle={{
                          borderRadius: '8px',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="due"
                        stroke="#f97316"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorDue)"
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Method Flow Graph */}
          <Card className="mt-8 shadow-sm border-indigo-100 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-violet-50 border-b">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-indigo-600" />
                  <span>Payment Method Breakdown (Monthly)</span>
                </div>
                <Badge className="bg-indigo-600">2026</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={paymentMethodFlow}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 13 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 13 }}
                      tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000) + 'k' : value}`}
                    />
                    <Tooltip
                      formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Amount']}
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
                        padding: '12px'
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ paddingBottom: '20px' }}
                    />
                    {paymentMethods.map((method, index) => {
                      const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
                      return (
                        <Bar
                          key={method}
                          dataKey={method}
                          stackId="a"
                          fill={colors[index % colors.length]}
                          radius={index === paymentMethods.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                          animationDuration={1500}
                        />
                      )
                    })}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </main>
      </div>
    </PrivateRoute>
  )
}

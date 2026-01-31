"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Calendar,
  CreditCard,
  FileText,
  TrendingUp,
  Clock,
  AlertTriangle,
  IndianRupee,
  UserPlus,
  Receipt,
  RefreshCw,
  Eye,
  Download,
} from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PrivateRoute from "@/components/auth/PrivateRoute"

const mockStats = {
  dailyFootfall: 247,
  todayRegistrations: 45,
  todayAppointments: 189,
  walkIns: 58,
  avgWaitTime: "12 min",
  collections: {
    total: 285000,
    cash: 125000,
    card: 89000,
    upi: 71000,
  },
  cancellations: 8,
  refunds: 3,
  discounts: 12500,
  noShows: 15,
  investigations: {
    lab: 89,
    radiology: 34,
    packages: 12,
  },
  payerMix: {
    cash: 65,
    insurance: 25,
    corporate: 10,
  },
}

const recentActivities = [
  {
    id: 1,
    type: "registration",
    patient: "Rajesh Kumar",
    time: "2 min ago",
    counter: "Counter 1",
    status: "completed",
  },
  {
    id: 2,
    type: "payment",
    patient: "Priya Sharma",
    amount: 1500,
    time: "5 min ago",
    counter: "Counter 2",
    status: "completed",
  },
  {
    id: 3,
    type: "appointment",
    patient: "Amit Singh",
    time: "8 min ago",
    counter: "Counter 1",
    status: "pending",
  },
  {
    id: 4,
    type: "refund",
    patient: "Sunita Devi",
    amount: 800,
    time: "12 min ago",
    counter: "Counter 3",
    status: "approved",
  },
]

const pendingApprovals = [
  {
    id: 1,
    type: "discount",
    amount: 500,
    percentage: 15,
    patient: "Mohammed Ali",
    reason: "Senior Citizen",
    requestedBy: "Receptionist-001",
  },
  {
    id: 2,
    type: "cancellation",
    amount: 2500,
    patient: "Lisa Williams",
    reason: "Service not rendered",
    requestedBy: "Cashier-002",
  },
  {
    id: 3,
    type: "refund",
    amount: 1200,
    patient: "David Brown",
    reason: "Duplicate payment",
    requestedBy: "Receptionist-003",
  },
]

export default function FrontOfficeDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedShift, setSelectedShift] = useState("current")
  const [selectedCounter, setSelectedCounter] = useState("all")

  useEffect(() => {
    
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <PrivateRoute modulePath="admin/front-office" action="view">
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Front Office Dashboard</h1>
          <p className="text-gray-600">Reception & Cash Counter Management</p>
          <p className="text-sm text-gray-500">
            {currentTime.toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            • {currentTime.toLocaleTimeString("en-IN")}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedShift} onValueChange={setSelectedShift}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Shift</SelectItem>
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="evening">Evening</SelectItem>
              <SelectItem value="night">Night</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" asChild>
            <Link href="/admin/front-office/shift-reports">
              <Download className="h-4 w-4 mr-2" />
              Shift Report
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Footfall</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.dailyFootfall}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12%
              </span>
              <span className="ml-2">from yesterday</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Reg: {mockStats.todayRegistrations} • Appts: {mockStats.todayAppointments} • Walk-ins: {mockStats.walkIns}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Collection</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{mockStats.collections.total.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8%
              </span>
              <span className="ml-2">from yesterday</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Cash: ₹{mockStats.collections.cash / 1000}k • Card: ₹{mockStats.collections.card / 1000}k • UPI: ₹
              {mockStats.collections.upi / 1000}k
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.avgWaitTime}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                -15%
              </span>
              <span className="ml-2">improvement</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Queue efficiency optimized</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApprovals.length}</div>
            <div className="text-xs text-muted-foreground">Require immediate attention</div>
            <div className="text-xs text-gray-500 mt-1">
              Discounts: {pendingApprovals.filter((a) => a.type === "discount").length} • Refunds:{" "}
              {pendingApprovals.filter((a) => a.type === "refund").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Link href="/admin/front-office/patients">
          <Card className="hover:shadow-md transition-all cursor-pointer hover:scale-105">
            <CardContent className="flex flex-col items-center p-4">
              <Users className="h-8 w-8 text-indigo-600 mb-2" />
              <span className="text-sm font-medium text-center">Patient List</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/front-office/registration">
          <Card className="hover:shadow-md transition-all cursor-pointer hover:scale-105">
            <CardContent className="flex flex-col items-center p-4">
              <UserPlus className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-center">New Registration</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/front-office/appointments">
          <Card className="hover:shadow-md transition-all cursor-pointer hover:scale-105">
            <CardContent className="flex flex-col items-center p-4">
              <Calendar className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-center">Appointments</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/front-office/billing">
          <Card className="hover:shadow-md transition-all cursor-pointer hover:scale-105">
            <CardContent className="flex flex-col items-center p-4">
              <CreditCard className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-center">OP Billing</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/front-office/investigations">
          <Card className="hover:shadow-md transition-all cursor-pointer hover:scale-105">
            <CardContent className="flex flex-col items-center p-4">
              <FileText className="h-8 w-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-center">Investigations</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/front-office/estimates">
          <Card className="hover:shadow-md transition-all cursor-pointer hover:scale-105">
            <CardContent className="flex flex-col items-center p-4">
              <Receipt className="h-8 w-8 text-red-600 mb-2" />
              <span className="text-sm font-medium text-center">Estimates</span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/front-office/customer-service">
          <Card className="hover:shadow-md transition-all cursor-pointer hover:scale-105">
            <CardContent className="flex flex-col items-center p-4">
              <Users className="h-8 w-8 text-teal-600 mb-2" />
              <span className="text-sm font-medium text-center">Customer Service</span>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Main Dashboard Content */}
      <Tabs defaultValue="activities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activities">Recent Activities</TabsTrigger>
          <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="investigations">Investigations</TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Live updates from all front office counters</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedCounter} onValueChange={setSelectedCounter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Counters</SelectItem>
                      <SelectItem value="counter1">Counter 1</SelectItem>
                      <SelectItem value="counter2">Counter 2</SelectItem>
                      <SelectItem value="counter3">Counter 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="outline">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{activity.patient}</span>
                          <Badge
                            variant={
                              activity.type === "registration"
                                ? "default"
                                : activity.type === "payment"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          {activity.counter} • {activity.time}
                          {activity.amount && ` • ₹${activity.amount}`}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        activity.status === "completed"
                          ? "default"
                          : activity.status === "pending"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Items requiring management approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map((approval) => (
                  <div key={approval.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium capitalize">{approval.type}</span>
                          <Badge variant="outline">₹{approval.amount}</Badge>
                          {approval.percentage && <Badge variant="secondary">{approval.percentage}%</Badge>}
                        </div>
                        <div className="text-sm text-gray-600">
                          Patient: {approval.patient} • Reason: {approval.reason}
                        </div>
                        <div className="text-xs text-gray-500">Requested by: {approval.requestedBy}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Reject
                      </Button>
                      <Button size="sm">Approve</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Collection Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Cash Payments</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-green-200 rounded-full">
                        <div className="w-12 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">₹{mockStats.collections.cash / 1000}k</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Card Payments</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-blue-200 rounded-full">
                        <div className="w-10 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">₹{mockStats.collections.card / 1000}k</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>UPI Payments</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-purple-200 rounded-full">
                        <div className="w-8 h-2 bg-purple-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">₹{mockStats.collections.upi / 1000}k</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payer Mix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Cash Patients</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div className="w-12 h-2 bg-gray-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">{mockStats.payerMix.cash}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Insurance</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-red-200 rounded-full">
                        <div className="w-6 h-2 bg-red-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">{mockStats.payerMix.insurance}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Corporate</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-yellow-200 rounded-full">
                        <div className="w-3 h-2 bg-yellow-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">{mockStats.payerMix.corporate}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="investigations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lab Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{mockStats.investigations.lab}</div>
                <p className="text-sm text-gray-600">Today's lab investigations</p>
                <div className="mt-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/front-office/investigations/lab">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Radiology</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{mockStats.investigations.radiology}</div>
                <p className="text-sm text-gray-600">Today's radiology orders</p>
                <div className="mt-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/front-office/investigations/radiology">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Health Packages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{mockStats.investigations.packages}</div>
                <p className="text-sm text-gray-600">Today's package sales</p>
                <div className="mt-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/front-office/packages">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </PrivateRoute>
  )
}

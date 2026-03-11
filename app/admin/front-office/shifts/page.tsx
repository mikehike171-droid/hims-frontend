"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Clock, Users, CheckCircle, AlertCircle, DollarSign, FileText, LogIn, LogOut, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function FrontOfficeShiftsPage() {
  const [currentShift, setCurrentShift] = useState({
    id: "SHIFT-001",
    date: new Date(),
    startTime: "09:00 AM",
    endTime: "06:00 PM",
    supervisor: "Sarah Johnson",
    status: "active",
  })

  // Sample data
  const staffAttendance = [
    {
      id: "1",
      name: "John Doe",
      role: "Receptionist",
      checkIn: "08:45 AM",
      checkOut: null,
      status: "present",
      overtimeHours: 0,
      breaks: 1,
    },
    {
      id: "2",
      name: "Jane Smith",
      role: "Billing Executive",
      checkIn: "09:00 AM",
      checkOut: null,
      status: "present",
      overtimeHours: 0,
      breaks: 2,
    },
    {
      id: "3",
      name: "Mike Wilson",
      role: "Insurance Coordinator",
      checkIn: "09:15 AM",
      checkOut: "05:30 PM",
      status: "completed",
      overtimeHours: 0.5,
      breaks: 1,
    },
    {
      id: "4",
      name: "Lisa Brown",
      role: "Patient Coordinator",
      checkIn: null,
      checkOut: null,
      status: "absent",
      overtimeHours: 0,
      breaks: 0,
    },
  ]

  const shiftHandover = {
    previousShift: {
      supervisor: "Mark Johnson",
      endTime: "08:00 AM",
      summary: "All tasks completed successfully. 45 patients registered, 8 insurance claims processed.",
      pendingTasks: [
        "Follow up with HDFC ERGO for claim #CLM-001",
        "Print receipts for cash payments after 5 PM",
        "Update patient contact details for incomplete registrations",
      ],
      criticalInfo: [
        "VIP patient Mr. Sharma arriving at 10 AM - Suite booking confirmed",
        "System maintenance scheduled for lunch break 1-2 PM",
        "New insurance policy verification process effective today",
      ],
    },
  }

  const shiftMetrics = {
    patientsRegistered: 52,
    paymentsCollected: 85000,
    appointmentsBooked: 67,
    tasksCompleted: 24,
    targetRegistrations: 60,
    targetPayments: 100000,
  }

  const StaffAttendanceTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Staff Attendance</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <LogIn className="h-4 w-4 mr-2" />
            Check In
          </Button>
          <Button variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Check Out
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {staffAttendance.map((staff) => (
          <Card key={staff.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold">{staff.name}</h4>
                  <p className="text-sm text-gray-600">{staff.role}</p>
                </div>
                <Badge
                  variant={
                    staff.status === "present" ? "default" : staff.status === "completed" ? "secondary" : "destructive"
                  }
                >
                  {staff.status === "present" ? "Present" : staff.status === "completed" ? "Completed" : "Absent"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Check In:</span>
                  <p className="font-medium">{staff.checkIn || "Not checked in"}</p>
                </div>
                <div>
                  <span className="text-gray-600">Check Out:</span>
                  <p className="font-medium">{staff.checkOut || "Active"}</p>
                </div>
                <div>
                  <span className="text-gray-600">Overtime:</span>
                  <p className="font-medium">{staff.overtimeHours}h</p>
                </div>
                <div>
                  <span className="text-gray-600">Breaks:</span>
                  <p className="font-medium">{staff.breaks}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const ShiftHandoverTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Shift Handover
          </CardTitle>
          <CardDescription>Previous shift summary and handover notes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium">Previous Shift Supervisor:</Label>
              <p className="mt-1">{shiftHandover.previousShift.supervisor}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Shift End Time:</Label>
              <p className="mt-1">{shiftHandover.previousShift.endTime}</p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Shift Summary:</Label>
            <p className="mt-1 text-gray-700">{shiftHandover.previousShift.summary}</p>
          </div>

          <div>
            <Label className="text-sm font-medium">Pending Tasks:</Label>
            <ul className="mt-2 space-y-1">
              {shiftHandover.previousShift.pendingTasks.map((task, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{task}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Label className="text-sm font-medium">Critical Information:</Label>
            <ul className="mt-2 space-y-1">
              {shiftHandover.previousShift.criticalInfo.map((info, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium">{info}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-semibold">Current Shift Handover Notes</h4>
            <Textarea placeholder="Add handover notes for the next shift..." rows={4} />
            <Button>Save Handover Notes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const CashReconciliationTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Cash Reconciliation
          </CardTitle>
          <CardDescription>End-of-shift cash balancing and variance tracking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Opening Balance</p>
                  <p className="text-2xl font-bold">₹10,000</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Cash Collections</p>
                  <p className="text-2xl font-bold">₹45,000</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Expected Balance</p>
                  <p className="text-2xl font-bold">₹55,000</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>₹2000 Notes</Label>
                <Input type="number" placeholder="Count" />
              </div>
              <div className="space-y-2">
                <Label>₹500 Notes</Label>
                <Input type="number" placeholder="Count" />
              </div>
              <div className="space-y-2">
                <Label>₹200 Notes</Label>
                <Input type="number" placeholder="Count" />
              </div>
              <div className="space-y-2">
                <Label>₹100 Notes</Label>
                <Input type="number" placeholder="Count" />
              </div>
              <div className="space-y-2">
                <Label>₹50 Notes</Label>
                <Input type="number" placeholder="Count" />
              </div>
              <div className="space-y-2">
                <Label>₹20 Notes</Label>
                <Input type="number" placeholder="Count" />
              </div>
              <div className="space-y-2">
                <Label>₹10 Notes</Label>
                <Input type="number" placeholder="Count" />
              </div>
              <div className="space-y-2">
                <Label>Coins</Label>
                <Input type="number" placeholder="Amount" />
              </div>
            </div>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Actual Count:</p>
                    <p className="text-xl font-bold">₹54,850</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Variance:</p>
                    <p className="text-xl font-bold text-red-600">-₹150</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label>Variance Explanation</Label>
              <Textarea placeholder="Explain any cash variance..." rows={3} />
            </div>

            <Button className="w-full">Complete Cash Reconciliation</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const PerformanceMetricsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Patients Registered</p>
                <p className="text-2xl font-bold">{shiftMetrics.patientsRegistered}</p>
                <p className="text-sm text-gray-500">Target: {shiftMetrics.targetRegistrations}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">87% of target</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Payments Collected</p>
                <p className="text-2xl font-bold">₹{shiftMetrics.paymentsCollected.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Target: ₹{shiftMetrics.targetPayments.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">85% of target</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Appointments Booked</p>
                <p className="text-2xl font-bold">{shiftMetrics.appointmentsBooked}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tasks Completed</p>
                <p className="text-2xl font-bold">{shiftMetrics.tasksCompleted}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Shift Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Shift Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Shift ID:</span>
                  <span>{currentShift.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{format(currentShift.date, "PPP")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span>
                    {currentShift.startTime} - {currentShift.endTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Supervisor:</span>
                  <span>{currentShift.supervisor}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Staff Status</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Present</span>
                  <Badge className="bg-green-100 text-green-800">
                    {staffAttendance.filter((s) => s.status === "present").length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Completed</span>
                  <Badge variant="secondary">{staffAttendance.filter((s) => s.status === "completed").length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Absent</span>
                  <Badge variant="destructive">{staffAttendance.filter((s) => s.status === "absent").length}</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <PrivateRoute modulePath="admin/front-office/shifts" action="view">
      <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shift Management</h1>
        <p className="text-gray-600">Monitor staff attendance, shift handover, and daily operations</p>
      </div>

      <Tabs defaultValue="attendance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="attendance">Staff Attendance</TabsTrigger>
          <TabsTrigger value="handover">Shift Handover</TabsTrigger>
          <TabsTrigger value="reconciliation">Cash Reconciliation</TabsTrigger>
          <TabsTrigger value="metrics">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance">
          <StaffAttendanceTab />
        </TabsContent>

        <TabsContent value="handover">
          <ShiftHandoverTab />
        </TabsContent>

        <TabsContent value="reconciliation">
          <CashReconciliationTab />
        </TabsContent>

        <TabsContent value="metrics">
          <PerformanceMetricsTab />
        </TabsContent>
      </Tabs>
      </div>
    </PrivateRoute>
  )
}

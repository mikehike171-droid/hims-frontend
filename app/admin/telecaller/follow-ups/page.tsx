"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Search,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  Stethoscope,
  Pill,
  AlertCircle,
  CheckCircle,
  User,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import PrivateRoute from "@/components/auth/PrivateRoute"

// Mock data for follow-ups
const mockDoctorFollowups = [
  {
    id: 1,
    patientName: "Rajesh Kumar",
    patientId: "P001234",
    phone: "+91 98765 43210",
    doctorName: "Dr. Patel",
    department: "Cardiology",
    consultationDate: "2024-01-10",
    followupType: "post_visit",
    scheduledDate: "2024-01-13 10:00 AM",
    dueDate: "2024-01-13",
    priority: "medium",
    status: "pending",
    attemptsCount: 0,
    notes: "Check patient recovery and medication compliance",
    category: "Post Consultation",
    daysSinceConsultation: 3,
  },
  {
    id: 2,
    patientName: "Priya Sharma",
    patientId: "P001235",
    phone: "+91 98765 43211",
    doctorName: "Dr. Singh",
    department: "Dermatology",
    consultationDate: "2024-01-12",
    followupType: "lab_reminder",
    scheduledDate: "2024-01-16 10:30 AM",
    dueDate: "2024-01-16",
    priority: "high",
    status: "pending",
    attemptsCount: 1,
    notes: "Lipid profile and HbA1c pending",
    category: "Lab Compliance",
    labTests: "Lipid Profile, HbA1c",
    labStatus: "overdue",
    daysSinceOrdered: 4,
  },
  {
    id: 3,
    patientName: "Amit Singh",
    patientId: "P001236",
    phone: "+91 98765 43212",
    doctorName: "Dr. Gupta",
    department: "Orthopedics",
    consultationDate: "2024-01-11",
    followupType: "payment_due",
    scheduledDate: "2024-01-17 15:00 PM",
    dueDate: "2024-01-17",
    priority: "low",
    status: "attempted",
    attemptsCount: 2,
    notes: "Consultation fee payment pending",
    category: "Payment Collection",
    outstandingAmount: 700,
    paymentType: "consultation_fee",
  },
  {
    id: 4,
    patientName: "Sunita Devi",
    patientId: "P001237",
    phone: "+91 98765 43213",
    doctorName: "Dr. Verma",
    department: "Pediatrics",
    consultationDate: "2024-01-09",
    followupType: "specialist_referral",
    scheduledDate: "2024-01-14 11:00 AM",
    dueDate: "2024-01-14",
    priority: "medium",
    status: "completed",
    attemptsCount: 1,
    notes: "Referred to cardiology specialist",
    category: "Specialist Referral",
    referralDepartment: "Cardiology",
    referralStatus: "booked",
  },
]

const mockPharmacyFollowups = [
  {
    id: 5,
    patientName: "Rajesh Kumar",
    patientId: "P001234",
    phone: "+91 98765 43210",
    medicationName: "Amlodipine 5mg",
    prescriptionDate: "2024-01-10",
    daysSupply: 30,
    refillDueDate: "2024-02-09",
    adherencePercentage: 85,
    followupType: "medication_check",
    scheduledDate: "2024-01-20 11:00 AM",
    dueDate: "2024-01-20",
    priority: "high",
    status: "pending",
    attemptsCount: 0,
    notes: "Patient prescribed Amlodipine - check adherence",
    category: "Medication Adherence",
    refillStatus: "upcoming",
  },
  {
    id: 6,
    patientName: "Vikram Gupta",
    patientId: "P001238",
    phone: "+91 98765 43214",
    medicationName: "Metformin 500mg",
    prescriptionDate: "2024-01-08",
    daysSupply: 30,
    refillDueDate: "2024-02-07",
    adherencePercentage: 70,
    followupType: "medication_check",
    scheduledDate: "2024-01-18 09:30 AM",
    dueDate: "2024-01-18",
    priority: "high",
    status: "pending",
    attemptsCount: 1,
    notes: "Diabetes medication adherence check",
    category: "Medication Adherence",
    refillStatus: "due_soon",
  },
  {
    id: 7,
    patientName: "Meera Joshi",
    patientId: "P001239",
    phone: "+91 98765 43215",
    medicationName: "Lisinopril 10mg",
    prescriptionDate: "2024-01-05",
    daysSupply: 30,
    refillDueDate: "2024-02-04",
    followupType: "refill_reminder",
    scheduledDate: "2024-01-25 16:00 PM",
    dueDate: "2024-01-25",
    priority: "medium",
    status: "pending",
    attemptsCount: 0,
    notes: "Blood pressure medication refill due",
    category: "Prescription Refill",
    refillStatus: "overdue",
  },
  {
    id: 8,
    patientName: "Ravi Patel",
    patientId: "P001240",
    phone: "+91 98765 43216",
    medicationName: "Atorvastatin 20mg",
    prescriptionDate: "2024-01-12",
    daysSupply: 30,
    refillDueDate: "2024-02-11",
    adherencePercentage: 95,
    followupType: "medication_check",
    scheduledDate: "2024-01-22 14:00 PM",
    dueDate: "2024-01-22",
    priority: "low",
    status: "completed",
    attemptsCount: 1,
    notes: "Excellent adherence, patient doing well",
    category: "Medication Adherence",
    refillStatus: "upcoming",
  },
]

export default function FollowUps() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("doctor")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedFollowup, setSelectedFollowup] = useState(null)
  const [showCallDialog, setShowCallDialog] = useState(false)
  const [callNotes, setCallNotes] = useState("")
  const [callOutcome, setCallOutcome] = useState("")
  const [nextAction, setNextAction] = useState("")
  const [nextFollowupDate, setNextFollowupDate] = useState("")

  const filterFollowups = (followups: any[]) => {
    return followups.filter((followup) => {
      if (
        searchTerm &&
        !followup.patientName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !followup.phone.includes(searchTerm) &&
        !followup.patientId.includes(searchTerm)
      ) {
        return false
      }
      if (statusFilter !== "all" && followup.status !== statusFilter) return false
      if (priorityFilter !== "all" && followup.priority !== priorityFilter) return false
      if (categoryFilter !== "all" && followup.category !== categoryFilter) return false
      return true
    })
  }

  const filteredDoctorFollowups = filterFollowups(mockDoctorFollowups)
  const filteredPharmacyFollowups = filterFollowups(mockPharmacyFollowups)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800"
      case "attempted":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRefillStatusColor = (status: string) => {
    switch (status) {
      case "overdue":
        return "bg-red-100 text-red-800"
      case "due_soon":
        return "bg-yellow-100 text-yellow-800"
      case "upcoming":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCall = (followup: any) => {
    setSelectedFollowup(followup)
    setShowCallDialog(true)
  }

  const handleCompleteCall = () => {
    if (!callOutcome) {
      toast.error("Please select call outcome")
      return
    }

    toast.success(`Call completed for ${selectedFollowup?.patientName}`)
    setShowCallDialog(false)
    setSelectedFollowup(null)
    setCallNotes("")
    setCallOutcome("")
    setNextAction("")
    setNextFollowupDate("")
  }

  const handleSendReminder = (followup: any, channel: string) => {
    toast.success(`Reminder sent via ${channel} to ${followup.patientName}`)
  }

  const totalDoctorFollowups = filteredDoctorFollowups.length
  const totalPharmacyFollowups = filteredPharmacyFollowups.length
  const highPriorityCount =
    filteredDoctorFollowups.filter((f) => f.priority === "high").length +
    filteredPharmacyFollowups.filter((f) => f.priority === "high").length
  const pendingCount =
    filteredDoctorFollowups.filter((f) => f.status === "pending").length +
    filteredPharmacyFollowups.filter((f) => f.status === "pending").length

  return (
    <PrivateRoute modulePath="admin/telecaller/follow-ups" action="view">
      <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Follow-ups Management</h1>
            <p className="text-muted-foreground">Track doctor visits and pharmacy compliance</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doctor Follow-ups</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDoctorFollowups}</div>
            <p className="text-xs text-muted-foreground">Consultation related</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pharmacy Follow-ups</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPharmacyFollowups}</div>
            <p className="text-xs text-muted-foreground">Medication related</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPriorityCount}</div>
            <p className="text-xs text-muted-foreground">Urgent attention needed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Calls</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting contact</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Follow-up Management</CardTitle>
              <CardDescription>Track and manage patient follow-ups</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="attempted">Attempted</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="doctor">Doctor Follow-ups</TabsTrigger>
              <TabsTrigger value="pharmacy">Pharmacy Follow-ups</TabsTrigger>
            </TabsList>

            <TabsContent value="doctor" className="space-y-4">
              <div className="space-y-3">
                {filteredDoctorFollowups.map((followup) => (
                  <div key={followup.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{followup.patientName}</h3>
                          <Badge className={getPriorityColor(followup.priority)}>{followup.priority}</Badge>
                          <Badge className={getStatusColor(followup.status)}>{followup.status}</Badge>
                          <Badge variant="outline">{followup.category}</Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-2">
                          <p className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            ID: {followup.patientId}
                          </p>
                          <p className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {followup.phone}
                          </p>
                          <p className="flex items-center">
                            <Stethoscope className="h-3 w-3 mr-1" />
                            {followup.doctorName}
                          </p>
                          <p className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {followup.consultationDate}
                          </p>
                        </div>

                        <div className="text-sm mb-2">
                          <strong>Department:</strong> {followup.department} • <strong>Scheduled:</strong>{" "}
                          {followup.scheduledDate} • <strong>Attempts:</strong> {followup.attemptsCount}
                        </div>

                        {followup.followupType === "lab_reminder" && (
                          <div className="text-sm mb-2">
                            <strong>Lab Tests:</strong> {followup.labTests} •{" "}
                            <Badge className={getStatusColor(followup.labStatus)}>
                              {followup.labStatus} ({followup.daysSinceOrdered} days)
                            </Badge>
                          </div>
                        )}

                        {followup.followupType === "payment_due" && (
                          <div className="text-sm mb-2">
                            <strong>Outstanding:</strong> ₹{followup.outstandingAmount} • <strong>Type:</strong>{" "}
                            {followup.paymentType.replace("_", " ")}
                          </div>
                        )}

                        {followup.followupType === "specialist_referral" && (
                          <div className="text-sm mb-2">
                            <strong>Referred to:</strong> {followup.referralDepartment} •{" "}
                            <Badge className={getStatusColor(followup.referralStatus)}>{followup.referralStatus}</Badge>
                          </div>
                        )}

                        <p className="text-sm">{followup.notes}</p>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <div className="flex gap-1">
                          <Button size="sm" onClick={() => handleCall(followup)}>
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleSendReminder(followup, "WhatsApp")}>
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/telecaller/patient/${followup.patientId}`}>
                              <User className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                        {followup.status === "pending" && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark Done
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredDoctorFollowups.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No doctor follow-ups found matching your criteria
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="pharmacy" className="space-y-4">
              <div className="space-y-3">
                {filteredPharmacyFollowups.map((followup) => (
                  <div key={followup.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{followup.patientName}</h3>
                          <Badge className={getPriorityColor(followup.priority)}>{followup.priority}</Badge>
                          <Badge className={getStatusColor(followup.status)}>{followup.status}</Badge>
                          <Badge variant="outline">{followup.category}</Badge>
                          {followup.refillStatus && (
                            <Badge className={getRefillStatusColor(followup.refillStatus)}>
                              {followup.refillStatus.replace("_", " ")}
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-2">
                          <p className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            ID: {followup.patientId}
                          </p>
                          <p className="flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {followup.phone}
                          </p>
                          <p className="flex items-center">
                            <Pill className="h-3 w-3 mr-1" />
                            {followup.medicationName}
                          </p>
                          <p className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Prescribed: {followup.prescriptionDate}
                          </p>
                        </div>

                        <div className="text-sm mb-2">
                          <strong>Days Supply:</strong> {followup.daysSupply} days • <strong>Refill Due:</strong>{" "}
                          {followup.refillDueDate} • <strong>Scheduled:</strong> {followup.scheduledDate}
                        </div>

                        {followup.adherencePercentage && (
                          <div className="text-sm mb-2">
                            <strong>Adherence:</strong>{" "}
                            <span
                              className={
                                followup.adherencePercentage >= 80
                                  ? "text-green-600 font-semibold"
                                  : followup.adherencePercentage >= 60
                                    ? "text-yellow-600 font-semibold"
                                    : "text-red-600 font-semibold"
                              }
                            >
                              {followup.adherencePercentage}%
                            </span>
                          </div>
                        )}

                        <p className="text-sm">{followup.notes}</p>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <div className="flex gap-1">
                          <Button size="sm" onClick={() => handleCall(followup)}>
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleSendReminder(followup, "WhatsApp")}>
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/telecaller/patient/${followup.patientId}`}>
                              <User className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                        {followup.status === "pending" && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark Done
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredPharmacyFollowups.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No pharmacy follow-ups found matching your criteria
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Call Dialog */}
      <Dialog open={showCallDialog} onOpenChange={setShowCallDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Call Follow-up - {selectedFollowup?.patientName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label>Patient</Label>
                <div className="font-medium">{selectedFollowup?.patientName}</div>
                <div className="text-sm text-muted-foreground">{selectedFollowup?.phone}</div>
              </div>
              <div>
                <Label>Follow-up Type</Label>
                <div className="font-medium">{selectedFollowup?.category}</div>
                <div className="text-sm text-muted-foreground">Priority: {selectedFollowup?.priority}</div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="call-outcome">Call Outcome *</Label>
              <Select value={callOutcome} onValueChange={setCallOutcome}>
                <SelectTrigger>
                  <SelectValue placeholder="Select outcome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contacted">Successfully Contacted</SelectItem>
                  <SelectItem value="not_reachable">Not Reachable</SelectItem>
                  <SelectItem value="busy">Patient Busy</SelectItem>
                  <SelectItem value="wrong_number">Wrong Number</SelectItem>
                  <SelectItem value="completed_action">Patient Completed Required Action</SelectItem>
                  <SelectItem value="needs_reschedule">Needs Reschedule</SelectItem>
                  <SelectItem value="declined">Patient Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="call-notes">Call Notes</Label>
              <Textarea
                id="call-notes"
                placeholder="Enter details about the call..."
                value={callNotes}
                onChange={(e) => setCallNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="next-action">Next Action Required</Label>
              <Input
                id="next-action"
                placeholder="e.g., Schedule lab test, Book appointment, etc."
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="next-followup">Next Follow-up Date</Label>
              <Input
                id="next-followup"
                type="datetime-local"
                value={nextFollowupDate}
                onChange={(e) => setNextFollowupDate(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCompleteCall} className="flex-1">
                Complete Call
              </Button>
              <Button variant="outline" onClick={() => setShowCallDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </PrivateRoute>
  )
}

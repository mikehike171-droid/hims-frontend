"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  Calendar,
  TestTube,
  Pill,
  CreditCard,
  User,
  MapPin,
  AlertCircle,
  FileText,
  Stethoscope,
  Heart,
  Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import PrivateRoute from "@/components/auth/PrivateRoute"

// Mock patient data - replace with actual API call
const mockPatient = {
  id: "rajesh-kumar",
  name: "Rajesh Kumar",
  phone: "+91 98765 43210",
  email: "rajesh.kumar@email.com",
  age: 45,
  gender: "Male",
  address: "123 MG Road, Bangalore, Karnataka 560001",
  preferredLanguage: "Hindi",
  consentChannels: ["phone", "whatsapp"],
  lastVisit: {
    date: "2024-01-10",
    doctor: "Dr. Patel",
    department: "Cardiology",
    diagnosis: "Hypertension",
    nextVisit: "2024-02-10",
  },
  pendingOrders: {
    labs: [
      { id: 1, test: "Lipid Profile", ordered: "2024-01-10", status: "pending" },
      { id: 2, test: "HbA1c", ordered: "2024-01-08", status: "overdue" },
    ],
    prescriptions: [
      {
        id: 1,
        medication: "Amlodipine 5mg",
        prescribed: "2024-01-10",
        status: "partial",
        purchased: "60%",
        remaining: "20 tablets",
      },
    ],
  },
  outstandingPayments: [
    { id: 1, description: "Consultation Fee", amount: 500, date: "2024-01-10" },
    { id: 2, description: "Lab Tests", amount: 1200, date: "2024-01-08" },
  ],
  callHistory: [
    {
      id: 1,
      date: "2024-01-12",
      time: "10:30 AM",
      duration: "5:30",
      outcome: "info_given",
      notes: "Explained lab test procedure and importance",
    },
    {
      id: 2,
      date: "2024-01-08",
      time: "2:15 PM",
      duration: "3:45",
      outcome: "booked",
      notes: "Booked follow-up appointment for next week",
    },
  ],
  vitals: {
    lastRecorded: "2024-01-10",
    bp: "140/90",
    pulse: "78",
    weight: "75kg",
    bmi: "24.5",
  },
}

export default function PatientView() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [callNotes, setCallNotes] = useState("")
  const [followUpDate, setFollowUpDate] = useState("")
  const [followUpChannel, setFollowUpChannel] = useState("phone")
  const [isCallActive, setIsCallActive] = useState(false)

  const handleCall = () => {
    setIsCallActive(true)
    toast.success("Initiating call to " + mockPatient.phone)
    // Simulate call duration
    setTimeout(() => {
      setIsCallActive(false)
      toast.info("Call ended")
    }, 30000)
  }

  const handleBookAppointment = () => {
    router.push(`/telecaller/book-appointment?patient=${params.id}`)
  }

  const handleLabReminder = () => {
    toast.success("Lab reminder sent via WhatsApp")
  }

  const handleRxReminder = () => {
    toast.success("Prescription reminder sent with home delivery option")
  }

  const handleSaveNotes = () => {
    if (!callNotes.trim()) {
      toast.error("Please add call notes")
      return
    }
    toast.success("Call notes saved successfully")
    setCallNotes("")
  }

  return (
    <PrivateRoute modulePath="admin/telecaller/patient" action="view">
      <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{mockPatient.name}</h1>
            <p className="text-muted-foreground">
              Patient ID: {mockPatient.id} • Age: {mockPatient.age} • {mockPatient.gender}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleCall}
            disabled={isCallActive}
            className={cn(isCallActive && "bg-red-600 hover:bg-red-700")}
          >
            <Phone className="mr-2 h-4 w-4" />
            {isCallActive ? "Calling..." : "Call Patient"}
          </Button>
          <Button variant="outline" onClick={handleBookAppointment}>
            <Calendar className="mr-2 h-4 w-4" />
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Patient Info Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contact Info</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-sm">{mockPatient.phone}</div>
              <div className="text-sm text-muted-foreground">{mockPatient.email}</div>
              <div className="flex gap-1 mt-2">
                {mockPatient.consentChannels.map((channel) => (
                  <Badge key={channel} variant="outline" className="text-xs">
                    {channel}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Visit</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-sm font-medium">{mockPatient.lastVisit.doctor}</div>
              <div className="text-sm text-muted-foreground">{mockPatient.lastVisit.department}</div>
              <div className="text-xs text-muted-foreground">{mockPatient.lastVisit.date}</div>
              <Badge variant="outline" className="text-xs">
                {mockPatient.lastVisit.diagnosis}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-sm">{mockPatient.pendingOrders.labs.length} Lab Tests</div>
              <div className="text-sm">{mockPatient.pendingOrders.prescriptions.length} Prescriptions</div>
              <div className="text-xs text-orange-600">
                {mockPatient.pendingOrders.labs.filter((l) => l.status === "overdue").length} overdue
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-lg font-bold">
                ₹{mockPatient.outstandingPayments.reduce((sum, p) => sum + p.amount, 0)}
              </div>
              <div className="text-xs text-muted-foreground">
                {mockPatient.outstandingPayments.length} pending payments
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders & Compliance</TabsTrigger>
          <TabsTrigger value="history">Call History</TabsTrigger>
          <TabsTrigger value="notes">Add Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Patient Details */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{mockPatient.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Preferred Language: {mockPatient.preferredLanguage}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Next Visit: {mockPatient.lastVisit.nextVisit}</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Vitals */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Vitals</CardTitle>
                <CardDescription>Last recorded: {mockPatient.vitals.lastRecorded}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <div>
                      <div className="text-sm font-medium">BP</div>
                      <div className="text-lg">{mockPatient.vitals.bp}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="text-sm font-medium">Pulse</div>
                      <div className="text-lg">{mockPatient.vitals.pulse}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Weight</div>
                    <div className="text-lg">{mockPatient.vitals.weight}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">BMI</div>
                    <div className="text-lg">{mockPatient.vitals.bmi}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Lab Orders */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Lab Orders</CardTitle>
                  <Button size="sm" onClick={handleLabReminder}>
                    <TestTube className="mr-2 h-4 w-4" />
                    Send Reminder
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockPatient.pendingOrders.labs.map((lab) => (
                    <div key={lab.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <div className="font-medium">{lab.test}</div>
                        <div className="text-sm text-muted-foreground">Ordered: {lab.ordered}</div>
                      </div>
                      <Badge
                        className={
                          lab.status === "overdue" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {lab.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Prescriptions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Prescriptions</CardTitle>
                  <Button size="sm" onClick={handleRxReminder}>
                    <Pill className="mr-2 h-4 w-4" />
                    Send Reminder
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockPatient.pendingOrders.prescriptions.map((rx) => (
                    <div key={rx.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <div className="font-medium">{rx.medication}</div>
                        <div className="text-sm text-muted-foreground">Prescribed: {rx.prescribed}</div>
                        <div className="text-sm text-orange-600">
                          {rx.purchased} purchased • {rx.remaining} remaining
                        </div>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">{rx.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Call History</CardTitle>
              <CardDescription>Recent interactions with this patient</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockPatient.callHistory.map((call) => (
                  <div key={call.id} className="flex items-start justify-between p-4 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {call.date} at {call.time}
                          </span>
                          <Badge
                            className={
                              call.outcome === "booked" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                            }
                          >
                            {call.outcome.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">Duration: {call.duration}</div>
                        <div className="text-sm mt-2">{call.notes}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Call Notes</CardTitle>
              <CardDescription>Record your interaction with the patient</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Call Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter details about your conversation with the patient..."
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="followup-date">Next Follow-up Date</Label>
                  <Input
                    id="followup-date"
                    type="datetime-local"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="followup-channel">Follow-up Channel</Label>
                  <Select value={followUpChannel} onValueChange={setFollowUpChannel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSaveNotes} className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Save Notes & Schedule Follow-up
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </PrivateRoute>
  )
}

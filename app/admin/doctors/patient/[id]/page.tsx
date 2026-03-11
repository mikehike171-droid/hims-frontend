"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import {
  User,
  Phone,
  Mail,
  AlertTriangle,
  Activity,
  FileText,
  Pill,
  TestTube,
  CreditCard,
  Mic,
  Save,
  Send,
  Eye,
  TrendingUp,
  Shield,
  Plus,
  ArrowLeft,
  Calendar,
  Heart,
  Thermometer,
  Download,
  Upload,
  MessageSquare,
  CheckCircle,
} from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function PatientWorkspace({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("clinical-notes")
  const [isRecording, setIsRecording] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  // Clinical notes state
  const [clinicalNotes, setClinicalNotes] = useState({
    chiefComplaint: "",
    hpi: "",
    examination: "",
    assessment: "",
    plan: "",
    followUp: "",
  })

  // New prescription state
  const [newPrescription, setNewPrescription] = useState({
    medication: "",
    dose: "",
    route: "oral",
    frequency: "once",
    duration: "",
    instructions: "",
  })

  // Mock patient data
  const patient = {
    id: params.id,
    name: "John Smith",
    age: 45,
    gender: "Male",
    phone: "+91 9876543210",
    email: "john.smith@email.com",
    address: "123 Main Street, Mumbai, Maharashtra",
    bloodGroup: "O+",
    allergies: ["Penicillin", "Shellfish"],
    insurance: "Star Health Insurance",
    policyNumber: "SH123456789",
    emergencyContact: "Jane Smith - Wife - +91 9876543211",
    lastVisit: "2024-01-10",
    mrn: "MRN001234",
  }

  const vitals = {
    bloodPressure: "140/90",
    heartRate: "78",
    temperature: "98.6°F",
    respiratoryRate: "16",
    oxygenSaturation: "98%",
    weight: "75 kg",
    height: "175 cm",
    bmi: "24.5",
    recordedAt: "2024-01-15 10:30 AM",
  }

  const currentMedications = [
    { id: 1, name: "Lisinopril 10mg", frequency: "Once daily", lastPurchased: "2024-01-08", adherence: "95%" },
    { id: 2, name: "Metformin 500mg", frequency: "Twice daily", lastPurchased: "2024-01-05", adherence: "88%" },
    { id: 3, name: "Atorvastatin 20mg", frequency: "Once daily", lastPurchased: "2024-01-10", adherence: "92%" },
  ]

  const labResults = [
    { id: 1, test: "HbA1c", value: "7.2%", reference: "< 7.0%", status: "high", date: "2024-01-08" },
    {
      id: 2,
      test: "Total Cholesterol",
      value: "220 mg/dL",
      reference: "< 200 mg/dL",
      status: "high",
      date: "2024-01-08",
    },
    { id: 3, test: "Creatinine", value: "1.1 mg/dL", reference: "0.7-1.3 mg/dL", status: "normal", date: "2024-01-08" },
  ]

  const pendingOrders = [
    {
      id: 1,
      type: "lab",
      description: "Lipid Profile",
      status: "ordered",
      priority: "routine",
      orderedAt: "2024-01-15 09:00 AM",
    },
    {
      id: 2,
      type: "radiology",
      description: "Chest X-Ray",
      status: "scheduled",
      priority: "routine",
      orderedAt: "2024-01-15 09:15 AM",
    },
    {
      id: 3,
      type: "medication",
      description: "Aspirin 81mg daily",
      status: "active",
      priority: "routine",
      orderedAt: "2024-01-15 09:30 AM",
    },
  ]

  const billingEstimate = {
    consultation: 800,
    procedures: 0,
    medications: 450,
    tests: 1200,
    total: 2450,
    insuranceCoverage: 80,
    patientPortion: 490,
  }

  const documents = [
    { id: 1, name: "Previous Visit Notes", date: "2024-01-10", type: "clinical-notes" },
    { id: 2, name: "Lab Report - CBC", date: "2024-01-08", type: "lab-report" },
    { id: 3, name: "Chest X-Ray", date: "2024-01-05", type: "radiology" },
    { id: 4, name: "Discharge Summary", date: "2023-12-15", type: "discharge" },
    { id: 5, name: "Insurance Card", date: "2024-01-01", type: "insurance" },
    { id: 6, name: "Consent Form", date: "2023-12-10", type: "consent" },
  ]

  // Event handlers
  const handleVoiceRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      toast({
        title: "Voice Recording Started",
        description: "Speak clearly for clinical documentation",
      })
    } else {
      toast({
        title: "Voice Recording Stopped",
        description: "Processing your voice input...",
      })
    }
  }

  const handleSaveNotes = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast({
      title: "Clinical Notes Saved",
      description: "Your notes have been saved successfully",
    })
  }

  const handleCompleteVisit = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
    toast({
      title: "Visit Completed",
      description: "Patient visit has been marked as complete",
    })
    router.push("/doctors")
  }

  const handleAddPrescription = () => {
    if (!newPrescription.medication || !newPrescription.dose) {
      toast({
        title: "Missing Information",
        description: "Please fill in medication name and dose",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Prescription Added",
      description: `${newPrescription.medication} ${newPrescription.dose} added to prescription`,
    })

    // Reset form
    setNewPrescription({
      medication: "",
      dose: "",
      route: "oral",
      frequency: "once",
      duration: "",
      instructions: "",
    })
  }

  const handleSendToPharma = () => {
    toast({
      title: "Prescription Sent",
      description: "E-prescription has been sent to pharmacy",
    })
  }

  const handleNewOrder = (orderType: string) => {
    toast({
      title: "Order Created",
      description: `New ${orderType} order has been created`,
    })
  }

  const handleCallPatient = () => {
    toast({
      title: "Calling Patient",
      description: `Initiating call to ${patient.phone}`,
    })
  }

  const handleSendReminder = (medicationId: number) => {
    const medication = currentMedications.find((med) => med.id === medicationId)
    toast({
      title: "Reminder Sent",
      description: `Medication reminder sent for ${medication?.name}`,
    })
  }

  const handleDocumentView = (document: any) => {
    toast({
      title: "Opening Document",
      description: `Opening ${document.name}`,
    })
  }

  const handleUploadDocument = () => {
    toast({
      title: "Upload Document",
      description: "Document upload functionality would open here",
    })
  }

  return (
    <PrivateRoute modulePath="admin/doctors/patient" action="view">
      <div className="p-6 space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="text-sm text-gray-600">
          Patient ID: {params.id} • Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Patient Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    {patient.age} years • {patient.gender}
                  </span>
                  <span>MRN: {patient.mrn}</span>
                  <span>Blood Group: {patient.bloodGroup}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    {patient.phone}
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {patient.email}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">{patient.insurance}</span>
              </div>
              <p className="text-xs text-gray-600">Policy: {patient.policyNumber}</p>
              <p className="text-xs text-gray-600">Last Visit: {patient.lastVisit}</p>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={handleCallPatient}>
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
                <Link href={`/patients/${params.id}/history`}>
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-1" />
                    History
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Allergies Alert */}
          {patient.allergies.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800">Allergies:</span>
                <div className="flex gap-2">
                  {patient.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="clinical-notes">Clinical Notes</TabsTrigger>
          <TabsTrigger value="vitals">Vitals & Charts</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="prescriptions">E-Prescription</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Clinical Notes Tab */}
        <TabsContent value="clinical-notes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Clinical Documentation
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleVoiceRecording}
                    className={isRecording ? "bg-red-100 text-red-700" : ""}
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    {isRecording ? "Stop Recording" : "Voice Input"}
                  </Button>
                  <Link href="/doctors/templates">
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </Link>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="chief-complaint">Chief Complaint</Label>
                    <Textarea
                      id="chief-complaint"
                      placeholder="Patient's primary concern..."
                      className="mt-1"
                      value={clinicalNotes.chiefComplaint}
                      onChange={(e) => setClinicalNotes({ ...clinicalNotes, chiefComplaint: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hpi">History of Present Illness</Label>
                    <Textarea
                      id="hpi"
                      placeholder="Detailed history of current symptoms..."
                      className="mt-1 h-32"
                      value={clinicalNotes.hpi}
                      onChange={(e) => setClinicalNotes({ ...clinicalNotes, hpi: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="examination">Physical Examination</Label>
                    <Textarea
                      id="examination"
                      placeholder="Physical examination findings..."
                      className="mt-1 h-32"
                      value={clinicalNotes.examination}
                      onChange={(e) => setClinicalNotes({ ...clinicalNotes, examination: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="assessment">Assessment</Label>
                    <Textarea
                      id="assessment"
                      placeholder="Clinical assessment and diagnosis..."
                      className="mt-1"
                      value={clinicalNotes.assessment}
                      onChange={(e) => setClinicalNotes({ ...clinicalNotes, assessment: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="plan">Plan</Label>
                    <Textarea
                      id="plan"
                      placeholder="Treatment plan and recommendations..."
                      className="mt-1 h-32"
                      value={clinicalNotes.plan}
                      onChange={(e) => setClinicalNotes({ ...clinicalNotes, plan: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="follow-up">Follow-up Instructions</Label>
                    <Textarea
                      id="follow-up"
                      placeholder="Follow-up instructions for patient..."
                      className="mt-1"
                      value={clinicalNotes.followUp}
                      onChange={(e) => setClinicalNotes({ ...clinicalNotes, followUp: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleSaveNotes} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Draft"}
                </Button>
                <Button onClick={handleCompleteVisit} disabled={isSaving}>
                  <Send className="h-4 w-4 mr-2" />
                  Sign & Complete
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vitals & Charts Tab */}
        <TabsContent value="vitals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Current Vitals
                  </div>
                  <div className="text-sm text-gray-600">{vitals.recordedAt}</div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <Heart className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Blood Pressure</p>
                    <p className="text-xl font-bold text-red-600">{vitals.bloodPressure}</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <Activity className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Heart Rate</p>
                    <p className="text-xl font-bold text-green-600">{vitals.heartRate} bpm</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <Thermometer className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Temperature</p>
                    <p className="text-xl font-bold text-blue-600">{vitals.temperature}</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <Activity className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">O2 Saturation</p>
                    <p className="text-xl font-bold text-green-600">{vitals.oxygenSaturation}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href={`/vitals/patient/${params.id}`}>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <Plus className="h-4 w-4 mr-2" />
                      Record New Vitals
                    </Button>
                  </Link>
                  <Link href={`/vitals/history/${params.id}`}>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View History
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Vital Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center border rounded-lg bg-gray-50">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Vital signs trend chart</p>
                    <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                      View Full Chart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <Button
                    variant="outline"
                    className="h-16 flex items-center justify-start gap-4 bg-transparent"
                    onClick={() => handleNewOrder("lab")}
                  >
                    <TestTube className="h-8 w-8 text-blue-600" />
                    <div className="text-left">
                      <p className="font-medium">Lab Orders</p>
                      <p className="text-sm text-gray-600">Blood tests, cultures, etc.</p>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 flex items-center justify-start gap-4 bg-transparent"
                    onClick={() => handleNewOrder("radiology")}
                  >
                    <Eye className="h-8 w-8 text-green-600" />
                    <div className="text-left">
                      <p className="font-medium">Radiology Orders</p>
                      <p className="text-sm text-gray-600">X-rays, CT scans, MRI</p>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-16 flex items-center justify-start gap-4 bg-transparent"
                    onClick={() => handleNewOrder("medication")}
                  >
                    <Pill className="h-8 w-8 text-purple-600" />
                    <div className="text-left">
                      <p className="font-medium">Medication Orders</p>
                      <p className="text-sm text-gray-600">Prescriptions, IV orders</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {order.type === "lab" && <TestTube className="h-5 w-5 text-blue-500" />}
                        {order.type === "radiology" && <Eye className="h-5 w-5 text-green-500" />}
                        {order.type === "medication" && <Pill className="h-5 w-5 text-purple-500" />}
                        <div>
                          <p className="font-medium">{order.description}</p>
                          <p className="text-sm text-gray-600">{order.orderedAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={order.status === "active" ? "default" : "secondary"}>{order.status}</Badge>
                        <Button size="sm" variant="outline">
                          Track
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* E-Prescription Tab */}
        <TabsContent value="prescriptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Electronic Prescription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Drug Interaction Alert</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    Patient is allergic to Penicillin. Please verify medication selection.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Search Medication</Label>
                    <Input
                      placeholder="Type medication name..."
                      className="mt-1"
                      value={newPrescription.medication}
                      onChange={(e) => setNewPrescription({ ...newPrescription, medication: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Dosage</Label>
                    <Input
                      placeholder="e.g., 10mg"
                      className="mt-1"
                      value={newPrescription.dose}
                      onChange={(e) => setNewPrescription({ ...newPrescription, dose: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Route</Label>
                    <Select
                      value={newPrescription.route}
                      onValueChange={(value) => setNewPrescription({ ...newPrescription, route: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oral">Oral</SelectItem>
                        <SelectItem value="iv">Intravenous</SelectItem>
                        <SelectItem value="im">Intramuscular</SelectItem>
                        <SelectItem value="topical">Topical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Frequency</Label>
                    <Select
                      value={newPrescription.frequency}
                      onValueChange={(value) => setNewPrescription({ ...newPrescription, frequency: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">Once daily</SelectItem>
                        <SelectItem value="twice">Twice daily</SelectItem>
                        <SelectItem value="thrice">Three times daily</SelectItem>
                        <SelectItem value="qid">Four times daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <Input
                      placeholder="e.g., 7 days"
                      className="mt-1"
                      value={newPrescription.duration}
                      onChange={(e) => setNewPrescription({ ...newPrescription, duration: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Instructions</Label>
                    <Textarea
                      placeholder="Special instructions..."
                      className="mt-1"
                      value={newPrescription.instructions}
                      onChange={(e) => setNewPrescription({ ...newPrescription, instructions: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleAddPrescription}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Prescription
                  </Button>
                  <Button variant="outline" onClick={handleSendToPharma}>
                    <Send className="h-4 w-4 mr-2" />
                    Send to Pharmacy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Lab Results
                <Link href={`/lab/results/patient/${params.id}`}>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View All Results
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {labResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <div>
                      <p className="font-medium">{result.test}</p>
                      <p className="text-sm text-gray-600">Reference: {result.reference}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${result.status === "high" ? "text-red-600" : "text-green-600"}`}>
                        {result.value}
                      </p>
                      <p className="text-xs text-gray-500">{result.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medications Tab */}
        <TabsContent value="medications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Medications & Adherence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentMedications.map((med) => (
                  <div key={med.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">{med.name}</p>
                        <p className="text-sm text-gray-600">{med.frequency}</p>
                        <p className="text-xs text-gray-500">Last purchased: {med.lastPurchased}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={Number.parseInt(med.adherence) > 90 ? "default" : "secondary"}>
                          {med.adherence} adherence
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={handleCallPatient}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call Patient
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleSendReminder(med.id)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Reminder
                      </Button>
                      <Link href={`/pharmacy/dispensing?medication=${med.id}`}>
                        <Button size="sm" variant="outline">
                          <Pill className="h-4 w-4 mr-2" />
                          Refill Status
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Live Billing Estimate
                </div>
                <Link href={`/billing/patient/${params.id}`}>
                  <Button size="sm" variant="outline">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Full Billing
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Consultation Fee</span>
                  <span>₹{billingEstimate.consultation}</span>
                </div>
                <div className="flex justify-between">
                  <span>Procedures</span>
                  <span>₹{billingEstimate.procedures}</span>
                </div>
                <div className="flex justify-between">
                  <span>Medications</span>
                  <span>₹{billingEstimate.medications}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tests</span>
                  <span>₹{billingEstimate.tests}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{billingEstimate.total}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Insurance Coverage ({billingEstimate.insuranceCoverage}%)</span>
                  <span>-₹{(billingEstimate.total * billingEstimate.insuranceCoverage) / 100}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Patient Portion</span>
                  <span>₹{billingEstimate.patientPortion}</span>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex gap-3">
                    <Link href={`/billing/generate/${params.id}`}>
                      <Button className="flex-1">
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Bill
                      </Button>
                    </Link>
                    <Link href={`/billing/insurance/${params.id}`}>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        <Shield className="h-4 w-4 mr-2" />
                        Insurance Claim
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Patient Documents
                <Button size="sm" onClick={handleUploadDocument}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((document) => (
                  <div
                    key={document.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleDocumentView(document)}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{document.name}</p>
                        <p className="text-xs text-gray-600">{document.date}</p>
                        <p className="text-xs text-gray-500 capitalize">{document.type.replace("-", " ")}</p>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <div className="flex gap-3">
          <Link href="/doctors/communications">
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </Link>
          <Link href={`/queue/schedule/${params.id}`}>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Follow-up
            </Button>
          </Link>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSaveNotes} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Progress"}
          </Button>
          <Button onClick={handleCompleteVisit} disabled={isSaving}>
            <CheckCircle className="h-4 w-4 mr-2" />
            {isSaving ? "Completing..." : "Complete Visit"}
          </Button>
        </div>
      </div>
      </div>
    </PrivateRoute>
  )
}

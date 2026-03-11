"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import {
  Bed,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Calendar,
  Filter,
  Plus,
  ArrowRight,
  Activity,
  Heart,
  Thermometer,
  Bot,
  Sparkles,
  Download,
  Edit,
  Save,
  RefreshCw,
  Copy,
  Send,
  Brain,
  FileCheck,
  Loader2,
} from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function DoctorRounds() {
  const [activeTab, setActiveTab] = useState("rounds")
  const [selectedWard, setSelectedWard] = useState("all")
  const [selectedPatientForDischarge, setSelectedPatientForDischarge] = useState<number | null>(null)
  const [isGeneratingDischarge, setIsGeneratingDischarge] = useState(false)
  const [generatedDischarge, setGeneratedDischarge] = useState("")
  const [dischargeInstructions, setDischargeInstructions] = useState("")
  const [followUpInstructions, setFollowUpInstructions] = useState("")

  const inpatients = [
    {
      id: 1,
      name: "John Smith",
      age: 65,
      room: "ICU-101",
      ward: "ICU",
      diagnosis: "Acute MI",
      admissionDate: "2024-01-10",
      condition: "stable",
      lastRounds: "2024-01-15 08:00",
      vitals: { bp: "130/80", hr: "72", temp: "98.6°F", spo2: "98%" },
      alerts: ["High BP medication due", "Lab results pending"],
      dischargeStatus: "not-ready",
      clinicalNotes: {
        chiefComplaint: "Chest pain and shortness of breath",
        hpi: "65-year-old male presented with acute onset chest pain radiating to left arm, associated with diaphoresis and nausea. Pain started 2 hours prior to admission.",
        examination:
          "Patient appears stable, no acute distress. Heart rate regular, no murmurs. Lungs clear bilaterally. No peripheral edema.",
        assessment:
          "Acute ST-elevation myocardial infarction (STEMI) of anterior wall. Successfully treated with primary PCI.",
        plan: "Continue dual antiplatelet therapy, ACE inhibitor, beta-blocker, and statin. Cardiac rehabilitation referral.",
        followUp: "Cardiology follow-up in 1 week, repeat echo in 3 months.",
      },
      medications: [
        "Aspirin 81mg daily",
        "Clopidogrel 75mg daily",
        "Metoprolol 50mg twice daily",
        "Lisinopril 10mg daily",
        "Atorvastatin 80mg daily",
      ],
      labResults: [
        "Troponin I: 15.2 ng/mL (elevated)",
        "CK-MB: 45 ng/mL (elevated)",
        "Lipid panel: Total cholesterol 240 mg/dL",
        "HbA1c: 6.8%",
      ],
      procedures: ["Primary PCI with drug-eluting stent to LAD"],
      documents: ["ECG", "Echocardiogram", "Cardiac catheterization report"],
    },
    {
      id: 2,
      name: "Sarah Johnson",
      age: 45,
      room: "Ward-205",
      ward: "General",
      diagnosis: "Pneumonia",
      admissionDate: "2024-01-12",
      condition: "improving",
      lastRounds: "2024-01-15 09:30",
      vitals: { bp: "120/75", hr: "68", temp: "99.2°F", spo2: "96%" },
      alerts: ["Antibiotic course completion"],
      dischargeStatus: "planning",
      clinicalNotes: {
        chiefComplaint: "Cough, fever, and difficulty breathing",
        hpi: "45-year-old female with 5-day history of productive cough, fever up to 102°F, and progressive dyspnea.",
        examination:
          "Decreased breath sounds and crackles in right lower lobe. No signs of respiratory distress currently.",
        assessment: "Community-acquired pneumonia, right lower lobe. Good response to antibiotic therapy.",
        plan: "Complete 7-day course of levofloxacin. Supportive care with bronchodilators as needed.",
        followUp: "Primary care follow-up in 1 week. Return if symptoms worsen.",
      },
      medications: ["Levofloxacin 750mg daily", "Albuterol inhaler as needed", "Acetaminophen 650mg q6h PRN fever"],
      labResults: ["WBC: 12,500 (elevated, improving)", "Procalcitonin: 0.8 ng/mL", "Blood cultures: No growth"],
      procedures: ["Chest X-ray", "Sputum culture"],
      documents: ["Chest X-ray", "CT chest", "Sputum culture report"],
    },
    {
      id: 3,
      name: "Mike Wilson",
      age: 58,
      room: "CCU-302",
      ward: "CCU",
      diagnosis: "Heart Failure",
      admissionDate: "2024-01-08",
      condition: "critical",
      lastRounds: "2024-01-15 07:45",
      vitals: { bp: "90/60", hr: "110", temp: "98.4°F", spo2: "92%" },
      alerts: ["Fluid balance monitoring", "Cardiology consult needed"],
      dischargeStatus: "not-ready",
      clinicalNotes: {
        chiefComplaint: "Shortness of breath and leg swelling",
        hpi: "58-year-old male with known heart failure presenting with worsening dyspnea and bilateral lower extremity edema over past week.",
        examination: "Elevated JVP, bilateral crackles, 3+ pitting edema bilateral lower extremities.",
        assessment: "Acute decompensated heart failure with reduced ejection fraction (HFrEF). NYHA Class III.",
        plan: "Diuresis with furosemide, ACE inhibitor optimization, beta-blocker titration. Daily weights and I/O monitoring.",
        followUp: "Heart failure clinic in 1 week. Consider ICD evaluation.",
      },
      medications: [
        "Furosemide 40mg twice daily",
        "Lisinopril 20mg daily",
        "Carvedilol 12.5mg twice daily",
        "Spironolactone 25mg daily",
      ],
      labResults: ["BNP: 1250 pg/mL (elevated)", "Creatinine: 1.4 mg/dL", "Sodium: 135 mEq/L"],
      procedures: ["Echocardiogram"],
      documents: ["Echocardiogram", "Chest X-ray", "Previous discharge summary"],
    },
  ]

  const dischargeQueue = [
    {
      id: 4,
      name: "Emma Davis",
      age: 35,
      room: "Ward-108",
      diagnosis: "Appendectomy",
      admissionDate: "2024-01-13",
      expectedDischarge: "2024-01-16",
      status: "ready",
      pendingTasks: ["Discharge summary", "Medication reconciliation"],
      clinicalNotes: {
        chiefComplaint: "Right lower quadrant abdominal pain",
        hpi: "35-year-old female with acute onset RLQ pain, nausea, and vomiting. Pain migrated from periumbilical area.",
        examination:
          "Post-operative day 2. Incision sites clean, dry, intact. Bowel sounds present. Tolerating regular diet.",
        assessment:
          "Status post laparoscopic appendectomy for acute appendicitis. Uncomplicated post-operative course.",
        plan: "Discharge home with wound care instructions. Activity as tolerated.",
        followUp: "Surgical follow-up in 2 weeks for wound check.",
      },
      medications: ["Ibuprofen 600mg q6h PRN pain", "Acetaminophen 650mg q6h PRN pain"],
      procedures: ["Laparoscopic appendectomy"],
      documents: ["Operative report", "Pathology report"],
    },
    {
      id: 5,
      name: "Robert Brown",
      age: 72,
      room: "Ward-210",
      diagnosis: "Hip Replacement",
      admissionDate: "2024-01-11",
      expectedDischarge: "2024-01-17",
      status: "planning",
      pendingTasks: ["PT evaluation", "Home care arrangement", "Follow-up scheduling"],
      clinicalNotes: {
        chiefComplaint: "Left hip pain and mobility issues",
        hpi: "72-year-old male with severe osteoarthritis of left hip, progressive worsening over 2 years.",
        examination:
          "Post-operative day 4. Surgical site healing well. Patient ambulating with walker. Good pain control.",
        assessment: "Status post left total hip arthroplasty. Satisfactory post-operative recovery.",
        plan: "Continue physical therapy. Discharge to home with home health services.",
        followUp: "Orthopedic follow-up in 2 weeks. X-rays at 6 weeks.",
      },
      medications: ["Oxycodone 5mg q4h PRN severe pain", "Acetaminophen 1000mg q8h", "Enoxaparin 40mg daily x 4 weeks"],
      procedures: ["Left total hip arthroplasty"],
      documents: ["Operative report", "X-rays", "PT evaluation"],
    },
  ]

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "stable":
        return "bg-green-100 text-green-800"
      case "improving":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDischargeStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-800"
      case "planning":
        return "bg-yellow-100 text-yellow-800"
      case "not-ready":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const generateAIDischarge = async (patientId: number) => {
    setIsGeneratingDischarge(true)
    setSelectedPatientForDischarge(patientId)

    // Find patient data
    const patient = [...inpatients, ...dischargeQueue].find((p) => p.id === patientId)
    if (!patient) return

    try {
      // Simulate AI processing time
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Generate comprehensive discharge summary based on patient data
      const dischargeSummary = `
**DISCHARGE SUMMARY**

**Patient:** ${patient.name}
**Age:** ${patient.age} years
**Medical Record Number:** MRN${String(patient.id).padStart(6, "0")}
**Admission Date:** ${patient.admissionDate}
**Discharge Date:** ${new Date().toLocaleDateString()}
**Length of Stay:** ${Math.ceil((new Date().getTime() - new Date(patient.admissionDate).getTime()) / (1000 * 60 * 60 * 24))} days

**CHIEF COMPLAINT:**
${patient.clinicalNotes?.chiefComplaint || "Not documented"}

**HISTORY OF PRESENT ILLNESS:**
${patient.clinicalNotes?.hpi || "Not documented"}

**HOSPITAL COURSE:**
The patient was admitted with ${patient.diagnosis.toLowerCase()}. During the hospitalization, the patient received appropriate medical management and showed ${patient.condition} clinical improvement. 

${
  patient.procedures
    ? `**PROCEDURES PERFORMED:**
${patient.procedures.map((proc) => `• ${proc}`).join("\n")}`
    : ""
}

**PHYSICAL EXAMINATION AT DISCHARGE:**
${patient.clinicalNotes?.examination || "Patient appears stable with no acute distress."}

**LABORATORY RESULTS:**
${patient.labResults ? patient.labResults.map((result) => `• ${result}`).join("\n") : "Within normal limits"}

**FINAL DIAGNOSIS:**
Primary: ${patient.diagnosis}

**DISCHARGE MEDICATIONS:**
${patient.medications ? patient.medications.map((med) => `• ${med}`).join("\n") : "None prescribed"}

**DISCHARGE CONDITION:**
Patient is in ${patient.condition} condition and ready for discharge home.

**ACTIVITY:**
Activity as tolerated. Follow specific restrictions as discussed.

**DIET:**
Regular diet as tolerated.

**FOLLOW-UP CARE:**
${patient.clinicalNotes?.followUp || "Follow up with primary care physician in 1-2 weeks."}

**DISCHARGE INSTRUCTIONS:**
• Take medications as prescribed
• Monitor for signs of complications
• Return to ED if symptoms worsen
• Keep all follow-up appointments
• Contact physician with any concerns

**PATIENT EDUCATION:**
Patient and family educated regarding diagnosis, medications, activity restrictions, and warning signs. All questions answered. Patient verbalized understanding of discharge instructions.

**Electronically signed by:** Dr. [Attending Physician]
**Date:** ${new Date().toLocaleDateString()}
**Time:** ${new Date().toLocaleTimeString()}
      `.trim()

      setGeneratedDischarge(dischargeSummary)

      // Generate specific discharge instructions
      const instructions = `
**SPECIFIC DISCHARGE INSTRUCTIONS FOR ${patient.name.toUpperCase()}:**

**MEDICATIONS:**
${patient.medications ? patient.medications.map((med) => `• Continue ${med} as prescribed`).join("\n") : "• No medications prescribed"}

**ACTIVITY RESTRICTIONS:**
• Gradually increase activity as tolerated
• Avoid heavy lifting (>10 lbs) for 2 weeks
• Follow up with physical therapy if recommended

**WARNING SIGNS - RETURN TO HOSPITAL IF:**
• Fever >101.5°F (38.6°C)
• Severe or worsening pain
• Difficulty breathing
• Signs of infection at surgical site (if applicable)
• Any concerning symptoms

**FOLLOW-UP APPOINTMENTS:**
${patient.clinicalNotes?.followUp || "• Schedule follow-up with primary care in 1-2 weeks"}

**CONTACT INFORMATION:**
• Hospital: (555) 123-4567
• On-call physician: (555) 123-4568
• Emergency: 911
      `.trim()

      setDischargeInstructions(instructions)

      // Generate follow-up plan
      const followUp = `
**COMPREHENSIVE FOLLOW-UP PLAN:**

**IMMEDIATE (1-2 weeks):**
• Primary care physician visit
• Medication review and reconciliation
• Wound check (if applicable)
• Symptom assessment

**SHORT-TERM (2-4 weeks):**
• Specialist follow-up as indicated
• Laboratory studies if needed
• Imaging studies if required
• Physical therapy evaluation

**LONG-TERM (1-3 months):**
• Ongoing management of chronic conditions
• Preventive care screening
• Lifestyle modifications counseling
• Medication optimization

**CARE COORDINATION:**
• Discharge summary sent to primary care physician
• Specialist referrals initiated
• Home health services arranged if needed
• Prescription sent to preferred pharmacy
      `.trim()

      setFollowUpInstructions(followUp)

      toast({
        title: "AI Discharge Summary Generated",
        description: "Comprehensive discharge documentation has been prepared using AI analysis",
      })
    } catch (error) {
      toast({
        title: "Error Generating Discharge",
        description: "Failed to generate AI discharge summary. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingDischarge(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to Clipboard",
      description: "Content has been copied to clipboard",
    })
  }

  const saveDischarge = () => {
    toast({
      title: "Discharge Summary Saved",
      description: "AI-generated discharge summary has been saved to patient record",
    })
  }

  const sendDischarge = () => {
    toast({
      title: "Discharge Summary Sent",
      description: "Discharge summary sent to patient, pharmacy, and primary care physician",
    })
  }

  return (
    <PrivateRoute modulePath="admin/doctors/rounds" action="view">
      <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Rounds & Discharge Planning</h1>
        <div className="flex gap-3">
          <Select value={selectedWard} onValueChange={setSelectedWard}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Ward" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Wards</SelectItem>
              <SelectItem value="ICU">ICU</SelectItem>
              <SelectItem value="CCU">CCU</SelectItem>
              <SelectItem value="General">General Ward</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Link href="/inpatient/admission">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Admission
            </Button>
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="rounds">Patient Rounds</TabsTrigger>
          <TabsTrigger value="discharge">Discharge Planning</TabsTrigger>
          <TabsTrigger value="ai-discharge">AI Discharge</TabsTrigger>
          <TabsTrigger value="census">Ward Census</TabsTrigger>
        </TabsList>

        <TabsContent value="rounds" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {inpatients
              .filter((patient) => selectedWard === "all" || patient.ward === selectedWard)
              .map((patient) => (
                <Card key={patient.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold">{patient.name}</h3>
                            <Badge variant="outline">{patient.age} years</Badge>
                            <Badge className={getConditionColor(patient.condition)}>{patient.condition}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Bed className="h-4 w-4" />
                              {patient.room} ({patient.ward})
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Admitted: {patient.admissionDate}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Last rounds: {patient.lastRounds}
                            </div>
                          </div>
                          <p className="text-sm font-medium text-gray-900">Diagnosis: {patient.diagnosis}</p>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <Link href={`/doctors/patient/${patient.id}`}>
                          <Button size="sm">
                            <ArrowRight className="h-4 w-4 mr-2" />
                            View Patient
                          </Button>
                        </Link>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Current Vitals</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-red-500" />
                            <span>BP: {patient.vitals.bp}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-green-500" />
                            <span>HR: {patient.vitals.hr}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Thermometer className="h-4 w-4 text-blue-500" />
                            <span>Temp: {patient.vitals.temp}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-purple-500" />
                            <span>SpO2: {patient.vitals.spo2}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Active Alerts</h4>
                        <div className="space-y-1">
                          {patient.alerts.map((alert, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              <span>{alert}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Add Rounds Note
                      </Button>
                      <Link href={`/vitals/patient/${patient.id}`}>
                        <Button size="sm" variant="outline">
                          <Activity className="h-4 w-4 mr-2" />
                          Record Vitals
                        </Button>
                      </Link>
                      <Link href={`/prescriptions/create?patient=${patient.id}`}>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          New Orders
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="discharge" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {dischargeQueue.map((patient) => (
              <Card key={patient.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">{patient.name}</h3>
                          <Badge variant="outline">{patient.age} years</Badge>
                          <Badge className={getDischargeStatusColor(patient.status)}>{patient.status}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            {patient.room}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Admitted: {patient.admissionDate}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Expected discharge: {patient.expectedDischarge}
                          </div>
                        </div>
                        <p className="text-sm font-medium text-gray-900">Diagnosis: {patient.diagnosis}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Link href={`/doctors/patient/${patient.id}`}>
                        <Button size="sm">
                          <ArrowRight className="h-4 w-4 mr-2" />
                          View Patient
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2">Pending Discharge Tasks</h4>
                    <div className="space-y-2">
                      {patient.pendingTasks.map((task, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-gray-400" />
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Discharge Summary
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Follow-up
                    </Button>
                    <Button size="sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Discharge
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-discharge" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-purple-600" />
                AI-Powered Discharge Summary Generator
              </CardTitle>
              <p className="text-sm text-gray-600">
                Select a patient to generate comprehensive discharge documentation using AI analysis of clinical notes,
                lab results, and uploaded documents.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Patient Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Select Patient for Discharge</h3>
                  <div className="space-y-3">
                    {[...inpatients, ...dischargeQueue].map((patient) => (
                      <Card key={patient.id} className="hover:shadow-sm transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium">{patient.name}</p>
                                <p className="text-sm text-gray-600">
                                  {patient.diagnosis} • Room {patient.room}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => generateAIDischarge(patient.id)}
                              disabled={isGeneratingDischarge}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              {isGeneratingDischarge && selectedPatientForDischarge === patient.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-4 w-4 mr-2" />
                                  Generate AI Discharge
                                </>
                              )}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* AI Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">AI Analysis Features</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-blue-50">
                      <div className="flex items-center gap-3">
                        <FileCheck className="h-6 w-6 text-purple-600" />
                        <div>
                          <p className="font-medium">Clinical Notes Analysis</p>
                          <p className="text-sm text-gray-600">
                            AI analyzes admission notes, daily progress notes, and clinical assessments
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-green-50">
                      <div className="flex items-center gap-3">
                        <Activity className="h-6 w-6 text-blue-600" />
                        <div>
                          <p className="font-medium">Lab Results Integration</p>
                          <p className="text-sm text-gray-600">
                            Incorporates all laboratory findings and diagnostic results
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-yellow-50">
                      <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="font-medium">Document Processing</p>
                          <p className="text-sm text-gray-600">
                            Reviews uploaded documents, reports, and imaging studies
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-yellow-50 to-red-50">
                      <div className="flex items-center gap-3">
                        <Bot className="h-6 w-6 text-yellow-600" />
                        <div>
                          <p className="font-medium">Smart Recommendations</p>
                          <p className="text-sm text-gray-600">
                            Generates follow-up plans and medication reconciliation
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generated Discharge Summary */}
          {generatedDischarge && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Discharge Summary */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-5 w-5 text-green-600" />
                        AI-Generated Discharge Summary
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(generatedDischarge)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm font-mono">{generatedDischarge}</pre>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <Button onClick={saveDischarge} className="bg-green-600 hover:bg-green-700">
                        <Save className="h-4 w-4 mr-2" />
                        Save to Patient Record
                      </Button>
                      <Button onClick={sendDischarge} variant="outline">
                        <Send className="h-4 w-4 mr-2" />
                        Send to Patient & Providers
                      </Button>
                      <Button variant="outline" onClick={() => generateAIDischarge(selectedPatientForDischarge!)}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Discharge Instructions & Follow-up */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      Patient Instructions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <pre className="whitespace-pre-wrap text-xs">{dischargeInstructions}</pre>
                    </div>
                    <Button
                      size="sm"
                      className="mt-3 w-full bg-transparent"
                      variant="outline"
                      onClick={() => copyToClipboard(dischargeInstructions)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Instructions
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      Follow-up Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <pre className="whitespace-pre-wrap text-xs">{followUpInstructions}</pre>
                    </div>
                    <Button
                      size="sm"
                      className="mt-3 w-full bg-transparent"
                      variant="outline"
                      onClick={() => copyToClipboard(followUpInstructions)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Follow-up Plan
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* AI Processing Status */}
          {isGeneratingDischarge && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center space-x-4">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                  <div className="text-center">
                    <p className="text-lg font-medium">AI is analyzing patient data...</p>
                    <p className="text-sm text-gray-600">Processing clinical notes, lab results, and documents</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Clinical notes analyzed</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Laboratory results processed</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    <span>Generating discharge summary...</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="census" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>ICU</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600">8/10</p>
                  <p className="text-sm text-gray-600">Occupied Beds</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CCU</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">6/8</p>
                  <p className="text-sm text-gray-600">Occupied Beds</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>General Ward</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">24/30</p>
                  <p className="text-sm text-gray-600">Occupied Beds</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Ward Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">Total Inpatients</span>
                  <span className="text-2xl font-bold">38</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">Expected Discharges Today</span>
                  <span className="text-2xl font-bold text-green-600">5</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">Pending Admissions</span>
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">Critical Patients</span>
                  <span className="text-2xl font-bold text-red-600">2</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </PrivateRoute>
  )
}

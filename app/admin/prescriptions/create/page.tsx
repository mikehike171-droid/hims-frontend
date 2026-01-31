"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { frontOfficeApi } from "@/lib/frontOfficeApi"
import { useBranch } from "@/contexts/branch-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  FileText,
  Plus,
  Trash2,
  AlertTriangle,
  Mic,
  MicOff,
  Calendar,
  Printer,
  MessageSquare,
  Mail,
  User,
  Stethoscope,
  CreditCard,
  History,
  Search,
  Clock,
  Pill,
  TestTube,
  Heart,
  Activity,
  Thermometer,
  Phone,
  MapPin,
  Users,
  Bed,
  Download,
  Eye,
} from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"

interface Medicine {
  id: string
  drugId: string
  drugName: string
  genericName: string
  strength: string
  dosageForm: string
  route: string
  dose: string
  frequency: string
  duration: string
  beforeAfterFood: string
  instructions: string
  quantity: number
}

interface LabTest {
  id: string
  testId: string
  testName: string
  urgency: string
  cost: number
  instructions: string
}

// Patient interface moved to frontOfficeApi.ts

interface Referral {
  id: string
  fromDoctorId: string
  fromDoctorName: string
  toDoctorId: string
  toDoctorName: string
  department: string
  reason: string
  date: string
  status: "pending" | "accepted" | "completed"
}

interface PrescriptionHistory {
  id: string
  date: string
  diagnosis: string
  medicines: string[]
  doctor: string
  notes: string
}

interface LabReport {
  id: string
  testName: string
  date: string
  result: string
  status: "normal" | "abnormal" | "critical"
  reportUrl: string
}

export default function CreatePrescription() {
  const { selectedBranch } = useBranch()
  const [patientSearchTerm, setPatientSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [labTests, setLabTests] = useState<LabTest[]>([])
  const [voiceTranscript, setVoiceTranscript] = useState("")
  const [drugAlerts, setDrugAlerts] = useState<any[]>([])
  const [showVitals, setShowVitals] = useState(false)
  const [showPastPrescriptions, setShowPastPrescriptions] = useState(false)
  const [showLabReports, setShowLabReports] = useState(false)
  const [medicineSearchOpen, setMedicineSearchOpen] = useState(false)
  const [labTestSearchOpen, setLabTestSearchOpen] = useState(false)
  const [medicineSearchTerm, setMedicineSearchTerm] = useState("")
  const [labTestSearchTerm, setLabTestSearchTerm] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [referralHistoryState, setReferralHistory] = useState<Referral[]>([])
  const [currentReferral, setCurrentReferral] = useState<Referral | null>(null)
  const [showScribblingPad, setShowScribblingPad] = useState(false)
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 })
  const [canvasData, setCanvasData] = useState<string>("")
  const [isProcessingHandwriting, setIsProcessingHandwriting] = useState(false)

  // New state for admission recommendation
  const [recommendAdmission, setRecommendAdmission] = useState(false)
  const [admissionReason, setAdmissionReason] = useState("")
  const [admissionUrgency, setAdmissionUrgency] = useState("routine")


  // Real patient search
  const searchPatients = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const locationId = selectedBranch?.id
      const results = await frontOfficeApi.searchPatients(query, locationId)
      setSearchResults(results)
    } catch (error) {
      console.error('Patient search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }



  // Mock prescription history
  const prescriptionHistory: PrescriptionHistory[] = [
    {
      id: "RX001",
      date: "2024-01-15",
      diagnosis: "Hypertension",
      medicines: ["Amlodipine 5mg BD", "Metformin 500mg BD"],
      doctor: "Dr. Rajesh Kumar",
      notes: "Blood pressure controlled, continue medication",
    },
    {
      id: "RX002",
      date: "2024-01-10",
      diagnosis: "Upper Respiratory Infection",
      medicines: ["Amoxicillin 500mg TID", "Paracetamol 500mg SOS"],
      doctor: "Dr. Amit Singh",
      notes: "Complete antibiotic course",
    },
    {
      id: "RX003",
      date: "2024-01-05",
      diagnosis: "Diabetes Type 2",
      medicines: ["Metformin 500mg BD", "Glimepiride 2mg OD"],
      doctor: "Dr. Priya Sharma",
      notes: "Monitor blood sugar levels",
    },
  ]

  // Mock lab reports
  const labReports: LabReport[] = [
    {
      id: "LAB001",
      testName: "Complete Blood Count",
      date: "2024-01-18",
      result: "Hemoglobin: 12.5 g/dL (Normal)",
      status: "normal",
      reportUrl: "/reports/lab001.pdf",
    },
    {
      id: "LAB002",
      testName: "Lipid Profile",
      date: "2024-01-16",
      result: "Total Cholesterol: 245 mg/dL (High)",
      status: "abnormal",
      reportUrl: "/reports/lab002.pdf",
    },
    {
      id: "LAB003",
      testName: "HbA1c",
      date: "2024-01-14",
      result: "HbA1c: 8.2% (Poor Control)",
      status: "critical",
      reportUrl: "/reports/lab003.pdf",
    },
  ]

  // Enhanced drug database with more realistic data
  const drugDatabase = [
    {
      id: "1",
      drugName: "Paracetamol",
      genericName: "Acetaminophen",
      brandNames: ["Crocin", "Dolo", "Calpol"],
      strength: "500mg",
      dosageForms: ["Tablet", "Syrup"],
      routes: ["Oral"],
      interactions: ["Warfarin", "Alcohol"],
      contraindications: ["Liver disease"],
      commonDoses: ["500mg", "650mg", "1000mg"],
      commonFrequencies: ["TID", "QID", "SOS"],
      category: "Analgesic",
    },
    {
      id: "2",
      drugName: "Amoxicillin",
      genericName: "Amoxicillin",
      brandNames: ["Novamox", "Amoxil", "Wymox"],
      strength: "500mg",
      dosageForms: ["Capsule", "Syrup", "Injection"],
      routes: ["Oral", "IV"],
      interactions: ["Warfarin", "Methotrexate"],
      contraindications: ["Penicillin allergy"],
      commonDoses: ["250mg", "500mg", "875mg"],
      commonFrequencies: ["TID", "BD"],
      category: "Antibiotic",
    },
    {
      id: "3",
      drugName: "Omeprazole",
      genericName: "Omeprazole",
      brandNames: ["Prilosec", "Omez", "Losec"],
      strength: "20mg",
      dosageForms: ["Capsule", "Tablet"],
      routes: ["Oral"],
      interactions: ["Clopidogrel", "Warfarin"],
      contraindications: ["Hypersensitivity"],
      commonDoses: ["20mg", "40mg"],
      commonFrequencies: ["OD", "BD"],
      category: "PPI",
    },
  ]

  // Enhanced lab tests database
  const labTestsDatabase = [
    { id: "1", name: "Complete Blood Count", code: "CBC", cost: 300, category: "Blood", turnaround: "4 hours" },
    { id: "2", name: "Fasting Blood Sugar", code: "FBS", cost: 150, category: "Blood", turnaround: "2 hours" },
    { id: "3", name: "Lipid Profile", code: "LIPID", cost: 500, category: "Blood", turnaround: "6 hours" },
    { id: "4", name: "Thyroid Function Test", code: "TFT", cost: 800, category: "Blood", turnaround: "24 hours" },
    { id: "5", name: "Urine Routine", code: "URINE", cost: 200, category: "Urine", turnaround: "2 hours" },
  ]

  const patientVitals = {
    temperature: 38.2,
    bloodPressure: "160/95",
    heartRate: 105,
    oxygenSaturation: 94,
    painScale: 3,
    recordedBy: "Nurse Sarah Johnson",
    recordedAt: "2024-01-20 10:15",
    alerts: [
      { type: "warning", message: "Elevated Temperature: 38.2°C" },
      { type: "warning", message: "Hypertension Stage 2: 160/95 mmHg" },
    ],
  }

  const [prescriptionData, setPrescriptionData] = useState({
    chiefComplaint: "",
    diagnosis: "",
    examinationFindings: "",
    followUpDate: "",
    followUpInstructions: "",
    referralDoctor: "",
    referralReason: "",
    deliveryMethod: "print",
  })

  // Use search results instead of filtered mock data
  const filteredPatients = searchResults

  // Filter medicines based on search
  const filteredMedicines = drugDatabase.filter(
    (drug) =>
      drug.drugName.toLowerCase().includes(medicineSearchTerm.toLowerCase()) ||
      drug.genericName.toLowerCase().includes(medicineSearchTerm.toLowerCase()) ||
      drug.category.toLowerCase().includes(medicineSearchTerm.toLowerCase()) ||
      drug.brandNames.some((brand) => brand.toLowerCase().includes(medicineSearchTerm.toLowerCase())),
  )

  // Filter lab tests based on search
  const filteredLabTests = labTestsDatabase.filter(
    (test) =>
      test.name.toLowerCase().includes(labTestSearchTerm.toLowerCase()) ||
      test.code.toLowerCase().includes(labTestSearchTerm.toLowerCase()) ||
      test.category.toLowerCase().includes(labTestSearchTerm.toLowerCase()),
  )

  // Check for drug interactions and allergies
  useEffect(() => {
    if (selectedPatient && medicines.length > 0) {
      checkDrugInteractions()
    }
  }, [medicines, selectedPatient])

  const checkDrugInteractions = () => {
    const alerts = []

    // Check for drug-allergy interactions
    medicines.forEach((medicine) => {
      const drug = drugDatabase.find((d) => d.id === medicine.drugId)
      if (drug && selectedPatient) {
        selectedPatient.allergies.forEach((allergy) => {
          const hasAllergyInteraction = drug.contraindications.some((contraindication) =>
            contraindication.toLowerCase().includes(allergy.toLowerCase()),
          )
          if (hasAllergyInteraction) {
            alerts.push({
              type: "allergy-interaction",
              severity: "critical",
              message: `⚠️ ALLERGY ALERT: ${drug.drugName} contraindicated due to ${allergy} allergy`,
              recommendation: "DO NOT PRESCRIBE - Find alternative medication",
            })
          }
        })
      }
    })

    setDrugAlerts(alerts)
  }

  const addMedicineQuick = (drugId: string) => {
    const selectedDrug = drugDatabase.find((d) => d.id === drugId)
    if (selectedDrug) {
      const newMedicine: Medicine = {
        id: Date.now().toString(),
        drugId: drugId,
        drugName: selectedDrug.drugName,
        genericName: selectedDrug.genericName,
        strength: selectedDrug.strength,
        dosageForm: selectedDrug.dosageForms[0],
        route: selectedDrug.routes[0],
        dose: selectedDrug.commonDoses[0],
        frequency: selectedDrug.commonFrequencies[0],
        duration: "5 days",
        beforeAfterFood: "after",
        instructions: "",
        quantity: 10,
      }
      setMedicines([...medicines, newMedicine])
      setMedicineSearchOpen(false)
      setMedicineSearchTerm("")
    }
  }

  const addLabTestQuick = (testId: string) => {
    const selectedTest = labTestsDatabase.find((t) => t.id === testId)
    if (selectedTest) {
      const newTest: LabTest = {
        id: Date.now().toString(),
        testId: testId,
        testName: selectedTest.name,
        urgency: "routine",
        cost: selectedTest.cost,
        instructions: "",
      }
      setLabTests([...labTests, newTest])
      setLabTestSearchOpen(false)
      setLabTestSearchTerm("")
    }
  }

  const updateMedicine = (id: string, field: string, value: string) => {
    setMedicines(
      medicines.map((med) => {
        if (med.id === id) {
          return { ...med, [field]: value }
        }
        return med
      }),
    )
  }

  const removeMedicine = (id: string) => {
    setMedicines(medicines.filter((med) => med.id !== id))
  }

  const removeLabTest = (id: string) => {
    setLabTests(labTests.filter((test) => test.id !== id))
  }

  const startVoiceRecording = () => {
    setIsRecording(true)
    setTimeout(() => {
      setVoiceTranscript(
        "Patient presents with fever and headache for 2 days. On examination, temperature is elevated at 38.2 degrees Celsius. Blood pressure is high at 160/95. Recommend paracetamol for fever and follow up in 3 days. Consider blood pressure monitoring.",
      )
      setIsRecording(false)
    }, 3000)
  }

  const savePrescription = () => {
    if (!selectedPatient || medicines.length === 0) {
      alert("Please select a patient and add at least one medicine")
      return
    }

    if (drugAlerts.some((alert) => alert.severity === "critical")) {
      alert("Cannot save prescription due to critical drug allergy interactions!")
      return
    }

    // Auto-send to pharmacy and lab if items exist
    if (medicines.length > 0) {
      sendToPharmacy()
    }

    if (labTests.length > 0) {
      sendToLab()
    }

    // Handle admission recommendation
    if (recommendAdmission) {
      handleAdmissionRecommendation()
    }

    alert("Prescription saved successfully!")
  }

  const sendToPharmacy = () => {
    if (medicines.length === 0) {
      alert("No medicines to send to pharmacy")
      return
    }

    const pharmacyData = {
      prescriptionId: `RX${Date.now()}`,
      patientId: selectedPatient?.id,
      patientName: selectedPatient?.name,
      medicines: medicines,
      doctorName: "Dr. Current Doctor",
      date: new Date().toISOString(),
      status: "pending",
    }

    console.log("Sending to Pharmacy:", pharmacyData)
    alert(`Prescription sent to Pharmacy successfully! 
Prescription ID: ${pharmacyData.prescriptionId}
${medicines.length} medicines queued for dispensing.`)
  }

  const sendToLab = () => {
    if (labTests.length === 0) {
      alert("No lab tests to send to laboratory")
      return
    }

    const labData = {
      requisitionId: `LAB${Date.now()}`,
      patientId: selectedPatient?.id,
      patientName: selectedPatient?.name,
      tests: labTests,
      doctorName: "Dr. Current Doctor",
      date: new Date().toISOString(),
      priority: labTests.some((test) => test.urgency === "stat") ? "STAT" : "routine",
      status: "pending",
    }

    console.log("Sending to Lab:", labData)
    alert(`Lab requisition sent successfully!
Requisition ID: ${labData.requisitionId}
${labTests.length} tests ordered.
Priority: ${labData.priority}`)
  }

  const handleAdmissionRecommendation = () => {
    const admissionData = {
      patientId: selectedPatient?.id,
      patientName: selectedPatient?.name,
      recommendingDoctor: "Dr. Current Doctor",
      reason: admissionReason,
      urgency: admissionUrgency,
      date: new Date().toISOString(),
      status: "recommended",
    }

    console.log("Admission Recommendation:", admissionData)
    alert(`Admission recommended for ${selectedPatient?.name}
Reason: ${admissionReason}
Urgency: ${admissionUrgency}
Inpatient department will be notified.`)
  }

  const sendPrescription = (method: string) => {
    if (method === "whatsapp") {
      alert("Prescription sent to patient's WhatsApp successfully!")
    } else if (method === "email") {
      alert("Prescription sent to patient's email successfully!")
    } else {
      window.print()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600"
      case "abnormal":
        return "text-yellow-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <PrivateRoute modulePath="admin/prescriptions/create" action="view">
      <div className="p-6 space-y-6">
      {/* Enhanced Header with Patient Search */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-red-800">E-Prescription System</h1>
            <p className="text-red-600">AI-powered digital prescription with smart recommendations</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowScribblingPad(true)}
              variant="outline"
              className="bg-blue-50 hover:bg-blue-100"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Scribbling Pad
            </Button>
            <Button onClick={() => setShowPreview(true)} variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={savePrescription} className="bg-red-600 hover:bg-red-700">
              <FileText className="h-4 w-4 mr-2" />
              Save & Send
            </Button>
          </div>
        </div>

        {/* Patient Search */}
        <div className="relative">

          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Input
                placeholder="Enter mobile number, name, or patient ID..."
                value={patientSearchTerm}
                onChange={(e) => setPatientSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchPatients(patientSearchTerm)}
                className="bg-white border-red-200 focus:border-red-400 pr-20"
              />
              <Button
                onClick={() => searchPatients(patientSearchTerm)}
                disabled={!patientSearchTerm.trim() || isSearching}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-3 bg-red-600 hover:bg-red-700"
                size="sm"
              >
                {isSearching ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Patient Search Results */}
          {patientSearchTerm && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-red-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
              {/* Debug info */}
              <div className="p-2 bg-gray-100 text-xs text-gray-600 border-b">
                Search: "{patientSearchTerm}" | Results: {filteredPatients.length} | Loading: {isSearching ? 'Yes' : 'No'}
              </div>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="p-4 hover:bg-red-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => {
                      setSelectedPatient(patient)
                      setPatientSearchTerm("")
                      setSearchResults([])
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Users className="h-3 w-3 mr-1" />
                              {patient.age}Y, {patient.gender}
                            </span>
                            <span className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {patient.phone}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {patient.address}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {patient.tokenNumber}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {patient.department}
                            </Badge>
                            {patient.allergies.length > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {patient.allergies.length} Allergies
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          {patient.vitalsCompleted && <Stethoscope className="h-4 w-4 text-green-600" />}
                          {patient.hasCriticalVitals && <AlertTriangle className="h-4 w-4 text-red-600" />}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : isSearching ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin h-6 w-6 border-2 border-red-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p>Searching patients...</p>
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <User className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No patients found</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedPatient && (
        <>
          {/* Enhanced Patient Info Card */}
          <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-red-800">{selectedPatient.name}</h2>
                    <div className="flex items-center space-x-4 text-red-600 mt-1">
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {selectedPatient.age}Y, {selectedPatient.gender}
                      </span>
                      <span className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {selectedPatient.phone}
                      </span>
                      <span className="flex items-center">
                        <Badge variant="outline" className="bg-white">
                          {selectedPatient.tokenNumber}
                        </Badge>
                      </span>
                    </div>
                    {selectedPatient.allergies.length > 0 && (
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="destructive">⚠️ {selectedPatient.allergies.length} Allergies</Badge>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setShowVitals(!showVitals)}>
                    <Stethoscope className="h-4 w-4 mr-1" />
                    Vitals
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowPastPrescriptions(!showPastPrescriptions)}>
                    <History className="h-4 w-4 mr-1" />
                    History
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowLabReports(!showLabReports)}>
                    <TestTube className="h-4 w-4 mr-1" />
                    Lab Reports
                  </Button>
                </div>
              </div>

              {/* Patient Allergies Alert */}
              {selectedPatient.allergies.length > 0 && (
                <Alert className="mt-4 border-red-300 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Patient Allergies:</strong> {selectedPatient.allergies.join(", ")}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Previous Prescriptions */}
          {showPastPrescriptions && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Previous Prescriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prescriptionHistory.map((prescription) => (
                    <div key={prescription.id} className="p-4 bg-white rounded-lg border border-blue-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-blue-800">{prescription.diagnosis}</p>
                          <p className="text-sm text-blue-600">
                            {prescription.doctor} • {prescription.date}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                      <div className="mb-2">
                        <p className="text-sm font-medium text-gray-700">Medicines:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {prescription.medicines.map((medicine, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {medicine}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {prescription.notes && <p className="text-sm text-gray-600 italic">{prescription.notes}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lab Reports */}
          {showLabReports && (
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="text-purple-800 flex items-center">
                  <TestTube className="h-5 w-5 mr-2" />
                  Lab Reports & Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {labReports.map((report) => (
                    <div key={report.id} className="p-4 bg-white rounded-lg border border-purple-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-semibold text-purple-800">{report.testName}</p>
                            <Badge
                              className={`text-xs ${
                                report.status === "normal"
                                  ? "bg-green-100 text-green-800"
                                  : report.status === "abnormal"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {report.status.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-purple-600 mb-1">{report.date}</p>
                          <p className={`text-sm font-medium ${getStatusColor(report.status)}`}>{report.result}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vitals Display */}
          {showVitals && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center">
                  <Stethoscope className="h-5 w-5 mr-2" />
                  Current Vitals - {patientVitals.recordedBy}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-4 bg-white rounded-lg border-2 border-red-200">
                    <Thermometer className="h-6 w-6 text-red-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Temperature</p>
                    <p className="text-xl font-bold text-red-600">{patientVitals.temperature}°C</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border-2 border-orange-200">
                    <Activity className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Blood Pressure</p>
                    <p className="text-xl font-bold text-orange-600">{patientVitals.bloodPressure}</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border-2 border-orange-200">
                    <Heart className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Heart Rate</p>
                    <p className="text-xl font-bold text-orange-600">{patientVitals.heartRate} bpm</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border-2 border-orange-200">
                    <Activity className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">O₂ Saturation</p>
                    <p className="text-xl font-bold text-orange-600">{patientVitals.oxygenSaturation}%</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {patientVitals.alerts.map((alert, index) => (
                    <Alert key={index} className="border-orange-200 bg-orange-50">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-800">{alert.message}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Drug Alerts */}
          {drugAlerts.length > 0 && (
            <div className="space-y-2">
              {drugAlerts.map((alert, index) => (
                <Alert
                  key={index}
                  className={
                    alert.severity === "critical" ? "border-red-500 bg-red-50" : "border-orange-500 bg-orange-50"
                  }
                >
                  <AlertTriangle
                    className={`h-4 w-4 ${alert.severity === "critical" ? "text-red-600" : "text-orange-600"}`}
                  />
                  <AlertDescription>
                    <div className="flex justify-between items-start">
                      <div>
                        <p
                          className={`font-semibold ${alert.severity === "critical" ? "text-red-800" : "text-orange-800"}`}
                        >
                          {alert.message}
                        </p>
                        <p className={`text-sm ${alert.severity === "critical" ? "text-red-600" : "text-orange-600"}`}>
                          {alert.recommendation}
                        </p>
                      </div>
                      <Badge variant={alert.severity === "critical" ? "destructive" : "secondary"}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          <Tabs defaultValue="prescription" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="prescription">Clinical Notes</TabsTrigger>
              <TabsTrigger value="medicines">
                Medicines ({medicines.length}){medicines.length > 0 && <Pill className="h-4 w-4 ml-1" />}
              </TabsTrigger>
              <TabsTrigger value="tests">
                Lab Tests ({labTests.length}){labTests.length > 0 && <TestTube className="h-4 w-4 ml-1" />}
              </TabsTrigger>
              <TabsTrigger value="admission">
                Admission {recommendAdmission && <Bed className="h-4 w-4 ml-1 text-red-600" />}
              </TabsTrigger>
              <TabsTrigger value="followup">Follow-up & Delivery</TabsTrigger>
            </TabsList>

            {/* Clinical Notes Tab */}
            <TabsContent value="prescription">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Clinical Assessment</span>
                    <Button
                      onClick={isRecording ? () => setIsRecording(false) : startVoiceRecording}
                      variant={isRecording ? "destructive" : "outline"}
                      size="sm"
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="h-4 w-4 mr-2" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4 mr-2" />
                          Voice Dictation
                        </>
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Voice Recording */}
                  {isRecording && (
                    <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
                      <div className="flex items-center gap-2 text-red-600 mb-2">
                        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                        <span className="font-medium">Recording... Speak clearly</span>
                      </div>
                    </div>
                  )}

                  {voiceTranscript && (
                    <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                      <p className="text-green-800 font-medium mb-2">Voice Transcript:</p>
                      <p className="text-green-700">{voiceTranscript}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-base font-medium">Chief Complaint</Label>
                      <Textarea
                        value={prescriptionData.chiefComplaint}
                        onChange={(e) => setPrescriptionData({ ...prescriptionData, chiefComplaint: e.target.value })}
                        placeholder="Patient's main complaint..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-base font-medium">Diagnosis</Label>
                      <Textarea
                        value={prescriptionData.diagnosis}
                        onChange={(e) => setPrescriptionData({ ...prescriptionData, diagnosis: e.target.value })}
                        placeholder="Primary and secondary diagnosis..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Examination Findings</Label>
                    <Textarea
                      value={prescriptionData.examinationFindings}
                      onChange={(e) =>
                        setPrescriptionData({ ...prescriptionData, examinationFindings: e.target.value })
                      }
                      placeholder="Physical examination findings..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Medicines Tab */}
            <TabsContent value="medicines">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Pill className="h-5 w-5 mr-2 text-green-600" />
                      Medicines ({medicines.length})
                    </span>
                    <Popover open={medicineSearchOpen} onOpenChange={setMedicineSearchOpen}>
                      <PopoverTrigger asChild>
                        <Button className="bg-green-600 hover:bg-green-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Medicine
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-96 p-0" align="end">
                        <Command>
                          <CommandInput
                            placeholder="Search medicines..."
                            value={medicineSearchTerm}
                            onValueChange={setMedicineSearchTerm}
                          />
                          <CommandList>
                            <CommandEmpty>No medicines found.</CommandEmpty>
                            <CommandGroup heading="Available Medicines">
                              {filteredMedicines.map((drug) => (
                                <CommandItem
                                  key={drug.id}
                                  onSelect={() => addMedicineQuick(drug.id)}
                                  className="cursor-pointer"
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <div>
                                      <p className="font-medium">{drug.drugName}</p>
                                      <p className="text-sm text-gray-600">
                                        {drug.genericName} - {drug.strength}
                                      </p>
                                      <div className="flex gap-1 mt-1">
                                        <Badge variant="outline" className="text-xs">
                                          {drug.category}
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs">
                                          {drug.dosageForms[0]}
                                        </Badge>
                                      </div>
                                    </div>
                                    <Plus className="h-4 w-4 text-green-600" />
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {medicines.map((medicine, index) => (
                      <div key={medicine.id} className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-green-800">{medicine.drugName}</h3>
                            <p className="text-sm text-green-600">{medicine.genericName}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-600">{index + 1}</Badge>
                            <Button
                              onClick={() => removeMedicine(medicine.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 border-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <Label className="text-xs font-medium text-green-700">Dose</Label>
                            <Select
                              value={medicine.dose}
                              onValueChange={(value) => updateMedicine(medicine.id, "dose", value)}
                            >
                              <SelectTrigger className="h-8 bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {drugDatabase
                                  .find((d) => d.id === medicine.drugId)
                                  ?.commonDoses.map((dose) => (
                                    <SelectItem key={dose} value={dose}>
                                      {dose}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-green-700">Frequency</Label>
                            <Select
                              value={medicine.frequency}
                              onValueChange={(value) => updateMedicine(medicine.id, "frequency", value)}
                            >
                              <SelectTrigger className="h-8 bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="OD">Once Daily (OD)</SelectItem>
                                <SelectItem value="BD">Twice Daily (BD)</SelectItem>
                                <SelectItem value="TID">Three Times (TID)</SelectItem>
                                <SelectItem value="QID">Four Times (QID)</SelectItem>
                                <SelectItem value="SOS">As Needed (SOS)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-green-700">Duration</Label>
                            <Select
                              value={medicine.duration}
                              onValueChange={(value) => updateMedicine(medicine.id, "duration", value)}
                            >
                              <SelectTrigger className="h-8 bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="3 days">3 days</SelectItem>
                                <SelectItem value="5 days">5 days</SelectItem>
                                <SelectItem value="7 days">7 days</SelectItem>
                                <SelectItem value="10 days">10 days</SelectItem>
                                <SelectItem value="15 days">15 days</SelectItem>
                                <SelectItem value="30 days">30 days</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-green-700">Food</Label>
                            <Select
                              value={medicine.beforeAfterFood}
                              onValueChange={(value) => updateMedicine(medicine.id, "beforeAfterFood", value)}
                            >
                              <SelectTrigger className="h-8 bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="before">Before Food</SelectItem>
                                <SelectItem value="after">After Food</SelectItem>
                                <SelectItem value="with">With Food</SelectItem>
                                <SelectItem value="empty">Empty Stomach</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Label className="text-xs font-medium text-green-700">Special Instructions</Label>
                          <Input
                            value={medicine.instructions}
                            onChange={(e) => updateMedicine(medicine.id, "instructions", e.target.value)}
                            placeholder="Additional instructions..."
                            className="mt-1 h-8 bg-white"
                          />
                        </div>
                      </div>
                    ))}
                    {medicines.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Pill className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>No medicines added yet</p>
                        <p className="text-sm">Click "Add Medicine" to start prescribing</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Enhanced Lab Tests Tab */}
            <TabsContent value="tests">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <TestTube className="h-5 w-5 mr-2 text-blue-600" />
                      Lab Tests ({labTests.length})
                    </span>
                    <Popover open={labTestSearchOpen} onOpenChange={setLabTestSearchOpen}>
                      <PopoverTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Test
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-96 p-0" align="end">
                        <Command>
                          <CommandInput
                            placeholder="Search lab tests..."
                            value={labTestSearchTerm}
                            onValueChange={setLabTestSearchTerm}
                          />
                          <CommandList>
                            <CommandEmpty>No tests found.</CommandEmpty>
                            <CommandGroup heading="Available Tests">
                              {filteredLabTests.map((test) => (
                                <CommandItem
                                  key={test.id}
                                  onSelect={() => addLabTestQuick(test.id)}
                                  className="cursor-pointer"
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <div>
                                      <p className="font-medium">{test.name}</p>
                                      <p className="text-sm text-gray-600">
                                        {test.code} - ₹{test.cost}
                                      </p>
                                      <div className="flex gap-1 mt-1">
                                        <Badge variant="outline" className="text-xs">
                                          {test.category}
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs">
                                          <Clock className="h-3 w-3 mr-1" />
                                          {test.turnaround}
                                        </Badge>
                                      </div>
                                    </div>
                                    <Plus className="h-4 w-4 text-blue-600" />
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {labTests.map((test, index) => (
                      <div key={test.id} className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-blue-800">{test.testName}</h3>
                            <p className="text-sm text-blue-600">₹{test.cost}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-600">{index + 1}</Badge>
                            <Button
                              onClick={() => removeLabTest(test.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 border-red-300"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs font-medium text-blue-700">Urgency</Label>
                            <Select value={test.urgency} onValueChange={(value) => {}}>
                              <SelectTrigger className="h-8 bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="routine">Routine</SelectItem>
                                <SelectItem value="urgent">Urgent</SelectItem>
                                <SelectItem value="stat">STAT</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs font-medium text-blue-700">Special Instructions</Label>
                            <Input
                              value={test.instructions}
                              onChange={(e) => {}}
                              placeholder="Special instructions..."
                              className="h-8 bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {labTests.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <TestTube className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>No lab tests ordered yet</p>
                        <p className="text-sm">Click "Add Test" to order investigations</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* New Admission Recommendation Tab */}
            <TabsContent value="admission">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bed className="h-5 w-5 mr-2 text-red-600" />
                    Admission Recommendation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="recommend-admission"
                      checked={recommendAdmission}
                      onCheckedChange={setRecommendAdmission}
                    />
                    <Label htmlFor="recommend-admission" className="font-medium">
                      Recommend patient for admission
                    </Label>
                  </div>

                  {recommendAdmission && (
                    <div className="space-y-4 p-4 border-2 border-red-200 rounded-lg bg-red-50">
                      <div>
                        <Label className="text-base font-medium text-red-700">Reason for Admission</Label>
                        <Textarea
                          value={admissionReason}
                          onChange={(e) => setAdmissionReason(e.target.value)}
                          placeholder="Explain why the patient needs to be admitted..."
                          rows={4}
                          className="mt-1 bg-white"
                        />
                      </div>

                      <div>
                        <Label className="text-base font-medium text-red-700">Urgency Level</Label>
                        <Select value={admissionUrgency} onValueChange={setAdmissionUrgency}>
                          <SelectTrigger className="mt-1 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="routine">Routine Admission</SelectItem>
                            <SelectItem value="urgent">Urgent Admission</SelectItem>
                            <SelectItem value="emergency">Emergency Admission</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Alert className="border-red-300 bg-red-100">
                        <Bed className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          <strong>Admission Recommendation:</strong> The inpatient department will be notified and will
                          coordinate with the patient for admission arrangements.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Follow-up & Delivery Tab */}
            <TabsContent value="followup">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                      Follow-up Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Follow-up Date</Label>
                      <Input
                        type="date"
                        value={prescriptionData.followUpDate}
                        onChange={(e) => setPrescriptionData({ ...prescriptionData, followUpDate: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Follow-up Instructions</Label>
                      <Textarea
                        value={prescriptionData.followUpInstructions}
                        onChange={(e) =>
                          setPrescriptionData({ ...prescriptionData, followUpInstructions: e.target.value })
                        }
                        placeholder="Instructions for follow-up visit..."
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-green-600" />
                      Doctor Referral
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Refer to Specialist</Label>
                      <Select
                        value={prescriptionData.referralDoctor}
                        onValueChange={(value) => setPrescriptionData({ ...prescriptionData, referralDoctor: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialist" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cardiology">Cardiology</SelectItem>
                          <SelectItem value="neurology">Neurology</SelectItem>
                          <SelectItem value="orthopedics">Orthopedics</SelectItem>
                          <SelectItem value="dermatology">Dermatology</SelectItem>
                          <SelectItem value="psychiatry">Psychiatry</SelectItem>
                          <SelectItem value="endocrinology">Endocrinology</SelectItem>
                          <SelectItem value="gastroenterology">Gastroenterology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Referral Reason</Label>
                      <Textarea
                        value={prescriptionData.referralReason}
                        onChange={(e) => setPrescriptionData({ ...prescriptionData, referralReason: e.target.value })}
                        placeholder="Reason for referral..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Prescription Delivery & Integration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-700">Patient Delivery</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="print"
                              checked={prescriptionData.deliveryMethod.includes("print")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setPrescriptionData({ ...prescriptionData, deliveryMethod: "print" })
                                }
                              }}
                            />
                            <Label htmlFor="print" className="flex items-center text-sm">
                              <Printer className="h-4 w-4 mr-2" />
                              Print Prescription
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="whatsapp"
                              checked={prescriptionData.deliveryMethod.includes("whatsapp")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setPrescriptionData({ ...prescriptionData, deliveryMethod: "whatsapp" })
                                }
                              }}
                            />
                            <Label htmlFor="whatsapp" className="flex items-center text-sm">
                              <MessageSquare className="h-4 w-4 mr-2 text-green-600" />
                              Send to WhatsApp
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="email"
                              checked={prescriptionData.deliveryMethod.includes("email")}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setPrescriptionData({ ...prescriptionData, deliveryMethod: "email" })
                                }
                              }}
                            />
                            <Label htmlFor="email" className="flex items-center text-sm">
                              <Mail className="h-4 w-4 mr-2 text-blue-600" />
                              Send to Email
                            </Label>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-700">Pharmacy Integration</h4>
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm text-green-700 mb-2">
                            {medicines.length} medicines will be sent to pharmacy
                          </p>
                          <Button
                            onClick={sendToPharmacy}
                            size="sm"
                            className="w-full bg-green-600 hover:bg-green-700"
                            disabled={medicines.length === 0}
                          >
                            <Pill className="h-4 w-4 mr-2" />
                            Send to Pharmacy
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-700">Lab Integration</h4>
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-700 mb-2">{labTests.length} tests will be sent to lab</p>
                          <Button
                            onClick={sendToLab}
                            size="sm"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            disabled={labTests.length === 0}
                          >
                            <TestTube className="h-4 w-4 mr-2" />
                            Send to Lab
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex gap-2">
                        <Button onClick={() => sendPrescription("print")} variant="outline" className="flex-1">
                          <Printer className="h-4 w-4 mr-2" />
                          Print
                        </Button>
                        <Button
                          onClick={() => sendPrescription("whatsapp")}
                          className="bg-green-600 hover:bg-green-700 flex-1"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          WhatsApp
                        </Button>
                        <Button
                          onClick={() => sendPrescription("email")}
                          className="bg-blue-600 hover:bg-blue-700 flex-1"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
      </div>
    </PrivateRoute>
  )
}

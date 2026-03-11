"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Plus,
  Edit,
  Copy,
  Trash2,
  Search,
  Filter,
  Save,
  Bot,
  Sparkles,
  Heart,
  Bone,
  Baby,
  Brain,
  Eye,
  Stethoscope,
} from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { toast } from "@/hooks/use-toast"

export default function DoctorTemplates() {
  const [activeTab, setActiveTab] = useState("clinical")
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    category: "clinical",
    specialty: "",
    content: "",
  })

  const clinicalTemplates = [
    {
      id: 1,
      name: "Hypertension Follow-up",
      category: "clinical",
      specialty: "Cardiology",
      lastUsed: "2024-01-15",
      usageCount: 45,
      content: "Patient presents for routine hypertension follow-up...",
    },
    {
      id: 2,
      name: "Diabetes Management",
      category: "clinical",
      specialty: "Endocrinology",
      lastUsed: "2024-01-14",
      usageCount: 38,
      content: "Diabetes mellitus type 2 management visit...",
    },
    {
      id: 3,
      name: "Annual Physical Exam",
      category: "clinical",
      specialty: "General Medicine",
      lastUsed: "2024-01-13",
      usageCount: 67,
      content: "Annual comprehensive physical examination...",
    },
  ]

  const prescriptionTemplates = [
    {
      id: 4,
      name: "Hypertension Standard",
      category: "prescription",
      specialty: "Cardiology",
      lastUsed: "2024-01-15",
      usageCount: 32,
      medications: ["Lisinopril 10mg", "Amlodipine 5mg"],
    },
    {
      id: 5,
      name: "Diabetes Type 2",
      category: "prescription",
      specialty: "Endocrinology",
      lastUsed: "2024-01-14",
      usageCount: 28,
      medications: ["Metformin 500mg", "Glipizide 5mg"],
    },
  ]

  const orderSets = [
    {
      id: 6,
      name: "Chest Pain Workup",
      category: "orders",
      specialty: "Emergency Medicine",
      lastUsed: "2024-01-12",
      usageCount: 15,
      orders: ["ECG", "Troponin", "Chest X-Ray", "CBC"],
    },
    {
      id: 7,
      name: "Pre-operative Labs",
      category: "orders",
      specialty: "Surgery",
      lastUsed: "2024-01-11",
      usageCount: 22,
      orders: ["CBC", "BMP", "PT/INR", "Type & Screen"],
    },
  ]

  const dischargeTemplates = [
    {
      id: 8,
      name: "Gynecology Discharge Template",
      category: "discharge",
      specialty: "Gynecology",
      lastUsed: "2024-01-15",
      usageCount: 28,
      aiEnabled: true,
      icon: <Heart className="h-5 w-5 text-pink-600" />,
      content: `**GYNECOLOGY DISCHARGE SUMMARY TEMPLATE**

**PATIENT INFORMATION:**
- Name: [PATIENT_NAME]
- Age: [PATIENT_AGE]
- MRN: [MRN]
- Admission Date: [ADMISSION_DATE]
- Discharge Date: [DISCHARGE_DATE]

**CHIEF COMPLAINT:**
[PRIMARY_COMPLAINT]

**HISTORY OF PRESENT ILLNESS:**
[DETAILED_HPI]

**GYNECOLOGIC HISTORY:**
- Gravida: [G] Para: [P] Abortions: [A]
- LMP: [LAST_MENSTRUAL_PERIOD]
- Menstrual History: [MENSTRUAL_PATTERN]
- Contraceptive History: [CONTRACEPTION]
- Previous Gynecologic Surgeries: [PREVIOUS_SURGERIES]

**HOSPITAL COURSE:**
[DETAILED_HOSPITAL_COURSE]

**PROCEDURES PERFORMED:**
[LIST_OF_PROCEDURES]

**PATHOLOGY RESULTS:**
[PATHOLOGY_FINDINGS]

**DISCHARGE MEDICATIONS:**
[MEDICATION_LIST]

**ACTIVITY RESTRICTIONS:**
- No lifting >10 lbs for [TIME_PERIOD]
- No driving while on narcotic pain medication
- Pelvic rest for [TIME_PERIOD]
- No douching or tampons for [TIME_PERIOD]

**FOLLOW-UP CARE:**
- Gynecology follow-up in [TIME_FRAME]
- Post-operative visit in [TIME_FRAME]
- Annual gynecologic exam

**DISCHARGE INSTRUCTIONS:**
- Monitor for signs of infection (fever, increased pain, foul discharge)
- Normal post-operative bleeding expected
- Contact physician for heavy bleeding or severe pain
- Contraceptive counseling provided

**WARNING SIGNS:**
Return to hospital immediately for:
- Fever >101.5°F
- Heavy vaginal bleeding (soaking >1 pad/hour)
- Severe abdominal pain
- Signs of infection

**PATIENT EDUCATION:**
- Post-operative care instructions provided
- Contraceptive options discussed
- Follow-up care importance emphasized`,
    },
    {
      id: 9,
      name: "Orthopedic Discharge Template",
      category: "discharge",
      specialty: "Orthopedics",
      lastUsed: "2024-01-14",
      usageCount: 35,
      aiEnabled: true,
      icon: <Bone className="h-5 w-5 text-blue-600" />,
      content: `**ORTHOPEDIC DISCHARGE SUMMARY TEMPLATE**

**PATIENT INFORMATION:**
- Name: [PATIENT_NAME]
- Age: [PATIENT_AGE]
- MRN: [MRN]
- Admission Date: [ADMISSION_DATE]
- Discharge Date: [DISCHARGE_DATE]

**CHIEF COMPLAINT:**
[PRIMARY_COMPLAINT]

**HISTORY OF PRESENT ILLNESS:**
[DETAILED_HPI]

**MECHANISM OF INJURY:**
[INJURY_MECHANISM]

**HOSPITAL COURSE:**
[DETAILED_HOSPITAL_COURSE]

**SURGICAL PROCEDURE:**
- Procedure: [SURGICAL_PROCEDURE]
- Surgeon: [SURGEON_NAME]
- Date: [SURGERY_DATE]
- Approach: [SURGICAL_APPROACH]
- Hardware Used: [IMPLANTS_HARDWARE]

**POST-OPERATIVE COURSE:**
[POST_OP_RECOVERY]

**IMAGING RESULTS:**
- Pre-operative: [PRE_OP_IMAGING]
- Post-operative: [POST_OP_IMAGING]

**WEIGHT-BEARING STATUS:**
[WEIGHT_BEARING_RESTRICTIONS]

**DISCHARGE MEDICATIONS:**
[MEDICATION_LIST]

**PHYSICAL THERAPY:**
- PT evaluation: [PT_EVALUATION]
- Home exercises: [HOME_EXERCISES]
- Outpatient PT: [OUTPATIENT_PT_PLAN]

**ACTIVITY RESTRICTIONS:**
- Weight-bearing: [WEIGHT_BEARING_STATUS]
- Range of motion: [ROM_RESTRICTIONS]
- Return to work: [WORK_RESTRICTIONS]
- Driving restrictions: [DRIVING_RESTRICTIONS]

**FOLLOW-UP CARE:**
- Orthopedic follow-up in [TIME_FRAME]
- X-rays at [TIME_FRAME]
- Hardware removal if indicated

**WOUND CARE:**
- Dressing changes: [DRESSING_INSTRUCTIONS]
- Suture/staple removal: [REMOVAL_DATE]
- Shower restrictions: [SHOWER_INSTRUCTIONS]

**WARNING SIGNS:**
Return to hospital immediately for:
- Signs of infection (fever, redness, drainage)
- Severe pain not controlled by medication
- Loss of sensation or circulation
- Hardware failure or displacement

**PATIENT EDUCATION:**
- Post-operative care instructions provided
- Physical therapy importance emphasized
- Activity restrictions explained`,
    },
    {
      id: 10,
      name: "Cardiology Discharge Template",
      category: "discharge",
      specialty: "Cardiology",
      lastUsed: "2024-01-13",
      usageCount: 42,
      aiEnabled: true,
      icon: <Heart className="h-5 w-5 text-red-600" />,
      content: `**CARDIOLOGY DISCHARGE SUMMARY TEMPLATE**

**PATIENT INFORMATION:**
- Name: [PATIENT_NAME]
- Age: [PATIENT_AGE]
- MRN: [MRN]
- Admission Date: [ADMISSION_DATE]
- Discharge Date: [DISCHARGE_DATE]

**CHIEF COMPLAINT:**
[PRIMARY_COMPLAINT]

**HISTORY OF PRESENT ILLNESS:**
[DETAILED_HPI]

**CARDIAC RISK FACTORS:**
- Hypertension: [HTN_STATUS]
- Diabetes: [DM_STATUS]
- Hyperlipidemia: [LIPID_STATUS]
- Smoking: [SMOKING_STATUS]
- Family History: [FAMILY_HX]

**HOSPITAL COURSE:**
[DETAILED_HOSPITAL_COURSE]

**CARDIAC PROCEDURES:**
[PROCEDURES_PERFORMED]

**DIAGNOSTIC STUDIES:**
- ECG: [ECG_FINDINGS]
- Echocardiogram: [ECHO_RESULTS]
- Cardiac Catheterization: [CATH_RESULTS]
- Stress Test: [STRESS_TEST_RESULTS]

**LABORATORY RESULTS:**
- Troponin: [TROPONIN_LEVELS]
- BNP/NT-proBNP: [BNP_LEVELS]
- Lipid Panel: [LIPID_RESULTS]
- HbA1c: [HBA1C_RESULT]

**DISCHARGE MEDICATIONS:**
[MEDICATION_LIST]

**CARDIAC REHABILITATION:**
- Referral made: [CARDIAC_REHAB_REFERRAL]
- Exercise restrictions: [EXERCISE_LIMITATIONS]
- Activity guidelines: [ACTIVITY_GUIDELINES]

**LIFESTYLE MODIFICATIONS:**
- Diet: [DIETARY_RECOMMENDATIONS]
- Exercise: [EXERCISE_PLAN]
- Smoking cessation: [SMOKING_CESSATION]
- Weight management: [WEIGHT_GOALS]

**FOLLOW-UP CARE:**
- Cardiology follow-up in [TIME_FRAME]
- Primary care follow-up in [TIME_FRAME]
- Repeat echo in [TIME_FRAME]
- Lab work in [TIME_FRAME]

**MONITORING:**
- Daily weights
- Blood pressure monitoring
- Symptom diary

**WARNING SIGNS:**
Return to hospital immediately for:
- Chest pain or pressure
- Shortness of breath
- Rapid weight gain (>3 lbs in 2 days)
- Dizziness or fainting
- Palpitations

**PATIENT EDUCATION:**
- Heart-healthy lifestyle counseling provided
- Medication compliance emphasized
- Warning signs reviewed`,
    },
    {
      id: 11,
      name: "Pediatric Discharge Template",
      category: "discharge",
      specialty: "Pediatrics",
      lastUsed: "2024-01-12",
      usageCount: 31,
      aiEnabled: true,
      icon: <Baby className="h-5 w-5 text-green-600" />,
      content: `**PEDIATRIC DISCHARGE SUMMARY TEMPLATE**

**PATIENT INFORMATION:**
- Name: [PATIENT_NAME]
- Age: [PATIENT_AGE]
- DOB: [DATE_OF_BIRTH]
- MRN: [MRN]
- Admission Date: [ADMISSION_DATE]
- Discharge Date: [DISCHARGE_DATE]

**CHIEF COMPLAINT:**
[PRIMARY_COMPLAINT]

**HISTORY OF PRESENT ILLNESS:**
[DETAILED_HPI]

**BIRTH HISTORY:**
- Gestational Age: [GA_AT_BIRTH]
- Birth Weight: [BIRTH_WEIGHT]
- Delivery: [DELIVERY_TYPE]
- Complications: [BIRTH_COMPLICATIONS]

**GROWTH PARAMETERS:**
- Weight: [CURRENT_WEIGHT] ([WEIGHT_PERCENTILE])
- Height: [CURRENT_HEIGHT] ([HEIGHT_PERCENTILE])
- Head Circumference: [HC] ([HC_PERCENTILE])

**DEVELOPMENTAL MILESTONES:**
[DEVELOPMENTAL_STATUS]

**IMMUNIZATION STATUS:**
[VACCINATION_HISTORY]

**HOSPITAL COURSE:**
[DETAILED_HOSPITAL_COURSE]

**PROCEDURES PERFORMED:**
[LIST_OF_PROCEDURES]

**DISCHARGE MEDICATIONS:**
[MEDICATION_LIST_WITH_DOSING]

**FEEDING INSTRUCTIONS:**
- Diet: [DIETARY_INSTRUCTIONS]
- Feeding schedule: [FEEDING_SCHEDULE]
- Special considerations: [FEEDING_NOTES]

**ACTIVITY RESTRICTIONS:**
[ACTIVITY_LIMITATIONS]

**FOLLOW-UP CARE:**
- Pediatric follow-up in [TIME_FRAME]
- Well-child visit schedule
- Specialist referrals: [SPECIALIST_REFERRALS]

**PARENT/CAREGIVER EDUCATION:**
- Medication administration
- Signs and symptoms to monitor
- When to seek medical care
- Normal vs. abnormal findings

**WARNING SIGNS:**
Return to hospital immediately for:
- Fever >100.4°F (38°C) in infants <3 months
- Difficulty breathing or fast breathing
- Poor feeding or vomiting
- Lethargy or irritability
- Signs of dehydration

**IMMUNIZATIONS:**
- Due at discharge: [VACCINES_DUE]
- Next scheduled: [NEXT_VACCINES]

**GROWTH AND DEVELOPMENT:**
- Nutritional counseling provided
- Developmental milestones discussed
- Safety counseling completed`,
    },
    {
      id: 12,
      name: "Neurology Discharge Template",
      category: "discharge",
      specialty: "Neurology",
      lastUsed: "2024-01-11",
      usageCount: 24,
      aiEnabled: true,
      icon: <Brain className="h-5 w-5 text-purple-600" />,
      content: `**NEUROLOGY DISCHARGE SUMMARY TEMPLATE**

**PATIENT INFORMATION:**
- Name: [PATIENT_NAME]
- Age: [PATIENT_AGE]
- MRN: [MRN]
- Admission Date: [ADMISSION_DATE]
- Discharge Date: [DISCHARGE_DATE]

**CHIEF COMPLAINT:**
[PRIMARY_COMPLAINT]

**HISTORY OF PRESENT ILLNESS:**
[DETAILED_HPI]

**NEUROLOGICAL HISTORY:**
- Previous strokes: [STROKE_HISTORY]
- Seizure history: [SEIZURE_HISTORY]
- Head trauma: [TRAUMA_HISTORY]
- Neurological surgeries: [SURGERY_HISTORY]

**HOSPITAL COURSE:**
[DETAILED_HOSPITAL_COURSE]

**NEUROLOGICAL EXAMINATION:**
- Mental status: [MENTAL_STATUS]
- Cranial nerves: [CRANIAL_NERVES]
- Motor function: [MOTOR_EXAM]
- Sensory function: [SENSORY_EXAM]
- Reflexes: [REFLEX_EXAM]
- Coordination: [COORDINATION]
- Gait: [GAIT_ASSESSMENT]

**DIAGNOSTIC STUDIES:**
- CT Head: [CT_RESULTS]
- MRI Brain: [MRI_RESULTS]
- EEG: [EEG_RESULTS]
- Lumbar Puncture: [LP_RESULTS]
- Vascular Studies: [VASCULAR_STUDIES]

**PROCEDURES PERFORMED:**
[NEUROLOGICAL_PROCEDURES]

**DISCHARGE MEDICATIONS:**
[MEDICATION_LIST]

**REHABILITATION:**
- Physical therapy: [PT_RECOMMENDATIONS]
- Occupational therapy: [OT_RECOMMENDATIONS]
- Speech therapy: [ST_RECOMMENDATIONS]
- Cognitive rehabilitation: [COGNITIVE_REHAB]

**FUNCTIONAL STATUS:**
- Activities of daily living: [ADL_STATUS]
- Mobility: [MOBILITY_STATUS]
- Cognitive function: [COGNITIVE_STATUS]
- Communication: [COMMUNICATION_STATUS]

**FOLLOW-UP CARE:**
- Neurology follow-up in [TIME_FRAME]
- Repeat imaging in [TIME_FRAME]
- EEG follow-up if indicated
- Rehabilitation services

**SAFETY CONSIDERATIONS:**
- Fall risk assessment: [FALL_RISK]
- Driving restrictions: [DRIVING_STATUS]
- Seizure precautions: [SEIZURE_PRECAUTIONS]
- Home safety modifications: [HOME_SAFETY]

**WARNING SIGNS:**
Return to hospital immediately for:
- New or worsening neurological symptoms
- Seizure activity
- Severe headache
- Changes in mental status
- Signs of stroke (FAST symptoms)

**PATIENT/FAMILY EDUCATION:**
- Neurological condition explained
- Medication compliance emphasized
- Rehabilitation importance discussed
- Warning signs reviewed`,
    },
    {
      id: 13,
      name: "Ophthalmology Discharge Template",
      category: "discharge",
      specialty: "Ophthalmology",
      lastUsed: "2024-01-10",
      usageCount: 18,
      aiEnabled: true,
      icon: <Eye className="h-5 w-5 text-indigo-600" />,
      content: `**OPHTHALMOLOGY DISCHARGE SUMMARY TEMPLATE**

**PATIENT INFORMATION:**
- Name: [PATIENT_NAME]
- Age: [PATIENT_AGE]
- MRN: [MRN]
- Admission Date: [ADMISSION_DATE]
- Discharge Date: [DISCHARGE_DATE]

**CHIEF COMPLAINT:**
[PRIMARY_COMPLAINT]

**HISTORY OF PRESENT ILLNESS:**
[DETAILED_HPI]

**OCULAR HISTORY:**
- Previous eye surgeries: [PREVIOUS_SURGERIES]
- Eye injuries: [TRAUMA_HISTORY]
- Glaucoma: [GLAUCOMA_STATUS]
- Diabetic retinopathy: [DR_STATUS]
- Macular degeneration: [AMD_STATUS]

**HOSPITAL COURSE:**
[DETAILED_HOSPITAL_COURSE]

**SURGICAL PROCEDURE:**
- Procedure: [SURGICAL_PROCEDURE]
- Eye: [AFFECTED_EYE]
- Surgeon: [SURGEON_NAME]
- Date: [SURGERY_DATE]
- Complications: [COMPLICATIONS]

**PRE-OPERATIVE EXAMINATION:**
- Visual acuity: OD [OD_VA], OS [OS_VA]
- Intraocular pressure: OD [OD_IOP], OS [OS_IOP]
- Anterior segment: [ANTERIOR_EXAM]
- Posterior segment: [POSTERIOR_EXAM]

**POST-OPERATIVE EXAMINATION:**
- Visual acuity: OD [POST_OD_VA], OS [POST_OS_VA]
- Intraocular pressure: OD [POST_OD_IOP], OS [POST_OS_IOP]
- Surgical site: [SURGICAL_SITE_EXAM]

**DISCHARGE MEDICATIONS:**
[MEDICATION_LIST]

**POST-OPERATIVE INSTRUCTIONS:**
- Eye drops: [DROP_SCHEDULE]
- Eye shield: [SHIELD_INSTRUCTIONS]
- Activity restrictions: [ACTIVITY_RESTRICTIONS]
- Water exposure: [WATER_RESTRICTIONS]

**ACTIVITY RESTRICTIONS:**
- No heavy lifting (>10 lbs) for [TIME_PERIOD]
- No bending or straining for [TIME_PERIOD]
- No swimming for [TIME_PERIOD]
- No eye rubbing
- Sleep with eye shield for [TIME_PERIOD]

**FOLLOW-UP CARE:**
- Ophthalmology follow-up in [TIME_FRAME]
- Post-operative visit schedule
- Long-term monitoring plan

**VISION REHABILITATION:**
- Low vision services if indicated
- Optical aids if needed
- Orientation and mobility training

**WARNING SIGNS:**
Return to hospital immediately for:
- Sudden vision loss
- Severe eye pain
- Flashing lights or new floaters
- Signs of infection (redness, discharge)
- Nausea and vomiting with eye pain

**PATIENT EDUCATION:**
- Post-operative care instructions provided
- Medication administration demonstrated
- Activity restrictions explained
- Warning signs reviewed`,
    },
    {
      id: 14,
      name: "General Surgery Discharge Template",
      category: "discharge",
      specialty: "General Surgery",
      lastUsed: "2024-01-09",
      usageCount: 39,
      aiEnabled: true,
      icon: <Stethoscope className="h-5 w-5 text-gray-600" />,
      content: `**GENERAL SURGERY DISCHARGE SUMMARY TEMPLATE**

**PATIENT INFORMATION:**
- Name: [PATIENT_NAME]
- Age: [PATIENT_AGE]
- MRN: [MRN]
- Admission Date: [ADMISSION_DATE]
- Discharge Date: [DISCHARGE_DATE]

**CHIEF COMPLAINT:**
[PRIMARY_COMPLAINT]

**HISTORY OF PRESENT ILLNESS:**
[DETAILED_HPI]

**SURGICAL HISTORY:**
[PREVIOUS_SURGERIES]

**HOSPITAL COURSE:**
[DETAILED_HOSPITAL_COURSE]

**SURGICAL PROCEDURE:**
- Procedure: [SURGICAL_PROCEDURE]
- Surgeon: [SURGEON_NAME]
- Date: [SURGERY_DATE]
- Approach: [SURGICAL_APPROACH]
- Findings: [OPERATIVE_FINDINGS]
- Complications: [COMPLICATIONS]

**POST-OPERATIVE COURSE:**
[POST_OP_RECOVERY]

**PATHOLOGY RESULTS:**
[PATHOLOGY_FINDINGS]

**DISCHARGE MEDICATIONS:**
[MEDICATION_LIST]

**WOUND CARE:**
- Incision care: [INCISION_CARE]
- Dressing changes: [DRESSING_INSTRUCTIONS]
- Suture/staple removal: [REMOVAL_DATE]
- Shower instructions: [SHOWER_GUIDELINES]

**ACTIVITY RESTRICTIONS:**
- Lifting restrictions: [LIFTING_LIMITS]
- Activity level: [ACTIVITY_LEVEL]
- Return to work: [WORK_RESTRICTIONS]
- Driving restrictions: [DRIVING_LIMITATIONS]

**DIET INSTRUCTIONS:**
[DIETARY_GUIDELINES]

**FOLLOW-UP CARE:**
- Surgical follow-up in [TIME_FRAME]
- Primary care follow-up
- Specialist referrals if needed

**DRAIN CARE:**
[DRAIN_INSTRUCTIONS]

**WARNING SIGNS:**
Return to hospital immediately for:
- Signs of infection (fever, redness, drainage)
- Severe pain not controlled by medication
- Nausea and vomiting
- Signs of bleeding
- Wound dehiscence

**PATIENT EDUCATION:**
- Post-operative care instructions provided
- Wound care demonstrated
- Activity restrictions explained
- Warning signs reviewed`,
    },
  ]

  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty.toLowerCase()) {
      case "gynecology":
        return <Heart className="h-4 w-4 text-pink-600" />
      case "orthopedics":
        return <Bone className="h-4 w-4 text-blue-600" />
      case "cardiology":
        return <Heart className="h-4 w-4 text-red-600" />
      case "pediatrics":
        return <Baby className="h-4 w-4 text-green-600" />
      case "neurology":
        return <Brain className="h-4 w-4 text-purple-600" />
      case "ophthalmology":
        return <Eye className="h-4 w-4 text-indigo-600" />
      case "general surgery":
        return <Stethoscope className="h-4 w-4 text-gray-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const handleCreateTemplate = () => {
    console.log("Creating template:", newTemplate)
    toast({
      title: "Template Created",
      description: `${newTemplate.name} template has been created successfully.`,
    })
    setIsCreateDialogOpen(false)
    setNewTemplate({ name: "", category: "clinical", specialty: "", content: "" })
  }

  const handleUseTemplate = (template: any) => {
    console.log("Using template:", template.name)
    toast({
      title: "Template Applied",
      description: `${template.name} template has been applied to your current document.`,
    })
  }

  const handleEditTemplate = (template: any) => {
    console.log("Editing template:", template.name)
    toast({
      title: "Edit Template",
      description: `Opening ${template.name} for editing.`,
    })
  }

  const handleCopyTemplate = (template: any) => {
    navigator.clipboard.writeText(template.content || "Template content")
    toast({
      title: "Template Copied",
      description: `${template.name} template has been copied to clipboard.`,
    })
  }

  const handleDeleteTemplate = (template: any) => {
    console.log("Deleting template:", template.name)
    toast({
      title: "Template Deleted",
      description: `${template.name} template has been deleted.`,
      variant: "destructive",
    })
  }

  const handleAIOptimize = (template: any) => {
    toast({
      title: "AI Optimization Started",
      description: `AI is optimizing the ${template.name} template for better discharge summaries.`,
    })
  }

  return (
    <PrivateRoute modulePath="admin/doctors/templates" action="view">
      <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Clinical Templates</h1>
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search templates..."
              className="w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Template Name</Label>
                    <Input
                      placeholder="Enter template name..."
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={newTemplate.category}
                      onValueChange={(value) => setNewTemplate({ ...newTemplate, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clinical">Clinical Notes</SelectItem>
                        <SelectItem value="prescription">Prescription</SelectItem>
                        <SelectItem value="orders">Order Sets</SelectItem>
                        <SelectItem value="discharge">Discharge Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Specialty</Label>
                  <Input
                    placeholder="Enter specialty..."
                    value={newTemplate.specialty}
                    onChange={(e) => setNewTemplate({ ...newTemplate, specialty: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Template Content</Label>
                  <Textarea
                    placeholder="Enter template content..."
                    className="h-32"
                    value={newTemplate.content}
                    onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTemplate}>
                    <Save className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="clinical">Clinical Notes</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="orders">Order Sets</TabsTrigger>
          <TabsTrigger value="discharge">AI Discharge Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="clinical" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clinicalTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {template.specialty}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleEditTemplate(template)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleCopyTemplate(template)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteTemplate(template)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">{template.content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>Used {template.usageCount} times</span>
                    <span>Last used: {template.lastUsed}</span>
                  </div>
                  <Button className="w-full" onClick={() => handleUseTemplate(template)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="prescriptions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prescriptionTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {template.specialty}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleEditTemplate(template)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleCopyTemplate(template)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteTemplate(template)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-3">
                    <p className="text-sm font-medium">Medications:</p>
                    {template.medications.map((med, index) => (
                      <Badge key={index} variant="secondary" className="mr-1">
                        {med}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>Used {template.usageCount} times</span>
                    <span>Last used: {template.lastUsed}</span>
                  </div>
                  <Button className="w-full" onClick={() => handleUseTemplate(template)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orderSets.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {template.specialty}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleEditTemplate(template)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleCopyTemplate(template)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteTemplate(template)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-3">
                    <p className="text-sm font-medium">Orders:</p>
                    {template.orders.map((order, index) => (
                      <Badge key={index} variant="secondary" className="mr-1">
                        {order}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>Used {template.usageCount} times</span>
                    <span>Last used: {template.lastUsed}</span>
                  </div>
                  <Button className="w-full" onClick={() => handleUseTemplate(template)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="discharge" className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border">
            <div className="flex items-center gap-3 mb-4">
              <Bot className="h-8 w-8 text-purple-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">AI-Powered Discharge Templates</h2>
                <p className="text-sm text-gray-600">
                  Specialty-specific templates that AI uses to generate comprehensive discharge summaries
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium">AI-Optimized</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Templates optimized for AI generation</p>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">Specialty-Specific</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Tailored for different medical specialties</p>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Edit className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Customizable</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Easily modify templates as needed</p>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Copy className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium">Reusable</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">Use across multiple patients</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dischargeTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {template.icon}
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{template.specialty}</Badge>
                          {template.aiEnabled && (
                            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                              <Bot className="h-3 w-3 mr-1" />
                              AI-Enabled
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => handleAIOptimize(template)}>
                        <Sparkles className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleEditTemplate(template)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleCopyTemplate(template)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <p className="text-xs font-mono text-gray-700 line-clamp-6">{template.content}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Used {template.usageCount} times</span>
                    <span>Last used: {template.lastUsed}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleUseTemplate(template)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Bot className="h-4 w-4 mr-2" />
                      Use for AI
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEditTemplate(template)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Customize
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-600" />
                How AI Uses These Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Template Selection Process</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <span>AI analyzes patient's primary diagnosis and specialty</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <span>Selects most appropriate specialty template</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <span>Populates template fields with patient data</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <span>Generates comprehensive discharge summary</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Template Features</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span>Specialty-specific sections and terminology</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span>Placeholder fields for dynamic content</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span>Standardized medical documentation format</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span>Compliance with medical record standards</span>
                    </div>
                  </div>
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

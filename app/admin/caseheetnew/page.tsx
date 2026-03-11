"use client"

import { SearchableSelect } from '@/components/searchable-select'
import SimpleVoiceRecorder from '@/components/simple-voice-recorder'
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import authService from "@/lib/authService"
import { examinationApi } from "@/lib/examinationApi"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import {
  Calendar as CalendarIcon,
  Pencil,
  Printer,
  Save,
  Trash2,
  X
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

interface PatientData {
  id: string
  name: string
  lastName: string
  age: number
  gender: string
  patientId: string
  height?: number
  weight?: number
  visitDate?: string
  visitTime?: string
  maritalStatus?: string
  title?: string
}

const medicineDaysOptions = [
  { id: '1', title: '1 Day' },
  { id: '3', title: '3 Days' },
  { id: '5', title: '5 Days' },
  { id: '7', title: '7 Days' },
  { id: '10', title: '10 Days' },
  { id: '13', title: '13 Days' },
  { id: '14', title: '14 Days' },
  { id: '15', title: '15 Days' },
  { id: '28', title: '28 Days' },
  { id: '30', title: '30 Days' },
  { id: '60', title: '60 Days' },
  { id: '90', title: '90 Days' },
  { id: '180', title: '180 Days' },
  { id: '360', title: '360 Days' },
]

export default function CaseSheetPage() {
  const [activeTab, setActiveTab] = useState("presenting-complaints")
  const [patientData, setPatientData] = useState<PatientData | null>(null)
  const [loading, setLoading] = useState(false)
  const [medicalHistoryCategories, setMedicalHistoryCategories] = useState<any[]>([])
  const [selectedMedicalHistory, setSelectedMedicalHistory] = useState<any[]>([])
  const [medicalHistoryOptions, setMedicalHistoryOptions] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [personalHistoryCategories, setPersonalHistoryCategories] = useState<any[]>([])
  const [selectedPersonalHistory, setSelectedPersonalHistory] = useState<any[]>([])
  const [personalHistoryOptions, setPersonalHistoryOptions] = useState<any[]>([])
  const [selectedPersonalCategory, setSelectedPersonalCategory] = useState<string>('')
  const [lifestyleCategories, setLifestyleCategories] = useState<any[]>([])
  const [selectedLifestyle, setSelectedLifestyle] = useState<any[]>([])
  const [lifestyleOptions, setLifestyleOptions] = useState<any[]>([])
  const [selectedLifestyleCategory, setSelectedLifestyleCategory] = useState<string>('')
  const [familyHistoryCategories, setFamilyHistoryCategories] = useState<any[]>([])
  const [selectedFamilyHistory, setSelectedFamilyHistory] = useState<any[]>([])
  const [familyHistoryOptions, setFamilyHistoryOptions] = useState<any[]>([])
  const [selectedFamilyCategory, setSelectedFamilyCategory] = useState<string>('')
  const [drugHistoryCategories, setDrugHistoryCategories] = useState<any[]>([])
  const [selectedDrugHistory, setSelectedDrugHistory] = useState<any[]>([])
  const [drugHistoryOptions, setDrugHistoryOptions] = useState<any[]>([])
  const [selectedDrugCategory, setSelectedDrugCategory] = useState<string>('')
  const [allergiesCategories, setAllergiesCategories] = useState<any[]>([])
  const [selectedAllergies, setSelectedAllergies] = useState<any[]>([])
  const [allergiesOptions, setAllergiesOptions] = useState<any[]>([])
  const [selectedAllergiesCategory, setSelectedAllergiesCategory] = useState<string>('')
  const [socialHistoryCategories, setSocialHistoryCategories] = useState<any[]>([])
  const [selectedSocialHistory, setSelectedSocialHistory] = useState<any[]>([])
  const [socialHistoryOptions, setSocialHistoryOptions] = useState<any[]>([])
  const [selectedSocialCategory, setSelectedSocialCategory] = useState<string>('')
  const [examinationData, setExaminationData] = useState({
    pastMedicalReports: '',
    investigationsRequired: '',
    physicalExamination: '',
    bp: '',
    pulse: '',
    heartRate: '',
    weight: '',
    rr: '',
    menstrualObstetricHistory: '',
    treatmentPlanMonthsDoctor: '',
    nextRenewalDateDoctor: ''
  })
  const [editingExamId, setEditingExamId] = useState<number | null>(null)
  const [editingRenewalDate, setEditingRenewalDate] = useState<string>('')
  const [voiceTranscript, setVoiceTranscript] = useState('')
  const [examinations, setExaminations] = useState<any[]>([])
  const [loadingExaminations, setLoadingExaminations] = useState(false)
  const [treatmentPlans, setTreatmentPlans] = useState<any[]>([])
  // File upload states
  const [selectedReportFiles, setSelectedReportFiles] = useState<FileList | null>(null)
  const [uploadingReports, setUploadingReports] = useState(false)
  const [examinationReports, setExaminationReports] = useState<Record<number, string[]>>({})
  const [uploadTargetExamId, setUploadTargetExamId] = useState<number | null>(null)
  const [deletingExamId, setDeletingExamId] = useState<number | null>(null)

  const [prescriptionData, setPrescriptionData] = useState({
    medicineType: '',
    medicine: '',
    potency: '',
    dosage: '',
    morning: false,
    afternoon: false,
    night: false,
    notes: ''
  })
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [savedPrescriptions, setSavedPrescriptions] = useState<any[]>([])
  const [showPrintView, setShowPrintView] = useState(false)
  const [commonMedicine, setCommonMedicine] = useState({
    morning: false,
    night: false,
    sos: false,
    biochemicMotherTincher: '',
    medicineDays: '13',
    nextAppointmentDate: ''
  })
  const [notesToPro, setNotesToPro] = useState('')
  const [notesToPharmacy, setNotesToPharmacy] = useState('')
  const [medicationTypes, setMedicationTypes] = useState<any[]>([])
  const [medicines, setMedicines] = useState<any[]>([])
  const [potencies, setPotencies] = useState<any[]>([])
  const [dosages, setDosages] = useState<any[]>([])
  const [medicalHistoryNotes, setMedicalHistoryNotes] = useState('')
  const [personalHistoryNotes, setPersonalHistoryNotes] = useState('')
  const [lifestyleNotes, setLifestyleNotes] = useState('')
  const [familyHistoryNotes, setFamilyHistoryNotes] = useState('')
  const [drugHistoryNotes, setDrugHistoryNotes] = useState('')
  const [allergiesNotes, setAllergiesNotes] = useState('')
  const [socialHistoryNotes, setSocialHistoryNotes] = useState('')
  const [presentingComplaints, setPresentingComplaints] = useState<any[]>([])
  const [presentingComplaintsNotes, setPresentingComplaintsNotes] = useState('')
  const [editingComplaintId, setEditingComplaintId] = useState<number | null>(null)
  const [editingMedicineId, setEditingMedicineId] = useState<number | null>(null)
  const [editingPrescriptionId, setEditingPrescriptionId] = useState<number | null>(null)
  const searchParams = useSearchParams()
  const patientId = searchParams.get('patientId') || searchParams.get('id')

  const getLocationId = () => {
    return authService.getLocationId()
  }

  const calculateNextAppointmentDate = (days: string) => {
    const today = new Date()
    const nextDate = new Date(today)
    nextDate.setDate(today.getDate() + parseInt(days))
    return nextDate.toISOString().split('T')[0]
  }

  const formatDateToDDMMYYYY = (dateString: string | undefined | null) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const handleMedicineDaysChange = (value: string) => {
    const nextDate = calculateNextAppointmentDate(value)
    setCommonMedicine({
      ...commonMedicine,
      medicineDays: value,
      nextAppointmentDate: nextDate
    })
  }

  const fetchPatientPrescriptions = async () => {
    if (!patientId) return

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-prescriptions/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        console.log('DEBUG: fetchPatientPrescriptions received row 0:', result?.[0]);
        setSavedPrescriptions(result || [])
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error)
    }
  }

  const handleDeletePrescription = async (prescriptionId: number) => {
    if (!confirm('Are you sure you want to delete this prescription?')) return
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-prescriptions/${prescriptionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        setSavedPrescriptions(prev => prev.filter((p: any) => p.prescription_id !== prescriptionId && p.id !== prescriptionId))
      } else {
        alert('Failed to delete prescription')
      }
    } catch (error) {
      console.error('Error deleting prescription:', error)
      alert('Failed to delete prescription')
    }
  }



  const fetchMedicationTypes = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/medication-type`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        setMedicationTypes(result || [])
      }
    } catch (error) {
      console.error('Error fetching medication types:', error)
    }
  }

  const fetchMedicines = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/medicine`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        setMedicines(result || [])
      }
    } catch (error) {
      console.error('Error fetching medicines:', error)
    }
  }

  const fetchPotencies = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/potency`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        setPotencies(result || [])
      }
    } catch (error) {
      console.error('Error fetching potencies:', error)
    }
  }

  const fetchDosages = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/dosage`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        setDosages(result || [])
      }
    } catch (error) {
      console.error('Error fetching dosages:', error)
    }
  }



  const handlePrescriptionSubmit = async () => {
    if (!patientId || prescriptions.length === 0) return
    console.log('DEBUG: handlePrescriptionSubmit sending:', {
      id: editingPrescriptionId,
      medicine_id: editingMedicineId,
      patient_id: patientId,
      prescriptions: prescriptions,
      medicine_days: parseInt(commonMedicine.medicineDays),
      next_appointment_date: commonMedicine.nextAppointmentDate,
      notes_to_pro: notesToPro,
      notes_to_pharmacy: notesToPharmacy
    });

    const locationId = getLocationId()
    if (!locationId) {
      console.error('No location selected')
      return
    }

    try {
      const token = localStorage.getItem('authToken')
      const user = authService.getCurrentUser()

      // Save prescription
      await fetch(`${authService.getSettingsApiUrl()}/patient-prescriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingPrescriptionId,
          medicine_id: editingMedicineId,
          patient_id: patientId,
          prescriptions: prescriptions,
          medicine_days: parseInt(commonMedicine.medicineDays),
          next_appointment_date: commonMedicine.nextAppointmentDate,
          notes_to_pro: notesToPro,
          notes_to_pharmacy: notesToPharmacy
        })
      })

      // Create next appointment automatically
      if (commonMedicine.nextAppointmentDate && user?.id) {
        await fetch(`${authService.getSettingsApiUrl()}/appointments`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            patientId: patientId,
            doctorId: parseInt(user.id),
            appointmentDate: commonMedicine.nextAppointmentDate,
            appointmentTime: '10:00',
            appointmentType: 'follow-up',
            notes: `Follow-up appointment after ${commonMedicine.medicineDays} days of medication`
          })
        })
      }

      // Reset form
      setPrescriptions([])
      setNotesToPro('')
      setNotesToPharmacy('')
      setEditingMedicineId(null)
      setEditingPrescriptionId(null)
      setPrescriptionData({ medicineType: '', medicine: '', potency: '', dosage: '', morning: false, afternoon: false, night: false, notes: '' })

      // Refresh saved prescriptions
      fetchPatientPrescriptions()

      alert(`Prescription ${editingMedicineId ? 'updated' : 'saved'} and next appointment created successfully!`)
    } catch (error) {
      console.error('Error saving prescription:', error)
      alert('Failed to save prescription')
    }
  }

  const fetchPatientPresentingComplaints = async () => {
    if (!patientId) return
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-presenting-complaints/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        const result = await response.json()
        setPresentingComplaints(result || [])
      }
    } catch (error) {
      console.error('Error fetching presenting complaints:', error)
    }
  }

  const handlePresentingComplaintsSubmit = async () => {
    if (!patientId || !presentingComplaintsNotes.trim()) return
    console.log('DEBUG: handlePresentingComplaintsSubmit sending:', {
      id: editingComplaintId,
      patient_id: patientId,
      notes: presentingComplaintsNotes
    });
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-presenting-complaints`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingComplaintId,
          patient_id: patientId,
          notes: presentingComplaintsNotes
        })
      })
      if (response.ok) {
        setPresentingComplaintsNotes('')
        setEditingComplaintId(null)
        fetchPatientPresentingComplaints()
        alert(`Presenting Complaints ${editingComplaintId ? 'updated' : 'saved'} successfully!`)
      } else {
        alert('Failed to save complaints')
      }
    } catch (error) {
      console.error('Error saving presenting complaints:', error)
      alert('Error saving complaints')
    }
  }

  const handleDeleteComplaint = async (complaintId: number) => {
    if (!confirm('Are you sure you want to delete this complaint?')) return
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-presenting-complaints/${complaintId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        setPresentingComplaints(prev => prev.filter((c: any) => c.id !== complaintId))
      } else {
        alert('Failed to delete complaint')
      }
    } catch (error) {
      console.error('Error deleting complaint:', error)
      alert('Failed to delete complaint')
    }
  }

  useEffect(() => {
    if (patientId) {
      fetchPatientData(patientId)
      fetchMedicalHistoryCategories()
      fetchPatientMedicalHistory()
      fetchPersonalHistoryCategories()
      fetchPatientPersonalHistory()
      fetchLifestyleCategories()
      fetchPatientLifestyle()
      fetchFamilyHistoryCategories()
      fetchPatientFamilyHistory()
      fetchDrugHistoryCategories()
      fetchPatientDrugHistory()
      fetchAllergiesCategories()
      fetchPatientAllergies()
      fetchSocialHistoryCategories()
      fetchPatientSocialHistory()
      fetchPatientPresentingComplaints()
    }
    // Set default next appointment date
    const defaultDate = calculateNextAppointmentDate('13')
    setCommonMedicine(prev => ({ ...prev, nextAppointmentDate: defaultDate }))
  }, [patientId])

  const handleLifestyleNotesSubmit = async () => {
    if (!patientId) return
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-lifestyle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: patientId,
          notes: lifestyleNotes
        })
      })
      if (response.ok) {
        alert('Life Style Notes saved successfully!')
      } else {
        alert('Failed to save notes')
      }
    } catch (error) {
      console.error('Error saving lifestyle notes:', error)
      alert('Error saving notes')
    }
  }

  const handleDrugHistoryNotesSubmit = async () => {
    if (!patientId) return
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-drug-history`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: patientId,
          notes: drugHistoryNotes
        })
      })
      if (response.ok) {
        alert('Drug History Notes saved successfully!')
      } else {
        alert('Failed to save notes')
      }
    } catch (error) {
      console.error('Error saving drug history notes:', error)
      alert('Error saving notes')
    }
  }

  const handleAllergiesNotesSubmit = async () => {
    if (!patientId) return
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-allergies`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: patientId,
          notes: allergiesNotes
        })
      })
      if (response.ok) {
        alert('Allergies Notes saved successfully!')
      } else {
        alert('Failed to save notes')
      }
    } catch (error) {
      console.error('Error saving allergies notes:', error)
      alert('Error saving notes')
    }
  }

  const handleSocialHistoryNotesSubmit = async () => {
    if (!patientId) return
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-social-history`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: patientId,
          notes: socialHistoryNotes
        })
      })
      if (response.ok) {
        alert('Social History Notes saved successfully!')
      } else {
        alert('Failed to save notes')
      }
    } catch (error) {
      console.error('Error saving social history notes:', error)
      alert('Error saving notes')
    }
  }

  const handleFamilyHistoryNotesSubmit = async () => {
    if (!patientId) return
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-family-history`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: patientId,
          notes: familyHistoryNotes
        })
      })
      if (response.ok) {
        alert('Family History Notes saved successfully!')
      } else {
        alert('Failed to save notes')
      }
    } catch (error) {
      console.error('Error saving family history notes:', error)
      alert('Error saving notes')
    }
  }

  const handlePersonalHistoryNotesSubmit = async () => {
    if (!patientId) return
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-personal-history`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: patientId,
          notes: personalHistoryNotes
        })
      })
      if (response.ok) {
        alert('Personal History Notes saved successfully!')
      } else {
        alert('Failed to save notes')
      }
    } catch (error) {
      console.error('Error saving personal history notes:', error)
      alert('Error saving notes')
    }
  }

  const handleMedicalHistoryNotesSubmit = async () => {
    if (!patientId) return
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-medical-history`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: patientId,
          notes: medicalHistoryNotes
        })
      })
      if (response.ok) {
        alert('Medical History Notes saved successfully!')
      } else {
        alert('Failed to save notes')
      }
    } catch (error) {
      console.error('Error saving medical history notes:', error)
      alert('Error saving notes')
    }
  }

  const fetchMedicalHistoryCategories = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/medical-history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        const data = result.data || result
        setMedicalHistoryCategories(data)
      } else {
        console.error('Failed to fetch medical history categories')
      }
    } catch (error) {
      console.error('Error fetching medical history categories:', error)
    }
  }

  const fetchPatientMedicalHistory = async () => {
    if (!patientId) return

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-medical-history/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        const groupedHistory = result.data || result

        const selectedItems: any[] = []
        Object.keys(groupedHistory).forEach(category => {
          groupedHistory[category].forEach((item: any) => {
            if (item.option_id && item.option_id !== 0) {
              selectedItems.push({
                id: item.option_id,
                title: item.option_title,
                category: category
              })
            }
          })
        })

        setSelectedMedicalHistory(selectedItems)
        setMedicalHistoryNotes(result.notes || '')
      }
    } catch (error) {
      console.error('Error fetching patient medical history:', error)
    }
  }

  const fetchPersonalHistoryCategories = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/personal-history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        const data = result.data || result
        setPersonalHistoryCategories(data)
      } else {
        console.error('Failed to fetch personal history categories')
      }
    } catch (error) {
      console.error('Error fetching personal history categories:', error)
    }
  }

  const fetchPatientPersonalHistory = async () => {
    if (!patientId) return

    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-personal-history/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        const groupedHistory = result.data || result

        const selectedItems: any[] = []
        Object.keys(groupedHistory).forEach(category => {
          groupedHistory[category].forEach((item: any) => {
            if (item.option_id && item.option_id !== 0) {
              selectedItems.push({
                id: item.option_id,
                title: item.option_title,
                category: category
              })
            }
          })
        })

        setSelectedPersonalHistory(selectedItems)
        setPersonalHistoryNotes(result.notes || '')
      }
    } catch (error) {
      console.error('Error fetching patient personal history:', error)
    }
  }

  const handlePersonalHistoryClick = async (categoryId: string, categoryTitle: string) => {
    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/personal-history-options/${categoryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const options = await response.json()
        setPersonalHistoryOptions(options.data || options)
        setSelectedPersonalCategory(categoryTitle)
      } else {
        console.error('Failed to fetch personal history options')
      }
    } catch (error) {
      console.error('Error fetching personal history options:', error)
    }
  }

  const handlePersonalOptionSelect = async (option: any) => {
    const exists = selectedPersonalHistory.find(item => item.id === option.id)
    if (!exists) {
      const newSelection = [...selectedPersonalHistory, { ...option, category: selectedPersonalCategory }]
      setSelectedPersonalHistory(newSelection)

      const locationId = getLocationId()
      if (locationId) {
        try {
          const token = localStorage.getItem('authToken')
          await fetch(`${authService.getSettingsApiUrl()}/patient-personal-history`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              patient_id: patientId,
              personal_history_id: selectedPersonalCategory,
              personal_history_option_id: option.id,
              category_title: selectedPersonalCategory,
              option_title: option.title
            })
          })
        } catch (error) {
          console.error('Error saving personal history:', error)
        }
      }
    }
  }

  const handleRemovePersonalSelected = async (optionId: string) => {
    setSelectedPersonalHistory(selectedPersonalHistory.filter(item => item.id !== optionId))

    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      await fetch(`${authService.getSettingsApiUrl()}/patient-personal-history`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: patientId,
          personal_history_option_id: optionId
        })
      })
    } catch (error) {
      console.error('Error deleting personal history:', error)
    }
  }

  const fetchLifestyleCategories = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/lifestyle`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        const data = result.data || result
        setLifestyleCategories(data)
      } else {
        console.error('Failed to fetch lifestyle categories')
      }
    } catch (error) {
      console.error('Error fetching lifestyle categories:', error)
    }
  }

  const fetchPatientLifestyle = async () => {
    if (!patientId) return

    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-lifestyle/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        const groupedHistory = result.data || result

        const selectedItems: any[] = []
        Object.keys(groupedHistory).forEach(category => {
          groupedHistory[category].forEach((item: any) => {
            if (item.option_id && item.option_id !== 0) {
              selectedItems.push({
                id: item.option_id,
                title: item.option_title,
                category: category
              })
            }
          })
        })

        setSelectedLifestyle(selectedItems)
        setLifestyleNotes(result.notes || '')
      }
    } catch (error) {
      console.error('Error fetching patient lifestyle:', error)
    }
  }

  const handleLifestyleClick = async (categoryId: string, categoryTitle: string) => {
    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/lifestyle-options/${categoryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const options = await response.json()
        setLifestyleOptions(options.data || options)
        setSelectedLifestyleCategory(categoryTitle)
      } else {
        console.error('Failed to fetch lifestyle options')
      }
    } catch (error) {
      console.error('Error fetching lifestyle options:', error)
    }
  }

  const handleLifestyleOptionSelect = async (option: any) => {
    const exists = selectedLifestyle.find(item => item.id === option.id)
    if (!exists) {
      const newSelection = [...selectedLifestyle, { ...option, category: selectedLifestyleCategory }]
      setSelectedLifestyle(newSelection)

      const locationId = getLocationId()
      if (locationId) {
        try {
          const token = localStorage.getItem('authToken')
          await fetch(`${authService.getSettingsApiUrl()}/patient-lifestyle`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              patient_id: patientId,
              lifestyle_id: selectedLifestyleCategory,
              lifestyle_option_id: option.id,
              category_title: selectedLifestyleCategory,
              option_title: option.title
            })
          })
        } catch (error) {
          console.error('Error saving lifestyle:', error)
        }
      }
    }
  }

  const handleRemoveLifestyleSelected = async (optionId: string) => {
    setSelectedLifestyle(selectedLifestyle.filter(item => item.id !== optionId))

    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      await fetch(`${authService.getSettingsApiUrl()}/patient-lifestyle`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: patientId,
          lifestyle_option_id: optionId
        })
      })
    } catch (error) {
      console.error('Error deleting lifestyle:', error)
    }
  }

  const fetchFamilyHistoryCategories = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/family-history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        const data = result.data || result
        setFamilyHistoryCategories(data)
      } else {
        console.error('Failed to fetch family history categories')
      }
    } catch (error) {
      console.error('Error fetching family history categories:', error)
    }
  }

  const fetchPatientFamilyHistory = async () => {
    if (!patientId) return

    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-family-history/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        const groupedHistory = result.data || result

        const selectedItems: any[] = []
        Object.keys(groupedHistory).forEach(category => {
          groupedHistory[category].forEach((item: any) => {
            if (item.option_id && item.option_id !== 0) {
              selectedItems.push({
                id: item.option_id,
                title: item.option_title,
                category: category
              })
            }
          })
        })

        setSelectedFamilyHistory(selectedItems)
        setFamilyHistoryNotes(result.notes || '')
      }
    } catch (error) {
      console.error('Error fetching patient family history:', error)
    }
  }

  const handleFamilyHistoryClick = async (categoryId: string, categoryTitle: string) => {
    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/family-history-options/${categoryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const options = await response.json()
        setFamilyHistoryOptions(options.data || options)
        setSelectedFamilyCategory(categoryTitle)
      } else {
        console.error('Failed to fetch family history options')
      }
    } catch (error) {
      console.error('Error fetching family history options:', error)
    }
  }

  const handleFamilyOptionSelect = async (option: any) => {
    const exists = selectedFamilyHistory.find(item => item.id === option.id)
    if (!exists) {
      const newSelection = [...selectedFamilyHistory, { ...option, category: selectedFamilyCategory }]
      setSelectedFamilyHistory(newSelection)

      const locationId = getLocationId()
      if (locationId) {
        try {
          const token = localStorage.getItem('authToken')
          await fetch(`${authService.getSettingsApiUrl()}/patient-family-history`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              patient_id: patientId,
              family_history_id: selectedFamilyCategory,
              family_history_option_id: option.id,
              category_title: selectedFamilyCategory,
              option_title: option.title
            })
          })
        } catch (error) {
          console.error('Error saving family history:', error)
        }
      }
    }
  }

  const handleRemoveFamilySelected = async (optionId: string) => {
    setSelectedFamilyHistory(selectedFamilyHistory.filter(item => item.id !== optionId))

    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      await fetch(`${authService.getSettingsApiUrl()}/patient-family-history`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: patientId,
          family_history_option_id: optionId
        })
      })
    } catch (error) {
      console.error('Error deleting family history:', error)
    }
  }

  const fetchDrugHistoryCategories = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/drug-history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        const data = result.data || result
        setDrugHistoryCategories(data)
      } else {
        console.error('Failed to fetch drug history categories')
      }
    } catch (error) {
      console.error('Error fetching drug history categories:', error)
    }
  }

  const fetchPatientDrugHistory = async () => {
    if (!patientId) return

    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-drug-history/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        const groupedHistory = result.data || result

        const selectedItems: any[] = []
        Object.keys(groupedHistory).forEach(category => {
          groupedHistory[category].forEach((item: any) => {
            if (item.option_id && item.option_id !== 0) {
              selectedItems.push({
                id: item.option_id,
                title: item.option_title,
                category: category
              })
            }
          })
        })

        setSelectedDrugHistory(selectedItems)
        setDrugHistoryNotes(result.notes || '')
      }
    } catch (error) {
      console.error('Error fetching patient drug history:', error)
    }
  }

  const handleDrugHistoryClick = async (categoryId: string, categoryTitle: string) => {
    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/drug-history-options/${categoryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const options = await response.json()
        setDrugHistoryOptions(options.data || options)
        setSelectedDrugCategory(categoryTitle)
      } else {
        console.error('Failed to fetch drug history options')
      }
    } catch (error) {
      console.error('Error fetching drug history options:', error)
    }
  }

  const handleDrugOptionSelect = async (option: any) => {
    const exists = selectedDrugHistory.find(item => item.id === option.id)
    if (!exists) {
      const newSelection = [...selectedDrugHistory, { ...option, category: selectedDrugCategory }]
      setSelectedDrugHistory(newSelection)

      const locationId = getLocationId()
      if (locationId) {
        try {
          const token = localStorage.getItem('authToken')
          await fetch(`${authService.getSettingsApiUrl()}/patient-drug-history`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              patient_id: patientId,
              drug_history_id: selectedDrugCategory,
              drug_history_option_id: option.id,
              category_title: selectedDrugCategory,
              option_title: option.title
            })
          })
        } catch (error) {
          console.error('Error saving drug history:', error)
        }
      }
    }
  }

  const handleRemoveDrugSelected = async (optionId: string) => {
    setSelectedDrugHistory(selectedDrugHistory.filter(item => item.id !== optionId))

    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      await fetch(`${authService.getSettingsApiUrl()}/patient-drug-history`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: patientId,
          drug_history_option_id: optionId
        })
      })
    } catch (error) {
      console.error('Error deleting drug history:', error)
    }
  }

  const fetchAllergiesCategories = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/allergies`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        const data = result.data || result
        setAllergiesCategories(data)
      } else {
        console.error('Failed to fetch allergies categories')
      }
    } catch (error) {
      console.error('Error fetching allergies categories:', error)
    }
  }

  const fetchPatientAllergies = async () => {
    if (!patientId) return

    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-allergies/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        const groupedHistory = result.data || result

        const selectedItems: any[] = []
        Object.keys(groupedHistory).forEach(category => {
          groupedHistory[category].forEach((item: any) => {
            if (item.option_id && item.option_id !== 0) {
              selectedItems.push({
                id: item.option_id,
                title: item.option_title,
                category: category
              })
            }
          })
        })

        setSelectedAllergies(selectedItems)
        setAllergiesNotes(result.notes || '')
      }
    } catch (error) {
      console.error('Error fetching patient allergies:', error)
    }
  }

  const handleAllergiesClick = async (categoryId: string, categoryTitle: string) => {
    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/allergies-options/${categoryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const options = await response.json()
        setAllergiesOptions(options.data || options)
        setSelectedAllergiesCategory(categoryTitle)
      } else {
        console.error('Failed to fetch allergies options')
      }
    } catch (error) {
      console.error('Error fetching allergies options:', error)
    }
  }

  const handleAllergiesOptionSelect = async (option: any) => {
    const exists = selectedAllergies.find(item => item.id === option.id)
    if (!exists) {
      const newSelection = [...selectedAllergies, { ...option, category: selectedAllergiesCategory }]
      setSelectedAllergies(newSelection)

      const locationId = getLocationId()
      if (locationId) {
        try {
          const token = localStorage.getItem('authToken')
          await fetch(`${authService.getSettingsApiUrl()}/patient-allergies`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              patient_id: patientId,
              allergies_id: selectedAllergiesCategory,
              allergies_option_id: option.id,
              category_title: selectedAllergiesCategory,
              option_title: option.title
            })
          })
        } catch (error) {
          console.error('Error saving allergies:', error)
        }
      }
    }
  }

  const handleRemoveAllergiesSelected = async (optionId: string) => {
    setSelectedAllergies(selectedAllergies.filter(item => item.id !== optionId))

    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      await fetch(`${authService.getSettingsApiUrl()}/patient-allergies`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: patientId,
          allergies_option_id: optionId
        })
      })
    } catch (error) {
      console.error('Error deleting allergies:', error)
    }
  }

  const fetchSocialHistoryCategories = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/social-history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        const data = result.data || result
        setSocialHistoryCategories(data)
      } else {
        console.error('Failed to fetch social history categories')
      }
    } catch (error) {
      console.error('Error fetching social history categories:', error)
    }
  }

  const fetchPatientSocialHistory = async () => {
    if (!patientId) return

    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-social-history/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        const groupedHistory = result.data || result

        const selectedItems: any[] = []
        Object.keys(groupedHistory).forEach(category => {
          groupedHistory[category].forEach((item: any) => {
            if (item.option_id && item.option_id !== 0) {
              selectedItems.push({
                id: item.option_id,
                title: item.option_title,
                category: category
              })
            }
          })
        })

        setSelectedSocialHistory(selectedItems)
        setSocialHistoryNotes(result.notes || '')
      }
    } catch (error) {
      console.error('Error fetching patient social history:', error)
    }
  }

  const handleSocialHistoryClick = async (categoryId: string, categoryTitle: string) => {
    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/social-history-options/${categoryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const options = await response.json()
        setSocialHistoryOptions(options.data || options)
        setSelectedSocialCategory(categoryTitle)
      } else {
        console.error('Failed to fetch social history options')
      }
    } catch (error) {
      console.error('Error fetching social history options:', error)
    }
  }

  const handleSocialOptionSelect = async (option: any) => {
    const exists = selectedSocialHistory.find(item => item.id === option.id)
    if (!exists) {
      const newSelection = [...selectedSocialHistory, { ...option, category: selectedSocialCategory }]
      setSelectedSocialHistory(newSelection)

      const locationId = getLocationId()
      if (locationId) {
        try {
          const token = localStorage.getItem('authToken')
          await fetch(`${authService.getSettingsApiUrl()}/patient-social-history`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              patient_id: patientId,
              social_history_id: selectedSocialCategory,
              social_history_option_id: option.id,
              category_title: selectedSocialCategory,
              option_title: option.title
            })
          })
        } catch (error) {
          console.error('Error saving social history:', error)
        }
      }
    }
  }

  const handleRemoveSocialSelected = async (optionId: string) => {
    setSelectedSocialHistory(selectedSocialHistory.filter(item => item.id !== optionId))

    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      await fetch(`${authService.getSettingsApiUrl()}/patient-social-history`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: patientId,
          social_history_option_id: optionId
        })
      })
    } catch (error) {
      console.error('Error deleting social history:', error)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (value === 'medical') {
      fetchMedicalHistoryCategories()
      fetchPatientMedicalHistory()
    } else if (value === 'personal') {
      fetchPersonalHistoryCategories()
      fetchPatientPersonalHistory()
    } else if (value === 'lifestyle') {
      fetchLifestyleCategories()
      fetchPatientLifestyle()
    } else if (value === 'family') {
      fetchFamilyHistoryCategories()
      fetchPatientFamilyHistory()
    } else if (value === 'drug') {
      fetchDrugHistoryCategories()
      fetchPatientDrugHistory()
    } else if (value === 'allergies') {
      fetchAllergiesCategories()
      fetchPatientAllergies()
    } else if (value === 'social') {
      fetchSocialHistoryCategories()
      fetchPatientSocialHistory()
    } else if (value === 'examinations') {
      fetchPatientExaminations()
      fetchTreatmentPlans()
    } else if (value === 'prescription') {
      fetchPatientPrescriptions()
      fetchMedicationTypes()
      fetchMedicines()
      fetchPotencies()
      fetchDosages()
    } else if (value === 'presenting-complaints') {
      fetchPatientPresentingComplaints()
    }
  }

  const loadAllData = async () => {
    await Promise.all([
      fetchPatientMedicalHistory(),
      fetchPatientPersonalHistory(),
      fetchPatientLifestyle(),
      fetchPatientFamilyHistory(),
      fetchPatientDrugHistory(),
      fetchPatientAllergies(),
      fetchPatientSocialHistory(),
      fetchPatientExaminations(),
      fetchPatientPrescriptions(),
      fetchPatientPresentingComplaints()
    ])
  }

  const handleMedicalHistoryClick = async (categoryId: string, categoryTitle: string) => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/medical-history-options/${categoryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const options = await response.json()
        setMedicalHistoryOptions(options.data || options)
        setSelectedCategory(categoryTitle)
      } else {
        console.error('Failed to fetch medical history options')
      }
    } catch (error) {
      console.error('Error fetching medical history options:', error)
    }
  }

  const handleOptionSelect = async (option: any) => {
    const exists = selectedMedicalHistory.find(item => item.id === option.id)
    if (!exists) {
      const newSelection = [...selectedMedicalHistory, { ...option, category: selectedCategory }]
      setSelectedMedicalHistory(newSelection)

      const locationId = getLocationId()
      if (locationId) {
        try {
          const token = localStorage.getItem('authToken')
          await fetch(`${authService.getSettingsApiUrl()}/patient-medical-history`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              patient_id: patientId,
              medical_history_id: selectedCategory,
              medical_history_option_id: option.id,
              category_title: selectedCategory,
              option_title: option.title
            })
          })
        } catch (error) {
          console.error('Error saving medical history:', error)
        }
      } else {
        console.error('No location selected')
      }
    }
  }

  const handleRemoveSelected = async (optionId: string) => {
    setSelectedMedicalHistory(selectedMedicalHistory.filter(item => item.id !== optionId))

    try {
      const token = localStorage.getItem('authToken')
      await fetch(`${authService.getSettingsApiUrl()}/patient-medical-history`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: patientId,
          medical_history_option_id: optionId
        })
      })
    } catch (error) {
      console.error('Error deleting medical history:', error)
    }
  }

  const calculateNextRenewalDate = (months: number) => {
    const today = new Date()
    const nextDate = new Date(today)
    nextDate.setMonth(today.getMonth() + months)
    return nextDate.toISOString().split('T')[0]
  }

  const handleTreatmentPlanChange = (value: string) => {
    const months = parseInt(value)
    const nextDate = calculateNextRenewalDate(months)
    setExaminationData({
      ...examinationData,
      treatmentPlanMonthsDoctor: value,
      nextRenewalDateDoctor: nextDate
    })
  }

  const fetchTreatmentPlans = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/treatment-plans`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        setTreatmentPlans(result || [])
      }
    } catch (error) {
      console.error('Error fetching treatment plans:', error)
    }
  }

  const fetchPatientExaminations = async () => {
    if (!patientId) return

    try {
      setLoadingExaminations(true)
      const result = await examinationApi.getPatientExaminations(patientId)
      setExaminations(result || [])
    } catch (error) {
      console.error('Error fetching patient examinations:', error)
    } finally {
      setLoadingExaminations(false)
    }
  }

  const handleExaminationSubmit = async () => {
    if (!patientId) return

    const locationId = getLocationId()
    if (!locationId) {
      console.error('No location selected')
      return
    }

    try {
      const newExam = await examinationApi.createExamination({
        patientId: patientId,
        locationId: locationId,
        pastMedicalReports: examinationData.pastMedicalReports,
        investigationsRequired: examinationData.investigationsRequired,
        physicalExamination: examinationData.physicalExamination,
        bp: examinationData.bp,
        pulse: examinationData.pulse,
        heartRate: examinationData.heartRate,
        weight: examinationData.weight,
        rr: examinationData.rr,
        menstrualObstetricHistory: examinationData.menstrualObstetricHistory,
        treatmentPlanMonthsDoctor: examinationData.treatmentPlanMonthsDoctor ? parseInt(examinationData.treatmentPlanMonthsDoctor) : null,
        nextRenewalDateDoctor: examinationData.nextRenewalDateDoctor || null,
      })

      // Auto-upload selected report files if any
      if (selectedReportFiles && selectedReportFiles.length > 0 && newExam?.id) {
        try {
          const token = localStorage.getItem('authToken')
          const formData = new FormData()
          Array.from(selectedReportFiles).forEach(file => formData.append('files', file))
          const uploadRes = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${newExam.id}/upload-reports`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
          })
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json()
            setExaminationReports(prev => ({ ...prev, [newExam.id]: uploadData.files || [] }))
          }
        } catch (uploadErr) {
          console.error('Error uploading report files:', uploadErr)
        }
      }

      // Reset form and refresh data
      setExaminationData({
        pastMedicalReports: '',
        investigationsRequired: '',
        physicalExamination: '',
        bp: '',
        pulse: '',
        heartRate: '',
        weight: '',
        rr: '',
        menstrualObstetricHistory: '',
        treatmentPlanMonthsDoctor: '',
        nextRenewalDateDoctor: ''
      })
      setSelectedReportFiles(null)
      // Reset the file input
      const formFileInput = document.getElementById('form-report-upload') as HTMLInputElement
      if (formFileInput) formFileInput.value = ''

      fetchPatientExaminations()
      alert('Examination saved successfully!')
    } catch (error) {
      console.error('Error saving examination:', error)
      alert('Failed to save examination')
    }
  }


  const handleUpdateRenewalDate = async (id: number) => {
    try {
      await examinationApi.updateExamination(id, {
        nextRenewalDateDoctor: editingRenewalDate
      })
      setEditingExamId(null)
      fetchPatientExaminations()
      alert('Next Renewal Date updated successfully!')
    } catch (error) {
      console.error('Error updating renewal date:', error)
      alert('Failed to update renewal date')
    }
  }

  const handleDeleteExamination = async (id: number) => {
    console.log('[Delete Debug] Proceeding to hit API for ID:', id);
    try {
      await examinationApi.deleteExamination(id)
      console.log('[Delete Debug] Successfully deleted ID:', id);
      setExaminations(prev => prev.filter((e: any) => e.id !== id))
      setDeletingExamId(null);
      alert('Examination record deleted successfully')
    } catch (error) {
      console.error('[Delete Debug] Error deleting examination:', error)
      alert('Failed to delete examination. Check console for details.')
      setDeletingExamId(null);
    }
  }

  const fetchExaminationReports = async (examId: number) => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${examId}/reports`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setExaminationReports(prev => ({ ...prev, [examId]: data.files || [] }))
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    }
  }

  const handleUploadReports = async (examId: number) => {
    if (!selectedReportFiles || selectedReportFiles.length === 0) {
      alert('Please select at least one file')
      return
    }
    setUploadingReports(true)
    try {
      const token = localStorage.getItem('authToken')
      const formData = new FormData()
      Array.from(selectedReportFiles).forEach(file => formData.append('files', file))
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${examId}/upload-reports`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      })
      if (response.ok) {
        const data = await response.json()
        setExaminationReports(prev => ({ ...prev, [examId]: data.files || [] }))
        setSelectedReportFiles(null)
        setUploadTargetExamId(null)
        // Reset file input
        const fileInput = document.getElementById(`report-upload-${examId}`) as HTMLInputElement
        if (fileInput) fileInput.value = ''
        alert('Reports uploaded successfully!')
      } else {
        alert('Failed to upload reports')
      }
    } catch (error) {
      console.error('Error uploading reports:', error)
      alert('Failed to upload reports')
    } finally {
      setUploadingReports(false)
    }
  }

  const handleDeleteReportFile = async (examId: number, filename: string) => {
    if (!confirm(`Delete file "${filename}"?`)) return
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${examId}/reports/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setExaminationReports(prev => ({ ...prev, [examId]: data.files || [] }))
      } else {
        alert('Failed to delete file')
      }
    } catch (error) {
      console.error('Error deleting report file:', error)
      alert('Failed to delete file')
    }
  }

  const fetchPatientData = async (id: string) => {

    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patients/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const patient = await response.json()
        const calculateAge = (dob: string) => {
          const today = new Date()
          const birthDate = new Date(dob)
          const age = today.getFullYear() - birthDate.getFullYear()
          const monthDiff = today.getMonth() - birthDate.getMonth()
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1
          }
          return age
        }

        const formattedData = {
          id: patient.patient_id,
          name: patient.first_name,
          lastName: patient.last_name,
          age: calculateAge(patient.date_of_birth),
          gender: patient.gender.toLowerCase() === 'm' ? 'Male' : patient.gender.toLowerCase() === 'f' ? 'Female' : 'Other',
          patientId: patient.patient_id,
          title: patient.title || 'Mr.',
          height: patient.height,
          weight: patient.weight,
          visitDate: patient.created_at,
          visitTime: patient.created_at,
          maritalStatus: patient.marital_status
        }
        setPatientData(formattedData)
      } else {
        console.error('Failed to fetch patient data')
      }
    } catch (error) {
      console.error('Error fetching patient data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {showPrintView ? (
        <div className="bg-white p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Patient Case Sheet - Complete Report</h1>
            <div className="flex gap-2">
              <Button onClick={() => window.print()} className="bg-blue-600">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button onClick={() => setShowPrintView(false)} variant="outline">
                Close
              </Button>
            </div>
          </div>

          {/* Patient Info */}
          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-bold mb-2">Patient Information</h2>
            <div className="grid grid-cols-4 gap-4">
              <div><strong>Name:</strong> {patientData ? `${patientData.name} ${patientData.lastName}` : 'N/A'}</div>
              <div><strong>Age:</strong> {patientData?.age || 'N/A'}</div>
              <div><strong>Gender:</strong> {patientData?.gender || 'N/A'}</div>
              <div><strong>Patient ID:</strong> {patientData?.patientId || 'N/A'}</div>
            </div>
          </div>

          {/* Medical History */}
          {(selectedMedicalHistory.length > 0 || medicalHistoryNotes) && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Medical History</h2>
              {selectedMedicalHistory.length > 0 && (
                <table className="w-full border-collapse border mb-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Category</th>
                      <th className="border p-2 text-left">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(
                      selectedMedicalHistory.reduce((acc: any, item) => {
                        if (!acc[item.category]) acc[item.category] = []
                        acc[item.category].push(item)
                        return acc
                      }, {})
                    ).map(([category, items]: [string, any[]]) => (
                      <tr key={category}>
                        <td className="border p-2 font-medium">{category}</td>
                        <td className="border p-2">{items.map(i => i.title).join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {medicalHistoryNotes && (
                <div className="p-2 border bg-gray-50 text-sm">
                  <strong>Notes:</strong> {medicalHistoryNotes}
                </div>
              )}
            </div>
          )}

          {/* Personal History */}
          {(selectedPersonalHistory.length > 0 || personalHistoryNotes) && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Personal History</h2>
              {selectedPersonalHistory.length > 0 && (
                <table className="w-full border-collapse border mb-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Category</th>
                      <th className="border p-2 text-left">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(
                      selectedPersonalHistory.reduce((acc: any, item) => {
                        if (!acc[item.category]) acc[item.category] = []
                        acc[item.category].push(item)
                        return acc
                      }, {})
                    ).map(([category, items]: [string, any[]]) => (
                      <tr key={category}>
                        <td className="border p-2 font-medium">{category}</td>
                        <td className="border p-2">{items.map(i => i.title).join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {personalHistoryNotes && (
                <div className="p-2 border bg-gray-50 text-sm">
                  <strong>Notes:</strong> {personalHistoryNotes}
                </div>
              )}
            </div>
          )}

          {/* Lifestyle */}
          {(selectedLifestyle.length > 0 || lifestyleNotes) && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Life Style</h2>
              {selectedLifestyle.length > 0 && (
                <table className="w-full border-collapse border mb-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Category</th>
                      <th className="border p-2 text-left">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(
                      selectedLifestyle.reduce((acc: any, item) => {
                        if (!acc[item.category]) acc[item.category] = []
                        acc[item.category].push(item)
                        return acc
                      }, {})
                    ).map(([category, items]: [string, any[]]) => (
                      <tr key={category}>
                        <td className="border p-2 font-medium">{category}</td>
                        <td className="border p-2">{items.map(i => i.title).join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {lifestyleNotes && (
                <div className="p-2 border bg-gray-50 text-sm">
                  <strong>Notes:</strong> {lifestyleNotes}
                </div>
              )}
            </div>
          )}

          {/* Family History */}
          {(selectedFamilyHistory.length > 0 || familyHistoryNotes) && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Family History</h2>
              {selectedFamilyHistory.length > 0 && (
                <table className="w-full border-collapse border mb-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Category</th>
                      <th className="border p-2 text-left">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(
                      selectedFamilyHistory.reduce((acc: any, item) => {
                        if (!acc[item.category]) acc[item.category] = []
                        acc[item.category].push(item)
                        return acc
                      }, {})
                    ).map(([category, items]: [string, any[]]) => (
                      <tr key={category}>
                        <td className="border p-2 font-medium">{category}</td>
                        <td className="border p-2">{items.map(i => i.title).join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {familyHistoryNotes && (
                <div className="p-2 border bg-gray-50 text-sm">
                  <strong>Notes:</strong> {familyHistoryNotes}
                </div>
              )}
            </div>
          )}

          {/* Drug History */}
          {(selectedDrugHistory.length > 0 || drugHistoryNotes) && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Drug History</h2>
              {selectedDrugHistory.length > 0 && (
                <table className="w-full border-collapse border mb-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Category</th>
                      <th className="border p-2 text-left">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(
                      selectedDrugHistory.reduce((acc: any, item) => {
                        if (!acc[item.category]) acc[item.category] = []
                        acc[item.category].push(item)
                        return acc
                      }, {})
                    ).map(([category, items]: [string, any[]]) => (
                      <tr key={category}>
                        <td className="border p-2 font-medium">{category}</td>
                        <td className="border p-2">{items.map(i => i.title).join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {drugHistoryNotes && (
                <div className="p-2 border bg-gray-50 text-sm">
                  <strong>Notes:</strong> {drugHistoryNotes}
                </div>
              )}
            </div>
          )}

          {/* Allergies */}
          {(selectedAllergies.length > 0 || allergiesNotes) && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Allergies</h2>
              {selectedAllergies.length > 0 && (
                <table className="w-full border-collapse border mb-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Category</th>
                      <th className="border p-2 text-left">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(
                      selectedAllergies.reduce((acc: any, item) => {
                        if (!acc[item.category]) acc[item.category] = []
                        acc[item.category].push(item)
                        return acc
                      }, {})
                    ).map(([category, items]: [string, any[]]) => (
                      <tr key={category}>
                        <td className="border p-2 font-medium">{category}</td>
                        <td className="border p-2">{items.map(i => i.title).join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {allergiesNotes && (
                <div className="p-2 border bg-gray-50 text-sm">
                  <strong>Notes:</strong> {allergiesNotes}
                </div>
              )}
            </div>
          )}

          {/* Social History */}
          {(selectedSocialHistory.length > 0 || socialHistoryNotes) && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Social History</h2>
              {selectedSocialHistory.length > 0 && (
                <table className="w-full border-collapse border mb-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Category</th>
                      <th className="border p-2 text-left">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(
                      selectedSocialHistory.reduce((acc: any, item) => {
                        if (!acc[item.category]) acc[item.category] = []
                        acc[item.category].push(item)
                        return acc
                      }, {})
                    ).map(([category, items]: [string, any[]]) => (
                      <tr key={category}>
                        <td className="border p-2 font-medium">{category}</td>
                        <td className="border p-2">{items.map(i => i.title).join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {socialHistoryNotes && (
                <div className="p-2 border bg-gray-50 text-sm">
                  <strong>Notes:</strong> {socialHistoryNotes}
                </div>
              )}
            </div>
          )}



          {/* Examinations */}
          {examinations.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Examinations</h2>
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Date</th>
                    <th className="border p-2 text-left">Vitals</th>
                    <th className="border p-2 text-left">Examination</th>
                    <th className="border p-2 text-left">Notes/Investigations</th>
                  </tr>
                </thead>
                <tbody>
                  {examinations.map((exam, idx) => (
                    <tr key={exam.id}>
                      <td className="border p-2 align-top w-32">
                        {new Date(exam.createdAt).toLocaleDateString()}
                      </td>
                      <td className="border p-2 align-top">
                        <ul className="list-disc pl-4 mb-0 text-sm">
                          {exam.bp && <li><strong>BP:</strong> {exam.bp}</li>}
                          {exam.pulse && <li><strong>Pulse:</strong> {exam.pulse}</li>}
                          {exam.heartRate && <li><strong>Heart Rate:</strong> {exam.heartRate}</li>}
                          {exam.weight && <li><strong>Weight:</strong> {exam.weight}</li>}
                          {exam.rr && <li><strong>RR:</strong> {exam.rr}</li>}
                        </ul>
                      </td>
                      <td className="border p-2 align-top">
                        {exam.physicalExamination && <div className="text-sm">{exam.physicalExamination}</div>}
                      </td>
                      <td className="border p-2 align-top">
                        {exam.pastMedicalReports && <div className="text-sm mb-1"><strong>Past Reports:</strong> {exam.pastMedicalReports}</div>}
                        {exam.investigationsRequired && <div className="text-sm"><strong>Investigations:</strong> {exam.investigationsRequired}</div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Prescriptions */}
          {savedPrescriptions.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Medication</h2>
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Date</th>
                    <th className="border p-2 text-left">Medicine</th>
                    <th className="border p-2 text-left">Potency</th>
                    <th className="border p-2 text-left">Dosage</th>
                    <th className="border p-2 text-left">Timing</th>
                    <th className="border p-2 text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {savedPrescriptions.map((p, idx) => (
                    <tr key={idx}>
                      <td className="border p-2 text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
                      <td className="border p-2">{p.medicine}</td>
                      <td className="border p-2">{p.potency}</td>
                      <td className="border p-2">{p.dosage}</td>
                      <td className="border p-2 text-xs">
                        {[p.morning && 'Morning', p.afternoon && 'Afternoon', p.night && 'Night'].filter(Boolean).join(', ')}
                      </td>
                      <td className="border p-2 text-xs">
                        {p.medicine_notes && <div><strong>Med:</strong> {p.medicine_notes}</div>}
                        {p.notes_to_pro && <div><strong>PRO:</strong> {p.notes_to_pro}</div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Detailed Patient Case Sheet</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={async () => {
                await loadAllData()
                setShowPrintView(true)
              }}>
                <Printer className="h-4 w-4 mr-2" />
                Print Report
              </Button>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-3">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm font-medium">Patient Name:</Label>
                  <span className="text-sm font-semibold ml-2">
                    {loading ? 'Loading...' : patientData ? `${patientData.name} ${patientData.lastName}` : 'N/A'}
                  </span>
                </div>
                <div>
                  <Label className="text-sm font-medium">Age:</Label>
                  <span className="text-sm ml-2">
                    {loading ? 'Loading...' : patientData?.age || 'N/A'}
                  </span>
                </div>
                <div>
                  <Label className="text-sm font-medium">Gender:</Label>
                  <span className="text-sm ml-2">
                    {loading ? 'Loading...' : patientData?.gender || 'N/A'}
                  </span>
                </div>
                <div>
                  <Label className="text-sm font-medium">Patient ID:</Label>
                  <span className="text-sm ml-2">
                    {loading ? 'Loading...' : patientData?.patientId || 'N/A'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <TabsList className="flex flex-nowrap w-full justify-between gap-1 bg-gray-50 p-1 rounded-md h-auto border-b overflow-hidden">
                <TabsTrigger value="presenting-complaints" className="flex-1 flex-shrink-0 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 px-2.5 py-2 text-[11px] font-semibold rounded-t-md transition-all duration-200 hover:bg-white/50 border-transparent border-b-2">
                  Presenting complaints
                </TabsTrigger>
                <TabsTrigger value="medical" className="flex-1 flex-shrink-0 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 px-2.5 py-2 text-[11px] font-semibold rounded-t-md transition-all duration-200 hover:bg-white/50 border-transparent border-b-2">
                  Medical History
                </TabsTrigger>
                <TabsTrigger value="personal" className="flex-1 flex-shrink-0 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 px-2.5 py-2 text-[11px] font-semibold rounded-t-md transition-all duration-200 hover:bg-white/50 border-transparent border-b-2">
                  Personal History
                </TabsTrigger>
                <TabsTrigger value="lifestyle" className="flex-1 flex-shrink-0 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 px-2.5 py-2 text-[11px] font-semibold rounded-t-md transition-all duration-200 hover:bg-white/50 border-transparent border-b-2">
                  Life Style
                </TabsTrigger>
                <TabsTrigger value="family" className="flex-1 flex-shrink-0 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 px-2.5 py-2 text-[11px] font-semibold rounded-t-md transition-all duration-200 hover:bg-white/50 border-transparent border-b-2">
                  Family History
                </TabsTrigger>
                <TabsTrigger value="drug" className="flex-1 flex-shrink-0 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 px-2.5 py-2 text-[11px] font-semibold rounded-t-md transition-all duration-200 hover:bg-white/50 border-transparent border-b-2">
                  Drug History
                </TabsTrigger>
                <TabsTrigger value="allergies" className="flex-1 flex-shrink-0 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 px-2.5 py-2 text-[11px] font-semibold rounded-t-md transition-all duration-200 hover:bg-white/50 border-transparent border-b-2">
                  Allergies
                </TabsTrigger>
                <TabsTrigger value="social" className="flex-1 flex-shrink-0 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 px-2.5 py-2 text-[11px] font-semibold rounded-t-md transition-all duration-200 hover:bg-white/50 border-transparent border-b-2">
                  Social History
                </TabsTrigger>
                <TabsTrigger value="examinations" className="flex-1 flex-shrink-0 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 px-2.5 py-2 text-[11px] font-semibold rounded-t-md transition-all duration-200 hover:bg-white/50 border-transparent border-b-2">
                  Examinations
                </TabsTrigger>
                <TabsTrigger value="prescription" className="flex-1 flex-shrink-0 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 px-2.5 py-2 text-[11px] font-semibold rounded-t-md transition-all duration-200 hover:bg-white/50 border-transparent border-b-2">
                  Prescription
                </TabsTrigger>
              </TabsList>
            </div>




            <TabsContent value="presenting-complaints" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Add Presenting Complaints</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter Presenting Complaints Notes"
                    rows={6}
                    value={presentingComplaintsNotes}
                    onChange={(e) => setPresentingComplaintsNotes(e.target.value)}
                    className="mb-4"
                  />
                  <div className="flex justify-end gap-2">
                    {editingComplaintId && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingComplaintId(null)
                          setPresentingComplaintsNotes('')
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                    <Button onClick={handlePresentingComplaintsSubmit}>
                      <Save className="h-4 w-4 mr-2" />
                      {editingComplaintId ? 'Update' : 'Save'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Previous Presenting Complaints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {presentingComplaints.length > 0 ? (
                      presentingComplaints.map((item, index) => (
                        <div key={index} className="border-b pb-4 last:border-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-sm font-semibold text-blue-600">
                              By {item.first_name} {item.last_name}
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-xs text-gray-500">
                                {new Date(item.created_at).toLocaleString()}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => {
                                  setEditingComplaintId(item.id)
                                  setPresentingComplaintsNotes(item.notes)
                                  window.scrollTo({ top: 0, behavior: 'smooth' })
                                }}
                              >
                                <Pencil className="h-4 w-4 text-blue-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 ml-1"
                                onClick={() => handleDeleteComplaint(item.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-sm bg-gray-50 p-3 rounded-md border text-gray-700 whitespace-pre-wrap">
                            {item.notes}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        No previous complaints recorded
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medical" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Medical History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input placeholder="search" className="mb-4" />
                    <div className="space-y-2">
                      {medicalHistoryCategories.length > 0 ? (
                        medicalHistoryCategories.map((category) => (
                          <Button
                            key={category.id}
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleMedicalHistoryClick(category.id, category.title)}
                          >
                            {category.title}
                          </Button>
                        ))
                      ) : (
                        <div className="text-gray-500">Loading categories...</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Select Medical History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center font-medium mb-4">{selectedCategory || 'Select Medical History'}</div>
                    <div className="grid grid-cols-3 gap-2">
                      {medicalHistoryOptions.map((option) => {
                        const isSelected = selectedMedicalHistory.some(item => item.id === option.id)
                        return (
                          <div
                            key={option.id}
                            className={`flex flex-col items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-red-100 border-red-300' : ''
                              }`}
                            onClick={() => handleOptionSelect(option)}
                          >
                            <div className={`w-5 h-5 rounded-full mb-1 ${isSelected ? 'bg-red-500' : 'bg-gray-400'
                              }`}></div>
                            <span className="text-xs font-medium text-center leading-tight">{option.title}</span>
                          </div>
                        )
                      })}
                      {medicalHistoryOptions.length === 0 && (
                        <div className="col-span-3 text-center text-gray-500 py-8">
                          Select a category from the left
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-600">Selected Medical History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(
                        selectedMedicalHistory.reduce((acc: any, item) => {
                          if (!acc[item.category]) {
                            acc[item.category] = []
                          }
                          acc[item.category].push(item)
                          return acc
                        }, {})
                      ).map(([category, items]: [string, any[]]) => (
                        <div key={category} className="border-l-4 border-blue-500 pl-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-blue-600">{category.toUpperCase()}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updatedHistory = selectedMedicalHistory.filter(item => item.category !== category)
                                setSelectedMedicalHistory(updatedHistory)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <ul className="mt-2 space-y-1">
                            {items.map((item) => (
                              <li key={item.id} className="text-sm flex items-center justify-between">
                                <span>• {item.title}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleRemoveSelected(item.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {selectedMedicalHistory.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                          No medical history selected
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Medical History Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter Notes"
                    rows={4}
                    value={medicalHistoryNotes}
                    onChange={(e) => setMedicalHistoryNotes(e.target.value)}
                  />
                  <Button
                    className="mt-2 float-right"
                    onClick={handleMedicalHistoryNotesSubmit}
                  >
                    Submit
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input placeholder="search" className="mb-4" />
                    <div className="space-y-2">
                      {personalHistoryCategories.length > 0 ? (
                        personalHistoryCategories.map((category) => (
                          <Button
                            key={category.id}
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handlePersonalHistoryClick(category.id, category.title)}
                          >
                            {category.title}
                          </Button>
                        ))
                      ) : (
                        <div className="text-gray-500">Loading categories...</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Select Personal History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center font-medium mb-4">{selectedPersonalCategory || 'Select Personal History'}</div>
                    <div className="grid grid-cols-3 gap-2">
                      {personalHistoryOptions.map((option) => {
                        const isSelected = selectedPersonalHistory.some(item => item.id === option.id)
                        return (
                          <div
                            key={option.id}
                            className={`flex flex-col items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-red-100 border-red-300' : ''
                              }`}
                            onClick={() => handlePersonalOptionSelect(option)}
                          >
                            <div className={`w-5 h-5 rounded-full mb-1 ${isSelected ? 'bg-red-500' : 'bg-gray-400'
                              }`}></div>
                            <span className="text-xs font-medium text-center leading-tight">{option.title}</span>
                          </div>
                        )
                      })}
                      {personalHistoryOptions.length === 0 && (
                        <div className="col-span-3 text-center text-gray-500 py-8">
                          Select a category from the left
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-600">Selected Personal History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(
                        selectedPersonalHistory.reduce((acc: any, item) => {
                          if (!acc[item.category]) {
                            acc[item.category] = []
                          }
                          acc[item.category].push(item)
                          return acc
                        }, {})
                      ).map(([category, items]: [string, any[]]) => (
                        <div key={category} className="border-l-4 border-blue-500 pl-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-blue-600">{category.toUpperCase()}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updatedHistory = selectedPersonalHistory.filter(item => item.category !== category)
                                setSelectedPersonalHistory(updatedHistory)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <ul className="mt-2 space-y-1">
                            {items.map((item) => (
                              <li key={item.id} className="text-sm flex items-center justify-between">
                                <span>• {item.title}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleRemovePersonalSelected(item.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {selectedPersonalHistory.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                          No personal history selected
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Personal History Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter Notes"
                    rows={4}
                    value={personalHistoryNotes}
                    onChange={(e) => setPersonalHistoryNotes(e.target.value)}
                  />
                  <Button
                    className="mt-2 float-right"
                    onClick={handlePersonalHistoryNotesSubmit}
                  >
                    Submit
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lifestyle" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Life Style</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input placeholder="search" className="mb-4" />
                    <div className="space-y-2">
                      {lifestyleCategories.length > 0 ? (
                        lifestyleCategories.map((category) => (
                          <Button
                            key={category.id}
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleLifestyleClick(category.id, category.title)}
                          >
                            {category.title}
                          </Button>
                        ))
                      ) : (
                        <div className="text-gray-500">Loading categories...</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Select Life Style</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center font-medium mb-4">{selectedLifestyleCategory || 'Select Life Style'}</div>
                    <div className="grid grid-cols-3 gap-2">
                      {lifestyleOptions.map((option) => {
                        const isSelected = selectedLifestyle.some(item => item.id === option.id)
                        return (
                          <div
                            key={option.id}
                            className={`flex flex-col items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-red-100 border-red-300' : ''
                              }`}
                            onClick={() => handleLifestyleOptionSelect(option)}
                          >
                            <div className={`w-5 h-5 rounded-full mb-1 ${isSelected ? 'bg-red-500' : 'bg-gray-400'
                              }`}></div>
                            <span className="text-xs font-medium text-center leading-tight">{option.title}</span>
                          </div>
                        )
                      })}
                      {lifestyleOptions.length === 0 && (
                        <div className="col-span-3 text-center text-gray-500 py-8">
                          Select a category from the left
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-600">Selected Life Style</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(
                        selectedLifestyle.reduce((acc: any, item) => {
                          if (!acc[item.category]) {
                            acc[item.category] = []
                          }
                          acc[item.category].push(item)
                          return acc
                        }, {})
                      ).map(([category, items]: [string, any[]]) => (
                        <div key={category} className="border-l-4 border-blue-500 pl-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-blue-600">{category.toUpperCase()}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updatedHistory = selectedLifestyle.filter(item => item.category !== category)
                                setSelectedLifestyle(updatedHistory)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <ul className="mt-2 space-y-1">
                            {items.map((item) => (
                              <li key={item.id} className="text-sm flex items-center justify-between">
                                <span>• {item.title}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleRemoveLifestyleSelected(item.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {selectedLifestyle.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                          No lifestyle selected
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Life Style Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter Notes"
                    rows={4}
                    value={lifestyleNotes}
                    onChange={(e) => setLifestyleNotes(e.target.value)}
                  />
                  <Button
                    className="mt-2 float-right"
                    onClick={handleLifestyleNotesSubmit}
                  >
                    Submit
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="family" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Family History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input placeholder="search" className="mb-4" />
                    <div className="space-y-2">
                      {familyHistoryCategories.length > 0 ? (
                        familyHistoryCategories.map((category) => (
                          <Button
                            key={category.id}
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleFamilyHistoryClick(category.id, category.title)}
                          >
                            {category.title}
                          </Button>
                        ))
                      ) : (
                        <div className="text-gray-500">Loading categories...</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Select Family History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center font-medium mb-4">{selectedFamilyCategory || 'Select Family History'}</div>
                    <div className="grid grid-cols-3 gap-2">
                      {familyHistoryOptions.map((option) => {
                        const isSelected = selectedFamilyHistory.some(item => item.id === option.id)
                        return (
                          <div
                            key={option.id}
                            className={`flex flex-col items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-red-100 border-red-300' : ''
                              }`}
                            onClick={() => handleFamilyOptionSelect(option)}
                          >
                            <div className={`w-5 h-5 rounded-full mb-1 ${isSelected ? 'bg-red-500' : 'bg-gray-400'
                              }`}></div>
                            <span className="text-xs font-medium text-center leading-tight">{option.title}</span>
                          </div>
                        )
                      })}
                      {familyHistoryOptions.length === 0 && (
                        <div className="col-span-3 text-center text-gray-500 py-8">
                          Select a category from the left
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-600">Selected Family History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(
                        selectedFamilyHistory.reduce((acc: any, item) => {
                          if (!acc[item.category]) {
                            acc[item.category] = []
                          }
                          acc[item.category].push(item)
                          return acc
                        }, {})
                      ).map(([category, items]: [string, any[]]) => (
                        <div key={category} className="border-l-4 border-blue-500 pl-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-blue-600">{category.toUpperCase()}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updatedHistory = selectedFamilyHistory.filter(item => item.category !== category)
                                setSelectedFamilyHistory(updatedHistory)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <ul className="mt-2 space-y-1">
                            {items.map((item) => (
                              <li key={item.id} className="text-sm flex items-center justify-between">
                                <span>• {item.title}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleRemoveFamilySelected(item.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {selectedFamilyHistory.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                          No family history selected
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Family History Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter Notes"
                    rows={4}
                    value={familyHistoryNotes}
                    onChange={(e) => setFamilyHistoryNotes(e.target.value)}
                  />
                  <Button
                    className="mt-2 float-right"
                    onClick={handleFamilyHistoryNotesSubmit}
                  >
                    Submit
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="drug" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Drug History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input placeholder="search" className="mb-4" />
                    <div className="space-y-2">
                      {drugHistoryCategories.length > 0 ? (
                        drugHistoryCategories.map((category) => (
                          <Button
                            key={category.id}
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleDrugHistoryClick(category.id, category.title)}
                          >
                            {category.title}
                          </Button>
                        ))
                      ) : (
                        <div className="text-gray-500">Loading categories...</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Select Drug History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center font-medium mb-4">{selectedDrugCategory || 'Select Drug History'}</div>
                    <div className="grid grid-cols-3 gap-2">
                      {drugHistoryOptions.map((option) => {
                        const isSelected = selectedDrugHistory.some(item => item.id === option.id)
                        return (
                          <div
                            key={option.id}
                            className={`flex flex-col items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-red-100 border-red-300' : ''
                              }`}
                            onClick={() => handleDrugOptionSelect(option)}
                          >
                            <div className={`w-5 h-5 rounded-full mb-1 ${isSelected ? 'bg-red-500' : 'bg-gray-400'
                              }`}></div>
                            <span className="text-xs font-medium text-center leading-tight">{option.title}</span>
                          </div>
                        )
                      })}
                      {drugHistoryOptions.length === 0 && (
                        <div className="col-span-3 text-center text-gray-500 py-8">
                          Select a category from the left
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-600">Selected Drug History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(
                        selectedDrugHistory.reduce((acc: any, item) => {
                          if (!acc[item.category]) {
                            acc[item.category] = []
                          }
                          acc[item.category].push(item)
                          return acc
                        }, {})
                      ).map(([category, items]: [string, any[]]) => (
                        <div key={category} className="border-l-4 border-blue-500 pl-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-blue-600">{category.toUpperCase()}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updatedHistory = selectedDrugHistory.filter(item => item.category !== category)
                                setSelectedDrugHistory(updatedHistory)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <ul className="mt-2 space-y-1">
                            {items.map((item) => (
                              <li key={item.id} className="text-sm flex items-center justify-between">
                                <span>• {item.title}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleRemoveDrugSelected(item.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {selectedDrugHistory.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                          No drug history selected
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Drug History Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter Notes"
                    rows={4}
                    value={drugHistoryNotes}
                    onChange={(e) => setDrugHistoryNotes(e.target.value)}
                  />
                  <Button
                    className="mt-2 float-right"
                    onClick={handleDrugHistoryNotesSubmit}
                  >
                    Submit
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="allergies" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Allergies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input placeholder="search" className="mb-4" />
                    <div className="space-y-2">
                      {allergiesCategories.length > 0 ? (
                        allergiesCategories.map((category) => (
                          <Button
                            key={category.id}
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleAllergiesClick(category.id, category.title)}
                          >
                            {category.title}
                          </Button>
                        ))
                      ) : (
                        <div className="text-gray-500">Loading categories...</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Select Allergies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center font-medium mb-4">{selectedAllergiesCategory || 'Select Allergies'}</div>
                    <div className="grid grid-cols-3 gap-2">
                      {allergiesOptions.map((option) => {
                        const isSelected = selectedAllergies.some(item => item.id === option.id)
                        return (
                          <div
                            key={option.id}
                            className={`flex flex-col items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-red-100 border-red-300' : ''
                              }`}
                            onClick={() => handleAllergiesOptionSelect(option)}
                          >
                            <div className={`w-5 h-5 rounded-full mb-1 ${isSelected ? 'bg-red-500' : 'bg-gray-400'
                              }`}></div>
                            <span className="text-xs font-medium text-center leading-tight">{option.title}</span>
                          </div>
                        )
                      })}
                      {allergiesOptions.length === 0 && (
                        <div className="col-span-3 text-center text-gray-500 py-8">
                          Select a category from the left
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-600">Selected Allergies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(
                        selectedAllergies.reduce((acc: any, item) => {
                          if (!acc[item.category]) {
                            acc[item.category] = []
                          }
                          acc[item.category].push(item)
                          return acc
                        }, {})
                      ).map(([category, items]: [string, any[]]) => (
                        <div key={category} className="border-l-4 border-blue-500 pl-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-blue-600">{category.toUpperCase()}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updatedHistory = selectedAllergies.filter(item => item.category !== category)
                                setSelectedAllergies(updatedHistory)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <ul className="mt-2 space-y-1">
                            {items.map((item) => (
                              <li key={item.id} className="text-sm flex items-center justify-between">
                                <span>• {item.title}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleRemoveAllergiesSelected(item.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {selectedAllergies.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                          No allergies selected
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Allergies Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter Notes"
                    rows={4}
                    value={allergiesNotes}
                    onChange={(e) => setAllergiesNotes(e.target.value)}
                  />
                  <Button
                    className="mt-2 float-right"
                    onClick={handleAllergiesNotesSubmit}
                  >
                    Submit
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Social History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input placeholder="search" className="mb-4" />
                    <div className="space-y-2">
                      {socialHistoryCategories.length > 0 ? (
                        socialHistoryCategories.map((category) => (
                          <Button
                            key={category.id}
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleSocialHistoryClick(category.id, category.title)}
                          >
                            {category.title}
                          </Button>
                        ))
                      ) : (
                        <div className="text-gray-500">Loading categories...</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center">Select Social History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center font-medium mb-4">{selectedSocialCategory || 'Select Social History'}</div>
                    <div className="grid grid-cols-3 gap-2">
                      {socialHistoryOptions.map((option) => {
                        const isSelected = selectedSocialHistory.some(item => item.id === option.id)
                        return (
                          <div
                            key={option.id}
                            className={`flex flex-col items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50 ${isSelected ? 'bg-red-100 border-red-300' : ''
                              }`}
                            onClick={() => handleSocialOptionSelect(option)}
                          >
                            <div className={`w-5 h-5 rounded-full mb-1 ${isSelected ? 'bg-red-500' : 'bg-gray-400'
                              }`}></div>
                            <span className="text-xs font-medium text-center leading-tight">{option.title}</span>
                          </div>
                        )
                      })}
                      {socialHistoryOptions.length === 0 && (
                        <div className="col-span-3 text-center text-gray-500 py-8">
                          Select a category from the left
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-600">Selected Social History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(
                        selectedSocialHistory.reduce((acc: any, item) => {
                          if (!acc[item.category]) {
                            acc[item.category] = []
                          }
                          acc[item.category].push(item)
                          return acc
                        }, {})
                      ).map(([category, items]: [string, any[]]) => (
                        <div key={category} className="border-l-4 border-blue-500 pl-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-blue-600">{category.toUpperCase()}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updatedHistory = selectedSocialHistory.filter(item => item.category !== category)
                                setSelectedSocialHistory(updatedHistory)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <ul className="mt-2 space-y-1">
                            {items.map((item) => (
                              <li key={item.id} className="text-sm flex items-center justify-between">
                                <span>• {item.title}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleRemoveSocialSelected(item.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      {selectedSocialHistory.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                          No social history selected
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Social History Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Enter Notes"
                    rows={4}
                    value={socialHistoryNotes}
                    onChange={(e) => setSocialHistoryNotes(e.target.value)}
                  />
                  <Button
                    className="mt-2 float-right"
                    onClick={handleSocialHistoryNotesSubmit}
                  >
                    Submit
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="examinations" className="space-y-4">
              {voiceTranscript && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-800">Voice Recording Transcript</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-blue-700">{voiceTranscript}</p>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => {
                          setExaminationData({
                            ...examinationData,
                            physicalExamination: examinationData.physicalExamination + '\n' + voiceTranscript
                          });
                          setVoiceTranscript('');
                        }}
                      >
                        Add to Physical Examination
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setVoiceTranscript('')}
                      >
                        Clear
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Add New Examination</CardTitle>
                  <SimpleVoiceRecorder onTranscript={setVoiceTranscript} />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium mb-1.5 block text-gray-700">Past Medical Reports</Label>
                    <Textarea
                      placeholder="Summary of previous medical reports..."
                      rows={3}
                      value={examinationData.pastMedicalReports}
                      onChange={(e) => setExaminationData({ ...examinationData, pastMedicalReports: e.target.value })}
                      className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-1.5 block text-gray-700">Investigations Required</Label>
                    <Textarea
                      placeholder="List any laboratory or diagnostic tests needed..."
                      rows={3}
                      value={examinationData.investigationsRequired}
                      onChange={(e) => setExaminationData({ ...examinationData, investigationsRequired: e.target.value })}
                      className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-1.5 block text-gray-700">Physical Examination</Label>
                    <Textarea
                      placeholder="Describe physical examination findings..."
                      rows={3}
                      value={examinationData.physicalExamination}
                      onChange={(e) => setExaminationData({ ...examinationData, physicalExamination: e.target.value })}
                      className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-4 flex items-center gap-2 text-blue-700">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                      Clinical Examinations / Vitals
                    </Label>
                    <div className="grid grid-cols-5 gap-6">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">BP</Label>
                        <div className="relative">
                          <Input
                            placeholder="e.g. 120/80"
                            value={examinationData.bp}
                            onChange={(e) => setExaminationData({ ...examinationData, bp: e.target.value })}
                            className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Pulse</Label>
                        <div className="relative">
                          <Input
                            placeholder="bpm"
                            value={examinationData.pulse}
                            onChange={(e) => setExaminationData({ ...examinationData, pulse: e.target.value })}
                            className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Heart Rate</Label>
                        <div className="relative">
                          <Input
                            placeholder="bpm"
                            value={examinationData.heartRate}
                            onChange={(e) => setExaminationData({ ...examinationData, heartRate: e.target.value })}
                            className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Weight</Label>
                        <div className="relative">
                          <Input
                            placeholder="kg"
                            value={examinationData.weight}
                            onChange={(e) => setExaminationData({ ...examinationData, weight: e.target.value })}
                            className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">RR</Label>
                        <div className="relative">
                          <Input
                            placeholder="resp/min"
                            value={examinationData.rr}
                            onChange={(e) => setExaminationData({ ...examinationData, rr: e.target.value })}
                            className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Menstrual & Obstetric History</Label>
                    <Textarea
                      placeholder="Enter Menstrual & Obstetric History"
                      rows={3}
                      value={examinationData.menstrualObstetricHistory}
                      onChange={(e) => setExaminationData({ ...examinationData, menstrualObstetricHistory: e.target.value })}
                    />
                  </div>

                  <div className="border border-dashed border-blue-300 rounded-lg p-3 bg-blue-50/40">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Upload Reports</Label>
                    <div className="flex items-center gap-2 flex-wrap">
                      <label
                        htmlFor="form-report-upload"
                        className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
                      >
                        <span>📁</span> Choose Files
                      </label>
                      <input
                        id="form-report-upload"
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => setSelectedReportFiles(e.target.files)}
                      />
                      {selectedReportFiles && selectedReportFiles.length > 0 ? (
                        <span className="text-sm text-green-700 font-medium">
                          ✅ {selectedReportFiles.length} file{selectedReportFiles.length > 1 ? 's' : ''} selected
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">No files chosen — images, PDF, DOC allowed</span>
                      )}
                      {selectedReportFiles && selectedReportFiles.length > 0 && (
                        <button
                          type="button"
                          className="text-xs text-red-500 hover:text-red-700 underline"
                          onClick={() => {
                            setSelectedReportFiles(null)
                            const fi = document.getElementById('form-report-upload') as HTMLInputElement
                            if (fi) fi.value = ''
                          }}
                        >Clear</button>
                      )}
                    </div>
                    {selectedReportFiles && selectedReportFiles.length > 0 && (
                      <ul className="mt-2 space-y-0.5">
                        {Array.from(selectedReportFiles).map((f, i) => (
                          <li key={i} className="text-xs text-gray-600 flex items-center gap-1">
                            <span>📄</span> {f.name} <span className="text-gray-400">({(f.size / 1024).toFixed(1)} KB)</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="text-xs text-gray-400 mt-1.5">Files will be automatically uploaded when you click <strong>Submit</strong>.</p>
                  </div>


                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Treatment Plan</Label>
                      <SearchableSelect
                        value={examinationData.treatmentPlanMonthsDoctor?.toString() || ''}
                        onValueChange={handleTreatmentPlanChange}
                        options={treatmentPlans.map(plan => ({
                          id: plan.months.toString(),
                          title: `${plan.months} Month${plan.months > 1 ? 's' : ''}`
                        }))}
                        valueField="id"
                        placeholder="Select Treatment Duration"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Next Renewal Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal mt-1",
                              !examinationData.nextRenewalDateDoctor && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {examinationData.nextRenewalDateDoctor ? (
                              format(new Date(examinationData.nextRenewalDateDoctor), "dd/MM/yyyy")
                            ) : (
                              <span>DD/MM/YYYY</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={examinationData.nextRenewalDateDoctor ? new Date(examinationData.nextRenewalDateDoctor) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                const offset = date.getTimezoneOffset()
                                const localDate = new Date(date.getTime() - (offset * 60 * 1000))
                                setExaminationData({ ...examinationData, nextRenewalDateDoctor: localDate.toISOString() })
                              } else {
                                setExaminationData({ ...examinationData, nextRenewalDateDoctor: '' })
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleExaminationSubmit}
                    >
                      Submit
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Patient Examinations History</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingExaminations ? (
                    <div className="text-center py-4">Loading examinations...</div>
                  ) : examinations.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">BP</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Pulse</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Heart Rate</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Weight</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">RR</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Physical Examination</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Past Medical Reports</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Investigations Required</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Menstrual & Obstetric History</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Treatment Plan (Doctor)</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Next Renewal (Doctor)</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Upload Reports</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {examinations.map((examination, index) => (
                            <tr key={examination.id} className={cn(
                              "group transition-colors",
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                              "hover:bg-blue-50/30"
                            )}>
                              <td className="border border-gray-300 px-4 py-2">
                                {new Date(examination.createdAt).toLocaleDateString()}
                              </td>
                              <td className="border border-gray-300 px-4 py-2">{examination.bp || '-'}</td>
                              <td className="border border-gray-300 px-4 py-2">{examination.pulse || '-'}</td>
                              <td className="border border-gray-300 px-4 py-2">{examination.heartRate || '-'}</td>
                              <td className="border border-gray-300 px-4 py-2">{examination.weight || '-'}</td>
                              <td className="border border-gray-300 px-4 py-2">{examination.rr || '-'}</td>
                              <td className="border border-gray-300 px-4 py-2 max-w-xs">
                                <div className="truncate" title={examination.physicalExamination}>
                                  {examination.physicalExamination || '-'}
                                </div>
                              </td>
                              <td className="border border-gray-300 px-4 py-2 max-w-xs">
                                <div className="truncate" title={examination.pastMedicalReports}>
                                  {examination.pastMedicalReports || '-'}
                                </div>
                              </td>
                              <td className="border border-gray-300 px-4 py-2 max-w-xs">
                                <div className="truncate" title={examination.investigationsRequired}>
                                  {examination.investigationsRequired || '-'}
                                </div>
                              </td>
                              <td className="border border-gray-300 px-4 py-2 max-w-xs">
                                <div className="truncate" title={examination.menstrualObstetricHistory}>
                                  {examination.menstrualObstetricHistory || '-'}
                                </div>
                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                {examination.treatmentPlanMonthsDoctor || examination.treatment_plan_months_doctor ?
                                  `${examination.treatmentPlanMonthsDoctor || examination.treatment_plan_months_doctor} Month${(examination.treatmentPlanMonthsDoctor || examination.treatment_plan_months_doctor) > 1 ? 's' : ''}`
                                  : '-'
                                }
                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                <div className="flex items-center gap-2">
                                  {editingExamId === examination.id ? (
                                    <>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant={"outline"}
                                            size="sm"
                                            className={cn(
                                              "w-[140px] justify-start text-left font-normal",
                                              !editingRenewalDate && "text-muted-foreground"
                                            )}
                                          >
                                            <CalendarIcon className="mr-2 h-3 w-3" />
                                            {editingRenewalDate ? (
                                              format(new Date(editingRenewalDate), "dd/MM/yyyy")
                                            ) : (
                                              <span>DD/MM/YYYY</span>
                                            )}
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                          <Calendar
                                            mode="single"
                                            selected={editingRenewalDate ? new Date(editingRenewalDate) : undefined}
                                            onSelect={(date) => {
                                              if (date) {
                                                const offset = date.getTimezoneOffset()
                                                const localDate = new Date(date.getTime() - (offset * 60 * 1000))
                                                setEditingRenewalDate(localDate.toISOString())
                                              }
                                            }}
                                            initialFocus
                                          />
                                        </PopoverContent>
                                      </Popover>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                        onClick={() => handleUpdateRenewalDate(examination.id)}
                                      >
                                        <Save className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                        onClick={() => setEditingExamId(null)}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-sm">
                                        {examination.nextRenewalDateDoctor || examination.next_renewal_date_doctor ?
                                          format(new Date(examination.nextRenewalDateDoctor || examination.next_renewal_date_doctor), "dd/MM/yyyy")
                                          : '-'
                                        }
                                      </span>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 w-7 p-0 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => {
                                          setEditingExamId(examination.id)
                                          setEditingRenewalDate(examination.nextRenewalDateDoctor || examination.next_renewal_date_doctor || '')
                                        }}
                                      >
                                        <CalendarIcon className="h-3.5 w-3.5 text-blue-600" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </td>
                              {/* Upload Reports column */}
                              <td className="border border-gray-300 px-4 py-2 min-w-[180px]">
                                <div className="space-y-2">
                                  {/* Show existing uploaded files */}
                                  {(examinationReports[examination.id] || (() => {
                                    let files: string[] = []
                                    try { files = examination.file ? JSON.parse(examination.file) : [] } catch { files = [] }
                                    return files
                                  })()).map((filename: string) => (
                                    <div key={filename} className="flex items-center gap-1 text-xs">
                                      <a
                                        href={`${authService.getSettingsApiUrl().replace('/api', '')}/patientexaminationreport/${filename}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 hover:underline truncate max-w-[120px]"
                                        title={filename}
                                      >
                                        📎 {filename.replace(/^patient_\d+_\d+-\d+/, '').replace(/^_/, '')}
                                      </a>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-5 w-5 p-0 text-red-500 hover:text-red-700 flex-shrink-0"
                                        onClick={() => handleDeleteReportFile(examination.id, filename)}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                  {/* Upload area */}
                                  {uploadTargetExamId === examination.id ? (
                                    <div className="space-y-1">
                                      <input
                                        id={`report-upload-${examination.id}`}
                                        type="file"
                                        multiple
                                        accept="image/*,.pdf,.doc,.docx"
                                        className="text-xs w-full"
                                        onChange={(e) => setSelectedReportFiles(e.target.files)}
                                      />
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          className="h-6 text-xs px-2 bg-blue-600 hover:bg-blue-700"
                                          onClick={() => handleUploadReports(examination.id)}
                                          disabled={uploadingReports}
                                        >
                                          {uploadingReports ? 'Uploading...' : 'Upload'}
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-6 text-xs px-2"
                                          onClick={() => { setUploadTargetExamId(null); setSelectedReportFiles(null) }}
                                        >
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-6 text-xs px-2 border-blue-400 text-blue-600 hover:bg-blue-50"
                                      onClick={() => {
                                        setUploadTargetExamId(examination.id)
                                        setSelectedReportFiles(null)
                                        fetchExaminationReports(examination.id)
                                      }}
                                    >
                                      + Add Report
                                    </Button>
                                  )}
                                </div>
                              </td>
                              {/* Action (Delete) column */}
                              <td className="border border-gray-300 px-4 py-2 text-center">
                                <div className="flex justify-center gap-1">
                                  {deletingExamId === examination.id ? (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 px-2 text-red-600 border-red-200 hover:bg-red-50"
                                        onClick={() => handleDeleteExamination(examination.id)}
                                      >
                                        Confirm
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 px-2 text-gray-500"
                                        onClick={() => setDeletingExamId(null)}
                                      >
                                        Cancel
                                      </Button>
                                    </>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => setDeletingExamId(examination.id)}
                                      title="Delete examination record"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No examinations found for this patient
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prescription" className="space-y-4">
              <Card>
                <CardHeader className="bg-blue-600 text-white">
                  <CardTitle>Medication</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-end mb-4">
                    <div className="w-48">
                      <Label className="text-sm font-medium">Medicine Type</Label>
                      <SearchableSelect
                        value={prescriptionData.medicineType}
                        onValueChange={(value) => setPrescriptionData({ ...prescriptionData, medicineType: value })}
                        options={medicationTypes}
                        placeholder="Select Medicine Type"
                        className="rounded-r-none border-r-0"
                      />
                    </div>
                    <div className="w-40">
                      <Label className="text-sm font-medium">Medicine</Label>
                      <SearchableSelect
                        value={prescriptionData.medicine}
                        onValueChange={(value) => setPrescriptionData({ ...prescriptionData, medicine: value })}
                        options={medicines}
                        placeholder="--Select--"
                        className="rounded-none border-r-0"
                      />
                    </div>
                    <div className="w-40">
                      <Label className="text-sm font-medium">Potency</Label>
                      <SearchableSelect
                        value={prescriptionData.potency}
                        onValueChange={(value) => setPrescriptionData({ ...prescriptionData, potency: value })}
                        options={potencies}
                        placeholder="--Select--"
                        className="rounded-none border-r-0"
                      />
                    </div>
                    <div className="w-40">
                      <Label className="text-sm font-medium">Dosage</Label>
                      <SearchableSelect
                        value={prescriptionData.dosage}
                        onValueChange={(value) => setPrescriptionData({ ...prescriptionData, dosage: value })}
                        options={dosages}
                        placeholder="--Select--"
                        className="rounded-l-none"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium block mb-2">Common Medicine</Label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-1"
                            checked={prescriptionData.morning}
                            onChange={(e) => setPrescriptionData({ ...prescriptionData, morning: e.target.checked })}
                          />
                          Morning
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-1"
                            checked={prescriptionData.afternoon}
                            onChange={(e) => setPrescriptionData({ ...prescriptionData, afternoon: e.target.checked })}
                          />
                          Afternoon
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-1"
                            checked={prescriptionData.night}
                            onChange={(e) => setPrescriptionData({ ...prescriptionData, night: e.target.checked })}
                          />
                          Night
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label className="text-sm font-medium">Notes</Label>
                    <Input
                      placeholder="Enter Notes"
                      value={prescriptionData.notes}
                      onChange={(e) => setPrescriptionData({ ...prescriptionData, notes: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-2 mb-4">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        console.log('DEBUG: Add/Update Medicine clicked. editingMedicineId:', editingMedicineId);
                        if (prescriptionData.medicine) {
                          if (editingMedicineId) {
                            console.log('DEBUG: Updating medicine in temporary list. ID:', editingMedicineId);
                            // Update existing medicine in the temporary list
                            setPrescriptions(prescriptions.map(p =>
                              String(p.id) === String(editingMedicineId) ? { ...prescriptionData, id: editingMedicineId } : p
                            ))
                            setEditingMedicineId(null) // Reset after update in list
                          } else {
                            console.log('DEBUG: Adding new medicine to temporary list.');
                            // Add new medicine to the temporary list
                            setPrescriptions([...prescriptions, { ...prescriptionData, id: Date.now() }])
                          }
                          setPrescriptionData({ medicineType: '', medicine: '', potency: '', dosage: '', morning: false, afternoon: false, night: false, notes: '' })
                        }
                      }}
                    >
                      {editingMedicineId ? 'Update Medicine' : 'Add'}
                    </Button>
                  </div>

                  {prescriptions.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-4 py-2 text-left">Medicine Type</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Medicine</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Potency</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Dosage</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Morning</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Afternoon</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Night</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Notes</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {prescriptions.map((prescription, idx) => (
                            <tr key={`${prescription.id || 'pres'}-${idx}`}>
                              <td className="border border-gray-300 px-4 py-2">{prescription.medicineType}</td>
                              <td className="border border-gray-300 px-4 py-2">{prescription.medicine}</td>
                              <td className="border border-gray-300 px-4 py-2">{prescription.potency}</td>
                              <td className="border border-gray-300 px-4 py-2">{prescription.dosage}</td>
                              <td className="border border-gray-300 px-4 py-2">{prescription.morning ? '✓' : '-'}</td>
                              <td className="border border-gray-300 px-4 py-2">{prescription.afternoon ? '✓' : '-'}</td>
                              <td className="border border-gray-300 px-4 py-2">{prescription.night ? '✓' : '-'}</td>
                              <td className="border border-gray-300 px-4 py-2">{prescription.notes}</td>
                              <td className="border border-gray-300 px-4 py-2">
                                <div className="flex gap-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                                    onClick={() => {
                                      setPrescriptionData({
                                        medicineType: prescription.medicineType || '',
                                        medicine: prescription.medicine || '',
                                        potency: prescription.potency || '',
                                        dosage: prescription.dosage || '',
                                        morning: prescription.morning || false,
                                        afternoon: prescription.afternoon || false,
                                        night: prescription.night || false,
                                        notes: prescription.notes || ''
                                      })
                                      setEditingMedicineId(prescription.id)
                                    }}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setPrescriptions(prescriptions.filter((_, i) => i !== idx))}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-sm font-medium">Medicine Days</Label>
                      <SearchableSelect
                        value={commonMedicine.medicineDays}
                        onValueChange={handleMedicineDaysChange}
                        options={medicineDaysOptions}
                        valueField="id"
                        placeholder="Select Days"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Next Appointment Date</Label>
                      <Input
                        type="text"
                        value={formatDateToDDMMYYYY(commonMedicine.nextAppointmentDate)}
                        readOnly
                        placeholder="DD/MM/YYYY"
                        className="bg-gray-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Notes To PRO</Label>
                      <Textarea
                        placeholder="Enter Notes to PRO"
                        rows={4}
                        value={notesToPro}
                        onChange={(e) => setNotesToPro(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Notes To Pharmacy</Label>
                      <Textarea
                        placeholder="Enter Notes To Pharmacy"
                        rows={4}
                        value={notesToPharmacy}
                        onChange={(e) => setNotesToPharmacy(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2 mt-6">
                {editingMedicineId && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingMedicineId(null)
                      setEditingPrescriptionId(null)
                      setPrescriptions([])
                      setPrescriptionData({ medicineType: '', medicine: '', potency: '', dosage: '', morning: false, afternoon: false, night: false, notes: '' })
                      setNotesToPro('')
                      setNotesToPharmacy('')
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel Edit
                  </Button>
                )}
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handlePrescriptionSubmit}
                  disabled={prescriptions.length === 0}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingMedicineId ? 'Update Prescription' : 'Submit Prescription'}
                </Button>
              </div>

              {savedPrescriptions.length > 0 && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Saved Prescriptions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Medicine Type</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Medicine</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Potency</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Dosage</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Timing</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Medicine Days</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Next Appointment</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Notes</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {savedPrescriptions.map((prescription, index) => (
                            <tr key={`saved-${prescription.medicine_id || index}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="border border-gray-300 px-4 py-2">
                                {new Date(prescription.created_at).toLocaleDateString()}
                              </td>
                              <td className="border border-gray-300 px-4 py-2">{prescription.medicine_type || '-'}</td>
                              <td className="border border-gray-300 px-4 py-2">{prescription.medicine || '-'}</td>
                              <td className="border border-gray-300 px-4 py-2">{prescription.potency || '-'}</td>
                              <td className="border border-gray-300 px-4 py-2">{prescription.dosage || '-'}</td>
                              <td className="border border-gray-300 px-4 py-2">
                                {[
                                  prescription.morning && 'Morning',
                                  prescription.afternoon && 'Afternoon',
                                  prescription.night && 'Night'
                                ].filter(Boolean).join(', ') || '-'}
                              </td>
                              <td className="border border-gray-300 px-4 py-2">{prescription.medicine_days || '-'}</td>
                              <td className="border border-gray-300 px-4 py-2">
                                {prescription.next_appointment_date ?
                                  new Date(prescription.next_appointment_date).toLocaleDateString()
                                  : '-'
                                }
                              </td>
                              <td className="border border-gray-300 px-4 py-2 max-w-xs">
                                <div className="truncate" title={prescription.medicine_notes || prescription.notes_to_pro}>
                                  {prescription.medicine_notes || prescription.notes_to_pro || '-'}
                                </div>
                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => {
                                    console.log('DEBUG: Edit Pencil clicked. prescription object:', prescription);
                                    const medId = prescription.medicine_id || prescription.id;
                                    const presId = prescription.prescription_id || prescription.id;

                                    setEditingMedicineId(medId)
                                    setEditingPrescriptionId(presId)

                                    // Populate form data
                                    setPrescriptionData({
                                      medicineType: prescription.medicine_type || '',
                                      medicine: prescription.medicine || '',
                                      potency: prescription.potency || '',
                                      dosage: prescription.dosage || '',
                                      morning: !!prescription.morning,
                                      afternoon: !!prescription.afternoon,
                                      night: !!prescription.night,
                                      notes: prescription.medicine_notes || ''
                                    })

                                    setPrescriptions([{
                                      id: medId,
                                      medicineType: prescription.medicine_type || '',
                                      medicine: prescription.medicine || '',
                                      potency: prescription.potency || '',
                                      dosage: prescription.dosage || '',
                                      morning: !!prescription.morning,
                                      afternoon: !!prescription.afternoon,
                                      night: !!prescription.night,
                                      notes: prescription.medicine_notes || ''
                                    }])

                                    setCommonMedicine(prev => ({
                                      ...prev,
                                      medicineDays: prescription.medicine_days?.toString() || '13',
                                      nextAppointmentDate: prescription.next_appointment_date || prev.nextAppointmentDate
                                    }))

                                    setNotesToPro(prescription.notes_to_pro || '')
                                    setNotesToPharmacy(prescription.notes_to_pharmacy || '')

                                    window.scrollTo({ top: 0, behavior: 'smooth' })
                                  }}
                                >
                                  <Pencil className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 ml-1"
                                  onClick={() => {
                                    const presId = prescription.prescription_id || prescription.id;
                                    handleDeletePrescription(presId)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>


          </Tabs>
        </>
      )}
    </div>
  )
}

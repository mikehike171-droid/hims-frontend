"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import authService from "@/lib/authService"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Save,
  Printer,
  Trash2
} from "lucide-react"
import SimpleVoiceRecorder from '@/components/simple-voice-recorder'
import { examinationApi } from "@/lib/examinationApi"

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

export default function CaseSheetPage() {
  const [activeTab, setActiveTab] = useState("medical")
  const [patientData, setPatientData] = useState<PatientData | null>(null)
  const [loading, setLoading] = useState(true)
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
  const [voiceTranscript, setVoiceTranscript] = useState('')
  const [examinations, setExaminations] = useState<any[]>([])
  const [loadingExaminations, setLoadingExaminations] = useState(false)
  const [treatmentPlans, setTreatmentPlans] = useState<any[]>([])
  const [dietCharts, setDietCharts] = useState([{
    id: 1,
    chartNo: false,
    chartTitle: '',
    chartTitleSpecific: '',
    startDate: '',
    endDate: ''
  }])
  const [savedDietCharts, setSavedDietCharts] = useState<any[]>([])
  const [dietNotes, setDietNotes] = useState('')
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
        setSavedPrescriptions(result || [])
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error)
    }
  }

  const fetchPatientDietCharts = async () => {
    if (!patientId) return
    
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-diet-charts/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const result = await response.json()
        setSavedDietCharts(result || [])
      }
    } catch (error) {
      console.error('Error fetching diet charts:', error)
    }
  }

  const fetchMedicationTypes = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/medication-type?location_id=${locationId}`, {
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
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/medicine?location_id=${locationId}`, {
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
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/potency?location_id=${locationId}`, {
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
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/dosage?location_id=${locationId}`, {
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

  const handleDietChartSubmit = async () => {
    console.log('Diet chart submit clicked')
    console.log('Patient ID:', patientId)
    console.log('Diet charts:', dietCharts)
    
    if (!patientId) {
      alert('Patient ID is required')
      return
    }
    
    const locationId = getLocationId()
    console.log('Location ID:', locationId)
    
    if (!locationId) {
      alert('No location selected')
      return
    }
    
    try {
      const token = localStorage.getItem('authToken')
      console.log('Sending diet chart data:', {
        patient_id: patientId,
        location_id: locationId,
        diet_charts: dietCharts,
        notes: dietNotes
      })
      
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-diet-charts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: patientId,
          location_id: locationId,
          diet_charts: dietCharts,
          notes: dietNotes
        })
      })
      
      console.log('Response status:', response.status)
      
      if (response.ok) {
        // Reset form
        setDietCharts([{
          id: 1,
          chartNo: false,
          chartTitle: '',
          chartTitleSpecific: '',
          startDate: '',
          endDate: ''
        }])
        setDietNotes('')
        
        // Refresh saved diet charts
        fetchPatientDietCharts()
        
        alert('Diet chart saved successfully!')
      } else {
        const errorText = await response.text()
        console.error('API Error:', errorText)
        alert('Failed to save diet chart: ' + errorText)
      }
    } catch (error) {
      console.error('Error saving diet chart:', error)
      alert('Failed to save diet chart: ' + error.message)
    }
  }

  const handlePrescriptionSubmit = async () => {
    if (!patientId || prescriptions.length === 0) return
    
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
          patient_id: patientId,
          location_id: locationId,
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
      
      // Refresh saved prescriptions
      fetchPatientPrescriptions()
      
      alert('Prescription saved and next appointment created successfully!')
    } catch (error) {
      console.error('Error saving prescription:', error)
      alert('Failed to save prescription')
    }
  }

  useEffect(() => {
    if (patientId) {
      fetchPatientData(patientId)
      fetchMedicalHistoryCategories()
      fetchPatientMedicalHistory()
    }
    // Set default next appointment date
    const defaultDate = calculateNextAppointmentDate('13')
    setCommonMedicine(prev => ({...prev, nextAppointmentDate: defaultDate}))
  }, [patientId])

  const fetchMedicalHistoryCategories = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/medical-history?location_id=${locationId}`, {
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
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-medical-history/${patientId}?location_id=${locationId}`, {
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
            selectedItems.push({
              id: item.option_id,
              title: item.option_title,
              category: category
            })
          })
        })
        
        setSelectedMedicalHistory(selectedItems)
      }
    } catch (error) {
      console.error('Error fetching patient medical history:', error)
    }
  }

  const fetchPersonalHistoryCategories = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/personal-history?location_id=${locationId}`, {
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
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-personal-history/${patientId}?location_id=${locationId}`, {
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
            selectedItems.push({
              id: item.option_id,
              title: item.option_title,
              category: category
            })
          })
        })
        
        setSelectedPersonalHistory(selectedItems)
      }
    } catch (error) {
      console.error('Error fetching patient personal history:', error)
    }
  }

  const handlePersonalHistoryClick = async (categoryId: string, categoryTitle: string) => {
    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/personal-history-options/${categoryId}?location_id=${locationId}`, {
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
              option_title: option.title,
              location_id: locationId
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
          personal_history_option_id: optionId,
          location_id: locationId
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
      const response = await fetch(`${authService.getSettingsApiUrl()}/lifestyle?location_id=${locationId}`, {
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
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-lifestyle/${patientId}?location_id=${locationId}`, {
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
            selectedItems.push({
              id: item.option_id,
              title: item.option_title,
              category: category
            })
          })
        })
        
        setSelectedLifestyle(selectedItems)
      }
    } catch (error) {
      console.error('Error fetching patient lifestyle:', error)
    }
  }

  const handleLifestyleClick = async (categoryId: string, categoryTitle: string) => {
    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/lifestyle-options/${categoryId}?location_id=${locationId}`, {
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
              option_title: option.title,
              location_id: locationId
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
          lifestyle_option_id: optionId,
          location_id: locationId
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
      const response = await fetch(`${authService.getSettingsApiUrl()}/family-history?location_id=${locationId}`, {
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
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-family-history/${patientId}?location_id=${locationId}`, {
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
            selectedItems.push({
              id: item.option_id,
              title: item.option_title,
              category: category
            })
          })
        })
        
        setSelectedFamilyHistory(selectedItems)
      }
    } catch (error) {
      console.error('Error fetching patient family history:', error)
    }
  }

  const handleFamilyHistoryClick = async (categoryId: string, categoryTitle: string) => {
    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/family-history-options/${categoryId}?location_id=${locationId}`, {
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
              option_title: option.title,
              location_id: locationId
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
          family_history_option_id: optionId,
          location_id: locationId
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
      const response = await fetch(`${authService.getSettingsApiUrl()}/drug-history?location_id=${locationId}`, {
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
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-drug-history/${patientId}?location_id=${locationId}`, {
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
            selectedItems.push({
              id: item.option_id,
              title: item.option_title,
              category: category
            })
          })
        })
        
        setSelectedDrugHistory(selectedItems)
      }
    } catch (error) {
      console.error('Error fetching patient drug history:', error)
    }
  }

  const handleDrugHistoryClick = async (categoryId: string, categoryTitle: string) => {
    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/drug-history-options/${categoryId}?location_id=${locationId}`, {
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
              option_title: option.title,
              location_id: locationId
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
          drug_history_option_id: optionId,
          location_id: locationId
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
      const response = await fetch(`${authService.getSettingsApiUrl()}/allergies?location_id=${locationId}`, {
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
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-allergies/${patientId}?location_id=${locationId}`, {
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
            selectedItems.push({
              id: item.option_id,
              title: item.option_title,
              category: category
            })
          })
        })
        
        setSelectedAllergies(selectedItems)
      }
    } catch (error) {
      console.error('Error fetching patient allergies:', error)
    }
  }

  const handleAllergiesClick = async (categoryId: string, categoryTitle: string) => {
    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/allergies-options/${categoryId}?location_id=${locationId}`, {
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
              option_title: option.title,
              location_id: locationId
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
          allergies_option_id: optionId,
          location_id: locationId
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
      const response = await fetch(`${authService.getSettingsApiUrl()}/social-history?location_id=${locationId}`, {
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
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-social-history/${patientId}?location_id=${locationId}`, {
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
            selectedItems.push({
              id: item.option_id,
              title: item.option_title,
              category: category
            })
          })
        })
        
        setSelectedSocialHistory(selectedItems)
      }
    } catch (error) {
      console.error('Error fetching patient social history:', error)
    }
  }

  const handleSocialHistoryClick = async (categoryId: string, categoryTitle: string) => {
    try {
      const token = localStorage.getItem('authToken')
      const locationId = getLocationId()
      const response = await fetch(`${authService.getSettingsApiUrl()}/social-history-options/${categoryId}?location_id=${locationId}`, {
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
              option_title: option.title,
              location_id: locationId
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
          social_history_option_id: optionId,
          location_id: locationId
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
    } else if (value === 'diet') {
      fetchPatientDietCharts()
    }
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
              option_title: option.title,
              location_id: locationId
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
      await examinationApi.createExamination({
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
      fetchPatientExaminations()
    } catch (error) {
      console.error('Error saving examination:', error)
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Detailed Patient Case Sheet</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
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
        <div className="bg-white rounded-lg border shadow-sm p-2">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 gap-1 bg-gray-50 p-1 rounded-md h-auto">
            <TabsTrigger value="medical" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm px-3 py-2 text-xs font-medium rounded transition-all duration-200 hover:bg-white/50">
              Medical History
            </TabsTrigger>
            <TabsTrigger value="personal" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm px-3 py-2 text-xs font-medium rounded transition-all duration-200 hover:bg-white/50">
              Personal History
            </TabsTrigger>
            <TabsTrigger value="lifestyle" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm px-3 py-2 text-xs font-medium rounded transition-all duration-200 hover:bg-white/50">
              Life Style
            </TabsTrigger>
            <TabsTrigger value="family" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm px-3 py-2 text-xs font-medium rounded transition-all duration-200 hover:bg-white/50">
              Family History
            </TabsTrigger>
            <TabsTrigger value="drug" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm px-3 py-2 text-xs font-medium rounded transition-all duration-200 hover:bg-white/50">
              Drug History
            </TabsTrigger>
            <TabsTrigger value="allergies" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm px-3 py-2 text-xs font-medium rounded transition-all duration-200 hover:bg-white/50">
              Allergies
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm px-3 py-2 text-xs font-medium rounded transition-all duration-200 hover:bg-white/50">
              Social History
            </TabsTrigger>
            <TabsTrigger value="examinations" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm px-3 py-2 text-xs font-medium rounded transition-all duration-200 hover:bg-white/50">
              Examinations
            </TabsTrigger>
            <TabsTrigger value="prescription" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm px-3 py-2 text-xs font-medium rounded transition-all duration-200 hover:bg-white/50">
              Prescription
            </TabsTrigger>
            <TabsTrigger value="diet" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm px-3 py-2 text-xs font-medium rounded transition-all duration-200 hover:bg-white/50">
              Diet Chart
            </TabsTrigger>
          </TabsList>
        </div>



        <TabsContent value="medical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="Enter Notes" rows={4} />
              <Button className="mt-2 float-right">Submit</Button>
            </CardContent>
          </Card>
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
                        className={`flex flex-col items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          isSelected ? 'bg-red-100 border-red-300' : ''
                        }`}
                        onClick={() => handleOptionSelect(option)}
                      >
                        <div className={`w-5 h-5 rounded-full mb-1 ${
                          isSelected ? 'bg-red-500' : 'bg-gray-400'
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
        </TabsContent>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal History</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="Enter Notes" rows={4} />
              <Button className="mt-2 float-right">Submit</Button>
            </CardContent>
          </Card>
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
                        className={`flex flex-col items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          isSelected ? 'bg-red-100 border-red-300' : ''
                        }`}
                        onClick={() => handlePersonalOptionSelect(option)}
                      >
                        <div className={`w-5 h-5 rounded-full mb-1 ${
                          isSelected ? 'bg-red-500' : 'bg-gray-400'
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
        </TabsContent>

        <TabsContent value="lifestyle" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Life Style</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="Enter Notes" rows={4} />
              <Button className="mt-2 float-right">Submit</Button>
            </CardContent>
          </Card>
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
                        className={`flex flex-col items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          isSelected ? 'bg-red-100 border-red-300' : ''
                        }`}
                        onClick={() => handleLifestyleOptionSelect(option)}
                      >
                        <div className={`w-5 h-5 rounded-full mb-1 ${
                          isSelected ? 'bg-red-500' : 'bg-gray-400'
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
        </TabsContent>

        <TabsContent value="family" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Family History</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="Enter Notes" rows={4} />
              <Button className="mt-2 float-right">Submit</Button>
            </CardContent>
          </Card>
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
                        className={`flex flex-col items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          isSelected ? 'bg-red-100 border-red-300' : ''
                        }`}
                        onClick={() => handleFamilyOptionSelect(option)}
                      >
                        <div className={`w-5 h-5 rounded-full mb-1 ${
                          isSelected ? 'bg-red-500' : 'bg-gray-400'
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
        </TabsContent>

        <TabsContent value="drug" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Drug History</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="Enter Notes" rows={4} />
              <Button className="mt-2 float-right">Submit</Button>
            </CardContent>
          </Card>
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
                        className={`flex flex-col items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          isSelected ? 'bg-red-100 border-red-300' : ''
                        }`}
                        onClick={() => handleDrugOptionSelect(option)}
                      >
                        <div className={`w-5 h-5 rounded-full mb-1 ${
                          isSelected ? 'bg-red-500' : 'bg-gray-400'
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
        </TabsContent>

        <TabsContent value="allergies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Allergies</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="Enter Notes" rows={4} />
              <Button className="mt-2 float-right">Submit</Button>
            </CardContent>
          </Card>
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
                        className={`flex flex-col items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          isSelected ? 'bg-red-100 border-red-300' : ''
                        }`}
                        onClick={() => handleAllergiesOptionSelect(option)}
                      >
                        <div className={`w-5 h-5 rounded-full mb-1 ${
                          isSelected ? 'bg-red-500' : 'bg-gray-400'
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
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social History</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea placeholder="Enter Notes" rows={4} />
              <Button className="mt-2 float-right">Submit</Button>
            </CardContent>
          </Card>
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
                        className={`flex flex-col items-center p-2 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          isSelected ? 'bg-red-100 border-red-300' : ''
                        }`}
                        onClick={() => handleSocialOptionSelect(option)}
                      >
                        <div className={`w-5 h-5 rounded-full mb-1 ${
                          isSelected ? 'bg-red-500' : 'bg-gray-400'
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
                <Label className="text-sm font-medium">Past Medical Reports</Label>
                <Textarea 
                  placeholder="Enter Past Medical Reports" 
                  rows={3}
                  value={examinationData.pastMedicalReports}
                  onChange={(e) => setExaminationData({...examinationData, pastMedicalReports: e.target.value})}
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Investigations Required</Label>
                <Textarea 
                  placeholder="Enter Investigations Required" 
                  rows={3}
                  value={examinationData.investigationsRequired}
                  onChange={(e) => setExaminationData({...examinationData, investigationsRequired: e.target.value})}
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Physical Examination</Label>
                <Textarea 
                  placeholder="Enter Physical Examination" 
                  rows={3}
                  value={examinationData.physicalExamination}
                  onChange={(e) => setExaminationData({...examinationData, physicalExamination: e.target.value})}
                />
                

              </div>
              
              <div>
                <Label className="text-sm font-medium mb-3 block">Clinical Examinations/Vitals</Label>
                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <Label className="text-sm">BP</Label>
                    <Input 
                      placeholder="Enter BP" 
                      value={examinationData.bp}
                      onChange={(e) => setExaminationData({...examinationData, bp: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Pulse</Label>
                    <Input 
                      placeholder="Enter Pulse" 
                      value={examinationData.pulse}
                      onChange={(e) => setExaminationData({...examinationData, pulse: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Heart Rate</Label>
                    <Input 
                      placeholder="Enter Heart Rate" 
                      value={examinationData.heartRate}
                      onChange={(e) => setExaminationData({...examinationData, heartRate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">Weight</Label>
                    <Input 
                      placeholder="Enter Weight" 
                      value={examinationData.weight}
                      onChange={(e) => setExaminationData({...examinationData, weight: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-sm">RR</Label>
                    <Input 
                      placeholder="Enter RR" 
                      value={examinationData.rr}
                      onChange={(e) => setExaminationData({...examinationData, rr: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Menstrual & Obstetric History</Label>
                <Textarea 
                  placeholder="Enter Menstrual & Obstetric History" 
                  rows={3}
                  value={examinationData.menstrualObstetricHistory}
                  onChange={(e) => setExaminationData({...examinationData, menstrualObstetricHistory: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Treatment Plan</Label>
                  <Select value={examinationData.treatmentPlanMonthsDoctor} onValueChange={handleTreatmentPlanChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Treatment Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {treatmentPlans.map((plan, index) => (
                        <SelectItem key={index} value={plan.months.toString()}>
                          {plan.months} Month{plan.months > 1 ? 's' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Next Renewal Date</Label>
                  <Input 
                    type="date" 
                    value={examinationData.nextRenewalDateDoctor}
                    readOnly
                    className="bg-gray-50"
                  />
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
                      </tr>
                    </thead>
                    <tbody>
                      {examinations.map((examination, index) => (
                        <tr key={examination.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
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
                            {examination.nextRenewalDateDoctor || examination.next_renewal_date_doctor ? 
                              new Date(examination.nextRenewalDateDoctor || examination.next_renewal_date_doctor).toLocaleDateString() 
                              : '-'
                            }
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
                  <Select value={prescriptionData.medicineType} onValueChange={(value) => setPrescriptionData({...prescriptionData, medicineType: value})}>
                    <SelectTrigger className="rounded-r-none border-r-0">
                      <SelectValue placeholder="Select Medicine Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicationTypes.map((type) => (
                        <SelectItem key={type.id} value={type.title}>
                          {type.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-40">
                  <Label className="text-sm font-medium">Medicine</Label>
                  <Select value={prescriptionData.medicine} onValueChange={(value) => setPrescriptionData({...prescriptionData, medicine: value})}>
                    <SelectTrigger className="rounded-none border-r-0">
                      <SelectValue placeholder="--Select--" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicines.map((medicine) => (
                        <SelectItem key={medicine.id} value={medicine.title}>
                          {medicine.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-40">
                  <Label className="text-sm font-medium">Potency</Label>
                  <Select value={prescriptionData.potency} onValueChange={(value) => setPrescriptionData({...prescriptionData, potency: value})}>
                    <SelectTrigger className="rounded-none border-r-0">
                      <SelectValue placeholder="--Select--" />
                    </SelectTrigger>
                    <SelectContent>
                      {potencies.map((potency) => (
                        <SelectItem key={potency.id} value={potency.title}>
                          {potency.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-40">
                  <Label className="text-sm font-medium">Dosage</Label>
                  <Select value={prescriptionData.dosage} onValueChange={(value) => setPrescriptionData({...prescriptionData, dosage: value})}>
                    <SelectTrigger className="rounded-l-none">
                      <SelectValue placeholder="--Select--" />
                    </SelectTrigger>
                    <SelectContent>
                      {dosages.map((dosage) => (
                        <SelectItem key={dosage.id} value={dosage.title}>
                          {dosage.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium block mb-2">Common Medicine</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-1" 
                        checked={prescriptionData.morning}
                        onChange={(e) => setPrescriptionData({...prescriptionData, morning: e.target.checked})}
                      />
                      Morning
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-1" 
                        checked={prescriptionData.afternoon}
                        onChange={(e) => setPrescriptionData({...prescriptionData, afternoon: e.target.checked})}
                      />
                      Afternoon
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="mr-1" 
                        checked={prescriptionData.night}
                        onChange={(e) => setPrescriptionData({...prescriptionData, night: e.target.checked})}
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
                  onChange={(e) => setPrescriptionData({...prescriptionData, notes: e.target.value})}
                />
              </div>
              
              <div className="flex gap-2 mb-4">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    if (prescriptionData.medicine) {
                      setPrescriptions([...prescriptions, {...prescriptionData, id: Date.now()}])
                      setPrescriptionData({medicineType: '', medicine: '', potency: '', dosage: '', morning: false, afternoon: false, night: false, notes: ''})
                    }
                  }}
                >
                  Add
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
                      {prescriptions.map((prescription) => (
                        <tr key={prescription.id}>
                          <td className="border border-gray-300 px-4 py-2">{prescription.medicineType}</td>
                          <td className="border border-gray-300 px-4 py-2">{prescription.medicine}</td>
                          <td className="border border-gray-300 px-4 py-2">{prescription.potency}</td>
                          <td className="border border-gray-300 px-4 py-2">{prescription.dosage}</td>
                          <td className="border border-gray-300 px-4 py-2">{prescription.morning ? '✓' : '-'}</td>
                          <td className="border border-gray-300 px-4 py-2">{prescription.afternoon ? '✓' : '-'}</td>
                          <td className="border border-gray-300 px-4 py-2">{prescription.night ? '✓' : '-'}</td>
                          <td className="border border-gray-300 px-4 py-2">{prescription.notes}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => setPrescriptions(prescriptions.filter(p => p.id !== prescription.id))}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
                  <Select value={commonMedicine.medicineDays} onValueChange={handleMedicineDaysChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 Days</SelectItem>
                      <SelectItem value="13">13 Days</SelectItem>
                      <SelectItem value="15">15 Days</SelectItem>
                      <SelectItem value="30">30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Next Appointment Date</Label>
                  <Input 
                    type="date" 
                    value={commonMedicine.nextAppointmentDate}
                    readOnly
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
          
          <div className="flex justify-end mt-6">
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={handlePrescriptionSubmit}
              disabled={prescriptions.length === 0}
            >
              Submit Prescription
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
                      </tr>
                    </thead>
                    <tbody>
                      {savedPrescriptions.map((prescription, index) => (
                        <tr key={`${prescription.id}-${index}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="diet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Diet Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dietCharts.map((chart, index) => (
                  <div key={chart.id} className="border-b pb-4 last:border-b-0">
                    <div className="grid grid-cols-5 gap-4 items-end">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-2" 
                          checked={chart.chartNo}
                          onChange={(e) => {
                            const updated = [...dietCharts]
                            updated[index].chartNo = e.target.checked
                            setDietCharts(updated)
                          }}
                        />
                        <Label className="text-sm font-medium">Chart No</Label>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Chart Title</Label>
                        <Select value={chart.chartTitle} onValueChange={(value) => {
                          const updated = [...dietCharts]
                          updated[index].chartTitle = value
                          setDietCharts(updated)
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Diabetes Diet" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="diabetes">Diabetes Diet</SelectItem>
                            <SelectItem value="hypertension">Hypertension Diet</SelectItem>
                            <SelectItem value="weight-loss">Weight Loss Diet</SelectItem>
                            <SelectItem value="cardiac">Cardiac Diet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Chart Title</Label>
                        <Select value={chart.chartTitleSpecific} onValueChange={(value) => {
                          const updated = [...dietCharts]
                          updated[index].chartTitleSpecific = value
                          setDietCharts(updated)
                        }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Diabetes Diet Chart" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="diabetes-chart">Diabetes Diet Chart</SelectItem>
                            <SelectItem value="hypertension-chart">Hypertension Diet Chart</SelectItem>
                            <SelectItem value="weight-loss-chart">Weight Loss Diet Chart</SelectItem>
                            <SelectItem value="cardiac-chart">Cardiac Diet Chart</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Start Date</Label>
                        <Input 
                          type="date" 
                          placeholder="mm/dd/yyyy" 
                          value={chart.startDate}
                          onChange={(e) => {
                            const updated = [...dietCharts]
                            updated[index].startDate = e.target.value
                            setDietCharts(updated)
                          }}
                        />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">End Date</Label>
                        <Input 
                          type="date" 
                          placeholder="mm/dd/yyyy" 
                          value={chart.endDate}
                          onChange={(e) => {
                            const updated = [...dietCharts]
                            updated[index].endDate = e.target.value
                            setDietCharts(updated)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex gap-2">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      if (dietCharts.length > 1) {
                        setDietCharts(dietCharts.slice(0, -1))
                      }
                    }}
                  >
                    - Delete
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      const newChart = {
                        id: Date.now(),
                        chartNo: false,
                        chartTitle: '',
                        chartTitleSpecific: '',
                        startDate: '',
                        endDate: ''
                      }
                      setDietCharts([...dietCharts, newChart])
                    }}
                  >
                    + Add More
                  </Button>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Notes:</Label>
                  <Textarea 
                    placeholder="Your Notes" 
                    rows={6}
                    className="w-full"
                    value={dietNotes}
                    onChange={(e) => setDietNotes(e.target.value)}
                  />
                </div>

                <div className="flex justify-start">
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleDietChartSubmit}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {savedDietCharts.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Saved Diet Charts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Chart No</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Chart Title</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Specific Title</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Start Date</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">End Date</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Notes</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {savedDietCharts.map((chart, index) => (
                        <tr key={chart.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 px-4 py-2">
                            {new Date(chart.created_at).toLocaleDateString()}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {chart.chart_no ? '✓' : '-'}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">{chart.chart_title || '-'}</td>
                          <td className="border border-gray-300 px-4 py-2">{chart.chart_title_specific || '-'}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            {chart.start_date ? new Date(chart.start_date).toLocaleDateString() : '-'}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {chart.end_date ? new Date(chart.end_date).toLocaleDateString() : '-'}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 max-w-xs">
                            <div className="truncate" title={chart.notes}>
                              {chart.notes || '-'}
                            </div>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={async () => {
                                try {
                                  const token = localStorage.getItem('authToken')
                                  await fetch(`${authService.getSettingsApiUrl()}/patient-diet-charts/${chart.id}`, {
                                    method: 'DELETE',
                                    headers: {
                                      'Authorization': `Bearer ${token}`,
                                      'Content-Type': 'application/json',
                                    },
                                  })
                                  fetchPatientDietCharts()
                                } catch (error) {
                                  console.error('Error deleting diet chart:', error)
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
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
    </div>
  )
}
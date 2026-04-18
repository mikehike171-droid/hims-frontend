"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  User,
  Phone,
  Mail,
  LucideCalendar,
  CreditCard,
  Banknote,
  Smartphone,
  Building,
  ArrowLeft,
  Receipt,
  Clock,
  IndianRupee,
  Search,
  ChevronDown,
  CalendarIcon,
  Printer,
  FileText,
  Trash2
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import PrivateRoute from "@/components/auth/PrivateRoute"
import authService from "@/lib/authService"
import { format, parseISO, addMonths } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { settingsApi } from "@/lib/settingsApi"





const getPaymentIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'cash': return Banknote
    case 'card': return CreditCard
    case 'upi': return Smartphone
    case 'insurance': return Building
    case 'other': return Receipt
    default: return CreditCard
  }
}

export default function PatientBillDiscuss() {
  const params = useParams()
  const router = useRouter()
  const patientId = params.patientId as string

  const [patient, setPatient] = useState<any>(null)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [nextRenewalDate, setNextRenewalDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [treatmentPlans, setTreatmentPlans] = useState<any[]>([])
  const [selectedPlanValue, setSelectedPlanValue] = useState<string>("")
  const [currentExamination, setCurrentExamination] = useState<any>(null)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [discount, setDiscount] = useState<number>(0)
  const [paidAmount, setPaidAmount] = useState<number>(0)
  const [showPaymentMethods, setShowPaymentMethods] = useState(false)
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<{ id: string, amount: number }[]>([])
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [installments, setInstallments] = useState<any[]>([])
  const [additionalPaymentMethod, setAdditionalPaymentMethod] = useState('')
  const [additionalPaymentAmount, setAdditionalPaymentAmount] = useState('')
  const [paymentNotes, setPaymentNotes] = useState('')
  const [showAddPayment, setShowAddPayment] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [receiptData, setReceiptData] = useState<any>(null)
  const [locationData, setLocationData] = useState<any>(null)
  const [planSearch, setPlanSearch] = useState("")
  const [showPlanDropdown, setShowPlanDropdown] = useState(false)
  const [showSimpleReceipt, setShowSimpleReceipt] = useState(false)
  const [simpleReceiptData, setSimpleReceiptData] = useState<any>(null)
  const [filteredPlans, setFilteredPlans] = useState<any[]>([])
  const [allExaminations, setAllExaminations] = useState<any[]>([])
  const [editingExamId, setEditingExamId] = useState<number | null>(null)
  const [tempExamDate, setTempExamDate] = useState<string>("")
  const [showAdditionalMultiPayment, setShowAdditionalMultiPayment] = useState(false)
  const [selectedAdditionalPaymentMethods, setSelectedAdditionalPaymentMethods] = useState<{ id: string, amount: number }[]>([])

  useEffect(() => {
    fetchTreatmentPlans()
    fetchPaymentMethods()
    fetchLocationData()
    if (patientId) {
      fetchPatientData()
      fetchPatientExamination()
      fetchInstallments()
    }
  }, [patientId])

  useEffect(() => {
    if (selectedPlan) {
      const today = new Date()
      const renewalDate = addMonths(today, selectedPlan.months)
      setNextRenewalDate(format(renewalDate, "yyyy-MM-dd"))
    }
  }, [selectedPlan])

  useEffect(() => {
    setFilteredPlans(treatmentPlans)
  }, [treatmentPlans])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.relative')) {
        setShowPlanDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])



  const fetchPatientData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patients/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPatient({
          id: data.patient_id,
          name: `${data.first_name} ${data.last_name}`,
          phone: data.phone_number,
          email: data.email,
          age: calculateAge(data.date_of_birth),
          gender: data.gender === 'M' ? 'Male' : data.gender === 'F' ? 'Female' : 'Other',
          bloodGroup: data.blood_group
        })
      }
    } catch (error) {
      console.error('Error fetching patient data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateAge = (date: any) => {
    const today = new Date()
    const birthDate = new Date(date)
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1
    }
    return age
  }

  const fetchPatientExamination = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        const examinations = Array.isArray(data) ? data : []
        setAllExaminations(examinations)
        const latestExam = examinations[0] // Get the latest examination
        if (latestExam) {
          setCurrentExamination(latestExam)
          // Pre-populate with PRO data if exists, otherwise use doctor data
          if (latestExam.treatment_plan_months_pro) {
            setSelectedPlanValue(latestExam.treatment_plan_months_pro.toString())
            setNextRenewalDate(latestExam.next_renewal_date_pro ? format(new Date(latestExam.next_renewal_date_pro), "yyyy-MM-dd") : '')
            const plan = treatmentPlans.find(p => p.months === latestExam.treatment_plan_months_pro)
            if (plan) setPlanSearch(`${plan.months} Month${plan.months > 1 ? 's' : ''}`)
          } else if (latestExam.treatment_plan_months_doctor) {
            setSelectedPlanValue(latestExam.treatment_plan_months_doctor.toString())
            setNextRenewalDate(latestExam.next_renewal_date_doctor ? format(new Date(latestExam.next_renewal_date_doctor), "yyyy-MM-dd") : '')
          }
        }
      }
    } catch (error) {
      console.error('Error fetching patient examination:', error)
    }
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
        const data = await response.json()
        setTreatmentPlans(data)
      }
    } catch (error) {
      console.error('Error fetching treatment plans:', error)
    }
  }

  const handlePlanChange = (months: string) => {
    const plan = treatmentPlans.find(p => p.months === parseInt(months))
    if (plan) {
      selectPlan(plan)
    }
  }

  const handlePlanSearch = (searchTerm: string) => {
    setPlanSearch(searchTerm)
    const filtered = treatmentPlans.filter(plan =>
      plan.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.months.toString().includes(searchTerm)
    )
    setFilteredPlans(filtered)
  }

  const selectPlan = (plan: any) => {
    setSelectedPlan(plan)
    setSelectedPlanValue(plan.months.toString())
    setPlanSearch(`${plan.months} Month${plan.months > 1 ? 's' : ''}`)
    setShowPlanDropdown(false)

    const today = new Date()
    const renewalDate = addMonths(today, plan.months)
    setNextRenewalDate(format(renewalDate, "yyyy-MM-dd"))
  }

  const fetchPaymentMethods = async () => {
    try {
      const data = await settingsApi.getPaymentTypes()
      setPaymentMethods(data)
    } catch (error) {
      console.error('Error fetching payment types:', error)
      // Fallback to static if API fails
      setPaymentMethods([
        { id: 1, code: "cash", name: "Cash" },
        { id: 2, code: "card", name: "Card" },
        { id: 3, code: "upi", name: "UPI" },
        { id: 4, code: "insurance", name: "Insurance" },
        { id: 5, code: "other", name: "Other" }
      ])
    }
  }

  const fetchLocationData = async () => {
    try {
      const token = localStorage.getItem('authToken')
      // Get fresh user data from localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const locationId = userData?.primary_location_id

      console.log('Fetching location for ID:', locationId) // Debug log

      if (locationId) {
        const response = await fetch(`${authService.getSettingsApiUrl()}/locations/${locationId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Location data fetched:', data) // Debug log
          setLocationData(data)
        } else {
          console.error('Failed to fetch location:', response.status)
        }
      } else {
        console.error('No location ID found in user data')
      }
    } catch (error) {
      console.error('Error fetching location data:', error)
    }
  }

  const handleSavePayments = async () => {
    if (!currentExamination) {
      alert('No examination record found')
      return
    }

    if (!totalAmount || totalAmount <= 0) {
      alert('Please enter a valid total amount')
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')

      const paymentData = {
        totalAmount,
        discountAmount: discount,
        paidAmount: selectedPaymentMethods.reduce((sum, p) => sum + p.amount, 0),
        dueAmount: totalAmount - discount - selectedPaymentMethods.reduce((sum, p) => sum + p.amount, 0),
        paymentMethods: selectedPaymentMethods.map(p => ({
          method: p.id,
          amount: p.amount
        }))
      }

      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${currentExamination.id}/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      })

      if (response.ok) {
        alert('Payment details saved successfully!')
        const result = await response.json()
        
        fetchPatientExamination()
        fetchInstallments()
      } else {
        alert('Failed to save payment details')
      }
    } catch (error) {
      console.error('Error saving payment details:', error)
      alert('Error saving payment details')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTreatmentPlan = async () => {
    if (!currentExamination || !selectedPlanValue) {
      alert('No examination record found or plan selected')
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')

      const updateData = {
        treatmentPlanMonthsPro: parseInt(selectedPlanValue),
        nextRenewalDatePro: nextRenewalDate
      }

      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${currentExamination.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      })

      if (response.ok) {
        alert('PRO Treatment plan updated successfully!')
        fetchPatientExamination()
      } else {
        alert('Failed to update treatment plan')
      }
    } catch (error) {
      console.error('Error updating treatment plan:', error)
      alert('Error updating treatment plan')
    } finally {
      setLoading(false)
    }
  }

  const handleAddPayment = async () => {
    if (!currentExamination) return

    if (!showAdditionalMultiPayment && (!additionalPaymentMethod || !additionalPaymentAmount)) {
      alert('Please select payment method and enter amount')
      return
    }

    if (showAdditionalMultiPayment && selectedAdditionalPaymentMethods.length === 0) {
      alert('Please add at least one payment method')
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      
      const payments = showAdditionalMultiPayment 
        ? selectedAdditionalPaymentMethods.map(p => ({ paymentMethod: p.id, amount: p.amount }))
        : [{ paymentMethod: additionalPaymentMethod, amount: parseFloat(additionalPaymentAmount) }];

      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${currentExamination.id}/add-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payments: payments,
          notes: paymentNotes
        })
      })

      if (response.ok) {
        const result = await response.json()
        alert('Payment added successfully!')
        
        // Show the first installment receipt if any
        if (result.installments && result.installments.length > 0) {
          handleShowInstallmentReceipt(result.installments[0].id)
        }

        setAdditionalPaymentMethod('')
        setAdditionalPaymentAmount('')
        setPaymentNotes('')
        setShowAdditionalMultiPayment(false)
        setSelectedAdditionalPaymentMethods([])
        setShowAddPayment(false)

        // Update current examination with new amounts
        if (currentExamination) {
          setCurrentExamination({
            ...currentExamination,
            paidAmount: result.paidAmount,
            dueAmount: result.dueAmount
          })
        }

        fetchPatientExamination()
        fetchInstallments()
      } else {
        alert('Failed to add payment')
      }
    } catch (error) {
      console.error('Error adding payment:', error)
      alert('Error adding payment')
    } finally {
      setLoading(false)
    }
  }

  const fetchInstallments = async () => {
    if (!patientId) return

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/patient/${patientId}/all-installments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setInstallments(data)
      }
    } catch (error) {
      console.error('Error fetching installments:', error)
    }
  }

  const fetchReceipt = async () => {
    if (!currentExamination) return

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${currentExamination.id}/receipt`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setReceiptData({ ...data, location: locationData })
      }
    } catch (error) {
      console.error('Error fetching receipt:', error)
    }
  }

  const handleShowReceipt = () => {
    // Refetch location data to ensure latest location is used
    fetchLocationData().then(() => {
      fetchReceipt()
      setShowReceipt(true)
    })
  }

  const handleShowInstallmentReceipt = async (installmentId: number) => {
    // Refetch location data first
    await fetchLocationData()

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/installment/${installmentId}/receipt`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setReceiptData({ ...data, location: locationData })
        setShowReceipt(true)
      }
    } catch (error) {
      console.error('Error fetching installment receipt:', error)
    }
  }

  const handleShowDailyReceipt = async () => {
    if (!currentExamination) return

    // Refetch location data first
    await fetchLocationData()

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${currentExamination.id}/daily-receipt`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setReceiptData({ ...data, location: locationData })
        setShowReceipt(true)
      }
    } catch (error) {
      console.error('Error fetching daily receipt:', error)
    }
  }

  return (
    <PrivateRoute modulePath="admin/manager/patient-bill-discuss" action="view">
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Patient Bill Discussion</h1>
            <p className="text-gray-600 text-sm sm:text-base">Manage patient payments and treatment plans</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading patient data...</div>
            ) : patient ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Patient Name</Label>
                  <p className="text-lg font-semibold text-gray-900">{patient.name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-600">Patient ID</Label>
                  <p className="text-gray-900">{patient.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Phone</Label>
                    <p className="text-gray-900">{patient.phone}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-red-500">Failed to load patient data</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LucideCalendar className="h-5 w-5" />
              Treatment Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentExamination && (
              <div className="mb-6 space-y-4">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Complete Examination Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded border">
                      <span className="text-gray-600 font-medium">Patient Name:</span>
                      <span className="ml-2">{patient?.name || 'N/A'}</span>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <span className="text-gray-600 font-medium">Doctor Plan (Months):</span>
                      <span className="ml-2">{currentExamination.treatmentPlanMonthsDoctor || 'N/A'}</span>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <span className="text-gray-600 font-medium">Doctor Renewal Date:</span>
                      <span className="ml-2">
                        {currentExamination.nextRenewalDateDoctor ?
                          format(new Date(currentExamination.nextRenewalDateDoctor), "dd/MM/yyyy")
                          : 'N/A'
                        }
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <span className="text-gray-600 font-medium">Plan (Months):</span>
                      <span className="ml-2">{currentExamination.treatmentPlanMonthsPro || 'N/A'}</span>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <span className="text-gray-600 font-medium">PRO Renewal Date:</span>
                      <span className="ml-2">
                        {currentExamination.nextRenewalDatePro ?
                          format(new Date(currentExamination.nextRenewalDatePro), "dd/MM/yyyy")
                          : 'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Current Doctor Treatment Plan</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Duration:</span>
                      <span className="ml-2 font-medium">
                        {currentExamination.treatmentPlanMonthsDoctor ?
                          `${currentExamination.treatmentPlanMonthsDoctor} Month${currentExamination.treatmentPlanMonthsDoctor > 1 ? 's' : ''}`
                          : 'Not set'
                        }
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">Doctor Renewal Date:</span>
                      <span className="ml-2 font-medium">
                        {currentExamination.nextRenewalDateDoctor ?
                          format(new Date(currentExamination.nextRenewalDateDoctor), "dd/MM/yyyy")
                          : 'Not set'
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {currentExamination.treatmentPlanMonthsPro && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Current Treatment Plan</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-green-700">Duration:</span>
                        <span className="ml-2 font-medium">
                          {currentExamination.treatmentPlanMonthsPro} Month{currentExamination.treatmentPlanMonthsPro > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div>
                        <span className="text-green-700">PRO Renewal Date:</span>
                        <span className="ml-2 font-medium">
                          {currentExamination.nextRenewalDatePro ?
                            format(new Date(currentExamination.nextRenewalDatePro), "dd/MM/yyyy")
                            : 'Not set'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Treatment Plan Months *</Label>
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search treatment plan..."
                      value={planSearch}
                      onChange={(e) => handlePlanSearch(e.target.value)}
                      onFocus={() => setShowPlanDropdown(true)}
                      className="h-10 pl-10 pr-10"
                    />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  {showPlanDropdown && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredPlans.length > 0 ? (
                        filteredPlans.map((plan, index) => (
                          <div
                            key={index}
                            onClick={() => selectPlan(plan)}
                            className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          >
                            <LucideCalendar className="h-4 w-4 mr-3 text-blue-600" />
                            <div>
                              <p className="font-medium text-gray-900">{plan.months} Month{plan.months > 1 ? 's' : ''}</p>
                              {plan.name && <p className="text-sm text-gray-500">{plan.name}</p>}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-gray-500 text-center">
                          No plans found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Next Renewal Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full h-10 justify-start text-left font-normal border-gray-200 bg-gray-50",
                        !nextRenewalDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {nextRenewalDate ? format(parseISO(nextRenewalDate), "dd/MM/yyyy") : <span>Next Renewal Date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-xl bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={nextRenewalDate ? parseISO(nextRenewalDate) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          setNextRenewalDate(format(date, "yyyy-MM-dd"))
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={handleSaveTreatmentPlan}
                disabled={!selectedPlanValue || loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Saving...' : 'Save Treatment Plan'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LucideCalendar className="h-5 w-5" />
              Examination History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Doctor Plan</TableHead>
                    <TableHead>PRO Plan</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Due Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allExaminations.map((exam) => (
                    <TableRow key={exam.id} className={cn(currentExamination?.id === exam.id && "bg-blue-50")}>
                      <TableCell className="font-medium">
                        <span className="font-bold">
                          {(() => {
                            const dateVal = exam.created_at || exam.createdAt
                            return dateVal ? format(new Date(dateVal), "dd/MM/yyyy") : 'N/A'
                          })()}
                        </span>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const val = exam.treatment_plan_months_doctor || exam.treatmentPlanMonthsDoctor
                          return val ? `${val} Month${val > 1 ? 's' : ''}` : '-'
                        })()}
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const val = exam.treatment_plan_months_pro || exam.treatmentPlanMonthsPro
                          return val ? `${val} Month${val > 1 ? 's' : ''}` : '-'
                        })()}
                      </TableCell>
                      <TableCell>
                        ₹{(() => {
                          const val = exam.total_amount || exam.totalAmount || 0
                          return parseFloat(val.toString()).toFixed(2)
                        })()}
                      </TableCell>
                      <TableCell className="text-red-600">
                        ₹{(() => {
                          const val = exam.due_amount || exam.dueAmount || 0
                          return parseFloat(val.toString()).toFixed(2)
                        })()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Total Treatment Amount *</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    className="pl-10"
                    value={totalAmount || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || /^\d*\.?\d*$/.test(val)) {
                        setTotalAmount(val === '' ? 0 : parseFloat(val));
                      }
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Discount</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    className="pl-10"
                    value={discount || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || /^\d*\.?\d*$/.test(val)) {
                        setDiscount(val === '' ? 0 : parseFloat(val));
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Select onValueChange={(value) => {
                  if (!selectedPaymentMethods.find(p => p.id === value)) {
                    setSelectedPaymentMethods([...selectedPaymentMethods, { id: value, amount: 0 }])
                  }
                }}>

                  <SelectContent>
                    {paymentMethods.filter(method => {
                      const methodValue = method.code || method.name?.toLowerCase() || ''
                      return !selectedPaymentMethods.find(p => p.id === methodValue)
                    }).map((method) => {
                      const methodValue = method.code || method.name?.toLowerCase() || ''
                      const IconComponent = getPaymentIcon(methodValue)
                      return (
                        <SelectItem key={method.id} value={methodValue}>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            {method.name}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              {selectedPaymentMethods.length > 0 && (
                <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900">Payment Breakdown</h4>
                  {selectedPaymentMethods.map((payment, index) => {
                    const method = paymentMethods.find(m => (m.code || m.name?.toLowerCase()) === payment.id)
                    const IconComponent = getPaymentIcon(payment.id)
                    return (
                      <div key={payment.id} className="flex items-center gap-3 p-3 bg-white rounded border">
                        <IconComponent className="h-4 w-4 text-gray-600" />
                        <span className="min-w-20 text-sm font-medium">{method?.name || payment.id}</span>
                        <div className="flex-1 relative">
                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            type="text"
                            inputMode="decimal"
                            placeholder="0.00"
                            className="pl-10"
                            value={payment.amount || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                const newPayments = [...selectedPaymentMethods]
                                newPayments[index].amount = val === '' ? 0 : parseFloat(val)
                                setSelectedPaymentMethods(newPayments)
                              }
                            }}
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedPaymentMethods(selectedPaymentMethods.filter((_, i) => i !== index))
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    )
                  })}
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Total Payment Methods Amount:</span>
                      <span>₹{selectedPaymentMethods.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={handleSavePayments}
                disabled={loading || !totalAmount}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Saving...' : 'Save Payment Details'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {currentExamination && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5" />
                Add Additional Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-yellow-700">Total:</span>
                    <span className="ml-2 font-medium">₹{currentExamination.totalAmount || 0}</span>
                  </div>
                  <div>
                    <span className="text-yellow-700">Discount:</span>
                    <span className="ml-2 font-medium">₹{currentExamination.discountAmount || 0}</span>
                  </div>
                  <div>
                    <span className="text-yellow-700">Paid:</span>
                    <span className="ml-2 font-medium text-green-600">₹{currentExamination.paidAmount || 0}</span>
                  </div>
                  <div>
                    <span className="text-yellow-700">Due:</span>
                    <span className="ml-2 font-medium text-red-600">
                      ₹{Math.max(0, (currentExamination.totalAmount || 0) - (currentExamination.discountAmount || 0) - (currentExamination.paidAmount || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {!showAddPayment ? (
                <div className="flex justify-start">
                  <Button onClick={() => setShowAddPayment(true)} className="bg-green-600 hover:bg-green-700">
                    Add Additional Payment
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-green-800 uppercase tracking-wider">New Payment Entry</h3>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="multi-payment-toggle" className="text-xs font-medium text-green-700 cursor-pointer">Multiple Payment Methods</Label>
                      <input 
                        id="multi-payment-toggle"
                        type="checkbox"
                        checked={showAdditionalMultiPayment}
                        onChange={(e) => {
                          setShowAdditionalMultiPayment(e.target.checked)
                          if (e.target.checked && selectedAdditionalPaymentMethods.length === 0) {
                            setSelectedAdditionalPaymentMethods([{ id: 'cash', amount: 0 }])
                          }
                        }}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-white rounded border border-green-100">
                      <Label className="text-gray-500 text-xs uppercase tracking-wider">Previous Paid</Label>
                      <div className="text-lg font-bold text-gray-700">₹{currentExamination.paidAmount || 0}</div>
                    </div>
                    <div className="p-3 bg-white rounded border border-green-200">
                      <Label className="text-green-600 text-xs uppercase tracking-wider">Additional Payment</Label>
                      <div className="text-lg font-bold text-green-600">
                        ₹{(showAdditionalMultiPayment 
                          ? selectedAdditionalPaymentMethods.reduce((sum, p) => sum + p.amount, 0)
                          : parseFloat(additionalPaymentAmount || '0')
                        ).toFixed(2)}
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded border border-green-100">
                      <Label className="text-gray-500 text-xs uppercase tracking-wider">New Total Paid</Label>
                      <div className="text-xl font-black text-blue-600">
                        ₹{(parseFloat(currentExamination.paidAmount || '0') + 
                          (showAdditionalMultiPayment 
                            ? selectedAdditionalPaymentMethods.reduce((sum, p) => sum + p.amount, 0)
                            : parseFloat(additionalPaymentAmount || '0')
                          )
                        ).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {!showAdditionalMultiPayment ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Payment Method</Label>
                        <Select value={additionalPaymentMethod} onValueChange={setAdditionalPaymentMethod}>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentMethods.map((method) => {
                              const methodValue = method.code || method.name?.toLowerCase() || ''
                              const IconComponent = getPaymentIcon(methodValue)
                              return (
                                <SelectItem key={method.id} value={methodValue}>
                                  <div className="flex items-center gap-2">
                                    <IconComponent className="h-4 w-4" />
                                    {method.name}
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Amount</Label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            type="text"
                            inputMode="decimal"
                            placeholder="0.00"
                            className="pl-10 bg-white"
                            value={additionalPaymentAmount}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                setAdditionalPaymentAmount(val);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-green-600 uppercase border-b pb-1">Payment Breakdown</h4>
                      {selectedAdditionalPaymentMethods.map((payment, index) => {
                        const IconComponent = getPaymentIcon(payment.id)
                        return (
                          <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border border-green-100">
                            <Select 
                              value={payment.id} 
                              onValueChange={(value) => {
                                const newMethods = [...selectedAdditionalPaymentMethods]
                                newMethods[index].id = value
                                setSelectedAdditionalPaymentMethods(newMethods)
                              }}
                            >
                              <SelectTrigger className="w-[180px] h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {paymentMethods.map((method) => {
                                  const methodValue = method.code || method.name?.toLowerCase() || ''
                                  return (
                                    <SelectItem key={method.id} value={methodValue}>
                                      {method.name}
                                    </SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                            <div className="flex-1 relative">
                              <IndianRupee className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                              <Input
                                type="text"
                                className="pl-8 h-9"
                                value={payment.amount || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                    const newMethods = [...selectedAdditionalPaymentMethods]
                                    newMethods[index].amount = val === '' ? 0 : parseFloat(val)
                                    setSelectedAdditionalPaymentMethods(newMethods)
                                  }
                                }}
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedAdditionalPaymentMethods(
                                  selectedAdditionalPaymentMethods.filter((_, i) => i !== index)
                                )
                              }}
                              className="text-red-500 hover:text-red-700 h-9 w-9 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      })}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedAdditionalPaymentMethods([...selectedAdditionalPaymentMethods, { id: 'cash', amount: 0 }])}
                        className="w-full border-dashed border-green-300 text-green-600 hover:bg-green-50"
                      >
                        + Add Method
                      </Button>
                    </div>
                  )}

                  <div>
                    <Label>Notes (Optional)</Label>
                    <Input
                      placeholder="Payment notes..."
                      className="bg-white"
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={handleAddPayment} 
                      disabled={loading} 
                      className="bg-green-600 hover:bg-green-700 flex-1"
                    >
                      {loading ? 'Adding...' : 'Confirm Payments'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowAddPayment(false)
                        setShowAdditionalMultiPayment(false)
                        setSelectedAdditionalPaymentMethods([])
                      }} 
                      className="bg-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {installments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Payment Installments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">#</th>
                      <th className="text-left p-2">Payment Date</th>
                      <th className="text-left p-2">Exam Date</th>
                      <th className="text-left p-2">Payment Method</th>
                      <th className="text-left p-2">Amount</th>
                      <th className="text-left p-2">Notes</th>
                      <th className="text-left p-2">Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {installments.map((installment) => (
                      <tr key={installment.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">#{installment.installmentNumber}</td>
                        <td className="p-2">
                          {format(new Date(installment.paymentDate), "dd/MM/yyyy HH:mm")}
                        </td>
                        <td className="p-2 text-gray-500">
                          {installment.examinationDate ? format(new Date(installment.examinationDate), "dd/MM/yyyy") : 'N/A'}
                        </td>
                        <td className="p-2 capitalize">{installment.paymentMethod}</td>
                        <td className="p-2 font-bold">₹{parseFloat(installment.amount.toString()).toFixed(2)}</td>
                        <td className="p-2 text-sm">{installment.notes || '-'}</td>
                        <td className="p-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleShowInstallmentReceipt(installment.id)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Receipt className="h-3 w-3 mr-1" />
                            Receipt
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 font-medium">
                      <td colSpan={2} className="p-2">Total Paid:</td>
                      <td className="p-2 text-green-600">
                        ₹{installments.reduce((sum, inst) => sum + parseFloat(inst.amount), 0).toFixed(2)}
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {currentExamination && (
          <Card>
            <CardHeader>
              <CardTitle>Receipt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button onClick={handleShowReceipt} className="bg-blue-600 hover:bg-blue-700">
                  <Receipt className="h-4 w-4 mr-2" />
                  All Payments Receipt
                </Button>
                <Button onClick={handleShowDailyReceipt} className="bg-green-600 hover:bg-green-700">
                  <Receipt className="h-4 w-4 mr-2" />
                  Today's Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {showReceipt && receiptData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 print-receipt-modal">
            <div className="bg-white p-6 w-full h-full overflow-y-auto print:max-w-none print:max-h-none print:overflow-visible print:p-4">
              <div className="max-w-4xl mx-auto">
                <style jsx>{`
                @media print {
                  @page { margin: 0; size: A4; }
                  body > *:not(.print-receipt-modal) { display: none !important; }
                  .print-receipt-modal { 
                    display: block !important; 
                    position: static !important; 
                    width: 100% !important; 
                    height: auto !important; 
                    background: white !important; 
                    padding: 0 !important;
                    margin: 0 !important;
                    overflow: visible !important;
                  }
                  .receipt-content { position: relative; width: 100%; display: block !important; padding: 10mm !important; padding-top: 15mm !important; page-break-inside: avoid; }
                  .print\\:hidden { display: none !important; }
                  .fixed { position: static !important; }
                }
              `}</style>
                <div className="text-center space-y-2 mb-6">
                  <div className="flex justify-center mb-4">
                    <img src="/images/patientrecipts.jpeg" alt="Hospital Logo" className="w-50 h-40 object-contain mx-auto" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">ISO 9001:2015 Certified</p>
                  <p className="text-sm text-gray-600">{locationData?.address || receiptData.location?.address || '10-5-53, 1st Floor, Upstairs, Surya Tea Stall, Palnadu Bus Stand Centre, Main Road, Narasaraopeta, Andhra Pradesh 522601'}</p>
                  <p className="text-sm text-gray-600">Helpline: {locationData?.phone || receiptData.location?.phone || '9059051906'}</p>
                  <div className="border-b-2 border-gray-100 my-4"></div>
                  <h3 className="text-xl font-bold uppercase tracking-wider">Payment Receipt</h3>
                </div>

                <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm mb-6">
                  <div className="space-y-1">
                    <p><strong>Date:</strong> {receiptData.date ? format(new Date(receiptData.date), "dd/MM/yyyy") : format(new Date(), "dd/MM/yyyy")}</p>
                    <p><strong>Name:</strong> {(receiptData.patient.first_name || '') + ' ' + (receiptData.patient.last_name || '').toUpperCase()}</p>
                    <p><strong>Age/DOB:</strong> {receiptData.patient.date_of_birth ? `${calculateAge(receiptData.patient.date_of_birth)} Y / ${format(new Date(receiptData.patient.date_of_birth), "dd/MM/yyyy")}` : 'N/A'}</p>
                    <p><strong>Renewal Date:</strong> {
                      (receiptData.examination?.next_renewal_date_pro || receiptData.examination?.nextRenewalDatePro || receiptData.nextRenewalDatePro) 
                        ? format(new Date(receiptData.examination?.next_renewal_date_pro || receiptData.examination?.nextRenewalDatePro || receiptData.nextRenewalDatePro), "dd/MM/yyyy") 
                        : (currentExamination?.nextRenewalDatePro 
                          ? format(new Date(currentExamination.nextRenewalDatePro), "dd/MM/yyyy") 
                          : 'N/A'
                        )
                    }</p>
                  </div>
                  <div className="space-y-1">
                    <p><strong>UHID:</strong> {receiptData.patient.patient_id || ''}</p>
                    <p><strong>Mobile:</strong> {receiptData.patient.mobile || ''}</p>
                    <p><strong>Address:</strong> {receiptData.patient.address1 || ''}</p>
                    {currentExamination && Math.max(0, (currentExamination.totalAmount || 0) - (currentExamination.discountAmount || 0) - (currentExamination.paidAmount || 0)) > 0 && (
                      <p className="text-red-600 font-medium"><strong>Due Amount:</strong> ₹{Math.max(0, (currentExamination.totalAmount || 0) - (currentExamination.discountAmount || 0) - (currentExamination.paidAmount || 0)).toFixed(2)}</p>
                    )}
                  </div>
                </div>

                <div className="border border-gray-300 rounded-sm mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-300">
                        <th className="p-3 text-center border-r border-gray-300 w-16">S.No.</th>
                        <th className="p-3 text-center border-r border-gray-300">Mode</th>
                        <th className="p-3 text-right">Amount(Rs)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receiptData.installments ? receiptData.installments.map((installment: any, index: number) => (
                        <tr key={installment.id} className="border-b border-gray-300">
                          <td className="p-3 text-center border-r border-gray-300">{index + 1}</td>
                          <td className="p-3 text-center border-r border-gray-300">{installment.paymentMethod || installment.payment_method}</td>
                          <td className="p-3 text-right">{parseFloat(installment.amount).toFixed(2)}</td>
                        </tr>
                      )) : receiptData.installment && (
                        <tr className="border-b border-gray-300">
                          <td className="p-3 text-center border-r border-gray-300">1</td>
                          <td className="p-3 text-center border-r border-gray-300">{receiptData.installment.paymentMethod || receiptData.installment.payment_method}</td>
                          <td className="p-3 text-right">{parseFloat(receiptData.installment.amount).toFixed(2)}</td>
                        </tr>
                      )}
                      <tr className="font-bold">
                        <td colSpan={2} className="p-3 text-right border-r border-gray-300">
                          {receiptData.isDailyReceipt ? 'Today\'s Payment' : 'Paid Amount'} (Rupees {receiptData.paidAmount} Only)
                        </td>
                        <td className="p-3 text-right">{parseFloat(receiptData.paidAmount).toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-sm mb-6">
                  <p>Received with thanks Rs. {receiptData.paidAmount}/- from Mr. {receiptData.patient.first_name} {receiptData.patient.last_name}.</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-center uppercase">TERMS & CONDITIONS</h4>
                  <ul className="text-[10px] leading-relaxed text-gray-700 space-y-1 text-justify">
                    <li>• The facilities of joining the card includes any number of consultations with physician.</li>
                    <li>• Only the bearer can avail the facilities of the card. The card facilities are given only to the one on whose name the card is made.</li>
                    <li>• The fee is non transferable, non refundable and non extendable.</li>
                    <li>• Patients are strictly advised to use medicines as per attending physicians recommendation. We assume patients have the responsibility to inform the attending physician about the status of the health or any serious disorder during the course of treatment.</li>
                    <li>• We expect & would appreciate patients to visit the clinic as per the due date of their consultations.</li>
                    <li>• Patients are requested to co-operate with the mode of treatment, as sometimes, the speed of recovery is slow (the time of recovery may vary).</li>
                    <li>• The duration of treatment and results may vary from patient.</li>
                    <li>• The Doctor and the clinic has given no guarantee to me (Patient) about the results and duration of the treatment.</li>
                    <li>• During critical emergencies patients / attendants are advised to inform the attending physician.</li>
                    <li>• Case Sheet Record are(Digital) and kept with the Doctor (in Server) till the end of the course of the treatment.</li>
                    <li>• This Corporate Clinic, promises to provide Best Service and Treatment to all Patients.</li>
                    <li>• All disputes are subject to Narasaraopet Court Jurisdiction only. E&OE.</li>
                  </ul>
                </div>

                <div className="flex justify-between pt-12 text-sm">
                  <div className="text-center">
                    <div className="border-t border-gray-400 w-48 mb-1"></div>
                    <p className="font-medium">Patients Signature</p>
                  </div>
                  <div className="text-center">
                    <div className="border-t border-gray-400 w-48 mb-1"></div>
                    <p className="font-medium">Authorised Signature</p>
                  </div>
                </div>

                <div className="flex gap-2 print:hidden">
                  <Button onClick={() => window.print()} className="bg-green-600 hover:bg-green-700">
                    Print Receipt
                  </Button>
                  <Button variant="outline" onClick={() => setShowReceipt(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showSimpleReceipt && simpleReceiptData && (
          <Dialog open={showSimpleReceipt} onOpenChange={setShowSimpleReceipt}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto print:max-h-none print:overflow-visible print:border-none print:shadow-none print:p-0">
              <DialogHeader>
                <DialogTitle className="print:hidden">Payment Successful</DialogTitle>
              </DialogHeader>
              <div className="receipt-content p-4 space-y-6">
                <style jsx>{`
                  @media print {
                    @page { margin: 0; size: A4; }
                    body > *:not([data-radix-portal]), 
                    [data-radix-portal] > *:not([role="dialog"]) { 
                      display: none !important; 
                    }
                    .print\\:hidden { display: none !important; }
                    [role="dialog"] { 
                      position: static !important;
                      display: block !important;
                      width: 100% !important;
                      max-width: none !important;
                      max-height: none !important; 
                      overflow: visible !important; 
                      border: none !important; 
                      box-shadow: none !important;
                      padding: 0 !important;
                      margin: 0 !important;
                      transform: none !important;
                      visibility: visible !important;
                    }
                    .receipt-content { display: block !important; visibility: visible !important; padding: 10mm !important; padding-top: 15mm !important; page-break-inside: avoid; }
                    [data-radix-overlay] { display: none !important; }
                  }
                `}</style>
                
                {/* Logo and Header */}
                <div className="text-center space-y-2">
                  <div className="flex justify-center mb-2">
                    <img src="/images/patientrecipts.jpeg" alt="Hospital Logo" className="w-48 h-32 object-contain" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">ISO 9001:2015 Certified</p>
                  <p className="text-sm text-gray-600">{locationData?.address || '10-5-53, 1st Floor, Upstairs, Surya Tea Stall, Palnadu Bus Stand Centre, Main Road, Narasaraopeta, Andhra Pradesh 522601'}</p>
                  <p className="text-sm text-gray-600">Helpline: {locationData?.phone || '9059051906'}</p>
                  <div className="border-b-2 border-gray-100 my-4"></div>
                  <h3 className="text-xl font-bold uppercase tracking-wider">Payment Receipt</h3>
                </div>

                {/* Patient Info Grid */}
                <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
                  <div className="space-y-1">
                    <p><strong>Date:</strong> {format(new Date(), 'dd/MM/yyyy')}</p>
                    <p><strong>Name:</strong> {simpleReceiptData.name?.toUpperCase()}</p>
                    <p><strong>Age/DOB:</strong> {simpleReceiptData.age} Y / {simpleReceiptData.dob}</p>
                    <p><strong>Renewal Date:</strong> {simpleReceiptData.renewalDate}</p>
                  </div>
                  <div className="space-y-1">
                    <p><strong>UHID:</strong> {simpleReceiptData.patientId}</p>
                    <p><strong>Mobile:</strong> {simpleReceiptData.mobile}</p>
                    <p><strong>Address:</strong> {simpleReceiptData.address}</p>
                    {simpleReceiptData.dueAmount > 0 && (
                      <p className="text-red-600 font-medium"><strong>Due Amount:</strong> ₹{parseFloat(simpleReceiptData.dueAmount || '0').toFixed(2)}</p>
                    )}
                  </div>
                </div>

                {/* Table */}
                <div className="border border-gray-300 rounded-sm">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-300">
                        <th className="p-3 text-center border-r border-gray-300 w-16">S.No.</th>
                        <th className="p-3 text-center border-r border-gray-300">Mode</th>
                        <th className="p-3 text-right">Amount(Rs)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-300">
                        <td className="p-3 text-center border-r border-gray-300">1</td>
                        <td className="p-3 text-center border-r border-gray-300">{simpleReceiptData.fee} ({simpleReceiptData.type})</td>
                        <td className="p-3 text-right">{parseFloat(simpleReceiptData.amount || '0').toFixed(2)}</td>
                      </tr>
                      <tr className="font-bold">
                        <td colSpan={2} className="p-3 text-right border-r border-gray-300">
                          Paid Amount (Rupees {simpleReceiptData.amount} Only)
                        </td>
                        <td className="p-3 text-right">{parseFloat(simpleReceiptData.amount || '0').toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-sm">Received with thanks Rs. {simpleReceiptData.amount}/- from Mr. {simpleReceiptData.name}.</p>

                {/* Terms and Conditions */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-center uppercase">Terms & Conditions</h4>
                  <ul className="text-[10px] leading-relaxed text-gray-700 space-y-1">
                    <li>• The facilities of joining the card includes any number of consultations with physician.</li>
                    <li>• Only the bearer can avail the facilities of the card. The card facilities are given only to the one on whose name the card is made.</li>
                    <li>• The fee is non transferable, non refundable and non extendable.</li>
                    <li>• Patients are strictly advised to use medicines as per attending physicians recommendation. We assume patients have the responsibility to inform the attending physician about the status of the health or any serious disorder during the course of treatment.</li>
                    <li>• We expect & would appreciate patients to visit the clinic as per the due date of their consultations.</li>
                    <li>• Patients are requested to co-operate with the mode of treatment, as sometimes, the speed of recovery is slow (the time of recovery may vary).</li>
                    <li>• The duration of treatment and results may vary from patient.</li>
                    <li>• The Doctor and the clinic has given no guarantee to me (Patient) about the results and duration of the treatment.</li>
                    <li>• During critical emergencies patients / attendants are advised to inform the attending physician.</li>
                    <li>• Case Sheet Record are(Digital) and kept with the Doctor (in Server) till the end of the course of the treatment.</li>
                    <li>• This Corporate Clinic, promises to provide Best Service and Treatment to all Patients.</li>
                    <li>• All disputes are subject to Narasaraopet Court Jurisdiction only. E&OE.</li>
                  </ul>
                </div>

                {/* Signatures */}
                <div className="flex justify-between pt-12 text-sm">
                  <div className="text-center">
                    <div className="border-t border-gray-400 w-48 mb-1"></div>
                    <p className="font-medium">Patients Signature</p>
                  </div>
                  <div className="text-center">
                    <div className="border-t border-gray-400 w-48 mb-1"></div>
                    <p className="font-medium">Authorised Signature</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-6 print:hidden">
                  <Button
                    variant="outline"
                    onClick={() => {
                        window.print()
                    }}
                    className="flex-1"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print Receipt
                  </Button>
                  <Button
                    onClick={() => {
                      setShowSimpleReceipt(false)
                      router.push('/admin/manager/patient-bill-discuss')
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </PrivateRoute>
  )
}
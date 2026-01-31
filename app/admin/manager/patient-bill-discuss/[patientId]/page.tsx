"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Banknote,
  Smartphone,
  Building,
  ArrowLeft,
  Receipt,
  Clock,
  IndianRupee
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import PrivateRoute from "@/components/auth/PrivateRoute"
import authService from "@/lib/authService"





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
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<{id: string, amount: number}[]>([])
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [installments, setInstallments] = useState<any[]>([])
  const [additionalPaymentMethod, setAdditionalPaymentMethod] = useState('')
  const [additionalPaymentAmount, setAdditionalPaymentAmount] = useState('')
  const [paymentNotes, setPaymentNotes] = useState('')
  const [showAddPayment, setShowAddPayment] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [receiptData, setReceiptData] = useState<any>(null)

  useEffect(() => {
    fetchTreatmentPlans()
    fetchPaymentMethods()
    if (patientId) {
      fetchPatientData()
      fetchPatientExamination()
      fetchInstallments()
    }
  }, [patientId])

  useEffect(() => {
    if (selectedPlan) {
      const today = new Date()
      const renewalDate = new Date(today)
      renewalDate.setMonth(today.getMonth() + selectedPlan.months)
      setNextRenewalDate(renewalDate.toISOString().split('T')[0])
    }
  }, [selectedPlan])



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
        const latestExam = examinations[0] // Get the latest examination
        if (latestExam) {
          setCurrentExamination(latestExam)
          // Pre-populate with PRO data if exists, otherwise use doctor data
          if (latestExam.treatment_plan_months_pro) {
            setSelectedPlanValue(latestExam.treatment_plan_months_pro.toString())
            setNextRenewalDate(latestExam.next_renewal_date_pro ? new Date(latestExam.next_renewal_date_pro).toISOString().split('T')[0] : '')
          } else if (latestExam.treatment_plan_months_doctor) {
            setSelectedPlanValue(latestExam.treatment_plan_months_doctor.toString())
            setNextRenewalDate(latestExam.next_renewal_date_doctor ? new Date(latestExam.next_renewal_date_doctor).toISOString().split('T')[0] : '')
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
    setSelectedPlan(plan)
    setSelectedPlanValue(months)
    
    const today = new Date()
    const renewalDate = new Date(today)
    renewalDate.setMonth(today.getMonth() + parseInt(months))
    setNextRenewalDate(renewalDate.toISOString().split('T')[0])
  }

  const fetchPaymentMethods = async () => {
    // Use static payment methods like in registration page
    setPaymentMethods([
      { id: 1, code: "cash", name: "Cash" },
      { id: 2, code: "card", name: "Card" },
      { id: 3, code: "upi", name: "UPI" },
      { id: 4, code: "insurance", name: "Insurance" },
      { id: 5, code: "other", name: "Other" }
    ])
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
        fetchPatientExamination()
        fetchInstallments()
        setShowReceipt(true)
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
    if (!currentExamination || !additionalPaymentMethod || !additionalPaymentAmount) {
      alert('Please select payment method and enter amount')
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${currentExamination.id}/add-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethod: additionalPaymentMethod,
          amount: parseFloat(additionalPaymentAmount),
          notes: paymentNotes
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        alert('Payment added successfully!')
        setAdditionalPaymentMethod('')
        setAdditionalPaymentAmount('')
        setPaymentNotes('')
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
        setShowReceipt(true)
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
    if (!currentExamination) {
      // Try to fetch with patientId if currentExamination not loaded yet
      if (patientId) {
        try {
          const token = localStorage.getItem('authToken')
          const examResponse = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${patientId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
          
          if (examResponse.ok) {
            const examData = await examResponse.json()
            const latestExam = Array.isArray(examData) ? examData[0] : examData
            if (latestExam) {
              const installmentResponse = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${latestExam.id}/installments`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              })
              
              if (installmentResponse.ok) {
                const data = await installmentResponse.json()
                setInstallments(data)
              }
            }
          }
        } catch (error) {
          console.error('Error fetching installments:', error)
        }
      }
      return
    }
    
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/${currentExamination.id}/installments`, {
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
        setReceiptData(data)
      }
    } catch (error) {
      console.error('Error fetching receipt:', error)
    }
  }

  const handleShowReceipt = () => {
    fetchReceipt()
    setShowReceipt(true)
  }

  const handleShowInstallmentReceipt = async (installmentId: number) => {
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
        setReceiptData(data)
        setShowReceipt(true)
      }
    } catch (error) {
      console.error('Error fetching installment receipt:', error)
    }
  }

  const handleShowDailyReceipt = async () => {
    if (!currentExamination) return
    
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
        setReceiptData(data)
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
              <Calendar className="h-5 w-5" />
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
                      <span className="text-gray-600 font-medium">ID:</span>
                      <span className="ml-2">{currentExamination.id || 'N/A'}</span>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <span className="text-gray-600 font-medium">Patient ID:</span>
                      <span className="ml-2">{currentExamination.patient_id || 'N/A'}</span>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <span className="text-gray-600 font-medium">Patient Name:</span>
                      <span className="ml-2">{currentExamination.patient_name || 'N/A'}</span>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <span className="text-gray-600 font-medium">Doctor Plan (Months):</span>
                      <span className="ml-2">{currentExamination.treatment_plan_months_doctor || 'N/A'}</span>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <span className="text-gray-600 font-medium">Doctor Renewal Date:</span>
                      <span className="ml-2">
                        {currentExamination.next_renewal_date_doctor ? 
                          new Date(currentExamination.next_renewal_date_doctor).toLocaleDateString() 
                          : 'N/A'
                        }
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <span className="text-gray-600 font-medium">PRO Plan (Months):</span>
                      <span className="ml-2">{currentExamination.treatment_plan_months_pro || 'N/A'}</span>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <span className="text-gray-600 font-medium">PRO Renewal Date:</span>
                      <span className="ml-2">
                        {currentExamination.next_renewal_date_pro ? 
                          new Date(currentExamination.next_renewal_date_pro).toLocaleDateString() 
                          : 'N/A'
                        }
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <span className="text-gray-600 font-medium">Created At:</span>
                      <span className="ml-2">
                        {currentExamination.created_at ? 
                          new Date(currentExamination.created_at).toLocaleDateString() 
                          : 'N/A'
                        }
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-900 mb-2">Raw JSON Data:</h5>
                    <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-40 text-gray-700">
                      {JSON.stringify(currentExamination, null, 2)}
                    </pre>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Current Doctor Treatment Plan</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Duration:</span>
                      <span className="ml-2 font-medium">
                        {currentExamination.treatment_plan_months_doctor ? 
                          `${currentExamination.treatment_plan_months_doctor} Month${currentExamination.treatment_plan_months_doctor > 1 ? 's' : ''}` 
                          : 'Not set'
                        }
                      </span>
                    </div>
                    <div>
                      <span className="text-blue-700">Renewal Date:</span>
                      <span className="ml-2 font-medium">
                        {currentExamination.next_renewal_date_doctor ? 
                          new Date(currentExamination.next_renewal_date_doctor).toLocaleDateString() 
                          : 'Not set'
                        }
                      </span>
                    </div>
                  </div>
                </div>
                
                {currentExamination.treatment_plan_months_pro && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Current PRO Treatment Plan</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-green-700">Duration:</span>
                        <span className="ml-2 font-medium">
                          {currentExamination.treatment_plan_months_pro} Month{currentExamination.treatment_plan_months_pro > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div>
                        <span className="text-green-700">Renewal Date:</span>
                        <span className="ml-2 font-medium">
                          {currentExamination.next_renewal_date_pro ? 
                            new Date(currentExamination.next_renewal_date_pro).toLocaleDateString() 
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
                <Label>PRO Treatment Plan Months *</Label>
                <Select value={selectedPlanValue} onValueChange={handlePlanChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose treatment duration" />
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

              <div className="space-y-2">
                <Label>PRO Next Renewal Date</Label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">
                    {nextRenewalDate ? new Date(nextRenewalDate).toLocaleDateString() : "Select a plan first"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button 
                onClick={handleSaveTreatmentPlan}
                disabled={!selectedPlanValue || loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Saving...' : 'Save PRO Treatment Plan'}
              </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Total Treatment Amount *</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="pl-10"
                    value={totalAmount || ''}
                    onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Discount</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="pl-10"
                    value={discount || ''}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Paid Amount</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="pl-10"
                    value={paidAmount || ''}
                    onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Pay Amount:</span>
                  <span className="font-medium">₹{(totalAmount - discount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Methods Total:</span>
                  <span className="font-medium text-blue-600">₹{selectedPaymentMethods.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Amount:</span>
                  <span className={`font-medium ${(totalAmount - discount - selectedPaymentMethods.reduce((sum, p) => sum + p.amount, 0)) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ₹{(totalAmount - discount - selectedPaymentMethods.reduce((sum, p) => sum + p.amount, 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Payment Methods</Label>
                <Select onValueChange={(value) => {
                  if (!selectedPaymentMethods.find(p => p.id === value)) {
                    setSelectedPaymentMethods([...selectedPaymentMethods, {id: value, amount: 0}])
                  }
                }}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Add Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.filter(method => !selectedPaymentMethods.find(p => p.id === method.code)).map((method) => {
                      const IconComponent = getPaymentIcon(method.code)
                      return (
                        <SelectItem key={method.id} value={method.code}>
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
                    const method = paymentMethods.find(m => m.code === payment.id)
                    const IconComponent = getPaymentIcon(payment.id)
                    return (
                      <div key={payment.id} className="flex items-center gap-3 p-3 bg-white rounded border">
                        <IconComponent className="h-4 w-4 text-gray-600" />
                        <span className="min-w-20 text-sm font-medium">{method?.name}</span>
                        <div className="flex-1 relative">
                          <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            type="number"
                            placeholder="0.00"
                            className="pl-10"
                            value={payment.amount || ''}
                            onChange={(e) => {
                              const newPayments = [...selectedPaymentMethods]
                              newPayments[index].amount = parseFloat(e.target.value) || 0
                              setSelectedPaymentMethods(newPayments)
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
                <Button onClick={() => setShowAddPayment(true)} className="bg-green-600 hover:bg-green-700">
                  Add Payment
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Payment Method</Label>
                      <Select value={additionalPaymentMethod} onValueChange={setAdditionalPaymentMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map((method) => {
                            const IconComponent = getPaymentIcon(method.code)
                            return (
                              <SelectItem key={method.id} value={method.code}>
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
                          type="number"
                          placeholder="0.00"
                          className="pl-10"
                          value={additionalPaymentAmount}
                          onChange={(e) => setAdditionalPaymentAmount(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Notes (Optional)</Label>
                    <Input
                      placeholder="Payment notes..."
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleAddPayment} disabled={loading} className="bg-green-600 hover:bg-green-700">
                      {loading ? 'Adding...' : 'Add Payment'}
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddPayment(false)}>
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
                      <th className="text-left p-2">Payment Method</th>
                      <th className="text-left p-2">Amount</th>
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Notes</th>
                      <th className="text-left p-2">Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {installments.map((installment) => (
                      <tr key={installment.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">#{installment.installmentNumber}</td>
                        <td className="p-2">{installment.paymentMethod}</td>
                        <td className="p-2 font-medium text-green-600">₹{installment.amount}</td>
                        <td className="p-2 text-sm text-gray-600">
                          {new Date(installment.paymentDate).toLocaleDateString()}
                        </td>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <img src="/images/logo.JPG" alt="Hospital Logo" className="w-20 h-20 object-contain" />
                </div>
                <h2 className="text-2xl font-bold text-blue-600">Unicare Homeopathy</h2>
                <p className="text-sm text-gray-600">ISO 9001:2015 Certified</p>
                <p className="text-sm text-gray-600">H-91, Sector 63,H Block, Sector 63, Noida, Uttar Pradesh 201301</p>
                <p className="text-sm text-gray-600">Helpline: 9675011122, 7617677227</p>
                <hr className="my-4" />
                <h3 className="text-lg font-semibold">Payment Receipt</h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <p><strong>Date:</strong> {receiptData.date}</p>
                  <p><strong>Name:</strong> {receiptData.patient.first_name || ''} {receiptData.patient.last_name || ''}</p>
                  <p><strong>Age/DOB:</strong> {receiptData.patient.date_of_birth ? new Date(receiptData.patient.date_of_birth).toLocaleDateString() : ''}</p>
                </div>
                <div>
                  <p><strong>UHID:</strong> {receiptData.patient.patient_id || ''}</p>
                  <p><strong>Mobile:</strong> {receiptData.patient.mobile || ''}</p>
                  <p><strong>Address:</strong> {receiptData.patient.address1 || ''}</p>
                </div>
              </div>

              <table className="w-full border-collapse border border-gray-300 mb-4">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">S.No.</th>
                    <th className="border border-gray-300 p-2">Mode</th>
                    <th className="border border-gray-300 p-2">Amount(Rs)</th>
                  </tr>
                </thead>
                <tbody>
                  {receiptData.installments ? receiptData.installments.map((installment, index) => (
                    <tr key={installment.id}>
                      <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                      <td className="border border-gray-300 p-2 text-center">{installment.paymentMethod || installment.payment_method}</td>
                      <td className="border border-gray-300 p-2 text-right">{installment.amount}</td>
                    </tr>
                  )) : receiptData.installment && (
                    <tr>
                      <td className="border border-gray-300 p-2 text-center">1</td>
                      <td className="border border-gray-300 p-2 text-center">{receiptData.installment.paymentMethod || receiptData.installment.payment_method}</td>
                      <td className="border border-gray-300 p-2 text-right">{receiptData.installment.amount}</td>
                    </tr>
                  )}
                  <tr className="font-bold">
                    <td colSpan={2} className="border border-gray-300 p-2 text-right">
                      {receiptData.isDailyReceipt ? 'Today\'s Payment' : 'Paid Amount'} (Rupees {receiptData.paidAmount} Only)
                    </td>
                    <td className="border border-gray-300 p-2 text-right">{receiptData.paidAmount}</td>
                  </tr>
                </tbody>
              </table>

              <div className="text-sm mb-4">
                <p>Received with thanks Rs. {receiptData.paidAmount}/- from Mr. {receiptData.patient.first_name} {receiptData.patient.last_name}.</p>
              </div>

              <div className="text-right mb-4">
                <p className="text-sm">Authorized Signature</p>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => window.print()} className="bg-green-600 hover:bg-green-700">
                  Print Receipt
                </Button>
                <Button variant="outline" onClick={() => setShowReceipt(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PrivateRoute>
  )
}
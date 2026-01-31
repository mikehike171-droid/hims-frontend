"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, User, Stethoscope, ArrowLeft, CreditCard, Plus, Trash2, Search, ChevronDown } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function ConsultationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const patientId = searchParams.get('patientId')
  
  const [patient, setPatient] = useState<any>(null)
  const [doctors, setDoctors] = useState<any[]>([])
  const [consultationFees, setConsultationFees] = useState<any[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null)
  const [doctorSearch, setDoctorSearch] = useState("")
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false)
  const [consultationFee, setConsultationFee] = useState("")
  const [payments, setPayments] = useState<{type: string, amount: string}[]>([{type: "cash", amount: ""}])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (patientId) {
      fetchPatientDetails()
      fetchDoctors()
      fetchConsultationFees()
    }
  }, [patientId])

  const fetchPatientDetails = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patients/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const patientData = await response.json()
        setPatient(patientData)
      }
    } catch (error) {
      console.error('Error fetching patient:', error)
    }
  }

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const locationId = userData.locationId || userData.primary_location_id || 1
      
      const response = await fetch(`${authService.getSettingsApiUrl()}/doctors/users?locationId=${locationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const doctorsData = await response.json()
        setDoctors(doctorsData)
      }
    } catch (error) {
      console.error('Error fetching doctors:', error)
    }
  }

  const fetchConsultationFees = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const locationId = userData.locationId || userData.primary_location_id || 1
      
      const response = await fetch(`${authService.getSettingsApiUrl()}/doctors/consultation-fees?locationId=${locationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const feesData = await response.json()
        setConsultationFees(feesData)
      }
    } catch (error) {
      console.error('Error fetching consultation fees:', error)
    }
  }

  const filteredDoctors = doctors.filter(doctor =>
    `${doctor.first_name || doctor.firstName} ${doctor.last_name || doctor.lastName}`.toLowerCase().includes(doctorSearch.toLowerCase()) ||
    doctor.username.toLowerCase().includes(doctorSearch.toLowerCase())
  )

  const selectDoctor = (doctor: any) => {
    setSelectedDoctor(doctor)
    setDoctorSearch(`${doctor.first_name || doctor.firstName} ${doctor.last_name || doctor.lastName}`.trim())
    setShowDoctorDropdown(false)
    const fee = consultationFees.find(f => f.userId?.toString() === doctor.id?.toString())
    setConsultationFee(fee?.cashFee?.toString() || "")
  }

  const handleDoctorSearch = (value: string) => {
    setDoctorSearch(value)
    setShowDoctorDropdown(true)
  }

  const addPayment = () => {
    setPayments([...payments, {type: "cash", amount: ""}])
  }

  const removePayment = (index: number) => {
    if (payments.length > 1) {
      setPayments(payments.filter((_, i) => i !== index))
    }
  }

  const updatePayment = (index: number, field: 'type' | 'amount', value: string) => {
    const updatedPayments = [...payments]
    updatedPayments[index][field] = value
    setPayments(updatedPayments)
  }

  const getTotalAmount = () => {
    return payments.reduce((total, payment) => total + (parseFloat(payment.amount) || 0), 0)
  }

  const handleSubmit = async () => {
    const validPayments = payments.filter(p => p.amount && parseFloat(p.amount) > 0)
    
    if (!selectedDoctor || !consultationFee || validPayments.length === 0) {
      alert('Please select doctor, enter consultation fee, and add at least one payment')
      return
    }

    const totalPayments = getTotalAmount()
    const consultationAmount = parseFloat(consultationFee)
    
    if (totalPayments !== consultationAmount) {
      alert(`Payment total (₹${totalPayments}) must equal consultation fee (₹${consultationAmount})`)
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/consultation`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: patient.id,
          doctorId: selectedDoctor.id,
          consultationFee: consultationAmount,
          payments: validPayments
        }),
      })

      if (response.ok) {
        alert('Consultation fee recorded successfully!')
        router.push('/admin/front-office/patients')
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to record consultation fee')
      }
    } catch (error) {
      console.error('Error recording consultation:', error)
      alert('Failed to record consultation fee')
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

  if (!patient) {
    return <div className="p-6">Loading patient details...</div>
  }

  return (
    <PrivateRoute modulePath="admin/front-office/consultation" action="create">
      <div className="min-h-screen bg-gray-50">
        <div className="">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Consultation Fee</h1>
              <p className="text-gray-600">Record consultation fee for the patient</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Information Card */}
            <Card className="h-fit" data-slot="card">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white" style={{padding: '5px'}}>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {patient.salutation}. {patient.first_name} {patient.last_name}
                    </h3>
                    <p className="text-gray-600">ID: {patient.patient_id}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <Label className="text-sm text-gray-500">Age</Label>
                      <p className="font-medium">{calculateAge(patient.date_of_birth)} Years</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Gender</Label>
                      <Badge variant={patient.gender.toLowerCase() === 'm' ? 'default' : 'secondary'}>
                        {patient.gender.toLowerCase() === 'm' ? 'Male' : 'Female'}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Mobile</Label>
                      <p className="font-medium">{patient.mobile || patient.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">DOB</Label>
                      <p className="font-medium">{new Date(patient.date_of_birth).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Consultation Fee Form */}
            <Card data-slot="card">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white" style={{padding: '5px'}}>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Consultation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Doctor Selection */}
                  <div className="relative">
                    <Label className="text-base font-medium flex items-center mb-2">
                      <Stethoscope className="h-4 w-4 mr-2" />
                      Select Doctor *
                    </Label>
                    <div className="relative">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search and select a doctor..."
                          value={doctorSearch}
                          onChange={(e) => handleDoctorSearch(e.target.value)}
                          onFocus={() => setShowDoctorDropdown(true)}
                          className="h-12 pl-10 pr-10"
                        />
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                      {showDoctorDropdown && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredDoctors.length > 0 ? (
                            filteredDoctors.map((doctor) => (
                              <div
                                key={doctor.id}
                                onClick={() => selectDoctor(doctor)}
                                className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              >
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                  <Stethoscope className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{doctor.first_name || doctor.firstName} {doctor.last_name || doctor.lastName}</p>
                                  <p className="text-sm text-gray-500">{doctor.username}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-3 text-gray-500 text-center">
                              No doctors found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Consultation Fee */}
                  <div>
                    <Label className="text-base font-medium flex items-center mb-2">
                      <DollarSign className="h-4 w-4 mr-2" />
                      Consultation Fee (₹) *
                    </Label>
                    <Input 
                      type="number"
                      placeholder="Enter consultation fee"
                      value={consultationFee}
                      onChange={(e) => setConsultationFee(e.target.value)}
                      onKeyDown={(e) => {
                        if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                          e.preventDefault()
                        }
                      }}
                      className="h-12 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                    />
                  </div>

                  {/* Multiple Payments */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-base font-medium flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Payment Details *
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addPayment}
                        className="h-8"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Payment
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {payments.map((payment, index) => (
                        <div key={index} className="flex gap-2 items-end">
                          <div className="flex-1">
                            <Select 
                              value={payment.type} 
                              onValueChange={(value) => updatePayment(index, 'type', value)}
                            >
                              <SelectTrigger className="h-10">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cash">
                                  <div className="flex items-center">
                                    <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                                    Cash
                                  </div>
                                </SelectItem>
                                <SelectItem value="card">
                                  <div className="flex items-center">
                                    <CreditCard className="h-4 w-4 mr-2 text-blue-600" />
                                    Card
                                  </div>
                                </SelectItem>
                                <SelectItem value="upi">
                                  <div className="flex items-center">
                                    <div className="w-4 h-4 mr-2 bg-purple-600 rounded-sm flex items-center justify-center">
                                      <span className="text-white text-xs font-bold">U</span>
                                    </div>
                                    UPI
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex-1">
                            <Input
                              type="number"
                              placeholder="Amount"
                              value={payment.amount}
                              onChange={(e) => updatePayment(index, 'amount', e.target.value)}
                              onKeyDown={(e) => {
                                if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                                  e.preventDefault()
                                }
                              }}
                              className="h-10 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                            />
                          </div>
                          {payments.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removePayment(index)}
                              className="h-10 w-10 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Payment Summary */}
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Payments:</span>
                        <span className="font-medium">₹{getTotalAmount().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Consultation Fee:</span>
                        <span className="font-medium">₹{consultationFee || '0.00'}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-gray-200 mt-2">
                        <span className="text-sm font-medium">Balance:</span>
                        <span className={`font-medium ${
                          getTotalAmount() === parseFloat(consultationFee || '0') 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          ₹{(parseFloat(consultationFee || '0') - getTotalAmount()).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <Button 
                      variant="outline" 
                      onClick={() => router.back()}
                      className="px-6"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      disabled={loading || !selectedDoctor || !consultationFee || payments.every(p => !p.amount)}
                      className="bg-green-600 hover:bg-green-700 px-8"
                    >
                      {loading ? 'Recording...' : 'Record Fee'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PrivateRoute>
  )
}
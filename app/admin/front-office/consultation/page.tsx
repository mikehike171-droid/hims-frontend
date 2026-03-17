"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, User, Stethoscope, ArrowLeft, CreditCard, Plus, Trash2, Search, ChevronDown, Printer } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { settingsApi } from "@/lib/settingsApi"

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
  const [locationData, setLocationData] = useState<any>(null)
  const [showPrintDialog, setShowPrintDialog] = useState(false)
  const [consultationData, setConsultationData] = useState<any>(null)

  useEffect(() => {
    if (patientId) {
      fetchPatientDetails()
      fetchDoctors()
      fetchConsultationFees()
      fetchLocationData()
    }
  }, [patientId])

  const fetchLocationData = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const locationId = userData?.primary_location_id || authService.getLocationId()

      if (locationId) {
        const response = await fetch(`${authService.getSettingsApiUrl()}/locations/${locationId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          setLocationData(data)
        }
      }
    } catch (error) {
      console.error('Error fetching location data:', error)
    }
  }

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
        const result = await response.json()
        setConsultationData({
          patient: patient,
          doctor: selectedDoctor,
          fee: consultationAmount,
          payments: validPayments,
          date: new Date(),
          id: result.id
        })
        setShowPrintDialog(true)
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
    <PrivateRoute modulePath="admin/front-office/consultation" action="add">
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
        
        {/* Receipt Dialog */}
        <Dialog open={showPrintDialog} onOpenChange={(open) => {
          setShowPrintDialog(open)
          if (!open) router.push('/admin/front-office/patients')
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto print:max-h-none print:overflow-visible print:border-none print:shadow-none print:p-0">
            <DialogHeader>
              <DialogTitle className="print:hidden">Consultation Receipt</DialogTitle>
            </DialogHeader>
            <div className="receipt-content p-4 space-y-6">
              <style jsx>{`
                @media print {
                  @page { margin: 10mm; size: A4; }
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
                  .receipt-content { display: block !important; visibility: visible !important; }
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

              {/* Patient and Receipt Info */}
              <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm border-b pb-4">
                <div className="space-y-1">
                  <p><strong>Date:</strong> {consultationData?.date ? format(new Date(consultationData.date), "dd/MM/yyyy") : format(new Date(), "dd/MM/yyyy")}</p>
                  <p><strong>Name:</strong> {((patient?.first_name || '') + ' ' + (patient?.last_name || '')).toUpperCase()}</p>
                  <p><strong>Age/Gender:</strong> {calculateAge(patient?.date_of_birth)} Y / {patient?.gender?.toUpperCase()}</p>
                  <p><strong>Doctor:</strong> {(selectedDoctor?.first_name || selectedDoctor?.firstName || '') + ' ' + (selectedDoctor?.last_name || selectedDoctor?.lastName || '')}</p>
                </div>
                <div className="space-y-1 text-right">
                  <p><strong>UHID:</strong> {patient?.patient_id}</p>
                  <p><strong>Mobile:</strong> {patient?.mobile || patient?.phone}</p>
                  <p><strong>Receipt No:</strong> {consultationData?.id || 'N/A'}</p>
                </div>
              </div>

              {/* Services Table */}
              <div className="border border-gray-200 rounded-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="p-3 text-left border-r border-gray-200">Description</th>
                      <th className="p-3 text-center border-r border-gray-200 w-32">Mode</th>
                      <th className="p-3 text-right w-32">Amount(Rs)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="p-3 border-r border-gray-200">Consultation Fee</td>
                      <td className="p-3 text-center border-r border-gray-200">
                        {consultationData?.payments.map((p: any) => p.type).join(', ').toUpperCase()}
                      </td>
                      <td className="p-3 text-right font-medium">{parseFloat(consultationData?.fee || '0').toFixed(2)}</td>
                    </tr>
                    <tr className="font-bold bg-gray-50">
                      <td colSpan={2} className="p-3 text-right border-r border-gray-200">Total Paid</td>
                      <td className="p-3 text-right text-blue-700">₹{parseFloat(consultationData?.fee || '0').toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Amount in Words */}
              <div className="text-sm italic text-gray-600">
                Received with thanks Rs. {consultationData?.fee}/- from {patient?.salutation}. {patient?.first_name} {patient?.last_name}.
              </div>

              {/* Terms & Conditions */}
              <div className="space-y-2 pt-4">
                <h4 className="text-xs font-bold text-center uppercase tracking-wider">Terms & Conditions</h4>
                <ul className="text-[10px] leading-relaxed text-gray-500 space-y-1 list-disc pl-4">
                  <li>Consultation fee is valid for today only.</li>
                  <li>Follow-up visits may attract additional charges.</li>
                  <li>Please carry this receipt for any future reference.</li>
                  <li>All disputes are subject to local jurisdiction only.</li>
                </ul>
              </div>

              {/* Signatures */}
              <div className="flex justify-between pt-12 items-end">
                <div className="text-center">
                  <div className="border-t border-gray-300 w-40 mb-1"></div>
                  <p className="text-xs font-medium text-gray-600">Patient Signature</p>
                </div>
                <div className="text-center">
                  <div className="border-t border-gray-300 w-40 mb-1"></div>
                  <p className="text-xs font-medium text-gray-600">Authorized Signature</p>
                </div>
              </div>

              {/* Print Button */}
              <div className="flex justify-center pt-6 gap-3 print:hidden">
                <Button 
                  onClick={() => window.print()}
                  className="bg-blue-600 hover:bg-blue-700 h-10 px-8"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Receipt
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowPrintDialog(false)
                    router.push('/admin/front-office/patients')
                  }}
                  className="h-10 px-8"
                >
                  Close & Continue
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PrivateRoute>
  )
}
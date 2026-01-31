"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, User, Stethoscope, Search, ChevronDown } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { appointmentsApi } from "@/lib/appointmentsApi"

export default function BookAppointmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const patientId = searchParams.get('patientId')
  
  const [patient, setPatient] = useState<any>(null)
  const fetchingPatientRef = useRef(false)
  const [doctors, setDoctors] = useState<any[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [selectedDoctorName, setSelectedDoctorName] = useState("")
  const [doctorSearch, setDoctorSearch] = useState("")
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false)
  const [appointmentDate, setAppointmentDate] = useState("")
  const [appointmentTime, setAppointmentTime] = useState("")
  const [appointmentType, setAppointmentType] = useState("consultation")
  const [notes, setNotes] = useState("")
  const [checkForSrdocVisit, setCheckForSrdocVisit] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (patientId) {
      fetchPatientDetails()
      fetchDoctors()
    }
  }, [patientId])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.relative')) {
        setShowDoctorDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchPatientDetails = async () => {
    if (fetchingPatientRef.current) return
    
    try {
      fetchingPatientRef.current = true
      const token = localStorage.getItem('authToken')
      console.log('Fetching patient with ID:', patientId)
      console.log('API URL:', `${authService.getSettingsApiUrl()}/patients/${patientId}`)
      
      const response = await fetch(`${authService.getSettingsApiUrl()}/patients/${patientId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const patientData = await response.json()
        console.log('Patient data received:', patientData)
        setPatient(patientData)
      } else {
        const errorText = await response.text()
        console.error('Failed to fetch patient:', response.status, response.statusText, errorText)
        alert(`Failed to load patient data: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error fetching patient:', error)
      alert('Network error while fetching patient data')
    } finally {
      fetchingPatientRef.current = false
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
        setFilteredDoctors(doctorsData)
      }
    } catch (error) {
      console.error('Error fetching doctors:', error)
    }
  }

  const handleSubmit = async () => {
    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      alert('Please fill all required fields')
      return
    }

    setLoading(true)
    try {
      const appointmentData = {
        patientId: patient.id,
        doctorId: selectedDoctor,
        appointmentDate,
        appointmentTime,
        appointmentType,
        notes,
        checkForSrdocVisit
      }

      const response = await appointmentsApi.createAppointment(appointmentData)
      
      alert('Appointment booked successfully!')
      router.push('/admin/front-office/patients')
    } catch (error) {
      console.error('Error booking appointment:', error)
      alert('Failed to book appointment')
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

  const handleDoctorSearch = (searchTerm: string) => {
    setDoctorSearch(searchTerm)
    const filtered = doctors.filter(doctor => {
      const fullName = `${doctor.first_name || doctor.firstName || ''} ${doctor.last_name || doctor.lastName || ''}`.toLowerCase()
      const username = (doctor.username || '').toLowerCase()
      return fullName.includes(searchTerm.toLowerCase()) || username.includes(searchTerm.toLowerCase())
    })
    setFilteredDoctors(filtered)
  }

  const selectDoctor = (doctor: any) => {
    setSelectedDoctor(doctor.id.toString())
    const doctorName = `${doctor.first_name || doctor.firstName || ''} ${doctor.last_name || doctor.lastName || ''}`.trim()
    setSelectedDoctorName(doctorName)
    setDoctorSearch(doctorName)
    setShowDoctorDropdown(false)
  }

  if (!patient) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p>Loading patient details...</p>
          <p className="text-sm text-gray-500 mt-2">Patient ID: {patientId}</p>
        </div>
      </div>
    )
  }

  return (
    <PrivateRoute modulePath="admin/front-office/appointments" action="create">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Appointment</h1>
            <p className="text-gray-600">Schedule an appointment for the selected patient</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient Information Card */}
            <div className="lg:col-span-1">
              <Card className="h-fit">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
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
                        {patient.salutation || ''} {patient.first_name || patient.firstName || ''} {patient.last_name || patient.lastName || ''}
                      </h3>
                      <p className="text-gray-600">ID: {patient.patient_id || patient.id}</p>
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
            </div>

            {/* Appointment Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                  <CardTitle className="flex items-center">
                    <CalendarDays className="h-5 w-5 mr-2" />
                    Appointment Details
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

                    {/* Appointment Details - One Line */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-base font-medium mb-2 block">Appointment Type *</Label>
                        <Select value={appointmentType} onValueChange={setAppointmentType}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="consultation">Consultation</SelectItem>
                            <SelectItem value="follow-up">Follow-up</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-base font-medium mb-2 block">Appointment Date *</Label>
                        <Input 
                          type="date" 
                          value={appointmentDate}
                          onChange={(e) => setAppointmentDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="h-12"
                        />
                      </div>
                      <div>
                        <Label className="text-base font-medium mb-2 block">Time Slot *</Label>
                        <Select value={appointmentTime} onValueChange={setAppointmentTime}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="09:00">09:00 AM</SelectItem>
                            <SelectItem value="10:00">10:00 AM</SelectItem>
                            <SelectItem value="11:00">11:00 AM</SelectItem>
                            <SelectItem value="14:00">02:00 PM</SelectItem>
                            <SelectItem value="15:00">03:00 PM</SelectItem>
                            <SelectItem value="16:00">04:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Special Options */}
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="srdoc" 
                          checked={checkForSrdocVisit}
                          onCheckedChange={(checked) => setCheckForSrdocVisit(checked === true)}
                        />
                        <Label htmlFor="srdoc" className="text-red-600 font-medium">
                          Check For Senior Doctor Visit
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 ml-6">
                        Enable this option if the patient requires consultation with a senior doctor
                      </p>
                    </div>

                    {/* Notes */}
                    <div>
                      <Label className="text-base font-medium mb-2 block">Additional Notes</Label>
                      <Textarea 
                        placeholder="Enter any special instructions or notes for the appointment..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
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
                        disabled={loading || !selectedDoctor || !appointmentDate || !appointmentTime}
                        className="bg-green-600 hover:bg-green-700 px-8"
                      >
                        {loading ? 'Booking...' : 'Book Appointment'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  )
}
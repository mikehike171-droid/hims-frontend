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
import { CalendarDays, Clock, User, Stethoscope, Search, ChevronDown, CalendarIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import authService from "@/lib/authService"
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
  const [timeSlots, setTimeSlots] = useState<string[]>([])
  const [filteredTimeSlots, setFilteredTimeSlots] = useState<string[]>([])
  const [timeSearch, setTimeSearch] = useState("")
  const [showTimeDropdown, setShowTimeDropdown] = useState(false)

  useEffect(() => {
    generateTimeSlots()
  }, [])

  const generateTimeSlots = () => {
    const slots = []
    let currentHour = 10
    let currentMinute = 0

    while (currentHour < 20 || (currentHour === 20 && currentMinute === 0)) {
      const ampm = currentHour >= 12 ? 'PM' : 'AM'
      const displayHour = currentHour > 12 ? currentHour - 12 : currentHour
      const formattedHour = displayHour.toString().padStart(2, '0')
      const formattedMinute = currentMinute.toString().padStart(2, '0')

      const time24 = `${currentHour.toString().padStart(2, '0')}:${formattedMinute}`
      const time12 = `${formattedHour}:${formattedMinute} ${ampm}`

      slots.push({ value: time24, label: time12 })

      currentMinute += 15
      if (currentMinute >= 60) {
        currentMinute = 0
        currentHour += 1
      }
    }
    setTimeSlots(slots as any)
    setFilteredTimeSlots(slots as any)
  }

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
        setShowTimeDropdown(false)
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

  const handleTimeSearch = (searchTerm: string) => {
    setTimeSearch(searchTerm)
    const filtered = (timeSlots as any).filter((slot: any) =>
      slot.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slot.value.includes(searchTerm)
    )
    setFilteredTimeSlots(filtered)
  }

  const selectTime = (slot: any) => {
    setAppointmentTime(slot.value)
    setTimeSearch(slot.label)
    setShowTimeDropdown(false)
  }

  if (!patientId) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-red-600 font-semibold">No patient selected</p>
          <p className="text-sm text-gray-500 mt-2">Please select a patient from the patient list to book an appointment.</p>
          <Button onClick={() => router.push('/admin/front-office/patients')} className="mt-4">
            Go to Patient List
          </Button>
        </div>
      </div>
    )
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
                      <p className="font-medium">{patient.date_of_birth ? format(new Date(patient.date_of_birth), "dd/MM/yyyy") : 'N/A'}</p>
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
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full h-12 justify-start text-left font-normal border-gray-200",
                              !appointmentDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                            {appointmentDate ? format(parseISO(appointmentDate), "dd/MM/yyyy") : <span>Select Date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-xl bg-white" align="start">
                          <Calendar
                            mode="single"
                            selected={appointmentDate ? parseISO(appointmentDate) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                // Keep internal state as YYYY-MM-DD for consistency with previous behavior and API expectations
                                setAppointmentDate(format(date, "yyyy-MM-dd"))
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label className="text-base font-medium mb-2 block">Time Slot *</Label>
                      <div className="relative">
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search time..."
                            value={timeSearch}
                            onChange={(e) => handleTimeSearch(e.target.value)}
                            onFocus={() => setShowTimeDropdown(true)}
                            className="h-12 pl-10 pr-10"
                          />
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                        {showTimeDropdown && (
                          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                            {filteredTimeSlots.length > 0 ? (
                              (filteredTimeSlots as any).map((slot: any) => (
                                <div
                                  key={slot.value}
                                  onClick={() => selectTime(slot)}
                                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                >
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                    <Clock className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{slot.label}</p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="p-3 text-gray-500 text-center">
                                No slots found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
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
  )
}
"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Phone, ArrowLeft, Search, Stethoscope } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PrivateRoute from "@/components/auth/PrivateRoute"
import authService from "@/lib/authService"

interface CallHistoryRecord {
  sno: number
  dateTime: string
  nextCallDate: string
  disposition: string
  callerName: string
  patientFeeling: string
  notes: string
}

export default function CallPatientPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const patientId = searchParams.get('patientId')
  
  const [patientData, setPatientData] = useState<any>(null)
  const [nextCallDate, setNextCallDate] = useState("")
  const [disposition, setDisposition] = useState("")
  const [patientFeeling, setPatientFeeling] = useState("")
  const [notes, setNotes] = useState("")
  const [isHistoryOpen, setIsHistoryOpen] = useState(true)
  const [callHistory, setCallHistory] = useState<CallHistoryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSubmitButton, setShowSubmitButton] = useState(false)
  const fetchingRef = useRef(false)
  const [doctors, setDoctors] = useState<any[]>([])
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [selectedDoctorName, setSelectedDoctorName] = useState("")
  const [doctorSearch, setDoctorSearch] = useState("")
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false)
  const [appointmentDate, setAppointmentDate] = useState("")
  const [appointmentTime, setAppointmentTime] = useState("")
  const [appointmentType, setAppointmentType] = useState("consultation")
  const [appointmentNotes, setAppointmentNotes] = useState("")
  const [bookingLoading, setBookingLoading] = useState(false)
  const [appointmentTypes, setAppointmentTypes] = useState([])

  const fetchPatientData = async () => {
    if (!patientId || fetchingRef.current) return
    
    try {
      fetchingRef.current = true
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const baseUrl = authService.getSettingsApiUrl()
      
      console.log('Fetching patient data for ID:', patientId)
      console.log('Base URL:', baseUrl)
      
      // Fetch patient details
      const patientUrl = `${baseUrl}/patients/${patientId}`
      console.log('Patient URL:', patientUrl)
      
      const patientResponse = await fetch(patientUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      console.log('Patient response status:', patientResponse.status)
      
      if (patientResponse.ok) {
        const patient = await patientResponse.json()
        console.log('Patient data received:', patient)
        console.log('Patient fields:', Object.keys(patient))
        setPatientData(patient)
      } else {
        console.error('Failed to fetch patient:', patientResponse.status, patientResponse.statusText)
      }
      
      // Fetch call history after patient data
      await fetchCallHistory()
      
      // Fetch doctors
      await fetchDoctors()
      
      // Fetch appointment types
      await fetchAppointmentTypes()
      
    } catch (error) {
      console.error('Error fetching patient data:', error)
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }

  useEffect(() => {
    if (patientId && !fetchingRef.current) {
      fetchPatientData()
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

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !appointmentDate || !appointmentTime) {
      alert('Please fill all required fields')
      return
    }

    setBookingLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      const appointmentData = {
        patientId: parseInt(patientId || '0'),
        doctorId: parseInt(selectedDoctor),
        appointmentDate,
        appointmentTime,
        appointmentType,
        notes: appointmentNotes
      }

      const response = await fetch(`${authService.getSettingsApiUrl()}/appointments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      })
      
      if (response.ok) {
        alert('Appointment booked successfully!')
        // Reset form
        setSelectedDoctor('')
        setSelectedDoctorName('')
        setDoctorSearch('')
        setAppointmentDate('')
        setAppointmentTime('')
        setAppointmentType('consultation')
        setAppointmentNotes('')
      } else {
        alert('Failed to book appointment')
      }
    } catch (error) {
      console.error('Error booking appointment:', error)
      alert('Failed to book appointment')
    } finally {
      setBookingLoading(false)
    }
  }

  const handleCall = async () => {
    setShowSubmitButton(true)
    
    // Also trigger mobile app call
    try {
      const token = localStorage.getItem('authToken')
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      
      // Get patient phone number and name for mobile app
      const phoneNumber = patientData?.mobile_number || patientData?.mobile || patientData?.phone
      const patientName = patientData?.first_name && patientData?.last_name 
        ? `${patientData.first_name} ${patientData.last_name}`
        : patientData?.name || patientData?.patient_name || 'Unknown Patient'
      
      console.log('Triggering mobile call for:', { phoneNumber, patientName, patientId })
      
      const response = await fetch(`${authService.getSettingsApiUrl()}/trigger-mobile-call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          patient_name: patientName,
          patient_id: patientId,
          requested_by: user.user_name || user.username || 'Web User'
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('Mobile call triggered successfully:', result)
      } else {
        console.error('Failed to trigger mobile call:', response.status)
      }
    } catch (error) {
      console.error('Error triggering mobile call:', error)
    }
  }

  const handleSubmitCall = async () => {
    if (!patientId) return
    
    try {
      setIsSubmitting(true)
      const token = localStorage.getItem('authToken')
      const baseUrl = authService.getSettingsApiUrl()
      const locationId = authService.getLocationId()
      
      const callData = {
        nextCallDate,
        disposition,
        patientFeeling,
        notes
      }
      
      const response = await fetch(`${baseUrl}/patients/${patientId}/call-history?locationId=${locationId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(callData)
      })
      
      if (response.ok) {
        // Reset form
        setNextCallDate('')
        setDisposition('')
        setPatientFeeling('')
        setNotes('')
        setShowSubmitButton(false)
        
        // Refresh call history
        fetchingRef.current = false
        await fetchCallHistory()
        
        alert('Call record saved successfully!')
      } else {
        alert('Failed to save call record')
      }
    } catch (error) {
      console.error('Error saving call record:', error)
      alert('Error saving call record')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const fetchCallHistory = async () => {
    if (!patientId) return
    
    try {
      const token = localStorage.getItem('authToken')
      const baseUrl = authService.getSettingsApiUrl()
      const locationId = authService.getLocationId()
      
      const historyResponse = await fetch(`${baseUrl}/patients/${patientId}/call-history?locationId=${locationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (historyResponse.ok) {
        const history = await historyResponse.json()
        setCallHistory(Array.isArray(history) ? history : [])
      }
    } catch (error) {
      console.error('Error fetching call history:', error)
    }
  }

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const locationId = userData.locationId || userData.primary_location_id || authService.getLocationId() || 1
      
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

  const fetchAppointmentTypes = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const locationId = userData.locationId || userData.primary_location_id || authService.getLocationId() || 1
      
      const response = await fetch(`${authService.getSettingsApiUrl()}/appointment-types?locationId=${locationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const typesData = await response.json()
        setAppointmentTypes(Array.isArray(typesData) ? typesData : (typesData?.data || []))
      }
    } catch (error) {
      console.error('Error fetching appointment types:', error)
      // Fallback to default types if API fails
      setAppointmentTypes([
        { id: 1, name: 'Consultation', code: 'consultation' },
        { id: 2, name: 'Follow-up', code: 'follow-up' },
        { id: 3, name: 'Emergency', code: 'emergency' }
      ])
    }
  }

  const handleBack = () => {
    router.back()
  }

  return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Click 2 Call Patient</h1>
          </div>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p>Loading patient data...</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Patient Details</CardTitle>
              </CardHeader>
              <CardContent>
                {patientData && (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Patient Name</Label>
                      <p className="text-lg font-semibold">
                        {patientData.first_name && patientData.last_name 
                          ? `${patientData.first_name} ${patientData.last_name}`
                          : patientData.name || patientData.patient_name || 'N/A'
                        }
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Patient ID</Label>
                      <p className="text-lg font-semibold">{patientData.patient_id || patientData.id || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Mobile</Label>
                      <p className="text-lg font-semibold">{patientData.mobile_number || patientData.mobile || 'N/A'}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
              <Card>
          <CardHeader>
            <CardTitle>Book Appointment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appointmentDate">Appointment Date *</Label>
                <Input
                  id="appointmentDate"
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="appointmentTime">Time Slot *</Label>
                <Select value={appointmentTime} onValueChange={setAppointmentTime}>
                  <SelectTrigger>
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
            
            <div className="relative space-y-2">
              <Label htmlFor="doctor">Doctor</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search and select a doctor..."
                  value={doctorSearch}
                  onChange={(e) => handleDoctorSearch(e.target.value)}
                  onFocus={() => setShowDoctorDropdown(true)}
                  className="pl-10 pr-10"
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
            
            <div className="space-y-2">
              <Label htmlFor="appointmentType">Appointment Type</Label>
              <Select value={appointmentType} onValueChange={setAppointmentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.code}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="appointmentNotes">Notes</Label>
              <Textarea
                id="appointmentNotes"
                value={appointmentNotes}
                onChange={(e) => setAppointmentNotes(e.target.value)}
                placeholder="Any specific requirements..."
                className="min-h-[60px]"
              />
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleBookAppointment}
              disabled={bookingLoading || !selectedDoctor || !appointmentDate || !appointmentTime}
            >
              {bookingLoading ? 'Booking...' : 'Book Appointment'}
            </Button>
          </CardContent>
        </Card>
            <Card>
              <CardHeader>
                <CardTitle>Call Details</CardTitle>
              </CardHeader>
            <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nextCallDate">Next Call Date</Label>
                <Input
                  id="nextCallDate"
                  type="date"
                  value={nextCallDate}
                  onChange={(e) => setNextCallDate(e.target.value)}
                  placeholder="mm/dd/yyyy"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="disposition">Disposition</Label>
                <Select value={disposition} onValueChange={setDisposition}>
                  <SelectTrigger>
                    <SelectValue placeholder="--Select--" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="answered">Answered</SelectItem>
                    <SelectItem value="no-answer">No Answer</SelectItem>
                    <SelectItem value="busy">Busy</SelectItem>
                    <SelectItem value="voicemail">Voicemail</SelectItem>
                    <SelectItem value="wrong-number">Wrong Number</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="patientFeeling">Patient Feeling</Label>
                <Select value={patientFeeling} onValueChange={setPatientFeeling}>
                  <SelectTrigger>
                    <SelectValue placeholder="--Select--" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="better">Better</SelectItem>
                    <SelectItem value="same">Same</SelectItem>
                    <SelectItem value="worse">Worse</SelectItem>
                    <SelectItem value="much-better">Much Better</SelectItem>
                    <SelectItem value="much-worse">Much Worse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">My Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter your notes here..."
                className="min-h-[80px]"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCall} className="bg-green-600 hover:bg-green-700">
                <Phone className="w-4 h-4 mr-2" />
                Click 2 Call
              </Button>
              
              {showSubmitButton && (
                <Button 
                  onClick={handleSubmitCall} 
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? 'Saving...' : 'Submit'}
                </Button>
              )}
            </div>

            <Collapsible open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
              <div className="border-t-2 border-cyan-500 pt-4">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between cursor-pointer">
                    <h3 className="text-lg font-semibold">Call History</h3>
                    {isHistoryOpen ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="mt-4">
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sno</TableHead>
                          <TableHead>DateTime</TableHead>
                          <TableHead>Next Call Date</TableHead>
                          <TableHead>Disposition</TableHead>
                          <TableHead>Caller Name</TableHead>
                          <TableHead>Patient Feeling</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {callHistory.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                              No call history available
                            </TableCell>
                          </TableRow>
                        ) : (
                          callHistory.map((record) => (
                            <TableRow key={record.sno}>
                              <TableCell>{record.sno}</TableCell>
                              <TableCell>{record.dateTime}</TableCell>
                              <TableCell>{record.nextCallDate}</TableCell>
                              <TableCell>{record.disposition}</TableCell>
                              <TableCell>{record.callerName}</TableCell>
                              <TableCell>{record.patientFeeling}</TableCell>
                              <TableCell>{record.notes}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          </CardContent>
        </Card>

      
          </>
        )}
      </div>
  )
}
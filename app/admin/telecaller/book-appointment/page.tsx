"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowLeft, Calendar, Clock, User, Stethoscope, MapPin, CheckCircle, MessageSquare, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { BillSummaryWidget } from "@/components/billing/bill-summary-widget"
import { PrescriptionPrint } from "@/components/prescription/prescription-print"
import PrivateRoute from "@/components/auth/PrivateRoute"

// Mock data for specializations
const mockSpecializations = [
  { id: "cardiology", name: "Cardiology", description: "Heart and cardiovascular system" },
  { id: "dermatology", name: "Dermatology", description: "Skin, hair, and nail conditions" },
  { id: "orthopedics", name: "Orthopedics", description: "Bones, joints, and muscles" },
  { id: "pediatrics", name: "Pediatrics", description: "Children's health and development" },
  { id: "neurology", name: "Neurology", description: "Brain and nervous system" },
  { id: "general", name: "General Medicine", description: "General health and wellness" },
  { id: "gynecology", name: "Gynecology", description: "Women's reproductive health" },
  { id: "psychiatry", name: "Psychiatry", description: "Mental health and disorders" },
]

// Enhanced mock doctors with specializations
const mockDoctors = [
  {
    id: 1,
    name: "Dr. Rajesh Patel",
    specialization: "cardiology",
    department: "Cardiology",
    fee: 800,
    available: true,
    experience: "15 years",
    qualification: "MD, DM Cardiology",
  },
  {
    id: 2,
    name: "Dr. Priya Sharma",
    specialization: "dermatology",
    department: "Dermatology",
    fee: 600,
    available: true,
    experience: "12 years",
    qualification: "MD Dermatology",
  },
  {
    id: 3,
    name: "Dr. Amit Singh",
    specialization: "orthopedics",
    department: "Orthopedics",
    fee: 700,
    available: false,
    experience: "18 years",
    qualification: "MS Orthopedics",
  },
  {
    id: 4,
    name: "Dr. Sunita Gupta",
    specialization: "pediatrics",
    department: "Pediatrics",
    fee: 500,
    available: true,
    experience: "10 years",
    qualification: "MD Pediatrics",
  },
  {
    id: 5,
    name: "Dr. Vikram Kumar",
    specialization: "neurology",
    department: "Neurology",
    fee: 1000,
    available: true,
    experience: "20 years",
    qualification: "DM Neurology",
  },
  {
    id: 6,
    name: "Dr. Anita Desai",
    specialization: "general",
    department: "General Medicine",
    fee: 400,
    available: true,
    experience: "8 years",
    qualification: "MBBS, MD",
  },
  {
    id: 7,
    name: "Dr. Meera Joshi",
    specialization: "gynecology",
    department: "Gynecology",
    fee: 650,
    available: true,
    experience: "14 years",
    qualification: "MS Gynecology",
  },
  {
    id: 8,
    name: "Dr. Ravi Mehta",
    specialization: "psychiatry",
    department: "Psychiatry",
    fee: 900,
    available: true,
    experience: "16 years",
    qualification: "MD Psychiatry",
  },
]

const mockTimeSlots = [
  { time: "09:00 AM", available: true, token: "T001" },
  { time: "09:30 AM", available: true, token: "T002" },
  { time: "10:00 AM", available: false, token: "T003" },
  { time: "10:30 AM", available: true, token: "T004" },
  { time: "11:00 AM", available: true, token: "T005" },
  { time: "11:30 AM", available: true, token: "T006" },
  { time: "02:00 PM", available: true, token: "T007" },
  { time: "02:30 PM", available: true, token: "T008" },
  { time: "03:00 PM", available: false, token: "T009" },
  { time: "03:30 PM", available: true, token: "T010" },
]

const mockBranches = [
  { id: 1, name: "Main Branch - MG Road", address: "123 MG Road, Bangalore" },
  { id: 2, name: "Branch - Koramangala", address: "456 Koramangala, Bangalore" },
  { id: 3, name: "Branch - Whitefield", address: "789 Whitefield, Bangalore" },
]

export default function BookAppointment() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const patientId = searchParams.get("patient")

  const [step, setStep] = useState(1)
  const [selectedSpecialization, setSelectedSpecialization] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [patientName, setPatientName] = useState("")
  const [patientPhone, setPatientPhone] = useState("")
  const [patientEmail, setPatientEmail] = useState("")
  const [appointmentType, setAppointmentType] = useState("consultation")
  const [notes, setNotes] = useState("")
  const [sendReminder, setSendReminder] = useState(true)
  const [collectBookingFee, setCollectBookingFee] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [billItems, setBillItems] = useState<any[]>([])
  const [doctorSearchOpen, setDoctorSearchOpen] = useState(false)
  const [doctorSearchTerm, setDoctorSearchTerm] = useState("")
  const [showPrescription, setShowPrescription] = useState(false)
  const [prescriptionData, setPrescriptionData] = useState<any>(null)

  // Pre-fill patient data if coming from patient view
  useEffect(() => {
    if (patientId) {
      // Mock patient data - replace with actual API call
      setPatientName("Rajesh Kumar")
      setPatientPhone("+91 98765 43210")
      setPatientEmail("rajesh.kumar@email.com")
    }
  }, [patientId])

  // Filter doctors based on specialization and search term
  const filteredDoctors = mockDoctors.filter((doctor) => {
    const matchesSpecialization = !selectedSpecialization || doctor.specialization === selectedSpecialization
    const matchesSearch =
      !doctorSearchTerm ||
      doctor.name.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
      doctor.department.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
      doctor.qualification.toLowerCase().includes(doctorSearchTerm.toLowerCase())

    return matchesSpecialization && matchesSearch
  })

  // Add selected doctor's consultation to bill
  useEffect(() => {
    if (selectedDoctor) {
      const doctor = mockDoctors.find((d) => d.id.toString() === selectedDoctor)
      if (doctor) {
        const consultationItem = {
          id: `consultation-${doctor.id}`,
          name: `${doctor.name} - ${doctor.department} Consultation`,
          price: doctor.fee,
          quantity: 1,
          discount: 0,
          total: doctor.fee,
          category: "Consultation",
        }
        setBillItems([consultationItem])
      }
    }
  }, [selectedDoctor])

  const handleNext = () => {
    if (step === 1 && (!selectedSpecialization || !selectedDoctor || !selectedBranch)) {
      toast.error("Please select specialization, doctor and branch")
      return
    }
    if (step === 2 && (!selectedDate || !selectedTime)) {
      toast.error("Please select date and time")
      return
    }
    if (step === 3 && (!patientName || !patientPhone)) {
      toast.error("Please fill patient details")
      return
    }
    setStep(step + 1)
  }

  const handleBack = () => {
    if (step === 1) {
      router.back()
    } else {
      setStep(step - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast.success("Appointment booked successfully!")

    // Send confirmations
    if (sendReminder) {
      toast.info("Confirmation SMS sent to patient")
    }

    setIsSubmitting(false)
    router.push("/telecaller")
  }

  const handleGenerateBill = (billData: any) => {
    console.log("Generating bill for appointment:", billData)

    // Create prescription data
    const selectedDoctorData = mockDoctors.find((d) => d.id.toString() === selectedDoctor)
    const selectedBranchData = mockBranches.find((b) => b.id.toString() === selectedBranch)

    const prescription = {
      patientId: patientId || "P001234",
      patientName,
      patientAge: 35,
      patientGender: "Male",
      patientPhone,
      patientEmail,
      patientAddress: "123 Main Street, Bangalore",
      doctorName: selectedDoctorData?.name || "",
      doctorSpecialization: selectedDoctorData?.department || "",
      doctorRegNo: "REG12345",
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      services: billData.items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
      paymentStatus: billData.partialPayment ? "partial" : "paid",
      paymentMethod: billData.paymentMethod,
      totalAmount: billData.grandTotal,
      paidAmount: billData.paidAmount,
      balanceAmount: billData.balanceAmount,
      prescriptionId: `RX${Date.now()}`,
      hospitalName: "Pranam Hospital",
      hospitalAddress: selectedBranchData?.address || "",
      hospitalPhone: "+91-80-12345678",
      hospitalEmail: "info@pranamhospital.com",
    }

    setPrescriptionData(prescription)
    setShowPrescription(true)
    toast.success("Bill generated successfully!")
  }

  const handleSaveDraft = (draftData: any) => {
    console.log("Saving appointment draft:", draftData)
    toast.success("Draft saved successfully!")
  }

  const handlePrescriptionPrint = () => {
    toast.success("Prescription sent to printer!")
  }

  const handleEmailSend = () => {
    toast.success("Prescription sent to patient's email!")
  }

  const handleWhatsAppSend = () => {
    toast.success("Prescription sent via WhatsApp!")
  }

  const selectedSpecializationData = mockSpecializations.find((s) => s.id === selectedSpecialization)
  const selectedDoctorData = mockDoctors.find((d) => d.id.toString() === selectedDoctor)
  const selectedBranchData = mockBranches.find((b) => b.id.toString() === selectedBranch)
  const selectedTimeData = mockTimeSlots.find((t) => t.time === selectedTime)

  return (
    <PrivateRoute modulePath="admin/telecaller/book-appointment" action="view">
      <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Booking Flow */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Book Appointment</h1>
                <p className="text-muted-foreground">
                  Step {step} of 4 -{" "}
                  {step === 1
                    ? "Select Specialization & Doctor"
                    : step === 2
                      ? "Choose Date & Time"
                      : step === 3
                        ? "Patient Details"
                        : "Confirmation"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    s < step
                      ? "bg-green-500 text-white"
                      : s === step
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-600",
                  )}
                >
                  {s < step ? <CheckCircle className="h-4 w-4" /> : s}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Specialization & Doctor Selection */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Specialization Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Specialization</CardTitle>
                  <CardDescription>Choose the medical specialization you need</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {mockSpecializations.map((spec) => (
                      <div
                        key={spec.id}
                        className={cn(
                          "p-4 rounded-lg border cursor-pointer transition-colors text-center",
                          selectedSpecialization === spec.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50",
                        )}
                        onClick={() => setSelectedSpecialization(spec.id)}
                      >
                        <div className="font-medium text-sm">{spec.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">{spec.description}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Doctor Selection */}
              {selectedSpecialization && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Select Doctor - {selectedSpecializationData?.name}</span>
                      <Popover open={doctorSearchOpen} onOpenChange={setDoctorSearchOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Search className="h-4 w-4 mr-2" />
                            Search Doctors
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0" align="end">
                          <Command>
                            <CommandInput
                              placeholder="Search doctors..."
                              value={doctorSearchTerm}
                              onValueChange={setDoctorSearchTerm}
                            />
                            <CommandList>
                              <CommandEmpty>No doctors found.</CommandEmpty>
                              <CommandGroup>
                                {filteredDoctors.map((doctor) => (
                                  <CommandItem
                                    key={doctor.id}
                                    onSelect={() => {
                                      setSelectedDoctor(doctor.id.toString())
                                      setDoctorSearchOpen(false)
                                      setDoctorSearchTerm("")
                                    }}
                                    className="cursor-pointer"
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <div>
                                        <p className="font-medium">{doctor.name}</p>
                                        <p className="text-sm text-gray-600">{doctor.qualification}</p>
                                        <p className="text-xs text-gray-500">{doctor.experience}</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-semibold">₹{doctor.fee}</p>
                                        <Badge variant={doctor.available ? "default" : "secondary"} className="text-xs">
                                          {doctor.available ? "Available" : "Unavailable"}
                                        </Badge>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </CardTitle>
                    <CardDescription>
                      Choose from available doctors in {selectedSpecializationData?.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {filteredDoctors.map((doctor) => (
                        <div
                          key={doctor.id}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors",
                            selectedDoctor === doctor.id.toString() ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50",
                            !doctor.available && "opacity-50 cursor-not-allowed",
                          )}
                          onClick={() => doctor.available && setSelectedDoctor(doctor.id.toString())}
                        >
                          <div className="flex items-center gap-3">
                            <Stethoscope className="h-5 w-5 text-blue-500" />
                            <div>
                              <div className="font-medium">{doctor.name}</div>
                              <div className="text-sm text-muted-foreground">{doctor.qualification}</div>
                              <div className="text-xs text-muted-foreground">{doctor.experience} experience</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">₹{doctor.fee}</div>
                            <Badge variant={doctor.available ? "default" : "secondary"}>
                              {doctor.available ? "Available" : "Unavailable"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Branch Selection */}
              {selectedDoctor && (
                <Card>
                  <CardHeader>
                    <CardTitle>Select Branch</CardTitle>
                    <CardDescription>Choose the hospital branch</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockBranches.map((branch) => (
                        <div
                          key={branch.id}
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
                            selectedBranch === branch.id.toString() ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50",
                          )}
                          onClick={() => setSelectedBranch(branch.id.toString())}
                        >
                          <MapPin className="h-5 w-5 text-blue-500" />
                          <div>
                            <div className="font-medium">{branch.name}</div>
                            <div className="text-sm text-muted-foreground">{branch.address}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {step === 2 && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                  <CardDescription>Choose appointment date</CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Available Time Slots</CardTitle>
                  <CardDescription>
                    {selectedDate
                      ? `Slots for ${new Date(selectedDate).toLocaleDateString()}`
                      : "Please select a date first"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDate ? (
                    <div className="grid grid-cols-2 gap-2">
                      {mockTimeSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedTime === slot.time ? "default" : "outline"}
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                          className="justify-start"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {slot.time}
                          {!slot.available && " (Booked)"}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">Select a date to view available slots</div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Patient Details */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Patient Details</CardTitle>
                <CardDescription>Enter or verify patient information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="patient-name">Patient Name *</Label>
                    <Input
                      id="patient-name"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="Enter patient name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-phone">Phone Number *</Label>
                    <Input
                      id="patient-phone"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patient-email">Email Address</Label>
                  <Input
                    id="patient-email"
                    type="email"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    placeholder="patient@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appointment-type">Appointment Type</Label>
                  <Select value={appointmentType} onValueChange={setAppointmentType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="procedure">Procedure</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any specific requirements or symptoms..."
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="send-reminder" checked={sendReminder} onCheckedChange={setSendReminder} />
                    <Label htmlFor="send-reminder">Send appointment confirmation & reminders</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="booking-fee" checked={collectBookingFee} onCheckedChange={setCollectBookingFee} />
                    <Label htmlFor="booking-fee">Collect booking fee (₹100)</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Appointment Summary</CardTitle>
                <CardDescription>Please review the appointment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Specialization</Label>
                      <div className="mt-1">{selectedSpecializationData?.name}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Doctor</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Stethoscope className="h-4 w-4 text-blue-500" />
                        <span>{selectedDoctorData?.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{selectedDoctorData?.department}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Branch</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span>{selectedBranchData?.name}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Date & Time</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span>
                          {new Date(selectedDate).toLocaleDateString()} at {selectedTime}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">Token: {selectedTimeData?.token}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Patient</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="h-4 w-4 text-blue-500" />
                        <span>{patientName}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{patientPhone}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Appointment Type</Label>
                      <div className="mt-1 capitalize">{appointmentType}</div>
                    </div>
                  </div>
                </div>

                {notes && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Notes</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">{notes}</div>
                  </div>
                )}

                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Confirmations will be sent via:</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">SMS</Badge>
                    {patientEmail && <Badge variant="outline">Email</Badge>}
                    <Badge variant="outline">WhatsApp</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {step === 1 ? "Cancel" : "Back"}
            </Button>

            {step < 4 ? (
              <Button onClick={handleNext}>
                Next
                <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Booking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm Booking
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Bill Summary Sidebar */}
        <div className="lg:col-span-1">
          <BillSummaryWidget
            items={billItems}
            onItemsChange={setBillItems}
            onGenerateBill={handleGenerateBill}
            onSaveDraft={handleSaveDraft}
            showPaymentOptions={true}
            className="sticky top-6"
          />
        </div>
      </div>

      {/* Prescription Print Dialog */}
      {prescriptionData && (
        <PrescriptionPrint
          isOpen={showPrescription}
          onClose={() => setShowPrescription(false)}
          prescriptionData={prescriptionData}
          onPrint={handlePrescriptionPrint}
          onEmailSend={handleEmailSend}
          onWhatsAppSend={handleWhatsAppSend}
          showEPrescriptionOption={true}
        />
      )}
      </div>
    </PrivateRoute>
  )
}

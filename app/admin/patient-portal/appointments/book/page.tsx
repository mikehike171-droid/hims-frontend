"use client"

import { useState } from "react"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Clock, MapPin, User, Stethoscope, CreditCard, CheckCircle, Phone, Search } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function BookAppointment() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedBranch, setSelectedBranch] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("")
  const [appointmentType, setAppointmentType] = useState("")
  const [searchDoctor, setSearchDoctor] = useState("")
  const [step, setStep] = useState(1)

  const branches = [
    { id: "main", name: "Pranam Main Hospital", address: "123 Main Street, Mumbai", phone: "+91-9876543210" },
    { id: "branch1", name: "Pranam Branch - Andheri", address: "456 Andheri West, Mumbai", phone: "+91-9876543211" },
    { id: "branch2", name: "Pranam Branch - Bandra", address: "789 Bandra East, Mumbai", phone: "+91-9876543212" },
  ]

  const departments = [
    { id: "cardiology", name: "Cardiology", icon: "❤️" },
    { id: "orthopedics", name: "Orthopedics", icon: "🦴" },
    { id: "neurology", name: "Neurology", icon: "🧠" },
    { id: "dermatology", name: "Dermatology", icon: "🧴" },
    { id: "pediatrics", name: "Pediatrics", icon: "👶" },
    { id: "gynecology", name: "Gynecology", icon: "👩" },
    { id: "general", name: "General Medicine", icon: "🩺" },
    { id: "ophthalmology", name: "Ophthalmology", icon: "👁️" },
  ]

  const doctors = [
    {
      id: "dr1",
      name: "Dr. Sarah Wilson",
      department: "cardiology",
      specialization: "Interventional Cardiology",
      experience: "15 years",
      rating: 4.8,
      consultationFee: 800,
      nextAvailable: "Today",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "dr2",
      name: "Dr. Michael Chen",
      department: "orthopedics",
      specialization: "Joint Replacement",
      experience: "12 years",
      rating: 4.7,
      consultationFee: 1000,
      nextAvailable: "Tomorrow",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "dr3",
      name: "Dr. Priya Sharma",
      department: "dermatology",
      specialization: "Cosmetic Dermatology",
      experience: "10 years",
      rating: 4.9,
      consultationFee: 600,
      nextAvailable: "Today",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      id: "dr4",
      name: "Dr. Rajesh Kumar",
      department: "general",
      specialization: "Internal Medicine",
      experience: "20 years",
      rating: 4.6,
      consultationFee: 500,
      nextAvailable: "Today",
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  const timeSlots = [
    { time: "09:00 AM", available: true, type: "regular" },
    { time: "09:30 AM", available: false, type: "regular" },
    { time: "10:00 AM", available: true, type: "regular" },
    { time: "10:30 AM", available: true, type: "regular" },
    { time: "11:00 AM", available: false, type: "regular" },
    { time: "11:30 AM", available: true, type: "regular" },
    { time: "02:00 PM", available: true, type: "regular" },
    { time: "02:30 PM", available: true, type: "regular" },
    { time: "03:00 PM", available: false, type: "regular" },
    { time: "03:30 PM", available: true, type: "regular" },
    { time: "04:00 PM", available: true, type: "regular" },
    { time: "04:30 PM", available: true, type: "regular" },
  ]

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesDepartment = !selectedDepartment || doctor.department === selectedDepartment
    const matchesSearch = !searchDoctor || doctor.name.toLowerCase().includes(searchDoctor.toLowerCase())
    return matchesDepartment && matchesSearch
  })

  const selectedDoctorData = doctors.find((d) => d.id === selectedDoctor)

  const handleBookAppointment = () => {
    // Handle appointment booking logic
    console.log("Booking appointment:", {
      branch: selectedBranch,
      department: selectedDepartment,
      doctor: selectedDoctor,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      appointmentType: appointmentType,
    })

    // Show success message and redirect
    alert("Appointment booked successfully!")
  }

  return (
    <PrivateRoute modulePath="admin/patient-portal/appointments/book" action="view">
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
            <p className="text-gray-600">Schedule your visit with our healthcare professionals</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Step {step} of 4</Badge>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Progress Steps */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className={cn("flex items-center gap-2", step >= 1 ? "text-blue-600" : "text-gray-400")}>
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200",
                  )}
                >
                  1
                </div>
                <span className="font-medium">Select Branch & Department</span>
              </div>
              <div className={cn("flex items-center gap-2", step >= 2 ? "text-blue-600" : "text-gray-400")}>
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200",
                  )}
                >
                  2
                </div>
                <span className="font-medium">Choose Doctor</span>
              </div>
              <div className={cn("flex items-center gap-2", step >= 3 ? "text-blue-600" : "text-gray-400")}>
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200",
                  )}
                >
                  3
                </div>
                <span className="font-medium">Select Date & Time</span>
              </div>
              <div className={cn("flex items-center gap-2", step >= 4 ? "text-blue-600" : "text-gray-400")}>
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    step >= 4 ? "bg-blue-600 text-white" : "bg-gray-200",
                  )}
                >
                  4
                </div>
                <span className="font-medium">Confirm & Pay</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Branch & Department Selection */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Branch Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Select Branch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {branches.map((branch) => (
                    <div
                      key={branch.id}
                      className={cn(
                        "p-4 border rounded-lg cursor-pointer transition-colors",
                        selectedBranch === branch.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300",
                      )}
                      onClick={() => setSelectedBranch(branch.id)}
                    >
                      <h3 className="font-semibold text-gray-900">{branch.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{branch.address}</p>
                      <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                        <Phone className="h-3 w-3" />
                        {branch.phone}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Department Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-green-600" />
                  Select Department
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {departments.map((dept) => (
                    <div
                      key={dept.id}
                      className={cn(
                        "p-4 border rounded-lg cursor-pointer transition-colors text-center",
                        selectedDepartment === dept.id
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-gray-300",
                      )}
                      onClick={() => setSelectedDepartment(dept.id)}
                    >
                      <div className="text-2xl mb-2">{dept.icon}</div>
                      <h3 className="font-medium text-gray-900 text-sm">{dept.name}</h3>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedBranch || !selectedDepartment}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next: Choose Doctor
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Doctor Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-purple-600" />
                  Choose Your Doctor
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search doctors by name..."
                      value={searchDoctor}
                      onChange={(e) => setSearchDoctor(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Doctors List */}
                <div className="space-y-4">
                  {filteredDoctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className={cn(
                        "p-4 border rounded-lg cursor-pointer transition-colors",
                        selectedDoctor === doctor.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300",
                      )}
                      onClick={() => setSelectedDoctor(doctor.id)}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={doctor.image || "/placeholder.svg"}
                          alt={doctor.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                          <p className="text-sm text-gray-600">{doctor.specialization}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-gray-500">Experience: {doctor.experience}</span>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">★</span>
                              <span className="text-sm text-gray-600">{doctor.rating}</span>
                            </div>
                            <Badge variant="outline" className="text-green-600">
                              Available {doctor.nextAvailable}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">₹{doctor.consultationFee}</p>
                          <p className="text-sm text-gray-500">Consultation Fee</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)} disabled={!selectedDoctor} className="bg-blue-600 hover:bg-blue-700">
                Next: Select Date & Time
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Date & Time Selection */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                    Select Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              {/* Time Slots */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    Available Time Slots
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDate ? (
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedTimeSlot === slot.time ? "default" : "outline"}
                          disabled={!slot.available}
                          onClick={() => setSelectedTimeSlot(slot.time)}
                          className={cn(
                            "h-12",
                            selectedTimeSlot === slot.time && "bg-green-600 hover:bg-green-700",
                            !slot.available && "opacity-50 cursor-not-allowed",
                          )}
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>Please select a date first</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Appointment Type */}
            <Card>
              <CardHeader>
                <CardTitle>Appointment Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={appointmentType} onValueChange={setAppointmentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select appointment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="routine-checkup">Routine Check-up</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                onClick={() => setStep(4)}
                disabled={!selectedDate || !selectedTimeSlot || !appointmentType}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next: Confirm & Pay
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation & Payment */}
        {step === 4 && selectedDoctorData && (
          <div className="space-y-6">
            {/* Appointment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Appointment Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Doctor Details</h3>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm">
                          <strong>Name:</strong> {selectedDoctorData.name}
                        </p>
                        <p className="text-sm">
                          <strong>Department:</strong> {departments.find((d) => d.id === selectedDepartment)?.name}
                        </p>
                        <p className="text-sm">
                          <strong>Specialization:</strong> {selectedDoctorData.specialization}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">Appointment Details</h3>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm">
                          <strong>Date:</strong> {selectedDate ? format(selectedDate, "PPP") : ""}
                        </p>
                        <p className="text-sm">
                          <strong>Time:</strong> {selectedTimeSlot}
                        </p>
                        <p className="text-sm">
                          <strong>Type:</strong> {appointmentType}
                        </p>
                        <p className="text-sm">
                          <strong>Branch:</strong> {branches.find((b) => b.id === selectedBranch)?.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Consultation Fee:</span>
                      <span className="font-semibold text-lg">₹{selectedDoctorData.consultationFee}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="symptoms">Symptoms or Reason for Visit</Label>
                    <Textarea
                      id="symptoms"
                      placeholder="Briefly describe your symptoms or reason for the appointment..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="allergies">Known Allergies</Label>
                    <Input id="allergies" placeholder="List any known allergies..." className="mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  Payment Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="payment" value="online" defaultChecked />
                    <div className="flex-1">
                      <p className="font-medium">Pay Online</p>
                      <p className="text-sm text-gray-600">UPI, Credit/Debit Card, Net Banking</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Recommended</Badge>
                  </div>

                  <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="payment" value="counter" />
                    <div className="flex-1">
                      <p className="font-medium">Pay at Counter</p>
                      <p className="text-sm text-gray-600">Pay when you arrive at the hospital</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button onClick={handleBookAppointment} className="bg-green-600 hover:bg-green-700">
                <CreditCard className="h-4 w-4 mr-2" />
                Confirm & Book Appointment
              </Button>
            </div>
          </div>
        )}
      </div>
      </div>
    </PrivateRoute>
  )
}

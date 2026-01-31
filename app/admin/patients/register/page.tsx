"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, UserPlus, Mic, MicOff, Save, Printer, Send, X, Eye, Plus } from "lucide-react"
import { BillSummaryWidget } from "@/components/billing/bill-summary-widget"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { settingsApi } from '@/lib/settingsApi'

// Mock data for existing patients
const existingPatients = [
  {
    id: "P001234",
    name: "John Doe",
    phone: "+91 9876543210",
    email: "john.doe@email.com",
    age: 35,
    gender: "Male",
    lastVisit: "2024-01-15",
  },
  {
    id: "P001235",
    name: "Jane Smith",
    phone: "+91 9876543211",
    email: "jane.smith@email.com",
    age: 28,
    gender: "Female",
    lastVisit: "2024-01-20",
  },
]

// Mock services data
const availableServices = [
  { id: "S001", name: "General Consultation", price: 500, category: "Consultation" },
  { id: "S002", name: "Cardiology Consultation", price: 800, category: "Consultation" },
  { id: "S003", name: "Blood Test - Complete", price: 300, category: "Laboratory" },
  { id: "S004", name: "X-Ray Chest", price: 400, category: "Radiology" },
  { id: "S005", name: "ECG", price: 200, category: "Investigation" },
]

// Mock companies data
const companies = [
  { id: "C001", name: "ABC Insurance", type: "Insurance", discount: 20 },
  { id: "C002", name: "XYZ TPA", type: "TPA", discount: 15 },
  { id: "C003", name: "Corporate Health", type: "Corporate", discount: 10 },
]

export default function PatientRegistrationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [isNewPatient, setIsNewPatient] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const [currentField, setCurrentField] = useState("")
  const [billItems, setBillItems] = useState<any[]>([])
  const [paymentTypes, setPaymentTypes] = useState<any[]>([])

  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    salutation: "",
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    nationality: "",

    // Address
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",

    // Emergency Contact
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",

    // Medical Information
    bloodGroup: "",
    allergies: "",
    medicalHistory: "",
    currentMedications: "",

    // Consultation
    doctor: "",
    consultationFee: "",
    chiefComplaint: "",
    diagnosis: "",
    treatmentPlan: "",

    // Payment
    discount: "0",
    paymentMethod: "",
    paymentStatus: "completed",

    // MLC
    isMLCCase: false,
    mlcNumber: "",
    policeStation: "",
  })

  // Fetch payment types
  useEffect(() => {
    const fetchPaymentTypes = async () => {
      try {
        const data = await settingsApi.getPaymentTypes();
        setPaymentTypes(data);
      } catch (error) {
        console.error('Failed to fetch payment types:', error);
      }
    };
    fetchPaymentTypes();
  }, []);

  // Search patients
  useEffect(() => {
    if (searchTerm.length > 2) {
      const results = existingPatients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.phone.includes(searchTerm) ||
          patient.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchTerm])

  // Handle patient selection
  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient)
    setIsNewPatient(false)
    setFormData({
      ...formData,
      firstName: patient.name.split(" ")[0],
      lastName: patient.name.split(" ").slice(1).join(" "),
      phone: patient.phone,
      email: patient.email,
      age: patient.age.toString(),
      gender: patient.gender,
    })
    setSearchTerm("")
    setSearchResults([])
  }

  // Handle new patient
  const handleNewPatient = () => {
    setSelectedPatient(null)
    setIsNewPatient(true)
    setFormData({
      salutation: "",
      firstName: "",
      lastName: "",
      age: "",
      gender: "",
      dateOfBirth: "",
      phone: "",
      email: "",
      nationality: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      emergencyName: "",
      emergencyPhone: "",
      emergencyRelation: "",
      bloodGroup: "",
      allergies: "",
      medicalHistory: "",
      currentMedications: "",
      doctor: "",
      consultationFee: "",
      chiefComplaint: "",
      diagnosis: "",
      treatmentPlan: "",
      discount: "0",
      paymentMethod: "",
      paymentStatus: "completed",
      isMLCCase: false,
      mlcNumber: "",
      policeStation: "",
    })
    setSearchTerm("")
    setSearchResults([])

  }

  // Handle service selection
  const addServiceToBill = (service: any) => {
    const newItem = {
      id: service.id,
      name: service.name,
      price: service.price,
      quantity: 1,
      discount: 0,
      total: service.price,
      category: service.category,
    }

    const existingItem = billItems.find((item) => item.id === service.id)
    if (existingItem) {
      const updatedItems = billItems.map((item) =>
        item.id === service.id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price - item.discount }
          : item,
      )
      setBillItems(updatedItems)
    } else {
      setBillItems([...billItems, newItem])
    }
  }

  // Voice recognition simulation
  const handleVoiceInput = (field: string) => {
    setCurrentField(field)
    setIsListening(true)

    // Simulate voice recognition
    setTimeout(() => {
      const mockText = "Sample voice input text"
      setFormData({
        ...formData,
        [field]: mockText,
      })
      setIsListening(false)
      setCurrentField("")
    }, 2000)
  }

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const registerPayload = {
        patient: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          date_of_birth: formData.dateOfBirth,
          gender: formData.gender,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          emergency_contact: formData.emergencyPhone,
          blood_group: formData.bloodGroup,
          allergies: formData.allergies,
          medical_history: formData.medicalHistory
        },
        consultation: {
          doctor_id: formData.doctor,
          chief_complaint: formData.chiefComplaint,
          diagnosis: formData.diagnosis,
          treatment_plan: formData.treatmentPlan,
          consultation_fee: formData.consultationFee
        },
        bill: {
          total_amount: formData.consultationFee,
          discount_amount: formData.discount,
          net_amount: (parseFloat(formData.consultationFee || "0") - parseFloat(formData.discount || "0")).toString(),
          payment_method: formData.paymentMethod,
          payment_status: formData.paymentStatus,
          created_by: 1,
          items: [{
            item_name: 'Consultation Fee',
            unit_price: formData.consultationFee,
            total_price: formData.consultationFee
          }]
        }
      };

      const response = await fetch('http://localhost:3002/patients/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-location-id': '1',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(registerPayload)
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Patient registered successfully! Patient ID: ${result.patient_id}`);
        // Reset form
        handleNewPatient();
      } else {
        alert('Registration failed: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  }

  const handleGenerateBill = (billData: any) => {
    console.log("Generating bill:", billData)
    alert("Bill generated successfully!")
  }

  const handleSaveDraft = (draftData: any) => {
    console.log("Saving draft:", draftData)
    alert("Draft saved successfully!")
  }

  return (
    <PrivateRoute modulePath="admin/patients/register" action="view">
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Registration</h1>
          <p className="text-gray-600">Register new patients or update existing patient information</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            Save Registration
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Main Registration Form */}
        <div className="space-y-6">
          {/* Patient Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Patient Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, phone, or patient ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                      {searchResults.map((patient) => (
                        <div
                          key={patient.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b"
                          onClick={() => handlePatientSelect(patient)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{patient.name}</p>
                              <p className="text-sm text-gray-600">
                                {patient.phone} • {patient.id}
                              </p>
                            </div>
                            <Badge variant="outline">
                              {patient.gender}, {patient.age}y
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <Button onClick={handleNewPatient}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  New Patient
                </Button>
              </div>

              {selectedPatient && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-blue-900">Selected Patient: {selectedPatient.name}</h3>
                      <p className="text-sm text-blue-700">
                        ID: {selectedPatient.id} • Last Visit: {selectedPatient.lastVisit}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleNewPatient}>
                      <X className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle>{isNewPatient ? "New Patient Registration" : "Update Patient Information"}</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="medical">Medical</TabsTrigger>
                  <TabsTrigger value="consultation">Consultation Details</TabsTrigger>
                  <TabsTrigger value="payment">Payment Details</TabsTrigger>
                </TabsList>

                {/* Personal Information */}
                <TabsContent value="personal" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="salutation">Salutation</Label>
                      <Select
                        value={formData.salutation}
                        onValueChange={(value) => setFormData({ ...formData, salutation: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mr">Mr.</SelectItem>
                          <SelectItem value="mrs">Mrs.</SelectItem>
                          <SelectItem value="ms">Ms.</SelectItem>
                          <SelectItem value="dr">Dr.</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <div className="flex">
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          required
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="ml-2 bg-transparent"
                          onClick={() => handleVoiceInput("firstName")}
                        >
                          {isListening && currentField === "firstName" ? (
                            <MicOff className="h-4 w-4" />
                          ) : (
                            <Mic className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender *</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => setFormData({ ...formData, gender: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                    />
                  </div>
                </TabsContent>

                {/* Medical Information */}
                <TabsContent value="medical" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Select
                        value={formData.bloodGroup}
                        onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="a+">A+</SelectItem>
                          <SelectItem value="a-">A-</SelectItem>
                          <SelectItem value="b+">B+</SelectItem>
                          <SelectItem value="b-">B-</SelectItem>
                          <SelectItem value="ab+">AB+</SelectItem>
                          <SelectItem value="ab-">AB-</SelectItem>
                          <SelectItem value="o+">O+</SelectItem>
                          <SelectItem value="o-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="allergies">Known Allergies</Label>
                    <Textarea
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                      rows={3}
                      placeholder="List any known allergies..."
                    />
                  </div>

                  {/* MLC Section */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mlc"
                        checked={formData.isMLCCase}
                        onCheckedChange={(checked) => setFormData({ ...formData, isMLCCase: checked as boolean })}
                      />
                      <Label htmlFor="mlc" className="text-sm font-medium">
                        This is an MLC (Medico Legal Case)
                      </Label>
                    </div>

                    {formData.isMLCCase && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div>
                          <Label htmlFor="mlcNumber">MLC Number</Label>
                          <Input
                            id="mlcNumber"
                            value={formData.mlcNumber}
                            onChange={(e) => setFormData({ ...formData, mlcNumber: e.target.value })}
                            placeholder="Enter MLC number"
                          />
                        </div>
                        <div>
                          <Label htmlFor="policeStation">Police Station</Label>
                          <Input
                            id="policeStation"
                            value={formData.policeStation}
                            onChange={(e) => setFormData({ ...formData, policeStation: e.target.value })}
                            placeholder="Enter police station name"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Consultation Details */}
                <TabsContent value="consultation" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="doctor">Doctor *</Label>
                      <Select
                        value={formData.doctor || ""}
                        onValueChange={(value) => setFormData({ ...formData, doctor: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Dr. Smith - Cardiology</SelectItem>
                          <SelectItem value="2">Dr. Johnson - Pediatrics</SelectItem>
                          <SelectItem value="3">Dr. Williams - Orthopedics</SelectItem>
                          <SelectItem value="4">Dr. Brown - General Medicine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="consultationFee">Consultation Fee *</Label>
                      <Input
                        id="consultationFee"
                        type="number"
                        value={formData.consultationFee || ""}
                        onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                        placeholder="Enter fee amount"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="chiefComplaint">Chief Complaint</Label>
                    <Textarea
                      id="chiefComplaint"
                      value={formData.chiefComplaint || ""}
                      onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                      rows={3}
                      placeholder="Enter patient's main complaint..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="diagnosis">Diagnosis</Label>
                    <Textarea
                      id="diagnosis"
                      value={formData.diagnosis || ""}
                      onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                      rows={3}
                      placeholder="Enter diagnosis..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="treatmentPlan">Treatment Plan</Label>
                    <Textarea
                      id="treatmentPlan"
                      value={formData.treatmentPlan || ""}
                      onChange={(e) => setFormData({ ...formData, treatmentPlan: e.target.value })}
                      rows={3}
                      placeholder="Enter treatment plan..."
                    />
                  </div>
                </TabsContent>

                {/* Payment Details */}
                <TabsContent value="payment" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="totalAmount">Total Amount</Label>
                      <Input
                        id="totalAmount"
                        type="number"
                        value={formData.consultationFee || "0"}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="discount">Discount</Label>
                      <Input
                        id="discount"
                        type="number"
                        value={formData.discount || "0"}
                        onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="netAmount">Net Amount</Label>
                      <Input
                        id="netAmount"
                        type="number"
                        value={(parseFloat(formData.consultationFee || "0") - parseFloat(formData.discount || "0")).toString()}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="paymentMethod">Payment Method *</Label>
                      <Select
                        value={formData.paymentMethod || ""}
                        onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentTypes.map((type) => (
                            <SelectItem key={type.id} value={type.code || type.name.toLowerCase()}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="paymentStatus">Payment Status</Label>
                      <Select
                        value={formData.paymentStatus || "completed"}
                        onValueChange={(value) => setFormData({ ...formData, paymentStatus: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="partial">Partial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>


      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button variant="outline">
          <Send className="h-4 w-4 mr-2" />
          Send to Queue
        </Button>
        <Button onClick={handleSubmit}>
          <Save className="h-4 w-4 mr-2" />
          Complete Registration
        </Button>
      </div>
      </div>
    </PrivateRoute>
  )
}

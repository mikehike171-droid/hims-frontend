"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { User, Bed, CheckCircle, CalendarIcon, Shield, Stethoscope, CreditCard } from "lucide-react"
import { format } from "date-fns"

interface NewAdmissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type AdmissionStep = "patient" | "medical" | "bed" | "payment" | "complete"

export function NewAdmissionDialog({ open, onOpenChange }: NewAdmissionDialogProps) {
  const [currentStep, setCurrentStep] = useState<AdmissionStep>("patient")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTPA, setSelectedTPA] = useState("")
  const [selectedInsurance, setSelectedInsurance] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [primaryDoctor, setPrimaryDoctor] = useState("")
  const [secondaryDoctor, setSecondaryDoctor] = useState("")
  const [gipsaType, setGipsaType] = useState("")
  const [customerType, setCustomerType] = useState("cash")
  const [selectedBed, setSelectedBed] = useState("")
  const [customDiscount, setCustomDiscount] = useState(0)
  const [companyDiscount, setCompanyDiscount] = useState(0)

  // Master data
  const tpaList = [
    { id: "1", name: "Medi Assist", code: "MA001" },
    { id: "2", name: "Vidal Health", code: "VH002" },
    { id: "3", name: "Paramount Health", code: "PH003" },
    { id: "4", name: "Good Health", code: "GH004" },
  ]

  const insuranceList = [
    { id: "1", name: "Star Health Insurance", code: "SHI001" },
    { id: "2", name: "HDFC ERGO", code: "HE002" },
    { id: "3", name: "ICICI Lombard", code: "IL003" },
    { id: "4", name: "New India Assurance", code: "NIA004" },
  ]

  const companies = [
    { id: "1", name: "TCS Limited", discount: 15, type: "corporate" },
    { id: "2", name: "Infosys Limited", discount: 12, type: "corporate" },
    { id: "3", name: "Wipro Technologies", discount: 10, type: "corporate" },
    { id: "4", name: "Government Employee", discount: 20, type: "government" },
  ]

  const departments = [
    { id: "1", name: "Cardiology", code: "CARD" },
    { id: "2", name: "Orthopedics", code: "ORTHO" },
    { id: "3", name: "General Medicine", code: "GM" },
    { id: "4", name: "Pediatrics", code: "PED" },
    { id: "5", name: "Emergency", code: "ER" },
    { id: "6", name: "ICU", code: "ICU" },
  ]

  const doctors = [
    { id: "1", name: "Dr. Rajesh Kumar", department: "1", specialization: "Cardiology" },
    { id: "2", name: "Dr. Priya Sharma", department: "2", specialization: "Orthopedics" },
    { id: "3", name: "Dr. Amit Singh", department: "3", specialization: "General Medicine" },
    { id: "4", name: "Dr. Sunita Patel", department: "4", specialization: "Pediatrics" },
    { id: "5", name: "Dr. Michael Chen", department: "6", specialization: "Critical Care" },
  ]

  const bedTypes = [
    {
      id: "1",
      name: "General Ward",
      category: "Standard",
      cashPrice: 1500,
      insurancePrice: 2000,
      sharing: "4-bed sharing",
      amenities: ["Basic bed", "Shared bathroom", "Visitor chair"],
    },
    {
      id: "2",
      name: "Semi-Private",
      category: "Premium",
      cashPrice: 3000,
      insurancePrice: 3500,
      sharing: "2-bed sharing",
      amenities: ["Comfortable bed", "Shared bathroom", "TV", "Visitor sofa"],
    },
    {
      id: "3",
      name: "Private Room",
      category: "Deluxe",
      cashPrice: 5000,
      insurancePrice: 6000,
      sharing: "Single occupancy",
      amenities: ["Premium bed", "Private bathroom", "TV", "Refrigerator", "Visitor bed"],
    },
    {
      id: "4",
      name: "ICU Bed",
      category: "Critical",
      cashPrice: 8000,
      insurancePrice: 10000,
      sharing: "Single occupancy",
      amenities: ["ICU bed", "Ventilator support", "24/7 monitoring", "Specialized equipment"],
    },
    {
      id: "5",
      name: "Suite",
      category: "Luxury",
      cashPrice: 12000,
      insurancePrice: 15000,
      sharing: "Single occupancy",
      amenities: ["Luxury bed", "Private bathroom", "Living area", "Kitchenette", "Attendant bed"],
    },
  ]

  const availableBeds = [
    { id: "101A", type: "1", ward: "General Ward A", room: "101", bed: "A", status: "available" },
    { id: "102B", type: "2", ward: "Semi-Private Wing", room: "102", bed: "B", status: "available" },
    { id: "201A", type: "3", ward: "Private Wing", room: "201", bed: "A", status: "available" },
    { id: "301A", type: "4", ward: "ICU", room: "301", bed: "A", status: "available" },
    { id: "401A", type: "5", ward: "VIP Suite", room: "401", bed: "A", status: "available" },
  ]

  const getStepIcon = (step: AdmissionStep) => {
    switch (step) {
      case "patient":
        return <User className="h-5 w-5" />
      case "medical":
        return <Stethoscope className="h-5 w-5" />
      case "bed":
        return <Bed className="h-5 w-5" />
      case "payment":
        return <CreditCard className="h-5 w-5" />
      case "complete":
        return <CheckCircle className="h-5 w-5" />
    }
  }

  const steps = [
    { key: "patient", label: "Patient Details", completed: currentStep !== "patient" },
    { key: "medical", label: "Medical Info", completed: ["bed", "payment", "complete"].includes(currentStep) },
    { key: "bed", label: "Bed Selection", completed: ["payment", "complete"].includes(currentStep) },
    { key: "payment", label: "Payment", completed: currentStep === "complete" },
    { key: "complete", label: "Complete", completed: false },
  ]

  const calculateBedPrice = () => {
    const bedType = bedTypes.find((b) => b.id === selectedBed)
    if (!bedType) return 0

    const basePrice = customerType === "cash" ? bedType.cashPrice : bedType.insurancePrice
    const companyDiscountAmount = (basePrice * companyDiscount) / 100
    const customDiscountAmount = customDiscount

    return Math.max(0, basePrice - companyDiscountAmount - customDiscountAmount)
  }

  const resetDialog = () => {
    setCurrentStep("patient")
    setSelectedTPA("")
    setSelectedInsurance("")
    setSelectedCompany("")
    setSelectedDepartment("")
    setPrimaryDoctor("")
    setSecondaryDoctor("")
    setGipsaType("")
    setCustomerType("cash")
    setSelectedBed("")
    setCustomDiscount(0)
    setCompanyDiscount(0)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) resetDialog()
      }}
    >
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            New Patient Admission
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.key} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : currentStep === step.key
                        ? "bg-red-500 border-red-500 text-white"
                        : "border-gray-300 text-gray-500"
                  }`}
                >
                  {step.completed ? <CheckCircle className="h-5 w-5" /> : getStepIcon(step.key as AdmissionStep)}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    step.completed || currentStep === step.key ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${step.completed ? "bg-green-500" : "bg-gray-300"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Patient Details Step */}
        {currentStep === "patient" && (
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" placeholder="Enter first name" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter last name" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" placeholder="+91-XXXXXXXXXX" required />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter email" />
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select>
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
                    <Label htmlFor="aadhar">Aadhar Number *</Label>
                    <Input id="aadhar" placeholder="XXXX-XXXX-XXXX" required />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insurance & Company Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-blue-600" />
                  Insurance & Company Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="customerType">Customer Type *</Label>
                    <Select value={customerType} onValueChange={setCustomerType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash Customer</SelectItem>
                        <SelectItem value="insurance">Insurance Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tpa">TPA</Label>
                    <Select value={selectedTPA} onValueChange={setSelectedTPA}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select TPA" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No TPA</SelectItem>
                        {tpaList.map((tpa) => (
                          <SelectItem key={tpa.id} value={tpa.id}>
                            {tpa.name} ({tpa.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="insurance">Insurance</Label>
                    <Select value={selectedInsurance} onValueChange={setSelectedInsurance}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select insurance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Insurance</SelectItem>
                        {insuranceList.map((insurance) => (
                          <SelectItem key={insurance.id} value={insurance.id}>
                            {insurance.name} ({insurance.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Select
                      value={selectedCompany}
                      onValueChange={(value) => {
                        setSelectedCompany(value)
                        const company = companies.find((c) => c.id === value)
                        setCompanyDiscount(company?.discount || 0)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Company</SelectItem>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.name} ({company.discount}% discount)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="companyDiscount">Company Discount (%)</Label>
                    <Input
                      id="companyDiscount"
                      type="number"
                      value={companyDiscount}
                      onChange={(e) => setCompanyDiscount(Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customDiscount">Custom Discount (₹)</Label>
                    <Input
                      id="customDiscount"
                      type="number"
                      value={customDiscount}
                      onChange={(e) => setCustomDiscount(Number(e.target.value))}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gipsa">GIPSA Type</Label>
                    <Select value={gipsaType} onValueChange={setGipsaType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select GIPSA type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gipsa">GIPSA</SelectItem>
                        <SelectItem value="non-gipsa">Non GIPSA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="policyNumber">Policy Number</Label>
                    <Input id="policyNumber" placeholder="Enter policy number" />
                  </div>
                  <div>
                    <Label htmlFor="policyAmount">Policy Amount</Label>
                    <Input id="policyAmount" type="number" placeholder="Enter policy amount" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Complete Address</Label>
                    <Textarea id="address" placeholder="Enter complete address" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="Enter city" />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input id="state" placeholder="Enter state" />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input id="pincode" placeholder="Enter pincode" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="emergencyName">Contact Name</Label>
                    <Input id="emergencyName" placeholder="Enter contact name" />
                  </div>
                  <div>
                    <Label htmlFor="emergencyPhone">Contact Phone</Label>
                    <Input id="emergencyPhone" placeholder="+91-XXXXXXXXXX" />
                  </div>
                  <div>
                    <Label htmlFor="relationship">Relationship</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setCurrentStep("medical")} className="bg-red-600 hover:bg-red-700">
                Next: Medical Information
              </Button>
            </div>
          </div>
        )}

        {/* Medical Information Step */}
        {currentStep === "medical" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Stethoscope className="h-5 w-5 mr-2 text-red-600" />
                Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Department *</Label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name} ({dept.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Admission Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Primary Doctor *</Label>
                    <Select value={primaryDoctor} onValueChange={setPrimaryDoctor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select primary doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors
                          .filter((doctor) => !selectedDepartment || doctor.department === selectedDepartment)
                          .map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              {doctor.name} - {doctor.specialization}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Secondary Doctor</Label>
                    <Select value={secondaryDoctor} onValueChange={setSecondaryDoctor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select secondary doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Secondary Doctor</SelectItem>
                        {doctors
                          .filter((doctor) => doctor.id !== primaryDoctor)
                          .map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              {doctor.name} - {doctor.specialization}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Chief Complaint</Label>
                    <Textarea placeholder="Enter patient's main complaint" />
                  </div>
                  <div>
                    <Label>Provisional Diagnosis</Label>
                    <Textarea placeholder="Enter provisional diagnosis" />
                  </div>
                </div>

                <div>
                  <Label>Medical History</Label>
                  <Textarea placeholder="Enter relevant medical history" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Allergies</Label>
                    <Textarea placeholder="Enter known allergies" />
                  </div>
                  <div>
                    <Label>Current Medications</Label>
                    <Textarea placeholder="Enter current medications" />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setCurrentStep("patient")}>
                    Back
                  </Button>
                  <Button onClick={() => setCurrentStep("bed")} className="bg-red-600 hover:bg-red-700">
                    Next: Bed Selection
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bed Selection Step */}
        {currentStep === "bed" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bed className="h-5 w-5 mr-2 text-red-600" />
                Bed Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bedTypes.map((bedType) => {
                    const price = customerType === "cash" ? bedType.cashPrice : bedType.insurancePrice
                    const finalPrice = calculateBedPrice()
                    const isSelected = selectedBed === bedType.id

                    return (
                      <div
                        key={bedType.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          isSelected ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedBed(bedType.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{bedType.name}</h3>
                          <Badge variant={isSelected ? "default" : "secondary"}>{bedType.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{bedType.sharing}</p>
                        <div className="space-y-1 mb-3">
                          <div className="flex justify-between text-sm">
                            <span>Base Price:</span>
                            <span>₹{price.toLocaleString()}/day</span>
                          </div>
                          {companyDiscount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                              <span>Company Discount:</span>
                              <span>-{companyDiscount}%</span>
                            </div>
                          )}
                          {customDiscount > 0 && (
                            <div className="flex justify-between text-sm text-blue-600">
                              <span>Custom Discount:</span>
                              <span>-₹{customDiscount}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-semibold">
                            <span>Final Price:</span>
                            <span>₹{finalPrice.toLocaleString()}/day</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          <p className="font-medium mb-1">Amenities:</p>
                          <ul className="list-disc list-inside space-y-0.5">
                            {bedType.amenities.map((amenity, index) => (
                              <li key={index}>{amenity}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {selectedBed && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Available Beds</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableBeds
                        .filter((bed) => bed.type === selectedBed)
                        .map((bed) => (
                          <div key={bed.id} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{bed.ward}</span>
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                Available
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              Room {bed.room}, Bed {bed.bed}
                            </p>
                            <Button size="sm" className="w-full mt-2 bg-red-600 hover:bg-red-700">
                              Select This Bed
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setCurrentStep("medical")}>
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep("payment")}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={!selectedBed}
                  >
                    Next: Payment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Step */}
        {currentStep === "payment" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-red-600" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Admission Charges</h3>
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between">
                        <span>Bed Charges (per day):</span>
                        <span>₹{calculateBedPrice().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Registration Fee:</span>
                        <span>₹500</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Advance Deposit:</span>
                        <span>₹10,000</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total Amount:</span>
                        <span>₹{(calculateBedPrice() + 500 + 10000).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                    <div className="space-y-4">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="card">Credit/Debit Card</SelectItem>
                          <SelectItem value="upi">UPI</SelectItem>
                          <SelectItem value="insurance">Insurance</SelectItem>
                          <SelectItem value="cheque">Cheque</SelectItem>
                        </SelectContent>
                      </Select>

                      <div>
                        <Label htmlFor="remarks">Payment Remarks</Label>
                        <Textarea id="remarks" placeholder="Enter any payment remarks" />
                      </div>

                      <Button
                        onClick={() => setCurrentStep("complete")}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Process Admission
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Complete Step */}
        {currentStep === "complete" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                Admission Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-6">
                <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800">Patient Successfully Admitted!</h3>
                  <p className="text-green-600">IP Number: IP001238</p>
                  <p className="text-green-600">
                    Bed: {availableBeds.find((b) => b.type === selectedBed)?.ward} - Room 101A
                  </p>
                  <p className="text-green-600">Admission Date: {format(selectedDate, "PPP")}</p>
                </div>

                <div className="flex justify-center gap-4">
                  <Button variant="outline">Print Admission Form</Button>
                  <Button className="bg-green-600 hover:bg-green-700">Send to WhatsApp</Button>
                </div>

                <Button onClick={() => setCurrentStep("patient")} className="bg-red-600 hover:bg-red-700">
                  Admit New Patient
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  )
}

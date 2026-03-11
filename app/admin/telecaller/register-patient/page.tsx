"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function RegisterPatient() {
  const router = useRouter()
  const [familyMembers, setFamilyMembers] = useState([])
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    dob: "",
    gender: "",
    aadhar: "",
    company: "",
    address: "",
    emergencyName: "",
    emergencyPhone: "",
    relationship: "",
    insurance: "",
    referrer: "",
  })

  const companies = [
    { id: "1", name: "TCS Limited", discount: 15 },
    { id: "2", name: "Infosys Limited", discount: 12 },
    { id: "3", name: "Wipro Technologies", discount: 10 },
    { id: "4", name: "HCL Technologies", discount: 8 },
    { id: "5", name: "Tech Mahindra", discount: 10 },
    { id: "6", name: "Cognizant Technology Solutions", discount: 12 },
    { id: "7", name: "Accenture India", discount: 15 },
    { id: "8", name: "IBM India", discount: 10 },
  ]

  const handlePhoneSearch = (phone: string) => {
    // Simulate family member lookup
    if (phone === "+91-9876543210") {
      setFamilyMembers([
        { id: "P001234", name: "John Doe", relation: "Self" },
        { id: "P001235", name: "Jane Doe", relation: "Spouse" },
        { id: "P001236", name: "Jimmy Doe", relation: "Son" },
      ])
    } else {
      setFamilyMembers([])
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (field === "phone") {
      handlePhoneSearch(value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.firstName || !formData.phone || !formData.aadhar) {
      toast.error("Please fill all required fields")
      return
    }

    // Simulate API call
    toast.success("Patient registered successfully!")

    // Navigate to booking with new patient
    router.push(
      `/telecaller/book-appointment?newPatient=true&patientData=${encodeURIComponent(JSON.stringify(formData))}`,
    )
  }

  return (
    <PrivateRoute modulePath="admin/telecaller/register-patient" action="view">
      <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Register New Patient</h1>
            <p className="text-muted-foreground">Register a new patient and proceed to appointment booking</p>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-red-600" />
            Patient Registration Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="+91-XXXXXXXXXX"
                  required
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
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
                <Input
                  id="aadhar"
                  placeholder="XXXX-XXXX-XXXX"
                  required
                  value={formData.aadhar}
                  onChange={(e) => handleInputChange("aadhar", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="company">Company Name</Label>
                <Select value={formData.company} onValueChange={(value) => handleInputChange("company", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Search and select company" />
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
            </div>

            {/* Family Members Popup */}
            {familyMembers.length > 0 && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-800 text-lg">Family Members Found</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {familyMembers.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-2 bg-white rounded">
                        <span>
                          {member.name} ({member.relation})
                        </span>
                        <Badge variant="outline">{member.id}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Address */}
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Enter complete address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>

            {/* Emergency Contact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="emergencyName">Emergency Contact Name</Label>
                <Input
                  id="emergencyName"
                  placeholder="Enter contact name"
                  value={formData.emergencyName}
                  onChange={(e) => handleInputChange("emergencyName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                <Input
                  id="emergencyPhone"
                  placeholder="+91-XXXXXXXXXX"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="relationship">Relationship</Label>
                <Select
                  value={formData.relationship}
                  onValueChange={(value) => handleInputChange("relationship", value)}
                >
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

            {/* Insurance & Company Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="insurance">Insurance Provider</Label>
                <Select value={formData.insurance} onValueChange={(value) => handleInputChange("insurance", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select insurance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Insurance</SelectItem>
                    <SelectItem value="hdfc">HDFC ERGO</SelectItem>
                    <SelectItem value="icici">ICICI Lombard</SelectItem>
                    <SelectItem value="star">Star Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="referrer">Referrer Doctor</Label>
                <Select value={formData.referrer} onValueChange={(value) => handleInputChange("referrer", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select referring doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dr-smith">Dr. Smith - Cardiology</SelectItem>
                    <SelectItem value="dr-jones">Dr. Jones - Orthopedics</SelectItem>
                    <SelectItem value="dr-brown">Dr. Brown - General Medicine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="bg-red-600 hover:bg-red-700">
                <Plus className="mr-2 h-4 w-4" />
                Register & Book Appointment
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </PrivateRoute>
  )
}

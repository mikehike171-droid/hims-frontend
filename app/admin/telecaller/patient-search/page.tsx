"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Users, Phone, Calendar, MapPin, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function PatientSearch() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showNewPatientDialog, setShowNewPatientDialog] = useState(false)

  const existingPatients = [
    {
      id: "P001234",
      name: "John Doe",
      phone: "+91-9876543210",
      age: 35,
      lastVisit: "2024-01-15",
      familyPhone: "+91-9876543210",
      aadhar: "1234-5678-9012",
      company: "TCS Limited",
      address: "123 Main Street, Mumbai",
      email: "john.doe@tcs.com",
    },
    {
      id: "P001235",
      name: "Jane Doe",
      phone: "+91-9876543211",
      age: 32,
      lastVisit: "2024-01-10",
      familyPhone: "+91-9876543210",
      aadhar: "2345-6789-0123",
      company: "Infosys Limited",
      address: "456 Park Avenue, Mumbai",
      email: "jane.doe@infosys.com",
    },
    {
      id: "P001236",
      name: "Rajesh Kumar",
      phone: "+91-9876543212",
      age: 45,
      lastVisit: "2024-01-12",
      familyPhone: "+91-9876543212",
      aadhar: "3456-7890-1234",
      company: "Wipro Technologies",
      address: "789 Business District, Pune",
      email: "rajesh.kumar@wipro.com",
    },
  ]

  const filteredPatients = existingPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.id.includes(searchTerm) ||
      patient.aadhar.includes(searchTerm) ||
      patient.company.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient)
    // Navigate to booking with selected patient
    router.push(`/telecaller/book-appointment?patientId=${patient.id}`)
  }

  const handleNewPatient = () => {
    router.push("/telecaller/register-patient")
  }

  return (
    <PrivateRoute modulePath="admin/telecaller/patient-search" action="view">
      <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Search Patient</h1>
            <p className="text-muted-foreground">
              Search existing patients or register new ones for appointment booking
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleNewPatient}>
            <Plus className="mr-2 h-4 w-4" />
            Register New Patient
          </Button>
        </div>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, Patient ID, Aadhar, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Search Results */}
          <div className="space-y-3">
            {searchTerm && (
              <>
                <div className="text-sm text-muted-foreground mb-3">{filteredPatients.length} patient(s) found</div>
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handlePatientSelect(patient)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <h3 className="font-semibold text-lg">{patient.name}</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mt-1">
                              <p className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                ID: {patient.id}
                              </p>
                              <p className="flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {patient.phone}
                              </p>
                              <p>Aadhar: {patient.aadhar}</p>
                              <p>Company: {patient.company}</p>
                              <p className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {patient.address}
                              </p>
                              <p className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Last Visit: {patient.lastVisit}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">Age: {patient.age}</Badge>
                        <Button className="mt-2 bg-red-600 hover:bg-red-700 text-white">Select & Book</Button>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredPatients.length === 0 && searchTerm && (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground mb-4">No patients found matching your search criteria</div>
                    <Button onClick={handleNewPatient}>
                      <Plus className="mr-2 h-4 w-4" />
                      Register New Patient
                    </Button>
                  </div>
                )}
              </>
            )}
            {!searchTerm && (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Start typing to search for existing patients</p>
                <p className="text-sm mt-2">Search by name, phone number, Patient ID, Aadhar, or company</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">+12 new this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">8 pending confirmations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Follow-ups Due</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">5 overdue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹15,240</div>
            <p className="text-xs text-muted-foreground">12 patients</p>
          </CardContent>
        </Card>
      </div>
      </div>
    </PrivateRoute>
  )
}

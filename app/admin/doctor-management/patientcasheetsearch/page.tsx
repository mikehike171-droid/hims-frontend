"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, User, Phone, Calendar, Plus, Loader2, FileText } from "lucide-react"
import Link from "next/link"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { useBranch } from "@/contexts/branch-context"

export default function PatientCasheetSearchPage() {
  const { selectedBranch } = useBranch()
  const [searchQuery, setSearchQuery] = useState("")
  const [patients, setPatients] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    try {
      const token = localStorage.getItem('authToken')
      const locationId = selectedBranch?.id
      
      const params = new URLSearchParams()
      if (locationId) params.append('locationId', locationId.toString())
      params.append('search', searchQuery)
      params.append('page', '1')
      params.append('limit', '50')
      
      const url = `${authService.getSettingsApiUrl()}/patients?${params}`
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        const data = result.data || result
        
        const formattedPatients = data.map((patient: any) => ({
          id: patient.patient_id,
          patientId: patient.patient_patient_id,
          name: `${patient.patient_first_name} ${patient.patient_last_name}`,
          mobile: patient.patient_mobile,
          gender: patient.patient_gender ? (patient.patient_gender.toLowerCase() === 'm' ? 'Male' : patient.patient_gender.toLowerCase() === 'f' ? 'Female' : 'Other') : 'N/A',
          age: patient.patient_date_of_birth ? calculateAge(patient.patient_date_of_birth) : "N/A",
          location_name: patient.location_name
        }))
        
        setPatients(formattedPatients)
      }
    } catch (error) {
      console.error("Patient search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const calculateAge = (dob: string) => {
    if (!dob) return "N/A"
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age.toString()
  }

  const maskMobile = (mobile: string) => {
    if (!mobile) return 'N/A'
    if (mobile.length <= 4) return mobile
    const last4 = mobile.slice(-4)
    return 'XXXXXX' + last4
  }

  return (
    <PrivateRoute modulePath="admin/doctor-management" action="view">
      <div className="min-h-screen bg-slate-50/50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Search Card */}
          <Card className="border-none shadow-sm bg-white/80 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="search" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Search className="w-4 h-4 text-blue-500" />
                    Patient Search
                  </Label>
                  <div className="relative">
                    <Input
                      id="search"
                      placeholder="Search by Name, Mobile Number, or Patient ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      className="bg-white border-slate-200 pr-10 h-11"
                    />
                    {isSearching && (
                      <Loader2 className="w-4 h-4 animate-spin absolute right-3 top-3.5 text-slate-400" />
                    )}
                  </div>
                </div>

                <Button 
                  onClick={handleSearch} 
                  disabled={isSearching}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 transition-all h-11 px-8"
                >
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Table Section */}
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                Patient Records
                {patients.length > 0 && (
                  <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-blue-100">
                    {patients.length} found
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead className="w-[150px] font-bold text-slate-700">Patient ID</TableHead>
                      <TableHead className="font-bold text-slate-700">Patient Name</TableHead>
                      <TableHead className="font-bold text-slate-700">Mobile</TableHead>
                      <TableHead className="font-bold text-slate-700">Gender</TableHead>
                      <TableHead className="font-bold text-slate-700">Age</TableHead>
                      <TableHead className="font-bold text-slate-700">Location</TableHead>
                      <TableHead className="text-center font-bold text-slate-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patients.length > 0 ? (
                      patients.map((patient) => (
                        <TableRow key={patient.id} className="hover:bg-blue-50/30 transition-colors group">
                          <TableCell className="font-medium text-blue-600">
                            {patient.patientId || "N/A"}
                          </TableCell>
                          <TableCell className="font-semibold text-slate-900">
                            {patient.name}
                          </TableCell>
                          <TableCell className="text-slate-600 font-mono">
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              {maskMobile(patient.mobile)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                              {patient.gender}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {patient.age !== "N/A" ? `${patient.age} Y` : "N/A"}
                          </TableCell>
                          <TableCell className="text-slate-500">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {patient.location_name || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Link href={`/admin/caseheetnew?patientId=${patient.id}`}>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-9 w-9 p-0 bg-white hover:bg-blue-600 text-blue-600 hover:text-white border-blue-200 hover:border-blue-600 shadow-sm transition-all"
                                title="Open Patient Casheet"
                              >
                                <FileText className="w-5 h-5" />
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-64 text-center">
                          {!searchQuery ? (
                            <div className="flex flex-col items-center justify-center text-slate-400 space-y-3">
                              <Search className="w-12 h-12 opacity-20" />
                              <p className="text-lg font-medium opacity-50">Enter search details to find a patient</p>
                            </div>
                          ) : isSearching ? (
                            <div className="flex flex-col items-center justify-center space-y-3">
                              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                              <p className="text-slate-500">Searching records...</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center space-y-3">
                              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                                <User className="w-8 h-8 text-slate-400" />
                              </div>
                              <div className="text-center">
                                <p className="text-slate-900 font-medium text-lg">No patients found</p>
                                <p className="text-slate-500 text-sm">Try adjusting your search criteria or location</p>
                              </div>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PrivateRoute>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Calendar, 
  Receipt,
  Users,
  Filter,
  DollarSign,
  FileText
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import PrivateRoute from "@/components/auth/PrivateRoute"
import authService from "@/lib/authService"



export default function PatientListPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [patients, setPatients] = useState<any[]>([])
  const [filteredPatients, setFilteredPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBranchId, setSelectedBranchId] = useState(authService.getSelectedBranchId())
  const router = useRouter()
  const fetchingRef = useRef(false)

  const handleCaseSheetClick = (patientId: string) => {
    router.push(`/admin/caseheetnew?patientId=${patientId}`)
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  useEffect(() => {
    const handleBranchChange = () => {
      const currentBranchId = authService.getSelectedBranchId()
      if (currentBranchId !== selectedBranchId) {
        setSelectedBranchId(currentBranchId)
        fetchPatients()
      }
    }

    window.addEventListener('branchChanged', handleBranchChange)
    return () => {
      window.removeEventListener('branchChanged', handleBranchChange)
    }
  }, [selectedBranchId])

  const fetchPatients = async () => {
    if (fetchingRef.current) return
    
    try {
      fetchingRef.current = true
      const token = localStorage.getItem('authToken')
      const selectedBranchId = authService.getSelectedBranchId()
      const locationId = selectedBranchId ? parseInt(selectedBranchId) : undefined
      
      const url = locationId 
        ? `${authService.getSettingsApiUrl()}/patients?locationId=${locationId}`
        : `${authService.getSettingsApiUrl()}/patients`
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        const formattedPatients = data.map((patient: any) => {
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

          return {
            id: patient.id,
            patientId: patient.patient_id,
            name: `${patient.first_name} ${patient.last_name}`,
            mobile: patient.mobile || patient.phone,
            dob: patient.date_of_birth,
            age: `${calculateAge(patient.date_of_birth)} Years`,
            gender: patient.gender.toLowerCase() === 'm' ? 'Male' : patient.gender.toLowerCase() === 'f' ? 'Female' : 'Other',
            lastVisit: patient.updated_at,
            status: 'Active'
          }
        })
        setPatients(formattedPatients)
        setFilteredPatients(formattedPatients)
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(value.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(value.toLowerCase()) ||
      patient.mobile.includes(value)
    )
    setFilteredPatients(filtered)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    })
  }

  return (
    <PrivateRoute modulePath="admin/front-office/patients" action="view">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient List</h1>
            <p className="text-gray-600">Manage and view all registered patients</p>
          </div>
          <Link href="/admin/front-office/registration">
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              New Patient
            </Button>
          </Link>
        </div>

        {/* Search and Filter Section */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by Patient ID, Name, or Mobile..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Patient Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-2xl font-bold">{patients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Patients</p>
                  <p className="text-2xl font-bold">{patients.filter(p => p.status === 'Active').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Male Patients</p>
                  <p className="text-2xl font-bold">{patients.filter(p => p.gender === 'Male').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-pink-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Female Patients</p>
                  <p className="text-2xl font-bold">{patients.filter(p => p.gender === 'Female').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient List Table */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="text-center py-8">Loading patients...</div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>DOB</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-blue-600">
                        {patient.patientId}
                      </TableCell>
                      <TableCell className="font-medium">
                        {patient.name}
                      </TableCell>
                      <TableCell>{patient.mobile}</TableCell>
                      <TableCell>{formatDate(patient.dob)}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>
                        <Badge variant={patient.gender === 'Male' ? 'default' : 'secondary'}>
                          {patient.gender}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(patient.lastVisit)}</TableCell>
                      <TableCell>
                        <Badge variant={patient.status === 'Active' ? 'default' : 'secondary'}>
                          {patient.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="View Patient"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Edit Patient"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Link href={`/admin/front-office/appointments/book?patientId=${patient.patientId}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Book Appointment"
                            >
                              <Calendar className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/front-office/consultation?patientId=${patient.patientId}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Consultation Fee"
                            >
                              <DollarSign className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="View Bills"
                          >
                            <Receipt className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            title="Case Sheet"
                            onClick={() => handleCaseSheetClick(patient.id)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              )}
            </div>
            
            {!loading && filteredPatients.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No patients found matching your search criteria
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  )
}
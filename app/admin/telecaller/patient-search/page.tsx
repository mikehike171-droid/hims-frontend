"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Search, Plus, Users, Phone, Calendar as CalendarIcon, MapPin, ArrowLeft, Edit, DollarSign, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import PrivateRoute from "@/components/auth/PrivateRoute"
import authService from "@/lib/authService"

export default function PatientSearch() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize] = useState(10)
  const [totalRecords, setTotalRecords] = useState(0)

  useEffect(() => {
    if (searchTerm) {
      fetchPatients()
    }
  }, [currentPage])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')

      const params = new URLSearchParams()
      params.append('page', currentPage.toString())
      params.append('limit', pageSize.toString())
      if (searchTerm) params.append('search', searchTerm)

      const locationId = authService.getLocationId() || authService.getSelectedBranchId()
      if (locationId) {
        params.append('locationId', locationId)
      }

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

        const formattedPatients = data.map((patient: any) => {
          const calculateAge = (dob: string) => {
            if (!dob) return '0 Y 0 M 0 D'
            const today = new Date()
            const birthDate = new Date(dob)

            let ageYears = today.getFullYear() - birthDate.getFullYear()
            let ageMonths = today.getMonth() - birthDate.getMonth()
            let ageDays = today.getDate() - birthDate.getDate()

            if (ageDays < 0) {
              ageMonths--
              ageDays += new Date(today.getFullYear(), today.getMonth(), 0).getDate()
            }

            if (ageMonths < 0) {
              ageYears--
              ageMonths += 12
            }

            return `${ageYears} Y ${ageMonths} M ${ageDays} D`
          }

          return {
            id: patient.patient_id,
            patientId: patient.patient_patient_id,
            name: `${patient.patient_first_name} ${patient.patient_last_name}`,
            mobile: patient.patient_mobile,
            dob: patient.patient_date_of_birth,
            age: calculateAge(patient.patient_date_of_birth),
            gender: patient.patient_gender ? (patient.patient_gender.toLowerCase() === 'm' ? 'Male' : patient.patient_gender.toLowerCase() === 'f' ? 'Female' : 'Other') : 'N/A',
            lastVisit: patient.patient_updated_at,
            status: 'Active',
            nextRenewalDate: patient.next_renewal_date_pro,
            dueAmount: patient.due_amount
          }
        })
        setPatients(formattedPatients)

        if (result.total !== undefined) {
          setTotalRecords(result.total)
          setTotalPages(result.totalPages || Math.ceil(result.total / pageSize))
        } else {
          setTotalRecords(formattedPatients.length)
          setTotalPages(Math.ceil(formattedPatients.length / pageSize))
        }
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchPatients()
  }

  const maskMobile = (mobile: string) => {
    if (!mobile) return 'N/A'
    if (mobile.length <= 4) return mobile
    const last4 = mobile.slice(-4)
    return 'XXXXXX' + last4
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
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
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Search Patient</h1>
              <p className="text-gray-600">
                Search existing patients or register new ones for appointment booking
              </p>
            </div>
          </div>
          <Link href="/admin/front-office/registration">
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="mr-2 h-4 w-4" />
              Register New Patient
            </Button>
          </Link>
        </div>

        {/* Search Section */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-end gap-4">
              <div className="flex-1 space-y-2">
                <Label>Patient Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by Patient ID (MR Number), Name, or Mobile..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="px-8"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results Table */}
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
                      <TableHead>Next Renewal Date</TableHead>
                      <TableHead>Due Amount</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patients.map((patient) => (
                      <TableRow key={patient.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-blue-600">
                          {patient.patientId}
                        </TableCell>
                        <TableCell className="font-medium">
                          {patient.name}
                        </TableCell>
                        <TableCell>{maskMobile(patient.mobile)}</TableCell>
                        <TableCell>
                          {patient.nextRenewalDate ? (
                            <span className="font-medium text-orange-600">
                              {formatDate(patient.nextRenewalDate)}
                            </span>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {patient.dueAmount ? (
                            <span className="font-bold text-red-600">
                              ₹{Number(patient.dueAmount).toLocaleString('en-IN')}
                            </span>
                          ) : (
                            <span className="text-gray-400">₹0</span>
                          )}
                        </TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>
                          <Badge variant={patient.gender === 'Male' ? 'default' : 'secondary'}>
                            {patient.gender}
                          </Badge>
                        </TableCell>
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
                              title="Edit Patient"
                              onClick={() => router.push(`/admin/front-office/registration?patientId=${patient.id}`)}
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
                                <CalendarIcon className="h-4 w-4" />
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
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {!loading && patients.length === 0 && searchTerm && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No patients found matching your search criteria</p>
                <Link href="/admin/front-office/registration">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Register New Patient
                  </Button>
                </Link>
              </div>
            )}

            {!loading && !searchTerm && (
              <div className="text-center py-12 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Start typing to search for existing patients</p>
                <p className="text-sm mt-2">Search by name, phone number, or Patient ID</p>
              </div>
            )}

            {!loading && totalRecords > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t gap-4">
                <div className="text-sm text-gray-600">
                  Showing {Math.min(((currentPage - 1) * pageSize) + 1, totalRecords)} to {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} patients
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || loading}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {(() => {
                      const pages = [];
                      const windowSize = 7;
                      let start = Math.max(1, currentPage - Math.floor(windowSize / 2));
                      let end = Math.min(totalPages, start + windowSize - 1);
                      if (end - start + 1 < windowSize) {
                        start = Math.max(1, end - windowSize + 1);
                      }
                      for (let i = start; i <= end; i++) {
                        pages.push(i);
                      }
                      return pages.map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          disabled={loading}
                          className="w-10"
                        >
                          {pageNum}
                        </Button>
                      ));
                    })()}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages || loading}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  )
}

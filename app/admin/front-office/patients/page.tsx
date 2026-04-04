"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Search,
  Plus,
  Eye,
  Edit,
  Calendar as CalendarIcon,
  Receipt,
  Users,
  Filter,
  DollarSign,
  FileText,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Printer,
  Trash2
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Link from "next/link"
import { useRouter } from "next/navigation"
import PrivateRoute from "@/components/auth/PrivateRoute"
import authService from "@/lib/authService"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { cn } from "@/lib/utils"



export default function PatientListPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [patients, setPatients] = useState<any[]>([])
  const [filteredPatients, setFilteredPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedBranchId, setSelectedBranchId] = useState(authService.getSelectedBranchId())
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [sortField, setSortField] = useState<string>("createdAt")
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC")
  const pageSize = 10
  const router = useRouter()
  const fetchingRef = useRef(false)
  const [locationData, setLocationData] = useState<any>(null)
  const [fromDate, setFromDate] = useState<Date>(new Date())
  const [toDate, setToDate] = useState<Date>(new Date())
  const [showRegistrationReceipt, setShowRegistrationReceipt] = useState(false)
  const [selectedPatientForReceipt, setSelectedPatientForReceipt] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const user = authService.getUserInfo()
    if (user) {
      // Primary: use the is_admin flag set by the backend during login
      if (user.is_admin === true) {
        setIsAdmin(true)
      } else {
        // Fallback: check role_name for 'admin' keyword
        const roleName = (user.role_name || user.role || user.user_type || '').toLowerCase()
        if (roleName.includes('admin')) {
          setIsAdmin(true)
        }
      }
    }
  }, [])

  const handleCaseSheetClick = (patientId: string) => {
    router.push(`/admin/caseheetnew?patientId=${patientId}`)
  }

  useEffect(() => {
    fetchPatients();
    fetchLocationData();
  }, [currentPage, sortField, sortOrder, fromDate, toDate])

  const fetchLocationData = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      const locationId = userData?.primary_location_id || authService.getLocationId()

      if (locationId) {
        const response = await fetch(`${authService.getSettingsApiUrl()}/locations/${locationId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const data = await response.json()
          setLocationData(data)
        }
      }
    } catch (error) {
      console.error('Error fetching location data:', error)
    }
  }

  useEffect(() => {
    const handleBranchChange = () => {
      const currentBranchId = authService.getSelectedBranchId()
      if (currentBranchId !== selectedBranchId) {
        setSelectedBranchId(currentBranchId)
        if (currentPage === 1) {
          fetchPatients()
        } else {
          setCurrentPage(1)
        }
      }
    }

    window.addEventListener('branchChanged', handleBranchChange)
    return () => {
      window.removeEventListener('branchChanged', handleBranchChange)
    }
  }, [selectedBranchId, currentPage])

  const fetchPatients = async () => {
    console.log('fetchPatients called!'); // Debug log
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const selectedBranchId = authService.getSelectedBranchId()

      // If we want "All Locations", we can pass 0 or omit it. 
      // For now, let's stick to the selected branch unless the user provides a specific "All" toggle later.
      // But the backend now supports it if we pass 0.
      const locationId = selectedBranchId ? parseInt(selectedBranchId) : undefined

      const params = new URLSearchParams()
      if (locationId) params.append('locationId', locationId.toString())
      params.append('page', currentPage.toString())
      params.append('limit', pageSize.toString())
      if (searchTerm) {
        params.append('search', searchTerm)
      } else {
        if (fromDate) params.append('fromDate', format(fromDate, "yyyy-MM-dd"))
        if (toDate) params.append('toDate', format(toDate, "yyyy-MM-dd"))
      }
      if (sortField) params.append('sort_field', sortField)
      if (sortOrder) params.append('sort_order', sortOrder)

      const url = `${authService.getSettingsApiUrl()}/patients?${params}`

      console.log('Full API URL:', url); // Debug full URL

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        const data = result.data || result

        console.log('Patients API Response:', result) // Debug log

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

          // Mapping properties from getRawMany output
          return {
            id: patient.patient_id,
            patientId: patient.patient_patient_id,
            name: `${patient.patient_first_name} ${patient.patient_last_name}`,
            firstName: patient.patient_first_name,
            lastName: patient.patient_last_name,
            mobile: patient.patient_mobile,
            dob: patient.patient_date_of_birth,
            age: calculateAge(patient.patient_date_of_birth),
            gender: patient.patient_gender ? (patient.patient_gender.toLowerCase() === 'm' ? 'Male' : patient.patient_gender.toLowerCase() === 'f' ? 'Female' : 'Other') : 'N/A',
            lastVisit: patient.patient_updated_at,
            status: patient.patient_status || 'active',
            nextRenewalDate: patient.next_renewal_date_pro,
            dueAmount: patient.due_amount,
            address1: patient.patient_address1,
            fee: patient.patient_fee,
            amount: patient.patient_amount,
            feeType: patient.patient_fee_type,
            registrationDate: patient.patient_created_at
          }
        })
        setPatients(formattedPatients)
        setFilteredPatients(formattedPatients)

        if (result.total !== undefined) {
          setTotalRecords(result.total)
          setTotalPages(result.totalPages || Math.ceil(result.total / pageSize))
        } else {
          // Fallback if API doesn't return pagination info
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

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC")
    } else {
      setSortField(field)
      setSortOrder("ASC")
    }
    setCurrentPage(1)
  }

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />
    return sortOrder === "ASC" ?
      <ArrowUp className="ml-2 h-4 w-4 text-blue-600" /> :
      <ArrowDown className="ml-2 h-4 w-4 text-blue-600" />
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

  const handleDeactivate = async (patientId: string, patientName: string) => {
    if (!window.confirm(`Are you sure you want to deactivate patient ${patientName}?`)) {
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const url = `${authService.getSettingsApiUrl()}/patients/${patientId}`

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'inactive' }),
      })

      if (response.ok) {
        alert('Patient deactivated successfully')
        fetchPatients()
      } else {
        const error = await response.json()
        alert(`Error: ${error.message || 'Failed to deactivate patient'}`)
      }
    } catch (error) {
      console.error('Error deactivating patient:', error)
      alert('An error occurred while deactivating the patient')
    } finally {
      setLoading(false)
    }
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

        {/* Search Section */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-end gap-4">
              <div className="flex-1 space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by Patient ID, Name, or Mobile..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-200",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {fromDate ? format(fromDate, "dd/MM/yyyy") : <span>From Date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-xl bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={(date: Date | undefined) => date && setFromDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-200",
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {toDate ? format(toDate, "dd/MM/yyyy") : <span>To Date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-xl bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={(date: Date | undefined) => date && setToDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
                      <TableHead
                        className="cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => handleSort('patientId')}
                      >
                        <div className="flex items-center">
                          Patient ID {getSortIcon('patientId')}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center">
                          Name {getSortIcon('name')}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => handleSort('mobile')}
                      >
                        <div className="flex items-center">
                          Mobile {getSortIcon('mobile')}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => handleSort('nextRenewalDate')}
                      >
                        <div className="flex items-center">
                          Next Renewal Date {getSortIcon('nextRenewalDate')}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => handleSort('dueAmount')}
                      >
                        <div className="flex items-center">
                          Due Amount {getSortIcon('dueAmount')}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => handleSort('age')}
                      >
                        <div className="flex items-center">
                          Age {getSortIcon('age')}
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => handleSort('gender')}
                      >
                        <div className="flex items-center">
                          Gender {getSortIcon('gender')}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Reg. Fee</TableHead>
                      <TableHead
                        className="cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center">
                          Status {getSortIcon('status')}
                        </div>
                      </TableHead>
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
                        <TableCell className="text-right font-medium">
                          {patient.amount ? `₹${Number(patient.amount).toLocaleString('en-IN')}` : '₹0'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={patient.status?.toLowerCase() === 'active' ? 'default' : 'secondary'}>
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
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Registration Receipt"
                              onClick={() => {
                                setSelectedPatientForReceipt(patient)
                                setShowRegistrationReceipt(true)
                              }}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                            {isAdmin && patient.status !== 'inactive' && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                title="Deactivate Patient"
                                onClick={() => handleDeactivate(patient.id, patient.name)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
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

        {/* Registration Receipt Dialog */}
        <Dialog open={showRegistrationReceipt} onOpenChange={setShowRegistrationReceipt}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto print:max-h-none print:overflow-visible print:border-none print:shadow-none print:p-0">
            <DialogHeader>
              <DialogTitle className="print:hidden">Registration Receipt</DialogTitle>
            </DialogHeader>
            {selectedPatientForReceipt && (
              <div className="receipt-content p-4 space-y-6">
                <style jsx>{`
                    @media print {
                    @page { margin: 10mm; size: A4; }
                      body > *:not([data-radix-portal]), 
                      [data-radix-portal] > *:not([role="dialog"]) { 
                        display: none !important; 
                      }
                      .print\\:hidden { display: none !important; }
                      [role="dialog"] { 
                        position: static !important;
                        display: block !important;
                        width: 100% !important;
                        max-width: none !important;
                        max-height: none !important; 
                        overflow: visible !important; 
                        border: none !important; 
                        box-shadow: none !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        transform: none !important;
                      visibility: visible !important;
                      }
                    .receipt-content { display: block !important; visibility: visible !important; }
                      [data-radix-overlay] { display: none !important; }
                    }
                  `}</style>

                {/* Logo and Header */}
                <div className="text-center space-y-2">
                  <div className="flex justify-center mb-2">
                    <img src="/images/patientrecipts.jpeg" alt="Hospital Logo" className="w-48 h-32 object-contain" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">ISO 9001:2015 Certified</p>
                  <p className="text-sm text-gray-600">{locationData?.address || '10-5-53, 1st Floor, Upstairs, Surya Tea Stall, Palnadu Bus Stand Centre, Main Road, Narasaraopeta, Andhra Pradesh 522601'}</p>
                  <p className="text-sm text-gray-600">Helpline: {locationData?.phone || '9059051906'}</p>
                  <div className="border-b-2 border-gray-100 my-4"></div>
                  <h3 className="text-xl font-bold uppercase tracking-wider">Payment Receipt</h3>
                </div>

                {/* Patient Info Grid */}
                <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
                  <div className="space-y-1">
                    <p><strong>Date:</strong> {format(new Date(selectedPatientForReceipt.registrationDate), 'dd/MM/yyyy')}</p>
                    <p><strong>Name:</strong> {selectedPatientForReceipt.name?.toUpperCase()}</p>
                    <p><strong>Age/DOB:</strong> {selectedPatientForReceipt.age} / {format(new Date(selectedPatientForReceipt.dob), 'dd/MM/yyyy')}</p>
                  </div>
                  <div className="space-y-1">
                    <p><strong>UHID:</strong> {selectedPatientForReceipt.patientId}</p>
                    <p><strong>Mobile:</strong> {selectedPatientForReceipt.mobile}</p>
                    <p><strong>Address:</strong> {selectedPatientForReceipt.address1 || 'N/A'}</p>
                  </div>
                </div>

                {/* Table */}
                <div className="border border-gray-300 rounded-sm">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-300">
                        <th className="p-3 text-center border-r border-gray-300 w-16">S.No.</th>
                        <th className="p-3 text-center border-r border-gray-300">Description</th>
                        <th className="p-3 text-center border-r border-gray-300">Mode</th>
                        <th className="p-3 text-right">Amount(Rs)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-300">
                        <td className="p-3 text-center border-r border-gray-300">1</td>
                        <td className="p-3 text-center border-r border-gray-300">{selectedPatientForReceipt.fee}</td>
                        <td className="p-3 text-center border-r border-gray-300">{selectedPatientForReceipt.feeType || 'N/A'}</td>
                        <td className="p-3 text-right">{parseFloat(selectedPatientForReceipt.amount || '0').toFixed(2)}</td>
                      </tr>
                      <tr className="font-bold">
                        <td colSpan={3} className="p-3 text-right border-r border-gray-300">
                          Paid Amount (Rupees {selectedPatientForReceipt.amount} Only)
                        </td>
                        <td className="p-3 text-right">{parseFloat(selectedPatientForReceipt.amount || '0').toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-sm italic">Received with thanks Rs. {selectedPatientForReceipt.amount}/- from Mr/Ms. {selectedPatientForReceipt.name}.</p>

                {/* Terms and Conditions */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-center uppercase">Terms & Conditions</h4>
                  <ul className="text-[10px] leading-relaxed text-gray-700 space-y-1">
                    <li>• The facilities of joining the card includes any number of consultations with physician.</li>
                    <li>• Only the bearer can avail the facilities of the card. The card facilities are given only to the one on whose name the card is made.</li>
                    <li>• The fee is non transferable, non refundable and non extendable.</li>
                    <li>• Patients are strictly advised to use medicines as per attending physicians recommendation. We assume patients have the responsibility to inform the attending physician about the status of the health or any serious disorder during the course of treatment.</li>
                    <li>• We expect & would appreciate patients to visit the clinic as per the due date of their consultations.</li>
                    <li>• Patients are requested to co-operate with the mode of treatment, as sometimes, the speed of recovery is slow (the time of recovery may vary).</li>
                    <li>• The duration of treatment and results may vary from patient.</li>
                    <li>• The Doctor and the clinic has given no guarantee to me (Patient) about the results and duration of the treatment.</li>
                    <li>• During critical emergencies patients / attendants are advised to inform the attending physician.</li>
                    <li>• Case Sheet Record are(Digital) and kept with the Doctor (in Server) till the end of the course of the treatment.</li>
                    <li>• This Corporate Clinic, promises to provide Best Service and Treatment to all Patients.</li>
                    <li>• All disputes are subject to Narasaraopet Court Jurisdiction only. E&OE.</li>
                  </ul>
                </div>

                {/* Signatures */}
                <div className="flex justify-between pt-12 text-sm">
                  <div className="text-center">
                    <div className="border-t border-gray-400 w-48 mb-1"></div>
                    <p className="font-medium">Patients Signature</p>
                  </div>
                  <div className="text-center">
                    <div className="border-t border-gray-400 w-48 mb-1"></div>
                    <p className="font-medium">Authorised Signature</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center pt-6 gap-3 print:hidden">
                  <Button
                    variant="outline"
                    onClick={() => window.print()}
                    className="h-10 px-8"
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print Receipt
                  </Button>
                  <Button
                    onClick={() => setShowRegistrationReceipt(false)}
                    className="h-10 px-8 bg-red-600 hover:bg-red-700"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PrivateRoute>
  )
}
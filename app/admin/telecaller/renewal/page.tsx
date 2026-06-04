"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, PhoneCall, Filter, Search } from "lucide-react"
import authService from "@/lib/authService"
import { settingsApi } from "@/lib/settingsApi"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { format } from "date-fns"

export default function RenewalPage() {
  const [renewalPatients, setRenewalPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [limit] = useState(10)

  // Set default dates to current month
  // Set default dates to current month
  useEffect(() => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const fromDateStr = firstDay.toISOString().split('T')[0]
    const toDateStr = lastDay.toISOString().split('T')[0]

    setFromDate(fromDateStr)
    setToDate(toDateStr)

    // Fetch current month data on initial load only
    fetchRenewalPatientsWithDates(fromDateStr, toDateStr)
  }, [])

  const fetchRenewalPatientsWithDates = async (from: string, to: string, search: string = searchTerm, pageNum: number = page) => {
    try {
      setLoading(true)
      const locationId = authService.getLocationId()

      // If search is present, don't pass dates to API
      const apiFrom = search ? undefined : from
      const apiTo = search ? undefined : to

      const response = await settingsApi.getRenewalPatients(
        locationId ? parseInt(locationId) : 1,
        apiFrom,
        apiTo,
        search,
        pageNum,
        limit
      )

      if (response && response.data) {
        setRenewalPatients(response.data)
        setTotalPages(response.totalPages || 1)
        setTotalRecords(response.total || 0)
        setPage(response.page || pageNum)
      } else {
        setRenewalPatients([])
        setTotalPages(1)
        setTotalRecords(0)
      }
    } catch (error) {
      console.error('Error fetching renewal patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRenewalPatients = async () => {
    setPage(1)
    if (fromDate && toDate) {
      await fetchRenewalPatientsWithDates(fromDate, toDate, searchTerm, 1)
    }
  }

  const handlePageChange = async (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
      await fetchRenewalPatientsWithDates(fromDate, toDate, searchTerm, newPage)
    }
  }

  const handleCall = (patientId: number, mobile: string) => {
    if (mobile) {
      window.open(`tel:${mobile}`)
    }
  }

  const handleCallPatient = (patient: any) => {
    window.location.href = `/admin/telecaller/call-patient?patientId=${patient.patientId}`
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'N/A'
      return format(date, 'dd/MM/yyyy')
    } catch {
      return 'N/A'
    }
  }

  return (
    <PrivateRoute modulePath="admin/telecaller/renewal" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Patient Renewals</h1>
          <Button onClick={fetchRenewalPatients} variant="outline">
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Filter className="h-5 w-5 mr-2" />
              Date Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Search Patient</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Name, ID, or Mobile..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    onKeyDown={(e) => e.key === 'Enter' && fetchRenewalPatients()}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>From Date</Label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  disabled={!!searchTerm}
                />
              </div>
              <div className="space-y-2">
                <Label>To Date</Label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  disabled={!!searchTerm}
                />
              </div>
              <div className="flex items-end">
                <Button
                  className="w-full"
                  onClick={fetchRenewalPatients}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patients with Renewal Dates ({totalRecords})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading renewal patients...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Mobile Number</TableHead>
                    <TableHead>Next Renewal Date</TableHead>
                    <TableHead>Treatment Plan (Months)</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renewalPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No patients with renewal dates found
                      </TableCell>
                    </TableRow>
                  ) : (
                    renewalPatients.map((patient: any) => (
                      <TableRow key={patient.patient_id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>
                              {patient.firstName || patient.lastName
                                ? `${patient.firstName || ''} ${patient.lastName || ''}`.trim()
                                : `Patient ID: ${patient.patientId}`
                              }
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {patient.patientIdStr || patient.patientId}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{patient.mobileNumber ? `xxxxxx${patient.mobileNumber.slice(-4)}` : 'N/A'}</TableCell>
                        <TableCell>{formatDate(patient.nextRenewalDatePro)}</TableCell>
                        <TableCell>{patient.treatmentPlanMonthsPro || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {patient.mobileNumber && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCallPatient(patient)}
                                title="Call Patient"
                              >
                                <PhoneCall className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalRecords)} of {totalRecords} records
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                      .map((p, i, arr) => {
                        return (
                          <div key={p} className="flex items-center">
                            {i > 0 && arr[i - 1] !== p - 1 && <span className="px-2">...</span>}
                            <Button
                              variant={page === p ? "default" : "outline"}
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handlePageChange(p)}
                            >
                              {p}
                            </Button>
                          </div>
                        )
                      })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                  >
                    Next
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
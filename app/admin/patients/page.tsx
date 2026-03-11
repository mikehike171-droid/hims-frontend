"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Calendar, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { settingsApi } from "@/lib/settingsApi"
import { Skeleton } from "@/components/ui/skeleton"
import authService from "@/lib/authService"

export default function PatientsPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const pageSize = 10

  // Set default dates to current month
  useEffect(() => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const fromDateStr = firstDay.toISOString().split('T')[0]
    const toDateStr = lastDay.toISOString().split('T')[0]

    setFromDate(fromDateStr)
    setToDate(toDateStr)

    // Fetch current month data on initial load
    fetchPatients(fromDateStr, toDateStr)
  }, [])

  const fetchPatients = async (from?: string, to?: string, pageNum = page) => {
    try {
      setLoading(true)
      const data = await settingsApi.getPatients(
        4, // patient_source_id = 4
        from || fromDate,
        to || toDate,
        pageNum,
        pageSize
      )
      setPatients(data?.data || data || [])
      setPage(data?.page || pageNum)
      setTotalPages(data?.totalPages || Math.ceil((data?.total || 0) / pageSize))
      setTotalRecords(data?.total || 0)
    } catch (error) {
      console.error('Error fetching patients:', error)
      setPatients([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setPage(1)
    fetchPatients(fromDate, toDate, 1)
  }

  const handleCaseSheetClick = (patientId: number) => {
    router.push(`/admin/caseheetnew?patientId=${patientId}`)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Patient List</h1>

      {/* Date Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Date Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="fromDate" className="text-sm font-medium">From Date:</Label>
              <Input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="toDate" className="text-sm font-medium">To Date:</Label>
              <Input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-40"
              />
            </div>
            <Button
              onClick={handleSearch}
              variant="default"
              size="sm"
              className="flex items-center space-x-1"
              disabled={loading}
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Patients ({loading ? '...' : totalRecords})</CardTitle>
          {totalRecords > 0 && (
            <p className="text-sm text-gray-600">
              Page {page} of {totalPages} - Showing {Math.min(((page - 1) * pageSize) + 1, totalRecords)} to {Math.min(page * pageSize, totalRecords)} of {totalRecords} patients
            </p>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : patients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No patients found
                  </TableCell>
                </TableRow>
              ) : (
                patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.patientId || patient.patient_id}</TableCell>
                    <TableCell>
                      {patient.firstName && patient.lastName
                        ? `${patient.firstName} ${patient.lastName}`
                        : patient.first_name && patient.last_name
                          ? `${patient.first_name} ${patient.last_name}`
                          : 'N/A'
                      }
                    </TableCell>
                    <TableCell>{patient.phone || patient.mobile || 'N/A'}</TableCell>
                    <TableCell>{patient.gender || 'N/A'}</TableCell>
                    <TableCell>{formatDate(patient.createdAt || patient.created_at)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCaseSheetClick(patient.id)}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Case Sheet
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          {!loading && totalRecords > pageSize && (
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t gap-4">
              <div className="text-sm text-gray-600">
                Showing {Math.min(((page - 1) * pageSize) + 1, totalRecords)} to {Math.min(page * pageSize, totalRecords)} of {totalRecords} patients
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newPage = page - 1
                    setPage(newPage)
                    fetchPatients(fromDate, toDate, newPage)
                  }}
                  disabled={page === 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setPage(pageNum)
                          fetchPatients(fromDate, toDate, pageNum)
                        }}
                        disabled={loading}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newPage = page + 1
                    setPage(newPage)
                    fetchPatients(fromDate, toDate, newPage)
                  }}
                  disabled={page >= totalPages || loading}
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
  )
}
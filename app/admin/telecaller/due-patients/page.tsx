"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Phone, User, RefreshCw, ChevronLeft, ChevronRight, IndianRupee } from "lucide-react"
import { toast } from "sonner"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"

interface DuePatientItem {
  id: number
  patientId: number
  patientCode: string
  patientName: string
  mobileNumber: string
  totalAmount: number
  discountAmount: number
  paidAmount: number
  dueAmount: number
  createdAt: string
}

export default function DuePatientsPage() {
  const [duePatients, setDuePatients] = useState<DuePatientItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const fetchingRef = useRef(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })

  const maskMobileNumber = (mobile: string) => {
    if (!mobile || mobile.length < 10) return mobile || 'N/A'
    const lastFour = mobile.slice(-4)
    const firstSix = 'XXXXXX'
    return `${firstSix}${lastFour}`
  }

  const fetchDuePatients = async (page: number = 1) => {
    if (fetchingRef.current) return
    
    try {
      fetchingRef.current = true
      setLoading(true)
      const token = authService.getCurrentToken()
      const response = await fetch(`${authService.getSettingsApiUrl()}/patient-examination/due-patients/all?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        setDuePatients(result.data || [])
        setPagination(result.pagination || {})
        setCurrentPage(page)
      } else {
        toast.error('Failed to fetch due patients')
      }
    } catch (error) {
      console.error('Error fetching due patients:', error)
      toast.error('Error loading due patients')
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }

  useEffect(() => {
    fetchDuePatients(1)
  }, [])

  const handleRefresh = () => {
    fetchDuePatients(currentPage)
  }

  const handlePrevPage = () => {
    if (pagination.hasPrev) {
      fetchDuePatients(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (pagination.hasNext) {
      fetchDuePatients(currentPage + 1)
    }
  }

  if (loading) {
    return (
      <PrivateRoute modulePath="admin/telecaller/due-patients" action="view">
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Due Patients</h1>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p>Loading due patients...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PrivateRoute>
    )
  }

  return (
    <PrivateRoute modulePath="admin/telecaller/due-patients" action="view">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Due Patients</h1>
            <p className="text-muted-foreground">
              Patients with outstanding due amounts
            </p>
          </div>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5" />
              Due Patients ({pagination.total} patients)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {duePatients.length === 0 ? (
              <div className="text-center py-8">
                <IndianRupee className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium">No due patients found</p>
                <p className="text-muted-foreground">
                  All patients have cleared their dues
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Code</TableHead>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Mobile Number</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Paid Amount</TableHead>
                      <TableHead>Due Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {duePatients.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.patientCode || `P${item.patientId}`}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {item.patientName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {maskMobileNumber(item.mobileNumber)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            ₹{item.totalAmount}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-green-600">
                            ₹{item.paidAmount}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">
                            ₹{item.dueAmount}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              window.location.href = `/admin/telecaller/call-patient?patientId=${item.patientId}`
                            }}
                            title="Call Patient"
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * pagination.limit) + 1} to {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} patients
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={!pagination.hasPrev}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm font-medium">
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!pagination.hasNext}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PrivateRoute>
  )
}
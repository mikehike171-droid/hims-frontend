"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Phone, User, RefreshCw, ChevronLeft, ChevronRight, Calendar, Search } from "lucide-react"
import { toast } from "sonner"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"

interface NRListItem {
  id: number
  patientId: number
  patientCode: string
  patientName: string
  mobileNumber: string
  treatmentPlanMonths: number
  nextRenewalDate: string | null
}

export default function NRListPage() {
  const [nrList, setNrList] = useState<NRListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
  const getCurrentMonthDates = () => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const formatDate = (date: Date) => {
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    }
    return {
      from: formatDate(firstDay),
      to: formatDate(lastDay)
    }
  }
  
  const [fromDate, setFromDate] = useState<string>(getCurrentMonthDates().from)
  const [toDate, setToDate] = useState<string>(getCurrentMonthDates().to)
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

  const fetchNRList = async (page: number = 1) => {
    if (fetchingRef.current) return
    
    try {
      fetchingRef.current = true
      setLoading(true)
      const token = authService.getCurrentToken()
      let url = `${authService.getSettingsApiUrl()}/patient-examination/nr-list/all?page=${page}&limit=10`
      
      if (fromDate) {
        const [day, month, year] = fromDate.split('/')
        url += `&fromDate=${year}-${month}-${day}`
      }
      
      if (toDate) {
        const [day, month, year] = toDate.split('/')
        url += `&toDate=${year}-${month}-${day}`
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        setNrList(result.data || [])
        setPagination(result.pagination || {})
        setCurrentPage(page)
      } else {
        toast.error('Failed to fetch NR list')
      }
    } catch (error) {
      console.error('Error fetching NR list:', error)
      toast.error('Error loading NR list')
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }

  useEffect(() => {
    fetchNRList(1)
  }, [])

  const handleRefresh = () => {
    fetchNRList(currentPage)
  }

  const handlePrevPage = () => {
    if (pagination.hasPrev) {
      fetchNRList(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (pagination.hasNext) {
      fetchNRList(currentPage + 1)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">NR List</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p>Loading NR list...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <PrivateRoute modulePath="admin/telecaller/nr-list" action="view">
      <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">NR List</h1>
          <p className="text-muted-foreground">
            Patients with treatment plans but no renewal date and zero amounts
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

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
              <div className="relative">
                <input
                  id="fromDateInput"
                  type="date"
                  value={fromDate ? (() => {
                    const [day, month, year] = fromDate.split('/')
                    return `${year}-${month}-${day}`
                  })() : ''}
                  onChange={(e) => {
                    const date = new Date(e.target.value)
                    const day = String(date.getDate()).padStart(2, '0')
                    const month = String(date.getMonth() + 1).padStart(2, '0')
                    const year = date.getFullYear()
                    setFromDate(`${day}/${month}/${year}`)
                  }}
                  className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <Input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={fromDate}
                  readOnly
                  className="w-40"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="toDate" className="text-sm font-medium">To Date:</Label>
              <div className="relative">
                <input
                  id="toDateInput"
                  type="date"
                  value={toDate ? (() => {
                    const [day, month, year] = toDate.split('/')
                    return `${year}-${month}-${day}`
                  })() : ''}
                  onChange={(e) => {
                    const date = new Date(e.target.value)
                    const day = String(date.getDate()).padStart(2, '0')
                    const month = String(date.getMonth() + 1).padStart(2, '0')
                    const year = date.getFullYear()
                    setToDate(`${day}/${month}/${year}`)
                  }}
                  className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <Input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={toDate}
                  readOnly
                  className="w-40"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <Button
              onClick={() => fetchNRList(1)}
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
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            NR List ({pagination.total} patients)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Code</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Mobile Number</TableHead>
                  <TableHead>Treatment Plan</TableHead>
                  <TableHead>Next Renewal Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nrList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium">No NR patients found</p>
                      <p className="text-muted-foreground">
                        All patients have either renewal dates set or non-zero amounts
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  nrList.map((item) => (
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
                        {item.treatmentPlanMonths ? (
                          <Badge variant="secondary">
                            {item.treatmentPlanMonths} months
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.nextRenewalDate ? (
                          <span className="text-sm">
                            {new Date(item.nextRenewalDate).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.total > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * pagination.limit) + 1} to {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} patients
              </div>
              {pagination.totalPages > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={!pagination.hasPrev}
                    className="w-8 h-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => fetchNRList(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!pagination.hasNext}
                    className="w-8 h-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </PrivateRoute>
  )
}
"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileText, Receipt, User, ChevronLeft, ChevronRight, Search, Calendar } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { settingsApi } from "@/lib/settingsApi"
import authService from "@/lib/authService"
import { useRouter } from "next/navigation"

export default function PatientBillDiscussPage() {
  const router = useRouter()
  const [examinations, setExaminations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [selectedTreatmentPlan, setSelectedTreatmentPlan] = useState<string>('')
  const [nextRenewalDate, setNextRenewalDate] = useState<string>('')
  const [packageAmount, setPackageAmount] = useState<number>(0)
  const [paidAmount, setPaidAmount] = useState<number>(0)
  const [paymentMode, setPaymentMode] = useState<string>('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })
  
  // Set default dates to current month
  const getCurrentMonthDates = () => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return {
      from: firstDay.toISOString().split('T')[0],
      to: lastDay.toISOString().split('T')[0]
    }
  }
  
  const currentMonth = getCurrentMonthDates()
  const [fromDate, setFromDate] = useState<string>(currentMonth.from)
  const [toDate, setToDate] = useState<string>(currentMonth.to)
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true
      fetchExaminations()
    }
  }, [])

  const fetchExaminations = async (page = 1) => {
    try {
      setLoading(true)
      const locationId = authService.getLocationId()
      const response = await settingsApi.getPatientExaminations(
        locationId ? parseInt(locationId) : 1, 
        page, 
        10, 
        fromDate || undefined, 
        toDate || undefined
      )
      setExaminations(response?.data || [])
      setPagination(response?.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      })
    } catch (error) {
      console.error('Error fetching examinations:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getTreatmentPlanLabel = (months: number) => {
    const plans = [
      { months: 1, label: '1 Month' },
      { months: 2, label: '2 Months' },
      { months: 3, label: '3 Months' },
      { months: 6, label: '6 Months' },
      { months: 12, label: '12 Months' }
    ]
    return plans.find(plan => plan.months === months)?.label || `${months} Months`
  }

  const handleBilling = (examination: any) => {
    router.push(`/admin/manager/patient-bill-discuss/${examination.patient_id || 'P001234'}`)
  }

  const handlePreviousPage = () => {
    if (pagination.hasPrev) {
      fetchExaminations(pagination.page - 1)
    }
  }

  const handleNextPage = () => {
    if (pagination.hasNext) {
      fetchExaminations(pagination.page + 1)
    }
  }

  const handleDateFilter = () => {
    fetchExaminations(1) // Reset to first page when filtering
  }

  const handleClearFilters = () => {
    const currentMonth = getCurrentMonthDates()
    setFromDate(currentMonth.from)
    setToDate(currentMonth.to)
    setTimeout(() => fetchExaminations(1), 0) // Reset to current month and fetch
  }

  return (
    <PrivateRoute modulePath="admin/manager" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Bill Discuss</h1>
            <p className="text-gray-600">Patient examination details for billing discussion</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Patient Examinations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Date Filters */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
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
                  onClick={handleDateFilter}
                  variant="default"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <Search className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  size="sm"
                >
                  Clear
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S.No</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Doctor Plan (Months)</TableHead>
                    <TableHead>Doctor Renewal Date</TableHead>
                    <TableHead>PRO Plan (Months)</TableHead>
                    <TableHead>PRO Renewal Date</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">Loading examinations...</TableCell>
                    </TableRow>
                  ) : examinations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">No examinations found</TableCell>
                    </TableRow>
                  ) : (
                    examinations.map((examination, index) => (
                      <TableRow key={examination.id || index}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {examination.patient_name || 'Unknown Patient'}
                        </TableCell>
                        <TableCell>
                          {examination.treatment_plan_months_doctor ? (
                            <Badge variant="outline">
                              {examination.treatment_plan_months_doctor} months
                            </Badge>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell>
                          {examination.next_renewal_date_doctor ? (
                            <span className="text-sm">
                              {formatDate(examination.next_renewal_date_doctor)}
                            </span>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell>
                          {examination.treatment_plan_months_pro ? (
                            <Badge variant="secondary">
                              {examination.treatment_plan_months_pro} months
                            </Badge>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell>
                          {examination.next_renewal_date_pro ? (
                            <span className="text-sm">
                              {formatDate(examination.next_renewal_date_pro)}
                            </span>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell>
                          {examination.created_at ? (
                            <span className="text-sm">
                              {formatDate(examination.created_at)}
                            </span>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBilling(examination)}
                            title="Patient Billing"
                          >
                            <Receipt className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={!pagination.hasPrev || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={!pagination.hasNext || loading}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  )
}
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
import { FileText, Receipt, User, ChevronLeft, ChevronRight, Search, Calendar, Filter, ChevronUp, ChevronDown, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { settingsApi } from "@/lib/settingsApi"
import authService from "@/lib/authService"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })
  const [sortField, setSortField] = useState<string>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [locationId, setLocationId] = useState<string | null>(authService.getLocationId())

  // Set default dates to current month
  const getCurrentMonthDates = () => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return {
      today: format(now, "yyyy-MM-dd"),
      from: format(firstDay, "yyyy-MM-dd"),
      to: format(lastDay, "yyyy-MM-dd")
    }
  }

  const currentMonth = getCurrentMonthDates()
  const [fromDate, setFromDate] = useState<string>(currentMonth.from)
  const [toDate, setToDate] = useState<string>(currentMonth.to)
  const [searchTerm, setSearchTerm] = useState('')
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    // Initial fetch
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true
      fetchExaminations(1, sortField, sortOrder, fromDate, toDate, searchTerm, locationId)
    }

    // Listen for global location changes
    const handleLocationChange = (event: any) => {
      const newLocId = event.detail.locationId || authService.getLocationId()
      setLocationId(newLocId)
      fetchExaminations(1, sortField, sortOrder, fromDate, toDate, searchTerm, newLocId)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('locationChanged', handleLocationChange)
      return () => {
        window.removeEventListener('locationChanged', handleLocationChange)
      }
    }
  }, [locationId, sortField, sortOrder, fromDate, toDate, searchTerm]) // Add dependencies if needed, or keep it broad if fetchExaminations uses state directly

  const fetchExaminations = async (
    page = 1, 
    sField = sortField, 
    sOrder = sortOrder, 
    fDate = fromDate, 
    tDate = toDate, 
    sTerm = searchTerm,
    locId = locationId
  ) => {
    try {
      setLoading(true)
      const currentLocId = locId || authService.getLocationId()
      const response = await settingsApi.getPatientExaminations(
        currentLocId ? parseInt(currentLocId) : 1,
        page,
        10,
        sTerm ? undefined : (fDate || undefined),
        sTerm ? undefined : (tDate || undefined),
        sTerm || undefined,
        sField,
        sOrder
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
    if (!dateString) return 'N/A'
    try {
      return format(new Date(dateString), "dd/MM/yyyy")
    } catch (e) {
      return 'N/A'
    }
  }

  const maskMobileNumber = (mobile: string) => {
    if (!mobile) return 'N/A';
    if (mobile.length <= 4) return mobile;
    return 'XXXXXX' + mobile.slice(-4);
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
    fetchExaminations(1, sortField, sortOrder, fromDate, toDate, searchTerm)
  }

  const handleClearFilters = () => {
    const dates = getCurrentMonthDates()
    setFromDate(dates.from)
    setToDate(dates.to)
    setSearchTerm('')
    // Pass cleared values directly
    fetchExaminations(1, sortField, sortOrder, dates.from, dates.to, '')
  }

  const handleSearch = () => {
    fetchExaminations(1, sortField, sortOrder, fromDate, toDate, searchTerm)
  }

  const handleSort = (field: string) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc'
    setSortField(field)
    setSortOrder(newOrder)
    fetchExaminations(1, field, newOrder, fromDate, toDate, searchTerm)
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <div className="flex flex-col ml-1 opacity-20"><ChevronUp className="h-3 w-3 -mb-1" /><ChevronDown className="h-3 w-3 -mt-1" /></div>
    return (
      <div className="ml-1 text-primary">
        {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </div>
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
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
            {/* Filters Header */}
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[300px] max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, mobile or patient ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Label className="whitespace-nowrap">From Date:</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[160px] justify-start text-left font-normal",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {fromDate ? format(new Date(fromDate), "dd/MM/yyyy") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={fromDate ? new Date(fromDate) : undefined}
                      onSelect={(date: any) => setFromDate(date ? format(date, "yyyy-MM-dd") : "")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center space-x-2">
                <Label className="whitespace-nowrap">To Date:</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[160px] justify-start text-left font-normal",
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {toDate ? format(new Date(toDate), "dd/MM/yyyy") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={toDate ? new Date(toDate) : undefined}
                      onSelect={(date: any) => setToDate(date ? format(date, "yyyy-MM-dd") : "")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center space-x-2">
                <Button onClick={handleSearch} className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </Button>
                {searchTerm && (
                  <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-gray-500">
                    Clear
                  </Button>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">S.No</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('custom_patient_id')}
                    >
                      <div className="flex items-center">
                        Patient ID
                        <SortIcon field="custom_patient_id" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('patient_name')}
                    >
                      <div className="flex items-center">
                        Patient Name
                        <SortIcon field="patient_name" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('patient_mobile')}
                    >
                      <div className="flex items-center">
                        Mobile Number
                        <SortIcon field="patient_mobile" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('last_visit_date')}
                    >
                      <div className="flex items-center">
                        Last Visit
                        <SortIcon field="last_visit_date" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('next_visit_date')}
                    >
                      <div className="flex items-center">
                        Next Visit
                        <SortIcon field="next_visit_date" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('next_renewal_date_pro')}
                    >
                      <div className="flex items-center">
                        Renewal Date
                        <SortIcon field="next_renewal_date_pro" />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleSort('created_at')}
                    >
                      <div className="flex items-center">
                        Created At
                        <SortIcon field="created_at" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">Loading examinations...</TableCell>
                    </TableRow>
                  ) : examinations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">No examinations found</TableCell>
                    </TableRow>
                  ) : (
                    examinations.map((examination, index) => (
                      <TableRow key={examination.id || index}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {examination.custom_patient_id || 'N/A'}
                        </TableCell>
                        <TableCell className="font-medium">
                          {examination.patient_name || 'Unknown Patient'}
                        </TableCell>
                        <TableCell>
                          {examination.patient_mobile ? (
                            <span className="text-sm font-mono">{maskMobileNumber(examination.patient_mobile)}</span>
                          ) : (
                            <span className="text-gray-400 text-sm">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {formatDate(examination.last_visit_date)}
                        </TableCell>
                        <TableCell>
                          {formatDate(examination.next_visit_date)}
                        </TableCell>
                        <TableCell>
                          {formatDate(examination.next_renewal_date_pro)}
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

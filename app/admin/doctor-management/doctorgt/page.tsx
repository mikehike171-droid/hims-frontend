"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Calendar as CalendarIcon,
  Search,
  DollarSign,
  Users,
  RefreshCw,
  Edit,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Lock,
  CalendarCheck,
  TrendingUp,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import PrivateRoute from "@/components/auth/PrivateRoute"
import authService from "@/lib/authService"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface ExaminationRecord {
  id: number
  patientDbId: number
  patientCode: string | null
  patientFirstName: string | null
  patientLastName: string | null
  paidAmount: number
  createdAt: string
  createdBy: number
  doctorFirstName: string | null
  doctorLastName: string | null
  doctorUsername: string | null
  doctorDateExamCount: number
  doctorDateTotalPaid: number
}

export default function DoctorGTPage() {
  const router = useRouter()
  const { toast } = useToast()

  // Loading & State
  const [loading, setLoading] = useState(false)
  const [records, setRecords] = useState<ExaminationRecord[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"detailed" | "grouped">("detailed")
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  // Summary totals (across ALL records, not just current page)
  const [summaryTotalPaid, setSummaryTotalPaid] = useState(0)
  const [summaryTotalExams, setSummaryTotalExams] = useState(0)
  const [summaryDoctorBreakdown, setSummaryDoctorBreakdown] = useState<{ createdBy: number; doctorName: string; examCount: number; totalPaid: number }[]>([])

  // Location selection (default to selected branch ID or "all")
  const [selectedLocationId, setSelectedLocationId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return authService.getSelectedBranchId() || authService.getLocationId() || "all"
    }
    return "all"
  })

  // Ref to track latest request ID for race conditions
  const latestRequestRef = useRef<number>(0)

  // Date filters - Default to 1st of current month to today
  const [fromDate, setFromDate] = useState<Date>(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [toDate, setToDate] = useState<Date>(new Date())

  // Authorization details
  const [isAdmin, setIsAdmin] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Edit Modal State
  const [editRecord, setEditRecord] = useState<ExaminationRecord | null>(null)
  const [editPaidAmount, setEditPaidAmount] = useState("")
  const [editCreatedAt, setEditCreatedAt] = useState("")
  const [saving, setSaving] = useState(false)

  // Check admin status and identity
  useEffect(() => {
    const user = authService.getUserInfo()
    if (user) {
      setCurrentUser(user)
      if (user.is_admin === true) {
        setIsAdmin(true)
      } else {
        const roleName = (user.role_name || user.role || user.user_type || '').toLowerCase()
        if (roleName.includes('admin')) {
          setIsAdmin(true)
        }
      }
    }
  }, [])

  // Sync with global branch selection
  useEffect(() => {
    const handleBranchChange = () => {
      const currentBranchId = authService.getSelectedBranchId()
      if (currentBranchId) {
        setSelectedLocationId(currentBranchId)
      }
    }

    window.addEventListener('branchChanged', handleBranchChange)
    return () => {
      window.removeEventListener('branchChanged', handleBranchChange)
    }
  }, [])

  // Refetch counts only when location changes
  useEffect(() => {
    fetchRecords()
  }, [selectedLocationId])

  // Reset page to 1 when filters change, then fetch
  useEffect(() => {
    setCurrentPage(1)
  }, [fromDate, toDate, selectedLocationId])

  const fetchRecords = async (page: number = currentPage) => {
    const requestId = ++latestRequestRef.current
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const params = new URLSearchParams()

      if (selectedLocationId && selectedLocationId !== "all" && selectedLocationId !== "0") {
        params.append('locationId', selectedLocationId)
      }

      if (fromDate) params.append('fromDate', format(fromDate, "yyyy-MM-dd"))
      if (toDate) params.append('toDate', format(toDate, "yyyy-MM-dd"))

      params.append('page', page.toString())
      params.append('limit', '10')

      const url = `${authService.getSettingsApiUrl()}/patient-examination/doctor-summary?${params}`

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        if (requestId === latestRequestRef.current) {
          const data = Array.isArray(result) ? result : (result.data ?? [])
          const pagination = result.pagination
          const summary = result.summary
          setRecords(data)
          if (pagination) {
            setTotalRecords(pagination.total)
            setTotalPages(pagination.totalPages)
          }
          if (summary) {
            setSummaryTotalPaid(summary.totalPaid ?? 0)
            setSummaryTotalExams(summary.totalExams ?? 0)
            setSummaryDoctorBreakdown(summary.doctorBreakdown ?? [])
          }
        }
      } else {
        if (requestId === latestRequestRef.current) {
          toast({
            variant: "destructive",
            title: "Failed to fetch",
            description: "Could not retrieve doctor examination records.",
          })
        }
      }
    } catch (error) {
      console.error("Error fetching doctor examination records:", error)
      if (requestId === latestRequestRef.current) {
        toast({
          variant: "destructive",
          title: "Network Error",
          description: "Please check your network and try again.",
        })
      }
    } finally {
      if (requestId === latestRequestRef.current) {
        setLoading(false)
      }
    }
  }

  // Re-fetch when page changes
  useEffect(() => {
    fetchRecords(currentPage)
  }, [currentPage])

  // Handle manual search (reset to page 1)
  const handleSearch = () => {
    setCurrentPage(1)
    fetchRecords(1)
  }

  // Records returned from API are already the current page slice (for the table)
  const filteredRecords = records
  const paginatedRecords = filteredRecords

  // ── Metric card values come from server summary (ALL records, not just this page) ──
  const totalCollections = summaryTotalPaid
  const totalExams = summaryTotalExams
  const activeDoctorCount = summaryDoctorBreakdown.length

  // API-based pagination — use server values
  const itemsPerPage = 10
  const activePage = currentPage

  // Helper to group records by Doctor and then Date (using only the records on the current page)
  const groupedData = paginatedRecords.reduce((acc, r) => {
    const docName = `${r.doctorFirstName || ''} ${r.doctorLastName || ''}`.trim() || r.doctorUsername || `Doctor #${r.createdBy}`
    const dateStr = format(new Date(r.createdAt), "dd/MM/yyyy")
    const groupKey = `${docName} - ${dateStr}`

    if (!acc[groupKey]) {
      acc[groupKey] = {
        doctorName: docName,
        date: dateStr,
        examCount: r.doctorDateExamCount,
        totalPaid: r.doctorDateTotalPaid,
        items: []
      }
    }
    acc[groupKey].items.push(r)
    return acc
  }, {} as Record<string, { doctorName: string; date: string; examCount: number; totalPaid: number; items: ExaminationRecord[] }>)

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // Open Edit Modal
  const handleEditClick = (record: ExaminationRecord) => {
    setEditRecord(record)
    setEditPaidAmount(record.paidAmount.toString())
    // Format date string for datetime-local input (YYYY-MM-DDTHH:MM)
    const dt = new Date(record.createdAt)
    const tzOffset = dt.getTimezoneOffset() * 60000
    const localISODate = new Date(dt.getTime() - tzOffset).toISOString().slice(0, 16)
    setEditCreatedAt(localISODate)
  }

  // Save updates via PUT
  const handleSaveUpdate = async () => {
    if (!editRecord) return
    if (isNaN(parseFloat(editPaidAmount)) || parseFloat(editPaidAmount) < 0) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Paid amount must be a positive number.",
      })
      return
    }

    try {
      setSaving(true)
      const token = localStorage.getItem('authToken')
      const url = `${authService.getSettingsApiUrl()}/patient-examination/${editRecord.id}`

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paidAmount: parseFloat(editPaidAmount),
          createdAt: new Date(editCreatedAt).toISOString(),
        }),
      })

      if (response.ok) {
        toast({
          title: "Update Successful",
          description: "The examination record has been updated.",
        })
        setEditRecord(null)
        // Refresh records in state
        fetchRecords()
      } else {
        const errText = await response.text()
        toast({
          variant: "destructive",
          title: "Update Failed",
          description: errText || "Failed to save updates to database.",
        })
      }
    } catch (error) {
      console.error("Error saving updates:", error)
      toast({
        variant: "destructive",
        title: "Network Error",
        description: "Check server connection and try again.",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <PrivateRoute modulePath="admin/doctor-management" action="view">
      <div className="p-6 space-y-6 bg-slate-50 min-h-screen text-slate-900">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors mb-2">
              <ArrowLeft className="h-4 w-4" />
              <Link href="/admin/doctor-management" className="text-sm font-medium">Back to Doctor Management</Link>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
              Doctor GT Examination Records
              <Badge className={cn("text-xs font-semibold px-2 py-0.5", isAdmin ? "bg-indigo-600 text-white" : "bg-teal-600 text-white")}>
                {isAdmin ? "Admin View" : "Doctor View"}
              </Badge>
            </h1>
            <p className="text-slate-500 mt-1">Aggregated and detailed financial summary of patient examinations</p>
          </div>

          <Button
            variant="outline"
            className="self-start md:self-auto h-10 border-slate-200 shadow-sm bg-white hover:bg-slate-50 transition-colors"
            onClick={fetchRecords}
            disabled={loading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2 text-slate-500", loading && "animate-spin")} />
            Refresh Data
          </Button>
        </div>

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-200/80 shadow-sm bg-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Collection</p>
                  <p className="text-3xl font-extrabold text-slate-900 mt-1">₹{totalCollections.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-4 text-xs font-medium text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Aggregated paid amount for period</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 shadow-sm bg-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Examinations</p>
                  <p className="text-3xl font-extrabold text-slate-900 mt-1">{totalExams}</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <CalendarCheck className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-4 text-xs font-medium text-blue-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Completed patient records</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 shadow-sm bg-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Doctors</p>
                  <p className="text-3xl font-extrabold text-slate-900 mt-1">{activeDoctorCount}</p>
                </div>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <Users className="h-6 w-6" />
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-4 text-xs font-medium text-indigo-600">
                <Users className="h-3.5 w-3.5" />
                <span>Doctors with records in period</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Doctor Total Summaries Grid — always reflects ALL records in the date range */}
        {summaryDoctorBreakdown.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 px-1">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              {isAdmin ? "Collections Grouped by Doctor" : "My Collections"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {summaryDoctorBreakdown.map((doc) => (
                <Card key={doc.createdBy} className="border-slate-200/80 bg-white hover:shadow-md transition-all">
                  <CardContent className="p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800 truncate" title={doc.doctorName}>{doc.doctorName}</p>
                      <p className="text-xs text-slate-400">{doc.examCount} examinations</p>
                    </div>
                    <div className="text-right shrink-0 whitespace-nowrap">
                      <p className="font-extrabold text-emerald-600">₹{doc.totalPaid.toLocaleString('en-IN')}</p>
                      <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded mt-1 inline-block">Total Paid</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Filters Card */}
        <Card className="border-slate-200/80 shadow-sm bg-white">
          <CardContent className="p-5">
            <div className="flex flex-col lg:flex-row gap-4 items-end justify-between">

              {/* Left Group - Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full lg:w-auto flex-1">
                {/* From Date */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <CalendarIcon className="h-3.5 w-3.5 text-indigo-500" />
                    From Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full h-10 justify-start text-left font-normal border-slate-200 hover:bg-slate-50 transition-colors",
                          !fromDate && "text-slate-400"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
                        {fromDate ? format(fromDate, "dd/MM/yyyy") : <span>Select From Date</span>}
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

                {/* To Date */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <CalendarIcon className="h-3.5 w-3.5 text-indigo-500" />
                    To Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full h-10 justify-start text-left font-normal border-slate-200 hover:bg-slate-50 transition-colors",
                          !toDate && "text-slate-400"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
                        {toDate ? format(toDate, "dd/MM/yyyy") : <span>Select To Date</span>}
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

                {/* Text Filter */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Search className="h-3.5 w-3.5 text-indigo-500" />
                    Search Local Filter
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Doctor, patient name/code..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-10 border-slate-200 shadow-none focus-visible:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Right Group - Buttons & Switcher */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch">
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="h-10 px-6 bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-md hover:shadow-lg transition-all"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>

                {/* View switcher toggle */}
                <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1">
                  <button
                    onClick={() => setViewMode("detailed")}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-md transition-all",
                      viewMode === "detailed" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    <List className="h-4 w-4" />
                    Detailed
                  </button>
                  <button
                    onClick={() => setViewMode("grouped")}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-md transition-all",
                      viewMode === "grouped" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    Grouped
                  </button>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Data Board */}
        <Card className="border-slate-200/80 shadow-sm bg-white">
          <CardContent className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
                <RefreshCw className="h-8 w-8 animate-spin text-indigo-500" />
                <p className="font-medium animate-pulse">Loading examination records...</p>
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2.5">
                <AlertCircle className="h-10 w-10 text-slate-300" />
                <p className="font-semibold text-slate-500 text-lg">No examination records found</p>
                <p className="text-sm text-slate-400 text-center max-w-sm">No records match the selected date filters or search parameters.</p>
              </div>
            ) : viewMode === "detailed" ? (
              // Detailed Table
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-slate-200 bg-slate-50">
                      <TableHead className="font-bold text-slate-600">Patient ID</TableHead>
                      <TableHead className="font-bold text-slate-600">Created by (doctor/user name)</TableHead>
                      <TableHead className="font-bold text-slate-600">Amount paid (paid_amount)</TableHead>
                      <TableHead className="font-bold text-slate-600">Created at (date/timestamp)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRecords.map((record) => {
                      const patientName = `${record.patientFirstName || ''} ${record.patientLastName || ''}`.trim() || 'N/A'
                      const doctorName = `${record.doctorFirstName || ''} ${record.doctorLastName || ''}`.trim() || record.doctorUsername || 'N/A'
                      return (
                        <TableRow key={record.id} className="border-slate-100 hover:bg-slate-50/50">
                          <TableCell className="font-medium">
                            <span className="text-slate-900 font-bold block">{record.patientCode || 'N/A'}</span>
                            <span className="text-xs text-slate-500">{patientName}</span>
                          </TableCell>
                          <TableCell className="text-slate-700 font-semibold">{doctorName}</TableCell>
                          <TableCell className="font-bold text-emerald-600">₹{record.paidAmount.toFixed(2)}</TableCell>
                          <TableCell className="text-slate-600 font-medium">
                            {format(new Date(record.createdAt), "dd/MM/yyyy hh:mm a")}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              // Grouped Tree/Accordion View
              <div className="space-y-4">
                {Object.entries(groupedData).map(([key, group]) => {
                  const isExpanded = !!expandedGroups[key]
                  return (
                    <div key={key} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white">

                      {/* Accordion Trigger */}
                      <button
                        onClick={() => toggleGroup(key)}
                        className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border-b border-slate-100 text-left hover:bg-slate-100/60 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-slate-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-slate-500" />
                          )}
                          <div>
                            <span className="font-bold text-slate-800 text-base">{group.doctorName}</span>
                            <span className="text-slate-400 mx-2">|</span>
                            <span className="font-semibold text-slate-600 text-sm">{group.date}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-5 mt-2 sm:mt-0">
                          <Badge className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 px-2.5 py-1">
                            {group.examCount} Examinations
                          </Badge>
                          <span className="font-extrabold text-emerald-600 text-lg">
                            ₹{group.totalPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </button>

                      {/* Accordion Content */}
                      {isExpanded && (
                        <div className="p-4 bg-white overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="hover:bg-transparent border-slate-200 bg-slate-50/50">
                                <TableHead className="font-bold text-slate-500 text-xs uppercase">Patient ID</TableHead>
                                <TableHead className="font-bold text-slate-500 text-xs uppercase">Created At</TableHead>
                                <TableHead className="font-bold text-slate-500 text-xs uppercase">Paid Amount</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {group.items.map((record) => {
                                const patientName = `${record.patientFirstName || ''} ${record.patientLastName || ''}`.trim() || 'N/A'
                                return (
                                  <TableRow key={record.id} className="border-slate-100 hover:bg-slate-50/30">
                                    <TableCell className="font-medium">
                                      <span className="text-slate-900 font-bold block">{record.patientCode || 'N/A'}</span>
                                      <span className="text-xs text-slate-500">{patientName}</span>
                                    </TableCell>
                                    <TableCell className="text-slate-600 font-medium">
                                      {format(new Date(record.createdAt), "hh:mm a")}
                                    </TableCell>
                                    <TableCell className="font-bold text-emerald-600">₹{record.paidAmount.toFixed(2)}</TableCell>
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* API-based Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-100 bg-white px-2 pt-6 mt-6">
                {/* Mobile */}
                <div className="flex flex-1 justify-between sm:hidden">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={activePage === 1 || loading}
                    variant="outline"
                    className="border-slate-200 text-slate-700"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={activePage === totalPages || loading}
                    variant="outline"
                    className="border-slate-200 text-slate-700"
                  >
                    Next
                  </Button>
                </div>
                {/* Desktop */}
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">
                      Showing{" "}
                      <span className="font-bold text-slate-800">{(activePage - 1) * itemsPerPage + 1}</span>
                      {" "}to{" "}
                      <span className="font-bold text-slate-800">
                        {Math.min(activePage * itemsPerPage, totalRecords)}
                      </span>
                      {" "}of{" "}
                      <span className="font-bold text-slate-800">{totalRecords}</span> records
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-none gap-1" aria-label="Pagination">
                      <Button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={activePage === 1 || loading}
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0 rounded-lg border-slate-200 hover:bg-slate-50"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>

                      {Array.from({ length: totalPages }).map((_, index) => {
                        const pageNum = index + 1
                        if (totalPages > 7 && Math.abs(pageNum - activePage) > 2 && pageNum !== 1 && pageNum !== totalPages) {
                          if (pageNum === activePage - 2 || pageNum === activePage + 2) {
                            return <span key={pageNum} className="px-2 py-1 text-slate-400 self-center">...</span>
                          }
                          return null
                        }
                        return (
                          <Button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            disabled={loading}
                            variant={activePage === pageNum ? "default" : "outline"}
                            size="sm"
                            className={cn(
                              "h-9 w-9 rounded-lg font-bold",
                              activePage === pageNum
                                ? "bg-slate-900 text-white hover:bg-slate-800"
                                : "border-slate-200 text-slate-600 hover:bg-slate-50"
                            )}
                          >
                            {pageNum}
                          </Button>
                        )
                      })}

                      <Button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={activePage === totalPages || loading}
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0 rounded-lg border-slate-200 hover:bg-slate-50"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Modal / Dialog */}
        <Dialog open={!!editRecord} onOpenChange={(open) => !open && setEditRecord(null)}>
          <DialogContent className="sm:max-w-[425px] bg-white border border-slate-200 shadow-2xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Edit className="h-5 w-5 text-indigo-500" />
                Edit Examination Record
              </DialogTitle>
              <p className="text-xs text-slate-500">Modify details for examination ID: {editRecord?.id}</p>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {/* Display Patient info */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Patient Detail</span>
                <p className="text-sm font-bold text-slate-800">
                  {editRecord?.patientCode || 'N/A'} - {`${editRecord?.patientFirstName || ''} ${editRecord?.patientLastName || ''}`.trim() || 'N/A'}
                </p>
              </div>

              {/* Display Doctor info */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Doctor / Created By</span>
                <p className="text-sm font-semibold text-slate-700">
                  {`${editRecord?.doctorFirstName || ''} ${editRecord?.doctorLastName || ''}`.trim() || editRecord?.doctorUsername || 'N/A'}
                </p>
              </div>

              {/* Editable Paid Amount */}
              <div className="space-y-2">
                <Label htmlFor="paidAmount" className="text-sm font-bold text-slate-700">Amount Paid (₹)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                  <Input
                    id="paidAmount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={editPaidAmount}
                    onChange={(e) => setEditPaidAmount(e.target.value)}
                    className="pl-7 border-slate-200 focus-visible:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Editable Created At (date-time) */}
              <div className="space-y-2">
                <Label htmlFor="createdAt" className="text-sm font-bold text-slate-700">Created At (Date & Time)</Label>
                <Input
                  id="createdAt"
                  type="datetime-local"
                  value={editCreatedAt}
                  onChange={(e) => setEditCreatedAt(e.target.value)}
                  className="border-slate-200 focus-visible:ring-indigo-500"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                className="border-slate-200 bg-transparent hover:bg-slate-50"
                onClick={() => setEditRecord(null)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                onClick={handleSaveUpdate}
                disabled={saving}
              >
                {saving && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </PrivateRoute>
  )
}

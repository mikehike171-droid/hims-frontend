"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Search,
  RefreshCw,
  PhoneCall,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react"
import authService from "@/lib/authService"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

// ─── Helpers ──────────────────────────────────────────────────
const safeFormatDate = (dateString: string, formatStr: string) => {
  try {
    if (!dateString) return "—"
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return "—"
    return format(d, formatStr)
  } catch {
    return "—"
  }
}

const maskPhoneNumber = (phone: string) => {
  if (!phone || phone === "N/A") return "******9999"
  const digits = phone.replace(/\D/g, "")
  if (digits.length <= 4) return "******" + digits
  return "******" + digits.slice(-4)
}

export default function OnlinePatientsPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  // Pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)

  const fetchingRef = useRef(false)

  // ─── Fetch Patients from settings API ─────────────────────────
  const fetchPatients = async (pageNum = page) => {
    fetchingRef.current = true
    setLoading(true)
    try {
      const token = localStorage.getItem("authToken")
      const locationId = authService.getLocationId()

      const params = new URLSearchParams()
      params.append("source", "Online Lead")
      if (locationId) params.append("locationId", locationId)

      const res = await fetch(
        `${authService.getSettingsApiUrl()}/patients?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      if (res.ok) {
        const result = await res.json()
        let dataList = Array.isArray(result) ? result : (result.data || [])
        
        // Client-side filtering because backend getPatientsBySourceString doesn't filter/paginate
        if (searchTerm.trim()) {
          const lowerSearch = searchTerm.toLowerCase()
          dataList = dataList.filter((p: any) => {
            const name = `${p.firstName || p.first_name || ""} ${p.lastName || p.last_name || ""}`.toLowerCase()
            const phone = (p.mobile || p.mobileNumber || p.mobile_number || "")
            const pid = String(p.patientId || p.patient_id || "").toLowerCase()
            return name.includes(lowerSearch) || phone.includes(searchTerm) || pid.includes(lowerSearch)
          })
        }

        if (fromDate) {
          const from = new Date(fromDate)
          dataList = dataList.filter((p: any) => {
            const created = new Date(p.createdAt || p.created_at)
            return created >= from
          })
        }

        if (toDate) {
          const to = new Date(toDate)
          to.setHours(23, 59, 59, 999)
          dataList = dataList.filter((p: any) => {
            const created = new Date(p.createdAt || p.created_at)
            return created <= to
          })
        }

        const total = dataList.length
        const start = (pageNum - 1) * 10
        const end = start + 10

        setPatients(dataList.slice(start, end))
        setPage(pageNum)
        setTotalPages(Math.ceil(total / 10) || 1)
        setTotalRecords(total)
      } else {
        setPatients([])
      }
    } catch (error) {
      console.error("Error fetching patients:", error)
      setPatients([])
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }

  useEffect(() => {
    fetchPatients(1)
  }, [])

  const getPatientName = (p: any) => {
    if (p.name) return p.name
    return `${p.firstName || p.first_name || ""} ${p.lastName || p.last_name || ""}`.trim() || "Unknown Patient"
  }

  const getPageNumbers = () => {
    const pages = []
    const win = 7
    let start = Math.max(1, page - Math.floor(win / 2))
    let end = Math.min(totalPages, start + win - 1)
    if (end - start + 1 < win) start = Math.max(1, end - win + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Online Leads</h1>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Filter className="h-5 w-5 mr-2 text-[#1B7A43]" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label>Search Patient</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchPatients(1)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* From Date */}
            <div className="space-y-2">
              <Label>From Date</Label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border-gray-200"
              />
            </div>

            {/* To Date */}
            <div className="space-y-2">
              <Label>To Date</Label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border-gray-200"
              />
            </div>

            {/* Action Button */}
            <div className="flex items-end">
              <Button className="w-full" onClick={() => fetchPatients(1)}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Online Leads ({totalRecords})</CardTitle>
          <CardDescription className="text-sm">
            List of all online leads under your location
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 mx-auto mb-4 text-gray-400 animate-spin" />
              <p className="text-gray-500">Loading patients...</p>
            </div>
          ) : (
            <>
              {/* Mobile View */}
              <div className="block lg:hidden">
                <div className="space-y-4 p-4">
                  {patients.map((patient) => (
                    <Card key={patient.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-emerald-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{getPatientName(patient)}</p>
                                <p className="text-xs text-gray-500">{patient.patientId || patient.patient_id || `ID: ${patient.id}`}</p>
                              </div>
                            </div>
                            {patient.gender && (
                              <Badge variant="outline" className="capitalize text-xs">
                                {patient.gender}
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 text-xs">Mobile Number</p>
                              <p className="font-medium">{maskPhoneNumber(patient.mobile || patient.mobileNumber)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Date of Birth</p>
                              <p className="font-medium">{safeFormatDate(patient.dateOfBirth || patient.date_of_birth, "dd/MM/yyyy")}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-end pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                              onClick={() => router.push(`/admin/telecaller/call-patient?patientId=${patient.id}`)}
                            >
                              <PhoneCall className="h-4 w-4 mr-2" />
                              Call Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Desktop View */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Date of Birth</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patients.map((patient) => (
                      <TableRow key={patient.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium">
                          {patient.patientId || patient.patient_id || `ID: ${patient.id}`}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
                              <User className="h-4 w-4 text-emerald-600" />
                            </div>
                            <span className="font-medium text-sm">{getPatientName(patient)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {maskPhoneNumber(patient.mobile || patient.mobileNumber)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize text-xs">
                            {patient.gender || "—"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {safeFormatDate(patient.dateOfBirth || patient.date_of_birth, "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell className="text-sm">
                          {safeFormatDate(patient.createdAt || patient.created_at, "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-emerald-600 border-emerald-600 hover:bg-emerald-50 h-8 px-3"
                            onClick={() => router.push(`/admin/telecaller/call-patient?patientId=${patient.id}`)}
                            title="Call Patient"
                          >
                            <PhoneCall className="h-4 w-4 mr-2" />
                            Call
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          {/* Empty State */}
          {patients.length === 0 && !loading && (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No patients found</p>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalRecords > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t gap-4 bg-slate-50/50">
              <div className="text-sm text-gray-600">
                Showing {Math.min((page - 1) * 10 + 1, totalRecords)} to{" "}
                {Math.min(page * 10, totalRecords)} of {totalRecords} patients
              </div>
              <div className="flex gap-2 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchPatients(page - 1)}
                  disabled={page === 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Prev
                </Button>
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((pNum) => (
                    <Button
                      key={pNum}
                      variant={page === pNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => fetchPatients(pNum)}
                      disabled={loading}
                      className="w-9"
                    >
                      {pNum}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchPatients(page + 1)}
                  disabled={page >= totalPages || loading}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
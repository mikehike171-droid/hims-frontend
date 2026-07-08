"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  User,
  Search,
  RefreshCw,
  PhoneCall,
  ChevronLeft,
  ChevronRight,
  Filter,
  Edit2,
  CheckCircle,
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
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  // Edit Enquiry state
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [editReason, setEditReason] = useState("")

  // Pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)

  const fetchingRef = useRef(false)

  // ─── Fetch Enquiries from settings API ─────────────────────────
  const fetchEnquiries = async (pageNum = page) => {
    fetchingRef.current = true
    setLoading(true)
    try {
      const token = localStorage.getItem("authToken")

      const res = await fetch(
        `${authService.getSettingsApiUrl()}/enquiry`,
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
        
        // Client-side filtering
        if (searchTerm.trim()) {
          const lowerSearch = searchTerm.toLowerCase()
          dataList = dataList.filter((p: any) => {
            const name = (p.name || "").toLowerCase()
            const phone = (p.phone || "")
            const pid = String(p.id || "").toLowerCase()
            const problems = (p.medical_problems || "").toLowerCase()
            return name.includes(lowerSearch) || phone.includes(searchTerm) || pid.includes(lowerSearch) || problems.includes(lowerSearch)
          })
        }

        if (fromDate) {
          const from = new Date(fromDate)
          dataList = dataList.filter((p: any) => {
            const created = new Date(p.created_at || p.createdAt)
            return created >= from
          })
        }

        if (toDate) {
          const to = new Date(toDate)
          to.setHours(23, 59, 59, 999)
          dataList = dataList.filter((p: any) => {
            const created = new Date(p.created_at || p.createdAt)
            return created <= to
          })
        }

        const total = dataList.length
        const start = (pageNum - 1) * 10
        const end = start + 10

        setEnquiries(dataList.slice(start, end))
        setPage(pageNum)
        setTotalPages(Math.ceil(total / 10) || 1)
        setTotalRecords(total)
      } else {
        setEnquiries([])
      }
    } catch (error) {
      console.error("Error fetching enquiries:", error)
      setEnquiries([])
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }

  useEffect(() => {
    fetchEnquiries(1)
  }, [])

  const getPageNumbers = () => {
    const pages = []
    const win = 7
    let start = Math.max(1, page - Math.floor(win / 2))
    let end = Math.min(totalPages, start + win - 1)
    if (end - start + 1 < win) start = Math.max(1, end - win + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  const handleOpenEdit = (enquiry: any) => {
    setSelectedEnquiry(enquiry)
    setEditName(enquiry.name || "")
    setEditPhone(enquiry.phone || "")
    setEditReason(enquiry.medical_problems || "")
    setEditOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedEnquiry) return
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch(
        `${authService.getSettingsApiUrl()}/enquiry/${selectedEnquiry.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editName,
            phone: editPhone,
            medical_problems: editReason,
          }),
        }
      )

      if (res.ok) {
        setEditOpen(false)
        fetchEnquiries(page)
      } else {
        alert("Failed to update enquiry")
      }
    } catch (error) {
      console.error("Error updating enquiry:", error)
      alert("Error updating enquiry")
    }
  }

  const handleMarkRead = async (id: number) => {
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch(
        `${authService.getSettingsApiUrl()}/enquiry/${id}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      if (res.ok) {
        fetchEnquiries(page)
      }
    } catch (error) {
      console.error("Error marking enquiry read:", error)
    }
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Online Enquiries</h1>
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
              <Label>Search Enquiry</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, phone or concern..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && fetchEnquiries(1)}
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
              <Button className="w-full" onClick={() => fetchEnquiries(1)}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enquiries Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Online Enquiries ({totalRecords})</CardTitle>
          <CardDescription className="text-sm">
            List of all public online enquiries received from the landing page.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="h-8 w-8 mx-auto mb-4 text-gray-400 animate-spin" />
              <p className="text-gray-500">Loading enquiries...</p>
            </div>
          ) : (
            <>
              {/* Mobile View */}
              <div className="block lg:hidden">
                <div className="space-y-4 p-4">
                  {enquiries.map((enquiry) => (
                    <Card key={enquiry.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-emerald-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{enquiry.name || "Anonymous"}</p>
                              </div>
                            </div>
                            <Badge variant={enquiry.userview === "read" ? "secondary" : "default"} className="capitalize text-xs">
                              {enquiry.userview || "unread"}
                            </Badge>
                          </div>

                          <div className="space-y-1 text-sm">
                            <p className="text-gray-500 text-xs">Concern</p>
                            <p className="font-medium">{enquiry.medical_problems || "—"}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 text-xs">Phone Number</p>
                              <p className="font-medium">{enquiry.phone || "—"}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs">Created Date</p>
                              <p className="font-medium">{safeFormatDate(enquiry.created_at, "dd/MM/yyyy")}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-2 border-t mt-2">
                            {enquiry.userview !== "read" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-gray-600 hover:text-gray-900"
                                onClick={() => handleMarkRead(enquiry.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Mark Read
                              </Button>
                            )}
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                              onClick={() => router.push(`/admin/telecaller/call-patient?patientId=${enquiry.id}&type=enquiry`)}
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
                      <TableHead>Name</TableHead>
                      <TableHead>Phone Number</TableHead>
                      <TableHead>Concern / Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enquiries.map((enquiry) => (
                      <TableRow key={enquiry.id} className="hover:bg-slate-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
                              <User className="h-4 w-4 text-emerald-600" />
                            </div>
                            <span className="font-medium text-sm">{enquiry.name || "Anonymous"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                           {enquiry.phone || "—"}
                        </TableCell>
                        <TableCell className="text-sm max-w-[200px] truncate" title={enquiry.medical_problems}>
                          {enquiry.medical_problems || "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={enquiry.userview === "read" ? "secondary" : "default"} className="capitalize text-xs">
                            {enquiry.userview || "unread"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {safeFormatDate(enquiry.created_at, "dd/MM/yyyy hh:mm a")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {enquiry.userview !== "read" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 px-2 text-gray-500 hover:text-gray-800"
                                onClick={() => handleMarkRead(enquiry.id)}
                                title="Mark as Read"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 px-3"
                              onClick={() => router.push(`/admin/telecaller/call-patient?patientId=${enquiry.id}&type=enquiry`)}
                              title="Call Lead"
                            >
                              <PhoneCall className="h-4 w-4 mr-2" />
                              Call
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}

          {/* Empty State */}
          {enquiries.length === 0 && !loading && (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No enquiries found</p>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalRecords > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t gap-4 bg-slate-50/50">
              <div className="text-sm text-gray-600">
                Showing {Math.min((page - 1) * 10 + 1, totalRecords)} to{" "}
                {Math.min(page * 10, totalRecords)} of {totalRecords} enquiries
              </div>
              <div className="flex gap-2 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchEnquiries(page - 1)}
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
                      onClick={() => fetchEnquiries(pNum)}
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
                  onClick={() => fetchEnquiries(page + 1)}
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

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Enquiry Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reason">Concern / Reason of Visit</Label>
              <Textarea
                id="reason"
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
                rows={4}
                className="w-full resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="bg-[#1B7A43] hover:bg-[#155e34] text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
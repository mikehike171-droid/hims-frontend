"use client"

import { useState, useEffect, useCallback } from "react"
import authService from "@/lib/authService"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { CheckCircle, XCircle, Clock, Search, CheckCircle2, Eye } from "lucide-react"
import { format } from "date-fns"
import PrivateRoute from "@/components/auth/PrivateRoute"

interface LeaveApplication {
  id: number
  userId: number
  date: string
  status: string
  leave_type: string
  leave_status: string
  remarks: string
  user: {
    firstName: string
    lastName: string
    employeeId: string
  }
}

export default function LeavesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<LeaveApplication | null>(null)
  const [leaveApplications, setLeaveApplications] = useState<LeaveApplication[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize] = useState(10)

  const fetchLeaveApplications = useCallback(async (page: number = 1, searchFromDate?: string, searchToDate?: string, status?: string) => {
    try {
      setLoading(true)
      const selectedBranchId = authService.getSelectedBranchId()
      const token = authService.getCurrentToken()
      const apiUrl = authService.getSettingsApiUrl()

      if (!selectedBranchId || !token) {
        setLeaveApplications([])
        return
      }

      const params = new URLSearchParams({
        locationId: selectedBranchId,
        page: page.toString(),
        limit: pageSize.toString()
      })

      if (searchFromDate) params.append('fromDate', searchFromDate)
      if (searchToDate) params.append('toDate', searchToDate)

      const response = await fetch(`${apiUrl}/attendance/leaves?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          setLeaveApplications(data)
          setTotalPages(1)
        } else {
          setLeaveApplications(data.data || [])
          setTotalPages(data.totalPages || 1)
        }
        setCurrentPage(page)
      } else {
        throw new Error('Failed to fetch leave applications')
      }
    } catch (error) {
      console.error('Error fetching leave applications:', error)
      toast({
        title: "Error",
        description: "Failed to fetch leave applications",
        variant: "destructive",
      })
      setLeaveApplications([])
    } finally {
      setLoading(false)
    }
  }, [pageSize])

  useEffect(() => {
    fetchLeaveApplications(1)
  }, [fetchLeaveApplications])

  const displayApplications = leaveApplications

  const handleViewApplication = (application: LeaveApplication) => {
    setSelectedApplication(application)
    setViewDialogOpen(true)
  }

  const handleApproveLeave = async (attendanceId: number) => {
    try {
      setLoading(true)
      const token = authService.getCurrentToken()
      const apiUrl = authService.getSettingsApiUrl()

      if (!token) return

      const response = await fetch(`${apiUrl}/attendance/${attendanceId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leave_status: 'Approved' })
      })

      if (response.ok) {
        toast({
          title: "Leave Approved",
          description: "Leave application has been approved successfully.",
        })
        fetchLeaveApplications(currentPage)
      } else {
        throw new Error('Failed to approve leave')
      }
    } catch (error) {
      console.error('Error approving leave:', error)
      toast({
        title: "Error",
        description: "Failed to approve leave application",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRejectLeave = async (attendanceId: number) => {
    try {
      setLoading(true)
      const token = authService.getCurrentToken()
      const apiUrl = authService.getSettingsApiUrl()

      if (!token) return

      const response = await fetch(`${apiUrl}/attendance/${attendanceId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leave_status: 'Rejected' })
      })

      if (response.ok) {
        toast({
          title: "Leave Rejected",
          description: "Leave application has been rejected.",
          variant: "destructive",
        })
        fetchLeaveApplications(currentPage)
      } else {
        throw new Error('Failed to reject leave')
      }
    } catch (error) {
      console.error('Error rejecting leave:', error)
      toast({
        title: "Error",
        description: "Failed to reject leave application",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  const stats = {
    total: displayApplications.length,
    pending: displayApplications.filter((app) => app.leave_status?.toLowerCase() === "pending").length,
    approved: displayApplications.filter((app) => app.leave_status?.toLowerCase() === "approved").length,
    rejected: displayApplications.filter((app) => app.leave_status?.toLowerCase() === "rejected").length,
  }

  return (
    <PrivateRoute modulePath="admin/attendance-management/leaves" action="view">
      <div className="p-6 space-y-4 max-w-[1400px] mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Leave Applications</h1>
          <p className="text-gray-600">View and manage all employee leave requests</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-purple-50 border border-gray-200 rounded-lg p-4">
            <CardContent className="p-0">
              <div className="text-sm text-purple-600 font-medium mb-1">Total Applications</div>
              <div className="text-3xl font-bold text-purple-700">{stats.total}</div>
              <div className="text-xs text-purple-600 mt-1">Applications</div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <CardContent className="p-0">
              <div className="text-sm text-yellow-600 font-medium mb-1">Pending</div>
              <div className="text-3xl font-bold text-yellow-700">{stats.pending}</div>
              <div className="text-xs text-yellow-600 mt-1">Applications</div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border border-green-200 rounded-lg p-4">
            <CardContent className="p-0">
              <div className="text-sm text-green-600 font-medium mb-1">Approved</div>
              <div className="text-3xl font-bold text-green-700">{stats.approved}</div>
              <div className="text-xs text-green-600 mt-1">Applications</div>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border border-red-200 rounded-lg p-4">
            <CardContent className="p-0">
              <div className="text-sm text-red-600 font-medium mb-1">Rejected</div>
              <div className="text-3xl font-bold text-red-700">{stats.rejected}</div>
              <div className="text-xs text-red-600 mt-1">Applications</div>
            </CardContent>
          </Card>
        </div>


        <Card className="flex gap-0">
          <CardHeader>
            <div className="flex items-center justify-between mb-3">
              {/* Left: Card Title */}
              <CardTitle className="text-left">
                Leave Applications ({displayApplications.length})
              </CardTitle>

              {/* Right: Filters in single row */}
              <div className="flex items-center gap-2">
                {/* Date Filters */}
                <Input
                  type="date"
                  placeholder="mm/dd/yyyy"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="h-9 w-36 text-sm"
                />
                <span className="text-gray-500 text-sm">to</span>
                <Input
                  type="date"
                  placeholder="mm/dd/yyyy"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="h-9 w-36 text-sm"
                />
                <Button
                  onClick={() => fetchLeaveApplications(1, fromDate, toDate)}
                  className="h-9 px-4 bg-black text-white hover:bg-gray-800"
                  disabled={loading}
                >
                  Search
                </Button>




              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-nowrap">
                      Employee Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-nowrap">
                      From Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-nowrap">
                      To Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-nowrap">
                      Leave Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-nowrap">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-nowrap">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayApplications.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                        No applications found
                      </td>
                    </tr>
                  ) : (
                    displayApplications.map((application) => (
                      <tr key={application.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {`${application.user?.firstName} ${application.user?.lastName}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {format(new Date(application.date), "dd MMM yyyy")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {format(new Date(application.date), "dd MMM yyyy")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-[120px] truncate">
                          {application.leave_type}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {application.remarks}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(application.leave_status || 'pending')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 items-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewApplication(application)}
                              className="h-7 px-2 text-xs bg-gray-600 text-white hover:bg-gray-600 hover:text-white"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            {application.leave_status?.toLowerCase() === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white h-7 px-2 text-xs"
                                  onClick={() => handleApproveLeave(application.id)}
                                  disabled={loading}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="h-7 px-2 text-xs"
                                  onClick={() => handleRejectLeave(application.id)}
                                  disabled={loading}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => !loading && fetchLeaveApplications(currentPage - 1, fromDate, toDate)}
                  disabled={currentPage === 1 || loading}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => !loading && fetchLeaveApplications(page, fromDate, toDate)}
                    disabled={loading}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => !loading && fetchLeaveApplications(currentPage + 1, fromDate, toDate)}
                  disabled={currentPage === totalPages || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* View Application Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Leave Application Details</DialogTitle>
            </DialogHeader>
            {selectedApplication && (
              <div className="space-y-6">
                {/* Employee Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Employee Name</label>
                    <p className="text-sm text-gray-900">
                      {`${selectedApplication.user?.firstName} ${selectedApplication.user?.lastName}`}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Employee ID</label>
                    <p className="text-sm text-gray-900">
                      {selectedApplication.user?.employeeId}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">User ID</label>
                    <p className="text-sm text-gray-900">{selectedApplication.userId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Leave Date</label>
                    <p className="text-sm text-gray-900">
                      {format(new Date(selectedApplication.date), "dd MMM yyyy")}
                    </p>
                  </div>
                </div>

                {/* Leave Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Leave Type</label>
                    <p className="text-sm text-gray-900">
                      {selectedApplication.leave_type || 'General'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                      {getStatusBadge(selectedApplication.leave_status || 'pending')}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Attendance Status</label>
                    <p className="text-sm text-gray-900">
                      {selectedApplication.status}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Record ID</label>
                    <p className="text-sm text-gray-900">{selectedApplication.id}</p>
                  </div>
                </div>

                {/* Remarks */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Remarks/Description</label>
                    <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-md">
                      {selectedApplication.remarks || 'No remarks provided'}
                    </p>
                  </div>
                </div>


              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PrivateRoute>
  )
}

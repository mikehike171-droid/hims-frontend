"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Search, Download, X } from "lucide-react"
import { format } from "date-fns"
import { attendanceApi } from "@/lib/attendanceApi"
import { settingsApi } from "@/lib/settingsApi"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { useBranch } from "@/contexts/branch-context"

interface ReportData {
  userId: number
  userName: string
  attendanceDays: number
  leaves: number
}

export default function AttendanceReportPage() {
  const [reportData, setReportData] = useState<ReportData[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fromMonth, setFromMonth] = useState(format(new Date(), 'yyyy-MM'))
  const [toMonth, setToMonth] = useState(format(new Date(), 'yyyy-MM'))
  const [hasSearched, setHasSearched] = useState(false)
  const [searchedDateRange, setSearchedDateRange] = useState<{from: string, to: string} | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<string>('all')
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [pageSize] = useState(10)

  const { currentBranch } = useBranch()
  const locationId = currentBranch?.id ? parseInt(currentBranch.id) : null

  const fetchDepartments = async () => {
    if (!locationId) return
    try {
      const data = await settingsApi.getDepartments(locationId)
      setDepartments(data || [])
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch departments", variant: "destructive" })
    }
  }

  const fetchUsers = async (departmentId?: string) => {
    if (!locationId) return
    try {
      const deptId = departmentId && departmentId !== 'all' ? departmentId : undefined
      const data = await settingsApi.getUsers(locationId.toString(), 1, 100, deptId)
      setUsers(data.users || data.data || [])
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch users", variant: "destructive" })
    }
  }

  const fetchAttendanceReport = async (page: number = 1) => {
    if (!locationId) return
    
    setLoading(true)
    try {
      const userId = selectedUser === 'all' ? undefined : parseInt(selectedUser)
      const data = await attendanceApi.getAttendanceReport(locationId, fromMonth, toMonth, userId, page, pageSize)
      if (data.data) {
        setReportData(data.data)
        setTotalPages(data.totalPages || 1)
        setTotalRecords(data.totalRecords || 0)
        setCurrentPage(page)
      } else {
        setReportData(data)
        setTotalPages(1)
        setTotalRecords(data.length)
        setCurrentPage(1)
      }
      setHasSearched(true)
      setSearchedDateRange({ from: fromMonth, to: toMonth })
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch report", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const filteredData = reportData

  const exportToExcel = () => {
    if (filteredData.length === 0) {
      toast({ title: "No Data", description: "No data available to export", variant: "destructive" })
      return
    }

    const csvContent = [
      ['User Name', 'Working Days', 'Leaves'],
      ...filteredData.map(item => [
        item.userName,
        item.attendanceDays,
        item.leaves
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `attendance-report-${format(new Date(fromMonth), 'MMM-yyyy')}-to-${format(new Date(toMonth), 'MMM-yyyy')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    if (locationId) {
      fetchDepartments()
      fetchUsers()
      fetchAttendanceReport(1)
    }
  }, [locationId])

  useEffect(() => {
    fetchUsers(selectedDepartment)
    setSelectedUser('all')
    setUserSearchTerm('')
  }, [selectedDepartment])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.user-search-container')) {
        setShowUserDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <PrivateRoute modulePath="admin/attendance-management/summary" action="view">
      <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Attendance Summary</h1>
          <p className="text-muted-foreground">View user-wise attendance data</p>
        </div>

        <Card>
          <CardHeader>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex space-x-4">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-gray-700">Department</label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-2 space-y-2">
                  <label className="text-sm font-medium text-gray-700">User</label>
                  <div className="relative user-search-container">
                    <Input
                      placeholder="Search user..."
                      value={userSearchTerm}
                      onChange={(e) => {
                        setUserSearchTerm(e.target.value)
                        setShowUserDropdown(true)
                        if (e.target.value === '') {
                          setSelectedUser('all')
                        }
                      }}
                      onFocus={() => setShowUserDropdown(true)}
                      className="h-10 pr-8 text-sm"
                    />
                    {userSearchTerm && (
                      <button
                        onClick={() => {
                          setUserSearchTerm('')
                          setSelectedUser('all')
                          setShowUserDropdown(false)
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    {showUserDropdown && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 shadow-lg max-h-48 overflow-y-auto">
                        <div
                          onClick={() => {
                            setSelectedUser('all')
                            setUserSearchTerm('')
                            setShowUserDropdown(false)
                          }}
                          className="py-2 px-3 cursor-pointer hover:bg-gray-50 border-b"
                        >
                          <div className="text-sm">All Users</div>
                        </div>
                        {users
                          .filter(user => 
                            userSearchTerm === '' || 
                            `${user.firstName || user.first_name} ${user.lastName || user.last_name}`.toLowerCase().includes(userSearchTerm.toLowerCase())
                          )
                          .map((user) => (
                          <div
                            key={user.id}
                            onClick={() => {
                              setSelectedUser(user.id.toString())
                              setUserSearchTerm(`${user.firstName || user.first_name} ${user.lastName || user.last_name}`)
                              setShowUserDropdown(false)
                            }}
                            className="py-2 px-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0"
                          >
                            <div className="text-sm">{user.firstName || user.first_name} {user.lastName || user.last_name}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-gray-700">From Month</label>
                  <Input
                    type="month"
                    value={fromMonth}
                    onChange={(e) => setFromMonth(e.target.value)}
                    className="h-10 [&::-webkit-calendar-picker-indicator]:ml-auto pr-2"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-gray-700">To Month</label>
                  <Input
                    type="month"
                    value={toMonth}
                    onChange={(e) => setToMonth(e.target.value)}
                    className="h-10 [&::-webkit-calendar-picker-indicator]:ml-auto pr-2"
                  />
                </div>
                
              </div>
              <div className="flex-0 ml-4">
                <Button 
                  onClick={() => {
                    setCurrentPage(1)
                    fetchAttendanceReport(1)
                  }} 
                  disabled={loading} 
                  className="px-6"
                >
                  <Search className="h-4 w-4 mr-2" />
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                Attendance Summary{searchedDateRange 
                  ? ` - ${format(new Date(searchedDateRange.from), 'MMMM yyyy')} to ${format(new Date(searchedDateRange.to), 'MMMM yyyy')}` 
                  : ''
                }
              </CardTitle>
              <Button 
                onClick={exportToExcel}
                disabled={reportData.length === 0}
                size="sm"
                variant="outline"
                className="h-8 px-3"
              >
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Name
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Working Days
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leaves
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span className="ml-2">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item) => (
                      <tr key={item.userId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Dr.{item.userName.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                          <Badge className="bg-green-100 text-sm text-green-800">
                            {item.attendanceDays}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                          <Badge className="bg-orange-100 text-orange-800">
                            {item.leaves}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalRecords)} of {totalRecords} records
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchAttendanceReport(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => fetchAttendanceReport(page)}
                      disabled={loading}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchAttendanceReport(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
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
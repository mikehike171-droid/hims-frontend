"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import authService from "@/lib/authService"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LogIn, LogOut, ChevronDown, Loader2, Search } from "lucide-react"
import { format } from "date-fns"
import { attendanceApi } from "@/lib/attendanceApi"
import { useBranch } from "@/contexts/branch-context"
import { queueApi, type Doctor, type QueueData } from "@/lib/queueApi"

interface AttendanceRecord {
  id: number
  date: string
  checkIn: string
  checkOut: string | null
  duration: string
  status: "present" | "absent" | "leave"
  location: string
  notes: string
  availableStatus?: string
}





export default function DoctorAttendancePage() {

  //console.log('role_name:'+authService.getUserInfo().role_name);
  const userRole = authService.getUserInfo()?.role_name;
  const isAdminUser = userRole === "Super Admin" || userRole === "admin" || userRole === "Admin";
  
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState<Date | null>(null)
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null)
  const [stats, setStats] = useState({ thisMonth: 0, thisWeek: 0, avgHours: '0.0', todayHours: '0.0' })
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false)
  const [leaveFormData, setLeaveFormData] = useState({
    fromDate: '',
    toDate: '',
    leaveType: '',
    reason: ''
  })
  const [userStatus, setUserStatus] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userStatus') || 'Available'
    }
    return 'Available'
  })
  const [userStatuses, setUserStatuses] = useState<Array<{id: number, statusName: string, colorCode: string}>>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [doctorLoading, setDoctorLoading] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)





  
  const currentUser = authService.getCurrentUser()
  const userId = currentUser?.id
  const { currentBranch } = useBranch()
  const locationId = currentBranch?.id ? parseInt(currentBranch.id) : null

  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([])
  const [selectedDateDetails, setSelectedDateDetails] = useState<any[]>([])
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)

  const fetchAttendanceHistory = async (page: number = 1) => {
    if (!userId || !locationId) return;
    try {
      const response = await attendanceApi.getGroupedAttendancePaginated(userId, locationId, page, 10)
      setAttendanceHistory(response.data)
      setCurrentPage(response.currentPage)
      setTotalPages(response.totalPages)
      setTotalRecords(response.totalRecords)
    } catch (error) {
      console.error('Failed to fetch attendance history:', error)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchAttendanceHistory(page)
  }

  const fetchDateDetails = async (date: string) => {
    if (!userId || !locationId) return;
    try {
      const data = await attendanceApi.getAttendanceByDate(userId, locationId, date)
      setSelectedDateDetails(data)
      setSelectedDate(date)
      setIsDetailsDialogOpen(true)
    } catch (error) {
      console.error('Failed to fetch date details:', error)
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  const formatTime12Hour = (time24: string) => {
    if (!time24) return '-'
    const [hours, minutes] = time24.split(':')
    const hour12 = parseInt(hours) % 12 || 12
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM'
    return `${hour12}:${minutes} ${ampm}`
  }

  const getStatusColor = (status: string) => {
    if (status?.includes('approved')) {
      return 'bg-green-100 text-green-800 border-green-200'
    } else if (status?.includes('Leave') || status?.includes('reject')) {
      return 'bg-red-100 text-red-800 border-red-200'
    } else if (status?.toLowerCase() === 'present') {
      return 'bg-blue-100 text-blue-800 border-blue-200'
    }
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const handleCheckIn = async () => {
    if (!userId || !locationId) return;
    try {
      setLoading(true)
      setShowError(false)
      const result = await attendanceApi.checkInOut(userId, locationId, 'check-in')
      toast({ title: "Success", description: "Checked in successfully" })
      setIsCheckedIn(true)
      setCheckInTime(new Date())
      setUserStatus('Available')
      localStorage.setItem('userStatus', 'Available')
      await fetchTodayAttendance()
      await fetchAttendanceHistory()
    } catch (error: any) {
      if (error.response?.data?.message?.includes('already checked in')) {
        setShowError(true)
        setErrorMessage('You have already checked in today.')
      }
      toast({ title: "Error", description: error.response?.data?.message || "Failed to check in", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleCheckOut = async () => {
    if (!userId || !locationId) return;
    try {
      setLoading(true)
      setShowError(false)
      const result = await attendanceApi.checkInOut(userId, locationId, 'check-out')
      toast({ title: "Success", description: "Checked out successfully" })
      setIsCheckedIn(false)
      setCheckInTime(null)
      localStorage.removeItem('userStatus')
      await fetchTodayAttendance()
      await fetchAttendanceHistory()
    } catch (error: any) {
      if (error.response?.data?.message?.includes('No active check-in')) {
        setShowError(true)
        setErrorMessage('No active check-in found.')
      }
      toast({ title: "Error", description: error.response?.data?.message || "Failed to check out", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const fetchTodayAttendance = async () => {
    if (!userId || !locationId) return;
    try {
      const attendance = await attendanceApi.getTodayAttendance(userId, locationId)
      if (attendance && attendance.length > 0) {
        const latestRecord = attendance[attendance.length - 1]
        setTodayAttendance(latestRecord)
        setIsCheckedIn(!!latestRecord?.checkIn && !latestRecord?.checkOut)
        
        // Fetch the latest status from attendance by date to get the most recent status
        const today = new Date().toISOString().split('T')[0]
        const dateAttendance = await attendanceApi.getAttendanceByDate(userId, locationId, today)
        
        if (dateAttendance && dateAttendance.length > 0) {
          const latestStatusRecord = dateAttendance[dateAttendance.length - 1]
          if (latestStatusRecord?.statusName) {
            setUserStatus(latestStatusRecord.statusName)
            localStorage.setItem('userStatus', latestStatusRecord.statusName)
          }
        } else if (latestRecord?.userStatus?.statusName) {
          setUserStatus(latestRecord.userStatus.statusName)
          localStorage.setItem('userStatus', latestRecord.userStatus.statusName)
        }
        
        if (latestRecord?.checkIn) {
          const [hours, minutes] = latestRecord.checkIn.split(':')
          const today = new Date()
          today.setHours(parseInt(hours), parseInt(minutes), 0)
          setCheckInTime(today)
        }
      } else {
        // If no attendance today, reset status to default
        setUserStatus('Available')
        localStorage.setItem('userStatus', 'Available')
      }
    } catch (error) {
      console.error('Failed to fetch today attendance:', error)
    }
  }

  const fetchAttendanceStats = async () => {
    if (!userId || !locationId) return;
    try {
      const statsData = await attendanceApi.getStats(userId, locationId);
      setStats(statsData);
    } catch (error) {
      setStats({ thisMonth: 0, thisWeek: 0, avgHours: '0.0', todayHours: '0.0' });
    }
  }

  const fetchUserStatuses = async () => {
    try {
      const statuses = await attendanceApi.getUserStatuses();
      setUserStatuses(statuses);
    } catch (error) {
      console.error('Failed to fetch user statuses:', error);
    }
  }

  const fetchDepartmentsAndDoctors = async (showLoading = true) => {
    if (!locationId) return;
    try {
      if (showLoading) setInitialLoading(true);
      const data = await queueApi.getDoctorsByDepartment(locationId);
      
      const departmentsArray: any[] = [];
      Object.entries(data.doctorsByDepartment).forEach(([deptKey, doctors]: [string, any]) => {
        const deptName = deptKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        departmentsArray.push({
          id: deptKey,
          name: deptName,
          doctors: doctors.map((doctor: any) => ({
            id: doctor.id,
            name: doctor.name.toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase()),
            status: doctor.status === 'Not Available' ? 'Offline' : doctor.status,
            checkIn: doctor.isCheckedIn ? doctor.checkInTime : null,
            checkOut: null,
            consultingRoom: doctor.consultingRoom,
            currentPatient: doctor.currentPatient,
            isCheckedIn: doctor.isCheckedIn
          }))
        });
      });
      
      setDepartments(departmentsArray);
    } catch (error) {
      console.error('Failed to fetch departments and doctors:', error);
      toast({ title: "Error", description: "Failed to load departments", variant: "destructive" });
    } finally {
      if (showLoading) setInitialLoading(false);
    }
  }



  useEffect(() => {
    fetchUserStatuses()
    if (isAdminUser && locationId) {
      fetchDepartmentsAndDoctors()
    }
    if (!isAdminUser && userId && locationId) {
      fetchTodayAttendance()
      fetchAttendanceStats()
      fetchAttendanceHistory()
    }
  }, [userId, locationId, isAdminUser])



  // Refresh status when component becomes visible (for normal users)
  useEffect(() => {
    if (!isAdminUser && userId && locationId) {
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          fetchTodayAttendance()
        }
      }
      
      document.addEventListener('visibilitychange', handleVisibilityChange)
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isAdminUser, userId, locationId])

  // Mock data for department-wise doctors
  // const mockDepartments = [
  //   {
  //     id: 1,
  //     name: "Cardiology",
  //     doctors: [
  //       { id: 1, name: "Dr. John Smith", status: "Available", checkIn: "09:00 AM", checkOut: null },
  //       { id: 2, name: "Dr. Sarah Wilson", status: "Busy", checkIn: "08:30 AM", checkOut: null },
  //       { id: 3, name: "Dr. Mike Johnson", status: "Break", checkIn: "09:15 AM", checkOut: null }
  //     ]
  //   },
  //   {
  //     id: 2,
  //     name: "Neurology",
  //     doctors: [
  //       { id: 4, name: "Dr. Emily Davis", status: "Available", checkIn: "08:45 AM", checkOut: null },
  //       { id: 5, name: "Dr. Robert Brown", status: "Offline", checkIn: null, checkOut: "06:00 PM" }
  //     ]
  //   },
  //   {
  //     id: 3,
  //     name: "Orthopedics",
  //     doctors: [
  //       { id: 6, name: "Dr. Lisa Anderson", status: "Available", checkIn: "09:30 AM", checkOut: null },
  //       { id: 7, name: "Dr. David Miller", status: "Busy", checkIn: "08:00 AM", checkOut: null },
  //       { id: 8, name: "Dr. Jennifer Taylor", status: "Available", checkIn: "09:00 AM", checkOut: null }
  //     ]
  //   }
  // ]

  const handleAdminCheckIn = async (doctorId: number) => {
    if (!locationId) return;
    
    // Save current scroll position
    const scrollPosition = window.pageYOffset;
    
    try {
      setDoctorLoading(doctorId);
      await attendanceApi.checkInOut(doctorId, locationId, 'check-in');
      
      // Update local state immediately
      setDepartments(prevDepts => 
        prevDepts.map(dept => ({
          ...dept,
          doctors: dept.doctors.map(doctor => 
            doctor.id === doctorId 
              ? { ...doctor, isCheckedIn: true, checkIn: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) }
              : doctor
          )
        }))
      );
      
      toast({ title: "Success", description: "Doctor checked in successfully" });
      await fetchDepartmentsAndDoctors(false);
      
      // Restore scroll position
      setTimeout(() => window.scrollTo(0, scrollPosition), 0);
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to check in", variant: "destructive" });
    } finally {
      setDoctorLoading(null);
    }
  }

  const handleAdminCheckOut = async (doctorId: number) => {
    if (!locationId) return;
    
    // Save current scroll position
    const scrollPosition = window.pageYOffset;
    
    try {
      setDoctorLoading(doctorId);
      await attendanceApi.checkInOut(doctorId, locationId, 'check-out');
      
      // Update local state immediately
      setDepartments(prevDepts => 
        prevDepts.map(dept => ({
          ...dept,
          doctors: dept.doctors.map(doctor => 
            doctor.id === doctorId 
              ? { ...doctor, isCheckedIn: false, checkIn: null }
              : doctor
          )
        }))
      );
      
      toast({ title: "Success", description: "Doctor checked out successfully" });
      await fetchDepartmentsAndDoctors(false);
      
      // Restore scroll position
      setTimeout(() => window.scrollTo(0, scrollPosition), 0);
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "Failed to check out", variant: "destructive" });
    } finally {
      setDoctorLoading(null);
    }
  }

  const handleAdminStatusChange = async (doctorId: number, statusName: string) => {
    if (!locationId) return;
    const statusObj = userStatuses.find(s => s.statusName === statusName);
    if (!statusObj) return;
    
    try {
      setDoctorLoading(doctorId);
      
      const doctor = departments.flatMap(d => d.doctors).find((d: any) => d.id === doctorId);
      
      if (statusName === 'Offline') {
        // If going offline, checkout if checked in
        if (doctor?.isCheckedIn) {
          await attendanceApi.checkInOut(doctorId, locationId, 'check-out');
        }
        // Update status to offline
        await attendanceApi.updateAvailableStatus(doctorId, locationId, statusObj.id);
        
        // Update local state immediately
        setDepartments(prevDepts => 
          prevDepts.map(dept => ({
            ...dept,
            doctors: dept.doctors.map(doc => 
              doc.id === doctorId 
                ? { ...doc, status: statusName, isCheckedIn: false, checkIn: null }
                : doc
            )
          }))
        );
      } else {
        // For other statuses, just update the status without checkout/checkin
        await attendanceApi.updateAvailableStatus(doctorId, locationId, statusObj.id);
        
        // Only check in if doctor is not already checked in
        if (!doctor?.isCheckedIn) {
          await attendanceApi.checkInOut(doctorId, locationId, 'check-in');
        }
        
        // Update local state immediately
        setDepartments(prevDepts => 
          prevDepts.map(dept => ({
            ...dept,
            doctors: dept.doctors.map(doc => 
              doc.id === doctorId 
                ? { 
                    ...doc, 
                    status: statusName, 
                    isCheckedIn: !doctor?.isCheckedIn ? true : doc.isCheckedIn,
                    checkIn: !doctor?.isCheckedIn ? new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : doc.checkIn
                  }
                : doc
            )
          }))
        );
      }
      
      toast({ title: "Success", description: `Status updated to ${statusName}` });
      await fetchDepartmentsAndDoctors(false);
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    } finally {
      setDoctorLoading(null);
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      'Available': 'bg-green-100 text-green-800 border-green-200',
      'Busy': 'bg-red-100 text-red-800 border-red-200',
      'Break': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Offline': 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }



  // Search functionality
  const handleSearchClick = async () => {
    if (!locationId) return;
    
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      setIsSearching(true);
      const response = await attendanceApi.searchDoctors(searchTerm, locationId);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
      // Restore focus to search input after search completes
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    // Restore focus to search input after clearing
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  // Flatten all doctors from all departments for table view
  const allDoctors = searchResults.length > 0
    ? searchResults.map((doctor: any) => ({
        id: doctor.id,
        name: doctor.name,
        department: doctor.department,
        status: doctor.status,
        checkIn: doctor.checkIn,
        isCheckedIn: doctor.isCheckedIn
      }))
    : departments.flatMap(dept => 
        dept.doctors.map((doctor: any) => ({
          ...doctor,
          department: dept.name
        }))
      )







  // Admin Component for Super Admin/admin users
  const AdminAttendanceView = () => {

    return (
      <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Doctor Attendance Management</h1>
            <p className="text-muted-foreground">Monitor and manage attendance for all doctors</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Management</CardTitle>
            <CardDescription>View and manage doctor attendance records</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {initialLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading doctors...</p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b">
                  <div className="flex gap-2">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search doctors or departments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearchClick()}

                      className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none"
                      style={{ caretColor: 'black' }}
                      autoFocus

                    />
                    <button 
                      onClick={handleSearchClick}
                      onMouseDown={(e) => e.preventDefault()}
                      disabled={isSearching}
                      type="button"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
                    >
                      {isSearching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </button>
                    {searchTerm && (
                      <button 
                        onClick={handleClearSearch}
                        onMouseDown={(e) => e.preventDefault()}
                        type="button"
                        className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-md"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto ">
                  <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-in Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allDoctors.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          {searchResults.length === 0 && searchTerm.trim() ? 'No doctors found matching your search.' : 'No doctors found for this location.'}
                        </td>
                      </tr>
                    ) : (
                      allDoctors.map((doctor: any) => (
                      <tr key={doctor.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Dr.{doctor.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doctor.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {doctor.checkIn || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-2 p-2 h-auto border border-gray-200 bg-white hover:bg-gray-50 rounded-md cursor-pointer">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: userStatuses.find(s => s.statusName === doctor.status)?.colorCode || '#6b7280' }}></div>
                                <span className="text-sm font-medium">{doctor.status}</span>
                              </div>
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 p-2">
                              {userStatuses.map((status) => (
                                <DropdownMenuItem 
                                  key={status.id} 
                                  className="flex items-center gap-3 px-3 py-2 cursor-pointer"
                                  onClick={() => handleAdminStatusChange(doctor.id, status.statusName)}
                                  disabled={doctorLoading === doctor.id}
                                >
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.colorCode }}></div>
                                  <span className="text-sm">{status.statusName}</span>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {!doctor.isCheckedIn ? (
                            <Button 
                              onClick={() => handleAdminCheckIn(doctor.id)}
                              disabled={doctorLoading === doctor.id}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              {doctorLoading === doctor.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <LogIn className="mr-2 h-4 w-4" />
                              )}
                              {doctorLoading === doctor.id ? 'Checking In...' : 'Check In'}
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => handleAdminCheckOut(doctor.id)}
                              disabled={doctorLoading === doctor.id}
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              {doctorLoading === doctor.id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <LogOut className="mr-2 h-4 w-4" />
                              )}
                              {doctorLoading === doctor.id ? 'Checking Out...' : 'Check Out'}
                            </Button>
                          )}
                        </td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Return admin view for admin users
  if (isAdminUser) {
    return (
      <PrivateRoute modulePath="admin/attendance-management/attendance" action="view">
        <AdminAttendanceView />
      </PrivateRoute>
    )
  }

  // Regular user view continues below

  const handleStatusChange = async (statusName: string) => {
    if (!userId || !locationId) return;
    const statusObj = userStatuses.find(s => s.statusName === statusName);
    if (!statusObj) return;
    
    try {
      await attendanceApi.updateAvailableStatus(userId, locationId, statusObj.id)
      setUserStatus(statusName)
      localStorage.setItem('userStatus', statusName)
      toast({ title: "Success", description: `Status updated to ${statusName}` })
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" })
    }
  }

  const handleLeaveSubmit = async () => {
    if (!leaveFormData.fromDate || !leaveFormData.toDate || !leaveFormData.leaveType || !leaveFormData.reason.trim()) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" })
      return
    }

    const fromDate = new Date(leaveFormData.fromDate)
    const toDate = new Date(leaveFormData.toDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (fromDate < today) {
      toast({ title: "Error", description: "From date cannot be in the past", variant: "destructive" })
      return
    }

    if (toDate < fromDate) {
      toast({ title: "Error", description: "To date cannot be earlier than from date", variant: "destructive" })
      return
    }

    if (!userId || !locationId) return

    try {
      setLoading(true)
      
      const startDate = new Date(leaveFormData.fromDate)
      const endDate = new Date(leaveFormData.toDate)
      
      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const leaveRecord = {
          userId,
          locationId,
          date: format(date, 'yyyy-MM-dd'),
          status: 'Leave',
          leave_type: leaveFormData.leaveType,
          leave_status: 'Pending',
          remarks: leaveFormData.reason
        }
        
        await attendanceApi.create(leaveRecord)
      }
      
      toast({ title: "Success", description: "Leave application submitted successfully" })
      setIsLeaveDialogOpen(false)
      setLeaveFormData({ fromDate: '', toDate: '', leaveType: '', reason: '' })
      await fetchAttendanceStats()
      await fetchAttendanceHistory()
    } catch (error: any) {
      toast({ title: "Error", description: "Failed to submit leave application", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const getCurrentDuration = () => {
    if (!checkInTime) return "0h 0m"
    const now = new Date()
    const diff = now.getTime() - checkInTime.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const getTodayTotalMinutes = () => {
    let totalMinutes = 0
    
    if (isCheckedIn && checkInTime) {
      const now = new Date()
      const currentSessionMinutes = Math.floor((now.getTime() - checkInTime.getTime()) / (1000 * 60))
      totalMinutes += currentSessionMinutes
    }
    
    if (todayAttendance?.duration) {
      totalMinutes += parseInt(todayAttendance.duration.toString())
    }
    
    return totalMinutes
  }

  const getTodayWorkingHours = () => {
    const totalMinutes = getTodayTotalMinutes()
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours}h ${minutes}m`
  }

  return (
    <PrivateRoute modulePath="admin/attendance-management/attendance" action="view">
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employee Attendance</h1>
          <p className="text-muted-foreground">Manage your daily attendance and view history</p>
        </div>
        <div className="flex items-center gap-4">
          {isCheckedIn && (
            <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 p-2 h-auto border-0 bg-transparent hover:bg-gray-50 rounded-md cursor-pointer">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: userStatuses.find(s => s.statusName === userStatus)?.colorCode || '#10b981' }}
                ></div>
                <span className="text-sm font-medium">{userStatus}</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2">
              <div className="py-2">
                {userStatuses.length > 0 ? userStatuses.map((status) => (
                  <DropdownMenuItem 
                    key={status.id}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer"
                    onClick={() => handleStatusChange(status.statusName)}
                  >
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: status.colorCode }}
                    ></div>
                    <span className="text-sm">{status.statusName}</span>
                  </DropdownMenuItem>
                )) : (
                  <div className="px-3 py-2 text-sm text-gray-500">Loading statuses...</div>
                )}
              </div>
            </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Your attendance summary and statistics</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => setIsLeaveDialogOpen(true)} size="lg" className="bg-orange-600 hover:bg-orange-700">
                Apply Leave
              </Button>
              <Badge variant={isCheckedIn ? "default" : "secondary"} className="text-base px-4 py-2">
                {isCheckedIn ? "Checked In" : "Checked Out"}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-sm text-green-600 font-medium mb-1">This Month</div>
              <div className="text-3xl font-bold text-green-700">{stats.thisMonth} Days</div>
              <div className="text-xs text-green-600 mt-1">Total Present</div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="text-sm text-purple-600 font-medium mb-1">This Week</div>
              <div className="text-3xl font-bold text-purple-700">{stats.thisWeek} Days</div>
              <div className="text-xs text-purple-600 mt-1">Total Present</div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="text-sm text-orange-600 font-medium mb-1">Working Hours</div>
              <div className="text-3xl font-bold text-orange-700">{getTodayWorkingHours()}</div>
              <div className="text-xs text-orange-600 mt-1">Today</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Attendance</CardTitle>
          <CardDescription>Manage your daily check-in and check-out</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">Date</Label>
                <Input value={format(new Date(), "dd/MM/yyyy")} disabled className="bg-gray-50" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">Check-In Time</Label>
                <Input value={checkInTime ? format(checkInTime, "hh:mm a") : "-"} disabled className="bg-blue-50" />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Check-Out Time</Label>
                <Input value={todayAttendance?.checkOut ? formatTime12Hour(todayAttendance.checkOut) : "-"} disabled className="bg-blue-50" />
              </div>
              <div>
                <Label className="text-sm font-medium mb-2 block">Duration</Label>
                <Input value={getCurrentDuration()} disabled className="bg-blue-50" />
              </div>
            </div>

            {showError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-red-600 text-sm font-medium">
                  {errorMessage}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              {!isCheckedIn ? (
                <Button
                  onClick={handleCheckIn}
                  size="lg"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  disabled={loading}
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Check In
                </Button>
              ) : (
                <Button onClick={handleCheckOut} size="lg" className="flex-1 bg-red-600 hover:bg-red-700 text-white" disabled={loading}>
                  <LogOut className="mr-2 h-5 w-5" />
                  Check Out
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>View your past attendance records</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration (Hours)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendanceHistory.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 cursor-pointer hover:underline" onClick={() => fetchDateDetails(record.date)}>
                      {format(new Date(record.date), "dd MMM yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.status?.toLowerCase().includes('leave') ? '-' : formatDuration(parseInt(record.sum) || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalRecords)} of {totalRecords} records
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
            <DialogDescription>Fill in the details for your leave application</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leave-from-date" className="text-sm font-medium">From Date <span className="text-red-500">*</span></Label>
                <Input
                  id="leave-from-date"
                  type="date"
                  value={leaveFormData.fromDate}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  onChange={(e) => setLeaveFormData({...leaveFormData, fromDate: e.target.value})}
                  className="w-full h-10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leave-to-date" className="text-sm font-medium">To Date <span className="text-red-500">*</span></Label>
                <Input
                  id="leave-to-date"
                  type="date"
                  value={leaveFormData.toDate}
                  min={leaveFormData.fromDate || format(new Date(), 'yyyy-MM-dd')}
                  onChange={(e) => setLeaveFormData({...leaveFormData, toDate: e.target.value})}
                  className="w-full h-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="leave-type">Leave Type <span className="text-red-500">*</span></Label>
              <Select value={leaveFormData.leaveType} onValueChange={(value) => setLeaveFormData({...leaveFormData, leaveType: value})} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="casual">Casual Leave</SelectItem>
                  <SelectItem value="annual">Annual Leave</SelectItem>
                  <SelectItem value="emergency">Emergency Leave</SelectItem>
                  <SelectItem value="maternity">Maternity Leave</SelectItem>
                  <SelectItem value="paternity">Paternity Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="leave-reason">Reason for Leave <span className="text-red-500">*</span></Label>
              <Textarea
                id="leave-reason"
                placeholder="Enter reason for leave"
                value={leaveFormData.reason}
                onChange={(e) => setLeaveFormData({...leaveFormData, reason: e.target.value})}
                rows={3}
                className="w-full"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLeaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLeaveSubmit} disabled={loading} className="bg-orange-600 hover:bg-orange-700">
              {loading ? 'Submitting...' : 'Submit Leave'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Attendance Details</DialogTitle>
            <DialogDescription>Details for {selectedDate ? format(new Date(selectedDate), "dd MMM yyyy") : ''}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className={`overflow-x-auto ${selectedDateDetails.length > 7 ? 'max-h-80 overflow-y-auto' : ''}`}>
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">CHECK IN</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">CHECK OUT</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">DURATION</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">STATUS</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedDateDetails.map((detail, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm">{formatTime12Hour(detail.check_in)}</td>
                      <td className="px-4 py-2 text-sm">{formatTime12Hour(detail.check_out)}</td>
                      <td className="px-4 py-2 text-sm">{detail.duration ? formatDuration(detail.duration) : '0h 0m'}</td>
                      <td className="px-4 py-2 text-sm">{detail.statusName || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm font-medium text-blue-800">
                Total Duration: {formatDuration(selectedDateDetails.reduce((total, detail) => total + (detail.duration || 0), 0))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </PrivateRoute>
  )
}
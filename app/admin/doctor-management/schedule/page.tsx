"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, X, Save, Calendar, Edit, Trash2, Search } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { doctorsApi, Doctor } from "@/lib/doctorsApi"
import { settingsApi, User } from "@/lib/settingsApi"
import authService from "@/lib/authService"

function DoctorSchedulePage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [doctors, setDoctors] = useState<User[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [scheduleData, setScheduleData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    departmentId: "",
    doctorId: "",
    dates: [] as string[],
    fromTime: "",
    toTime: "",
    duration: "",
  })
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDoctorSlots, setSelectedDoctorSlots] = useState(null)
  const [isViewSlotsDialogOpen, setIsViewSlotsDialogOpen] = useState(false)
  const [blockAllSlots, setBlockAllSlots] = useState(false)
  const [slotStates, setSlotStates] = useState({})
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredDoctors, setFilteredDoctors] = useState<User[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [filterUserId, setFilterUserId] = useState("")
  const [filterFromDate, setFilterFromDate] = useState(new Date().toISOString().split('T')[0])
  const [filterToDate, setFilterToDate] = useState(new Date().toISOString().split('T')[0])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [originalScheduleData, setOriginalScheduleData] = useState<any[]>([])
  const [filteredScheduleData, setFilteredScheduleData] = useState<any[]>([])
  const [doctorSearchTerm, setDoctorSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false)
  const [filterDepartmentId, setFilterDepartmentId] = useState("all")

  useEffect(() => {
    loadDepartments()
    loadAllUsers()
    handleSearch() // Load current date data by default
  }, [])

  useEffect(() => {
    let users = allUsers
    
    // Filter by department first
    if (filterDepartmentId && filterDepartmentId !== 'all') {
      users = users.filter(user => user.departmentId?.toString() === filterDepartmentId)
    }
    
    // Then filter by search term
    if (doctorSearchTerm.trim() !== "") {
      users = users.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
        user.departmentName?.toLowerCase().includes(doctorSearchTerm.toLowerCase())
      )
    }
    
    setFilteredUsers(users)
  }, [doctorSearchTerm, allUsers, filterDepartmentId])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.doctor-search-container')) {
        setShowDoctorDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredDoctors(doctors)
    } else {
      const filtered = doctors.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.departmentName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredDoctors(filtered)
    }
  }, [searchTerm, doctors])

  // Reload departments when dialog opens to ensure fresh data
  useEffect(() => {
    if (isCreateDialogOpen) {
      loadDepartments()
    }
  }, [isCreateDialogOpen])

  const handleSearch = async () => {
    try {
      setLoading(true)
      const selectedBranchId = authService.getSelectedBranchId()
      const locationId = selectedBranchId ? parseInt(selectedBranchId) : undefined
      
      // Get doctor timeslots with joined user data
      const params = new URLSearchParams()
      if (locationId) params.append('locationId', locationId.toString())
      if (filterUserId && filterUserId !== 'all' && filterUserId !== '') params.append('userId', filterUserId)
      if (filterFromDate) params.append('fromDate', filterFromDate)
      if (filterToDate) params.append('toDate', filterToDate)
      
      const timeslots = await fetch(`${authService.getSettingsApiUrl()}/doctors/timeslots?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      }).then(res => res.json())
      
      let filteredTimeslots = timeslots
      
      // This filtering is now handled by backend
      
      // Filter by date range
      if (filterFromDate || filterToDate) {
        filteredTimeslots = filteredTimeslots.filter(slot => {
          const slotDate = new Date(slot.date)
          slotDate.setHours(0, 0, 0, 0)
          
          let matchesFromDate = true
          let matchesToDate = true
          
          if (filterFromDate) {
            const fromDate = new Date(filterFromDate)
            fromDate.setHours(0, 0, 0, 0)
            matchesFromDate = slotDate >= fromDate
          }
          
          if (filterToDate) {
            const toDate = new Date(filterToDate)
            toDate.setHours(23, 59, 59, 999)
            matchesToDate = slotDate <= toDate
          }
          
          return matchesFromDate && matchesToDate
        })
      }
      
      // Group timeslots by user
      const userTimeslots = {}
      filteredTimeslots.forEach(slot => {
        const userId = slot.userid
        if (!userTimeslots[userId]) {
          userTimeslots[userId] = {
            id: userId,
            name: `${slot.firstname} ${slot.lastname}`,
            department: slot.departmentname || 'General',
            sessions: []
          }
        }
        
        // Only show one session per user
        if (userTimeslots[userId].sessions.length === 0) {
          userTimeslots[userId].sessions.push({
            id: slot.id,
            type: "OPD",
            day: new Date(slot.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
            startTime: slot.time,
            endTime: slot.time,
            location: `${slot.locationname || 'Madinaguda'} - ${slot.departmentname || 'Cardiology'}`,
            slots: 1,
            date: slot.date,
            firstTime: slot.time,
            lastTime: slot.time
          })
        } else {
          // Update end time and slot count for existing session
          const existingSession = userTimeslots[userId].sessions[0]
          existingSession.lastTime = slot.time
          existingSession.slots += 1
        }
      })
      
      const scheduleArray = Object.values(userTimeslots)
      setScheduleData(scheduleArray)
    } catch (error) {
      console.error('Error searching schedule data:', error)
      setScheduleData([])
    } finally {
      setLoading(false)
    }
  }

  // Watch for location changes and reload data
  useEffect(() => {
    const handleLocationChange = () => {
      loadDepartments()
      loadAllUsers()
      loadScheduleData()
    }

    // Listen for storage changes (when location is changed in another tab/component)
    window.addEventListener('storage', handleLocationChange)
    
    // Poll for location changes every 2 seconds
    const interval = setInterval(() => {
      const currentBranchId = authService.getSelectedBranchId()
      if (currentBranchId !== localStorage.getItem('lastKnownBranchId')) {
        localStorage.setItem('lastKnownBranchId', currentBranchId || '')
        handleLocationChange()
      }
    }, 2000)

    return () => {
      window.removeEventListener('storage', handleLocationChange)
      clearInterval(interval)
    }
  }, [])

  const loadAllUsers = async () => {
    try {
      const selectedBranchId = authService.getSelectedBranchId()
      const response = await settingsApi.getUsers(selectedBranchId)
      
      let users = []
      if (Array.isArray(response)) {
        users = response
      } else if (response?.users && Array.isArray(response.users)) {
        users = response.users
      }
      
      setAllUsers(users)
      setFilteredUsers(users)
    } catch (error) {
      console.error('Error loading all users:', error)
      setAllUsers([])
      setFilteredUsers([])
    }
  }

  const loadScheduleData = async () => {
    // This function is now replaced by handleSearch for consistency
    handleSearch()
  }

  const loadDepartments = async () => {
    try {
      setLoading(true)
      const selectedBranchId = authService.getSelectedBranchId()
      const response = await settingsApi.getDepartments(selectedBranchId)
      
      let deptList = []
      if (Array.isArray(response)) {
        deptList = response
      } else if (response?.departments && Array.isArray(response.departments)) {
        deptList = response.departments
      }
      
      setDepartments(deptList)
    } catch (error) {
      console.error('Error loading departments:', error)
      setDepartments([])
    } finally {
      setLoading(false)
    }
  }

  const loadDoctorsByDepartment = async (departmentId: string) => {
    try {
      setLoading(true)
      const selectedBranchId = authService.getSelectedBranchId()
      const response = await settingsApi.getUsers(selectedBranchId)
      
      let users = []
      if (Array.isArray(response)) {
        users = response
      } else if (response?.users && Array.isArray(response.users)) {
        users = response.users
      }
      
      const departmentUsers = users.filter(user => user.departmentId?.toString() === departmentId)
      setDoctors(departmentUsers)
      setFilteredDoctors(departmentUsers)
    } catch (error) {
      console.error('Error loading users by department:', error)
      setDoctors([])
      setFilteredDoctors([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSession = () => {
    setFormData({
      departmentId: "",
      doctorId: "",
      dates: [],
      fromTime: "",
      toTime: "",
      duration: "",
    })
    setSearchTerm("")
    setShowCalendar(false)
    setIsCreateDialogOpen(true)
  }



  const handleSave = async () => {
    if (!formData.doctorId || formData.dates.length === 0 || !formData.fromTime || !formData.toTime) {
      alert('Please fill all required fields and select at least one date')
      return
    }
    
    try {
      setLoading(true)
      console.log('Saving with data:', formData)
      
      const selectedBranchId = authService.getSelectedBranchId()
      let totalSlots = 0
      
      // Create timeslots for each selected date
      for (const date of formData.dates) {
        console.log('Creating timeslots for date:', date)
        try {
          const result = await doctorsApi.createBulkTimeslots({
            userId: parseInt(formData.doctorId),
            date: date,
            fromTime: formData.fromTime,
            toTime: formData.toTime,
            duration: formData.duration,
            locationId: parseInt(selectedBranchId)
          })
          
          console.log('Result for date', date, ':', result)
          if (result.success) {
            totalSlots += result.count
          }
        } catch (dateError) {
          console.error('Error creating timeslots for date', date, ':', dateError)
        }
      }
      
      setFormData({
        doctorId: "",
        dates: [],
        fromTime: "",
        toTime: "",
        duration: "",
      })
      setIsCreateDialogOpen(false)
      loadScheduleData() // Reload schedule data after saving
    } catch (error) {
      console.error('Error saving timeslots:', error)
      alert('Error saving time slots: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const selectedDoctor = doctors.find(d => d.id.toString() === formData.doctorId)

  return (
    <PrivateRoute modulePath="admin/doctor-management/schedule" action="view">
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schedule & Roster Management</h1>
            <p className="text-gray-600 mt-1">Manage doctor schedules, sessions, and availability</p>
          </div>
          <Button onClick={handleCreateSession} className="bg-black hover:bg-gray-800 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Time Slot
          </Button>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <Label htmlFor="filterDepartment" className="mb-3 block">Filter by Department</Label>
              <Select value={filterDepartmentId} onValueChange={(value) => {
                setFilterDepartmentId(value)
                setFilterUserId("")
                setDoctorSearchTerm("")
                setShowDoctorDropdown(false)
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filterUser" className="mb-3 block">Filter by Doctor</Label>
              <div className="relative doctor-search-container">
                <Input
                  placeholder="Search doctor..."
                  value={doctorSearchTerm}
                  onChange={(e) => {
                    setDoctorSearchTerm(e.target.value)
                    setShowDoctorDropdown(true)
                    if (e.target.value === '') {
                      setFilterUserId('')
                    }
                  }}
                  onFocus={() => setShowDoctorDropdown(true)}
                />
                {showDoctorDropdown && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 shadow-lg max-h-48 overflow-y-auto">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => {
                          setFilterUserId(user.id.toString())
                          setDoctorSearchTerm(`${user.firstName} ${user.lastName}`)
                          setShowDoctorDropdown(false)
                        }}
                        className="py-2 px-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0"
                      >
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                      </div>
                    ))}
                    {filteredUsers.length === 0 && doctorSearchTerm && (
                      <div className="py-2 px-3 text-sm text-gray-500">
                        No doctors found matching "{doctorSearchTerm}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="filterFromDate" className="mb-3 block">From Date</Label>
              <Input
                id="filterFromDate"
                type="date"
                value={filterFromDate}
                onChange={(e) => setFilterFromDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="filterToDate" className="mb-3 block">To Date</Label>
              <Input
                id="filterToDate"
                type="date"
                value={filterToDate}
                onChange={(e) => setFilterToDate(e.target.value)}
              />
            </div>
            <div>
              <Button onClick={handleSearch} disabled={loading} className="w-full">
                <Search className="h-4 w-4 mr-2" />
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>
        </div>



        {/* Debug Info */}
        {scheduleData.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">No schedule data found.</p>
          </div>
        )}

        <div className="space-y-6">
          {scheduleData.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-600">
                      {doctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.department}</p>
                  </div>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctor.sessions.map((session) => (
                  <Card key={session.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <span className={`px-3 py-1 rounded text-sm font-medium ${
                          session.type === "OPD" ? "bg-blue-100 text-blue-800" :
                          session.type === "TELEMEDICINE" ? "bg-purple-100 text-purple-800" :
                          "bg-orange-100 text-orange-800"
                        }`}>
                          {session.type}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {session.day}
                        </span>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">🕘</span>
                          <span>{session.firstTime} - {session.lastTime}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">🏥</span>
                          <span>{session.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">👥</span>
                          <span>{session.slots} slots</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={async () => {
                            const selectedBranchId = authService.getSelectedBranchId()
                            const locationId = selectedBranchId ? parseInt(selectedBranchId) : undefined
                            const allTimeslots = await doctorsApi.getAllDoctorTimeslots(locationId)
                            
                            const doctorTimeslots = allTimeslots.filter(slot => slot.userid === doctor.id)
                            const initialStates = {}
                            const updatedSessions = doctorTimeslots.map(slot => {
                              initialStates[slot.id] = slot.status === '1'
                              return {
                                id: slot.id,
                                type: "OPD",
                                day: new Date(slot.date).toLocaleDateString('en-US'),
                                startTime: slot.time,
                                status: slot.status,
                                originalDate: slot.date
                              }
                            })
                            
                            setSelectedDoctorSlots({
                              ...doctor,
                              sessions: updatedSessions,
                              clickedSessionDate: session.day
                            })
                            setSlotStates(initialStates)
                            setIsViewSlotsDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="px-3">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Time Slots</DialogTitle>
              <DialogDescription>
                Create new time slots for doctor availability
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department" className="mb-2 block">Department</Label>
                  <Select value={formData.departmentId} onValueChange={(value) => {
                    setFormData({...formData, departmentId: value, doctorId: ""})
                    setSearchTerm("")
                    setShowDropdown(false)
                    loadDoctorsByDepartment(value)
                  }} disabled={loading}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={loading ? "Loading departments..." : departments.length > 0 ? "Select Department" : "No departments available"} />
                    </SelectTrigger>
                    <SelectContent>
                      {loading ? (
                        <SelectItem value="loading" disabled>
                          Loading departments...
                        </SelectItem>
                      ) : departments && departments.length > 0 ? (
                        departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>
                            {dept.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-departments" disabled>
                          No departments available for this location
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="doctor" className="mb-2 block">Doctor Name</Label>
                  <div className="relative">
                    <Input
                      placeholder="Search doctor..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setShowDropdown(true)
                      }}
                      onFocus={() => setShowDropdown(true)}
                    />
                    {showDropdown && formData.departmentId && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 shadow-lg max-h-48 overflow-y-scroll custom-scrollbar">
                        {loading ? (
                          <div className="p-3 text-sm text-gray-500">Loading users...</div>
                        ) : filteredDoctors && filteredDoctors.length > 0 ? (
                          filteredDoctors.map((user) => (
                            <div
                              key={user.id}
                              onClick={() => {
                                setFormData({...formData, doctorId: user.id.toString()})
                                setSearchTerm(`${user.firstName} ${user.lastName}`)
                                setShowDropdown(false)
                              }}
                              className="py-1 px-2 cursor-pointer hover:bg-gray-50 border-b last:border-b-0"
                            >
                              <div className="font-medium">{user.firstName} {user.lastName}</div>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-sm text-gray-500">
                            {searchTerm ? "No users found matching search" : "No users available for this department"}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Select Dates</Label>
                <div className="relative w-full">
                  <Input
                    value={formData.dates.map(date => new Date(date).toLocaleDateString('en-US')).join(', ')}
                    placeholder="Click to select dates"
                    readOnly
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="cursor-pointer"
                  />
                  {showCalendar && (
                    <div className="absolute top-full left-0 z-10 mt-1 bg-white border rounded-lg p-2 shadow-lg">
                      <div className="grid grid-cols-7 gap-1 text-center text-xs">
                        <div className="font-medium text-gray-500 p-1">S</div>
                        <div className="font-medium text-gray-500 p-1">M</div>
                        <div className="font-medium text-gray-500 p-1">T</div>
                        <div className="font-medium text-gray-500 p-1">W</div>
                        <div className="font-medium text-gray-500 p-1">T</div>
                        <div className="font-medium text-gray-500 p-1">F</div>
                        <div className="font-medium text-gray-500 p-1">S</div>
                        {(() => {
                          const today = new Date()
                          const currentMonth = today.getMonth()
                          const currentYear = today.getFullYear()
                          const firstDay = new Date(currentYear, currentMonth, 1)
                          const startDate = new Date(firstDay)
                          startDate.setDate(startDate.getDate() - firstDay.getDay())
                          
                          const days = []
                          for (let i = 0; i < 42; i++) {
                            const date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i)
                            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                            const isCurrentMonth = date.getMonth() === currentMonth
                            const isSelected = formData.dates.includes(dateStr)
                            const todayDate = new Date()
                            todayDate.setHours(0, 0, 0, 0)
                            const isPast = date < todayDate
                            
                            days.push(
                              <button
                                key={i}
                                type="button"
                                disabled={isPast}
                                onClick={() => {
                                  if (isSelected) {
                                    const newDates = formData.dates.filter(d => d !== dateStr)
                                    setFormData({...formData, dates: newDates})
                                  } else {
                                    const newDates = [...formData.dates, dateStr]
                                    setFormData({...formData, dates: newDates})
                                  }
                                }}
                                className={`p-1 text-xs rounded hover:bg-gray-100 ${
                                  !isCurrentMonth ? 'text-gray-300' :
                                  isPast ? 'text-gray-300 cursor-not-allowed' :
                                  isSelected ? 'bg-blue-500 text-white hover:bg-blue-600' :
                                  'text-gray-700'
                                }`}
                              >
                                {date.getDate()}
                              </button>
                            )
                          }
                          return days
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="fromTime" className="mb-2 block">From Time</Label>
                  <Input
                    id="fromTime"
                    type="time"
                    value={formData.fromTime}
                    onChange={(e) => setFormData({...formData, fromTime: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="toTime" className="mb-2 block">To Time</Label>
                  <Input
                    id="toTime"
                    type="time"
                    value={formData.toTime}
                    onChange={(e) => setFormData({...formData, toTime: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="duration" className="mb-2 block">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="5"
                    step="5"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                  />
                </div>
              </div>


            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Generating...' : 'Generate & Save Time Slots'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isViewSlotsDialogOpen} onOpenChange={setIsViewSlotsDialogOpen}>
          <DialogContent className="max-w-2xl min-h-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Time Slots</DialogTitle>
              <DialogDescription>
                {selectedDoctorSlots?.name} - {selectedDoctorSlots?.department}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 flex-1">
              <div>
                <Label>Select Date *</Label>
                <Input 
                  type="date" 
                  value={selectedDoctorSlots?.clickedSessionDate ? 
                    (() => {
                      const [month, day, year] = selectedDoctorSlots.clickedSessionDate.split('/')
                      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
                    })() : 
                    new Date().toISOString().split('T')[0]
                  } 
                  disabled 
                />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium">Block all time slots</span>
                <Switch 
                  checked={blockAllSlots}
                  onCheckedChange={(checked) => {
                    setBlockAllSlots(checked)
                    // Update all slot states
                    const newStates = {}
                    selectedDoctorSlots?.sessions.forEach(session => {
                      newStates[session.id] = !checked // If blocking all, set to false (not available)
                    })
                    setSlotStates(newStates)
                  }}
                />
              </div>
              

              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium text-gray-700 pb-2 border-b">
                  <span>Time Slots</span>
                  <span>Status</span>
                </div>
                
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {selectedDoctorSlots?.sessions && selectedDoctorSlots.sessions.length > 0 ? (
                    selectedDoctorSlots.sessions
                      .filter((session, index, arr) => 
                        arr.findIndex(s => s.startTime === session.startTime) === index
                      )
                      .map((session) => {
                      const isAvailable = slotStates[session.id] ?? true
                      return (
                        <div key={session.id} className="flex justify-between items-center py-2">
                          <span className="text-sm">{session.startTime}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              isAvailable 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {isAvailable ? 'Available' : 'Not Available'}
                            </span>
                            <Switch 
                              checked={isAvailable}
                              disabled={blockAllSlots}
                              onCheckedChange={(checked) => {
                                setSlotStates(prev => ({
                                  ...prev,
                                  [session.id]: checked
                                }))
                              }}
                            />
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-center text-gray-500 py-8">No time slots found for this doctor.</p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewSlotsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={async () => {
                try {
                  setLoading(true)
                  for (const session of selectedDoctorSlots?.sessions || []) {
                    const isActive = slotStates[session.id] ?? true
                    await doctorsApi.updateTimeslotStatus(session.id, isActive)
                  }
                  setIsViewSlotsDialogOpen(false)
                  loadScheduleData()
                } catch (error) {
                  alert('Error updating time slots: ' + error.message)
                } finally {
                  setLoading(false)
                }
              }} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
    </PrivateRoute>
  )
}

export default DoctorSchedulePage
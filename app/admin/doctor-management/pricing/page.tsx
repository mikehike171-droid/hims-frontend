"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, DollarSign, User, TrendingUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { doctorsApi } from "@/lib/doctorsApi"
import { settingsApi, User as UserType } from "@/lib/settingsApi"
import authService from "@/lib/authService"



export default function ConsultationPricingPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [users, setUsers] = useState<UserType[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [consultationFees, setConsultationFees] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [editingFee, setEditingFee] = useState<any>(null)
  const [formData, setFormData] = useState({
    departmentId: "",
    userId: "",
    cashFee: "",
  })

  useEffect(() => {
    loadDepartments()
    loadConsultationFees()
  }, [])

  useEffect(() => {
    const handleLocationChange = () => {
      loadDepartments()
      loadConsultationFees()
    }

    window.addEventListener('storage', handleLocationChange)
    
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

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(user => 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.departmentName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm, users])

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

  const loadUsersByDepartment = async (departmentId: string) => {
    try {
      setLoading(true)
      const selectedBranchId = authService.getSelectedBranchId()
      const response = await settingsApi.getUsers(selectedBranchId)
      
      let usersList = []
      if (Array.isArray(response)) {
        usersList = response
      } else if (response?.users && Array.isArray(response.users)) {
        usersList = response.users
      }
      
      const departmentUsers = usersList.filter(user => user.departmentId?.toString() === departmentId)
      setUsers(departmentUsers)
      setFilteredUsers(departmentUsers)
      setShowDropdown(true)
    } catch (error) {
      console.error('Error loading users by department:', error)
      setUsers([])
      setFilteredUsers([])
    } finally {
      setLoading(false)
    }
  }

  const loadConsultationFees = async () => {
    try {
      const selectedBranchId = authService.getSelectedBranchId()
      const locationId = selectedBranchId ? parseInt(selectedBranchId) : undefined
      const fees = await doctorsApi.getConsultationFees(locationId)
      setConsultationFees(fees)
    } catch (error) {
      console.error('Error loading consultation fees:', error)
      setConsultationFees([])
    }
  }

  const handleCreateFee = () => {
    setFormData({
      departmentId: "",
      userId: "",
      cashFee: "",
    })
    setSearchTerm("")
    setIsCreateDialogOpen(true)
  }

  const handleEditFee = (fee: any) => {
    setEditingFee(fee)
    setFormData({
      userId: fee.userid.toString(),
      cashFee: fee.cashfee
    })
    setSearchTerm(`${fee.firstname} ${fee.lastname} - ${fee.departmentname || 'No Department'}`)
    setIsEditDialogOpen(true)
  }

  const handleDeleteFee = async (id: number) => {
    const confirmed = window.confirm('Do you want to delete this record?')
    if (confirmed) {
      try {
        await doctorsApi.deleteConsultationFee(id)
        loadConsultationFees()
      } catch (error) {
        console.error('Error deleting consultation fee:', error)
      }
    }
  }

  const handleSave = async () => {
    if (!formData.userId || !formData.cashFee) {
      alert('Please fill all required fields')
      return
    }
    
    const selectedUser = users.find(u => u.id.toString() === formData.userId)
    if (!selectedUser) {
      alert('Please select a valid user')
      return
    }
    
    // Check for duplicate
    const existingFee = consultationFees.find(fee => fee.userid.toString() === formData.userId)
    if (existingFee) {
      alert('Consultation fee already exists for this user')
      return
    }
    
    try {
      setLoading(true)
      const selectedBranchId = authService.getSelectedBranchId()
      
      await doctorsApi.createConsultationFee({
        userId: parseInt(formData.userId),
        cashFee: parseFloat(formData.cashFee),
        locationId: parseInt(selectedBranchId || '1'),
        departmentId: selectedUser.departmentId || 1
      })
      
      setFormData({ userId: "", cashFee: "" })
      setSearchTerm("")
      setIsCreateDialogOpen(false)
      loadConsultationFees()
    } catch (error) {
      console.error('Error saving consultation fee:', error)
      alert('Error saving consultation fee')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!formData.cashFee) {
      alert('Please enter cash fee')
      return
    }
    
    try {
      setLoading(true)
      await doctorsApi.updateConsultationFee(editingFee.id, {
        userId: parseInt(formData.userId),
        cashFee: parseFloat(formData.cashFee)
      })
      
     // alert('Consultation fee updated successfully!')
      setFormData({ userId: "", cashFee: "" })
      setSearchTerm("")
      setIsEditDialogOpen(false)
      setEditingFee(null)
      loadConsultationFees()
    } catch (error) {
      console.error('Error updating consultation fee:', error)
      alert('Error updating consultation fee')
    } finally {
      setLoading(false)
    }
  }

  const selectedUser = users.find(u => u.id.toString() === formData.userId)

  return (
    <PrivateRoute modulePath="admin/doctor-management/pricing" action="view">
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Services & Pricing</h1>
              <p className="text-gray-600 mt-1">Configure doctor consultation fees and pricing</p>
            </div>
            <Button onClick={handleCreateFee} className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Consultation Fee
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Doctors</p>
                    <p className="text-2xl font-bold text-gray-900">{consultationFees.length}</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-50">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Cash Fee</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{consultationFees.length > 0 ? Math.round(consultationFees.reduce((sum, fee) => sum + Number(fee.cashfee), 0) / consultationFees.length) : 0}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-green-50">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Fees</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {consultationFees.filter((f) => f.status === '1').length}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-orange-50">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Loading consultation fees...</p>
              </div>
            ) : consultationFees.length > 0 ? (
              consultationFees.map((fee) => (
                <Card key={fee.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{fee.firstname} {fee.lastname}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{fee.departmentname || 'No Department'}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditFee(fee)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteFee(fee.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-3">Consultation Fees</h4>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">Cash Fee</p>
                          <p className="font-semibold text-green-700 text-2xl">₹{Number(fee.cashfee).toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-sm text-gray-600">Status</span>
                        <Badge className="bg-green-100 text-green-800">{fee.status === '1' ? 'Active' : 'Inactive'}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No consultation fees found for this location.</p>
              </div>
            )}
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Consultation Fee</DialogTitle>
                <DialogDescription>Configure consultation fee for a doctor.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select value={formData.departmentId} onValueChange={(value) => {
                    setFormData({...formData, departmentId: value, userId: ""})
                    setSearchTerm("")
                    loadUsersByDepartment(value)
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
                  <Label htmlFor="user">User Name</Label>
                  <div className="relative">
                    <Input
                      placeholder="Search user..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setShowDropdown(true)
                      }}
                      onFocus={() => setShowDropdown(true)}
                    />
                    {showDropdown && formData.departmentId && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                        {loading ? (
                          <div className="p-3 text-sm text-gray-500">Loading users...</div>
                        ) : filteredUsers && filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <div
                              key={user.id}
                              onClick={() => {
                                setFormData({...formData, userId: user.id.toString()})
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
                            {searchTerm ? "No users found matching search" : "No users available for this location"}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>



                <div className="grid gap-2">
                  <Label htmlFor="cashFee">Cash Fee (₹)</Label>
                  <Input
                    id="cashFee"
                    type="number"
                    value={formData.cashFee}
                    onChange={(e) => setFormData({ ...formData, cashFee: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={loading} className="bg-red-600 hover:bg-red-700">
                  {loading ? 'Saving...' : 'Add Consultation Fee'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Consultation Fee</DialogTitle>
                <DialogDescription>Update consultation fee for the user.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label>User Name</Label>
                  <Input
                    value={searchTerm}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-cashFee">Cash Fee (₹)</Label>
                  <Input
                    id="edit-cashFee"
                    type="number"
                    value={formData.cashFee}
                    onChange={(e) => setFormData({ ...formData, cashFee: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate} disabled={loading} className="bg-red-600 hover:bg-red-700">
                  {loading ? 'Updating...' : 'Update Consultation Fee'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </PrivateRoute>
  )
}
"use client"

import { useState, useEffect } from "react"
import { settingsApi, UserType } from "@/lib/settingsApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

interface UserFormProps {
  user?: any
  isNew: boolean
  userTypes?: UserType[]
  onSave: () => void
  onCancel: () => void
}

export default function UserForm({ user, isNew, userTypes = [], onSave, onCancel }: UserFormProps) {
  const [selectedUser, setSelectedUser] = useState<any>(user || {
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    userType: 'staff',
    isActive: true,
  })
  const [roles, setRoles] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [locations, setLocations] = useState<any[]>([])
  const [userLocations, setUserLocations] = useState<any[]>([])
  const [locationRoles, setLocationRoles] = useState<{[key: number]: any[]}>({})
  const [locationDepartments, setLocationDepartments] = useState<{[key: number]: any[]}>({})
  const [userErrors, setUserErrors] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    fetchData()
    if (user && !isNew) {
      setSelectedUser({
        ...user,
        userType: user.userType || ''
      })
      const existingLocations = user.userLocationAssignments || 
        (user.locationId ? 
          user.locationId.toString().split(',').map(id => ({
            locationId: parseInt(id.trim()),
            roleId: 0,
            departmentId: 0
          })) : [])
      setUserLocations(existingLocations)
      
      // Load data for existing locations
      existingLocations.forEach(loc => {
        fetchLocationData(loc.locationId)
      })
    }
  }, [user, isNew])

  const fetchData = async () => {
    try {
      const locationsData = await settingsApi.getLocations()
      setLocations(locationsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchLocationData = async (locationId: number) => {
    try {
      console.log('Fetching data for locationId:', locationId)
      const [rolesData, departmentsData] = await Promise.all([
        settingsApi.getRoles(locationId),
        settingsApi.getDepartments(locationId)
      ])
      console.log('Roles data:', rolesData)
      console.log('Departments data:', departmentsData)
      setLocationRoles(prev => ({ ...prev, [locationId]: rolesData || [] }))
      setLocationDepartments(prev => ({ ...prev, [locationId]: departmentsData || [] }))
    } catch (error) {
      console.error('Error fetching location data:', error)
    }
  }

  const validateForm = () => {
    const errors: any = {}
    if (!selectedUser?.username?.trim()) errors.username = 'Username is required'
    if (!selectedUser?.firstName?.trim()) errors.firstName = 'First name is required'
    if (!selectedUser?.lastName?.trim()) errors.lastName = 'Last name is required'
    if (isNew && !selectedUser?.password?.trim()) errors.password = 'Password is required'
    if (isNew && selectedUser?.password && selectedUser.password.length < 6) errors.password = 'Password must be at least 6 characters'
    
    if (userLocations.length === 0) errors.locations = 'At least one location must be selected'
    
    userLocations.forEach((userLoc, index) => {
      const locationIndex = locations.findIndex(loc => loc.id === userLoc.locationId)
      if (!userLoc.roleId || userLoc.roleId === 0) {
        errors[`location_${locationIndex}_role`] = 'Role is required for selected location'
      }
      if (!userLoc.departmentId || userLoc.departmentId === 0) {
        errors[`location_${locationIndex}_department`] = 'Department is required for selected location'
      }
    })

    if (selectedUser?.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(selectedUser.email)) errors.email = 'Please enter a valid email address'
    setUserErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return
    try {
      setLoading(true)
      const locationIds = userLocations.map(loc => loc.locationId).join(',')
      const userData = {
        username: selectedUser.username?.trim(),
        firstName: selectedUser.firstName?.trim(),
        lastName: selectedUser.lastName?.trim(),
        email: selectedUser.email?.trim(),
        phone: selectedUser.phone?.trim() || null,
        password: selectedUser.password,
        roleId: userLocations.length > 0 ? userLocations[0].roleId : null,
        departmentId: userLocations.length > 0 ? userLocations[0].departmentId : null,
        locationId: locationIds || null,
        userLocationAssignments: userLocations,
        isActive: selectedUser.isActive !== undefined ? selectedUser.isActive : true,
        userType: selectedUser.userType || '',
        alternatePhone: selectedUser.alternatePhone?.trim() || null,
        address: selectedUser.address?.trim() || null,
        pincode: selectedUser.pincode?.trim() || null,
        qualification: selectedUser.qualification?.trim() || null,
        yearsOfExperience: selectedUser.yearsOfExperience ? parseInt(selectedUser.yearsOfExperience) : null,
        medicalRegistrationNumber: selectedUser.medicalRegistrationNumber?.trim() || null,
        registrationCouncil: selectedUser.registrationCouncil?.trim() || null,
        registrationValidUntil: selectedUser.registrationValidUntil || null,
        licenseCopy: selectedUser.licenseCopy?.trim() || null,
        degreeCertificates: selectedUser.degreeCertificates?.trim() || null,
        employmentType: selectedUser.employmentType?.trim() || null,
        joiningDate: selectedUser.joiningDate || null,
        workingDays: selectedUser.workingDays || null,
        workingHours: selectedUser.workingHours || null
      }
      
      if (userLocations.length === 0) {
        throw new Error('At least one location must be selected')
      }
      if (!userData.password && isNew) {
        throw new Error('Password is required for new users')
      }
      
      if (isNew) {
        await settingsApi.createUser(userData)
      } else {
        await settingsApi.updateUser(selectedUser.id, userData)
      }
      toast({
        title: isNew ? "User Created" : "User Updated",
        description: `User ${selectedUser?.firstName} ${selectedUser?.lastName} has been ${isNew ? "created" : "updated"} successfully.`,
      })
      onSave()
    } catch (error: any) {
      console.error('Error saving user:', error)
      
      const errorMessage = error?.message || `Failed to ${isNew ? "create" : "update"} user`
      
      // Handle specific field errors - check if it's a 409 conflict
      console.log('Checking for conflicts in message:', errorMessage)
      if (errorMessage.includes('HTTP 409:') || errorMessage.includes('409')) {
        console.log('409 conflict detected')
        if (errorMessage.toLowerCase().includes('username') && errorMessage.toLowerCase().includes('exists')) {
          console.log('Username conflict detected')
          setUserErrors(prev => ({ ...prev, username: 'Username already exists' }))
          return
        } else if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('exists')) {
          console.log('Email conflict detected')
          setUserErrors(prev => ({ ...prev, email: 'Email already exists' }))
          return
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">{isNew ? "Add New User" : "Edit User"}</h1>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
            <div className="space-y-2">
              <Label>Registered as <span className="text-red-500">*</span></Label>
              <Select 
                value={selectedUser?.userType || ""}
                onValueChange={(value) => setSelectedUser((prev) => ({ ...prev, userType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  {userTypes.map((type) => (
                    <SelectItem key={type.code} value={type.code}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username <span className="text-red-500">*</span></Label>
              <Input
                id="username"
                value={selectedUser?.username || ""}
                onChange={(e) => {
                  setSelectedUser((prev) => ({ ...prev, username: e.target.value }))
                  if (userErrors.username) {
                    setUserErrors((prev) => ({ ...prev, username: null }))
                  }
                }}
                className={userErrors.username ? "border-red-500" : ""}
                placeholder="Enter username"
              />
              {userErrors.username && (
                <p className="text-sm text-red-500">{userErrors.username}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                <Input
                  id="firstName"
                  value={selectedUser?.firstName || ""}
                  onChange={(e) => {
                    setSelectedUser((prev) => ({ ...prev, firstName: e.target.value }))
                    if (userErrors.firstName) {
                      setUserErrors((prev) => ({ ...prev, firstName: null }))
                    }
                  }}
                  className={userErrors.firstName ? "border-red-500" : ""}
                  placeholder="Enter first name"
                />
                {userErrors.firstName && (
                  <p className="text-sm text-red-500">{userErrors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                <Input
                  id="lastName"
                  value={selectedUser?.lastName || ""}
                  onChange={(e) => {
                    setSelectedUser((prev) => ({ ...prev, lastName: e.target.value }))
                    if (userErrors.lastName) {
                      setUserErrors((prev) => ({ ...prev, lastName: null }))
                    }
                  }}
                  className={userErrors.lastName ? "border-red-500" : ""}
                  placeholder="Enter last name"
                />
                {userErrors.lastName && (
                  <p className="text-sm text-red-500">{userErrors.lastName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={selectedUser?.email || ""}
                  onChange={(e) => {
                    setSelectedUser((prev) => ({ ...prev, email: e.target.value }))
                    if (userErrors.email) {
                      setUserErrors((prev) => ({ ...prev, email: null }))
                    }
                  }}
                  className={userErrors.email ? "border-red-500" : ""}
                  placeholder="Enter email"
                />
                {userErrors.email && (
                  <p className="text-sm text-red-500">{userErrors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={selectedUser?.phone || ""}
                  onChange={(e) => setSelectedUser((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number (optional)"
                />
              </div>
            </div>

            {selectedUser?.userType === 'doctor' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="alternatePhone">Alternate Phone</Label>
                    <Input
                      id="alternatePhone"
                      value={selectedUser?.alternatePhone || ""}
                      onChange={(e) => setSelectedUser((prev) => ({ ...prev, alternatePhone: e.target.value }))}
                      placeholder="Enter alternate phone"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qualification">Qualification</Label>
                    <Input
                      id="qualification"
                      value={selectedUser?.qualification || ""}
                      onChange={(e) => setSelectedUser((prev) => ({ ...prev, qualification: e.target.value }))}
                      placeholder="Enter qualification"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                    <Input
                      id="yearsOfExperience"
                      type="number"
                      value={selectedUser?.yearsOfExperience || ""}
                      onChange={(e) => setSelectedUser((prev) => ({ ...prev, yearsOfExperience: parseInt(e.target.value) || 0 }))}
                      placeholder="Enter years of experience"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicalRegistrationNumber">Medical Registration Number</Label>
                    <Input
                      id="medicalRegistrationNumber"
                      value={selectedUser?.medicalRegistrationNumber || ""}
                      onChange={(e) => setSelectedUser((prev) => ({ ...prev, medicalRegistrationNumber: e.target.value }))}
                      placeholder="Enter registration number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="registrationCouncil">Registration Council</Label>
                    <Select 
                      value={selectedUser?.registrationCouncil || ""}
                      onValueChange={(value) => setSelectedUser((prev) => ({ ...prev, registrationCouncil: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select council" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MCI">Medical Council of India</SelectItem>
                        <SelectItem value="NMC">National Medical Commission</SelectItem>
                        <SelectItem value="State">State Medical Council</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registrationValidUntil">Registration Valid Until</Label>
                    <Input
                      id="registrationValidUntil"
                      type="date"
                      value={selectedUser?.registrationValidUntil || ""}
                      onChange={(e) => setSelectedUser((prev) => ({ ...prev, registrationValidUntil: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseCopy">Upload License Copy</Label>
                    <Input
                      id="licenseCopy"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setSelectedUser((prev) => ({ ...prev, licenseCopy: file.name }))
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="degreeCertificates">Upload Degree Certificates</Label>
                    <Input
                      id="degreeCertificates"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files
                        if (files && files.length > 0) {
                          const fileNames = Array.from(files).map(f => f.name).join(', ')
                          setSelectedUser((prev) => ({ ...prev, degreeCertificates: fileNames }))
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employmentType">Employment Type</Label>
                    <Select 
                      value={selectedUser?.employmentType || ""}
                      onValueChange={(value) => setSelectedUser((prev) => ({ ...prev, employmentType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select employment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="part-time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="consultant">Consultant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joiningDate">Joining Date</Label>
                    <Input
                      id="joiningDate"
                      type="date"
                      value={selectedUser?.joiningDate || ""}
                      onChange={(e) => setSelectedUser((prev) => ({ ...prev, joiningDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workingDays">Week Days</Label>
                    <Input
                      id="workingDays"
                      value={selectedUser?.workingDays || ""}
                      onChange={(e) => setSelectedUser((prev) => ({ ...prev, workingDays: e.target.value }))}
                      placeholder="Monday-Friday"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workingHours">Timings</Label>
                    <Input
                      id="workingHours"
                      value={selectedUser?.workingHours || ""}
                      onChange={(e) => setSelectedUser((prev) => ({ ...prev, workingHours: e.target.value }))}
                      placeholder="9:00 AM - 5:00 PM"
                    />
                  </div>
                </div>
              </div>
            )}

            {!isNew && (
              <div className="space-y-2">
                <Label htmlFor="password">Change Password (Optional)</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={selectedUser?.password || ""}
                    onChange={(e) => {
                      setSelectedUser((prev) => ({ ...prev, password: e.target.value }))
                      if (userErrors.password) {
                        setUserErrors((prev) => ({ ...prev, password: null }))
                      }
                    }}
                    className={userErrors.password ? "border-red-500 pr-10" : "pr-10"}
                    placeholder="Leave blank to keep current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {userErrors.password && (
                  <p className="text-sm text-red-500">{userErrors.password}</p>
                )}
              </div>
            )}

            {isNew && (
              <div className="space-y-2">
                <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={selectedUser?.password || ""}
                    onChange={(e) => {
                      setSelectedUser((prev) => ({ ...prev, password: e.target.value }))
                      if (userErrors.password) {
                        setUserErrors((prev) => ({ ...prev, password: null }))
                      }
                    }}
                    className={userErrors.password ? "border-red-500 pr-10" : "pr-10"}
                    placeholder="Enter password (min 6 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {userErrors.password && (
                  <p className="text-sm text-red-500">{userErrors.password}</p>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={selectedUser?.pincode || ""}
                  onChange={(e) => setSelectedUser((prev) => ({ ...prev, pincode: e.target.value }))}
                  placeholder="Enter pincode"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={selectedUser?.address || ""}
                  onChange={(e) => setSelectedUser((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter address"
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Location Assignments <span className="text-red-500">*</span></Label>
              {userErrors.locations && (
                <p className="text-sm text-red-500">{userErrors.locations}</p>
              )}
              <div className="border rounded-lg p-4 space-y-3">
                {locations.map((location, index) => {
                  const userLoc = userLocations.find(ul => ul.locationId === location.id)
                  const isChecked = !!userLoc
                  return (
                    <div key={location.id} className="grid grid-cols-4 gap-4 items-center">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`location-${location.id}`}
                          checked={isChecked}
                          onChange={async (e) => {
                            if (e.target.checked) {
                              await fetchLocationData(location.id)
                              setUserLocations(prev => {
                                const existing = prev.find(ul => ul.locationId === location.id)
                                if (existing) {
                                  return prev
                                } else {
                                  return [...prev, { locationId: location.id, roleId: 0, departmentId: 0 }]
                                }
                              })
                            } else {
                              setUserLocations(prev => prev.filter(ul => ul.locationId !== location.id))
                              setUserErrors(prev => {
                                const newErrors = { ...prev }
                                delete newErrors[`location_${index}_role`]
                                delete newErrors[`location_${index}_department`]
                                return newErrors
                              })
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={`location-${location.id}`} className="text-sm">{location.name}</Label>
                      </div>
                      <div className="space-y-1">
                        <Select
                          value={userLoc?.roleId > 0 ? userLoc.roleId.toString() : ""}
                          onValueChange={(value) => {
                            const roleId = parseInt(value)
                            setUserLocations(prev => {
                              const existing = prev.find(ul => ul.locationId === location.id)
                              if (existing) {
                                return prev.map(ul => ul.locationId === location.id ? { ...ul, roleId } : ul)
                              } else {
                                return [...prev, { locationId: location.id, roleId, departmentId: 0 }]
                              }
                            })
                            if (userErrors[`location_${index}_role`]) {
                              setUserErrors(prev => ({ ...prev, [`location_${index}_role`]: null }))
                            }
                          }}
                          disabled={!userLoc}
                        >
                          <SelectTrigger className={`${userErrors[`location_${index}_role`] ? "border-red-500" : ""}`}>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {(locationRoles[location.id] || []).map((role) => (
                              <SelectItem key={role.id} value={role.id.toString()}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {userErrors[`location_${index}_role`] && (
                          <p className="text-xs text-red-500">{userErrors[`location_${index}_role`]}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <Select
                          value={userLoc?.departmentId > 0 ? userLoc.departmentId.toString() : ""}
                          onValueChange={(value) => {
                            const departmentId = parseInt(value)
                            setUserLocations(prev => {
                              const existing = prev.find(ul => ul.locationId === location.id)
                              if (existing) {
                                return prev.map(ul => ul.locationId === location.id ? { ...ul, departmentId } : ul)
                              } else {
                                return [...prev, { locationId: location.id, roleId: 0, departmentId }]
                              }
                            })
                            if (userErrors[`location_${index}_department`]) {
                              setUserErrors(prev => ({ ...prev, [`location_${index}_department`]: null }))
                            }
                          }}
                          disabled={!userLoc}
                        >
                          <SelectTrigger className={`${userErrors[`location_${index}_department`] ? "border-red-500" : ""}`}>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            {(locationDepartments[location.id] || []).map((department) => (
                              <SelectItem key={department.id} value={department.id.toString()}>
                                {department.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {userErrors[`location_${index}_department`] && (
                          <p className="text-xs text-red-500">{userErrors[`location_${index}_department`]}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Active Status</Label>
              <Switch
                id="isActive"
                checked={selectedUser?.isActive || false}
                onCheckedChange={(checked) => setSelectedUser((prev) => ({ ...prev, isActive: checked }))}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700" disabled={loading}>
                {loading ? "Saving..." : (isNew ? "Create User" : "Update User")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
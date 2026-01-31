"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { UserCircle, Edit, Save, X } from "lucide-react"
import { toast } from "sonner"
import authService from "@/lib/authService"

interface UserProfile {
  id: number
  username: string
  firstName: string
  lastName: string
  email: string
  phone: string
  userInfo?: {
    userType: string
    alternatePhone?: string
    address?: string
    state?: string
    city?: string
    pincode?: string
    qualification?: string
    yearsOfExperience?: number
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = authService.getCurrentToken()
      const apiUrl = authService.getSettingsApiUrl()
      const response = await fetch(`${apiUrl}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const profileData = await response.json()
        setProfile(profileData)
        setFormData({
          firstName: profileData.firstName || '',
          lastName: profileData.lastName || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          alternatePhone: profileData.userInfo?.alternatePhone || '',
          address: profileData.userInfo?.address || '',
          state: profileData.userInfo?.state || '',
          city: profileData.userInfo?.city || '',
          pincode: profileData.userInfo?.pincode || '',
          qualification: profileData.userInfo?.qualification || '',
          yearsOfExperience: profileData.userInfo?.yearsOfExperience || 0,
        })
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = authService.getCurrentToken()
      const apiUrl = authService.getSettingsApiUrl()
      
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        userInfo: {
          alternatePhone: formData.alternatePhone,
          address: formData.address,
          state: formData.state,
          city: formData.city,
          pincode: formData.pincode,
          qualification: formData.qualification,
          yearsOfExperience: formData.yearsOfExperience,
        }
      }
      
      const response = await fetch(`${apiUrl}/profile`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        toast.success('Profile updated successfully')
        setIsEditing(false)
        fetchProfile()
      } else {
        const errorData = await response.json()
        console.error('Update failed:', errorData)
        toast.error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    fetchProfile()
  }

  const userType = profile?.userInfo?.userType
  const isHospitalEmployee = userType && userType !== 'user' && userType !== 'patient'

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <UserCircle className="h-8 w-8 text-gray-600" />
            <CardTitle className="text-2xl font-bold text-gray-900">
              {profile?.firstName && profile?.lastName 
                ? `${profile.firstName} ${profile.lastName}` 
                : 'Profile'}
            </CardTitle>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  <div>
                    <Label>Username</Label>
                    <Input value={profile?.username || ''} disabled className="bg-gray-50" />
                  </div>
                  <div>
                    <Label>First Name</Label>
                    <Input 
                      value={formData.firstName} 
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input 
                      value={formData.lastName} 
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  <div>
                    <Label>Email</Label>
                    <Input 
                      value={formData.email} 
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input 
                      value={formData.phone} 
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Alternate Phone</Label>
                    <Input 
                      value={formData.alternatePhone} 
                      onChange={(e) => setFormData(prev => ({ ...prev, alternatePhone: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label>Address</Label>
                    <Textarea 
                      value={formData.address} 
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  <div>
                    <Label>State</Label>
                    <Input 
                      value={formData.state} 
                      onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input 
                      value={formData.city} 
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label>Pincode</Label>
                    <Input 
                      value={formData.pincode} 
                      onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </div>

            {isHospitalEmployee && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    <div>
                      <Label>Qualification</Label>
                      <Input 
                        value={formData.qualification} 
                        onChange={(e) => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label>Years of Experience</Label>
                      <Input 
                        type="number"
                        value={formData.yearsOfExperience} 
                        onChange={(e) => setFormData(prev => ({ ...prev, yearsOfExperience: parseInt(e.target.value) || 0 }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
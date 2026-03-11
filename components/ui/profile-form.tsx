"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
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
    qualification?: string
    yearsOfExperience?: number
    medicalRegistrationNumber?: string
    registrationCouncil?: string
  }
}

interface ProfileFormProps {
  profile: UserProfile
  onClose: () => void
  onUpdate: () => void
}

export function ProfileForm({ profile, onClose, onUpdate }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    email: profile.email || '',
    phone: profile.phone || '',
    alternatePhone: profile.userInfo?.alternatePhone || '',
    address: profile.userInfo?.address || '',
    qualification: profile.userInfo?.qualification || '',
    yearsOfExperience: profile.userInfo?.yearsOfExperience || 0,
    medicalRegistrationNumber: profile.userInfo?.medicalRegistrationNumber || '',
    registrationCouncil: profile.userInfo?.registrationCouncil || '',
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = authService.getCurrentToken()
      const apiUrl = authService.getSettingsApiUrl()
      const response = await fetch(`${apiUrl}/profile`, {
        method: 'PATCH',
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          alternatePhone: formData.alternatePhone,
          address: formData.address,
          qualification: formData.qualification,
          yearsOfExperience: formData.yearsOfExperience,
          medicalRegistrationNumber: formData.medicalRegistrationNumber,
          registrationCouncil: formData.registrationCouncil,
        }),
      })

      if (response.ok) {
        toast.success('Profile updated successfully')
        onUpdate()
        onClose()
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const isDoctor = profile.userInfo?.userType === 'doctor'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alternatePhone">Alternate Phone</Label>
              <Input
                id="alternatePhone"
                value={formData.alternatePhone}
                onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {isDoctor && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Professional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                value={formData.qualification}
                onChange={(e) => handleInputChange('qualification', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <Input
                id="yearsOfExperience"
                type="number"
                value={formData.yearsOfExperience}
                onChange={(e) => handleInputChange('yearsOfExperience', parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="medicalRegistrationNumber">Medical Registration Number</Label>
              <Input
                id="medicalRegistrationNumber"
                value={formData.medicalRegistrationNumber}
                onChange={(e) => handleInputChange('medicalRegistrationNumber', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="registrationCouncil">Registration Council</Label>
              <Input
                id="registrationCouncil"
                value={formData.registrationCouncil}
                onChange={(e) => handleInputChange('registrationCouncil', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </Button>
      </div>
    </form>
  )
}
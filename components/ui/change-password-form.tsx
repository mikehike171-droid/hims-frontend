"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import authService from "@/lib/authService"
import { Eye, EyeOff } from "lucide-react"

interface ChangePasswordFormProps {
  username: string
  onClose: () => void
}

export function ChangePasswordForm({ username, onClose }: ChangePasswordFormProps) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const token = authService.getCurrentToken()
      const apiUrl = authService.getSettingsApiUrl()
      
      const response = await fetch(`${apiUrl}/profile/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      })

      if (response.ok) {
        toast.success('Password changed successfully. Please login again.')
        onClose()
        // Clear all auth data and redirect to login
        setTimeout(() => {
          authService.logout()
        }, 1000)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Failed to change password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Username: <span className="font-medium">{username}</span>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <div className="relative">
          <Input
            id="currentPassword"
            type={showPasswords.current ? "text" : "password"}
            value={formData.currentPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showPasswords.new ? "text" : "password"}
            value={formData.newPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showPasswords.confirm ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Changing...' : 'Change Password'}
        </Button>
      </div>
    </form>
  )
}
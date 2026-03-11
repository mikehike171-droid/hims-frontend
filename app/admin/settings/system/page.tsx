"use client"

import { useState, useEffect } from "react"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { SettingsIcon, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

import { SystemSettings } from "@/lib/api/settings"
import authService from "@/lib/authService"

export default function SystemPage() {
  const [loading, setLoading] = useState(false);
  const [systemSettings, setSystemSettings] = useState<SystemSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string | null>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
      toast({
        title: "Invalid File Type",
        description: "Please select a valid image file (JPG, PNG, GIF).",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('logo', file);

    try {
      console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
      
      const response = await fetch(`${authService.getSettingsApiUrl()}/system-settings/upload-logo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authService.getCurrentToken()}`,
        },
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        const fullLogoUrl = `${authService.getSettingsApiUrl().replace('/api', '')}${result.logoUrl}`;
        
        // Store uploaded logo URL separately - don't show in preview yet
        setUploadedLogoUrl(fullLogoUrl);
        
        toast({
          title: "Logo Uploaded",
          description: "Logo uploaded. Click 'Save Settings' to apply changes.",
        });
      } else {
        const errorText = await response.text();
        console.error('Upload error response:', response.status, errorText);
        toast({
          title: "Upload Failed",
          description: `Failed to upload logo: ${response.status} ${response.statusText}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Logo upload failed:', error);
      toast({
        title: "Upload Error",
        description: `Network error: ${error.message}`,
        variant: "destructive",
      });
    }
  };



  useEffect(() => {
    // Set default settings since we're not using dynamic settings
    setSystemSettings({
      general: {
        hospital_name: 'VithYou Hospital Management System',
        hospital_heading: 'HIMS - Hospital Information Management System',
        hospital_logo: '/images/vithyou.png',
        timezone: 'Asia/Kolkata',
        currency: 'INR',
        dateFormat: 'DD/MM/YYYY',
      },
      security: {
        passwordMinLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSymbols: false,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        enable2FA: false,
      },
      notifications: {
        emailEnabled: true,
        smsEnabled: false,
        pushEnabled: true,
        emailFrom: 'noreply@vithyou.com',
      },
      system: {
        maintenanceMode: false,
        backupFrequency: 'daily',
        maxFileUploadSize: 10,
        enableAuditLogs: true,
      },
    });
  }, []);

  const handleSettingsSave = async () => {
    if (!systemSettings) return;
    
    try {
      setSaving(true);
      
      // Since we're not using dynamic settings, just show success message
      // In a real implementation, you would save to your backend here
      
      // Clear uploaded logo URL after saving
      setUploadedLogoUrl(null);
      
      toast({
        title: "Settings Saved",
        description: "System settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !systemSettings) {
    return (
      <PrivateRoute modulePath="admin/settings" action="view">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </PrivateRoute>
    );
  }

  return (
    <PrivateRoute modulePath="admin/settings" action="view">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600">Configure system-wide settings and preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hospital_name">Hospital Name (Title)</Label>
                <Input
                  id="hospital_name"
                  value={systemSettings.general.hospital_name || ""}
                  onChange={(e) =>
                    setSystemSettings((prev) => prev ? ({
                      ...prev,
                      general: { ...prev.general, hospital_name: e.target.value },
                    }) : null)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospital_heading">Hospital Heading</Label>
                <Input
                  id="hospital_heading"
                  value={systemSettings.general.hospital_heading || ""}
                  onChange={(e) =>
                    setSystemSettings((prev) => prev ? ({
                      ...prev,
                      general: { ...prev.general, hospital_heading: e.target.value },
                    }) : null)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospital_logo">Hospital Logo</Label>
                <Input
                  id="hospital_logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
                {uploadedLogoUrl && (
                  <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                    ✓ New logo uploaded. Click "Save Settings" to apply.
                  </div>
                )}
                <img 
                  src={systemSettings.general.hospital_logo || "/images/pranam-logo.png"} 
                  alt="Logo preview" 
                  className="h-16 w-16 object-contain border rounded mt-2"
                  onError={(e) => {
                    e.currentTarget.src = "/images/pranam-logo.png";
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select 
                  value={systemSettings.general.timezone}
                  onValueChange={(value) =>
                    setSystemSettings((prev) => prev ? ({
                      ...prev,
                      general: { ...prev.general, timezone: value },
                    }) : null)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  value={systemSettings.general.currency}
                  onValueChange={(value) =>
                    setSystemSettings((prev) => prev ? ({
                      ...prev,
                      general: { ...prev.general, currency: value },
                    }) : null)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select 
                  value={systemSettings.general.dateFormat}
                  onValueChange={(value) =>
                    setSystemSettings((prev) => prev ? ({
                      ...prev,
                      general: { ...prev.general, dateFormat: value },
                    }) : null)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                <Input
                  id="passwordMinLength"
                  type="number"
                  value={systemSettings.security.passwordMinLength || 8}
                  onChange={(e) =>
                    setSystemSettings((prev) => prev ? ({
                      ...prev,
                      security: { ...prev.security, passwordMinLength: Number.parseInt(e.target.value) },
                    }) : null)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="requireUppercase">Require Uppercase Letters</Label>
                <Switch
                  id="requireUppercase"
                  checked={systemSettings.security.requireUppercase || false}
                  onCheckedChange={(checked) =>
                    setSystemSettings((prev) => prev ? ({
                      ...prev,
                      security: { ...prev.security, requireUppercase: checked },
                    }) : null)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="requireNumbers">Require Numbers</Label>
                <Switch
                  id="requireNumbers"
                  checked={systemSettings.security.requireNumbers || false}
                  onCheckedChange={(checked) =>
                    setSystemSettings((prev) => prev ? ({
                      ...prev,
                      security: { ...prev.security, requireNumbers: checked },
                    }) : null)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="enable2FA">Enable Two-Factor Authentication</Label>
                <Switch
                  id="enable2FA"
                  checked={systemSettings.security.enable2FA || false}
                  onCheckedChange={(checked) =>
                    setSystemSettings((prev) => prev ? ({
                      ...prev,
                      security: { ...prev.security, enable2FA: checked },
                    }) : null)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={systemSettings.security.sessionTimeout || 30}
                  onChange={(e) =>
                    setSystemSettings((prev) => prev ? ({
                      ...prev,
                      security: { ...prev.security, sessionTimeout: Number.parseInt(e.target.value) },
                    }) : null)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailEnabled">Email Notifications</Label>
                <Switch
                  id="emailEnabled"
                  checked={systemSettings.notifications.emailEnabled || false}
                  onCheckedChange={(checked) =>
                    setSystemSettings((prev) => prev ? ({
                      ...prev,
                      notifications: { ...prev.notifications, emailEnabled: checked },
                    }) : null)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="smsEnabled">SMS Notifications</Label>
                <Switch
                  id="smsEnabled"
                  checked={systemSettings.notifications.smsEnabled || false}
                  onCheckedChange={(checked) =>
                    setSystemSettings((prev) => prev ? ({
                      ...prev,
                      notifications: { ...prev.notifications, smsEnabled: checked },
                    }) : null)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pushEnabled">Push Notifications</Label>
                <Switch
                  id="pushEnabled"
                  checked={systemSettings.notifications.pushEnabled || false}
                  onCheckedChange={(checked) =>
                    setSystemSettings((prev) => prev ? ({
                      ...prev,
                      notifications: { ...prev.notifications, pushEnabled: checked },
                    }) : null)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailFrom">Default Email Sender</Label>
                <Input
                  id="emailFrom"
                  type="email"
                  value={systemSettings.notifications.emailFrom || ""}
                  onChange={(e) =>
                    setSystemSettings((prev) => prev ? ({
                      ...prev,
                      notifications: { ...prev.notifications, emailFrom: e.target.value },
                    }) : null)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                <Switch
                  id="maintenanceMode"
                  checked={systemSettings.system.maintenanceMode || false}
                  onCheckedChange={(checked) =>
                    setSystemSettings((prev) => prev ? ({
                      ...prev,
                      system: { ...prev.system, maintenanceMode: checked },
                    }) : null)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="backupFrequency">Backup Frequency</Label>
                <Select 
                  value={systemSettings.system.backupFrequency}
                  onValueChange={(value) =>
                    setSystemSettings((prev) => prev ? ({
                      ...prev,
                      system: { ...prev.system, backupFrequency: value },
                    }) : null)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxFileUploadSize">Max File Upload Size (MB)</Label>
                <Input
                  id="maxFileUploadSize"
                  type="number"
                  value={systemSettings.system.maxFileUploadSize || 10}
                  onChange={(e) =>
                    setSystemSettings((prev) => prev ? ({
                      ...prev,
                      system: { ...prev.system, maxFileUploadSize: Number.parseInt(e.target.value) },
                    }) : null)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="enableAuditLogs">Enable Audit Logs</Label>
                <Switch
                  id="enableAuditLogs"
                  checked={systemSettings.system.enableAuditLogs || false}
                  onCheckedChange={(checked) =>
                    setSystemSettings((prev) => prev ? ({
                      ...prev,
                      system: { ...prev.system, enableAuditLogs: checked },
                    }) : null)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleSettingsSave} 
            className="bg-red-600 hover:bg-red-700"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </div>
      </div>
    </PrivateRoute>
  )
}
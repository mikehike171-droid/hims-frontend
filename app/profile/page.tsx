"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserLayout from "@/components/layout/user-layout"
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Shield,
  Bell,
  Activity,
  FileText,
  Camera,
  Edit
} from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1985-06-15",
    gender: "Male",
    address: "123 Main Street, City, State 12345",
    emergencyContact: "Jane Doe - +1 (555) 987-6543",
    bloodType: "O+",
    allergies: "Penicillin, Shellfish",
    medicalConditions: "Hypertension, Type 2 Diabetes",
    insurance: "Blue Cross Blue Shield - Policy #12345"
  })

  const [notifications, setNotifications] = useState({
    appointments: true,
    medications: true,
    labResults: true,
    newsletters: false,
    sms: true,
    email: true
  })

  const handleSave = () => {
    setIsEditing(false)
    // Save logic here
  }

  const vitalSigns = [
    { label: "Blood Pressure", value: "120/80 mmHg", date: "2024-01-10", status: "Normal" },
    { label: "Heart Rate", value: "72 bpm", date: "2024-01-10", status: "Normal" },
    { label: "Weight", value: "175 lbs", date: "2024-01-08", status: "Normal" },
    { label: "Height", value: "5'10\"", date: "2024-01-01", status: "Normal" },
    { label: "BMI", value: "25.1", date: "2024-01-08", status: "Normal" }
  ]

  const recentActivity = [
    { type: "Appointment", description: "Cardiology consultation with Dr. Sarah Johnson", date: "2024-01-10" },
    { type: "Lab Result", description: "Blood work results available", date: "2024-01-08" },
    { type: "Prescription", description: "Lisinopril prescription refilled", date: "2024-01-05" },
    { type: "Appointment", description: "Annual physical exam completed", date: "2024-01-03" }
  ]

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <Button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                    <User className="h-12 w-12 text-green-600" />
                  </div>
                  <Button size="sm" variant="outline" className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-2">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                <p className="text-gray-600 mb-4">Patient ID: P001234</p>
                
                <div className="space-y-2 text-sm text-left">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{profileData.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{profileData.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{profileData.dateOfBirth}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Health Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blood Type</span>
                    <span className="font-medium">{profileData.bloodType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Visit</span>
                    <span className="font-medium">Jan 10, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Appointment</span>
                    <span className="font-medium">Jan 15, 2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Profile Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="medical">Medical Info</TabsTrigger>
                <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Personal Information */}
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={profileData.gender} disabled={!isEditing}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={profileData.address}
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input
                        id="emergencyContact"
                        value={profileData.emergencyContact}
                        onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Medical Information */}
              <TabsContent value="medical">
                <Card>
                  <CardHeader>
                    <CardTitle>Medical Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bloodType">Blood Type</Label>
                        <Select value={profileData.bloodType} disabled={!isEditing}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="insurance">Insurance</Label>
                        <Input
                          id="insurance"
                          value={profileData.insurance}
                          onChange={(e) => setProfileData({...profileData, insurance: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="allergies">Allergies</Label>
                      <Textarea
                        id="allergies"
                        value={profileData.allergies}
                        onChange={(e) => setProfileData({...profileData, allergies: e.target.value})}
                        disabled={!isEditing}
                        placeholder="List any known allergies..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medicalConditions">Medical Conditions</Label>
                      <Textarea
                        id="medicalConditions"
                        value={profileData.medicalConditions}
                        onChange={(e) => setProfileData({...profileData, medicalConditions: e.target.value})}
                        disabled={!isEditing}
                        placeholder="List any ongoing medical conditions..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Vital Signs */}
              <TabsContent value="vitals">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-red-500" />
                      <span>Recent Vital Signs</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {vitalSigns.map((vital, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium text-gray-900">{vital.label}</h4>
                            <p className="text-sm text-gray-600">Recorded on {vital.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{vital.value}</p>
                            <p className="text-sm text-green-600">{vital.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{activity.type}</p>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                            <p className="text-xs text-gray-500">{activity.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings */}
              <TabsContent value="settings">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Bell className="h-5 w-5 text-yellow-500" />
                        <span>Notification Preferences</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="appointments">Appointment Reminders</Label>
                          <p className="text-sm text-gray-600">Get notified about upcoming appointments</p>
                        </div>
                        <Switch
                          id="appointments"
                          checked={notifications.appointments}
                          onCheckedChange={(checked) => setNotifications({...notifications, appointments: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="medications">Medication Reminders</Label>
                          <p className="text-sm text-gray-600">Get reminded to take your medications</p>
                        </div>
                        <Switch
                          id="medications"
                          checked={notifications.medications}
                          onCheckedChange={(checked) => setNotifications({...notifications, medications: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="labResults">Lab Results</Label>
                          <p className="text-sm text-gray-600">Get notified when lab results are available</p>
                        </div>
                        <Switch
                          id="labResults"
                          checked={notifications.labResults}
                          onCheckedChange={(checked) => setNotifications({...notifications, labResults: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="sms">SMS Notifications</Label>
                          <p className="text-sm text-gray-600">Receive notifications via text message</p>
                        </div>
                        <Switch
                          id="sms"
                          checked={notifications.sms}
                          onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email">Email Notifications</Label>
                          <p className="text-sm text-gray-600">Receive notifications via email</p>
                        </div>
                        <Switch
                          id="email"
                          checked={notifications.email}
                          onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-green-500" />
                        <span>Privacy & Security</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Two-Factor Authentication
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Download My Data
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                        Delete Account
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </UserLayout>
  )
}
"use client"

import { useState } from "react"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  Plus,
  Edit,
  Trash2,
  Save,
  Upload,
  FileText,
  AlertTriangle,
  User,
  Calendar,
  Activity,
  Cigarette,
  Wine,
  Moon,
  Dumbbell,
} from "lucide-react"

export default function PatientHealthHistory() {
  const [editMode, setEditMode] = useState(false)

  const healthData = {
    personalInfo: {
      bloodGroup: "O+",
      height: "175",
      weight: "70",
      bmi: "22.9",
      emergencyContact: "+91-9876543210",
    },
    habits: {
      smoking: "Never",
      alcohol: "Occasionally",
      exercise: "3-4 times per week",
      sleep: "7-8 hours",
      diet: "Vegetarian",
    },
    allergies: [
      { type: "Drug", name: "Penicillin", severity: "Severe", reaction: "Skin rash, difficulty breathing" },
      { type: "Food", name: "Peanuts", severity: "Moderate", reaction: "Swelling, hives" },
    ],
    chronicConditions: [
      { condition: "Hypertension", diagnosedDate: "2020-03-15", status: "Controlled", medications: ["Lisinopril"] },
      {
        condition: "Type 2 Diabetes",
        diagnosedDate: "2019-08-22",
        status: "Well-controlled",
        medications: ["Metformin"],
      },
    ],
    pastIllnesses: [
      { illness: "COVID-19", date: "2022-01-10", severity: "Mild", treatment: "Home isolation, symptomatic treatment" },
      {
        illness: "Pneumonia",
        date: "2018-12-05",
        severity: "Moderate",
        treatment: "Antibiotics, hospitalization for 5 days",
      },
    ],
    surgeries: [{ surgery: "Appendectomy", date: "2015-06-20", hospital: "City Hospital", complications: "None" }],
    familyHistory: [
      { relation: "Father", condition: "Heart Disease", ageOfOnset: "55", status: "Deceased" },
      { relation: "Mother", condition: "Diabetes", ageOfOnset: "60", status: "Living" },
      { relation: "Maternal Grandfather", condition: "Stroke", ageOfOnset: "70", status: "Deceased" },
    ],
    medications: [
      { name: "Metformin 500mg", dosage: "Twice daily", startDate: "2019-08-22", prescribedBy: "Dr. Sarah Wilson" },
      { name: "Lisinopril 10mg", dosage: "Once daily", startDate: "2020-03-15", prescribedBy: "Dr. Sarah Wilson" },
    ],
    immunizations: [
      { vaccine: "COVID-19 (Covishield)", date: "2021-05-15", doseNumber: "1st Dose", nextDue: null },
      { vaccine: "COVID-19 (Covishield)", date: "2021-07-10", doseNumber: "2nd Dose", nextDue: null },
      { vaccine: "Influenza", date: "2023-10-15", doseNumber: "Annual", nextDue: "2024-10-15" },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Health History</h1>
            <p className="text-gray-600">Manage your complete health profile and medical history</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Documents
            </Button>
            <Button
              onClick={() => setEditMode(!editMode)}
              className={editMode ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
            >
              {editMode ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="conditions">Conditions</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="allergies">Allergies</TabsTrigger>
            <TabsTrigger value="family">Family History</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Blood Group</Label>
                      {editMode ? (
                        <Select defaultValue={healthData.personalInfo.bloodGroup}>
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
                      ) : (
                        <p className="text-lg font-semibold text-red-600">{healthData.personalInfo.bloodGroup}</p>
                      )}
                    </div>
                    <div>
                      <Label>Emergency Contact</Label>
                      {editMode ? (
                        <Input defaultValue={healthData.personalInfo.emergencyContact} />
                      ) : (
                        <p className="text-sm text-gray-700">{healthData.personalInfo.emergencyContact}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Height (cm)</Label>
                      {editMode ? (
                        <Input defaultValue={healthData.personalInfo.height} />
                      ) : (
                        <p className="text-lg font-semibold">{healthData.personalInfo.height} cm</p>
                      )}
                    </div>
                    <div>
                      <Label>Weight (kg)</Label>
                      {editMode ? (
                        <Input defaultValue={healthData.personalInfo.weight} />
                      ) : (
                        <p className="text-lg font-semibold">{healthData.personalInfo.weight} kg</p>
                      )}
                    </div>
                    <div>
                      <Label>BMI</Label>
                      <p className="text-lg font-semibold text-green-600">{healthData.personalInfo.bmi}</p>
                      <p className="text-xs text-gray-500">Normal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Medications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-600" />
                    Current Medications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {healthData.medications.map((med, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{med.name}</p>
                            <p className="text-sm text-gray-600">{med.dosage}</p>
                            <p className="text-xs text-gray-500">Since {med.startDate}</p>
                          </div>
                          {editMode && (
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {editMode && (
                      <Button variant="outline" className="w-full bg-transparent">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Medication
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{healthData.allergies.length}</p>
                  <p className="text-sm text-gray-600">Known Allergies</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{healthData.chronicConditions.length}</p>
                  <p className="text-sm text-gray-600">Chronic Conditions</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{healthData.surgeries.length}</p>
                  <p className="text-sm text-gray-600">Past Surgeries</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <User className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{healthData.familyHistory.length}</p>
                  <p className="text-sm text-gray-600">Family Conditions</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="conditions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chronic Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      Chronic Conditions
                    </span>
                    {editMode && (
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {healthData.chronicConditions.map((condition, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{condition.condition}</h4>
                            <p className="text-sm text-gray-600">Diagnosed: {condition.diagnosedDate}</p>
                            <p className="text-sm text-green-600">Status: {condition.status}</p>
                            <div className="mt-2">
                              <p className="text-xs text-gray-500">Current Medications:</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {condition.medications.map((med, medIndex) => (
                                  <span key={medIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                    {med}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          {editMode && (
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Past Illnesses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-orange-600" />
                      Past Illnesses
                    </span>
                    {editMode && (
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {healthData.pastIllnesses.map((illness, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{illness.illness}</h4>
                            <p className="text-sm text-gray-600">{illness.date}</p>
                            <p className="text-sm text-orange-600">Severity: {illness.severity}</p>
                            <p className="text-xs text-gray-500 mt-1">{illness.treatment}</p>
                          </div>
                          {editMode && (
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Surgeries */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    Surgical History
                  </span>
                  {editMode && (
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Surgery
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthData.surgeries.map((surgery, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{surgery.surgery}</h4>
                          <p className="text-sm text-gray-600">{surgery.date}</p>
                          <p className="text-sm text-blue-600">Hospital: {surgery.hospital}</p>
                          <p className="text-xs text-gray-500 mt-1">Complications: {surgery.complications}</p>
                        </div>
                        {editMode && (
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lifestyle" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Lifestyle & Habits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Cigarette className="h-5 w-5 text-red-600" />
                      <div className="flex-1">
                        <Label>Smoking</Label>
                        {editMode ? (
                          <Select defaultValue={healthData.habits.smoking}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Never">Never</SelectItem>
                              <SelectItem value="Former">Former smoker</SelectItem>
                              <SelectItem value="Current">Current smoker</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm text-gray-700">{healthData.habits.smoking}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Wine className="h-5 w-5 text-purple-600" />
                      <div className="flex-1">
                        <Label>Alcohol</Label>
                        {editMode ? (
                          <Select defaultValue={healthData.habits.alcohol}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Never">Never</SelectItem>
                              <SelectItem value="Occasionally">Occasionally</SelectItem>
                              <SelectItem value="Regularly">Regularly</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm text-gray-700">{healthData.habits.alcohol}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Dumbbell className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <Label>Exercise</Label>
                        {editMode ? (
                          <Input defaultValue={healthData.habits.exercise} />
                        ) : (
                          <p className="text-sm text-gray-700">{healthData.habits.exercise}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Moon className="h-5 w-5 text-indigo-600" />
                      <div className="flex-1">
                        <Label>Sleep</Label>
                        {editMode ? (
                          <Input defaultValue={healthData.habits.sleep} />
                        ) : (
                          <p className="text-sm text-gray-700">{healthData.habits.sleep}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Heart className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <Label>Diet</Label>
                        {editMode ? (
                          <Select defaultValue={healthData.habits.diet}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                              <SelectItem value="Non-vegetarian">Non-vegetarian</SelectItem>
                              <SelectItem value="Vegan">Vegan</SelectItem>
                              <SelectItem value="Mixed">Mixed</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm text-gray-700">{healthData.habits.diet}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

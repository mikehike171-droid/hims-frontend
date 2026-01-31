"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import UserLayout from "@/components/layout/user-layout"
import { 
  Pill, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Search,
  Calendar,
  Bell,
  Plus
} from "lucide-react"

export default function MedicationsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const medications = [
    {
      id: 1,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      remaining: 15,
      total: 30,
      nextRefill: "2024-01-20",
      prescribedBy: "Dr. Sarah Johnson",
      instructions: "Take with food in the morning",
      status: "Active",
      sideEffects: ["Dizziness", "Dry cough"],
      category: "Blood Pressure"
    },
    {
      id: 2,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      remaining: 8,
      total: 60,
      nextRefill: "2024-01-16",
      prescribedBy: "Dr. Emily Rodriguez",
      instructions: "Take with meals",
      status: "Low Stock",
      sideEffects: ["Nausea", "Stomach upset"],
      category: "Diabetes"
    },
    {
      id: 3,
      name: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily",
      remaining: 25,
      total: 30,
      nextRefill: "2024-01-25",
      prescribedBy: "Dr. Sarah Johnson",
      instructions: "Take at bedtime",
      status: "Active",
      sideEffects: ["Muscle pain", "Headache"],
      category: "Cholesterol"
    }
  ]

  const upcomingDoses = [
    { medication: "Lisinopril 10mg", time: "8:00 AM", taken: false },
    { medication: "Metformin 500mg", time: "12:00 PM", taken: true },
    { medication: "Metformin 500mg", time: "6:00 PM", taken: false },
    { medication: "Atorvastatin 20mg", time: "10:00 PM", taken: false }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800"
      case "Low Stock": return "bg-yellow-100 text-yellow-800"
      case "Out of Stock": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getProgressColor = (remaining: number, total: number) => {
    const percentage = (remaining / total) * 100
    if (percentage <= 20) return "bg-red-500"
    if (percentage <= 40) return "bg-yellow-500"
    return "bg-green-500"
  }

  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Medications</h1>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Medication
          </Button>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Active Medications</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <Pill className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100">Low Stock</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Doses Today</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
                <Clock className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Adherence Rate</p>
                  <p className="text-2xl font-bold">92%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Medications List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search medications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Medications */}
            <div className="space-y-4">
              {filteredMedications.map((medication) => (
                <Card key={medication.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Pill className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {medication.name} {medication.dosage}
                          </h3>
                          <p className="text-gray-600">{medication.frequency}</p>
                          <p className="text-sm text-gray-500">Prescribed by {medication.prescribedBy}</p>
                          <Badge variant="outline" className="mt-1">
                            {medication.category}
                          </Badge>
                        </div>
                      </div>
                      <Badge className={getStatusColor(medication.status)}>
                        {medication.status}
                      </Badge>
                    </div>

                    {/* Stock Level */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Stock Level</span>
                        <span>{medication.remaining} of {medication.total} pills</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(medication.remaining, medication.total)}`}
                          style={{ width: `${(medication.remaining / medication.total) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-700">
                        <strong>Instructions:</strong> {medication.instructions}
                      </p>
                    </div>

                    {/* Next Refill */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        Next refill: {medication.nextRefill}
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          Refill Now
                        </Button>
                        <Button size="sm" variant="outline">
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span>Today's Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingDoses.map((dose, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                      dose.taken ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                    }`}>
                      <div>
                        <p className="font-medium text-gray-900">{dose.medication}</p>
                        <p className="text-sm text-gray-600">{dose.time}</p>
                      </div>
                      {dose.taken ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Button size="sm" variant="outline">
                          Mark Taken
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reminders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-yellow-500" />
                  <span>Reminders</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">Low Stock Alert</p>
                    <p className="text-sm text-yellow-700">Metformin needs refill in 3 days</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Upcoming Dose</p>
                    <p className="text-sm text-blue-700">Metformin 500mg at 6:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </UserLayout>
  )
}
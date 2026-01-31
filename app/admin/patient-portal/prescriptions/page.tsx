"use client"

import { useState } from "react"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  Pill,
  Search,
  Filter,
  Download,
  Share,
  Clock,
  CheckCircle,
  AlertTriangle,
  ShoppingCart,
  RefreshCw,
  Calendar,
  User,
} from "lucide-react"

export default function PatientPrescriptions() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const router = useRouter()

  const prescriptions = [
    {
      id: "rx001",
      date: "2024-01-20",
      doctor: "Dr. Sarah Wilson",
      department: "Cardiology",
      medications: [
        {
          name: "Metformin 500mg",
          dosage: "1 tablet",
          frequency: "Twice daily",
          duration: "30 days",
          instructions: "Take with meals",
          status: "purchased",
          quantity: 60,
          refillsRemaining: 2,
        },
        {
          name: "Lisinopril 10mg",
          dosage: "1 tablet",
          frequency: "Once daily",
          duration: "30 days",
          instructions: "Take in morning",
          status: "partial",
          quantity: 30,
          refillsRemaining: 1,
        },
      ],
      status: "active",
      totalItems: 2,
      purchasedItems: 1,
      partialItems: 1,
    },
    {
      id: "rx002",
      date: "2024-01-15",
      doctor: "Dr. Michael Chen",
      department: "Orthopedics",
      medications: [
        {
          name: "Ibuprofen 400mg",
          dosage: "1 tablet",
          frequency: "Three times daily",
          duration: "7 days",
          instructions: "Take after meals",
          status: "purchased",
          quantity: 21,
          refillsRemaining: 0,
        },
        {
          name: "Calcium Carbonate 500mg",
          dosage: "1 tablet",
          frequency: "Twice daily",
          duration: "30 days",
          instructions: "Take with water",
          status: "not_purchased",
          quantity: 60,
          refillsRemaining: 3,
        },
      ],
      status: "completed",
      totalItems: 2,
      purchasedItems: 1,
      notPurchasedItems: 1,
    },
  ]

  const adherenceData = [
    {
      medication: "Metformin 500mg",
      scheduled: 14,
      taken: 12,
      missed: 2,
      adherenceRate: 86,
      nextDue: "8:00 AM",
      status: "due_soon",
    },
    {
      medication: "Lisinopril 10mg",
      scheduled: 7,
      taken: 7,
      missed: 0,
      adherenceRate: 100,
      nextDue: "9:00 AM",
      status: "taken_today",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "purchased":
        return "bg-green-100 text-green-800"
      case "partial":
        return "bg-yellow-100 text-yellow-800"
      case "not_purchased":
        return "bg-red-100 text-red-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAdherenceColor = (rate: number) => {
    if (rate >= 90) return "text-green-600"
    if (rate >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const filteredPrescriptions = prescriptions.filter((rx) => {
    const matchesSearch =
      rx.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.medications.some((med) => med.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || rx.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <PrivateRoute modulePath="admin/patient-portal/prescriptions" action="view">
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Prescriptions</h1>
            <p className="text-gray-600">Manage your medications and prescriptions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => router.push("/patient-portal/pharmacy")}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Order Refills
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <Tabs defaultValue="prescriptions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="prescriptions">E-Prescriptions</TabsTrigger>
            <TabsTrigger value="adherence">Medication Adherence</TabsTrigger>
            <TabsTrigger value="refills">Refill Management</TabsTrigger>
          </TabsList>

          <TabsContent value="prescriptions" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by doctor, medication, or department..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Prescriptions List */}
            <div className="space-y-4">
              {filteredPrescriptions.map((prescription) => (
                <Card key={prescription.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold">Prescription #{prescription.id}</span>
                          <Badge className={getStatusColor(prescription.status)}>{prescription.status}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {prescription.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {prescription.doctor}
                          </div>
                          <span>{prescription.department}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>

                    {/* Medications */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Medications:</h4>
                      {prescription.medications.map((med, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Pill className="h-4 w-4 text-green-600" />
                              <span className="font-medium">{med.name}</span>
                              <Badge className={getStatusColor(med.status)} variant="outline">
                                {med.status.replace("_", " ")}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 grid grid-cols-2 md:grid-cols-4 gap-2">
                              <span>
                                <strong>Dosage:</strong> {med.dosage}
                              </span>
                              <span>
                                <strong>Frequency:</strong> {med.frequency}
                              </span>
                              <span>
                                <strong>Duration:</strong> {med.duration}
                              </span>
                              <span>
                                <strong>Refills:</strong> {med.refillsRemaining}
                              </span>
                            </div>
                            <p className="text-sm text-blue-600 mt-1">
                              <strong>Instructions:</strong> {med.instructions}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            {med.status === "not_purchased" && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() =>
                                  router.push(`/patient-portal/pharmacy?medication=${encodeURIComponent(med.name)}`)
                                }
                              >
                                <ShoppingCart className="h-4 w-4 mr-1" />
                                Buy Now
                              </Button>
                            )}
                            {med.refillsRemaining > 0 && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  router.push(`/patient-portal/pharmacy?medication=${encodeURIComponent(med.name)}`)
                                }
                              >
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Refill
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Purchase Summary */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span>
                          <strong>Purchase Status:</strong> {prescription.purchasedItems || 0} of{" "}
                          {prescription.totalItems} items purchased
                        </span>
                        <div className="flex gap-4">
                          {prescription.purchasedItems > 0 && (
                            <span className="text-green-600">
                              <CheckCircle className="h-4 w-4 inline mr-1" />
                              {prescription.purchasedItems} Purchased
                            </span>
                          )}
                          {prescription.partialItems > 0 && (
                            <span className="text-yellow-600">
                              <Clock className="h-4 w-4 inline mr-1" />
                              {prescription.partialItems} Partial
                            </span>
                          )}
                          {prescription.notPurchasedItems > 0 && (
                            <span className="text-red-600">
                              <AlertTriangle className="h-4 w-4 inline mr-1" />
                              {prescription.notPurchasedItems} Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="adherence" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {adherenceData.map((med, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Pill className="h-5 w-5 text-green-600" />
                        {med.medication}
                      </span>
                      <Badge
                        className={
                          med.status === "taken_today" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {med.status === "taken_today" ? "Taken Today" : "Due Soon"}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Adherence Rate</span>
                        <span className={`font-semibold ${getAdherenceColor(med.adherenceRate)}`}>
                          {med.adherenceRate}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            med.adherenceRate >= 90
                              ? "bg-green-500"
                              : med.adherenceRate >= 70
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${med.adherenceRate}%` }}
                        ></div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-green-600">{med.taken}</p>
                          <p className="text-sm text-gray-600">Taken</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-red-600">{med.missed}</p>
                          <p className="text-sm text-gray-600">Missed</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-600">{med.scheduled}</p>
                          <p className="text-sm text-gray-600">Scheduled</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium">Next Dose:</span>
                        <span className="text-sm text-blue-600">{med.nextDue}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark as Taken
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          <Clock className="h-4 w-4 mr-1" />
                          Snooze
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="refills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-blue-600" />
                  Refill Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prescriptions
                    .flatMap((rx) => rx.medications)
                    .filter((med) => med.refillsRemaining > 0)
                    .map((med, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{med.name}</h4>
                          <p className="text-sm text-gray-600">
                            {med.dosage} - {med.frequency}
                          </p>
                          <p className="text-sm text-blue-600">Refills remaining: {med.refillsRemaining}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              router.push(`/patient-portal/pharmacy?medication=${encodeURIComponent(med.name)}`)
                            }
                          >
                            <Calendar className="h-4 w-4 mr-1" />
                            Schedule Refill
                          </Button>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() =>
                              router.push(`/patient-portal/pharmacy?medication=${encodeURIComponent(med.name)}`)
                            }
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Order Now
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </PrivateRoute>
  )
}

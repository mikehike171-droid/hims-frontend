"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, FileText, Eye, Download, MessageSquare } from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function PrescriptionHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const prescriptionHistory = [
    {
      id: "RX001234",
      patientName: "John Doe",
      patientId: "P001234",
      date: "2024-01-20",
      diagnosis: "Hypertension, Fever",
      medicines: [
        { name: "Paracetamol 500mg", frequency: "TID", duration: "5 days" },
        { name: "Amlodipine 5mg", frequency: "OD", duration: "30 days" },
      ],
      labTests: ["Lipid Profile", "Kidney Function Test"],
      followUpDate: "2024-01-27",
      status: "active",
      deliveryMethod: "whatsapp",
      paymentAmount: 800,
    },
    {
      id: "RX001235",
      patientName: "Jane Smith",
      patientId: "P001235",
      date: "2024-01-19",
      diagnosis: "Upper Respiratory Infection",
      medicines: [
        { name: "Amoxicillin 500mg", frequency: "TID", duration: "7 days" },
        { name: "Cetirizine 10mg", frequency: "OD", duration: "5 days" },
      ],
      labTests: [],
      followUpDate: "2024-01-26",
      status: "completed",
      deliveryMethod: "email",
      paymentAmount: 700,
    },
    {
      id: "RX001236",
      patientName: "Mike Johnson",
      patientId: "P001236",
      date: "2024-01-18",
      diagnosis: "Diabetes Mellitus Type 2",
      medicines: [
        { name: "Metformin 500mg", frequency: "BD", duration: "30 days" },
        { name: "Glimepiride 2mg", frequency: "OD", duration: "30 days" },
      ],
      labTests: ["HbA1c", "Fasting Blood Sugar"],
      followUpDate: "2024-02-18",
      status: "active",
      deliveryMethod: "print",
      paymentAmount: 500,
    },
  ]

  const filteredPrescriptions = prescriptionHistory.filter((rx) => {
    const matchesSearch =
      rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === "all" || rx.status === selectedStatus

    const matchesPeriod = selectedPeriod === "all" || checkPeriod(rx.date, selectedPeriod)

    return matchesSearch && matchesStatus && matchesPeriod
  })

  function checkPeriod(date: string, period: string) {
    const rxDate = new Date(date)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - rxDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    switch (period) {
      case "today":
        return diffDays <= 1
      case "week":
        return diffDays <= 7
      case "month":
        return diffDays <= 30
      default:
        return true
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDeliveryIcon = (method: string) => {
    switch (method) {
      case "whatsapp":
        return <MessageSquare className="h-4 w-4 text-green-600" />
      case "email":
        return <MessageSquare className="h-4 w-4 text-blue-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <PrivateRoute modulePath="admin/prescriptions/history" action="view">
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Prescription History</h1>
          <p className="text-gray-600">View and manage past prescriptions</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{filteredPrescriptions.length} Prescriptions</Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2 text-red-600" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search by patient, ID, or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button variant="outline" className="w-full bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prescription List */}
      <div className="space-y-4">
        {filteredPrescriptions.map((rx) => (
          <Card key={rx.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{rx.patientName}</h3>
                    <Badge variant="outline">{rx.patientId}</Badge>
                    <Badge className={getStatusColor(rx.status)}>{rx.status.toUpperCase()}</Badge>
                  </div>
                  <p className="text-gray-600 mb-1">
                    <strong>Diagnosis:</strong> {rx.diagnosis}
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {rx.date} | Payment: ₹{rx.paymentAmount} | Follow-up: {rx.followUpDate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getDeliveryIcon(rx.deliveryMethod)}
                  <Badge variant="outline" className="font-mono">
                    {rx.id}
                  </Badge>
                </div>
              </div>

              <Tabs defaultValue="medicines" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="medicines">Medicines ({rx.medicines.length})</TabsTrigger>
                  <TabsTrigger value="tests">Lab Tests ({rx.labTests.length})</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>

                <TabsContent value="medicines" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {rx.medicines.map((medicine, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium">{medicine.name}</p>
                        <p className="text-sm text-gray-600">
                          {medicine.frequency} for {medicine.duration}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="tests" className="mt-4">
                  {rx.labTests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {rx.labTests.map((test, index) => (
                        <div key={index} className="p-3 bg-blue-50 rounded-lg">
                          <p className="font-medium text-blue-800">{test}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No lab tests ordered</p>
                  )}
                </TabsContent>

                <TabsContent value="actions" className="mt-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Full
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Resend
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Create Similar
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPrescriptions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No prescriptions found matching your criteria</p>
          </CardContent>
        </Card>
      )}
      </div>
    </PrivateRoute>
  )
}

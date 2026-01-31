"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Plus,
  Receipt,
  IndianRupee,
  Printer,
  Save,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Eye,
} from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"

const mockEstimates = [
  {
    id: "EST001",
    patientName: "Rajesh Kumar",
    patientId: "P001234",
    date: "2024-01-15",
    totalAmount: 15000,
    depositPaid: 5000,
    status: "pending",
    validUntil: "2024-02-15",
    services: ["Consultation", "ECG", "Blood Tests"],
  },
  {
    id: "EST002",
    patientName: "Priya Sharma",
    patientId: "P001235",
    date: "2024-01-14",
    totalAmount: 8500,
    depositPaid: 8500,
    status: "approved",
    validUntil: "2024-02-14",
    services: ["X-Ray", "Physiotherapy"],
  },
  {
    id: "EST003",
    patientName: "Amit Singh",
    patientId: "P001236",
    date: "2024-01-13",
    totalAmount: 25000,
    depositPaid: 10000,
    status: "expired",
    validUntil: "2024-01-13",
    services: ["Surgery", "Room Charges", "Medicines"],
  },
]

const mockServices = [
  { id: "S001", name: "General Consultation", price: 500, category: "Consultation" },
  { id: "S002", name: "Specialist Consultation", price: 800, category: "Consultation" },
  { id: "S003", name: "ECG", price: 200, category: "Investigation" },
  { id: "S004", name: "Blood Test - CBC", price: 300, category: "Lab" },
  { id: "S005", name: "X-Ray Chest", price: 400, category: "Radiology" },
  { id: "S006", name: "Room Charges (General Ward)", price: 1500, category: "Accommodation" },
  { id: "S007", name: "Room Charges (Private)", price: 3000, category: "Accommodation" },
  { id: "S008", name: "Minor Surgery", price: 15000, category: "Procedure" },
]

export default function EstimatesAndDeposits() {
  const [activeTab, setActiveTab] = useState("estimates")
  const [selectedServices, setSelectedServices] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [patientSearch, setPatientSearch] = useState("")
  const [estimateType, setEstimateType] = useState("outpatient")
  const [validityDays, setValidityDays] = useState(30)
  const [notes, setNotes] = useState("")

  const addService = (service) => {
    const existingService = selectedServices.find((s) => s.id === service.id)
    if (existingService) {
      setSelectedServices(selectedServices.map((s) => (s.id === service.id ? { ...s, quantity: s.quantity + 1 } : s)))
    } else {
      setSelectedServices([...selectedServices, { ...service, quantity: 1 }])
    }
  }

  const removeService = (serviceId) => {
    setSelectedServices(selectedServices.filter((s) => s.id !== serviceId))
  }

  const updateQuantity = (serviceId, quantity) => {
    if (quantity <= 0) {
      removeService(serviceId)
    } else {
      setSelectedServices(selectedServices.map((s) => (s.id === serviceId ? { ...s, quantity } : s)))
    }
  }

  const calculateTotal = () => {
    return selectedServices.reduce((total, service) => total + service.price * service.quantity, 0)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "approved":
        return <CheckCircle className="h-4 w-4" />
      case "expired":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const filteredServices = mockServices.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleGenerateEstimate = () => {
    console.log("Generating estimate with:", {
      services: selectedServices,
      total: calculateTotal(),
      type: estimateType,
      validity: validityDays,
      notes,
    })
    alert("Estimate generated successfully!")
  }

  return (
    <PrivateRoute modulePath="admin/front-office/estimates" action="view">
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estimates & Deposits</h1>
          <p className="text-gray-600">Treatment cost estimates and advance deposit management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Estimate
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="estimates">Estimates List</TabsTrigger>
          <TabsTrigger value="create">Create Estimate</TabsTrigger>
          <TabsTrigger value="deposits">Deposit Management</TabsTrigger>
        </TabsList>

        <TabsContent value="estimates" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Treatment Estimates</CardTitle>
                  <CardDescription>All patient estimates and their status</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Search estimates..." className="pl-10 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEstimates.map((estimate) => (
                  <div key={estimate.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="font-bold text-lg">{estimate.id}</div>
                        <div className="text-sm text-gray-600">{estimate.date}</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{estimate.patientName}</span>
                          <Badge className={getStatusColor(estimate.status)}>
                            {getStatusIcon(estimate.status)}
                            <span className="ml-1 capitalize">{estimate.status}</span>
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Patient ID: {estimate.patientId}</p>
                          <p>Services: {estimate.services.join(", ")}</p>
                          <p>Valid until: {estimate.validUntil}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">₹{estimate.totalAmount.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Deposit: ₹{estimate.depositPaid.toLocaleString()}</div>
                        <div className="text-sm text-orange-600">
                          Balance: ₹{(estimate.totalAmount - estimate.depositPaid).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Printer className="h-4 w-4 mr-1" />
                        Print
                      </Button>
                      {estimate.status === "pending" && (
                        <Button size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Estimate Creation Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Patient & Estimate Details</CardTitle>
                  <CardDescription>Basic information for the estimate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search patient by name, ID, or phone..."
                          value={patientSearch}
                          onChange={(e) => setPatientSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <Button>Search</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="estimateType">Estimate Type</Label>
                        <Select value={estimateType} onValueChange={setEstimateType}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="outpatient">Outpatient</SelectItem>
                            <SelectItem value="inpatient">Inpatient</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                            <SelectItem value="surgery">Surgery</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="validity">Validity (Days)</Label>
                        <Input
                          id="validity"
                          type="number"
                          value={validityDays}
                          onChange={(e) => setValidityDays(Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Notes & Instructions</Label>
                      <Textarea
                        id="notes"
                        placeholder="Additional notes for the estimate..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Services & Procedures</CardTitle>
                  <CardDescription>Add services to the estimate</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search services..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                      {filteredServices.map((service) => (
                        <Card
                          key={service.id}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => addService(service)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{service.name}</h4>
                                <p className="text-sm text-gray-600">{service.category}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">₹{service.price}</p>
                                <Button size="sm" className="mt-1">
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Estimate Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estimate Summary</CardTitle>
                  <CardDescription>Selected services and total cost</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedServices.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No services selected</p>
                    ) : (
                      <>
                        {selectedServices.map((service) => (
                          <div key={service.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{service.name}</p>
                              <p className="text-xs text-gray-600">₹{service.price} each</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(service.id, service.quantity - 1)}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center">{service.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(service.id, service.quantity + 1)}
                              >
                                +
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => removeService(service.id)}>
                                ×
                              </Button>
                            </div>
                          </div>
                        ))}

                        <div className="border-t pt-4">
                          <div className="flex justify-between font-bold text-lg">
                            <span>Total Estimate:</span>
                            <span>₹{calculateTotal().toLocaleString()}</span>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={handleGenerateEstimate}
                        disabled={selectedServices.length === 0}
                      >
                        <Receipt className="h-4 w-4 mr-2" />
                        Generate
                      </Button>
                      <Button variant="outline">
                        <Save className="h-4 w-4 mr-2" />
                        Save Draft
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="deposits" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Collect Deposit</CardTitle>
                <CardDescription>Collect advance payment from patient</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="depositPatient">Patient</Label>
                    <div className="flex gap-2">
                      <Input id="depositPatient" placeholder="Search patient..." className="flex-1" />
                      <Button>Search</Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="depositAmount">Deposit Amount</Label>
                    <Input id="depositAmount" type="number" placeholder="Enter amount" />
                  </div>
                  <div>
                    <Label htmlFor="depositMethod">Payment Method</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="depositPurpose">Purpose</Label>
                    <Textarea id="depositPurpose" placeholder="Purpose of deposit..." />
                  </div>
                  <Button className="w-full">
                    <IndianRupee className="h-4 w-4 mr-2" />
                    Collect Deposit
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Deposits</CardTitle>
                <CardDescription>Latest deposit transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: "DEP001", patient: "Rajesh Kumar", amount: 5000, method: "Cash", date: "2024-01-15" },
                    { id: "DEP002", patient: "Priya Sharma", amount: 8500, method: "Card", date: "2024-01-14" },
                    { id: "DEP003", patient: "Amit Singh", amount: 10000, method: "UPI", date: "2024-01-13" },
                  ].map((deposit) => (
                    <div key={deposit.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{deposit.patient}</p>
                        <p className="text-sm text-gray-600">
                          {deposit.id} • {deposit.method} • {deposit.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">₹{deposit.amount.toLocaleString()}</p>
                        <Button size="sm" variant="outline">
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </PrivateRoute>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Plus,
  TestTube,
  Zap,
  Package,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Printer,
  Eye,
  Download,
  Heart,
  Brain,
  Bone,
} from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"

const mockLabTests = [
  { id: "LAB001", name: "Complete Blood Count (CBC)", price: 300, category: "Hematology", duration: "2 hours" },
  { id: "LAB002", name: "Lipid Profile", price: 450, category: "Biochemistry", duration: "4 hours" },
  { id: "LAB003", name: "Thyroid Function Test", price: 600, category: "Endocrinology", duration: "6 hours" },
  { id: "LAB004", name: "Liver Function Test", price: 500, category: "Biochemistry", duration: "4 hours" },
  { id: "LAB005", name: "Kidney Function Test", price: 400, category: "Biochemistry", duration: "4 hours" },
  { id: "LAB006", name: "HbA1c", price: 350, category: "Diabetes", duration: "3 hours" },
]

const mockRadiologyTests = [
  { id: "RAD001", name: "Chest X-Ray", price: 400, category: "X-Ray", duration: "30 minutes" },
  { id: "RAD002", name: "CT Scan - Head", price: 3500, category: "CT Scan", duration: "45 minutes" },
  { id: "RAD003", name: "MRI - Spine", price: 8000, category: "MRI", duration: "60 minutes" },
  { id: "RAD004", name: "Ultrasound - Abdomen", price: 800, category: "Ultrasound", duration: "30 minutes" },
  { id: "RAD005", name: "ECG", price: 200, category: "Cardiology", duration: "15 minutes" },
  { id: "RAD006", name: "Echo Cardiogram", price: 1200, category: "Cardiology", duration: "45 minutes" },
]

const mockHealthPackages = [
  {
    id: "PKG001",
    name: "Basic Health Checkup",
    price: 2500,
    discountedPrice: 2000,
    discount: 20,
    tests: ["CBC", "Lipid Profile", "Blood Sugar", "Chest X-Ray"],
    category: "Preventive",
  },
  {
    id: "PKG002",
    name: "Executive Health Package",
    price: 8500,
    discountedPrice: 7000,
    discount: 18,
    tests: ["CBC", "Lipid Profile", "Thyroid", "CT Scan", "ECG", "Echo"],
    category: "Comprehensive",
  },
  {
    id: "PKG003",
    name: "Cardiac Screening",
    price: 4500,
    discountedPrice: 3800,
    discount: 15,
    tests: ["ECG", "Echo", "Lipid Profile", "Chest X-Ray"],
    category: "Specialized",
  },
]

const mockOrders = [
  {
    id: "ORD001",
    patientName: "Rajesh Kumar",
    patientId: "P001234",
    tests: ["CBC", "Lipid Profile"],
    type: "Lab",
    status: "scheduled",
    scheduledTime: "2024-01-15 10:00",
    amount: 750,
  },
  {
    id: "ORD002",
    patientName: "Priya Sharma",
    patientId: "P001235",
    tests: ["Chest X-Ray", "ECG"],
    type: "Radiology",
    status: "in_progress",
    scheduledTime: "2024-01-15 11:30",
    amount: 600,
  },
]

export default function FrontOfficeInvestigations() {
  const [activeTab, setActiveTab] = useState("lab")
  const [selectedTests, setSelectedTests] = useState([])
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [patientSearch, setPatientSearch] = useState("")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [urgency, setUrgency] = useState("routine")
  const [instructions, setInstructions] = useState("")

  const addTest = (test) => {
    const existingTest = selectedTests.find((t) => t.id === test.id)
    if (!existingTest) {
      setSelectedTests([...selectedTests, { ...test, quantity: 1 }])
    }
  }

  const removeTest = (testId) => {
    setSelectedTests(selectedTests.filter((t) => t.id !== testId))
  }

  const calculateTotal = () => {
    if (selectedPackage) {
      return selectedPackage.discountedPrice
    }
    return selectedTests.reduce((total, test) => total + test.price * test.quantity, 0)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "scheduled":
        return <Calendar className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <TestTube className="h-4 w-4" />
    }
  }

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "cardiology":
        return <Heart className="h-4 w-4" />
      case "ct scan":
      case "mri":
        return <Brain className="h-4 w-4" />
      case "x-ray":
        return <Bone className="h-4 w-4" />
      default:
        return <TestTube className="h-4 w-4" />
    }
  }

  const handlePatientSearch = () => {
    // Simulate patient search
    if (patientSearch.toLowerCase().includes("rajesh") || patientSearch.includes("P001234")) {
      setSelectedPatient({
        id: "P001234",
        name: "Rajesh Kumar",
        phone: "+91-9876543210",
        age: 45,
        gender: "Male",
      })
    }
  }

  const handleOrderSubmission = () => {
    const orderData = {
      patient: selectedPatient,
      tests: selectedPackage ? selectedPackage.tests : selectedTests.map((t) => t.name),
      package: selectedPackage,
      scheduledDate,
      scheduledTime,
      urgency,
      instructions,
      total: calculateTotal(),
    }

    console.log("Submitting order:", orderData)
    alert("Investigation order submitted successfully!")

    // Reset form
    setSelectedTests([])
    setSelectedPackage(null)
    setScheduledDate("")
    setScheduledTime("")
    setUrgency("routine")
    setInstructions("")
  }

  const filteredLabTests = mockLabTests.filter((test) => test.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const filteredRadiologyTests = mockRadiologyTests.filter((test) =>
    test.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredPackages = mockHealthPackages.filter((pkg) => pkg.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <PrivateRoute modulePath="admin/front-office/investigations" action="view">
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Investigations</h1>
          <p className="text-gray-600">Lab tests, radiology, and health packages</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Orders
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Investigation Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>Search and select patient for investigations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, ID, or phone..."
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handlePatientSearch}>Search</Button>
              </div>

              {selectedPatient && (
                <div className="p-4 border rounded-lg bg-green-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{selectedPatient.name}</h3>
                      <p className="text-sm text-gray-600">
                        ID: {selectedPatient.id} • Phone: {selectedPatient.phone}
                      </p>
                      <p className="text-sm text-gray-600">
                        Age: {selectedPatient.age} • Gender: {selectedPatient.gender}
                      </p>
                    </div>
                    <Badge className="bg-green-600">Selected</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Investigation Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Investigations</CardTitle>
              <CardDescription>Choose lab tests, radiology, or health packages</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="lab" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="lab">
                    <TestTube className="h-4 w-4 mr-2" />
                    Lab Tests
                  </TabsTrigger>
                  <TabsTrigger value="radiology">
                    <Zap className="h-4 w-4 mr-2" />
                    Radiology
                  </TabsTrigger>
                  <TabsTrigger value="packages">
                    <Package className="h-4 w-4 mr-2" />
                    Health Packages
                  </TabsTrigger>
                </TabsList>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search investigations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <TabsContent value="lab" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                    {filteredLabTests.map((test) => (
                      <Card
                        key={test.id}
                        className={`cursor-pointer transition-all ${
                          selectedTests.find((t) => t.id === test.id) ? "ring-2 ring-blue-500" : "hover:bg-gray-50"
                        }`}
                        onClick={() => addTest(test)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getCategoryIcon(test.category)}
                                <h4 className="font-medium">{test.name}</h4>
                              </div>
                              <p className="text-sm text-gray-600">{test.category}</p>
                              <p className="text-xs text-gray-500">Duration: {test.duration}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">₹{test.price}</p>
                              <Button size="sm" className="mt-1">
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="radiology" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                    {filteredRadiologyTests.map((test) => (
                      <Card
                        key={test.id}
                        className={`cursor-pointer transition-all ${
                          selectedTests.find((t) => t.id === test.id) ? "ring-2 ring-blue-500" : "hover:bg-gray-50"
                        }`}
                        onClick={() => addTest(test)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getCategoryIcon(test.category)}
                                <h4 className="font-medium">{test.name}</h4>
                              </div>
                              <p className="text-sm text-gray-600">{test.category}</p>
                              <p className="text-xs text-gray-500">Duration: {test.duration}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">₹{test.price}</p>
                              <Button size="sm" className="mt-1">
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="packages" className="space-y-4">
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {filteredPackages.map((pkg) => (
                      <Card
                        key={pkg.id}
                        className={`cursor-pointer transition-all ${
                          selectedPackage?.id === pkg.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          setSelectedPackage(selectedPackage?.id === pkg.id ? null : pkg)
                          setSelectedTests([]) // Clear individual tests when package is selected
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Package className="h-4 w-4" />
                                <h4 className="font-medium">{pkg.name}</h4>
                                <Badge variant="secondary">{pkg.discount}% OFF</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{pkg.category}</p>
                              <div className="text-xs text-gray-500">
                                <p>Includes: {pkg.tests.join(", ")}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500 line-through">₹{pkg.price}</p>
                              <p className="font-semibold text-green-600">₹{pkg.discountedPrice}</p>
                              <p className="text-xs text-green-600">Save ₹{pkg.price - pkg.discountedPrice}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Scheduling */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Selected investigations and total cost</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedPackage ? (
                  <div className="p-3 border rounded-lg bg-blue-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{selectedPackage.name}</h4>
                        <p className="text-sm text-gray-600">{selectedPackage.tests.length} tests included</p>
                        <Badge variant="secondary" className="mt-1">
                          {selectedPackage.discount}% OFF
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 line-through">₹{selectedPackage.price}</p>
                        <p className="font-bold text-green-600">₹{selectedPackage.discountedPrice}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 bg-transparent"
                      onClick={() => setSelectedPackage(null)}
                    >
                      Remove Package
                    </Button>
                  </div>
                ) : selectedTests.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No investigations selected</p>
                ) : (
                  <>
                    {selectedTests.map((test) => (
                      <div key={test.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{test.name}</p>
                          <p className="text-xs text-gray-600">{test.category}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">₹{test.price}</span>
                          <Button size="sm" variant="destructive" onClick={() => removeTest(test.id)}>
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {(selectedTests.length > 0 || selectedPackage) && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-green-600">₹{calculateTotal().toLocaleString()}</span>
                    </div>
                    {selectedPackage && (
                      <p className="text-sm text-green-600">
                        You save ₹{(selectedPackage.price - selectedPackage.discountedPrice).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Scheduling */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule Investigation</CardTitle>
              <CardDescription>Set date, time, and priority</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="urgency">Priority</Label>
                  <Select value={urgency} onValueChange={setUrgency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="stat">STAT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="instructions">Special Instructions</Label>
                  <Input
                    id="instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Any special instructions..."
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleOrderSubmission}
                  disabled={
                    !selectedPatient ||
                    (selectedTests.length === 0 && !selectedPackage) ||
                    !scheduledDate ||
                    !scheduledTime
                  }
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Investigation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest investigation orders and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="font-bold text-lg">{order.id}</div>
                    <div className="text-sm text-gray-600">{order.scheduledTime.split(" ")[0]}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{order.patientName}</span>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status.replace("_", " ")}</span>
                      </Badge>
                      <Badge variant="outline">{order.type}</Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Patient ID: {order.patientId}</p>
                      <p>Tests: {order.tests.join(", ")}</p>
                      <p>Scheduled: {order.scheduledTime}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">₹{order.amount.toLocaleString()}</div>
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
                  {order.status === "scheduled" && (
                    <Button size="sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Start
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </PrivateRoute>
  )
}

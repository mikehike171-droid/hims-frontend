"use client"

import { useState } from "react"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TestTube,
  Search,
  Filter,
  Download,
  Share,
  Eye,
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  ImageIcon,
} from "lucide-react"

export default function PatientLabReports() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const labReports = [
    {
      id: "lab001",
      orderDate: "2024-01-20",
      collectionDate: "2024-01-21",
      reportDate: "2024-01-22",
      testName: "Complete Blood Count (CBC)",
      category: "Hematology",
      doctor: "Dr. Sarah Wilson",
      department: "Cardiology",
      status: "completed",
      critical: false,
      results: [
        { parameter: "Hemoglobin", value: "14.2", unit: "g/dL", range: "12.0-15.5", status: "normal" },
        { parameter: "WBC Count", value: "8500", unit: "/μL", range: "4000-11000", status: "normal" },
        { parameter: "Platelet Count", value: "180000", unit: "/μL", range: "150000-450000", status: "normal" },
        { parameter: "RBC Count", value: "4.8", unit: "million/μL", range: "4.2-5.4", status: "normal" },
      ],
      prepInstructions: ["Fasting not required", "Normal water intake allowed"],
      reportUrl: "/reports/lab001.pdf",
    },
    {
      id: "lab002",
      orderDate: "2024-01-18",
      collectionDate: "2024-01-19",
      reportDate: "2024-01-20",
      testName: "Lipid Profile",
      category: "Biochemistry",
      doctor: "Dr. Sarah Wilson",
      department: "Cardiology",
      status: "completed",
      critical: true,
      results: [
        { parameter: "Total Cholesterol", value: "245", unit: "mg/dL", range: "<200", status: "high" },
        { parameter: "HDL Cholesterol", value: "38", unit: "mg/dL", range: ">40", status: "low" },
        { parameter: "LDL Cholesterol", value: "165", unit: "mg/dL", range: "<100", status: "high" },
        { parameter: "Triglycerides", value: "210", unit: "mg/dL", range: "<150", status: "high" },
      ],
      prepInstructions: ["12-hour fasting required", "Only water allowed", "Take medications as usual"],
      reportUrl: "/reports/lab002.pdf",
    },
    {
      id: "lab003",
      orderDate: "2024-01-15",
      collectionDate: "2024-01-16",
      reportDate: "2024-01-17",
      testName: "Thyroid Function Test",
      category: "Endocrinology",
      doctor: "Dr. Michael Chen",
      department: "Internal Medicine",
      status: "completed",
      critical: false,
      results: [
        { parameter: "TSH", value: "2.8", unit: "mIU/L", range: "0.4-4.0", status: "normal" },
        { parameter: "T3", value: "1.2", unit: "ng/mL", range: "0.8-2.0", status: "normal" },
        { parameter: "T4", value: "8.5", unit: "μg/dL", range: "5.0-12.0", status: "normal" },
      ],
      prepInstructions: ["No special preparation required", "Take medications as usual"],
      reportUrl: "/reports/lab003.pdf",
    },
  ]

  const radiologyReports = [
    {
      id: "rad001",
      orderDate: "2024-01-19",
      studyDate: "2024-01-20",
      reportDate: "2024-01-21",
      studyName: "Chest X-Ray",
      category: "Radiology",
      doctor: "Dr. Sarah Wilson",
      department: "Cardiology",
      status: "completed",
      critical: false,
      findings: "Normal heart size and lung fields. No acute cardiopulmonary abnormalities.",
      impression: "Normal chest radiograph.",
      prepInstructions: ["Remove all jewelry and metal objects", "Wear hospital gown"],
      reportUrl: "/reports/rad001.pdf",
      imageUrl: "/images/rad001.jpg",
    },
    {
      id: "rad002",
      orderDate: "2024-01-16",
      studyDate: "2024-01-17",
      reportDate: "2024-01-18",
      studyName: "Echocardiogram",
      category: "Cardiology",
      doctor: "Dr. Sarah Wilson",
      department: "Cardiology",
      status: "completed",
      critical: true,
      findings: "Left ventricular ejection fraction 45%. Mild mitral regurgitation noted.",
      impression: "Mild left ventricular dysfunction with mild mitral regurgitation.",
      prepInstructions: ["No special preparation required", "Wear comfortable clothing"],
      reportUrl: "/reports/rad002.pdf",
      imageUrl: "/images/rad002.jpg",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "collected":
        return "bg-blue-100 text-blue-800"
      case "ordered":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getResultStatus = (status: string) => {
    switch (status) {
      case "normal":
        return { icon: CheckCircle, color: "text-green-600" }
      case "high":
        return { icon: TrendingUp, color: "text-red-600" }
      case "low":
        return { icon: TrendingDown, color: "text-red-600" }
      default:
        return { icon: Minus, color: "text-gray-600" }
    }
  }

  const filteredLabReports = labReports.filter((report) => {
    const matchesSearch =
      report.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    const matchesType = typeFilter === "all" || typeFilter === "lab"
    return matchesSearch && matchesStatus && matchesType
  })

  const filteredRadiologyReports = radiologyReports.filter((report) => {
    const matchesSearch =
      report.studyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || report.status === statusFilter
    const matchesType = typeFilter === "all" || typeFilter === "radiology"
    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <PrivateRoute modulePath="admin/patient-portal/lab-reports" action="view">
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lab Reports & Results</h1>
            <p className="text-gray-600">View and download your test results and reports</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
            <Button variant="outline">
              <Share className="h-4 w-4 mr-2" />
              Share Reports
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by test name, doctor, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="lab">Lab Tests</SelectItem>
                  <SelectItem value="radiology">Radiology</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="collected">Collected</SelectItem>
                  <SelectItem value="ordered">Ordered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="lab" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lab">Lab Tests</TabsTrigger>
            <TabsTrigger value="radiology">Radiology & Imaging</TabsTrigger>
          </TabsList>

          <TabsContent value="lab" className="space-y-4">
            {filteredLabReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <TestTube className="h-5 w-5 text-purple-600" />
                        <span className="font-semibold text-lg">{report.testName}</span>
                        <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                        {report.critical && (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Critical Values
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Report: {report.reportDate}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {report.doctor}
                        </div>
                        <span>{report.category}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
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

                  {/* Test Results */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Test Results:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {report.results.map((result, index) => {
                        const StatusIcon = getResultStatus(result.status).icon
                        const statusColor = getResultStatus(result.status).color
                        return (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{result.parameter}</span>
                                <StatusIcon className={`h-4 w-4 ${statusColor}`} />
                              </div>
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">
                                  {result.value} {result.unit}
                                </span>
                                <span className="ml-2">Range: {result.range}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Timeline:</h4>
                    <div className="flex items-center justify-between text-sm text-blue-800">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Ordered: {report.orderDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TestTube className="h-4 w-4" />
                        <span>Collected: {report.collectionDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>Reported: {report.reportDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Preparation Instructions */}
                  {report.prepInstructions.length > 0 && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Preparation Instructions:</h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        {report.prepInstructions.map((instruction, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                            {instruction}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="radiology" className="space-y-4">
            {filteredRadiologyReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <ImageIcon className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-lg">{report.studyName}</span>
                        <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                        {report.critical && (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Abnormal Findings
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Study: {report.studyDate}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {report.doctor}
                        </div>
                        <span>{report.category}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <ImageIcon className="h-4 w-4 mr-1" />
                        View Images
                      </Button>
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

                  {/* Findings and Impression */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Findings:</h4>
                      <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">{report.findings}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Impression:</h4>
                      <p className="text-sm text-gray-700 p-3 bg-blue-50 rounded-lg">{report.impression}</p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Timeline:</h4>
                    <div className="flex items-center justify-between text-sm text-blue-800">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Ordered: {report.orderDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ImageIcon className="h-4 w-4" />
                        <span>Study: {report.studyDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>Reported: {report.reportDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Preparation Instructions */}
                  {report.prepInstructions.length > 0 && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Preparation Instructions:</h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        {report.prepInstructions.map((instruction, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                            {instruction}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </PrivateRoute>
  )
}

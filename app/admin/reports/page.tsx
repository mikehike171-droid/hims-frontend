"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Download,
  Search,
  Filter,
  BarChart3,
  Users,
  Bed,
  Activity,
  TestTube,
  Pill,
  CreditCard,
  Shield,
  Stethoscope,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import PrivateRoute from "@/components/auth/PrivateRoute"

// Report categories with their respective reports
const reportCategories = [
  {
    id: "front-office",
    name: "Front Office & Registration",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    reports: [
      {
        id: "daily-opd-footfall",
        name: "Daily OPD Footfall",
        description: "Doctor-wise, department-wise, branch-wise patient footfall",
        frequency: ["Daily", "Weekly", "Monthly"],
        parameters: ["Doctor", "Department", "Branch", "Date Range"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
      {
        id: "appointment-reports",
        name: "Appointment Reports",
        description: "Booked, rescheduled, cancelled, no-shows analysis",
        frequency: ["Daily", "Weekly", "Monthly"],
        parameters: ["Status", "Doctor", "Department", "Date Range"],
        formats: ["PDF", "Excel", "CSV"],
      },
      {
        id: "patient-registration",
        name: "Patient Registration",
        description: "New vs repeat, demographics, age/gender distribution",
        frequency: ["Daily", "Weekly", "Monthly"],
        parameters: ["Registration Type", "Demographics", "Date Range"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
      {
        id: "token-queue-status",
        name: "Token/Queue Status",
        description: "Queue status and waiting times analysis",
        frequency: ["Real-time", "Daily", "Weekly"],
        parameters: ["Department", "Doctor", "Time Slots"],
        formats: ["Dashboard", "PDF", "Excel"],
      },
      {
        id: "referrals-report",
        name: "Referrals Report",
        description: "Self, corporate, doctor, telecaller referrals",
        frequency: ["Daily", "Weekly", "Monthly"],
        parameters: ["Referral Source", "Department", "Date Range"],
        formats: ["PDF", "Excel", "CSV"],
      },
      {
        id: "package-registrations",
        name: "Package Registrations",
        description: "Health checkups, preventive packages",
        frequency: ["Daily", "Weekly", "Monthly"],
        parameters: ["Package Type", "Department", "Date Range"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
      {
        id: "bill-cancellations",
        name: "Bill Cancellations/Refunds",
        description: "Cancellations, credit notes, refunds with reasons",
        frequency: ["Daily", "Weekly", "Monthly"],
        parameters: ["Reason", "Amount Range", "Approver", "Date Range"],
        formats: ["PDF", "Excel", "CSV"],
      },
    ],
  },
  {
    id: "outpatient",
    name: "Outpatient (OPD)",
    icon: Stethoscope,
    color: "text-green-600",
    bgColor: "bg-green-50",
    reports: [
      {
        id: "doctor-consultations",
        name: "Doctor-wise Consultations",
        description: "Consultation count and revenue by doctor",
        frequency: ["Daily", "Weekly", "Monthly"],
        parameters: ["Doctor", "Department", "Revenue Range"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
      {
        id: "department-revenue",
        name: "Department-wise OP Revenue",
        description: "Outpatient revenue analysis by department",
        frequency: ["Daily", "Weekly", "Monthly"],
        parameters: ["Department", "Revenue Range", "Date Range"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
      {
        id: "op-procedures",
        name: "OP Procedure Reports",
        description: "Minor procedures, dressings, injections",
        frequency: ["Daily", "Weekly", "Monthly"],
        parameters: ["Procedure Type", "Doctor", "Department"],
        formats: ["PDF", "Excel", "CSV"],
      },
      {
        id: "consultation-investigation",
        name: "Consultation to Investigation Ratio",
        description: "Conversion ratio from consultation to investigations",
        frequency: ["Weekly", "Monthly", "Quarterly"],
        parameters: ["Doctor", "Department", "Investigation Type"],
        formats: ["Dashboard", "PDF", "Excel"],
      },
      {
        id: "prescriptions-generated",
        name: "Prescriptions Generated",
        description: "Count and pharmacy conversion percentage",
        frequency: ["Daily", "Weekly", "Monthly"],
        parameters: ["Doctor", "Pharmacy Conversion", "Date Range"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
      {
        id: "followup-adherence",
        name: "Follow-up Adherence",
        description: "Patient follow-up compliance reports",
        frequency: ["Weekly", "Monthly", "Quarterly"],
        parameters: ["Doctor", "Department", "Follow-up Type"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
    ],
  },
  {
    id: "inpatient",
    name: "Inpatient & Bed Management",
    icon: Bed,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    reports: [
      {
        id: "admission-discharge-census",
        name: "Admission & Discharge Census",
        description: "Daily, weekly, monthly admission/discharge statistics",
        frequency: ["Daily", "Weekly", "Monthly"],
        parameters: ["Ward", "Department", "Doctor", "Date Range"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
      {
        id: "bed-occupancy",
        name: "Bed Occupancy",
        description: "Occupancy by ward, room, ICU",
        frequency: ["Real-time", "Daily", "Weekly"],
        parameters: ["Ward", "Room Type", "Bed Category"],
        formats: ["Dashboard", "PDF", "Excel"],
      },
      {
        id: "average-length-stay",
        name: "Average Length of Stay (ALOS)",
        description: "Patient stay duration analysis",
        frequency: ["Weekly", "Monthly", "Quarterly"],
        parameters: ["Department", "Doctor", "Diagnosis"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
      {
        id: "bed-turnover-rate",
        name: "Bed Turnover Rate",
        description: "Bed utilization efficiency metrics",
        frequency: ["Weekly", "Monthly", "Quarterly"],
        parameters: ["Ward", "Bed Type", "Time Period"],
        formats: ["Dashboard", "PDF", "Excel"],
      },
      {
        id: "admission-source",
        name: "Admission Source Analysis",
        description: "ER, OPD, direct admission analysis",
        frequency: ["Daily", "Weekly", "Monthly"],
        parameters: ["Source", "Department", "Date Range"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
      {
        id: "advance-collection",
        name: "Advance Collection vs Utilization",
        description: "Advance payment collection and usage",
        frequency: ["Daily", "Weekly", "Monthly"],
        parameters: ["Amount Range", "Payment Method", "Date Range"],
        formats: ["PDF", "Excel", "CSV"],
      },
      {
        id: "package-utilization",
        name: "Package Utilization",
        description: "Normal delivery, C-section, surgeries packages",
        frequency: ["Weekly", "Monthly", "Quarterly"],
        parameters: ["Package Type", "Department", "Doctor"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
    ],
  },
  {
    id: "emergency",
    name: "Emergency/Casualty",
    icon: Activity,
    color: "text-red-600",
    bgColor: "bg-red-50",
    reports: [
      {
        id: "er-footfall",
        name: "ER Footfall",
        description: "Per day, time slots, doctor shifts",
        frequency: ["Daily", "Weekly", "Monthly"],
        parameters: ["Time Slot", "Doctor", "Shift", "Date Range"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
      {
        id: "triage-report",
        name: "Triage Report",
        description: "Critical, semi-critical, non-critical cases",
        frequency: ["Daily", "Weekly", "Monthly"],
        parameters: ["Triage Level", "Doctor", "Date Range"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
      {
        id: "admission-conversion",
        name: "Admission Conversion (ER → IP)",
        description: "Emergency to inpatient conversion rates",
        frequency: ["Daily", "Weekly", "Monthly"],
        parameters: ["Doctor", "Diagnosis", "Date Range"],
        formats: ["Dashboard", "PDF", "Excel"],
      },
      {
        id: "er-discharge",
        name: "ER Discharge Report",
        description: "Treated and sent home cases",
        frequency: ["Daily", "Weekly", "Monthly"],
        parameters: ["Doctor", "Diagnosis", "Date Range"],
        formats: ["PDF", "Excel", "CSV"],
      },
      {
        id: "mortality-report",
        name: "Mortality Report",
        description: "ER deaths with cause analysis",
        frequency: ["Weekly", "Monthly", "Quarterly"],
        parameters: ["Cause", "Doctor", "Age Group"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
    ],
  },
  {
    id: "laboratory",
    name: "Laboratory",
    icon: TestTube,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    reports: [
      {
        id: "daily-test-volume",
        name: "Daily Test Volume",
        description: "By department (Biochemistry, Hematology, Microbiology)",
        frequency: ["Daily", "Weekly", "Monthly"],
        parameters: ["Department", "Test Type", "Date Range"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
      {
        id: "test-tat-compliance",
        name: "Test TAT Compliance",
        description: "Turnaround time compliance analysis",
        frequency: ["Daily", "Weekly", "Monthly"],
        parameters: ["Test Type", "Department", "TAT Range"],
        formats: ["Dashboard", "PDF", "Excel"],
      },
      {
        id: "pending-completed-samples",
        name: "Pending vs Completed Samples",
        description: "Sample processing status",
        frequency: ["Real-time", "Daily", "Weekly"],
        parameters: ["Status", "Department", "Priority"],
        formats: ["Dashboard", "PDF", "Excel"],
      },
      {
        id: "abnormal-critical-results",
        name: "Abnormal/Critical Results",
        description: "Flagged abnormal and critical test results",
        frequency: ["Daily", "Weekly", "Monthly"],
        parameters: ["Result Type", "Test", "Doctor"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
      {
        id: "doctor-lab-referrals",
        name: "Doctor-wise Lab Referrals",
        description: "Lab test referrals by doctor",
        frequency: ["Weekly", "Monthly", "Quarterly"],
        parameters: ["Doctor", "Test Type", "Department"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
      {
        id: "lab-revenue-reports",
        name: "Lab Revenue Reports",
        description: "Test-wise, package-wise, doctor-wise revenue",
        frequency: ["Daily", "Weekly", "Monthly"],
        parameters: ["Revenue Type", "Doctor", "Test Package"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
    ],
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    icon: Pill,
    color: "text-green-600",
    bgColor: "bg-green-50",
    reports: [
      {
        id: "sales-report",
        name: "Sales Report",
        description: "OP pharmacy vs IP issues",
        frequency: ["Daily", "Weekly", "Monthly"],
        parameters: ["Sale Type", "Department", "Amount Range"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
      {
        id: "item-wise-sales",
        name: "Item-wise Sales",
        description: "Top 50 drugs, slow movers",
        frequency: ["Weekly", "Monthly", "Quarterly"],
        parameters: ["Item Category", "Sales Volume", "Date Range"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
      {
        id: "batch-expiry-report",
        name: "Batch/Expiry Report",
        description: "Near-expiry, expired stock",
        frequency: ["Weekly", "Monthly"],
        parameters: ["Expiry Range", "Batch", "Item Category"],
        formats: ["PDF", "Excel", "CSV"],
      },
      {
        id: "stock-ledger",
        name: "Stock Ledger",
        description: "Current, in-transit, dead stock",
        frequency: ["Real-time", "Daily", "Weekly"],
        parameters: ["Stock Status", "Item Category", "Location"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
      {
        id: "gross-margin-analysis",
        name: "Gross Margin Analysis",
        description: "Drug-wise, vendor-wise margin analysis",
        frequency: ["Monthly", "Quarterly"],
        parameters: ["Margin Range", "Vendor", "Drug Category"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
    ],
  },
  {
    id: "billing",
    name: "Billing & Accounts",
    icon: CreditCard,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    reports: [
      {
        id: "daily-collection-summary",
        name: "Daily Collection Summary",
        description: "Cashier-wise, mode-wise collections",
        frequency: ["Daily", "Weekly", "Monthly"],
        parameters: ["Cashier", "Payment Mode", "Amount Range"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
      {
        id: "revenue-reports",
        name: "Revenue Reports",
        description: "Department-wise, doctor-wise, branch-wise revenue",
        frequency: ["Daily", "Weekly", "Monthly"],
        parameters: ["Revenue Type", "Department", "Doctor"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
      {
        id: "discounts-cancellations",
        name: "Discounts & Cancellations",
        description: "Discounts, cancellations, refunds, credit notes",
        frequency: ["Daily", "Weekly", "Monthly"],
        parameters: ["Type", "Amount Range", "Reason"],
        formats: ["PDF", "Excel", "CSV"],
      },
      {
        id: "insurance-claims-status",
        name: "Insurance Claims Status",
        description: "Submitted, query, approved, paid, rejected",
        frequency: ["Weekly", "Monthly"],
        parameters: ["Status", "TPA", "Amount Range"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
      {
        id: "ar-aging",
        name: "AR Aging",
        description: "Patients, corporates, insurance aging",
        frequency: ["Weekly", "Monthly"],
        parameters: ["Customer Type", "Age Range", "Amount Range"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
    ],
  },
  {
    id: "insurance",
    name: "Insurance & TPA",
    icon: Shield,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    reports: [
      {
        id: "preauth-status",
        name: "Pre-authorization Status",
        description: "Pending, approved, rejected pre-auths",
        frequency: ["Daily", "Weekly", "Monthly"],
        parameters: ["Status", "TPA", "Amount Range"],
        formats: ["PDF", "Excel", "Dashboard"],
      },
      {
        id: "claims-register",
        name: "Claims Register",
        description: "Submitted vs approved vs short-paid",
        frequency: ["Weekly", "Monthly"],
        parameters: ["Status", "TPA", "Amount Range"],
        formats: ["PDF", "Excel", "CSV"],
      },
      {
        id: "tpa-approval-rate",
        name: "TPA-wise Claim Approval Rate",
        description: "Approval rates by TPA",
        frequency: ["Monthly", "Quarterly"],
        parameters: ["TPA", "Approval Rate", "Time Period"],
        formats: ["Dashboard", "PDF", "Excel"],
      },
    ],
  },
]

export default function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState("front-office")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFrequency, setSelectedFrequency] = useState("all")
  const [selectedFormat, setSelectedFormat] = useState("all")
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() })

  const currentCategory = reportCategories.find((cat) => cat.id === selectedCategory)

  const filteredReports =
    currentCategory?.reports.filter((report) => {
      const matchesSearch =
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFrequency = selectedFrequency === "all" || report.frequency.includes(selectedFrequency)
      const matchesFormat = selectedFormat === "all" || report.formats.includes(selectedFormat)

      return matchesSearch && matchesFrequency && matchesFormat
    }) || []

  const totalReports = reportCategories.reduce((sum, cat) => sum + cat.reports.length, 0)

  return (
    <PrivateRoute modulePath="admin/reports" action="view">
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive hospital management reports and insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            Scheduled Reports
          </Button>
          <Button className="bg-red-600 hover:bg-red-700">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{reportCategories.length}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Generated Today</p>
                <p className="text-2xl font-bold text-gray-900">28</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Categories */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Report Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {reportCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors",
                      selectedCategory === category.id && "bg-red-50 border-r-2 border-red-600",
                    )}
                  >
                    <div className={cn("p-2 rounded-lg", category.bgColor)}>
                      <category.icon className={cn("h-4 w-4", category.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium truncate",
                          selectedCategory === category.id ? "text-red-700" : "text-gray-900",
                        )}
                      >
                        {category.name}
                      </p>
                      <p className="text-xs text-gray-500">{category.reports.length} reports</p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={selectedFrequency} onValueChange={setSelectedFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Frequencies</SelectItem>
                    <SelectItem value="Real-time">Real-time</SelectItem>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Formats</SelectItem>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="Excel">Excel</SelectItem>
                    <SelectItem value="CSV">CSV</SelectItem>
                    <SelectItem value="Dashboard">Dashboard</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="bg-transparent">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {currentCategory && (
                    <div className={cn("p-2 rounded-lg", currentCategory.bgColor)}>
                      <currentCategory.icon className={cn("h-5 w-5", currentCategory.color)} />
                    </div>
                  )}
                  <div>
                    <CardTitle>{currentCategory?.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {filteredReports.length} of {currentCategory?.reports.length} reports
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{report.name}</h3>
                          <div className="flex gap-1">
                            {report.formats.map((format) => (
                              <Badge key={format} variant="outline" className="text-xs">
                                {format}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{report.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="font-medium text-gray-700">Frequency Options:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {report.frequency.map((freq) => (
                                <Badge key={freq} variant="secondary" className="text-xs">
                                  {freq}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Parameters:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {report.parameters.slice(0, 3).map((param) => (
                                <Badge key={param} variant="outline" className="text-xs">
                                  {param}
                                </Badge>
                              ))}
                              {report.parameters.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{report.parameters.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline">
                          <BarChart3 className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          <Download className="h-4 w-4 mr-1" />
                          Generate
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredReports.length === 0 && (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">No reports found matching your criteria</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </PrivateRoute>
  )
}

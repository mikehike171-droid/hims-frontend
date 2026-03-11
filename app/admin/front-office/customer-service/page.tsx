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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Search,
  Plus,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  Eye,
  FileText,
} from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"

const mockComplaints = [
  {
    id: "COMP001",
    patientName: "Rajesh Kumar",
    patientId: "P001234",
    type: "billing",
    priority: "high",
    status: "open",
    subject: "Incorrect billing amount",
    description: "Charged for services not received",
    createdAt: "2024-01-15 10:30",
    assignedTo: "Support-001",
    lastUpdate: "2024-01-15 14:20",
  },
  {
    id: "COMP002",
    patientName: "Priya Sharma",
    patientId: "P001235",
    type: "service",
    priority: "medium",
    status: "in_progress",
    subject: "Long waiting time",
    description: "Waited 2 hours for consultation",
    createdAt: "2024-01-14 16:45",
    assignedTo: "Support-002",
    lastUpdate: "2024-01-15 09:15",
  },
  {
    id: "COMP003",
    patientName: "Amit Singh",
    patientId: "P001236",
    type: "staff",
    priority: "low",
    status: "resolved",
    subject: "Staff behavior",
    description: "Receptionist was not helpful",
    createdAt: "2024-01-13 11:20",
    assignedTo: "Support-001",
    lastUpdate: "2024-01-14 15:30",
    resolution: "Staff counseled and patient contacted",
  },
]

const mockFeedback = [
  {
    id: "FB001",
    patientName: "Sunita Devi",
    patientId: "P001237",
    rating: 5,
    category: "overall",
    feedback: "Excellent service and very professional staff",
    date: "2024-01-15",
    department: "Cardiology",
  },
  {
    id: "FB002",
    patientName: "Mohammed Ali",
    patientId: "P001238",
    rating: 3,
    category: "waiting_time",
    feedback: "Good treatment but long waiting time",
    date: "2024-01-14",
    department: "General Medicine",
  },
  {
    id: "FB003",
    patientName: "Lisa Williams",
    patientId: "P001239",
    rating: 4,
    category: "cleanliness",
    feedback: "Clean facilities and good hygiene",
    date: "2024-01-13",
    department: "Radiology",
  },
]

const complaintTypes = ["billing", "service", "staff", "facility", "appointment", "medical", "insurance", "other"]

const priorities = ["low", "medium", "high", "urgent"]

const feedbackCategories = [
  "overall",
  "staff_behavior",
  "waiting_time",
  "cleanliness",
  "facilities",
  "treatment_quality",
  "billing_process",
  "appointment_booking",
]

export default function CustomerService() {
  const [activeTab, setActiveTab] = useState("complaints")
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [newComplaint, setNewComplaint] = useState({
    patientName: "",
    patientId: "",
    type: "",
    priority: "medium",
    subject: "",
    description: "",
  })
  const [newFeedback, setNewFeedback] = useState({
    patientName: "",
    patientId: "",
    rating: 5,
    category: "",
    feedback: "",
    department: "",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500 text-white"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-white"
      case "low":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      case "closed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const handleSubmitComplaint = () => {
    const complaintData = {
      ...newComplaint,
      id: `COMP${String(mockComplaints.length + 1).padStart(3, "0")}`,
      status: "open",
      createdAt: new Date().toLocaleString(),
      assignedTo: "Support-001",
      lastUpdate: new Date().toLocaleString(),
    }

    console.log("New complaint:", complaintData)
    alert("Complaint registered successfully!")

    // Reset form
    setNewComplaint({
      patientName: "",
      patientId: "",
      type: "",
      priority: "medium",
      subject: "",
      description: "",
    })
  }

  const handleSubmitFeedback = () => {
    const feedbackData = {
      ...newFeedback,
      id: `FB${String(mockFeedback.length + 1).padStart(3, "0")}`,
      date: new Date().toISOString().split("T")[0],
    }

    console.log("New feedback:", feedbackData)
    alert("Feedback submitted successfully!")

    // Reset form
    setNewFeedback({
      patientName: "",
      patientId: "",
      rating: 5,
      category: "",
      feedback: "",
      department: "",
    })
  }

  const handleUpdateComplaintStatus = (complaintId, newStatus) => {
    console.log(`Updating complaint ${complaintId} to ${newStatus}`)
    alert(`Complaint ${complaintId} status updated to ${newStatus}`)
  }

  const filteredComplaints = mockComplaints.filter((complaint) => {
    const matchesSearch =
      complaint.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.subject.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || complaint.status === filterStatus
    const matchesPriority = filterPriority === "all" || complaint.priority === filterPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const averageRating = mockFeedback.reduce((sum, fb) => sum + fb.rating, 0) / mockFeedback.length

  return (
    <PrivateRoute modulePath="admin/front-office/customer-service" action="view">
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Service</h1>
          <p className="text-gray-600">Patient complaints, feedback, and satisfaction management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Complaint
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Complaints</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockComplaints.filter((c) => c.status === "open").length}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <div className="flex items-center">{getRatingStars(Math.round(averageRating))}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((mockComplaints.filter((c) => c.status === "resolved").length / mockComplaints.length) * 100)}
              %
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockFeedback.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="new-complaint">New Complaint</TabsTrigger>
          <TabsTrigger value="new-feedback">New Feedback</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="complaints" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Patient Complaints</CardTitle>
                  <CardDescription>Track and manage patient complaints</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search complaints..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredComplaints.map((complaint) => (
                  <div key={complaint.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="font-bold text-lg">{complaint.id}</div>
                        <div className="text-sm text-gray-600">{complaint.createdAt.split(" ")[0]}</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{complaint.patientName}</span>
                          <Badge className={getStatusColor(complaint.status)}>
                            {getStatusIcon(complaint.status)}
                            <span className="ml-1 capitalize">{complaint.status.replace("_", " ")}</span>
                          </Badge>
                          <Badge className={getPriorityColor(complaint.priority)}>
                            {complaint.priority.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {complaint.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p className="font-medium">{complaint.subject}</p>
                          <p>{complaint.description}</p>
                          <p>
                            Assigned to: {complaint.assignedTo} • Last update: {complaint.lastUpdate}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedComplaint(complaint)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Complaint Details - {complaint.id}</DialogTitle>
                            <DialogDescription>Complete information about the complaint</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Patient Name</Label>
                                <p className="font-medium">{complaint.patientName}</p>
                              </div>
                              <div>
                                <Label>Patient ID</Label>
                                <p className="font-medium">{complaint.patientId}</p>
                              </div>
                              <div>
                                <Label>Type</Label>
                                <Badge variant="outline" className="capitalize">
                                  {complaint.type}
                                </Badge>
                              </div>
                              <div>
                                <Label>Priority</Label>
                                <Badge className={getPriorityColor(complaint.priority)}>
                                  {complaint.priority.toUpperCase()}
                                </Badge>
                              </div>
                              <div>
                                <Label>Status</Label>
                                <Badge className={getStatusColor(complaint.status)}>
                                  {complaint.status.replace("_", " ")}
                                </Badge>
                              </div>
                              <div>
                                <Label>Assigned To</Label>
                                <p className="font-medium">{complaint.assignedTo}</p>
                              </div>
                            </div>
                            <div>
                              <Label>Subject</Label>
                              <p className="font-medium">{complaint.subject}</p>
                            </div>
                            <div>
                              <Label>Description</Label>
                              <p className="text-sm">{complaint.description}</p>
                            </div>
                            {complaint.resolution && (
                              <div>
                                <Label>Resolution</Label>
                                <p className="text-sm text-green-600">{complaint.resolution}</p>
                              </div>
                            )}
                            <div className="flex gap-2">
                              {complaint.status !== "resolved" && complaint.status !== "closed" && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleUpdateComplaintStatus(complaint.id, "in_progress")}
                                  >
                                    Mark In Progress
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleUpdateComplaintStatus(complaint.id, "resolved")}
                                  >
                                    Mark Resolved
                                  </Button>
                                </>
                              )}
                              {complaint.status === "resolved" && (
                                <Button size="sm" onClick={() => handleUpdateComplaintStatus(complaint.id, "closed")}>
                                  Close Complaint
                                </Button>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {complaint.status === "open" && (
                        <Button size="sm" onClick={() => handleUpdateComplaintStatus(complaint.id, "in_progress")}>
                          Assign
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Feedback</CardTitle>
              <CardDescription>Patient satisfaction and feedback reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockFeedback.map((feedback) => (
                  <div key={feedback.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="text-center">
                        <div className="font-bold text-lg">{feedback.id}</div>
                        <div className="text-sm text-gray-600">{feedback.date}</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{feedback.patientName}</span>
                          <div className="flex items-center">
                            {getRatingStars(feedback.rating)}
                            <span className="ml-2 font-medium">{feedback.rating}/5</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p className="mb-1">
                            <span className="font-medium">Category:</span> {feedback.category.replace("_", " ")}
                          </p>
                          <p className="mb-1">
                            <span className="font-medium">Department:</span> {feedback.department}
                          </p>
                          <p className="italic">"{feedback.feedback}"</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {feedback.rating >= 4 ? (
                        <ThumbsUp className="h-5 w-5 text-green-500" />
                      ) : (
                        <ThumbsDown className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new-complaint" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Register New Complaint</CardTitle>
              <CardDescription>Record a new patient complaint</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="patientName">Patient Name</Label>
                    <Input
                      id="patientName"
                      value={newComplaint.patientName}
                      onChange={(e) => setNewComplaint({ ...newComplaint, patientName: e.target.value })}
                      placeholder="Enter patient name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="patientId">Patient ID</Label>
                    <Input
                      id="patientId"
                      value={newComplaint.patientId}
                      onChange={(e) => setNewComplaint({ ...newComplaint, patientId: e.target.value })}
                      placeholder="Enter patient ID"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Complaint Type</Label>
                    <Select
                      value={newComplaint.type}
                      onValueChange={(value) => setNewComplaint({ ...newComplaint, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {complaintTypes.map((type) => (
                          <SelectItem key={type} value={type} className="capitalize">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newComplaint.priority}
                      onValueChange={(value) => setNewComplaint({ ...newComplaint, priority: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorities.map((priority) => (
                          <SelectItem key={priority} value={priority} className="capitalize">
                            {priority}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={newComplaint.subject}
                    onChange={(e) => setNewComplaint({ ...newComplaint, subject: e.target.value })}
                    placeholder="Brief description of the complaint"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea
                    id="description"
                    value={newComplaint.description}
                    onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                    placeholder="Provide detailed information about the complaint"
                    rows={4}
                  />
                </div>
                <Button
                  onClick={handleSubmitComplaint}
                  disabled={
                    !newComplaint.patientName ||
                    !newComplaint.patientId ||
                    !newComplaint.type ||
                    !newComplaint.subject ||
                    !newComplaint.description
                  }
                  className="w-full"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Register Complaint
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new-feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Collect Patient Feedback</CardTitle>
              <CardDescription>Record patient satisfaction and feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fbPatientName">Patient Name</Label>
                    <Input
                      id="fbPatientName"
                      value={newFeedback.patientName}
                      onChange={(e) => setNewFeedback({ ...newFeedback, patientName: e.target.value })}
                      placeholder="Enter patient name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fbPatientId">Patient ID</Label>
                    <Input
                      id="fbPatientId"
                      value={newFeedback.patientId}
                      onChange={(e) => setNewFeedback({ ...newFeedback, patientId: e.target.value })}
                      placeholder="Enter patient ID"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Feedback Category</Label>
                    <Select
                      value={newFeedback.category}
                      onValueChange={(value) => setNewFeedback({ ...newFeedback, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {feedbackCategories.map((category) => (
                          <SelectItem key={category} value={category} className="capitalize">
                            {category.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={newFeedback.department}
                      onChange={(e) => setNewFeedback({ ...newFeedback, department: e.target.value })}
                      placeholder="Enter department"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-6 w-6 cursor-pointer ${
                          star <= newFeedback.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                        onClick={() => setNewFeedback({ ...newFeedback, rating: star })}
                      />
                    ))}
                    <span className="ml-2 font-medium">{newFeedback.rating}/5</span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="fbDescription">Feedback</Label>
                  <Textarea
                    id="fbDescription"
                    value={newFeedback.feedback}
                    onChange={(e) => setNewFeedback({ ...newFeedback, feedback: e.target.value })}
                    placeholder="Patient's feedback and comments"
                    rows={4}
                  />
                </div>
                <Button
                  onClick={handleSubmitFeedback}
                  disabled={
                    !newFeedback.patientName ||
                    !newFeedback.patientId ||
                    !newFeedback.category ||
                    !newFeedback.department ||
                    !newFeedback.feedback
                  }
                  className="w-full"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Submit Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Complaint Analytics</CardTitle>
                <CardDescription>Breakdown by type and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Billing Issues</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-red-200 rounded-full">
                        <div className="w-8 h-2 bg-red-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">50%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Service Quality</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-yellow-200 rounded-full">
                        <div className="w-6 h-2 bg-yellow-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">33%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Staff Behavior</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-blue-200 rounded-full">
                        <div className="w-3 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">17%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Satisfaction Trends</CardTitle>
                <CardDescription>Patient satisfaction over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>5 Star Ratings</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-green-200 rounded-full">
                        <div className="w-10 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">60%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>4 Star Ratings</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-blue-200 rounded-full">
                        <div className="w-6 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">30%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>3 Star & Below</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-red-200 rounded-full">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                      <span className="text-sm">10%</span>
                    </div>
                  </div>
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

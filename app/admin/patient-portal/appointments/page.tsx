"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Search,
  Filter,
  Plus,
  Edit,
  X,
  CheckCircle,
  Download,
  Share,
} from "lucide-react"
import Link from "next/link"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function PatientAppointments() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  const appointments = [
    {
      id: "apt1",
      date: "2024-01-20",
      time: "10:30 AM",
      doctor: "Dr. Sarah Wilson",
      department: "Cardiology",
      type: "Follow-up",
      status: "confirmed",
      tokenNumber: "C-15",
      estimatedWait: "25 mins",
      location: "Block A, 2nd Floor",
      phone: "+91-9876543210",
      notes: "Bring previous ECG reports",
      canReschedule: true,
      canCancel: true,
      prepInstructions: ["Fasting for 12 hours", "Bring all previous reports", "Arrive 30 minutes early"],
    },
    {
      id: "apt2",
      date: "2024-01-22",
      time: "3:00 PM",
      doctor: "Dr. Michael Chen",
      department: "Orthopedics",
      type: "Consultation",
      status: "pending",
      tokenNumber: "O-08",
      estimatedWait: "45 mins",
      location: "Block B, 1st Floor",
      phone: "+91-9876543211",
      notes: "X-ray required",
      canReschedule: true,
      canCancel: true,
      prepInstructions: ["Bring X-ray films", "Wear comfortable clothing"],
    },
    {
      id: "apt3",
      date: "2024-01-18",
      time: "11:00 AM",
      doctor: "Dr. Priya Sharma",
      department: "Dermatology",
      type: "Routine Check-up",
      status: "completed",
      tokenNumber: "D-12",
      location: "Block C, Ground Floor",
      phone: "+91-9876543212",
      notes: "Skin biopsy results discussed",
      canReschedule: false,
      canCancel: false,
      prepInstructions: [],
    },
    {
      id: "apt4",
      date: "2024-01-16",
      time: "9:00 AM",
      doctor: "Dr. Rajesh Kumar",
      department: "General Medicine",
      type: "Consultation",
      status: "cancelled",
      tokenNumber: "G-05",
      location: "Block A, 1st Floor",
      phone: "+91-9876543213",
      notes: "Cancelled due to doctor unavailability",
      canReschedule: false,
      canCancel: false,
      prepInstructions: [],
    },
  ]

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleReschedule = (appointment: any) => {
    setSelectedAppointment(appointment)
    setShowRescheduleDialog(true)
  }

  const handleCancel = (appointmentId: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      // Handle cancellation logic
      console.log("Cancelling appointment:", appointmentId)
    }
  }

  return (
    <PrivateRoute modulePath="admin/patient-portal/appointments" action="view">
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-gray-600">Manage your appointments and bookings</p>
          </div>
          <Link href="/patient-portal/appointments/book">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Book New Appointment
            </Button>
          </Link>
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
                    placeholder="Search by doctor, department, or appointment type..."
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
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold">{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{appointment.time}</span>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                      {appointment.tokenNumber && <Badge variant="outline">Token: {appointment.tokenNumber}</Badge>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">{appointment.doctor}</h3>
                        <p className="text-gray-600">{appointment.department}</p>
                        <p className="text-sm text-gray-500">{appointment.type}</p>
                        {appointment.estimatedWait && (
                          <p className="text-sm text-orange-600 mt-1">
                            <Clock className="h-3 w-3 inline mr-1" />
                            Estimated wait: {appointment.estimatedWait}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{appointment.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{appointment.phone}</span>
                        </div>
                        {appointment.notes && (
                          <p className="text-sm text-gray-600 mt-2">
                            <strong>Notes:</strong> {appointment.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Preparation Instructions */}
                    {appointment.prepInstructions.length > 0 && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Preparation Instructions:</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          {appointment.prepInstructions.map((instruction, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 mt-0.5 text-blue-600" />
                              {instruction}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    {appointment.status === "confirmed" && (
                      <>
                        <Button size="sm" variant="outline">
                          <MapPin className="h-4 w-4 mr-1" />
                          Directions
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share className="h-4 w-4 mr-1" />
                          Share
                        </Button>
                      </>
                    )}

                    {appointment.canReschedule && (
                      <Button size="sm" variant="outline" onClick={() => handleReschedule(appointment)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Reschedule
                      </Button>
                    )}

                    {appointment.canCancel && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 bg-transparent"
                        onClick={() => handleCancel(appointment.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    )}

                    {appointment.status === "completed" && (
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Receipt
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You don't have any appointments yet"}
              </p>
              <Link href="/patient-portal/appointments/book">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Book Your First Appointment
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Reschedule Dialog */}
        <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Reschedule Appointment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedAppointment && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium">{selectedAppointment.doctor}</p>
                  <p className="text-sm text-gray-600">{selectedAppointment.department}</p>
                  <p className="text-sm text-gray-500">
                    Current: {selectedAppointment.date} at {selectedAppointment.time}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">New Date</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">New Time</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => setShowRescheduleDialog(false)}>
                  Confirm Reschedule
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowRescheduleDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      </div>
    </PrivateRoute>
  )
}

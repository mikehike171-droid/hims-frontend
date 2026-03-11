"use client"

import { useState, useEffect } from "react"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  MessageCircle,
  Phone,
  Mail,
  Send,
  Paperclip,
  ImageIcon,
  Video,
  Mic,
  Search,
  MoreVertical,
  Star,
  Calendar,
  Stethoscope,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PatientSupportPage() {
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Mock data for available doctors
  const availableDoctors = [
    {
      id: "doc1",
      name: "Dr. Sarah Wilson",
      department: "Cardiology",
      specialization: "Interventional Cardiology",
      status: "online",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.9,
      experience: "15 years",
      location: "Main Hospital",
      lastSeen: "Online now",
      responseTime: "Usually responds in 5 mins",
      consultationFee: 500,
      languages: ["English", "Hindi"],
      activeChats: 3,
    },
    {
      id: "doc2",
      name: "Dr. Michael Chen",
      department: "Orthopedics",
      specialization: "Sports Medicine",
      status: "busy",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.8,
      experience: "12 years",
      location: "Sports Medicine Center",
      lastSeen: "5 mins ago",
      responseTime: "Usually responds in 10 mins",
      consultationFee: 600,
      languages: ["English", "Tamil"],
      activeChats: 5,
    },
    {
      id: "doc3",
      name: "Dr. Priya Sharma",
      department: "Pediatrics",
      specialization: "Child Development",
      status: "online",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.9,
      experience: "10 years",
      location: "Children's Wing",
      lastSeen: "Online now",
      responseTime: "Usually responds in 3 mins",
      consultationFee: 400,
      languages: ["English", "Hindi", "Gujarati"],
      activeChats: 2,
    },
    {
      id: "doc4",
      name: "Dr. Rajesh Kumar",
      department: "Internal Medicine",
      specialization: "General Medicine",
      status: "away",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.7,
      experience: "20 years",
      location: "General Medicine",
      lastSeen: "15 mins ago",
      responseTime: "Usually responds in 15 mins",
      consultationFee: 350,
      languages: ["English", "Hindi", "Bengali"],
      activeChats: 1,
    },
  ]

  // Mock chat messages
  const mockChatHistory = {
    doc1: [
      {
        id: "msg1",
        sender: "doctor",
        message: "Hello! I'm Dr. Sarah Wilson. How can I help you today?",
        timestamp: new Date(Date.now() - 300000),
        type: "text",
      },
      {
        id: "msg2",
        sender: "patient",
        message: "Hi Doctor, I've been experiencing chest pain for the past few days.",
        timestamp: new Date(Date.now() - 240000),
        type: "text",
      },
      {
        id: "msg3",
        sender: "doctor",
        message: "I understand your concern. Can you describe the pain? Is it sharp, dull, or burning?",
        timestamp: new Date(Date.now() - 180000),
        type: "text",
      },
      {
        id: "msg4",
        sender: "patient",
        message: "It's more like a dull ache, especially when I climb stairs.",
        timestamp: new Date(Date.now() - 120000),
        type: "text",
      },
      {
        id: "msg5",
        sender: "doctor",
        message:
          "Based on your symptoms, I'd recommend an ECG and some blood tests. Would you like me to schedule these for you?",
        timestamp: new Date(Date.now() - 60000),
        type: "text",
      },
    ],
  }

  const departments = [
    "all",
    "Cardiology",
    "Orthopedics",
    "Pediatrics",
    "Internal Medicine",
    "Dermatology",
    "Neurology",
    "Gynecology",
  ]

  const filteredDoctors = availableDoctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || doctor.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "busy":
        return "bg-yellow-500"
      case "away":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "online":
        return "Available"
      case "busy":
        return "Busy"
      case "away":
        return "Away"
      default:
        return "Offline"
    }
  }

  const sendMessage = () => {
    if (!chatMessage.trim() || !selectedDoctor) return

    const newMessage = {
      id: `msg${Date.now()}`,
      sender: "patient",
      message: chatMessage,
      timestamp: new Date(),
      type: "text",
    }

    setChatMessages([...chatMessages, newMessage])
    setChatMessage("")

    // Simulate doctor response after 2 seconds
    setTimeout(() => {
      const doctorResponse = {
        id: `msg${Date.now() + 1}`,
        sender: "doctor",
        message: "Thank you for your message. Let me review this and get back to you shortly.",
        timestamp: new Date(),
        type: "text",
      }
      setChatMessages((prev) => [...prev, doctorResponse])
    }, 2000)
  }

  const startChat = (doctor) => {
    setSelectedDoctor(doctor)
    setChatMessages(mockChatHistory[doctor.id] || [])
  }

  return (
    <PrivateRoute modulePath="admin/patient-portal/support" action="view">
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Patient Support</h1>
            <p className="text-sm text-gray-600">Get help from our medical experts</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600">
              {availableDoctors.filter((d) => d.status === "online").length} Doctors Online
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-6">
        <Tabs defaultValue="chat" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat" className="text-xs sm:text-sm">
              Live Chat
            </TabsTrigger>
            <TabsTrigger value="appointment" className="text-xs sm:text-sm">
              Book Appointment
            </TabsTrigger>
            <TabsTrigger value="faq" className="text-xs sm:text-sm">
              FAQ
            </TabsTrigger>
            <TabsTrigger value="contact" className="text-xs sm:text-sm">
              Contact
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Doctor List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Stethoscope className="h-5 w-5 text-blue-600" />
                      Available Doctors
                    </CardTitle>

                    {/* Search and Filter */}
                    <div className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search doctors..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>

                      <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept === "all" ? "All Departments" : dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                    {filteredDoctors.map((doctor) => (
                      <div
                        key={doctor.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                          selectedDoctor?.id === doctor.id ? "border-blue-500 bg-blue-50" : ""
                        }`}
                        onClick={() => startChat(doctor)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={doctor.avatar || "/placeholder.svg"} />
                              <AvatarFallback>
                                {doctor.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(doctor.status)}`}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900 truncate">{doctor.name}</h3>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="text-xs text-gray-600">{doctor.rating}</span>
                              </div>
                            </div>

                            <p className="text-sm text-gray-600 truncate">{doctor.specialization}</p>
                            <p className="text-xs text-gray-500">{doctor.department}</p>

                            <div className="flex items-center justify-between mt-2">
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  doctor.status === "online"
                                    ? "text-green-600"
                                    : doctor.status === "busy"
                                      ? "text-yellow-600"
                                      : "text-gray-600"
                                }`}
                              >
                                {getStatusText(doctor.status)}
                              </Badge>
                              <span className="text-xs text-gray-500">₹{doctor.consultationFee}</span>
                            </div>

                            <p className="text-xs text-gray-500 mt-1">{doctor.responseTime}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Chat Interface */}
              <div className="lg:col-span-2">
                <Card className="h-[500px] sm:h-[600px] flex flex-col">
                  {selectedDoctor ? (
                    <>
                      {/* Chat Header */}
                      <CardHeader className="border-b">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar>
                                <AvatarImage src={selectedDoctor.avatar || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {selectedDoctor.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div
                                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(selectedDoctor.status)}`}
                              />
                            </div>

                            <div>
                              <h3 className="font-medium text-gray-900">{selectedDoctor.name}</h3>
                              <p className="text-sm text-gray-600">{selectedDoctor.specialization}</p>
                              <p className="text-xs text-gray-500">{selectedDoctor.lastSeen}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Video className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                <DropdownMenuItem>Book Appointment</DropdownMenuItem>
                                <DropdownMenuItem>Report Issue</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardHeader>

                      {/* Chat Messages */}
                      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                        {chatMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.sender === "patient" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              <p className="text-sm">{message.message}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  message.sender === "patient" ? "text-blue-100" : "text-gray-500"
                                }`}
                              >
                                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </CardContent>

                      {/* Chat Input */}
                      <div className="border-t p-4">
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Paperclip className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                          <Input
                            placeholder="Type your message..."
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                            className="flex-1"
                          />
                          <Button size="sm" variant="outline" className="hidden sm:flex bg-transparent">
                            <Mic className="h-4 w-4" />
                          </Button>
                          <Button onClick={sendMessage} disabled={!chatMessage.trim()}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                          <span>Press Enter to send</span>
                          <span>Consultation Fee: ₹{selectedDoctor.consultationFee}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <CardContent className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Doctor to Start Chatting</h3>
                        <p className="text-gray-600">Choose from our available doctors to begin your consultation</p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appointment">
            <Card>
              <CardHeader>
                <CardTitle>Book an Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Schedule Your Visit</h3>
                  <p className="text-gray-600 mb-4">Book an in-person or video consultation</p>
                  <Button>Book Appointment</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h3 className="font-medium text-gray-900 mb-2">How do I start a chat with a doctor?</h3>
                    <p className="text-gray-600">
                      Simply select an available doctor from the list and click to start chatting. You'll be connected
                      instantly.
                    </p>
                  </div>
                  <div className="border-b pb-4">
                    <h3 className="font-medium text-gray-900 mb-2">What are the consultation fees?</h3>
                    <p className="text-gray-600">
                      Consultation fees vary by doctor and specialization. You can see the fee before starting a chat.
                    </p>
                  </div>
                  <div className="border-b pb-4">
                    <h3 className="font-medium text-gray-900 mb-2">Can I share images or documents?</h3>
                    <p className="text-gray-600">
                      Yes, you can share images, documents, and other files during your chat consultation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="font-medium">Emergency Helpline</p>
                      <p className="text-gray-600">+91-911-PRANAM (24/7)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Emergency Email</p>
                      <p className="text-gray-600">emergency@pranamhospitals.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>General Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">Support Helpline</p>
                      <p className="text-gray-600">+91-80-PRANAM-1</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Support Email</p>
                      <p className="text-gray-600">support@pranamhospitals.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </PrivateRoute>
  )
}

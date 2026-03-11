"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  MessageCircle,
  Send,
  Phone,
  Video,
  Paperclip,
  Image,
  FileText,
  Clock,
  User,
  Search,
  MoreVertical,
  CheckCircle,
  Circle,
  AlertCircle,
  Calendar,
  SubscriptIcon as Prescription,
  UserCheck,
  Bell,
  BellOff,
} from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  senderType: "doctor" | "patient"
  message: string
  timestamp: Date
  type: "text" | "file" | "image" | "prescription"
  fileUrl?: string
  fileName?: string
  status: "sent" | "delivered" | "read"
}

interface ChatSession {
  id: string
  patientId: string
  patientName: string
  patientAge: number
  patientGender: string
  patientPhone: string
  patientEmail: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  status: "active" | "waiting" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  department: string
  consultationFee: number
  messages: ChatMessage[]
  patientHistory: {
    lastVisit: Date
    conditions: string[]
    allergies: string[]
    medications: string[]
  }
}

export default function DoctorChatPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [doctorStatus, setDoctorStatus] = useState<"online" | "busy" | "away">("online")
  const [notifications, setNotifications] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock chat sessions data
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "1",
      patientId: "P001",
      patientName: "Sarah Johnson",
      patientAge: 34,
      patientGender: "Female",
      patientPhone: "+1 234-567-8901",
      patientEmail: "sarah.johnson@email.com",
      lastMessage: "I've been experiencing chest pain for the past 2 hours",
      lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
      unreadCount: 2,
      status: "active",
      priority: "urgent",
      department: "Cardiology",
      consultationFee: 150,
      patientHistory: {
        lastVisit: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        conditions: ["Hypertension", "Diabetes Type 2"],
        allergies: ["Penicillin"],
        medications: ["Metformin", "Lisinopril"],
      },
      messages: [
        {
          id: "m1",
          senderId: "P001",
          senderName: "Sarah Johnson",
          senderType: "patient",
          message: "Hello Doctor, I need to discuss my recent symptoms",
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
          type: "text",
          status: "read",
        },
        {
          id: "m2",
          senderId: "D001",
          senderName: "Dr. Admin",
          senderType: "doctor",
          message: "Hello Sarah, I'm here to help. Please describe your symptoms in detail.",
          timestamp: new Date(Date.now() - 8 * 60 * 1000),
          type: "text",
          status: "read",
        },
        {
          id: "m3",
          senderId: "P001",
          senderName: "Sarah Johnson",
          senderType: "patient",
          message: "I've been experiencing chest pain for the past 2 hours",
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          type: "text",
          status: "delivered",
        },
      ],
    },
    {
      id: "2",
      patientId: "P002",
      patientName: "Michael Chen",
      patientAge: 28,
      patientGender: "Male",
      patientPhone: "+1 234-567-8902",
      patientEmail: "michael.chen@email.com",
      lastMessage: "Thank you for the prescription, Doctor",
      lastMessageTime: new Date(Date.now() - 15 * 60 * 1000),
      unreadCount: 0,
      status: "active",
      priority: "low",
      department: "General Medicine",
      consultationFee: 100,
      patientHistory: {
        lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        conditions: ["Seasonal Allergies"],
        allergies: ["Dust", "Pollen"],
        medications: ["Cetirizine"],
      },
      messages: [
        {
          id: "m4",
          senderId: "P002",
          senderName: "Michael Chen",
          senderType: "patient",
          message: "Hi Doctor, my allergy symptoms are acting up again",
          timestamp: new Date(Date.now() - 25 * 60 * 1000),
          type: "text",
          status: "read",
        },
        {
          id: "m5",
          senderId: "D001",
          senderName: "Dr. Admin",
          senderType: "doctor",
          message: "I'll prescribe your usual antihistamine. Please take it as directed.",
          timestamp: new Date(Date.now() - 20 * 60 * 1000),
          type: "text",
          status: "read",
        },
        {
          id: "m6",
          senderId: "P002",
          senderName: "Michael Chen",
          senderType: "patient",
          message: "Thank you for the prescription, Doctor",
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          type: "text",
          status: "read",
        },
      ],
    },
    {
      id: "3",
      patientId: "P003",
      patientName: "Emma Wilson",
      patientAge: 45,
      patientGender: "Female",
      patientPhone: "+1 234-567-8903",
      patientEmail: "emma.wilson@email.com",
      lastMessage: "Can we schedule a follow-up appointment?",
      lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
      unreadCount: 1,
      status: "waiting",
      priority: "medium",
      department: "Orthopedics",
      consultationFee: 120,
      patientHistory: {
        lastVisit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        conditions: ["Arthritis", "Lower Back Pain"],
        allergies: ["None"],
        medications: ["Ibuprofen", "Glucosamine"],
      },
      messages: [
        {
          id: "m7",
          senderId: "P003",
          senderName: "Emma Wilson",
          senderType: "patient",
          message: "Hello Doctor, my back pain has improved significantly",
          timestamp: new Date(Date.now() - 35 * 60 * 1000),
          type: "text",
          status: "read",
        },
        {
          id: "m8",
          senderId: "P003",
          senderName: "Emma Wilson",
          senderType: "patient",
          message: "Can we schedule a follow-up appointment?",
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          type: "text",
          status: "delivered",
        },
      ],
    },
  ])

  const filteredChats = chatSessions.filter((chat) => {
    const matchesSearch =
      chat.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.patientPhone.includes(searchTerm) ||
      chat.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || chat.status === statusFilter
    const matchesPriority = priorityFilter === "all" || chat.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const currentChat = chatSessions.find((chat) => chat.id === selectedChat)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentChat?.messages])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return

    const message: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: "D001",
      senderName: "Dr. Admin",
      senderType: "doctor",
      message: newMessage,
      timestamp: new Date(),
      type: "text",
      status: "sent",
    }

    setChatSessions((prev) =>
      prev.map((chat) => {
        if (chat.id === selectedChat) {
          return {
            ...chat,
            messages: [...chat.messages, message],
            lastMessage: newMessage,
            lastMessageTime: new Date(),
          }
        }
        return chat
      }),
    )

    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "waiting":
        return "bg-yellow-100 text-yellow-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDoctorStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "busy":
        return "bg-red-500"
      case "away":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const totalChats = chatSessions.length
  const activeChats = chatSessions.filter((chat) => chat.status === "active").length
  const waitingChats = chatSessions.filter((chat) => chat.status === "waiting").length
  const urgentChats = chatSessions.filter((chat) => chat.priority === "urgent").length

  return (
    <PrivateRoute modulePath="admin/doctors/chat" action="view">
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Doctor Chat Console</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Manage patient conversations and provide real-time support
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getDoctorStatusColor(doctorStatus)}`}></div>
            <Select value={doctorStatus} onValueChange={(value: any) => setDoctorStatus(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="away">Away</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant={notifications ? "default" : "outline"}
            size="sm"
            onClick={() => setNotifications(!notifications)}
          >
            {notifications ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Chats</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{totalChats}</p>
              </div>
              <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Active Chats</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{activeChats}</p>
              </div>
              <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Waiting</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{waitingChats}</p>
              </div>
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Urgent</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{urgentChats}</p>
              </div>
              <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Chat List */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageCircle className="h-5 w-5" />
              Patient Chats
            </CardTitle>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-col sm:flex-row xl:flex-col gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="waiting">Waiting</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Priority" />
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
          <CardContent className="p-0">
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedChat === chat.id ? "bg-blue-50 border-blue-200" : ""
                  }`}
                  onClick={() => setSelectedChat(chat.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage
                          src={`/ceholder-svg-key-o1mvn-height-40-width-40-text-.jpg?key=o1mvn&height=40&width=40&text=${chat.patientName.charAt(0)}`}
                        />
                        <AvatarFallback>{chat.patientName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 truncate">{chat.patientName}</p>
                          {chat.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge className={getStatusColor(chat.status)} variant="outline">
                            {chat.status}
                          </Badge>
                          <Badge className={getPriorityColor(chat.priority)} variant="outline">
                            {chat.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {chat.lastMessageTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="xl:col-span-2">
          {currentChat ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`/ceholder-svg-key-5dcgi-height-40-width-40-text-.jpg?key=5dcgi&height=40&width=40&text=${currentChat.patientName.charAt(0)}`}
                      />
                      <AvatarFallback>{currentChat.patientName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-gray-900">{currentChat.patientName}</h3>
                      <p className="text-sm text-gray-600">
                        {currentChat.department} • ${currentChat.consultationFee}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="hidden sm:flex bg-transparent">
                      <Calendar className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-80 sm:h-96 overflow-y-auto p-4 space-y-4">
                  {currentChat.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderType === "doctor" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderType === "doctor" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                          {message.senderType === "doctor" && (
                            <div className="flex items-center gap-1">
                              {message.status === "sent" && <Circle className="h-3 w-3" />}
                              {message.status === "delivered" && <CheckCircle className="h-3 w-3" />}
                              {message.status === "read" && <CheckCircle className="h-3 w-3 text-blue-300" />}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="border-t p-4">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Image className="h-4 w-4" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Prescription className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[95vw] sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Send Prescription</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Textarea placeholder="Enter prescription details..." />
                          <Button className="w-full">Send Prescription</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="min-h-[40px] resize-none"
                      />
                    </div>
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Chat</h3>
              <p className="text-gray-600">Choose a patient conversation to start chatting</p>
            </CardContent>
          )}
        </Card>

        {/* Patient Information */}
        <Card className="xl:col-span-1">
          {currentChat ? (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage
                      src={`/ceholder-svg-key-vp4ya-height-80-width-80-text-.jpg?key=vp4ya&height=80&width=80&text=${currentChat.patientName.charAt(0)}`}
                    />
                    <AvatarFallback className="text-2xl">{currentChat.patientName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-gray-900">{currentChat.patientName}</h3>
                  <p className="text-sm text-gray-600">
                    {currentChat.patientAge} years • {currentChat.patientGender}
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Contact</p>
                    <p className="text-sm text-gray-600">{currentChat.patientPhone}</p>
                    <p className="text-sm text-gray-600 truncate">{currentChat.patientEmail}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Department</p>
                    <p className="text-sm text-gray-600">{currentChat.department}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Consultation Fee</p>
                    <p className="text-sm text-gray-600">${currentChat.consultationFee}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Last Visit</p>
                    <p className="text-sm text-gray-600">{currentChat.patientHistory.lastVisit.toLocaleDateString()}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Conditions</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentChat.patientHistory.conditions.map((condition, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Allergies</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentChat.patientHistory.allergies.map((allergy, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-red-50 text-red-700">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Current Medications</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentChat.patientHistory.medications.map((medication, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                          {medication}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button className="w-full" size="sm">
                    <UserCheck className="h-4 w-4 mr-2" />
                    View Full Profile
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Appointment
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Medical History
                  </Button>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="p-8 text-center">
              <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Patient Info</h3>
              <p className="text-gray-600">Select a chat to view patient information</p>
            </CardContent>
          )}
        </Card>
      </div>
      </div>
    </PrivateRoute>
  )
}

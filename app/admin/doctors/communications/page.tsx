"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Send, Search, Filter, Clock, CheckCircle, AlertCircle, User } from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function DoctorCommunications() {
  const [activeTab, setActiveTab] = useState("messages")
  const [newMessage, setNewMessage] = useState("")

  const messages = [
    {
      id: 1,
      patient: "John Smith",
      subject: "Medication Query",
      message: "Doctor, I'm experiencing some side effects from the new medication...",
      time: "10:30 AM",
      status: "unread",
      priority: "high",
    },
    {
      id: 2,
      patient: "Sarah Johnson",
      subject: "Follow-up Appointment",
      message: "Thank you for the consultation. When should I schedule my next visit?",
      time: "Yesterday",
      status: "read",
      priority: "normal",
    },
    {
      id: 3,
      patient: "Mike Wilson",
      subject: "Lab Results Question",
      message: "I received my lab results. Could you please explain what they mean?",
      time: "2 days ago",
      status: "replied",
      priority: "normal",
    },
  ]

  const notifications = [
    {
      id: 1,
      type: "appointment",
      message: "Appointment reminder: John Smith at 2:00 PM",
      time: "1 hour ago",
    },
    {
      id: 2,
      type: "lab",
      message: "Lab results available for Sarah Johnson",
      time: "2 hours ago",
    },
    {
      id: 3,
      type: "prescription",
      message: "Prescription refill request from Mike Wilson",
      time: "3 hours ago",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread":
        return "bg-blue-100 text-blue-800"
      case "read":
        return "bg-gray-100 text-gray-800"
      case "replied":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "normal":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <PrivateRoute modulePath="admin/doctors/communications" action="view">
      <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Communications</h1>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="messages">Patient Messages</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="compose">Compose</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Patient Messages</CardTitle>
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input placeholder="Search messages..." className="w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{message.patient}</h4>
                            <Badge className={getPriorityColor(message.priority)}>{message.priority}</Badge>
                          </div>
                          <p className="font-medium text-sm text-gray-900 mb-1">{message.subject}</p>
                          <p className="text-sm text-gray-600 line-clamp-2">{message.message}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-2">{message.time}</p>
                        <Badge className={getStatusColor(message.status)}>{message.status}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    {notification.type === "appointment" && <Clock className="h-5 w-5 text-blue-500" />}
                    {notification.type === "lab" && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {notification.type === "prescription" && <AlertCircle className="h-5 w-5 text-orange-500" />}
                    <div className="flex-1">
                      <p className="font-medium">{notification.message}</p>
                      <p className="text-sm text-gray-600">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compose" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compose Message</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">To (Patient)</label>
                <Input placeholder="Search patient name..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <Input placeholder="Message subject..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea
                  placeholder="Type your message..."
                  className="h-32"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline">Save Draft</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </PrivateRoute>
  )
}

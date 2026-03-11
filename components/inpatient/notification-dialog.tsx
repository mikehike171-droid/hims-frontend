"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, MessageSquare, Mail, User, Send } from "lucide-react"

interface NotificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient?: any
}

const notificationTemplates = {
  admission: {
    sms: "Dear {name}, {patient} has been admitted to {hospital} in {ward}. Contact: {phone}",
    whatsapp:
      "🏥 *Admission Notification*\n\nDear {name},\n\n{patient} has been successfully admitted to {hospital}.\n\n📍 Ward: {ward}\n🛏️ Room: {room}\n👨‍⚕️ Doctor: {doctor}\n📞 Contact: {phone}",
    email:
      "Subject: Patient Admission Notification\n\nDear {name},\n\nThis is to inform you that {patient} has been admitted to {hospital}.\n\nAdmission Details:\n- Ward: {ward}\n- Room: {room}\n- Attending Doctor: {doctor}\n- Admission Date: {date}\n\nFor any queries, please contact us at {phone}.\n\nBest regards,\n{hospital}",
  },
  transfer: {
    sms: "Update: {patient} has been transferred to {ward} - Room {room}. Contact: {phone}",
    whatsapp:
      "🔄 *Transfer Notification*\n\nDear {name},\n\n{patient} has been transferred to a new location:\n\n📍 New Ward: {ward}\n🛏️ New Room: {room}\n👨‍⚕️ Doctor: {doctor}\n📞 Contact: {phone}",
    email:
      "Subject: Patient Transfer Notification\n\nDear {name},\n\n{patient} has been transferred to a new ward for better care.\n\nNew Location:\n- Ward: {ward}\n- Room: {room}\n- Attending Doctor: {doctor}\n\nFor any queries, please contact us at {phone}.\n\nBest regards,\n{hospital}",
  },
  discharge: {
    sms: "Good news! {patient} is ready for discharge from {hospital}. Please contact {phone} for formalities.",
    whatsapp:
      "🎉 *Discharge Ready*\n\nDear {name},\n\nGreat news! {patient} is ready for discharge from {hospital}.\n\n📋 Please complete discharge formalities\n💊 Collect medications and instructions\n📞 Contact: {phone}",
    email:
      "Subject: Discharge Notification\n\nDear {name},\n\n{patient} is ready for discharge from {hospital}.\n\nPlease visit the hospital to:\n- Complete discharge formalities\n- Collect medications and discharge summary\n- Receive follow-up instructions\n\nContact us at {phone} for any assistance.\n\nBest regards,\n{hospital}",
  },
  emergency: {
    sms: "URGENT: {patient} requires immediate attention at {hospital}. Please contact {phone} immediately.",
    whatsapp:
      "🚨 *EMERGENCY NOTIFICATION*\n\nDear {name},\n\n{patient} requires immediate medical attention at {hospital}.\n\n📞 Please contact us IMMEDIATELY at {phone}\n🏥 Ward: {ward}\n👨‍⚕️ Doctor: {doctor}",
    email:
      "Subject: URGENT - Emergency Notification\n\nDear {name},\n\nThis is an urgent notification regarding {patient} at {hospital}.\n\nImmediate attention is required. Please contact us immediately at {phone}.\n\nLocation: {ward}\nAttending Doctor: {doctor}\n\nUrgent regards,\n{hospital}",
  },
}

export function NotificationDialog({ open, onOpenChange, patient }: NotificationDialogProps) {
  const [notificationData, setNotificationData] = useState({
    type: "admission",
    method: "whatsapp",
    recipientName: "",
    recipientPhone: "",
    recipientEmail: "",
    customMessage: "",
    useTemplate: true,
  })

  const [previewMessage, setPreviewMessage] = useState("")

  const generatePreview = () => {
    if (!notificationData.useTemplate || !patient) return notificationData.customMessage

    const template =
      notificationTemplates[notificationData.type as keyof typeof notificationTemplates]?.[
        notificationData.method as keyof typeof template
      ]

    if (!template) return ""

    return template
      .replace(/{name}/g, notificationData.recipientName || "[Recipient Name]")
      .replace(/{patient}/g, patient?.name || "[Patient Name]")
      .replace(/{hospital}/g, "Pranam Hospitals")
      .replace(/{ward}/g, patient?.ward || "[Ward]")
      .replace(/{room}/g, patient?.room ? `${patient.room}${patient.bed}` : "[Room]")
      .replace(/{doctor}/g, patient?.doctor || "[Doctor]")
      .replace(/{phone}/g, "+91 80 2345 6789")
      .replace(/{date}/g, new Date().toLocaleDateString())
  }

  const handleSubmit = () => {
    const finalMessage = notificationData.useTemplate ? generatePreview() : notificationData.customMessage
    console.log("Notification Data:", { ...notificationData, finalMessage, patient })
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setNotificationData({
      type: "admission",
      method: "whatsapp",
      recipientName: "",
      recipientPhone: "",
      recipientEmail: "",
      customMessage: "",
      useTemplate: true,
    })
    setPreviewMessage("")
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "sms":
        return <MessageSquare className="h-4 w-4" />
      case "whatsapp":
        return <MessageSquare className="h-4 w-4 text-green-600" />
      case "email":
        return <Mail className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) resetForm()
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Send Notification
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Info */}
          {patient && (
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{patient.name}</h3>
                    <p className="text-sm text-gray-600">
                      IP: {patient.ipNumber} • {patient.ward} - {patient.room}
                      {patient.bed}
                    </p>
                    <p className="text-sm text-gray-600">Doctor: {patient.doctor}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notification Settings */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="type">Notification Type</Label>
                    <select
                      id="type"
                      value={notificationData.type}
                      onChange={(e) => setNotificationData({ ...notificationData, type: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="admission">Admission</option>
                      <option value="transfer">Transfer</option>
                      <option value="discharge">Discharge</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="method">Delivery Method</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {["sms", "whatsapp", "email"].map((method) => (
                        <button
                          key={method}
                          onClick={() => setNotificationData({ ...notificationData, method })}
                          className={`p-3 border rounded-lg flex flex-col items-center space-y-1 transition-colors ${
                            notificationData.method === method
                              ? "border-red-600 bg-red-50 text-red-600"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {getMethodIcon(method)}
                          <span className="text-xs font-medium capitalize">{method}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="recipientName">Recipient Name</Label>
                    <Input
                      id="recipientName"
                      value={notificationData.recipientName}
                      onChange={(e) => setNotificationData({ ...notificationData, recipientName: e.target.value })}
                      placeholder="Contact person name"
                    />
                  </div>

                  {(notificationData.method === "sms" || notificationData.method === "whatsapp") && (
                    <div>
                      <Label htmlFor="recipientPhone">Phone Number</Label>
                      <Input
                        id="recipientPhone"
                        value={notificationData.recipientPhone}
                        onChange={(e) => setNotificationData({ ...notificationData, recipientPhone: e.target.value })}
                        placeholder="+91 9876543210"
                      />
                    </div>
                  )}

                  {notificationData.method === "email" && (
                    <div>
                      <Label htmlFor="recipientEmail">Email Address</Label>
                      <Input
                        id="recipientEmail"
                        type="email"
                        value={notificationData.recipientEmail}
                        onChange={(e) => setNotificationData({ ...notificationData, recipientEmail: e.target.value })}
                        placeholder="email@example.com"
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="useTemplate"
                      checked={notificationData.useTemplate}
                      onChange={(e) => setNotificationData({ ...notificationData, useTemplate: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="useTemplate">Use template message</Label>
                  </div>

                  {!notificationData.useTemplate && (
                    <div>
                      <Label htmlFor="customMessage">Custom Message</Label>
                      <Textarea
                        id="customMessage"
                        value={notificationData.customMessage}
                        onChange={(e) => setNotificationData({ ...notificationData, customMessage: e.target.value })}
                        placeholder="Enter your custom message..."
                        rows={4}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Message Preview */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {getMethodIcon(notificationData.method)}
                    <span className="ml-2">Message Preview</span>
                    <Badge variant="outline" className="ml-2 capitalize">
                      {notificationData.method}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg min-h-[200px]">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                      {generatePreview() || "Message preview will appear here..."}
                    </pre>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Delivery Information</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <p>
                        <strong>To:</strong> {notificationData.recipientName || "Recipient"}
                      </p>
                      {notificationData.method !== "email" && (
                        <p>
                          <strong>Phone:</strong> {notificationData.recipientPhone || "Not specified"}
                        </p>
                      )}
                      {notificationData.method === "email" && (
                        <p>
                          <strong>Email:</strong> {notificationData.recipientEmail || "Not specified"}
                        </p>
                      )}
                      <p>
                        <strong>Type:</strong>{" "}
                        {notificationData.type.charAt(0).toUpperCase() + notificationData.type.slice(1)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !notificationData.recipientName ||
                (notificationData.method !== "email" && !notificationData.recipientPhone) ||
                (notificationData.method === "email" && !notificationData.recipientEmail) ||
                (!notificationData.useTemplate && !notificationData.customMessage)
              }
              className="bg-red-600 hover:bg-red-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Notification
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

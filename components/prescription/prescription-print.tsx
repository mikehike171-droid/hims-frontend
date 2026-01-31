"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Printer,
  Mail,
  MessageCircle,
  Download,
  X,
  FileText,
  Phone,
  MapPin,
  Calendar,
  Clock,
  User,
  CreditCard,
} from "lucide-react"

interface PrescriptionData {
  patientId: string
  patientName: string
  patientAge: number
  patientGender: string
  patientPhone: string
  patientEmail?: string
  patientAddress?: string
  doctorName: string
  doctorSpecialization: string
  doctorRegNo: string
  appointmentDate: string
  appointmentTime: string
  services: Array<{
    name: string
    quantity: number
    price: number
    total: number
  }>
  paymentStatus: "paid" | "partial" | "pending"
  paymentMethod: string
  totalAmount: number
  paidAmount: number
  balanceAmount: number
  prescriptionId: string
  hospitalName: string
  hospitalAddress: string
  hospitalPhone: string
  hospitalEmail: string
}

interface PrescriptionPrintProps {
  isOpen: boolean
  onClose: () => void
  prescriptionData: PrescriptionData
  onPrint: () => void
  onEmailSend: () => void
  onWhatsAppSend: () => void
  showEPrescriptionOption?: boolean
}

export function PrescriptionPrint({
  isOpen,
  onClose,
  prescriptionData,
  onPrint,
  onEmailSend,
  onWhatsAppSend,
  showEPrescriptionOption = false,
}: PrescriptionPrintProps) {
  const [useEPrescription, setUseEPrescription] = useState(false)

  const handlePrint = () => {
    if (useEPrescription) {
      // Skip printing for e-prescription
      onClose()
      return
    }
    onPrint()
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "partial":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Registration Receipt
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* E-Prescription Option */}
          {showEPrescriptionOption && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="e-prescription" checked={useEPrescription} onCheckedChange={setUseEPrescription} />
                  <Label htmlFor="e-prescription" className="text-sm font-medium">
                    Use E-Prescription (Skip printing and send digitally)
                  </Label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Prescription Content */}
          <div className="bg-white border rounded-lg p-8 print:shadow-none print:border-none">
            {/* Hospital Header */}
            <div className="text-center mb-8 border-b pb-6">
              <h1 className="text-3xl font-bold text-blue-900 mb-2">{prescriptionData.hospitalName}</h1>
              <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {prescriptionData.hospitalAddress}
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {prescriptionData.hospitalPhone}
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {prescriptionData.hospitalEmail}
                </div>
              </div>
            </div>

            {/* Receipt Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Registration Receipt</h2>
                <p className="text-sm text-gray-600">Receipt ID: {prescriptionData.prescriptionId}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{prescriptionData.appointmentDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{prescriptionData.appointmentTime}</span>
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5" />
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Patient ID</p>
                    <p className="font-semibold">{prescriptionData.patientId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold">{prescriptionData.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Age / Gender</p>
                    <p className="font-semibold">
                      {prescriptionData.patientAge} years / {prescriptionData.patientGender}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold">{prescriptionData.patientPhone}</p>
                  </div>
                  {prescriptionData.patientEmail && (
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold">{prescriptionData.patientEmail}</p>
                    </div>
                  )}
                  {prescriptionData.patientAddress && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-semibold">{prescriptionData.patientAddress}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prescriptionData.services.map((service, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                      <div className="flex-1">
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {service.quantity} × ₹{service.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{service.total.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-semibold">₹{prescriptionData.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount Paid:</span>
                    <span className="font-semibold text-green-600">₹{prescriptionData.paidAmount.toFixed(2)}</span>
                  </div>
                  {prescriptionData.balanceAmount > 0 && (
                    <div className="flex justify-between">
                      <span>Balance Amount:</span>
                      <span className="font-semibold text-red-600">₹{prescriptionData.balanceAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span>Payment Method:</span>
                    <span className="font-semibold capitalize">{prescriptionData.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Payment Status:</span>
                    <Badge className={getPaymentStatusColor(prescriptionData.paymentStatus)}>
                      {prescriptionData.paymentStatus.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Doctor Information */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Attending Staff</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold">{prescriptionData.doctorName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-semibold">{prescriptionData.doctorSpecialization}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Registration No.</p>
                    <p className="font-semibold">{prescriptionData.doctorRegNo}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center text-sm text-gray-600 border-t pt-4">
              <p>Thank you for choosing {prescriptionData.hospitalName}</p>
              <p>Please keep this receipt for your records</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end print:hidden">
            <Button variant="outline" onClick={onEmailSend} disabled={!prescriptionData.patientEmail}>
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button variant="outline" onClick={onWhatsAppSend}>
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              {useEPrescription ? "Send E-Receipt" : "Print"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

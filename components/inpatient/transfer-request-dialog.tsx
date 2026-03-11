"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRightLeft, Bed, User, CheckCircle } from "lucide-react"

interface TransferRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient?: any
}

const mockBeds = [
  { id: 1, ward: "General Ward A", room: "102", bed: "B", type: "Standard", available: true },
  { id: 2, ward: "ICU", room: "202", bed: "A", type: "ICU", available: true },
  { id: 3, ward: "Isolation Ward", room: "501", bed: "A", type: "Isolation", available: true },
  { id: 4, ward: "Maternity Ward", room: "402", bed: "A", type: "Deluxe", available: false },
]

const transferReasons = [
  "Medical condition requires specialized care",
  "Patient request for room change",
  "Bed maintenance required",
  "Isolation protocol",
  "Step-down from ICU",
  "Upgrade to private room",
  "Administrative reasons",
  "Other",
]

export function TransferRequestDialog({ open, onOpenChange, patient }: TransferRequestDialogProps) {
  const [selectedBed, setSelectedBed] = useState<any>(null)
  const [transferData, setTransferData] = useState({
    reason: "",
    customReason: "",
    priority: "normal",
    notes: "",
    requestedBy: "Dr. Admin",
  })

  const availableBeds = mockBeds.filter((bed) => bed.available)

  const handleSubmit = () => {
    console.log("Transfer Request:", { patient, selectedBed, transferData })
    onOpenChange(false)
    resetForm()
  }

  const resetForm = () => {
    setSelectedBed(null)
    setTransferData({
      reason: "",
      customReason: "",
      priority: "normal",
      notes: "",
      requestedBy: "Dr. Admin",
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "emergency":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "normal":
        return "bg-blue-100 text-blue-800"
      case "low":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
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
            <ArrowRightLeft className="h-5 w-5 mr-2" />
            Transfer Request
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Patient Info */}
          {patient && (
            <Card>
              <CardHeader>
                <CardTitle>Current Patient</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{patient.name}</h3>
                      <p className="text-sm text-gray-600">
                        IP: {patient.ipNumber} • {patient.age}Y, {patient.gender}
                      </p>
                      <p className="text-sm text-gray-600">
                        Current: {patient.ward} - {patient.room}
                        {patient.bed}
                      </p>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(patient.condition?.toLowerCase())}>{patient.condition}</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transfer Details */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Transfer Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="reason">Reason for Transfer</Label>
                    <select
                      id="reason"
                      value={transferData.reason}
                      onChange={(e) => setTransferData({ ...transferData, reason: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select reason...</option>
                      {transferReasons.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                  </div>

                  {transferData.reason === "Other" && (
                    <div>
                      <Label htmlFor="customReason">Custom Reason</Label>
                      <Input
                        id="customReason"
                        value={transferData.customReason}
                        onChange={(e) => setTransferData({ ...transferData, customReason: e.target.value })}
                        placeholder="Specify the reason"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="priority">Priority Level</Label>
                    <select
                      id="priority"
                      value={transferData.priority}
                      onChange={(e) => setTransferData({ ...transferData, priority: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={transferData.notes}
                      onChange={(e) => setTransferData({ ...transferData, notes: e.target.value })}
                      placeholder="Any additional information..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="requestedBy">Requested By</Label>
                    <Input
                      id="requestedBy"
                      value={transferData.requestedBy}
                      onChange={(e) => setTransferData({ ...transferData, requestedBy: e.target.value })}
                      placeholder="Doctor/Staff name"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Destination Bed Selection */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Select Destination Bed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {availableBeds.map((bed) => (
                      <Card
                        key={bed.id}
                        className={`cursor-pointer transition-colors ${selectedBed?.id === bed.id ? "ring-2 ring-red-600 bg-red-50" : "hover:bg-gray-50"}`}
                        onClick={() => setSelectedBed(bed)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Bed className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium">{bed.ward}</h4>
                                <p className="text-sm text-gray-600">
                                  Room {bed.room} - Bed {bed.bed}
                                </p>
                                <Badge variant="outline" className="text-xs">
                                  {bed.type}
                                </Badge>
                              </div>
                            </div>
                            {selectedBed?.id === bed.id && <CheckCircle className="h-5 w-5 text-red-600" />}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Transfer Summary */}
          {selectedBed && patient && (
            <Card>
              <CardHeader>
                <CardTitle>Transfer Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center space-x-8">
                  {/* From */}
                  <div className="text-center">
                    <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Bed className="h-8 w-8 text-gray-600" />
                    </div>
                    <h4 className="font-semibold">From</h4>
                    <p className="text-sm text-gray-600">{patient.ward}</p>
                    <p className="text-sm text-gray-600">
                      Room {patient.room}
                      {patient.bed}
                    </p>
                  </div>

                  {/* Arrow */}
                  <ArrowRightLeft className="h-8 w-8 text-red-600" />

                  {/* To */}
                  <div className="text-center">
                    <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Bed className="h-8 w-8 text-red-600" />
                    </div>
                    <h4 className="font-semibold">To</h4>
                    <p className="text-sm text-gray-600">{selectedBed.ward}</p>
                    <p className="text-sm text-gray-600">
                      Room {selectedBed.room} - Bed {selectedBed.bed}
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Reason:</strong> {transferData.reason || "Not specified"}
                    </div>
                    <div>
                      <strong>Priority:</strong>
                      <Badge className={`ml-2 ${getPriorityColor(transferData.priority)}`}>
                        {transferData.priority.charAt(0).toUpperCase() + transferData.priority.slice(1)}
                      </Badge>
                    </div>
                    <div className="col-span-2">
                      <strong>Requested by:</strong> {transferData.requestedBy}
                    </div>
                    {transferData.notes && (
                      <div className="col-span-2">
                        <strong>Notes:</strong> {transferData.notes}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedBed || !transferData.reason}
              className="bg-red-600 hover:bg-red-700"
            >
              Submit Transfer Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

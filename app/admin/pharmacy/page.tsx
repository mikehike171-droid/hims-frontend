"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pill, ChevronDown, ChevronUp, Check, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { settingsApi } from "@/lib/settingsApi"
import authService from "@/lib/authService"

export default function PharmacyPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedPrescriptions, setExpandedPrescriptions] = useState<Set<number>>(new Set())
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true
      fetchPrescriptions()
    }
  }, [])

  const fetchPrescriptions = async () => {
    try {
      setLoading(true)
      const locationId = authService.getLocationId()
      const data = await settingsApi.getPharmacyPrescriptions(locationId ? parseInt(locationId) : 1)
      setPrescriptions(data || [])
    } catch (error) {
      console.error('Error fetching prescriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatTiming = (morning: boolean, afternoon: boolean, night: boolean) => {
    const timings = []
    if (morning) timings.push('Morning')
    if (afternoon) timings.push('Afternoon')
    if (night) timings.push('Night')
    return timings.join(', ') || '-'
  }

  const toggleExpanded = (prescriptionId: number) => {
    const newExpanded = new Set(expandedPrescriptions)
    if (newExpanded.has(prescriptionId)) {
      newExpanded.delete(prescriptionId)
    } else {
      newExpanded.add(prescriptionId)
    }
    setExpandedPrescriptions(newExpanded)
  }

  const handleStatusUpdate = async (prescriptionId: number, status: number, statusText: string) => {
    try {
      setLoading(true)
      await settingsApi.updatePrescriptionStatus(prescriptionId, status)
      toast({
        title: "Success",
        description: `Prescription ${statusText} successfully`,
      })
      // Refresh prescriptions to remove the updated one from pending list
      await fetchPrescriptions()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${statusText.toLowerCase()} prescription`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PrivateRoute modulePath="admin/pharmacy" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pharmacy</h1>
            <p className="text-gray-600">Patient prescriptions and medicine details</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Pill className="h-5 w-5" />
              <span>Patient Prescriptions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-8">Loading prescriptions...</div>
              ) : prescriptions.length === 0 ? (
                <div className="text-center py-8">No prescriptions found</div>
              ) : (
                prescriptions.map((prescription, index) => (
                  <div key={prescription.prescription_id} className="border rounded-lg p-4">
                    <div 
                      className="mb-4 pb-2 border-b cursor-pointer hover:bg-gray-50 p-2 rounded"
                      onClick={() => toggleExpanded(prescription.prescription_id)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <div>
                            <h3 className="text-lg font-semibold">{prescription.patient_name}</h3>
                            <p className="text-sm text-gray-600">Date: {formatDate(prescription.created_at)}</p>
                          </div>
                          {expandedPrescriptions.has(prescription.prescription_id) ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                        <div className="text-right">
                          <div className="flex gap-2 mb-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStatusUpdate(prescription.prescription_id, 1, 'received')
                              }}
                              disabled={loading}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Received
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStatusUpdate(prescription.prescription_id, 2, 'cancelled')
                              }}
                              disabled={loading}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                          <Badge variant="outline" className="mb-1">
                            {prescription.medicine_days} days
                          </Badge>
                          <p className="text-sm text-gray-600">
                            Next: {prescription.next_appointment_date ? formatDate(prescription.next_appointment_date) : '-'}
                          </p>
                        </div>
                      </div>
                      {prescription.notes_to_pharmacy && (
                        <p className="text-sm text-gray-700 mt-2">
                          <strong>Notes:</strong> {prescription.notes_to_pharmacy}
                        </p>
                      )}
                    </div>
                    
                    {expandedPrescriptions.has(prescription.prescription_id) && (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Medicine Type</TableHead>
                              <TableHead>Medicine</TableHead>
                              <TableHead>Potency</TableHead>
                              <TableHead>Dosage</TableHead>
                              <TableHead>Timing</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {prescription.medicines && prescription.medicines.length > 0 ? (
                              prescription.medicines.map((medicine: any, medIndex: number) => (
                                <TableRow key={medIndex}>
                                  <TableCell>{medicine.medicine_type || '-'}</TableCell>
                                  <TableCell className="font-medium">{medicine.medicine || '-'}</TableCell>
                                  <TableCell>{medicine.potency || '-'}</TableCell>
                                  <TableCell>{medicine.dosage || '-'}</TableCell>
                                  <TableCell>
                                    {[
                                      medicine.morning && 'Morning',
                                      medicine.afternoon && 'Afternoon',
                                      medicine.night && 'Night'
                                    ].filter(Boolean).join(', ') || '-'}
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center text-gray-500">No medicines</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  )
}
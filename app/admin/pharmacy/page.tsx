"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pill, ChevronDown, ChevronUp, Check, X, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { settingsApi } from "@/lib/settingsApi"
import authService from "@/lib/authService"

export default function PharmacyPage() {
  const [prescriptions, setPrescriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [expandedPrescriptions, setExpandedPrescriptions] = useState<Set<number>>(new Set())
  const [page, setPage] = useState(1)
  const pageSize = 10
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
      const data = await settingsApi.getPharmacyPrescriptions()
      setPrescriptions(data || [])
      setPage(1)
    } catch (error) {
      console.error('Error fetching prescriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
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

  const totalRecords = prescriptions.length
  const totalPages = Math.ceil(totalRecords / pageSize)
  const paginatedPrescriptions = prescriptions.slice((page - 1) * pageSize, page * pageSize)

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
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Pill className="h-5 w-5" />
                <span>Patient Prescriptions ({loading ? '...' : totalRecords})</span>
              </div>
              {!loading && totalRecords > 0 && (
                <div className="text-sm font-normal text-gray-600">
                  Page {page} of {totalPages || 1}
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading prescriptions...</div>
            ) : totalRecords === 0 ? (
              <div className="text-center py-8">No prescriptions found</div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-8"></TableHead>
                        <TableHead>Patient Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Medicine Days</TableHead>
                        <TableHead>Notes to Pharmacy</TableHead>
                        <TableHead>Next Appointment</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedPrescriptions.map((prescription) => (
                        <PRescriptionRow 
                          key={prescription.prescription_id} 
                          prescription={prescription} 
                          expandedPrescriptions={expandedPrescriptions}
                          toggleExpanded={toggleExpanded}
                          formatDate={formatDate}
                          handleStatusUpdate={handleStatusUpdate}
                          loading={loading}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalRecords > pageSize && (
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Showing {Math.min(((page - 1) * pageSize) + 1, totalRecords)} to {Math.min(page * pageSize, totalRecords)} of {totalRecords} prescriptions
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => {
                          const pageNum = i + 1;
                          if (
                            pageNum === 1 || 
                            pageNum === totalPages || 
                            (pageNum >= page - 1 && pageNum <= page + 1)
                          ) {
                            return (
                              <Button
                                key={pageNum}
                                variant={page === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => setPage(pageNum)}
                              >
                                {pageNum}
                              </Button>
                            );
                          } else if (
                            pageNum === page - 2 || 
                            pageNum === page + 2
                          ) {
                            return <span key={pageNum} className="px-2">...</span>;
                          }
                          return null;
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  )
}

function PRescriptionRow({ prescription, expandedPrescriptions, toggleExpanded, formatDate, handleStatusUpdate, loading }: any) {
  return (
    <>
      <TableRow
        className="cursor-pointer hover:bg-gray-50"
        onClick={() => toggleExpanded(prescription.prescription_id)}
      >
        <TableCell>
          {expandedPrescriptions.has(prescription.prescription_id) ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </TableCell>
        <TableCell className="font-semibold">{prescription.patient_name}</TableCell>
        <TableCell>{formatDate(prescription.created_at)}</TableCell>
        <TableCell>
          <Badge variant="outline">{prescription.medicine_days} days</Badge>
        </TableCell>
        <TableCell className="max-w-xs">
          {prescription.notes_to_pharmacy ? (
            <span className="text-sm text-gray-700">{prescription.notes_to_pharmacy}</span>
          ) : (
            <span className="text-sm text-gray-400">-</span>
          )}
        </TableCell>
        <TableCell>
          {prescription.next_appointment_date
            ? formatDate(prescription.next_appointment_date)
            : <span className="text-gray-400">-</span>}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleStatusUpdate(prescription.prescription_id, 1, 'received')}
              disabled={loading}
            >
              <Check className="h-4 w-4 mr-1" />
              Received
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleStatusUpdate(prescription.prescription_id, 2, 'cancelled')}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {expandedPrescriptions.has(prescription.prescription_id) && (
        <TableRow>
          <TableCell colSpan={7} className="bg-gray-50 px-8 pb-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Medicines</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine Type</TableHead>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Potency</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Timing</TableHead>
                  <TableHead>Notes</TableHead>
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
                      <TableCell>{medicine.notes || '-'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">No medicines</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableCell>
        </TableRow>
      )}
    </>
  )
}
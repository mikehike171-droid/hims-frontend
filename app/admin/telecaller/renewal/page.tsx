"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, PhoneCall, Filter, Search } from "lucide-react"
import authService from "@/lib/authService"
import { settingsApi } from "@/lib/settingsApi"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function RenewalPage() {
  const [renewalPatients, setRenewalPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  // Set default dates to current month
  // Set default dates to current month
  useEffect(() => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    const fromDateStr = firstDay.toISOString().split('T')[0]
    const toDateStr = lastDay.toISOString().split('T')[0]
    
    setFromDate(fromDateStr)
    setToDate(toDateStr)
    
    // Fetch current month data on initial load only
    fetchRenewalPatientsWithDates(fromDateStr, toDateStr)
  }, [])

  const fetchRenewalPatientsWithDates = async (from: string, to: string) => {
    try {
      setLoading(true)
      const locationId = authService.getLocationId()
      const data = await settingsApi.getRenewalPatients(
        locationId ? parseInt(locationId) : 1,
        from,
        to
      )
      setRenewalPatients(data || [])
    } catch (error) {
      console.error('Error fetching renewal patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRenewalPatients = async () => {
    if (fromDate && toDate) {
      await fetchRenewalPatientsWithDates(fromDate, toDate)
    }
  }

  const handleCall = (patientId: number, mobile: string) => {
    if (mobile) {
      window.open(`tel:${mobile}`)
    }
  }

  const handleCallPatient = (patient: any) => {
    window.location.href = `/admin/telecaller/call-patient?patientId=${patient.patientId}`
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <PrivateRoute>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Patient Renewals</h1>
          <Button onClick={fetchRenewalPatients} variant="outline">
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Filter className="h-5 w-5 mr-2" />
              Date Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>From Date</Label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>To Date</Label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button
                  className="w-full"
                  onClick={fetchRenewalPatients}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patients with Renewal Dates ({renewalPatients.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading renewal patients...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Mobile Number</TableHead>
                    <TableHead>Next Renewal Date</TableHead>
                    <TableHead>Treatment Plan (Months)</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {renewalPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No patients with renewal dates found
                      </TableCell>
                    </TableRow>
                  ) : (
                    renewalPatients.map((patient: any) => (
                      <TableRow key={patient.patient_id}>
                        <TableCell className="font-medium">
                          {patient.firstName && patient.lastName 
                            ? `${patient.firstName} ${patient.lastName}`
                            : `Patient ID: ${patient.patientId}`
                          }
                        </TableCell>
                        <TableCell>{patient.mobileNumber || 'N/A'}</TableCell>
                        <TableCell>{formatDate(patient.nextRenewalDatePro)}</TableCell>
                        <TableCell>{patient.treatmentPlanMonthsPro || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {patient.mobileNumber && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCallPatient(patient)}
                                title="Call Patient"
                              >
                                <PhoneCall className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  )
}
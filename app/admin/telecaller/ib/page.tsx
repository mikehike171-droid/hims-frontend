"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, Search, RefreshCw, PhoneCall } from "lucide-react"
import { frontOfficeApi } from "@/lib/frontOfficeApi"
import Link from "next/link"
import PrivateRoute from "@/components/auth/PrivateRoute"

interface Patient {
  id: number
  patient_id: string
  first_name: string
  last_name: string
  mobile: string
  email?: string
  gender: string
  date_of_birth: string
  address1: string
  patient_source_id: number
  created_at: string
}

export default function IBPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')
  const fetchingRef = useRef(false)

  // Set default dates to current month
  useEffect(() => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    const fromDateStr = firstDay.toISOString().split('T')[0]
    const toDateStr = lastDay.toISOString().split('T')[0]
    
    setFromDate(fromDateStr)
    setToDate(toDateStr)
    
    // Fetch current month data on initial load
    fetchIBPatients(fromDateStr, toDateStr)
  }, [])

  useEffect(() => {
    const filtered = patients.filter(patient =>
      (patient.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.patient_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.mobile || '').includes(searchTerm)
    )
    setFilteredPatients(filtered)
  }, [patients, searchTerm])

  const fetchIBPatients = async (from?: string, to?: string) => {
    if (fetchingRef.current) return
    
    try {
      fetchingRef.current = true
      setLoading(true)
      // Use the date parameters if provided, otherwise use state values
      const data = await frontOfficeApi.getPatientsBySource(4, from || fromDate, to || toDate)
      setPatients(data)
    } catch (error) {
      console.error('Error fetching IB patients:', error)
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }

  const handleSearch = () => {
    fetchIBPatients()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading IB patients...</p>
        </div>
      </div>
    )
  }

  return (
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">IB Patients</h1>
          <p className="text-gray-600">Patients registered through IB channels</p>
        </div>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          Total: {filteredPatients.length}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Date Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="fromDate" className="text-sm font-medium">From Date:</Label>
              <Input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="toDate" className="text-sm font-medium">To Date:</Label>
              <Input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-40"
              />
            </div>
            <Button
              onClick={handleSearch}
              variant="default"
              size="sm"
              className="flex items-center space-x-1"
              disabled={loading}
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, patient ID, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                fetchIBPatients()
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile View */}
          <div className="block lg:hidden">
            <div className="space-y-4 p-4">
              {filteredPatients.map((patient) => (
                <Card key={patient.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {patient.first_name} {patient.last_name}
                            </p>
                            <p className="text-sm text-gray-600">{patient.patient_id}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-purple-600 border-purple-600">
                          IB
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Phone</p>
                          <p className="font-medium">{patient.mobile}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Gender</p>
                          <p className="font-medium capitalize">{patient.gender}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/telecaller/call-patient?patientId=${patient.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <PhoneCall className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/front-office/appointments/book?patientId=${patient.patient_id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                          >
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {patient.first_name} {patient.last_name}
                          </p>
                          <p className="text-sm text-gray-600">{patient.patient_id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {patient.mobile}
                      </div>
                    </TableCell>
                    <TableCell>{patient.email || 'N/A'}</TableCell>
                    <TableCell>
                      <span className="capitalize">{patient.gender}</span>
                    </TableCell>
                    <TableCell>
                      {patient.date_of_birth ? new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {new Date(patient.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/telecaller/call-patient?patientId=${patient.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                            title="Call Patient"
                          >
                            <PhoneCall className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/front-office/appointments/book?patientId=${patient.patient_id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-blue-600 border-blue-600 hover:bg-blue-50"
                            title="Book Appointment"
                          >
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPatients.length === 0 && !loading && (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No IB patients found</p>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
  )
}
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, User, Pill, ChevronDown, ChevronUp } from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { settingsApi } from "@/lib/settingsApi"

export default function PatientMedicinesPage() {
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [medicines, setMedicines] = useState<any[]>([])
  const [loadingSearch, setLoadingSearch] = useState(false)
  const [loadingMedicines, setLoadingMedicines] = useState(false)
  const [searched, setSearched] = useState(false)
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoadingSearch(true)
    setSearched(true)
    setSelectedPatient(null)
    setMedicines([])
    setExpandedRows(new Set())
    const results = await settingsApi.searchPatientsForMedicines(query)
    setSearchResults(results || [])
    setLoadingSearch(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  const selectPatient = async (patient: any) => {
    setSelectedPatient(patient)
    setExpandedRows(new Set())
    setLoadingMedicines(true)
    const data = await settingsApi.getPatientMedicines(patient.id)
    setMedicines(data || [])
    setLoadingMedicines(false)
  }

  const toggleRow = (id: number) => {
    const next = new Set(expandedRows)
    next.has(id) ? next.delete(id) : next.add(id)
    setExpandedRows(next)
  }

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString() : "-"

  // Group medicines by prescription id
  const grouped = medicines.reduce((acc: Record<number, any>, row: any) => {
    const pid = row.prescription_id
    if (!acc[pid]) {
      acc[pid] = {
        prescription_id: pid,
        medicine_days: row.medicine_days,
        next_appointment_date: row.next_appointment_date,
        notes_to_pharmacy: row.notes_to_pharmacy,
        notes_to_pro: row.notes_to_pro,
        created_at: row.created_at,
        items: [],
      }
    }
    if (row.medicine_id) {
      acc[pid].items.push({
        id: row.medicine_id,
        medicine_type: row.medicine_type,
        medicine: row.medicine,
        potency: row.potency,
        dosage: row.dosage,
        morning: row.morning,
        afternoon: row.afternoon,
        night: row.night,
        notes: row.medicine_notes,
      })
    }
    return acc
  }, {})

  const prescriptions = Object.values(grouped) as any[]

  return (
    <PrivateRoute modulePath="admin/patientmedicines" action="view">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Medicines</h1>
          <p className="text-gray-600">Search a patient to view their prescription medicines</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-4">
            <div className="flex gap-2 max-w-lg">
              <Input
                placeholder="Search by name, mobile or patient ID..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button onClick={handleSearch} disabled={loadingSearch}>
                <Search className="h-4 w-4 mr-2" />
                {loadingSearch ? "Searching..." : "Search"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searched && !loadingSearch && !selectedPatient && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Search Results
                <Badge variant="outline">{searchResults.length} found</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {searchResults.length === 0 ? (
                <div className="text-center py-6 text-gray-500">No patients found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((p) => (
                      <TableRow key={p.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-sm">{p.patient_id}</TableCell>
                        <TableCell className="font-medium">{p.first_name} {p.last_name}</TableCell>
                        <TableCell>{p.mobile}</TableCell>
                        <TableCell>
                          <Button size="sm" onClick={() => selectPatient(p)}>
                            View Medicines
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Selected patient info */}
        {selectedPatient && (
          <div className="flex items-center justify-between px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-semibold text-blue-900">{selectedPatient.first_name} {selectedPatient.last_name}</p>
                <p className="text-sm text-blue-700">{selectedPatient.patient_id} · {selectedPatient.mobile}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => { setSelectedPatient(null); setMedicines([]) }}>
              Back to Results
            </Button>
          </div>
        )}

        {/* Medicines Table */}
        {selectedPatient && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Prescription Medicines
                {!loadingMedicines && (
                  <Badge variant="outline">{prescriptions.length} prescription{prescriptions.length !== 1 ? "s" : ""}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingMedicines ? (
                <div className="text-center py-8 text-gray-500">Loading medicines...</div>
              ) : prescriptions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No prescriptions found for this patient</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-8"></TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Medicine Days</TableHead>
                        <TableHead>Next Appointment</TableHead>
                        <TableHead>Notes to Pharmacy</TableHead>
                        <TableHead>Notes to Pro</TableHead>
                        <TableHead>Medicines</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prescriptions.map((presc) => (
                        <>
                          <TableRow
                            key={presc.prescription_id}
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => toggleRow(presc.prescription_id)}
                          >
                            <TableCell>
                              {expandedRows.has(presc.prescription_id)
                                ? <ChevronUp className="h-4 w-4 text-gray-500" />
                                : <ChevronDown className="h-4 w-4 text-gray-500" />}
                            </TableCell>
                            <TableCell>{formatDate(presc.created_at)}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{presc.medicine_days ?? "-"} days</Badge>
                            </TableCell>
                            <TableCell>{formatDate(presc.next_appointment_date)}</TableCell>
                            <TableCell className="max-w-xs text-sm text-gray-700">
                              {presc.notes_to_pharmacy || <span className="text-gray-400">-</span>}
                            </TableCell>
                            <TableCell className="max-w-xs text-sm text-gray-700">
                              {presc.notes_to_pro || <span className="text-gray-400">-</span>}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-blue-100 text-blue-800">{presc.items.length} item{presc.items.length !== 1 ? "s" : ""}</Badge>
                            </TableCell>
                          </TableRow>

                          {expandedRows.has(presc.prescription_id) && (
                            <TableRow key={`${presc.prescription_id}-detail`}>
                              <TableCell colSpan={7} className="bg-gray-50 px-8 pb-4 pt-2">
                                {presc.items.length === 0 ? (
                                  <p className="text-sm text-gray-500">No medicine items</p>
                                ) : (
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
                                      {presc.items.map((item: any) => (
                                        <TableRow key={item.id}>
                                          <TableCell>{item.medicine_type || "-"}</TableCell>
                                          <TableCell className="font-medium">{item.medicine || "-"}</TableCell>
                                          <TableCell>{item.potency || "-"}</TableCell>
                                          <TableCell>{item.dosage || "-"}</TableCell>
                                          <TableCell>
                                            {[
                                              item.morning && "Morning",
                                              item.afternoon && "Afternoon",
                                              item.night && "Night",
                                            ].filter(Boolean).join(", ") || "-"}
                                          </TableCell>
                                          <TableCell>{item.notes || "-"}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                )}
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </PrivateRoute>
  )
}

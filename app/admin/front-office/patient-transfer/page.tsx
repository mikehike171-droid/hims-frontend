"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  RefreshCw,
  ArrowRight,
  UserCheck,
  Building2,
  AlertCircle,
  HelpCircle,
  MapPin,
  Phone,
  User,
  ArrowLeft,
  Calendar
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import authService from "@/lib/authService"
import { useBranch } from "@/contexts/branch-context"
import PrivateRoute from "@/components/auth/PrivateRoute"
import Link from "next/link"

export default function PatientTransferPage() {
  const { toast } = useToast()
  const { branches, currentBranch } = useBranch()

  // State variables
  const [sourceBranchId, setSourceBranchId] = useState<string>("")
  const [targetBranchId, setTargetBranchId] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [patients, setPatients] = useState<any[]>([])
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [transferring, setTransferring] = useState<boolean>(false)

  // Initialize source branch once current branch loads
  useEffect(() => {
    if (currentBranch) {
      setSourceBranchId(currentBranch.id)
    }
  }, [currentBranch])

  // Clear patient list when source branch changes
  useEffect(() => {
    setPatients([])
    setSelectedPatient(null)
  }, [sourceBranchId])

  // Search function to query patients under source location
  const handleSearch = async () => {
    if (!sourceBranchId) {
      toast({
        title: "Selection Required",
        description: "Please select a source branch first.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      setSelectedPatient(null)
      const token = authService.getCurrentToken()

      const params = new URLSearchParams()
      params.append("locationId", sourceBranchId)
      params.append("page", "1")
      params.append("limit", "50") // Fetch up to 50 matching patients for transfer selection
      if (searchTerm) {
        params.append("search", searchTerm)
      }

      const url = `${authService.getSettingsApiUrl()}/patients?${params}`

      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const result = await response.json()
        const data = result.data || result

        const formattedPatients = data.map((patient: any) => ({
          dbId: patient.patient_id, // The numeric auto-increment primary key ID in database
          patientId: patient.patient_patient_id, // The string patient ID (e.g. HYD001)
          name: `${patient.patient_first_name} ${patient.patient_last_name}`,
          mobile: patient.patient_mobile,
          gender: patient.patient_gender,
          locationId: patient.patient_location_id || sourceBranchId,
          locationName: patient.location_name || "",
          createdAt: patient.patient_created_at,
        }))

        setPatients(formattedPatients)
        if (formattedPatients.length === 0) {
          toast({
            title: "No Patients Found",
            description: "No patients matched your search criteria under this branch.",
          })
        }
      } else {
        throw new Error("Failed to fetch patients")
      }
    } catch (error) {
      console.error("Error searching patients:", error)
      toast({
        title: "Search Failed",
        description: "An error occurred while fetching patients.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle transfer submit
  const handleTransfer = async () => {
    if (!selectedPatient) {
      toast({
        title: "No Patient Selected",
        description: "Please select a patient to transfer.",
        variant: "destructive",
      })
      return
    }

    if (!targetBranchId) {
      toast({
        title: "No Target Location Selected",
        description: "Please select a destination branch for the transfer.",
        variant: "destructive",
      })
      return
    }

    if (sourceBranchId === targetBranchId) {
      toast({
        title: "Invalid Transfer",
        description: "Target branch must be different from source branch.",
        variant: "destructive",
      })
      return
    }

    try {
      setTransferring(true)
      const token = authService.getCurrentToken()

      const response = await fetch(`${authService.getSettingsApiUrl()}/patients/${selectedPatient.dbId}/transfer`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locationId: parseInt(targetBranchId),
        }),
      })

      if (response.ok) {
        const result = await response.json()
        const targetBranchName = branches.find(b => b.id === targetBranchId)?.name || targetBranchId

        toast({
          title: "Transfer Successful",
          description: `${selectedPatient.name} has been transferred to ${targetBranchName}.`,
        })

        // Reset state
        setSelectedPatient(null)
        setTargetBranchId("")
        // Refresh patient list
        handleSearch()
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to transfer patient")
      }
    } catch (error: any) {
      console.error("Error transferring patient:", error)
      toast({
        title: "Transfer Failed",
        description: error.message || "An error occurred during the transfer process.",
        variant: "destructive",
      })
    } finally {
      setTransferring(false)
    }
  }

  return (
    <PrivateRoute modulePath="admin/front-office" action="view">
      <div className="p-6 space-y-6">

        {/* Navigation & Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
          <div>

            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
              <RefreshCw className="h-8 w-8 text-rose-500 animate-spin-slow" />
              Patient Branch Transfer
            </h1>
            <p className="text-gray-500 mt-1">
              Safely update and reassign patient registration records between facility branches.
            </p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Search Section */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="shadow-md border-gray-200">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                  <Search className="h-5 w-5 text-indigo-600" />
                  Step 1: Find Patient
                </CardTitle>
                <CardDescription>
                  Select the source branch and search for the patient record to transfer.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">

                {/* Source Branch Selection */}
                <div className="space-y-2">
                  <Label htmlFor="source-branch" className="text-sm font-semibold text-gray-700">
                    Source Branch/Location
                  </Label>
                  <Select value={sourceBranchId} onValueChange={setSourceBranchId}>
                    <SelectTrigger id="source-branch" className="h-11">
                      <SelectValue placeholder="Select Source Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name} ({branch.locationCode})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Bar */}
                <div className="space-y-2">
                  <Label htmlFor="search-input" className="text-sm font-semibold text-gray-700">
                    Search Patient
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="search-input"
                        placeholder="Search by Patient ID, Name, or Mobile..."
                        className="pl-10 h-11 border-gray-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                    </div>
                    <Button
                      className="bg-indigo-600 hover:bg-indigo-700 h-11 px-6 text-white font-medium shadow-sm transition-colors"
                      onClick={handleSearch}
                      disabled={loading || !sourceBranchId}
                    >
                      {loading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        "Search"
                      )}
                    </Button>
                  </div>
                </div>

                {/* Patients Search Results Table */}
                <div className="border rounded-lg overflow-hidden mt-6 bg-white">
                  <div className="max-h-[350px] overflow-y-auto">
                    <Table>
                      <TableHeader className="bg-gray-50 sticky top-0 z-10">
                        <TableRow>
                          <TableHead className="w-[120px] font-semibold text-gray-600">Patient ID</TableHead>
                          <TableHead className="font-semibold text-gray-600">Name</TableHead>
                          <TableHead className="font-semibold text-gray-600">Mobile</TableHead>
                          <TableHead className="w-[80px] font-semibold text-gray-600 text-center">Gender</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={4} className="h-32 text-center text-gray-500">
                              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-indigo-600" />
                              Loading matching patients...
                            </TableCell>
                          </TableRow>
                        ) : patients.length > 0 ? (
                          patients.map((patient) => {
                            const isSelected = selectedPatient?.dbId === patient.dbId
                            return (
                              <TableRow
                                key={patient.dbId}
                                className={`cursor-pointer transition-colors duration-150 ${isSelected
                                    ? "bg-rose-50/70 hover:bg-rose-50"
                                    : "hover:bg-gray-50/80"
                                  }`}
                                onClick={() => setSelectedPatient(patient)}
                              >
                                <TableCell className="font-medium text-gray-900">
                                  {patient.patientId}
                                </TableCell>
                                <TableCell className="font-medium text-gray-700">
                                  {patient.name}
                                </TableCell>
                                <TableCell className="text-gray-500">
                                  {patient.mobile || "N/A"}
                                </TableCell>
                                <TableCell className="text-center text-gray-600 capitalize">
                                  {patient.gender ? patient.gender.substring(0, 1) : "-"}
                                </TableCell>
                              </TableRow>
                            )
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="h-32 text-center text-gray-400">
                              <AlertCircle className="h-6 w-6 mx-auto mb-2 text-gray-300" />
                              Select source location and perform search
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Transfer Execution Details */}
          <div className="lg:col-span-5 space-y-6">

            {/* Selected Patient Details Card */}
            <Card className={`shadow-md transition-all duration-200 border-l-4 ${selectedPatient ? "border-l-rose-500 border-gray-200" : "border-l-gray-300 border-gray-200 opacity-80"
              }`}>
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50 pb-4">
                <CardTitle className="text-lg flex items-center gap-2 text-gray-800">
                  <UserCheck className="h-5 w-5 text-rose-500" />
                  Step 2: Confirm Transfer details
                </CardTitle>
                <CardDescription>
                  Details of the selected patient being reassigned.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">

                {selectedPatient ? (
                  <div className="space-y-6">
                    {/* Glassmorphism Profile Panel */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-rose-50/50 to-indigo-50/30 border border-gray-100 shadow-inner flex gap-4 items-start">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                        {selectedPatient.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{selectedPatient.name}</h3>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                          ID: {selectedPatient.patientId}
                        </div>
                      </div>
                    </div>

                    {/* Patient Information Rows */}
                    <div className="space-y-3.5 border-t border-b py-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 font-medium flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-gray-400" /> Current Location
                        </span>
                        <span className="font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                          {selectedPatient.locationName || branches.find(b => b.id === sourceBranchId)?.name || "Current"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 font-medium flex items-center gap-1.5">
                          <Phone className="h-4 w-4 text-gray-400" /> Mobile Number
                        </span>
                        <span className="font-medium text-gray-700">
                          {selectedPatient.mobile || "N/A"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 font-medium flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-gray-400" /> Registered Date
                        </span>
                        <span className="font-medium text-gray-700">
                          {selectedPatient.createdAt ? new Date(selectedPatient.createdAt).toLocaleDateString("en-IN") : "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Destination Branch Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="target-branch" className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <Building2 className="h-4 w-4 text-indigo-600" /> Target Branch / Location
                      </Label>
                      <Select value={targetBranchId} onValueChange={setTargetBranchId}>
                        <SelectTrigger id="target-branch" className="h-11">
                          <SelectValue placeholder="Select Destination Location" />
                        </SelectTrigger>
                        <SelectContent>
                          {branches
                            .filter(branch => branch.id !== sourceBranchId)
                            .map((branch) => (
                              <SelectItem key={branch.id} value={branch.id}>
                                {branch.name} ({branch.locationCode})
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        Patients location_id will be immediately modified. Ensure billing has no discrepancies.
                      </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                      onClick={handleTransfer}
                      disabled={transferring || !targetBranchId}
                      className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold h-12 rounded-lg mt-2 shadow-md transition-all flex items-center justify-center gap-2 group"
                    >
                      {transferring ? (
                        <RefreshCw className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          <span>Transfer Patient Location</span>
                          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>

                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
                    <User className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="font-medium">No Patient Selected</p>
                    <p className="text-xs text-gray-500 max-w-xs mt-1">
                      Search and click on a patient record from the list on the left to begin the transfer process.
                    </p>
                  </div>
                )}

              </CardContent>
            </Card>

            {/* Explanatory Help Card */}
            <Card className="border-dashed border-gray-300 shadow-none">
              <CardContent className="p-4 flex gap-3 items-start text-sm text-gray-600">
                <HelpCircle className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-gray-700">Transfer Guidelines</h4>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-gray-500">
                    <li>This action modifies the registry branch parameter (location_id).</li>
                    <li>Patient will appear in lists and queries exclusively under the target branch moving forward.</li>
                    <li>Ensure all active investigations, billing transactions, and appointments are completed or updated as required.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

          </div>

        </div>

      </div>
    </PrivateRoute>
  )
}

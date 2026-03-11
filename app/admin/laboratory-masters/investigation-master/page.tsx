"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Investigation {
  id: string
  code: string
  description: string
  method: string
  unit: string
  resultType: string
  defaultValue: string
  department: string
}

export default function InvestigationMasterPage() {
  const [investigations, setInvestigations] = useState<Investigation[]>([
    {
      id: "1",
      code: "BIO001",
      description: "SERUM AMYLASE",
      method: "",
      unit: "u/L",
      resultType: "One Line Text",
      defaultValue: "UP TO 110",
      department: "Biochemistry",
    },
    {
      id: "2",
      code: "BIO002",
      description: "SERUM CALCIUM",
      method: "OCPC",
      unit: "mg/dl",
      resultType: "Normal Value",
      defaultValue: "",
      department: "Biochemistry",
    },
    {
      id: "3",
      code: "BIO003",
      description: "SERUM LIPASE",
      method: "",
      unit: "u/L",
      resultType: "One Line Text",
      defaultValue: "up to 300",
      department: "Biochemistry",
    },
    {
      id: "4",
      code: "BIO004",
      description: "CRP(C-REACTIVE PROTEIN)",
      method: "",
      unit: "",
      resultType: "Normal Value",
      defaultValue: "",
      department: "Biochemistry",
    },
    {
      id: "5",
      code: "BIO005",
      description: "RANDOM BLOOD GLUCOSE",
      method: "GOD-POD METHOD",
      unit: "mg/dl",
      resultType: "Normal Value",
      defaultValue: "",
      department: "Biochemistry",
    },
    {
      id: "6",
      code: "BIO006",
      description: "POST LUNCH BLOOD GLUCOSE",
      method: "GOD-POD METHOD",
      unit: "mg/dl",
      resultType: "Normal Value",
      defaultValue: "",
      department: "Biochemistry",
    },
    {
      id: "7",
      code: "BIO007",
      description: "FASTING BLOOD GLUCOSE",
      method: "GOD-POD METHOD",
      unit: "mg/dl",
      resultType: "Normal Value",
      defaultValue: "",
      department: "Biochemistry",
    },
    {
      id: "8",
      code: "BIO008",
      description: "GLUCOSE TOLERANCE TEST FIRST HOUR",
      method: "GOD-POD METHOD",
      unit: "mg/dl",
      resultType: "Normal Value",
      defaultValue: "",
      department: "Biochemistry",
    },
    {
      id: "9",
      code: "BIO009",
      description: "GLUCOSE TOLERANCE TEST SECOND HOUR",
      method: "GOD-POD METHOD",
      unit: "mg/dl",
      resultType: "Normal Value",
      defaultValue: "",
      department: "Biochemistry",
    },
    {
      id: "10",
      code: "BIO010",
      description: "BLOOD UREA",
      method: "Urea(UV)",
      unit: "mg/dl",
      resultType: "Normal Value",
      defaultValue: "",
      department: "Biochemistry",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingInvestigation, setEditingInvestigation] = useState<Investigation | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    method: "",
    unit: "",
    resultType: "",
    department: "",
  })

  const filteredInvestigations = investigations.filter((investigation) => {
    const matchesSearch =
      investigation.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investigation.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = departmentFilter === "all" || investigation.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  const handleAdd = () => {
    setEditingInvestigation(null)
    setFormData({ code: "", description: "", method: "", unit: "", resultType: "", department: "" })
    setIsDialogOpen(true)
  }

  const handleEdit = (investigation: Investigation) => {
    setEditingInvestigation(investigation)
    setFormData({
      code: investigation.code,
      description: investigation.description,
      method: investigation.method,
      unit: investigation.unit,
      resultType: investigation.resultType,
      department: investigation.department,
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingInvestigation) {
      setInvestigations(investigations.map((i) => (i.id === editingInvestigation.id ? { ...i, ...formData } : i)))
    } else {
      const newInvestigation: Investigation = {
        id: Date.now().toString(),
        ...formData,
      }
      setInvestigations([...investigations, newInvestigation])
    }
    setIsDialogOpen(false)
  }

  const handleRowClick = (investigation: Investigation) => {
    handleEdit(investigation)
  }

  const handleNew = () => {
    setEditingInvestigation(null)
    setFormData({ code: "", description: "", method: "", unit: "", resultType: "", department: "" })
    setIsDialogOpen(true)
  }
  // const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const filtered = investigations.filter(
    (investigate) =>
      investigate.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    investigate.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedInvestigation = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="bg-white rounded-lg border border-gray-300 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Investigation Master</h1>
          <Button className="bg-black hover:bg-gray-800 text-white px-6" onClick={handleNew}>
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>

        <div className="mb-6 flex items-center gap-2">
          {/* <Label className="text-sm font-medium">SEARCH:</Label> */}
          <div className="relative flex-1">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search investigations..."
            />
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
     
      <div className="flex-1 bg-white rounded border border-gray-300 flex flex-col">
        <div className="flex-1">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 hover:bg-gray-100 border-b border-gray-300">
                <TableHead className="text-gray-900 font-bold border-r border-gray-300">INVESTIGATION CODE</TableHead>
                <TableHead className="text-gray-900 font-bold border-r border-gray-300">INVESTIGATION DESCRIPTION</TableHead>
                <TableHead className="text-gray-900 font-bold border-r border-gray-300">METHOD</TableHead>
                <TableHead className="text-gray-900 font-bold border-r border-gray-300">UNIT</TableHead>
                <TableHead className="text-gray-900 font-bold border-r border-gray-300">RESULT TYPE</TableHead>
                <TableHead className="text-gray-900 font-bold border-r border-gray-300">DEFAULT VALUE</TableHead>
                <TableHead className="text-gray-900 font-bold">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInvestigation.map((investigation) => (
                <TableRow
                  key={investigation.id}
                  className="cursor-pointer hover:bg-gray-50 border-b border-gray-200"
                  onClick={() => handleRowClick(investigation)}
                >
                  <TableCell className="font-medium border-r border-gray-200">{investigation.code}</TableCell>
                  <TableCell className="border-r border-gray-200">{investigation.description}</TableCell>
                  <TableCell className="border-r border-gray-200">{investigation.method}</TableCell>
                  <TableCell className="border-r border-gray-200">{investigation.unit}</TableCell>
                  <TableCell className="border-r border-gray-200">{investigation.resultType}</TableCell>
                  <TableCell className="border-r border-gray-200">{investigation.defaultValue}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRowClick(investigation)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle delete
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="border-t border-gray-300 px-4 py-2 text-sm text-gray-600 flex flex-col md:flex-row justify-between items-center gap-2">
          <div>
            Showing 1 to {paginatedInvestigation.length} of {investigations.length} entries
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {[...Array(Math.min(totalPages, 8))].map((_, i) => (
              <Button
                key={i + 1}
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? "bg-black text-white" : ""}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingInvestigation ? "Edit Investigation" : "New Investigation"}</DialogTitle>
            <DialogDescription>
              {editingInvestigation ? "Update investigation details below" : "Enter investigation details below"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Investigation Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="INV00285"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="method">Method</Label>
                <Select value={formData.method} onValueChange={(value) => setFormData({ ...formData, method: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GOD-POD METHOD">GOD-POD METHOD</SelectItem>
                    <SelectItem value="OCPC">OCPC</SelectItem>
                    <SelectItem value="Urea(UV)">Urea(UV)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mg/dl">mg/dl</SelectItem>
                    <SelectItem value="u/L">u/L</SelectItem>
                    <SelectItem value="mmol/L">mmol/L</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resultType">Result Type</Label>
                <Select
                  value={formData.resultType}
                  onValueChange={(value) => setFormData({ ...formData, resultType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select result type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal Value">Normal Value</SelectItem>
                    <SelectItem value="One Line Text">One Line Text</SelectItem>
                    <SelectItem value="Profile">Profile</SelectItem>
                    <SelectItem value="Pannel">Pannel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Biochemistry">Biochemistry</SelectItem>
                    <SelectItem value="Hematology">Hematology</SelectItem>
                    <SelectItem value="Microbiology">Microbiology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-black hover:bg-gray-800 text-white" onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Test {
  id: string
  code: string
  description: string
  status: "Active" | "Inactive"
  department: string
}

interface Template {
  id: string
  code: string
  description: string
  selected: boolean
}

export default function TestTemplateLinkPage() {
  const [tests, setTests] = useState<Test[]>([
    { id: "1", code: "MIC1111", description: "AMEBIC SEROLOGY", status: "Active", department: "microbiology" },
    { id: "2", code: "BIO1187", description: "ANTI GAD-65 ANTIBODY", status: "Active", department: "biochemistry" },
    {
      id: "3",
      code: "HEC1215",
      description: "Cronus annual health check package",
      status: "Active",
      department: "hematology",
    },
    { id: "4", code: "MIC691", description: "GENEXPERT", status: "Active", department: "microbiology" },
    { id: "5", code: "MIC1051", description: "HBeAg TITRES", status: "Active", department: "microbiology" },
    { id: "6", code: "MIC1050", description: "HBeAg TITRES", status: "Active", department: "microbiology" },
    { id: "7", code: "BIO1188", description: "HOMA IR", status: "Active", department: "biochemistry" },
    { id: "8", code: "BIO1186", description: "ISLET CELL ANTIBODY", status: "Active", department: "biochemistry" },
    { id: "9", code: "BIO1093", description: "Lead Levels", status: "Active", department: "biochemistry" },
    { id: "10", code: "MIC967", description: "MUMPS ANTIBODIES", status: "Active", department: "microbiology" },
  ])

  const [templates, setTemplates] = useState<Template[]>([
    { id: "1", code: "0000132", description: "CT SCAN ELBOW", selected: false },
    { id: "2", code: "0000173", description: "FLUID FOR CYTOLOGY", selected: false },
    { id: "3", code: "0000189", description: "25 Hydroxy Vitamin D", selected: false },
    { id: "4", code: "0000040", description: "2D ECHO", selected: false },
    { id: "5", code: "0000156", description: "2D ECHO DR.SESHGIRI RAO", selected: false },
    { id: "6", code: "0000161", description: "ACHD", selected: false },
    { id: "7", code: "0000194", description: "AMH", selected: false },
    { id: "8", code: "0000195", description: "APTT", selected: false },
    { id: "9", code: "0000172", description: "ASCITIC FLUID FOR CYTOLOGY", selected: false },
    { id: "10", code: "0000159", description: "ASD", selected: false },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTest, setSelectedTest] = useState<Test | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleTestSelect = (test: Test) => {
    setSelectedTest(test)
    setIsDialogOpen(true)
  }

  const handleTemplateToggle = (templateId: string) => {
    setTemplates(templates.map((t) => (t.id === templateId ? { ...t, selected: !t.selected } : t)))
  }

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredTests.length / itemsPerPage)

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Test To Template Link</h1>
          <Button className="bg-black hover:bg-gray-800 text-white px-6" onClick={() => setIsDialogOpen(true)}>
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
              placeholder="Search tests..."
            />
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 bg-white rounded border border-gray-300 flex flex-col">
          <div className="flex-1">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 hover:bg-gray-100 border-b border-gray-300">
                  <TableHead className="text-gray-900 font-bold border-r border-gray-300">Code</TableHead>
                  <TableHead className="text-gray-900 font-bold border-r border-gray-300">Description</TableHead>
                  <TableHead className="text-gray-900 font-bold border-r border-gray-300">Status</TableHead>
                  <TableHead className="text-gray-900 font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTests.map((test) => (
                  <TableRow
                    key={test.id}
                    className="cursor-pointer hover:bg-gray-50 border-b border-gray-200"
                    onClick={() => handleTestSelect(test)}
                  >
                    <TableCell className="font-medium border-r border-gray-200">{test.code}</TableCell>
                    <TableCell className="border-r border-gray-200">{test.description}</TableCell>
                    <TableCell className="border-r border-gray-200">
                      <span className="text-green-600">{test.status}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleTestSelect(test)
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
              Showing 1 to {filteredTests.length} of {filteredTests.length} entries
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

        {selectedTest && (
          <div className="border border-gray-300 rounded-lg overflow-hidden mt-6">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 border-b border-gray-300">
              <h2 className="font-semibold">Templates List</h2>
            </div>
            <div className="p-4">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 gap-2">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded border border-gray-200"
                    >
                      <Checkbox
                        id={template.id}
                        checked={template.selected}
                        onCheckedChange={() => handleTemplateToggle(template.id)}
                      />
                      <Label htmlFor={template.id} className="flex-1 cursor-pointer font-normal">
                        <span className="font-medium">{template.code}</span> - {template.description}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Test Details</DialogTitle>
              <DialogDescription>View and edit test details</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label>Code</Label>
                <Input value={selectedTest?.code || ""} readOnly className="mt-1" />
              </div>
              <div>
                <Label>Description</Label>
                <Input value={selectedTest?.description || ""} className="mt-1" />
              </div>
              <div>
                <Label>Status</Label>
                <RadioGroup value={selectedTest?.status || "Active"} className="flex gap-4 mt-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Active" id="active" />
                    <Label htmlFor="active" className="font-normal cursor-pointer">
                      Active
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Inactive" id="inactive" />
                    <Label htmlFor="inactive" className="font-normal cursor-pointer">
                      Inactive
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
              <Button className="bg-black hover:bg-gray-800 text-white">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
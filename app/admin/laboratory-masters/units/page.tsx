"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Edit, Search, Trash2 } from "lucide-react"

interface Unit {
  id: string
  code: string
  description: string
  status: "A" | "I"
}

export default function UnitsPage() {
  const [units] = useState<Unit[]>([
    { id: "1", code: "21", description: "(-ve)", status: "A" },
    { id: "2", code: "39", description: "micro g/ml", status: "A" },
    { id: "3", code: "071", description: "number/ul", status: "A" },
    { id: "4", code: "072", description: "GPL/ml", status: "A" },
    { id: "5", code: "073", description: "MPL/ml", status: "A" },
    { id: "6", code: "074", description: "U/g Hb", status: "A" },
    { id: "7", code: "077", description: "HIV", status: "A" },
    { id: "8", code: "078", description: "S/U UNITS", status: "A" },
    { id: "9", code: "079", description: "RFV", status: "A" },
    { id: "10", code: "080", description: "S/C UNITS", status: "A" },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    status: "Active" as "Active" | "Inactive",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null)

  const filteredUnits = units.filter(
    (unit) =>
      unit.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage)
  const paginatedUnits = filteredUnits.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleNew = () => {
    setEditingUnit(null)
    setFormData({ code: "", description: "", status: "Active" })
    setIsDialogOpen(true)
  }

  const handleRowClick = (unit: Unit) => {
    setEditingUnit(unit)
    setFormData({
      code: unit.code,
      description: unit.description,
      status: unit.status === "A" ? "Active" : "Inactive",
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    // Save logic would go here
    setIsDialogOpen(false)
  }

  return (
<div className="flex flex-col min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="bg-white rounded-lg border border-gray-300 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Units</h1>
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
              placeholder="Search units..."
            />
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

      <div className="flex-1 bg-white rounded border border-gray-300 flex flex-col">
        <div className="flex-1">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 hover:bg-gray-100 border-b border-gray-300">
                <TableHead className="text-gray-900 font-bold border-r border-gray-300">CODE</TableHead>
                <TableHead className="text-gray-900 font-bold border-r border-gray-300">DESCRIPTION</TableHead>
                <TableHead className="text-gray-900 font-bold border-r border-gray-300">STATUS</TableHead>
                <TableHead className="text-gray-900 font-bold">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUnits.map((unit) => (
                <TableRow
                  key={unit.id}
                  className="cursor-pointer hover:bg-gray-50 border-b border-gray-200"
                  onClick={() => handleRowClick(unit)}
                >
                  <TableCell className="font-medium border-r border-gray-200">{unit.code}</TableCell>
                  <TableCell className="border-r border-gray-200">{unit.description}</TableCell>
                  <TableCell className="border-r border-gray-200">{unit.status}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRowClick(unit)
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
            Showing 1 to {paginatedUnits.length} of {units.length} entries
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
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>UNIT DETAILS</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="code" className="text-sm font-medium mb-1 block">
                Code
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Enter code"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium mb-1 block">
                Description<span className="text-red-500">*</span>
              </Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Status</Label>
              <RadioGroup
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as "Active" | "Inactive" })}
                className="flex gap-6"
              >
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

            <div className="text-xs text-gray-600">
              <span className="text-red-500">*</span> - Mandatory Fields
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

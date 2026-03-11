"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Edit, Search, Trash2 } from "lucide-react"

interface Method {
  id: string
  code: string
  description: string
  status: "Active" | "Inactive"
}

export default function MethodsPage() {
  const [methods] = useState<Method[]>([
    { id: "1", code: "032", description: "Agarose Gel Electrophoresis", status: "Active" },
    { id: "2", code: "025", description: "Agglutination", status: "Active" },
    { id: "3", code: "017", description: "Agglutination Method", status: "Active" },
    { id: "4", code: "040", description: "Agglutinition", status: "Active" },
    { id: "5", code: "081", description: "Air Dried/Fixed Slides", status: "Active" },
    { id: "6", code: "047", description: "Anaerobic Culture", status: "Active" },
    { id: "7", code: "049", description: "Bactec Method", status: "Active" },
    { id: "8", code: "045", description: "BACTEC MGIT", status: "Active" },
    { id: "9", code: "093", description: "BCG Dye METHOD", status: "Active" },
    { id: "10", code: "037", description: "Biochemical", status: "Active" },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    status: "Active" as "Active" | "Inactive",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<Method | null>(null)

  const filteredMethods = methods.filter(
    (method) =>
      method.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      method.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleNew = () => {
    setEditingMethod(null)
    setFormData({ code: "", description: "", status: "Active" })
    setIsDialogOpen(true)
  }

  const handleRowClick = (method: Method) => {
    setEditingMethod(method)
    setFormData({
      code: method.code,
      description: method.description,
      status: method.status,
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    setIsDialogOpen(false)
  }
  const itemsPerPage = 10
  const filtered = methods.filter(
    (method) =>
      method.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      method.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const totalPages = Math.ceil(filteredMethods.length / itemsPerPage);
  const paginatedMethods = filteredMethods.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
<div className="flex flex-col min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="bg-white rounded-lg border border-gray-300 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Methods</h1>
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
              placeholder="Search methods..."
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
              {filteredMethods.map((method) => (
                <TableRow
                  key={method.id}
                  className="cursor-pointer hover:bg-gray-50 border-b border-gray-200"
                  onClick={() => handleRowClick(method)}
                >
                  <TableCell className="font-medium border-r border-gray-200">{method.code}</TableCell>
                  <TableCell className="border-r border-gray-200">{method.description}</TableCell>
                  <TableCell className="border-r border-gray-200">{method.status}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRowClick(method)
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

        {/* <div className="border-t border-gray-300 px-4 py-2 text-sm text-gray-600 flex justify-center items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          {[1, 2, 3, 4, 5].map((page) => (
            <Button
              key={page}
              variant="outline"
              size="sm"
              className={currentPage === page ? "bg-black text-white" : ""}
            >
              {page}
            </Button>
          ))}
          <Button variant="outline" size="sm">
            Next
          </Button>
          <span className="text-xs">(out of 6)</span>
        </div> */}
           <div className="border-t border-gray-300 px-4 py-2 text-sm text-gray-600 flex flex-col md:flex-row justify-between items-center gap-2">
          <div>
            Showing 1 to {paginatedMethods.length} of {methods.length} entries
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
            <DialogTitle>METHOD DETAILS</DialogTitle>
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

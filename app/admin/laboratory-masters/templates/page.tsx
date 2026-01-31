"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import dynamic from "next/dynamic"
import { useMemo } from "react"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Template {
  id: string
  code: string
  description: string
  status: "Active" | "Inactive"
  department: string
}

export default function TemplatesPage() {
  const [templates] = useState<Template[]>([
    { id: "1", code: "0000132", description: "CT SCAN ELBOW", status: "Active", department: "Radiology" },
    { id: "2", code: "0000173", description: "FLUID FOR CYTOLOGY", status: "Active", department: "Pathology" },
    { id: "3", code: "0000189", description: "25 Hydroxy Vitamin D", status: "Active", department: "Biochemistry" },
    { id: "4", code: "0000040", description: "2D ECHO", status: "Active", department: "Cardiology" },
    { id: "5", code: "0000156", description: "2D ECHO DR.SESHGIRI RAO", status: "Active", department: "Cardiology" },
    { id: "6", code: "0000161", description: "ACHD", status: "Active", department: "Cardiology" },
    { id: "7", code: "0000194", description: "AMH", status: "Active", department: "Biochemistry" },
    { id: "8", code: "0000195", description: "APTT", status: "Active", department: "Hematology" },
    { id: "9", code: "0000172", description: "ASCITIC FLUID FOR CYTOLOGY", status: "Active", department: "Pathology" },
    { id: "10", code: "0000159", description: "ASD", status: "Active", department: "Cardiology" },
  ])

  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    status: "Active" as "Active" | "Inactive",
    department: "",
    content: "",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)

  const filteredTemplates = templates.filter((template) => {
    const matchesDepartment = departmentFilter === "all" || template.department === departmentFilter
    return matchesDepartment
  })

  const handleNew = () => {
    setEditingTemplate(null)
    setFormData({
      code: "",
      name: "",
      status: "Active",
      department: "",
      content: "",
    })
    setIsDialogOpen(true)
  }

  const handleEdit = (template: Template) => {
    setEditingTemplate(template)
    setFormData({
      code: template.code,
      name: template.description,
      status: template.status,
      department: template.department,
      content: "",
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    // Save logic here
    setIsDialogOpen(false)
  }
  const [searchTerm, setSearchTerm] = useState("")
  const itemsPerPage = 10
  const filtered = templates.filter(
    (template) =>
      template.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="bg-white rounded-lg border border-gray-300 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Templates</h1>
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
              placeholder="Search templates..."
            />
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Templates Table */}
        <div className="flex-1 flex flex-col">


        <div className="flex-1 bg-white rounded border border-gray-300 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto">
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
                {filteredTemplates.map((template) => (
                  <TableRow
                    key={template.id}
                    className="cursor-pointer hover:bg-gray-50 border-b border-gray-200"
                    onClick={() => handleEdit(template)}
                  >
                    <TableCell className="font-medium border-r border-gray-200">{template.code}</TableCell>
                    <TableCell className="border-r border-gray-200">{template.description}</TableCell>
                    <TableCell className="border-r border-gray-200">{template.status}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit(template)
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

          {/* <div className="border-t border-gray-300 px-4 py-2 text-sm text-gray-600 flex flex-col md:flex-row justify-center items-center gap-2">
            <span className="text-xs">Records: 1 - 10 of 81 - Pages:</span>
            <div className="flex gap-2 flex-wrap">
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
              <span className="text-xs">(out of 9)</span>
            </div>
          </div> */}
          <div className="border-t border-gray-300 px-4 py-2 text-sm text-gray-600 flex flex-col md:flex-row justify-between items-center gap-2">
            <div>
              Showing 1 to {paginatedTemplates.length} of {templates.length} entries
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
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? "Edit Template" : "New Template"}</DialogTitle>
            <DialogDescription>
              {editingTemplate ? "Update template details below" : "Enter template details below"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="name" className="text-sm font-medium mb-1 block">
                  Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <Label htmlFor="department" className="text-sm font-medium mb-1 block">
                  Department<span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="--SELECT--" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Radiology">Radiology</SelectItem>
                    <SelectItem value="Pathology">Pathology</SelectItem>
                    <SelectItem value="Biochemistry">Biochemistry</SelectItem>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Hematology">Hematology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="content" className="text-sm font-medium mb-1 block">
                Content
              </Label>
              <div className="border border-gray-300 rounded-md">
                <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1">
                  <button
                    type="button"
                    className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
                    onClick={() => document.execCommand('bold', false, null)}
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
                    onClick={() => document.execCommand('italic', false, null)}
                  >
                    <em>I</em>
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
                    onClick={() => document.execCommand('underline', false, null)}
                  >
                    <u>U</u>
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
                    onClick={() => document.execCommand('strikeThrough', false, null)}
                  >
                    <s>S</s>
                  </button>
                  <select
                    className="px-2 py-1 text-sm border rounded"
                    onChange={(e) => {
                      if (e.target.value) {
                        document.execCommand('foreColor', false, e.target.value)
                        e.target.value = ''
                      }
                    }}
                  >
                    <option value="">Text Color</option>
                    <option value="black">Black</option>
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="purple">Purple</option>
                    <option value="orange">Orange</option>
                    <option value="brown">Brown</option>
                  </select>
                  <select
                    className="px-2 py-1 text-sm border rounded"
                    onChange={(e) => {
                      if (e.target.value) {
                        document.execCommand('backColor', false, e.target.value)
                        e.target.value = ''
                      }
                    }}
                  >
                    <option value="">Highlight</option>
                    <option value="yellow">Yellow</option>
                    <option value="lightblue">Light Blue</option>
                    <option value="lightgreen">Light Green</option>
                    <option value="pink">Pink</option>
                    <option value="lightgray">Light Gray</option>
                  </select>
                  <select
                    className="px-2 py-1 text-sm border rounded"
                    onChange={(e) => {
                      if (e.target.value) {
                        document.execCommand('fontSize', false, e.target.value)
                        e.target.value = ''
                      }
                    }}
                  >
                    <option value="">Font Size</option>
                    <option value="1">Small</option>
                    <option value="3">Normal</option>
                    <option value="5">Large</option>
                    <option value="7">Extra Large</option>
                  </select>
                  <button
                    type="button"
                    className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
                    onClick={() => document.execCommand('justifyLeft', false, null)}
                  >
                    Left
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
                    onClick={() => document.execCommand('justifyCenter', false, null)}
                  >
                    Center
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
                    onClick={() => document.execCommand('justifyRight', false, null)}
                  >
                    Right
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
                    onClick={() => document.execCommand('insertUnorderedList', false, null)}
                  >
                    • List
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
                    onClick={() => document.execCommand('insertOrderedList', false, null)}
                  >
                    1. List
                  </button>
                  <button
                    type="button"
                    className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
                    onClick={() => document.execCommand('removeFormat', false, null)}
                  >
                    Clear
                  </button>
                </div>
                <div
                  contentEditable
                  className="min-h-[250px] p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ minHeight: '250px' }}
                  onInput={(e) => {
                    const target = e.target as HTMLDivElement
                    setFormData({ ...formData, content: target.innerHTML })
                  }}
                  dangerouslySetInnerHTML={{ __html: formData.content }}
                  placeholder="Enter template content..."
                />
              </div>
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

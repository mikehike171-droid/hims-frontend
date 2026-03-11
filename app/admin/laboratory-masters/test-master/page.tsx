"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2 } from "lucide-react"

interface Test {
  id: string
  code: string
  description: string
  status: "Active" | "Inactive"
}

export default function TestMasterPage() {
  const router = useRouter()
  const [tests, setTests] = useState<Test[]>([
    { id: "1", code: "SR0001", description: "COMPLETE STOOL EXAMINATION", status: "Active" },
    { id: "2", code: "SR0002", description: "PUS CULTURE AND SENSITIVITY", status: "Active" },
    { id: "3", code: "SR0003", description: "BLOOD CULTURE AND SENSITIVITY", status: "Active" },
    { id: "4", code: "SR0004", description: "URINE CULTURE AND SENSITIVITY", status: "Active" },
    { id: "5", code: "SR0005", description: "STOOL CULTURE AND SENSITIVITY", status: "Active" },
    { id: "6", code: "SR0006", description: "VAGINAL SWAB CULTURE AND SENSITIVITY", status: "Active" },
    { id: "7", code: "SR0007", description: "SPUTUM CULTURE AND SENSITIVITY", status: "Active" },
    { id: "8", code: "SR0008", description: "TISSUE CULTURE AND SENITIVITY", status: "Active" },
    { id: "9", code: "SR0009", description: "OTHERS CULTURE AND SENITIVITY", status: "Active" },
    { id: "10", code: "SR0010", description: "SWAB CULTURE", status: "Active" },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTest, setEditingTest] = useState<Test | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    department: "",
    subDepartment: "",
    labType: "",
    specimen: "",
    method: "",
    container: "",
    reportType: "",
    interpretation: "No" as "Yes" | "No",
    status: "Active" as "Active" | "Inactive",
    testType: "Profile" as "Profile" | "Pannel" | "Normal",
    serviceApplicable: {
      male: false,
      female: false,
      both: true,
    },
    signatureRequired: false,
    resultRestricted: false,
  })

  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleAdd = () => {
    router.push('/admin/laboratory-masters/test-master/new')
  }

  const handleEdit = (test: Test) => {
    router.push(`/admin/laboratory-masters/test-master/edit/${test.id}`)
  }

  const handleSave = () => {
    if (editingTest) {
      setTests(
        tests.map((t) =>
          t.id === editingTest.id
            ? { ...t, code: formData.code, description: formData.name, status: formData.status }
            : t,
        ),
      )
    } else {
      const newTest: Test = {
        id: Date.now().toString(),
        code: formData.code,
        description: formData.name,
        status: formData.status,
      }
      setTests([...tests, newTest])
    }
    setIsDialogOpen(false)
  }
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredTests.length / itemsPerPage)
  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  return (
<div className="flex flex-col min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="bg-white rounded-lg border border-gray-300 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Test Master</h1>
          <Button className="bg-black hover:bg-gray-800 text-white px-6" onClick={handleAdd}>
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
                <TableHead className="text-gray-900 font-bold border-r border-gray-300">CODE</TableHead>
                <TableHead className="text-gray-900 font-bold border-r border-gray-300">TEST NAME</TableHead>
                <TableHead className="text-gray-900 font-bold border-r border-gray-300">STATUS</TableHead>
                <TableHead className="text-gray-900 font-bold">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTests.map((test) => (
                <TableRow key={test.id} className="cursor-pointer hover:bg-gray-50 border-b border-gray-200">
                  <TableCell className="font-medium border-r border-gray-200">{test.code}</TableCell>
                  <TableCell className="border-r border-gray-200">{test.description}</TableCell>
                  <TableCell className="border-r border-gray-200">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        test.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {test.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(test)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle delete
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
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
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTests.length)} of {filteredTests.length} entries
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
  )
}

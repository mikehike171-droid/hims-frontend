"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"

export default function EditTestPage() {
  const router = useRouter()
  const params = useParams()
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
  })

  useEffect(() => {
    setFormData({
      code: "SR0001",
      name: "COMPLETE STOOL EXAMINATION",
      department: "biochemistry",
      subDepartment: "clinical",
      labType: "LABORATORY",
      specimen: "blood",
      method: "manual",
      container: "tube",
      reportType: "standard",
      interpretation: "No",
      status: "Active",
      testType: "Profile",
      serviceApplicable: { male: false, female: false, both: true },
    })
  }, [params.id])

  const handleSave = () => {
    router.back()
  }

  return (
    // <div className="h-screen bg-gray-100 flex flex-col">
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-white p-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Edit Test</h1>
        </div>
      </div>

      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-4xl mx-auto">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-sm font-medium">
                  Test Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Enter test code"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Test Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter test name"
                  className="bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department" className="text-sm font-medium">
                  Lab Department <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="biochemistry">Biochemistry</SelectItem>
                    <SelectItem value="hematology">Hematology</SelectItem>
                    <SelectItem value="microbiology">Microbiology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="subDepartment" className="text-sm font-medium">
                  Lab Sub Department
                </Label>
                <Select
                  value={formData.subDepartment}
                  onValueChange={(value) => setFormData({ ...formData, subDepartment: value })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select sub department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clinical">Clinical</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="labType" className="text-sm font-medium">
                  Lab Type
                </Label>
                <Select
                  value={formData.labType}
                  onValueChange={(value) => setFormData({ ...formData, labType: value })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select lab type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LABORATORY">LABORATORY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specimen" className="text-sm font-medium">
                  Specimen
                </Label>
                <Select
                  value={formData.specimen}
                  onValueChange={(value) => setFormData({ ...formData, specimen: value })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select specimen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blood">Blood</SelectItem>
                    <SelectItem value="urine">Urine</SelectItem>
                    <SelectItem value="serum">Serum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="method" className="text-sm font-medium">
                  Method
                </Label>
                <Select
                  value={formData.method}
                  onValueChange={(value) => setFormData({ ...formData, method: value })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="automated">Automated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="container" className="text-sm font-medium">
                  Container
                </Label>
                <Select
                  value={formData.container}
                  onValueChange={(value) => setFormData({ ...formData, container: value })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select container" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tube">Tube</SelectItem>
                    <SelectItem value="bottle">Bottle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reportType" className="text-sm font-medium">
                  Report Type
                </Label>
                <Select
                  value={formData.reportType}
                  onValueChange={(value) => setFormData({ ...formData, reportType: value })}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  InterPretation
                </Label>
                <RadioGroup
                  value={formData.interpretation}
                  onValueChange={(value) => setFormData({ ...formData, interpretation: value as "Yes" | "No" })}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="no" />
                    <Label htmlFor="no" className="font-normal cursor-pointer">
                      No
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="yes" />
                    <Label htmlFor="yes" className="font-normal cursor-pointer">
                      Yes
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <RadioGroup
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as "Active" | "Inactive" })}
                  className="flex gap-4 mt-2"
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
                      InActive
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Test Type</Label>
                <RadioGroup
                  value={formData.testType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, testType: value as "Profile" | "Pannel" | "Normal" })
                  }
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Profile" id="profile" />
                    <Label htmlFor="profile" className="font-normal cursor-pointer">
                      Profile
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Pannel" id="pannel" />
                    <Label htmlFor="pannel" className="font-normal cursor-pointer">
                      Pannel
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Normal" id="normal" />
                    <Label htmlFor="normal" className="font-normal cursor-pointer">
                      Normal
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Service Applicable For</Label>
              <div className="flex gap-6 mt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="male"
                    checked={formData.serviceApplicable.male}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        serviceApplicable: { ...formData.serviceApplicable, male: e.target.checked },
                      })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="male" className="font-normal cursor-pointer">
                    Male
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="female"
                    checked={formData.serviceApplicable.female}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        serviceApplicable: { ...formData.serviceApplicable, female: e.target.checked },
                      })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="female" className="font-normal cursor-pointer">
                    Female
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="both"
                    checked={formData.serviceApplicable.both}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        serviceApplicable: { ...formData.serviceApplicable, both: e.target.checked },
                      })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="both" className="font-normal cursor-pointer">
                    Both
                  </Label>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-600 mt-4">
              <span className="text-red-500">*</span> - Mandatory Fields
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t border-gray-200 mt-6">
            <Button className="bg-black hover:bg-gray-800" onClick={handleSave}>
              Save
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, ArrowUp, ArrowDown, Plus, Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Profile {
  id: string
  code: string
  description: string
  status: "Active" | "Inactive"
}

interface Test {
  id: string
  code: string
  name: string
}

export default function ProfileTestLinkPage() {
  const [profiles, setProfiles] = useState<Profile[]>([
    { id: "1", code: "SR0335", description: "ANTENATAL PROFILE", status: "Active" },
    { id: "2", code: "SR0337", description: "DENGUE PROFILE", status: "Active" },
    { id: "3", code: "BIO479", description: "ANTINATAL PROFILE", status: "Active" },
    { id: "4", code: "MIC696", description: "FLUID CULTURE AND SENSITIVITY", status: "Active" },
    { id: "5", code: "MIC663", description: "NEEDLE STICK INJURY PROFILE", status: "Active" },
    { id: "6", code: "MIC940", description: "COVID PROFILE", status: "Active" },
  ])

  const [searchTerm, setSearchTerm] = useState("")

  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [linkedTests, setLinkedTests] = useState<Test[]>([])

  const filteredProfiles = profiles.filter((profile) => {
    const matchesSearch =
      profile.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleProfileSelect = (profile: Profile) => {
    setSelectedProfile(profile)
    setIsDialogOpen(true)
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const filtered = profiles.filter(
    (profile) =>
      profile.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedProfiles = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Profile To Test Link</h1>
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
              placeholder="Search profiles..."
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
              {paginatedProfiles.map((profile) => (
                <TableRow
                  key={profile.id}
                  className="cursor-pointer hover:bg-gray-50 border-b border-gray-200"
                  onClick={() => handleProfileSelect(profile)}
                >
                  <TableCell className="font-medium border-r border-gray-200">{profile.code}</TableCell>
                  <TableCell className="border-r border-gray-200">{profile.description}</TableCell>
                  <TableCell className="border-r border-gray-200">
                    <span className="text-green-600">{profile.status}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleProfileSelect(profile)
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
            Showing 1 to {paginatedProfiles.length} of {profiles.length} entries
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

      {/* Linked Tests */}
      {/* {selectedProfile && ( */}
        {/* <div className="border border-gray-300 rounded-lg">
          <div className="bg-gray-100 text-gray-900 px-4 py-2 border-b border-gray-300">
            <h2 className="font-semibold">Linked Tests</h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="font-semibold">TEST CODE</Label>
                <Input placeholder="Enter test code" className="mt-1" />
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Label className="font-semibold">TEST NAME</Label>
                  <Input placeholder="Enter test name" className="mt-1" />
                </div>
                <Button size="sm" variant="outline" className="h-10 w-10 p-0 bg-transparent">
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" className="h-10 w-10 p-0 bg-transparent">
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {linkedTests.length === 0 ? (
              <div className="text-center text-gray-500 py-8 border border-gray-200 rounded">
                No tests linked to this profile
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100 hover:bg-gray-100">
                      <TableHead className="text-gray-900 font-medium">TEST CODE</TableHead>
                      <TableHead className="text-gray-900 font-medium">TEST NAME</TableHead>
                      <TableHead className="text-gray-900 font-medium w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {linkedTests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell className="font-medium">{test.code}</TableCell>
                        <TableCell>{test.name}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" className="h-8 bg-transparent">
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div> */}
      {/* )} */}



      {/* Dialog for profile details */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Profile Details</DialogTitle>
            <DialogDescription>View and edit profile details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Code</Label>
              <Input value={selectedProfile?.code || ""} readOnly className="mt-1" />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={selectedProfile?.description || ""} className="mt-1" />
            </div>
            <div>
              <Label>Status</Label>
              <RadioGroup value={selectedProfile?.status || "Active"} className="flex gap-4 mt-1">
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
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { 
  FileText, 
  Save, 
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Type,
  Image,
  Code
} from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function ClinicalNotesPage() {
  return (
    <PrivateRoute modulePath="admin/doctors" action="view">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Clinical Notes
          </h1>
          <Button size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>

        <div className="border rounded-lg p-6 space-y-4">
          {/* Complaints & Observation */}
          <div className="flex items-center gap-4">
            <label className="w-24 text-sm font-medium">Complaints</label>
            <Textarea className="flex-1" />
            <label className="w-24 text-sm font-medium">Observation</label>
            <Textarea className="flex-1" />
          </div>

          {/* Investigations & Diagnosis */}
          <div className="flex items-center gap-4">
            <label className="w-24 text-sm font-medium">Investigations</label>
            <Textarea className="flex-1" />
            <label className="w-24 text-sm font-medium">Diagnosis</label>
            <Textarea className="flex-1" />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <div className="flex items-center gap-1 p-2 border rounded-md bg-gray-50">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Code className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Type className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Strikethrough className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Image className="h-4 w-4" />
              </Button>
            </div>
            <Textarea className="min-h-40" />
          </div>

          {/* Treatment Plan */}
          <div className="flex items-center gap-4">
            <label className="w-32 text-sm font-medium">Treatment Plan</label>
            <Input className="flex-1" />
          </div>
        </div>
      </div>
    </PrivateRoute>
  )
}
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Briefcase } from "lucide-react"
import { settingsApi } from "@/lib/settingsApi"
import { toast } from "@/components/ui/use-toast"
import PrivateRoute from "@/components/auth/PrivateRoute"
import RichTextEditor from "@/components/ui/RichTextEditor"

export default function AddJobPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    type: "Full-time",
    description: "",
    requirements: "",
    is_active: true
  })

  const handleSave = async () => {
    if (!formData.title || !formData.location || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (Title, Location, Description)",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      await settingsApi.createJob(formData)
      toast({
        title: "Success",
        description: "Job posting created successfully",
      })
      router.push('/admin/website/jobs')
    } catch (error) {
      console.error('Error creating job:', error)
      toast({
        title: "Error",
        description: "Failed to create job posting",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PrivateRoute modulePath="admin/website" action="view">
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Add New Job Posting</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <span>Job Vacancy Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  placeholder="e.g. Senior Homeopathy Consultant"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                <Input
                  id="location"
                  placeholder="e.g. Hyderabad, Telangana"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type">Employment Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(val) => setFormData({ ...formData, type: val })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="is_active" className="block">Status</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active" className="font-bold uppercase text-[10px] tracking-widest text-slate-500">
                    Visible on Website ({formData.is_active ? 'Active' : 'Inactive'})
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="description" className="text-sm font-bold text-slate-700">Job Description <span className="text-red-500">*</span></Label>
              <RichTextEditor
                value={formData.description}
                onChange={(val) => setFormData({ ...formData, description: val })}
                placeholder="Detail the roles and responsibilities..."
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="requirements" className="text-sm font-bold text-slate-700">Requirements & Qualifications</Label>
              <RichTextEditor
                value={formData.requirements}
                onChange={(val) => setFormData({ ...formData, requirements: val })}
                placeholder="Detail the educational background and experience needed..."
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 bg-slate-50/50 p-6">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={handleSave} disabled={loading} className="bg-primary">
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Creating..." : "Save Job Posting"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PrivateRoute>
  )
}

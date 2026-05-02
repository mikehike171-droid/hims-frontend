"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  ArrowLeft, 
  Save, 
  Activity, 
  ImagePlus, 
  X, 
  Plus, 
  Trash2, 
  Type, 
  List,
  HelpCircle,
  AlertTriangle
} from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import RichTextEditor from "@/components/ui/RichTextEditor"
import { settingsApi } from "@/lib/settingsApi"
import { toast } from "@/components/ui/use-toast"
import authService from "@/lib/authService"
import { usePermissions, hasPermission } from '@/contexts/permissions-context'

export default function AddTreatmentPage() {
  const router = useRouter()
  const permissions = usePermissions()
  const [loading, setLoading] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  
  // Use separate states for main fields to prevent accidental overwrites
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [longDescription, setLongDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [status, setStatus] = useState("active")
  
  const [sections, setSections] = useState<any[]>([])
  const [faqs, setFaqs] = useState<any[]>([])

  // Manual Auth check to avoid PrivateRoute re-mounting issues
  useEffect(() => {
    const token = authService.getCurrentToken()
    if (!token) {
      router.push('/admin/login')
    } else {
      setAuthChecked(true)
    }
  }, [router])

  // --- Sections Management ---
  const addSection = () => {
    setSections(prev => [...prev, { title: "", type: "text", content: "" }])
  }

  const removeSection = (index: number) => {
    setSections(prev => prev.filter((_, i) => i !== index))
  }

  const updateSection = (index: number, field: string, value: string) => {
    setSections(prev => {
      const newSections = [...prev]
      newSections[index] = { ...newSections[index], [field]: value }
      return newSections
    })
  }

  // --- FAQs Management ---
  const addFaq = () => {
    setFaqs(prev => [...prev, { question: "", answer: "" }])
  }

  const removeFaq = (index: number) => {
    setFaqs(prev => prev.filter((_, i) => i !== index))
  }

  const updateFaq = (index: number, field: string, value: string) => {
    setFaqs(prev => {
      const newFaqs = [...prev]
      newFaqs[index] = { ...newFaqs[index], [field]: value }
      return newFaqs
    })
  }

  const handleSave = async () => {
    if (!name) {
      toast({
        title: "Error",
        description: "Treatment name is required",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      const payload = {
        name,
        category,
        short_description: shortDescription,
        long_description: longDescription,
        image_url: imageUrl,
        sections,
        faqs,
        status
      }
      
      await settingsApi.createTreatment(payload)
      toast({
        title: "Success",
        description: "Treatment created successfully",
      })
      router.push('/admin/website/treatments')
    } catch (error) {
      console.error('Error creating treatment:', error)
      toast({
        title: "Error",
        description: "Failed to create treatment",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const result = await settingsApi.uploadTreatmentImage(file);
      setImageUrl(result.imageUrl);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked) return null

  // Check permissions manually
  const user = authService.getCurrentUser()
  const isAdmin = user && (user.role === 'Admin' || user.role === 'Super Admin' || user.username === 'admin')
  if (!isAdmin && permissions && !hasPermission(permissions, 'admin/settings', 'add')) {
    return (
      <div className="p-20 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-gray-500 mt-2">You do not have permission to add treatments.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Add New Treatment</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <span>General Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Treatment Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    placeholder="e.g. Adenomyosis"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g. Women's Health"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="short_desc">Description (Summary)</Label>
                <Textarea
                  id="short_desc"
                  placeholder="Short summary for cards..."
                  className="h-20"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="long_desc">Main Clinical Overview (Rich Text)</Label>
                <RichTextEditor 
                  value={longDescription}
                  onChange={setLongDescription}
                  placeholder="Enter detailed clinical overview..."
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="inline-flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                <span>Content Sections</span>
              </CardTitle>
              <Button onClick={addSection} variant="outline" size="sm" className="bg-primary/5 border-primary/20 text-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {sections.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-xl text-slate-400">
                  No custom sections added.
                </div>
              )}
              {sections.map((section: any, index: number) => (
                <div key={index} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 space-y-4 relative group">
                  <button 
                    onClick={() => removeSection(index)}
                    className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Section Title</Label>
                      <Input 
                        placeholder="e.g. Primary Symptoms" 
                        value={section.title}
                        onChange={(e) => updateSection(index, 'title', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Layout Type</Label>
                      <Select 
                        value={section.type} 
                        onValueChange={(val) => updateSection(index, 'type', val)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">
                            <div className="flex items-center gap-2">
                              <Type size={14} /> Text Block
                            </div>
                          </SelectItem>
                          <SelectItem value="list">
                            <div className="flex items-center gap-2">
                              <List size={14} /> Grid Cards (Comma separated)
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>
                      {section.type === 'list' ? 'List Content (Separate with commas)' : 'Text Content'}
                    </Label>
                    {section.type === 'text' ? (
                      <RichTextEditor 
                        value={section.content}
                        onChange={(val) => updateSection(index, 'content', val)}
                        placeholder="Enter section details..."
                      />
                    ) : (
                      <Textarea 
                        placeholder="Fever, Pain, Bloating..."
                        className="h-24"
                        value={section.content}
                        onChange={(e) => updateSection(index, 'content', e.target.value)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="inline-flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                <span>Patient FAQs</span>
              </CardTitle>
              <Button onClick={addFaq} variant="outline" size="sm" className="bg-primary/5 border-primary/20 text-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add FAQ
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqs.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-xl text-slate-400">
                  No FAQs added.
                </div>
              )}
              {faqs.map((faq: any, index: number) => (
                <div key={index} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30 space-y-3 relative group">
                  <button 
                    onClick={() => removeFaq(index)}
                    className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="space-y-2">
                    <Label>Question</Label>
                    <Input 
                      placeholder="e.g. Is this treatment permanent?" 
                      value={faq.question}
                      onChange={(e) => updateFaq(index, 'question', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Answer</Label>
                    <Textarea 
                      placeholder="Provide answer..." 
                      className="h-20"
                      value={faq.answer}
                      onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Featured Image</Label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl overflow-hidden bg-slate-50 group hover:border-primary/40 transition-all">
                  {imageUrl ? (
                    <div className="relative aspect-square">
                      <img 
                        src={authService.getFileUrl(imageUrl)} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button 
                        onClick={() => setImageUrl("")}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center p-10 cursor-pointer">
                      <ImagePlus size={32} className="text-slate-400 group-hover:text-primary transition-colors" />
                      <span className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-widest">Upload Image</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
              </div>

              <hr className="border-slate-100" />

              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                <Label className="text-[10px] font-black uppercase tracking-widest">Active Status</Label>
                <Switch
                  checked={status === 'active'}
                  onCheckedChange={(checked) => setStatus(checked ? 'active' : 'inactive')}
                />
              </div>

              <Button onClick={handleSave} disabled={loading} className="w-full bg-primary h-12 text-[12px] font-black tracking-[0.1em] uppercase">
                {loading ? "..." : <><Save className="h-4 w-4 mr-2" /> Save Treatment</>}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Layers(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.1 6.27a2 2 0 0 0 0 3.45l9.07 4.09a2 2 0 0 0 1.66 0l9.07-4.09a2 2 0 0 0 0-3.45z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </svg>
  )
}

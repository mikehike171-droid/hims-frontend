"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  ArrowLeft, 
  Save, 
  Activity, 
  Trash2, 
  ImagePlus, 
  X, 
  Plus, 
  Type, 
  List, 
  HelpCircle 
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
import PrivateRoute from "@/components/auth/PrivateRoute"
import authService from "@/lib/authService"

export default function EditTreatmentPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<any>({
    name: "",
    category: "",
    short_description: "",
    long_description: "",
    image_url: "",
    sections: [],
    faqs: [],
    status: "active"
  })

  useEffect(() => {
    if (id) {
      fetchTreatment()
    }
  }, [id])

  const fetchTreatment = async () => {
    try {
      setLoading(true)
      const data = await settingsApi.getTreatment(+id)
      if (data) {
        setFormData({
          name: data.name || "",
          category: data.category || "",
          short_description: data.short_description || "",
          long_description: data.long_description || "",
          image_url: data.image_url || "",
          sections: Array.isArray(data.sections) ? data.sections : [],
          faqs: Array.isArray(data.faqs) ? data.faqs : [],
          status: data.status || "active"
        })
      }
    } catch (error) {
      console.error('Error fetching treatment:', error)
      toast({
        title: "Error",
        description: "Failed to fetch treatment details",
        variant: "destructive"
      })
      router.push('/admin/website/treatments')
    } finally {
      setLoading(false)
    }
  }

  // --- Sections Management ---
  const addSection = () => {
    const newSection = { title: "", type: "text", content: "" }
    setFormData({ ...formData, sections: [...formData.sections, newSection] })
  }

  const removeSection = (index: number) => {
    const newSections = [...formData.sections]
    newSections.splice(index, 1)
    setFormData({ ...formData, sections: newSections })
  }

  const updateSection = (index: number, field: string, value: string) => {
    const newSections = [...formData.sections]
    newSections[index][field] = value
    setFormData({ ...formData, sections: newSections })
  }

  // --- FAQs Management ---
  const addFaq = () => {
    const newFaq = { question: "", answer: "" }
    setFormData({ ...formData, faqs: [...formData.faqs, newFaq] })
  }

  const removeFaq = (index: number) => {
    const newFaqs = [...formData.faqs]
    newFaqs.splice(index, 1)
    setFormData({ ...formData, faqs: newFaqs })
  }

  const updateFaq = (index: number, field: string, value: string) => {
    const newFaqs = [...formData.faqs]
    newFaqs[index][field] = value
    setFormData({ ...formData, faqs: newFaqs })
  }

  const handleUpdate = async () => {
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Treatment name is required",
        variant: "destructive"
      })
      return
    }

    try {
      setSaving(true)
      await settingsApi.updateTreatment(+id, formData)
      toast({
        title: "Success",
        description: "Treatment updated successfully",
      })
      router.push('/admin/website/treatments')
    } catch (error) {
      console.error('Error updating treatment:', error)
      toast({
        title: "Error",
        description: "Failed to update treatment",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      const result = await settingsApi.uploadTreatmentImage(file);
      setFormData({ ...formData, image_url: result.imageUrl });
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
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse font-bold uppercase tracking-widest text-[10px]">
        Loading treatment details...
      </div>
    )
  }

  return (
    <PrivateRoute modulePath="admin/settings" action="view">
      <div className="p-6 space-y-6 max-w-5xl mx-auto pb-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Treatment</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Details (Left Col) */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <span>Update Details: {formData.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Treatment Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="name"
                      placeholder="e.g. Low Back Pain"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g. Bone & Spine"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_desc">Description (Summary)</Label>
                  <Textarea
                    id="short_desc"
                    placeholder="Short summary for cards..."
                    className="h-20"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="long_desc">Main Clinical Overview (Rich Text)</Label>
                  <RichTextEditor 
                    value={formData.long_description}
                    onChange={(val) => setFormData({ ...formData, long_description: val })}
                    placeholder="Enter detailed clinical overview..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Dynamic Sections */}
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
                {formData.sections.length === 0 && (
                  <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-xl text-slate-400">
                    No custom sections added.
                  </div>
                )}
                {formData.sections.map((section: any, index: number) => (
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

            {/* Dynamic FAQs */}
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
                {formData.faqs.length === 0 && (
                  <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-xl text-slate-400">
                    No FAQs added.
                  </div>
                )}
                {formData.faqs.map((faq: any, index: number) => (
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

          {/* Sidebar (Right Col) */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Featured Image</Label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl overflow-hidden bg-slate-50 group hover:border-primary/40 transition-all">
                    {formData.image_url ? (
                      <div className="relative aspect-square p-2 bg-white rounded-lg">
                        <img 
                          src={formData.image_url.startsWith('http') 
                            ? formData.image_url 
                            : `${authService.getSettingsApiUrl().replace('/api', '')}${formData.image_url.startsWith('/') ? '' : '/'}${formData.image_url}`} 
                          alt="Preview" 
                          className="w-full h-full object-contain rounded-lg"
                        />
                        <button 
                          onClick={() => setFormData({ ...formData, image_url: "" })}
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
                    checked={formData.status === 'active'}
                    onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? 'active' : 'inactive' })}
                  />
                </div>

                <Button onClick={handleUpdate} disabled={saving} className="w-full bg-primary h-12 text-[12px] font-black tracking-[0.1em] uppercase">
                  {saving ? "..." : <><Save className="h-4 w-4 mr-2" /> Update Treatment</>}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PrivateRoute>
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

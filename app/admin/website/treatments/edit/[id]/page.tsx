"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Activity, Trash2, ImagePlus, X } from "lucide-react"
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
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    short_description: "",
    long_description: "",
    image_url: "",
    sections: null,
    faqs: null,
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
          sections: data.sections || null,
          faqs: data.faqs || null,
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
      <div className="p-6 text-center text-gray-500">
        Loading treatment details...
      </div>
    )
  }

  return (
    <PrivateRoute modulePath="admin/settings" action="view">
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Treatment</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Update Details: {formData.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <Label htmlFor="short_desc">Short Description</Label>
              <Textarea
                id="short_desc"
                placeholder="A brief summary for the table and cards"
                className="h-20"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="long_desc">Long Description</Label>
              <Textarea
                id="long_desc"
                placeholder="Detailed information for the explorer view"
                className="h-40"
                value={formData.long_description}
                onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="image">Treatment Image</Label>
              <div className="flex flex-col gap-4 p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50 hover:border-primary/20 transition-all group">
                {formData.image_url ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border-4 border-white group-hover:shadow-xl transition-all">
                    <img 
                      src={formData.image_url.startsWith('http') ? formData.image_url : `${authService.getSettingsApiUrl().replace('/api', '')}${formData.image_url}`} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, image_url: "" })}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg active:scale-95 transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center py-12 cursor-pointer">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:scale-110 transition-all duration-500">
                      <ImagePlus size={32} />
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm font-bold text-slate-600 group-hover:text-primary transition-colors">Click to upload image</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-black">JPG, PNG or GIF (Max 2MB)</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Or Image URL (Fallback)</Label>
                <Input
                  id="image_url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="sections">Sections (JSON format)</Label>
                <Textarea
                  id="sections"
                  placeholder='[{"title": "Overview", "content": "..."}]'
                  className="h-32 font-mono text-xs"
                  value={formData.sections ? JSON.stringify(formData.sections, null, 2) : ""}
                  onChange={(e) => {
                    try {
                      const val = e.target.value ? JSON.parse(e.target.value) : null;
                      setFormData({ ...formData, sections: val });
                    } catch (err) {
                      // Allow typing, but don't parse invalid JSON yet
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="faqs">FAQs (JSON format)</Label>
                <Textarea
                  id="faqs"
                  placeholder='[{"question": "...", "answer": "..."}]'
                  className="h-32 font-mono text-xs"
                  value={formData.faqs ? JSON.stringify(formData.faqs, null, 2) : ""}
                  onChange={(e) => {
                    try {
                      const val = e.target.value ? JSON.parse(e.target.value) : null;
                      setFormData({ ...formData, faqs: val });
                    } catch (err) {
                    }
                  }}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="status"
                checked={formData.status === 'active'}
                onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? 'active' : 'inactive' })}
              />
              <Label htmlFor="status" className="font-bold uppercase text-[10px] tracking-widest text-slate-500">
                Display on Website ({formData.status})
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 bg-slate-50/50 p-6">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={saving} className="bg-primary">
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Updating..." : "Update Treatment"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PrivateRoute>
  )
}

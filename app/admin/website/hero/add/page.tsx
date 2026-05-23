"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  ArrowLeft, 
  Save, 
  Layout, 
  ImagePlus, 
  X, 
  Type, 
  Link as LinkIcon,
  Layers
} from "lucide-react"
import { settingsApi } from "@/lib/settingsApi"
import { toast } from "@/components/ui/use-toast"
import PrivateRoute from "@/components/auth/PrivateRoute"
import authService from "@/lib/authService"

export default function AddHeroSlidePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image_url: "",
    button_text: "Book an Appointment",
    button_link: "",
    order: 0,
    status: "active"
  })

  const handleSave = async () => {
    if (!formData.title) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      await settingsApi.createHeroSection(formData)
      toast({
        title: "Success",
        description: "Hero slide created successfully",
      })
      router.push('/admin/website/hero')
    } catch (error) {
      console.error('Error creating hero slide:', error)
      toast({
        title: "Error",
        description: "Failed to create hero slide",
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
      const result = await settingsApi.uploadHeroImage(file);
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
      setLoading(false);
    }
  };

  const getFullImageUrl = (url: string) => {
    if (!url) return ""
    if (url.startsWith('http')) return url
    const baseUrl = authService.getSettingsApiUrl().replace('/api', '')
    const prefix = url.startsWith('/') ? '' : '/'
    return `${baseUrl}${prefix}${url}`
  }

  return (
    <PrivateRoute modulePath="admin/settings" action="view">
      <div className="p-6 space-y-6 max-w-4xl mx-auto pb-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Add Hero Slide</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5 text-primary" />
                  <span>Content Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Main Title <span className="text-red-500">*</span></Label>
                  <Input
                    id="title"
                    placeholder="HEALING YOU AS A WHOLE"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Subtitle / Description</Label>
                  <Textarea
                    id="subtitle"
                    placeholder="30-minute expert case-taking..."
                    className="h-24"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="btn_text">Button Text</Label>
                    <Input
                      id="btn_text"
                      placeholder="Book an Appointment"
                      value={formData.button_text}
                      onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="btn_link">Button Link (Optional)</Label>
                    <Input
                      id="btn_link"
                      placeholder="/about"
                      value={formData.button_link}
                      onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                    />
                    <p className="text-[10px] text-gray-400">If left empty, it will trigger the global appointment popup.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-gray-500">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-2">
                  <Label>Background Image</Label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl overflow-hidden bg-slate-50 group hover:border-primary/40 transition-all">
                    {formData.image_url ? (
                      <div className="relative aspect-video">
                        <img 
                          src={getFullImageUrl(formData.image_url)} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                        <button 
                          onClick={() => setFormData({ ...formData, image_url: "" })}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-6 cursor-pointer">
                        <ImagePlus size={32} className="text-slate-400 group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-widest text-center">Upload PNG (Transparent)</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <Label className="text-[10px] font-black uppercase tracking-widest">Active</Label>
                  <Switch
                    checked={formData.status === 'active'}
                    onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? 'active' : 'inactive' })}
                  />
                </div>

                <Button onClick={handleSave} disabled={loading} className="w-full bg-primary h-12 text-[12px] font-black tracking-[0.1em] uppercase">
                  {loading ? "..." : <><Save className="h-4 w-4 mr-2" /> Save Slide</>}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PrivateRoute>
  )
}

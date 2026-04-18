"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, MapPin, ImagePlus, X, Plus, Info, Loader2 } from "lucide-react"
import { settingsApi } from "@/lib/settingsApi"
import { toast } from "@/components/ui/use-toast"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Badge } from "@/components/ui/badge"
import RichTextEditor from "@/components/ui/RichTextEditor"

export default function EditBranchPage() {
  const router = useRouter()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    address: "",
    phone: "",
    email: "",
    description: "",
    map_url: "",
    image_url: "",
    gallery: [] as string[],
    timings: "",
    landmarks: [] as string[],
    status: "active"
  })

  const [currentLandmark, setCurrentLandmark] = useState("")

  useEffect(() => {
    if (id) {
      fetchBranch()
    }
  }, [id])

  const fetchBranch = async () => {
    try {
      setLoading(true)
      const data = await settingsApi.getBranch(Number(id))
      setFormData({
        ...data,
        gallery: Array.isArray(data.gallery) ? data.gallery : [],
        landmarks: Array.isArray(data.landmarks) ? data.landmarks : []
      })
    } catch (error) {
      console.error('Error fetching branch:', error)
      toast({ title: "Error", description: "Failed to fetch branch details", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.name) {
      toast({ title: "Error", description: "Branch name is required", variant: "destructive" })
      return
    }

    try {
      setSaving(true)
      await settingsApi.updateBranch(Number(id), formData)
      toast({ title: "Success", description: "Branch updated successfully" })
      router.push('/admin/website/branches')
    } catch (error) {
      console.error('Error updating branch:', error)
      toast({ title: "Error", description: "Failed to update branch", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      const result = await settingsApi.uploadBranchImage(file);
      if (isGallery) {
        setFormData({ ...formData, gallery: [...formData.gallery, result.imageUrl] });
      } else {
        setFormData({ ...formData, image_url: result.imageUrl });
      }
      toast({ title: "Success", description: "Image uploaded successfully" });
    } catch (error: any) {
      toast({ title: "Upload Failed", description: error.message || "Failed to upload image", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const addLandmark = () => {
    if (currentLandmark.trim()) {
      setFormData({ ...formData, landmarks: [...formData.landmarks, currentLandmark.trim()] });
      setCurrentLandmark("");
    }
  };

  const removeLandmark = (index: number) => {
    const newLandmarks = [...formData.landmarks];
    newLandmarks.splice(index, 1);
    setFormData({ ...formData, landmarks: newLandmarks });
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = [...formData.gallery];
    newGallery.splice(index, 1);
    setFormData({ ...formData, gallery: newGallery });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading branch details...</p>
      </div>
    )
  }

  return (
    <PrivateRoute modulePath="admin/website" action="view">
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="rounded-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold font-serif text-[#1a2e5a]">Edit Branch</h1>
              <span className="text-slate-400 text-sm">{formData.name}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-lg text-[#1a2e5a]">
                  <Info className="h-5 w-5 text-primary" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700 font-bold">Branch Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="name"
                      placeholder="e.g. Narasaraopet Central"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border-slate-200 focus:border-primary/30 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug" className="text-slate-700 font-bold">URL Slug</Label>
                    <Input
                      id="slug"
                      placeholder="e.g. narasaraopet"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      className="border-slate-200 focus:border-primary/30 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-700 font-bold">Contact Phone</Label>
                    <Input
                      id="phone"
                      placeholder="+91 99999 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="border-slate-200 focus:border-primary/30 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-bold">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="branch@unicare.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="border-slate-200 focus:border-primary/30 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-slate-700 font-bold">Full Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter the complete postal address"
                    className="border-slate-200 focus:border-primary/30 rounded-xl min-h-[80px]"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="space-y-4 pt-4">
                  <Label className="text-sm font-bold text-slate-700">Detailed Description (About Branch)</Label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(val) => setFormData({ ...formData, description: val })}
                    placeholder="Describe the facilities, specialists, and unique features of this branch..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-lg text-[#1a2e5a]">
                  <ImagePlus className="h-5 w-5 text-primary" />
                  <span>Gallery & Media</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="space-y-4">
                  <Label className="text-slate-700 font-bold">Branch Gallery</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {formData.gallery.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group shadow-sm border border-slate-100">
                        <img 
                          src={img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_SETTINGS_API_URL}${img}`} 
                          className="w-full h-full object-cover" 
                        />
                        <button 
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    <label className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-primary/20 transition-all">
                      <Plus size={20} className="text-slate-400" />
                      <span className="text-[10px] uppercase font-bold text-slate-400 mt-2">Add Photo</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, true)} />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="map_url" className="text-slate-700 font-bold">Google Maps Embed URL</Label>
                  <Input
                    id="map_url"
                    placeholder="https://www.google.com/maps/embed?..."
                    value={formData.map_url}
                    onChange={(e) => setFormData({ ...formData, map_url: e.target.value })}
                    className="border-slate-200 focus:border-primary/30 rounded-xl"
                  />
                  <p className="text-[10px] text-slate-400">Provide the "src" attribute from the Google Maps iframe share code.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-lg text-[#1a2e5a]">Publish Status</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Active on Website</span>
                  <Switch
                    checked={formData.status === 'active'}
                    onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? 'active' : 'inactive' })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-lg text-[#1a2e5a]">Hero Image</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {formData.image_url ? (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-sm shadow-indigo-100 border border-slate-100">
                      <img 
                        src={formData.image_url.startsWith('http') ? formData.image_url : `${process.env.NEXT_PUBLIC_SETTINGS_API_URL}${formData.image_url}`} 
                        className="w-full h-full object-cover"
                      />
                      <button 
                        onClick={() => setFormData({ ...formData, image_url: "" })}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-md"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label className="w-full aspect-video border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-all">
                      <ImagePlus size={24} className="text-slate-400 mb-2" />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Upload Cover</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, false)} />
                    </label>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-lg text-[#1a2e5a]">Additional Info</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold">Service Hours</Label>
                  <Input
                    placeholder="e.g. Mon-Sat: 10AM - 8PM"
                    value={formData.timings}
                    onChange={(e) => setFormData({ ...formData, timings: e.target.value })}
                    className="border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-700 font-bold">Landmarks</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add landmark..."
                      value={currentLandmark}
                      onChange={(e) => setCurrentLandmark(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLandmark())}
                      className="border-slate-200 rounded-xl"
                    />
                    <Button type="button" size="sm" onClick={addLandmark} className="rounded-xl">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.landmarks.map((mark, idx) => (
                      <Badge key={idx} variant="secondary" className="pl-3 pr-1 py-1 rounded-full bg-slate-100 text-slate-600 border-none flex items-center gap-1 group">
                        <span className="text-xs">{mark}</span>
                        <X size={12} className="cursor-pointer text-slate-400 hover:text-red-500 transition-colors" onClick={() => removeLandmark(idx)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="pt-4">
              <Button onClick={handleSave} disabled={saving} className="w-full h-12 rounded-xl bg-primary text-lg font-bold shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all">
                <Save className="h-5 w-5 mr-2" />
                {saving ? "Updating..." : "Update Branch"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  )
}

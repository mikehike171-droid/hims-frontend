"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, FileText, ImagePlus, X } from "lucide-react"
import { settingsApi } from "@/lib/settingsApi"
import { toast } from "@/components/ui/use-toast"
import PrivateRoute from "@/components/auth/PrivateRoute"
import authService from "@/lib/authService"
import RichTextEditor from "@/components/ui/RichTextEditor"

export default function AddBlogPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    long_description: "",
    image_url: "",
    author: "",
    status: "active"
  })

  const handleSave = async () => {
    if (!formData.title) {
      toast({
        title: "Error",
        description: "Blog title is required",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      await settingsApi.createBlog(formData)
      toast({
        title: "Success",
        description: "Blog post created successfully",
      })
      router.push('/admin/website/blogs')
    } catch (error) {
      console.error('Error creating blog:', error)
      toast({
        title: "Error",
        description: "Failed to create blog post",
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
      const result = await settingsApi.uploadBlogImage(file);
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

  return (
    <PrivateRoute modulePath="admin/website" action="view">
      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Add New Blog Post</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Blog Post Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Blog Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                placeholder="Enter a compelling title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  placeholder="Admin or Writer Name"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="block">Status</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="status"
                    checked={formData.status === 'active'}
                    onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? 'active' : 'inactive' })}
                  />
                  <Label htmlFor="status" className="font-bold uppercase text-[10px] tracking-widest text-slate-500">
                    Visible on Website ({formData.status})
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_description">Excerpt / Summary</Label>
              <Textarea
                id="short_description"
                placeholder="A brief summary for the blog card (1-2 sentences)"
                className="h-20"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="long_description" className="text-sm font-bold text-slate-700">Detailed Content <span className="text-red-500">*</span></Label>
              <RichTextEditor
                value={formData.long_description}
                onChange={(val) => setFormData({ ...formData, long_description: val })}
                placeholder="Write your beautiful blog content here..."
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="image">Featured Image</Label>
              <div className="flex flex-col gap-4 p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50 hover:border-primary/20 transition-all group">
                {formData.image_url ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border-4 border-white group-hover:shadow-xl transition-all">
                    <img 
                      src={formData.image_url.startsWith('http') ? formData.image_url : `${process.env.NEXT_PUBLIC_SETTINGS_API_URL}${formData.image_url}`} 
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
                      <p className="text-sm font-bold text-slate-600 group-hover:text-primary transition-colors">Click to upload featured image</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-black">JPG, PNG, WebP (Max 2MB)</p>
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
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 bg-slate-50/50 p-6">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={handleSave} disabled={loading} className="bg-primary">
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Creating..." : "Save Blog Post"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PrivateRoute>
  )
}

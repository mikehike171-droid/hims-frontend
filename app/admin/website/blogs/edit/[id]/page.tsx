"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, FileText, ImagePlus, X, Loader2, AlertTriangle } from "lucide-react"
import { settingsApi } from "@/lib/settingsApi"
import { toast } from "@/components/ui/use-toast"
import authService from "@/lib/authService"
import RichTextEditor from "@/components/ui/RichTextEditor"
import { usePermissions, hasPermission } from '@/contexts/permissions-context'

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const permissions = usePermissions()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  
  // Use separate states for main fields
  const [title, setTitle] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [longDescription, setLongDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [author, setAuthor] = useState("")
  const [status, setStatus] = useState("active")

  // Manual Auth check
  useEffect(() => {
    const token = authService.getCurrentToken()
    if (!token) {
      router.push('/admin/login')
    } else {
      setAuthChecked(true)
    }
  }, [router])

  useEffect(() => {
    if (id && authChecked) {
      fetchBlog()
    }
  }, [id, authChecked])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      const data = await settingsApi.getBlog(parseInt(id))
      if (data) {
        setTitle(data.title || "")
        setShortDescription(data.short_description || "")
        setLongDescription(data.long_description || "")
        setImageUrl(data.image_url || "")
        setAuthor(data.author || "")
        setStatus(data.status || "active")
      }
    } catch (error) {
      console.error('Error fetching blog:', error)
      toast({
        title: "Error",
        description: "Failed to load blog post details",
        variant: "destructive"
      })
      router.push('/admin/website/blogs')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!title) {
      toast({
        title: "Error",
        description: "Blog title is required",
        variant: "destructive"
      })
      return
    }

    try {
      setSaving(true)
      const payload = {
        title,
        short_description: shortDescription,
        long_description: longDescription,
        image_url: imageUrl,
        author,
        status
      }
      
      await settingsApi.updateBlog(parseInt(id), payload)
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      })
      router.push('/admin/website/blogs')
    } catch (error) {
      console.error('Error updating blog:', error)
      toast({
        title: "Error",
        description: "Failed to update blog post",
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
      const result = await settingsApi.uploadBlogImage(file);
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
      setSaving(false);
    }
  };

  if (!authChecked) return null

  // Check permissions manually
  const user = authService.getCurrentUser()
  const isAdmin = user && (user.role === 'Admin' || user.role === 'Super Admin' || user.username === 'admin')
  if (!isAdmin && permissions && !hasPermission(permissions, 'admin/website', 'view')) {
    return (
      <div className="p-20 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-gray-500 mt-2">You do not have permission to edit blog posts.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading blog post...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
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
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                placeholder="Author Name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="block">Status</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="status"
                  checked={status === 'active'}
                  onCheckedChange={(checked) => setStatus(checked ? 'active' : 'inactive')}
                />
                <Label htmlFor="status" className="font-bold uppercase text-[10px] tracking-widest text-slate-500">
                  Visible on Website ({status})
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="short_description">Excerpt / Summary</Label>
            <Textarea
              id="short_description"
              placeholder="Brief summary"
              className="h-20"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="long_description" className="text-sm font-bold text-slate-700">Detailed Content <span className="text-red-500">*</span></Label>
            <RichTextEditor
               value={longDescription}
               onChange={setLongDescription}
               placeholder="Continue your health story..."
             />
          </div>

          <div className="space-y-4">
            <Label htmlFor="image">Featured Image</Label>
            <div className="flex flex-col gap-4 p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-all group">
              {imageUrl ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border-4 border-white group-hover:shadow-xl transition-all">
                  <img 
                    src={authService.getFileUrl(imageUrl)} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                  <button 
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg active:scale-95 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center py-12 cursor-pointer">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-all duration-500">
                    <ImagePlus size={32} />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm font-bold text-slate-600">Click to upload featured image</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">JPG, PNG or GIF (Max 2MB)</p>
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
          <Button onClick={handleSave} disabled={saving} className="bg-primary">
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Update Blog Post"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

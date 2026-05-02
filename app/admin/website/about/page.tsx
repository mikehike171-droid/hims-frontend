"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Activity, X, Info, ArrowLeft, Save, ImagePlus, ShieldCheck, Microscope, Layers, AlertTriangle } from "lucide-react"
import { settingsApi } from "@/lib/settingsApi"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import RichTextEditor from "@/components/ui/RichTextEditor"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import authService from "@/lib/authService"
import { usePermissions, hasPermission } from '@/contexts/permissions-context'

export default function AboutContentPage() {
  const router = useRouter()
  const permissions = usePermissions()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  // Form State (Separated to prevent clearing)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("active")
  const [imageUrls, setImageUrls] = useState<string[]>([])
  
  const [uploading, setUploading] = useState(false)

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
    if (authChecked) {
      fetchAboutContent()
    }
  }, [authChecked])

  const fetchAboutContent = async () => {
    try {
      setLoading(true)
      const data = await settingsApi.getAbout()
      setItems(data || [])
    } catch (error) {
      console.error('Error fetching about content:', error)
      toast({
        title: "Error",
        description: "Failed to fetch about content list",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (item: any = null) => {
    if (item) {
      setCurrentItem(item)
      setTitle(item.title || "")
      setDescription(item.description || "")
      setStatus(item.status || "active")
      setImageUrls(item.image_urls || [])
    } else {
      setCurrentItem(null)
      setTitle("")
      setDescription("")
      setStatus("active")
      setImageUrls([])
    }
    setIsModalOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    try {
      setUploading(true)
      const response = await settingsApi.uploadAboutImages(files)
      if (response && response.urls) {
        setImageUrls(prev => [...prev, ...response.urls])
        toast({
          title: "Success",
          description: "Images uploaded successfully",
        })
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!title || !description) {
      toast({
        title: "Required Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)
      const payload = {
        title,
        description,
        status,
        image_urls: imageUrls
      }

      if (currentItem) {
        await settingsApi.updateAbout(currentItem.id, payload)
        toast({
          title: "Success",
          description: "About content updated successfully",
        })
      } else {
        await settingsApi.createAbout(payload)
        toast({
          title: "Success",
          description: "About content created successfully",
        })
      }
      setIsModalOpen(false)
      fetchAboutContent()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save about content",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this content?')) return
    
    try {
      await settingsApi.deleteAbout(id)
      toast({
        title: "Success",
        description: "Content deleted successfully",
      })
      fetchAboutContent()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive",
      })
    }
  }

  if (!authChecked) return null

  // Check permissions manually
  const user = authService.getCurrentUser()
  const isAdmin = user && (user.role === 'Admin' || user.role === 'Super Admin' || user.username === 'admin')
  if (!isAdmin && permissions && !hasPermission(permissions, 'admin/website', 'view')) {
    return (
      <div className="p-20 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="text-gray-500 mt-2">You do not have permission to manage about content.</p>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">About Section</h1>
          <p className="text-slate-500 mt-1 font-medium italic">Manage the story and visuals of your clinics across the platform</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-primary hover:opacity-90 shadow-xl shadow-primary/20 px-8 py-6 rounded-2xl font-black text-xs tracking-widest uppercase transition-all active:scale-95">
          <Plus className="h-4 w-4 mr-2" />
          Add New Story
        </Button>
      </div>

      <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-50 p-8">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                  <Activity className="h-6 w-6" />
               </div>
               <div>
                  <CardTitle className="text-xl font-bold">Content Library</CardTitle>
                  <CardDescription>Master repository for about details</CardDescription>
               </div>
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-none">
                <TableHead className="px-8 py-6 uppercase text-[10px] font-black tracking-[0.2em] text-slate-400">Section Title</TableHead>
                <TableHead className="py-6 uppercase text-[10px] font-black tracking-[0.2em] text-slate-400">Story Preview</TableHead>
                <TableHead className="py-6 uppercase text-[10px] font-black tracking-[0.2em] text-slate-400">Photos</TableHead>
                <TableHead className="py-6 uppercase text-[10px] font-black tracking-[0.2em] text-slate-400">Status</TableHead>
                <TableHead className="px-8 py-6 text-right uppercase text-[10px] font-black tracking-[0.2em] text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20">
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing data...</span>
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 text-slate-400 font-medium">No about sections found.</TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 group">
                    <TableCell className="px-8 py-8 font-black text-slate-900 truncate max-w-[250px] leading-tight">
                      {item.title}
                    </TableCell>
                    <TableCell className="py-8 text-slate-500 text-sm italic max-w-[400px]">
                      <p className="line-clamp-2 leading-relaxed">{item.description}</p>
                    </TableCell>
                    <TableCell className="py-8">
                       <div className="flex -space-x-3">
                          {item.image_urls?.slice(0, 3).map((url: string, i: number) => (
                             <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-sm bg-slate-100">
                                <img src={url} className="w-full h-full object-cover" alt="" />
                             </div>
                          ))}
                          {item.image_urls?.length > 3 && (
                             <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                                +{item.image_urls.length - 3}
                             </div>
                          )}
                       </div>
                    </TableCell>
                    <TableCell className="py-8">
                      {item.status === 'active' ? (
                        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-full">Live</Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-400 border-slate-200 font-black text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-full">Hidden</Badge>
                      )}
                    </TableCell>
                    <TableCell className="px-8 py-8 text-right">
                      <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenModal(item)} className="bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white rounded-xl h-10 w-10 transition-all shadow-sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl h-10 w-10 transition-all shadow-sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* --- PROFESSIONAL DASHBOARD DIALOG --- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-none w-full h-full flex flex-col p-0 border-none rounded-none overflow-hidden bg-slate-50 ring-1 ring-black/5 text-slate-900">
          
          <div className="h-20 border-b border-slate-200 flex items-center justify-between px-10 shrink-0 bg-white">
             <div className="flex items-center gap-6">
                <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 group">
                   <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                   Back to List
                </Button>
                <div className="h-8 w-[1px] bg-slate-200" />
                <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                  {currentItem ? "Update Story Entry" : "Create New Story Entry"}
                </h2>
             </div>
             
             <div className="flex items-center gap-4">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="bg-primary hover:opacity-90 shadow-2xl shadow-primary/20 h-12 px-10 rounded-2xl font-black text-xs tracking-[0.2em] uppercase active:scale-95 transition-all"
                >
                  {isSaving ? "Saving..." : <><Save className="h-4 w-4 mr-3" /> Update Story</>}
                </Button>
             </div>
          </div>

          <ScrollArea className="flex-grow">
             <div className="p-10 container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pb-20">
                   
                   <div className="lg:col-span-2 space-y-8">
                      <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden border border-slate-100 bg-white">
                         <CardHeader className="bg-slate-50/30 border-b border-slate-50 p-8">
                            <CardTitle className="flex items-center gap-3 text-lg font-black uppercase tracking-tight text-slate-800">
                               <Layers className="h-5 w-5 text-primary" />
                               Section Overview
                            </CardTitle>
                         </CardHeader>
                         <CardContent className="p-10 space-y-10">
                            <div className="space-y-3">
                               <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Section Heading Identity</Label>
                               <Input
                                 id="title"
                                 value={title}
                                 onChange={(e) => setTitle(e.target.value)}
                                 placeholder="e.g. The Natural science \n WHAT IS HOMEOPATHY?"
                                 className="h-16 text-2xl font-black border-slate-100 bg-slate-50/50 focus:bg-white rounded-2xl transition-all font-heading"
                               />
                               <p className="text-[10px] text-slate-400 font-medium italic pl-1 flex items-center gap-2">
                                  <Info size={12} className="text-primary" /> Use '\n' to force a line break in the public title.
                               </p>
                            </div>

                            <div className="space-y-3">
                               <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">The Detailed Brand Narrative</Label>
                               <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
                                  <RichTextEditor
                                    value={description}
                                    onChange={setDescription}
                                    placeholder="Craft the in-depth story of UniCare Clinic here..."
                                  />
                               </div>
                               <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 flex items-start gap-4">
                                  <Microscope className="w-6 h-6 text-primary mt-1" />
                                  <div>
                                     <p className="text-[11px] text-primary font-black uppercase tracking-widest mb-1">Clinic Story Tip:</p>
                                     <p className="text-[11px] text-slate-600 leading-relaxed font-medium">Use double new lines to separate paragraphs. The **first paragraph** will automatically be styled with an italic, premium highlight on the homepage.</p>
                                  </div>
                               </div>
                            </div>
                         </CardContent>
                      </Card>
                   </div>

                   <div className="space-y-8">
                      <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden border border-slate-100 bg-white">
                         <CardHeader className="bg-slate-50/30 border-b border-slate-50 p-8">
                            <CardTitle className="flex items-center gap-3 text-lg font-black uppercase tracking-tight text-slate-800">
                               <ImagePlus className="h-5 w-5 text-primary" />
                               Media Cluster
                            </CardTitle>
                         </CardHeader>
                         <CardContent className="p-8">
                            <div className="grid grid-cols-2 gap-4">
                               {imageUrls.map((url: string, index: number) => (
                                  <div key={index} className="relative group aspect-square rounded-3xl overflow-hidden shadow-md border-2 border-slate-50 ring-1 ring-slate-100">
                                     <img src={url} alt="" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button variant="destructive" size="icon" onClick={() => handleRemoveImage(index)} className="rounded-full h-10 w-10 shadow-2xl scale-75 group-hover:scale-100 transition-all">
                                           <X size={16} />
                                        </Button>
                                     </div>
                                     <div className="absolute top-2 left-2">
                                        <Badge className="bg-white/80 text-primary border-none text-[8px] font-black px-2 py-0.5 rounded-full">{index + 1}</Badge>
                                     </div>
                                  </div>
                               ))}

                               {imageUrls.length < 10 && (
                                  <label className="aspect-square rounded-3xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all group active:scale-95 bg-slate-50/50">
                                     <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                     {uploading ? (
                                        <div className="flex flex-col items-center gap-3">
                                           <div className="animate-spin text-primary"><Activity size={24} /></div>
                                           <span className="text-[9px] font-black text-primary uppercase tracking-widest">Syncing...</span>
                                        </div>
                                     ) : (
                                        <div className="text-center">
                                           <Plus size={24} className="text-slate-300 group-hover:text-primary transition-colors mx-auto mb-2" />
                                           <span className="text-[9px] font-black text-slate-400 group-hover:text-primary tracking-[0.2em] uppercase">Add Media</span>
                                        </div>
                                     )}
                                  </label>
                               )}
                            </div>
                            <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                               <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Visibility Status</Label>
                                  <div className="flex items-center gap-3">
                                     <span className={`text-[9px] font-black uppercase tracking-widest ${status === 'active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                                        {status === 'active' ? 'Live' : 'Hidden'}
                                     </span>
                                     <Switch
                                        checked={status === 'active'}
                                        onCheckedChange={(checked) => setStatus(checked ? 'active' : 'inactive')}
                                     />
                                  </div>
                               </div>
                            </div>
                         </CardContent>
                         <CardFooter className="bg-slate-50/30 p-8 flex flex-col gap-4">
                            <div className="flex items-start gap-4">
                               <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                               <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-1">Asset Security</p>
                                  <p className="text-[10px] text-slate-500 leading-normal font-medium italic">Photos are securely mirroed to global CDNs for fast public delivery.</p>
                               </div>
                            </div>
                         </CardFooter>
                      </Card>

                      <div className="p-8 bg-slate-900 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[40px] translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-all duration-700" />
                         <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 mb-2 relative z-10">System Ready</h4>
                         <p className="text-sm text-white/60 mb-8 relative z-10 leading-relaxed font-medium">Verify your story details and media before pushing to production.</p>
                         <Button 
                           onClick={handleSave} 
                           disabled={isSaving}
                           className="w-full bg-primary hover:opacity-90 h-14 rounded-2xl font-black text-[11px] tracking-[0.2em] uppercase shadow-lg shadow-primary/20 relative z-10 transition-all active:scale-95"
                         >
                           {isSaving ? "Saving..." : <><Save className="h-4 w-4 mr-3" /> Synchronize Section</>}
                         </Button>
                      </div>
                   </div>
                </div>
             </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}

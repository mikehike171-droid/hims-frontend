"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Globe, Layout, Image as ImageIcon } from "lucide-react"
import { settingsApi } from "@/lib/settingsApi"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import PrivateRoute from "@/components/auth/PrivateRoute"
import authService from "@/lib/authService"

export default function HeroSectionsListPage() {
  const router = useRouter()
  const [slides, setSlides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    try {
      setLoading(true)
      const data = await settingsApi.getAdminHeroSections()
      setSlides(data || [])
    } catch (error) {
      console.error('Error fetching hero slides:', error)
      toast({
        title: "Error",
        description: "Failed to fetch hero slides list",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this hero slide?')) return
    
    try {
      await settingsApi.deleteHeroSection(id)
      toast({
        title: "Success",
        description: "Hero slide deleted successfully",
      })
      fetchSlides()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete hero slide",
        variant: "destructive",
      })
    }
  }

  const getFullImageUrl = (url: string) => {
    if (!url) return ""
    if (url.startsWith('http')) return url
    const baseUrl = authService.getSettingsApiUrl().replace('/api', '')
    const prefix = url.startsWith('/') ? '' : '/'
    return `${baseUrl}${prefix}${url}`
  }

  const handleSeed = async () => {
    try {
      setLoading(true)
      const success = await settingsApi.seedHeroSections()
      if (success) {
        toast({
          title: "Success",
          description: "Initial hero slides seeded successfully",
        })
        fetchSlides()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to seed data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PrivateRoute modulePath="admin/settings" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hero Section Slides</h1>
            <p className="text-gray-600">Manage the carousel slides on the landing page hero section</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSeed} variant="outline" disabled={loading || slides.length > 0}>
              Seed Default Slides
            </Button>
            <Button onClick={() => router.push('/admin/website/hero/add')} className="bg-primary">
              <Plus className="h-4 w-4 mr-2" />
              Add Slide
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Layout className="h-5 w-5 text-primary" />
              <span>Carousel Slides</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Preview</TableHead>
                  <TableHead>Title & Subtitle</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-400">Loading slides...</TableCell>
                  </TableRow>
                ) : slides.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-400">No slides found. Click 'Add Slide' to create one.</TableCell>
                  </TableRow>
                ) : (
                  slides.map((slide) => (
                    <TableRow key={slide.id}>
                      <TableCell>
                        <div className="w-16 h-10 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                          {slide.image_url ? (
                            <img 
                              src={getFullImageUrl(slide.image_url)} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <ImageIcon size={16} />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 truncate">{slide.title}</span>
                          <span className="text-xs text-gray-500 truncate">{slide.subtitle}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono">
                          {slide.order}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${slide.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} border-none uppercase text-[10px] font-bold`}>
                          {slide.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/website/hero/edit/${slide.id}`)}
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(slide.id)}
                            className="hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  )
}

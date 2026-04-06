"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Globe, FileText } from "lucide-react"
import { settingsApi } from "@/lib/settingsApi"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function BlogsListPage() {
  const router = useRouter()
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const data = await settingsApi.getBlogs()
      setBlogs(data || [])
    } catch (error) {
      console.error('Error fetching blogs:', error)
      toast({
        title: "Error",
        description: "Failed to fetch blogs list",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post? This will remove it from the public website.')) return
    
    try {
      await settingsApi.deleteBlog(id)
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      })
      fetchBlogs()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      })
    }
  }

  return (
    <PrivateRoute modulePath="admin/website" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Website Blogs</h1>
            <p className="text-gray-600">Manage the blog posts displayed on the public website</p>
          </div>
          <Button onClick={() => router.push('/admin/website/blogs/add')} className="bg-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Blog Post
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-primary" />
              <span>All Blog Posts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Blog Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-400">Loading blogs...</TableCell>
                  </TableRow>
                ) : blogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-400">No blogs found. Click 'Add Blog Post' to create one.</TableCell>
                  </TableRow>
                ) : (
                  blogs.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                            {blog.image_url ? (
                              <img src={blog.image_url.startsWith('http') ? blog.image_url : `${process.env.NEXT_PUBLIC_SETTINGS_API_URL}${blog.image_url}`} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <FileText size={20} className="text-gray-400" />
                            )}
                          </div>
                          <span className="line-clamp-1">{blog.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {blog.author || 'Admin'}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${blog.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} border-none uppercase text-[10px] font-bold`}>
                          {blog.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/website/blogs/edit/${blog.id}`)}
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(blog.id)}
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

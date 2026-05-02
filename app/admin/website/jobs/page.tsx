"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Globe, Briefcase, ChevronLeft, ChevronRight, Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { settingsApi } from "@/lib/settingsApi"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function JobsListPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchJobs()
  }, [page])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const data = await settingsApi.getJobs(page, limit, search)
      setJobs(data.items || [])
      setTotal(data.total || 0)
      setTotalPages(Math.ceil((data.total || 0) / limit))
    } catch (error) {
      console.error('Error fetching jobs:', error)
      toast({
        title: "Error",
        description: "Failed to fetch jobs list",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this job posting? This will remove it from the public website.')) return
    
    try {
      const success = await settingsApi.deleteJob(id)
      if (success) {
        toast({
          title: "Success",
          description: "Job posting deleted successfully",
        })
        fetchJobs()
      } else {
        throw new Error('Failed to delete')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete job posting",
        variant: "destructive",
      })
    }
  }

  return (
    <PrivateRoute modulePath="admin/website" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Career Postings</h1>
            <p className="text-gray-600">Manage job vacancies displayed on the public website</p>
          </div>
          <Button onClick={() => router.push('/admin/website/jobs/add')} className="bg-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Job Posting
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-primary" />
                <span>Current Vacancies</span>
              </div>
              <div className="flex items-center gap-2 max-w-sm w-full">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search jobs..." 
                    className="pl-9 h-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
                  />
                </div>
                <Button variant="outline" size="sm" onClick={fetchJobs} className="h-9">
                  Search
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20 text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                        <span className="text-sm font-medium tracking-wide">Fetching vacancies...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : jobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20 text-gray-400 italic">
                      <div className="flex flex-col items-center gap-2">
                        <Briefcase size={40} className="text-gray-200" />
                        <p>No job postings found. Click 'Add Job Posting' to create your first vacancy.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Briefcase size={20} className="text-primary" />
                          </div>
                          <span className="line-clamp-1">{job.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {job.location}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] font-bold">
                          {job.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${job.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} border-none uppercase text-[10px] font-bold`}>
                          {job.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/website/jobs/edit/${job.id}`)}
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(job.id)}
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

            {/* Pagination Controls */}
            {total > 0 && (
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 border-t">
                <p className="text-xs text-gray-500 font-medium">
                  Showing <span className="font-bold text-gray-700">{Math.min(total, (page-1)*limit + 1)}-{Math.min(total, page*limit)}</span> of <span className="font-bold text-gray-700">{total}</span> job postings
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      if (totalPages > 7 && i > 1 && i < totalPages - 2 && Math.abs(i + 1 - page) > 1) {
                        if (i === 2 || i === totalPages - 3) return <span key={i} className="text-gray-300">...</span>
                        return null
                      }
                      return (
                        <Button
                          key={i}
                          variant={page === i + 1 ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(i + 1)}
                          className={`h-8 w-8 p-0 text-xs ${page === i + 1 ? "bg-primary" : ""}`}
                        >
                          {i + 1}
                        </Button>
                      )
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  )
}

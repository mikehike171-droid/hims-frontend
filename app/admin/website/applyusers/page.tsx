"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, User, Mail, Phone, MapPin, Download, ExternalLink, Calendar, ChevronLeft, ChevronRight, Filter, RotateCcw, Loader2, Search } from "lucide-react"
import { settingsApi } from "@/lib/settingsApi"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import PrivateRoute from "@/components/auth/PrivateRoute"
import authService from "@/lib/authService"

export default function ApplyUsersPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  
  // Input states (temporary values while typing)
  const [searchInput, setSearchInput] = useState("")
  const [startDateInput, setStartDateInput] = useState("")
  const [endDateInput, setEndDateInput] = useState("")
  
  // Active filter states (applied to API)
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: ""
  })

  const limit = 10

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true)
      const data = await settingsApi.getJobApplications(
        page, 
        limit, 
        filters.startDate, 
        filters.endDate, 
        filters.search
      )
      setApplications(data.items || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast({
        title: "Error",
        description: "Failed to fetch job applications list",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [page, filters])

  // Single effect to fetch data whenever page or filters change
  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const handleApplyFilters = () => {
    // If we are already on page 1 and filters haven't changed, 
    // the effect won't trigger, so we'd need to manually fetch.
    // But usually, something changes.
    setFilters({
      search: searchInput,
      startDate: startDateInput,
      endDate: endDateInput
    })
    setPage(1)
  }

  const handleReset = () => {
    setSearchInput("")
    setStartDateInput("")
    setEndDateInput("")
    setFilters({
      search: "",
      startDate: "",
      endDate: ""
    })
    setPage(1)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) return
    
    try {
      const success = await settingsApi.deleteJobApplication(id)
      if (success) {
        toast({
          title: "Success",
          description: "Application deleted successfully",
        })
        fetchApplications()
      } else {
        throw new Error('Failed to delete')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete application",
        variant: "destructive",
      })
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <PrivateRoute modulePath="admin/website" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Applicants</h1>
            <p className="text-gray-600">Review and manage candidates who applied through the Quick Apply form</p>
          </div>
        </div>

        <Card className="rounded-[32px] border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2 shrink-0">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-slate-800">
                  Received Applications <span className="text-primary ml-0.5">({total})</span>
                </h2>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <Input 
                    placeholder="Search name, email, phone..." 
                    className="h-9 w-56 pl-9 text-[11px] rounded-xl border-slate-100 bg-white shadow-sm focus:ring-1 focus:ring-primary/20 transition-all"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                  />
                </div>

                <div className="flex items-center gap-1.5 bg-white p-1 px-2 rounded-xl border border-slate-100 shadow-sm">
                  <span className="text-[9px] font-black uppercase text-slate-400">From</span>
                  <Input 
                    type="date" 
                    className="h-7 w-32 text-[10px] rounded-lg border-none bg-slate-50/50 p-0 px-2 focus:bg-white transition-colors"
                    value={startDateInput}
                    onChange={(e) => setStartDateInput(e.target.value)}
                  />
                  <span className="text-[9px] font-black uppercase text-slate-400 ml-1">To</span>
                  <Input 
                    type="date" 
                    className="h-7 w-32 text-[10px] rounded-lg border-none bg-slate-50/50 p-0 px-2 focus:bg-white transition-colors"
                    value={endDateInput}
                    onChange={(e) => setEndDateInput(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-1.5">
                  <Button size="sm" onClick={handleApplyFilters} className="h-9 gap-2 rounded-xl px-4 font-bold text-[11px] uppercase tracking-wider shadow-md shadow-primary/10">
                    <Filter size={13} />
                    Search
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleReset} className="h-9 w-9 p-0 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                    <RotateCcw size={14} />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow>
                  <TableHead className="font-bold text-slate-700 py-4 text-xs">Applicant Name</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs">Contact Info</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs">Location</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs">Applied For</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs">Resume</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs">Applied Date</TableHead>
                  <TableHead className="text-right font-bold text-slate-700 pr-6 text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-20 text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                        <span className="text-sm font-medium">Loading applications...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-20 text-gray-400 italic">No applications found matching your criteria.</TableCell>
                  </TableRow>
                ) : (
                  applications.map((app) => (
                    <TableRow key={app.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium py-4">
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900 text-sm">{app.name}</p>
                          {app.message && (
                            <p className="text-[11px] text-slate-500 line-clamp-1 italic">"{app.message}"</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[11px] text-slate-600">
                            <Mail size={11} className="text-slate-400" />
                            {app.email}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-600">
                            <Phone size={11} className="text-slate-400" />
                            {app.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-[11px] text-slate-600">
                          <MapPin size={11} className="text-slate-400" />
                          {app.location || 'Not provided'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {app.job ? (
                            <Badge className="bg-primary/10 text-primary border-none text-[9px] uppercase font-bold w-fit">
                              {app.job.title}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[9px] uppercase font-bold w-fit text-slate-400 border-slate-200">
                              General Application
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {app.resume_url ? (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 gap-1.5 text-[10px] rounded-lg hover:bg-primary hover:text-white border-slate-200 transition-all font-bold px-2.5"
                            onClick={() => window.open(authService.getFileUrl(app.resume_url), '_blank')}
                          >
                            <Download size={11} />
                            Resume
                          </Button>
                        ) : (
                          <Badge variant="secondary" className="text-[9px] font-bold text-slate-400 uppercase">No File</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-[11px] text-slate-600">
                          <Calendar size={11} className="text-slate-400" />
                          {new Date(app.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(app.id)}
                          className="hover:bg-red-50 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            {total > 0 && (
              <div className="flex items-center justify-between px-6 py-4 bg-slate-50/30 border-t border-slate-100">
                <p className="text-[11px] text-slate-500 font-medium">
                  Showing <span className="font-bold text-slate-700">{Math.min(total, (page-1)*limit + 1)}-{Math.min(total, page*limit)}</span> of <span className="font-bold text-slate-700">{total}</span> applicants
                </p>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="h-7 w-7 p-0 rounded-lg border-slate-200"
                  >
                    <ChevronLeft size={14} />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      if (totalPages > 7 && i > 1 && i < totalPages - 2 && Math.abs(i + 1 - page) > 1) {
                        if (i === 2 || i === totalPages - 3) return <span key={i} className="text-slate-300">...</span>
                        return null
                      }
                      return (
                        <Button
                          key={i}
                          variant={page === i + 1 ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(i + 1)}
                          className={`h-7 w-7 p-0 rounded-lg text-[10px] ${page === i + 1 ? "bg-primary shadow-lg shadow-primary/20" : "border-slate-200 text-slate-600 hover:bg-white"}`}
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
                    className="h-7 w-7 p-0 rounded-lg border-slate-200"
                  >
                    <ChevronRight size={14} />
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

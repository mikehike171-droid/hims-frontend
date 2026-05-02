"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Globe, Activity, Search, Filter, RotateCcw, Loader2, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { settingsApi } from "@/lib/settingsApi"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import PrivateRoute from "@/components/auth/PrivateRoute"
import authService from "@/lib/authService"

export default function TreatmentsListPage() {
  const router = useRouter()
  const [treatments, setTreatments] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  
  // Input states
  const [searchInput, setSearchInput] = useState("")
  const [startDateInput, setStartDateInput] = useState("")
  const [endDateInput, setEndDateInput] = useState("")
  
  // Active filter states
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: ""
  })

  const limit = 10

  const fetchTreatments = useCallback(async () => {
    try {
      setLoading(true)
      const data = await settingsApi.getTreatments(
        page, 
        limit, 
        filters.startDate, 
        filters.endDate, 
        filters.search
      )
      setTreatments(data.items || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Error fetching treatments:', error)
      toast({
        title: "Error",
        description: "Failed to fetch treatments list",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [page, filters])

  useEffect(() => {
    fetchTreatments()
  }, [fetchTreatments])

  const handleApplyFilters = () => {
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
    if (!confirm('Are you sure you want to delete this treatment? This will remove it from the public website.')) return
    
    try {
      await settingsApi.deleteTreatment(id)
      toast({
        title: "Success",
        description: "Treatment deleted successfully",
      })
      fetchTreatments()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete treatment",
        variant: "destructive",
      })
    }
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <PrivateRoute modulePath="admin/settings" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 text-primary">Website Treatments</h1>
            <p className="text-gray-600">Manage the diseases and treatments displayed on the public website</p>
          </div>
          <Button onClick={() => router.push('/admin/website/treatments/add')} className="bg-primary rounded-xl px-6 h-11 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4 mr-2" />
            Add Treatment
          </Button>
        </div>

        <Card className="rounded-[32px] border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4 px-6">
            <div className="flex items-center w-full gap-4">
              {/* Search Box - Takes more space */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Search treatment name or category..." 
                  className="h-10 w-full pl-10 text-xs rounded-xl border-slate-100 bg-white shadow-sm focus:ring-1 focus:ring-primary/20 transition-all"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                />
              </div>

              {/* Date Filters */}
              <div className="flex items-center gap-1.5 bg-white p-1 px-3 rounded-xl border border-slate-100 shadow-sm h-10">
                <span className="text-[10px] font-black uppercase text-slate-400">From</span>
                <Input 
                  type="date" 
                  className="h-8 w-36 text-[11px] rounded-lg border-none bg-slate-50/50 p-0 px-2 focus:bg-white transition-colors"
                  value={startDateInput}
                  onChange={(e) => setStartDateInput(e.target.value)}
                />
                <span className="text-[10px] font-black uppercase text-slate-400 ml-1">To</span>
                <Input 
                  type="date" 
                  className="h-8 w-36 text-[11px] rounded-lg border-none bg-slate-50/50 p-0 px-2 focus:bg-white transition-colors"
                  value={endDateInput}
                  onChange={(e) => setEndDateInput(e.target.value)}
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleApplyFilters} className="h-10 gap-2 rounded-xl px-6 font-bold text-[11px] uppercase tracking-wider shadow-md shadow-primary/10">
                  <Filter size={14} />
                  Search
                </Button>
                <Button size="sm" variant="ghost" onClick={handleReset} className="h-10 w-10 p-0 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                  <RotateCcw size={16} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow>
                  <TableHead className="font-bold text-slate-700 py-4 text-xs">Treatment Name</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs">Category</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs">Status</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs">Created At</TableHead>
                  <TableHead className="text-right font-bold text-slate-700 pr-6 text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20 text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
                        <span className="text-sm font-medium">Loading treatments...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : treatments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20 text-gray-400 italic">No treatments found matching your criteria.</TableCell>
                  </TableRow>
                ) : (
                  treatments.map((treatment) => (
                    <TableRow key={treatment.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 shadow-inner">
                            {treatment.image_url ? (
                              <img 
                                src={authService.getFileUrl(treatment.image_url)} 
                                alt={treatment.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=No+Image'
                                }}
                              />
                            ) : (
                              <Activity size={20} className="text-primary/40" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{treatment.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 uppercase text-[9px] font-bold px-2 py-0.5">
                          {treatment.category || 'General'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${treatment.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} border-none uppercase text-[9px] font-bold px-2 py-0.5`}>
                          {treatment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-[11px] text-slate-600">
                          <Calendar size={11} className="text-slate-400" />
                          {new Date(treatment.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/website/treatments/edit/${treatment.id}`)}
                            className="hover:bg-blue-50 h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(treatment.id)}
                            className="hover:bg-red-50 h-8 w-8 p-0"
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
              <div className="flex items-center justify-between px-6 py-4 bg-slate-50/30 border-t border-slate-100">
                <p className="text-[11px] text-slate-500 font-medium">
                  Showing <span className="font-bold text-slate-700">{Math.min(total, (page-1)*limit + 1)}-{Math.min(total, page*limit)}</span> of <span className="font-bold text-slate-700">{total}</span> treatments
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

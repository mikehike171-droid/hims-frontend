"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, Search, RefreshCw, PhoneCall, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { frontOfficeApi } from "@/lib/frontOfficeApi"
import Link from "next/link"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Enquiry {
  id: number
  name: string
  phone: string
  medical_problems?: string
  location?: string
  userview: string
  created_at: string
}

export default function OnlinePatientsPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [filteredEnquiries, setFilteredEnquiries] = useState<Enquiry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')
  const fetchingRef = useRef(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [hasViewedLeads, setHasViewedLeads] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newLeadForm, setNewLeadForm] = useState({ name: "", phone: "", reason: "", location: "" })
  const [locations, setLocations] = useState<{ id: number; name: string }[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Fetch clinic locations for dropdown
    fetch('/api/settings-service/locations')
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setLocations(data.filter((l: any) => l.isActive !== false)) })
      .catch(() => {})
  }, [])

  // Set default dates to current month
  useEffect(() => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const fromDateStr = firstDay.toISOString().split('T')[0]
    const toDateStr = lastDay.toISOString().split('T')[0]

    setFromDate(fromDateStr)
    setToDate(toDateStr)

    // Fetch current month data on initial load
    fetchEnquiries(fromDateStr, toDateStr)
  }, [])

  useEffect(() => {
    const filtered = enquiries.filter(enquiry =>
      (enquiry.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (enquiry.phone || '').includes(searchTerm)
    )
    setFilteredEnquiries(filtered)
    setCurrentPage(1)
  }, [enquiries, searchTerm])

  const fetchEnquiries = async (from?: string, to?: string) => {
    if (fetchingRef.current) return

    try {
      fetchingRef.current = true
      setLoading(true)
      // Use the date parameters if provided, otherwise use state values
      const data = await frontOfficeApi.getEnquiries(from || fromDate, to || toDate)
      setEnquiries(data)
    } catch (error) {
      console.error('Error fetching enquiries:', error)
    } finally {
      setLoading(false)
      fetchingRef.current = false
    }
  }

  const handleSearch = () => {
    setHasViewedLeads(true)
    fetchEnquiries()
  }

  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const enquiryData = {
        name: newLeadForm.name,
        phone: newLeadForm.phone,
        medical_problems: newLeadForm.reason,
        location: newLeadForm.location || null,
      };

      await frontOfficeApi.saveEnquiry(enquiryData);

      setIsAddModalOpen(false);
      setNewLeadForm({ name: "", phone: "", reason: "", location: "" });
      fetchEnquiries();
    } catch (error) {
      console.error(error);
      alert('Failed to register lead. Please ensure you are logged in correctly.');
    }
  }

  const handleMarkAsRead = async (id: number) => {
    const enquiry = enquiries.find(e => e.id === id);
    if (!enquiry || enquiry.userview === 'read') return;

    try {
      await frontOfficeApi.markAsRead(id);
      // Update local state for immediate feedback
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, userview: 'read' } : e));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }

  const totalPages = Math.ceil(filteredEnquiries.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedEnquiries = filteredEnquiries.slice(startIndex, endIndex)



  if (loading || !isMounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading online enquiries...</p>
        </div>
      </div>
    )
  }

  return (
    <PrivateRoute modulePath="admin/telecaller/ol" action="view">
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-[#1B7A43]">Online Enquiries</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Date Filter</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="fromDate" className="text-sm font-medium">From Date:</Label>
                <Input
                  id="fromDate"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-40"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="toDate" className="text-sm font-medium">To Date:</Label>
                <Input
                  id="toDate"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-40"
                />
              </div>
              <Button
                onClick={handleSearch}
                variant="default"
                size="sm"
                className="flex items-center space-x-1"
                disabled={loading}
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">


              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search lead..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 border-gray-200"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setHasViewedLeads(true)
                    setSearchTerm("")
                    fetchEnquiries()
                  }}
                  className="h-10 w-10 shrink-0"
                  title="Refresh leads"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Mobile View */}
            <div className="block lg:hidden">
              <div className="space-y-4 p-4">
                {paginatedEnquiries.map((enquiry) => (
                  <Card
                    key={enquiry.id}
                    className={`border cursor-pointer transition-all duration-300 ${enquiry.userview === 'unread' ? 'bg-red-100 border-red-300 shadow-md ring-1 ring-red-400/20' : 'bg-white border-gray-200'}`}
                    onClick={() => handleMarkAsRead(enquiry.id)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {enquiry.name}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Online Enquiry
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div>
                            <p className="text-gray-600">Phone</p>
                            <p className="font-medium">{enquiry.phone}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Location</p>
                            <p className="font-medium">{enquiry.location || 'Not specified'}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Medical Problems</p>
                            <p className="font-medium">{enquiry.medical_problems || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2">
                          <Link href={`tel:${enquiry.phone}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <PhoneCall className="h-4 w-4 mr-2" /> Call Now
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead Name</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Medical Problems</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEnquiries.map((enquiry) => (
                    <TableRow
                      key={enquiry.id}
                      className={`cursor-pointer transition-all duration-300 ${enquiry.userview === 'unread' ? 'bg-red-100 hover:bg-red-200/80 font-medium' : 'bg-white hover:bg-slate-50'}`}
                      onClick={() => handleMarkAsRead(enquiry.id)}
                    >
                      <TableCell className={enquiry.userview === 'unread' ? 'border-b border-red-200' : ''}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{enquiry.name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{enquiry.phone}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 text-sm">
                          {enquiry.location ? (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">{enquiry.location}</span>
                          ) : (
                            <span className="text-slate-400 text-xs">Not specified</span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{enquiry.medical_problems || 'N/A'}</TableCell>
                      <TableCell>
                        {new Date(enquiry.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Link href={`tel:${enquiry.phone}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              title="Call Now"
                            >
                              <PhoneCall className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredEnquiries.length === 0 && !loading && (
              <div className="text-center py-12">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No online enquiries found for this period</p>
              </div>
            )}
          </CardContent>
          {filteredEnquiries.length > 0 && (
            <div className="border-t px-4 py-3 flex items-center justify-between bg-slate-50/50">
              <div className="text-sm text-slate-500">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredEnquiries.length)} of {filteredEnquiries.length} enquiries
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Register Manual Form Lead</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleManualAdd} className="space-y-4 mt-4">
              <div>
                <Label>Full Name *</Label>
                <Input required value={newLeadForm.name} onChange={e => setNewLeadForm({ ...newLeadForm, name: e.target.value })} />
              </div>
              <div>
                <Label>Mobile Number *</Label>
                <Input required type="tel" value={newLeadForm.phone} onChange={e => setNewLeadForm({ ...newLeadForm, phone: e.target.value })} />
              </div>
              <div>
                <Label>Clinic Location</Label>
                <select
                  value={newLeadForm.location}
                  onChange={e => setNewLeadForm({ ...newLeadForm, location: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select Location (Optional)</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.name}>{loc.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Medical Concern</Label>
                <Input value={newLeadForm.reason} onChange={e => setNewLeadForm({ ...newLeadForm, reason: e.target.value })} />
              </div>
              <Button type="submit" className="w-full">Save Lead</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </PrivateRoute>
  )
}
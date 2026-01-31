"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function MyNumbersPage() {
  const [mobileNumbers, setMobileNumbers] = useState([])
  const [todayCalls, setTodayCalls] = useState([])
  const [todayPagination, setTodayPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(false)
  const [selectedBranchId, setSelectedBranchId] = useState(authService.getSelectedBranchId())
  const hasFetched = useRef(false)
  
  // Date filter states - empty by default
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' })

  useEffect(() => {
    if (!hasFetched.current) {
      fetchMyNumbers(1)
      hasFetched.current = true
    }
  }, [])

  useEffect(() => {
    const handleBranchChange = () => {
      const currentBranchId = authService.getSelectedBranchId()
      if (currentBranchId !== selectedBranchId) {
        setSelectedBranchId(currentBranchId)
        fetchMyNumbers(1)
      }
    }

    window.addEventListener('branchChanged', handleBranchChange)
    return () => window.removeEventListener('branchChanged', handleBranchChange)
  }, [selectedBranchId])

  const fetchMyNumbers = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      const selectedBranchId = authService.getSelectedBranchId()
      const locationId = selectedBranchId ? parseInt(selectedBranchId) : undefined
      
      let url = `${authService.getSettingsApiUrl()}/mobile-numbers/my-numbers?page=${page}&limit=10`
      
      if (locationId) {
        url += `&location_id=${locationId}`
      }
      
      if (dateFilter.from) {
        url += `&from_date=${dateFilter.from}`
      }
      
      if (dateFilter.to) {
        url += `&to_date=${dateFilter.to}`
      }
      
      console.log('Fetching URL:', url)
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('API Response:', result)
        setMobileNumbers(result.data || [])
        // Ensure we update pagination with the correct page number
        setPagination({
          page: page, // Use the requested page, not the one from API
          limit: result.pagination?.limit || 10,
          total: result.pagination?.total || 0,
          totalPages: result.pagination?.totalPages || 0
        })
      } else {
        console.error('API Error:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error fetching mobile numbers:', error)
    } finally {
      setLoading(false)
    }
  }, [dateFilter])

  const fetchTodayCalls = useCallback(async (page = 1) => {
    try {
      const token = localStorage.getItem('authToken')
      const selectedBranchId = authService.getSelectedBranchId()
      const locationId = selectedBranchId ? parseInt(selectedBranchId) : undefined
      
      let url = `${authService.getSettingsApiUrl()}/mobile-numbers/today-calls?page=${page}&limit=10`
      
      if (locationId) {
        url += `&location_id=${locationId}`
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const result = await response.json()
        setTodayCalls(result.data || [])
        setTodayPagination({
          page: page,
          limit: result.pagination?.limit || 10,
          total: result.pagination?.total || 0,
          totalPages: result.pagination?.totalPages || 0
        })
      }
    } catch (error) {
      console.error('Error fetching today calls:', error)
    }
  }, [])

  return (
    <PrivateRoute modulePath="/admin/telecaller/my-numbers" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Mobile Numbers</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={() => fetchTodayCalls(1)} className="bg-blue-600 hover:bg-blue-700">
                Today Calls
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Today's Calls ({todayPagination.total})</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mobile Number</TableHead>
                      <TableHead>Disposition</TableHead>
                      <TableHead>Patient Feeling</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Called At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todayCalls.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <p className="text-gray-500">No calls made today</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      todayCalls.map((call: any) => (
                        <TableRow key={call.id}>
                          <TableCell className="font-medium">{call.mobile}</TableCell>
                          <TableCell>{call.disposition || '-'}</TableCell>
                          <TableCell>{call.patient_feeling || '-'}</TableCell>
                          <TableCell>{call.notes || '-'}</TableCell>
                          <TableCell>
                            {call.caller_created_at ? new Date(call.caller_created_at).toLocaleString() : '-'}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                
                {todayCalls.length > 0 && (
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-500">
                      Page {todayPagination.page} of {todayPagination.totalPages || 1} ({todayPagination.total} total)
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={todayPagination.page <= 1}
                        onClick={() => fetchTodayCalls(todayPagination.page - 1)}
                      >
                        Previous
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={todayPagination.page >= (todayPagination.totalPages || 1)}
                        onClick={() => fetchTodayCalls(todayPagination.page + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="from-date">From Date</Label>
                <Input
                  id="from-date"
                  type="date"
                  value={dateFilter.from}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, from: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="to-date">To Date</Label>
                <Input
                  id="to-date"
                  type="date"
                  value={dateFilter.to}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, to: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => fetchMyNumbers(1)}>Apply Filter</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mobile Numbers ({pagination.total})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading mobile numbers...</p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mobile Number</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Disposition</TableHead>
                      <TableHead>Patient Feeling</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Next Call Date</TableHead>
                      <TableHead>Updated At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mobileNumbers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <p className="text-gray-500">No mobile numbers assigned to you</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      mobileNumbers.map((number: any) => (
                        <TableRow key={number.id}>
                          <TableCell className="font-medium">{number.mobile}</TableCell>
                          <TableCell>{number.caller_by ? 'Called' : 'Pending'}</TableCell>
                          <TableCell>{number.disposition || '-'}</TableCell>
                          <TableCell>{number.patient_feeling || '-'}</TableCell>
                          <TableCell>{number.notes || '-'}</TableCell>
                          <TableCell>
                            {number.next_call_date ? new Date(number.next_call_date).toLocaleDateString() : '-'}
                          </TableCell>
                          <TableCell>
                            {number.updated_at ? new Date(number.updated_at).toLocaleDateString() : '-'}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                
                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">
                    Page {pagination.page} of {pagination.totalPages || 1} ({pagination.total} total)
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={pagination.page <= 1 || loading}
                      onClick={() => {
                        const prevPage = Math.max(1, pagination.page - 1)
                        console.log('Previous clicked, going to page:', prevPage)
                        fetchMyNumbers(prevPage)
                      }}
                    >
                      Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={pagination.page >= (pagination.totalPages || 1) || loading}
                      onClick={() => {
                        const nextPage = Math.min(pagination.totalPages || 1, pagination.page + 1)
                        console.log('Next clicked, going to page:', nextPage)
                        fetchMyNumbers(nextPage)
                      }}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  )
}
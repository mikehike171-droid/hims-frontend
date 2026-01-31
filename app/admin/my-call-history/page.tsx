"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Phone, Calendar, Search, User } from "lucide-react"
import authService from "@/lib/authService"

export default function MyCallHistoryPage() {
  const [callHistory, setCallHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    const fromDateStr = firstDay.toISOString().split('T')[0]
    const toDateStr = lastDay.toISOString().split('T')[0]
    
    setFromDate(fromDateStr)
    setToDate(toDateStr)
  }, [])

  useEffect(() => {
    if (fromDate && toDate) {
      fetchCallHistory(fromDate, toDate, 1)
    }
  }, [fromDate, toDate])

  const fetchCallHistory = async (from?: string, to?: string, pageNum?: number) => {
    if (loading) return // Prevent multiple simultaneous calls
    
    try {
      setLoading(true)
      const user = authService.getCurrentUser()
      const locationId = authService.getLocationId()
      const token = authService.getCurrentToken()
      
      if (!user || !token) {
        console.error('No user or token found')
        return
      }

      const apiUrl = authService.getSettingsApiUrl()
      const response = await fetch(
        `${apiUrl}/call-history/user?page=${pageNum || page}&limit=10&locationId=${locationId}&fromDate=${from || fromDate}&toDate=${to || toDate}&userId=${user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.ok) {
        const result = await response.json()
        setCallHistory(result.data || [])
        setTotalPages(result.pagination?.totalPages || 1)
      } else {
        console.error('Failed to fetch call history')
      }
    } catch (error) {
      console.error('Error fetching call history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setPage(1)
    fetchCallHistory()
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    fetchCallHistory(fromDate, toDate, newPage)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleTimeString()
  }

  const user = authService.getCurrentUser()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <User className="h-8 w-8" />
        <h1 className="text-3xl font-bold">My Call History</h1>
        <span className="text-lg text-gray-600">({user?.user_name || 'User'})</span>
      </div>

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
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>My Call History ({callHistory.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading call history...</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Call Duration</TableHead>
                    <TableHead>Disposition</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {callHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No call history found
                      </TableCell>
                    </TableRow>
                  ) : (
                    callHistory.map((call) => (
                      <TableRow key={call.id}>
                        <TableCell>{formatDate(call.caller_created_at || call.caller_updated_at || call.updated_at)}</TableCell>
                        <TableCell>{formatTime(call.caller_created_at || call.caller_updated_at || call.updated_at)}</TableCell>
                        <TableCell>{call.first_name && call.last_name ? `${call.first_name} ${call.last_name}` : call.username || 'Mobile User'}</TableCell>
                        <TableCell>{call.mobile || call.phone || 'N/A'}</TableCell>
                        <TableCell>{call.call_duration || 'N/A'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            call.disposition === 'Answered' ? 'bg-green-100 text-green-800' :
                            call.disposition === 'Not Answered' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {call.disposition || 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell>{call.notes || call.remarks || 'N/A'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
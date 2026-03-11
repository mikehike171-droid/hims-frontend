"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Phone, Calendar, Search } from "lucide-react"
import authService from "@/lib/authService"

export default function OBCallHistoryPage() {
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
    
    setFromDate(firstDay.toISOString().split('T')[0])
    setToDate(lastDay.toISOString().split('T')[0])
  }, [])

  useEffect(() => {
    if (fromDate && toDate) {
      fetchCallHistory()
    }
  }, [fromDate, toDate])

  const fetchCallHistory = async (pageNum = 1) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const locationId = authService.getLocationId()
      
      const response = await fetch(
        `${authService.getSettingsApiUrl()}/mobile-numbers/my-ob-call-history?page=${pageNum}&limit=10&locationId=${locationId}&fromDate=${fromDate}&toDate=${toDate}`,
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
        setPage(pageNum)
      }
    } catch (error) {
      console.error('Error fetching OB call history:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-GB')
  }

  const formatTime = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleTimeString()
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">My OB Call History</h1>

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
              <Label>From Date:</Label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label>To Date:</Label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-40"
              />
            </div>
            <Button onClick={() => fetchCallHistory(1)} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>OB Call History ({callHistory.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Mobile Number</TableHead>
                    <TableHead>Disposition</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {callHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        No call history found
                      </TableCell>
                    </TableRow>
                  ) : (
                    callHistory.map((call) => (
                      <TableRow key={call.id}>
                        <TableCell>{formatDate(call.created_at)}</TableCell>
                        <TableCell>{formatTime(call.created_at)}</TableCell>
                        <TableCell>{call.mobile ? `xxxxxx${call.mobile.slice(-4)}` : 'N/A'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            call.disposition === 'Answered' ? 'bg-green-100 text-green-800' :
                            call.disposition === 'Not Answered' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {call.disposition || 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell>{call.notes || 'N/A'}</TableCell>
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
                    onClick={() => fetchCallHistory(page - 1)}
                    disabled={page <= 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">Page {page} of {totalPages}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchCallHistory(page + 1)}
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

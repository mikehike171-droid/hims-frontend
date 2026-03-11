"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Phone } from "lucide-react"
import authService from "@/lib/authService"

export default function MyOBNextCallDatePage() {
  const [mobileNumbers, setMobileNumbers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  const getCurrentMonthDates = () => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const formatDate = (date: Date) => {
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    }
    return {
      from: formatDate(firstDay),
      to: formatDate(lastDay)
    }
  }
  
  const [fromDate, setFromDate] = useState<string>(getCurrentMonthDates().from)
  const [toDate, setToDate] = useState<string>(getCurrentMonthDates().to)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })

  useEffect(() => {
    fetchNextCallDateNumbers(1)
  }, [])

  const fetchNextCallDateNumbers = async (page = 1) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const locationId = authService.getLocationId()
      
      let url = `${authService.getSettingsApiUrl()}/mobile-numbers/my-next-call-date?page=${page}&limit=10&locationId=${locationId}`
      
      if (fromDate) {
        const [day, month, year] = fromDate.split('/')
        url += `&fromDate=${year}-${month}-${day}`
      }
      
      if (toDate) {
        const [day, month, year] = toDate.split('/')
        url += `&toDate=${year}-${month}-${day}`
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        setMobileNumbers(result.data || [])
        setPagination(result.pagination)
      }
    } catch (error) {
      console.error('Error fetching next call date numbers:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">My OB Next Call Date</h1>

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
              <div className="relative">
                <input
                  id="fromDateInput"
                  type="date"
                  value={fromDate ? (() => {
                    const [day, month, year] = fromDate.split('/')
                    return `${year}-${month}-${day}`
                  })() : ''}
                  onChange={(e) => {
                    const date = new Date(e.target.value)
                    const day = String(date.getDate()).padStart(2, '0')
                    const month = String(date.getMonth() + 1).padStart(2, '0')
                    const year = date.getFullYear()
                    setFromDate(`${day}/${month}/${year}`)
                  }}
                  className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <Input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={fromDate}
                  readOnly
                  className="w-40"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Label>To Date:</Label>
              <div className="relative">
                <input
                  id="toDateInput"
                  type="date"
                  value={toDate ? (() => {
                    const [day, month, year] = toDate.split('/')
                    return `${year}-${month}-${day}`
                  })() : ''}
                  onChange={(e) => {
                    const date = new Date(e.target.value)
                    const day = String(date.getDate()).padStart(2, '0')
                    const month = String(date.getMonth() + 1).padStart(2, '0')
                    const year = date.getFullYear()
                    setToDate(`${day}/${month}/${year}`)
                  }}
                  className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <Input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={toDate}
                  readOnly
                  className="w-40"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <Button onClick={() => fetchNextCallDateNumbers(1)} disabled={loading}>
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>Mobile Numbers ({pagination.total})</span>
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
                    <TableHead>Mobile Number</TableHead>
                    <TableHead>Disposition</TableHead>
                    <TableHead>Patient Feeling</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Next Call Date</TableHead>
                    <TableHead>Last Called</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mobileNumbers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No mobile numbers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    mobileNumbers.map((number) => (
                      <TableRow key={number.id}>
                        <TableCell>{number.mobile ? `xxxxxx${number.mobile.slice(-4)}` : 'N/A'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            number.disposition === 'Answered' ? 'bg-green-100 text-green-800' :
                            number.disposition === 'Not Answered' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {number.disposition || 'N/A'}
                          </span>
                        </TableCell>
                        <TableCell>{number.patient_feeling || 'N/A'}</TableCell>
                        <TableCell>{number.notes || 'N/A'}</TableCell>
                        <TableCell>{formatDate(number.next_call_date)}</TableCell>
                        <TableCell>{number.caller_created_at ? new Date(number.caller_created_at).toLocaleString() : 'N/A'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchNextCallDateNumbers(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">Page {pagination.page} of {pagination.totalPages}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchNextCallDateNumbers(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
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

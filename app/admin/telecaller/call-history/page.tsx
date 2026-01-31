"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function CallHistoryPage() {
  const [callHistory, setCallHistory] = useState([])
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState("all")
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [selectedBranchId, setSelectedBranchId] = useState(authService.getSelectedBranchId())
  const hasFetched = useRef(false)
  
  // Date filter states - default to current month
  const getCurrentMonthDates = () => {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return {
      from: firstDay.toISOString().split('T')[0],
      to: lastDay.toISOString().split('T')[0]
    }
  }
  
  const [dateFilter, setDateFilter] = useState(getCurrentMonthDates())

  useEffect(() => {
    if (!hasFetched.current) {
      fetchUsers()
      fetchCallHistory(1)
      hasFetched.current = true
    }
  }, [])

  useEffect(() => {
    const handleBranchChange = () => {
      const currentBranchId = authService.getSelectedBranchId()
      if (currentBranchId !== selectedBranchId) {
        setSelectedBranchId(currentBranchId)
        fetchCallHistory(1)
      }
    }

    window.addEventListener('branchChanged', handleBranchChange)
    return () => window.removeEventListener('branchChanged', handleBranchChange)
  }, [selectedBranchId])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/mobile-assign/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const usersData = await response.json()
        setUsers(usersData)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }



  const fetchCallHistory = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      const selectedBranchId = authService.getSelectedBranchId()
      const locationId = selectedBranchId ? parseInt(selectedBranchId) : undefined
      
      let url = `${authService.getSettingsApiUrl()}/call-history/all?page=${page}&limit=10`
      
      if (locationId) {
        url += `&locationId=${locationId}`
      }
      
      if (dateFilter.from) {
        url += `&fromDate=${dateFilter.from}`
      }
      
      if (dateFilter.to) {
        url += `&toDate=${dateFilter.to}`
      }
      
      if (selectedUser && selectedUser !== 'all') {
        url = `${authService.getSettingsApiUrl()}/call-history/user/${selectedUser}?page=${page}&limit=10`
        if (locationId) {
          url += `&locationId=${locationId}`
        }
        if (dateFilter.from) {
          url += `&fromDate=${dateFilter.from}`
        }
        if (dateFilter.to) {
          url += `&toDate=${dateFilter.to}`
        }
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const result = await response.json()
        setCallHistory(result.data)
        setPagination(result.pagination)
      }
    } catch (error) {
      console.error('Error fetching call history:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedUser, dateFilter])

  const handleUserChange = (userId: string) => {
    setSelectedUser(userId)
    fetchCallHistory(1)
  }

  return (
    <PrivateRoute>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Patient Call History</h1>

        <Card>
          <CardHeader>
            <CardTitle>Patient Call History Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-2 mb-4">
              <div>
                <Label htmlFor="user-select">Select User</Label>
                <Select value={selectedUser} onValueChange={handleUserChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select user to view call history" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {users.map((user: any) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.first_name} {user.last_name} ({user.username})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
              <Button onClick={() => fetchCallHistory(1)}>Apply Filter</Button>
            </div>
          </CardContent>
        </Card>

        {callHistory.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Call History ({pagination.total})</CardTitle>
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
                        <TableHead>Caller Name</TableHead>
                        <TableHead>Disposition</TableHead>
                        <TableHead>Patient Feeling</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Next Call Date</TableHead>
                        <TableHead>Called At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {callHistory.map((call: any) => (
                        <TableRow key={call.id}>
                          <TableCell>{call.mobile}</TableCell>
                          <TableCell>{call.first_name && call.last_name ? `${call.first_name} ${call.last_name}` : '-'}</TableCell>
                          <TableCell>{call.disposition || '-'}</TableCell>
                          <TableCell>{call.patient_feeling || '-'}</TableCell>
                          <TableCell>{call.notes || '-'}</TableCell>
                          <TableCell>{call.next_call_date ? new Date(call.next_call_date).toLocaleDateString() : '-'}</TableCell>
                          <TableCell>{call.caller_updated_at ? new Date(call.caller_updated_at).toLocaleString() : '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {/* Pagination */}
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-500">
                      Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={pagination.page <= 1}
                        onClick={() => fetchCallHistory(pagination.page - 1)}
                      >
                        Previous
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={pagination.page >= pagination.totalPages}
                        onClick={() => fetchCallHistory(pagination.page + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          !loading && (
            <Card>
              <CardHeader>
                <CardTitle>Call History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">No call history found</p>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </PrivateRoute>
  )
}
"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"

// Same helper as mobile-numbers page — reads active location from localStorage
function getActiveLocationId(): number | null {
  if (typeof window === 'undefined') return null
  try {
    const branchId = localStorage.getItem('selectedBranchId')
    if (branchId && branchId !== 'null') return parseInt(branchId)
    const selectedLoc = localStorage.getItem('selected_location_id')
    if (selectedLoc && selectedLoc !== 'null') return parseInt(selectedLoc)
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user?.primary_location_id) return parseInt(String(user.primary_location_id))
  } catch { /* ignore */ }
  return null
}

export default function AssignMobilePage() {
  const [unassignedNumbers, setUnassignedNumbers] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])
  const [selectedUser, setSelectedUser] = useState("")
  const [loading, setLoading] = useState(false)
  const [assigning, setAssigning] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const [numberCount, setNumberCount] = useState("")
  const [locationName, setLocationName] = useState<string>('')
  const [activeLocationId, setActiveLocationId] = useState<number | null>(null)
  const [userSearch, setUserSearch] = useState("")
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  useEffect(() => {
    const locId = getActiveLocationId()
    setActiveLocationId(locId)
    loadLocationName(locId)
    fetchData(1, locId)
    fetchUsers(locId)

    const onBranchChange = () => {
      const newLocId = getActiveLocationId()
      setActiveLocationId(newLocId)
      loadLocationName(newLocId)
      fetchData(1, newLocId)
      fetchUsers(newLocId)
      setSelectedNumbers([])
      setSelectedUser("")
    }
    window.addEventListener('locationChanged', onBranchChange)
    window.addEventListener('branchChanged', onBranchChange)
    return () => {
      window.removeEventListener('locationChanged', onBranchChange)
      window.removeEventListener('branchChanged', onBranchChange)
    }
  }, [])

  const loadLocationName = async (locId: number | null) => {
    if (!locId) { setLocationName(''); return }
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch(`${authService.getSettingsApiUrl()}/settings/locations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const list = await res.json()
        const found = Array.isArray(list) ? list.find((l: any) => Number(l.id) === locId) : null
        setLocationName(found ? found.name : `Location ${locId}`)
      }
    } catch { /* silent */ }
  }

  const fetchData = async (page = 1, locId: number | null = getActiveLocationId()) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      const locationParam = locId ? `&locationId=${locId}` : ''
      const url = `${authService.getSettingsApiUrl()}/mobile-assign/unassigned?page=${page}&limit=10${locationParam}`
      console.log('[AssignMobile] fetchData url:', url)
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      })
      if (res.ok) {
        const result = await res.json()
        setUnassignedNumbers(result.data || [])
        setPagination(result.pagination)
      }
    } catch (err) {
      console.error('Error fetching unassigned numbers:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async (locId: number | null = getActiveLocationId()) => {
    try {
      const token = localStorage.getItem('authToken')
      const locationParam = locId ? `?locationId=${locId}` : ''
      const url = `${authService.getSettingsApiUrl()}/mobile-assign/users${locationParam}`
      console.log('[AssignMobile] fetchUsers url:', url)
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      })
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (err) {
      console.error('Error fetching users:', err)
    }
  }

  const handleNumberSelect = (numberId: number, checked: boolean) => {
    setSelectedNumbers(prev =>
      checked ? [...prev, numberId] : prev.filter(id => id !== numberId)
    )
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectedNumbers(checked ? unassignedNumbers.map((num: any) => num.id) : [])
  }

  const handleAssign = async () => {
    if (selectedNumbers.length === 0 || !selectedUser) {
      alert('Please select numbers and a user')
      return
    }
    setAssigning(true)
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch(`${authService.getSettingsApiUrl()}/mobile-assign/assign`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileIds: selectedNumbers, userId: parseInt(selectedUser) })
      })
      if (res.ok) {
        const result = await res.json()
        alert(`Successfully assigned ${result.count} numbers`)
        setSelectedNumbers([])
        setSelectedUser("")
        fetchData(1)
      } else {
        alert('Failed to assign numbers')
      }
    } catch {
      alert('Error assigning numbers')
    } finally {
      setAssigning(false)
    }
  }

  const handleAssignByCount = async () => {
    if (!selectedUser || !numberCount) {
      alert('Please select user and enter number count')
      return
    }
    const count = parseInt(numberCount)
    if (count <= 0 || count > pagination.total) {
      alert(`Please enter a number between 1 and ${pagination.total}`)
      return
    }
    setAssigning(true)
    try {
      const token = localStorage.getItem('authToken')
      const res = await fetch(`${authService.getSettingsApiUrl()}/mobile-assign/assign`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ count, userId: parseInt(selectedUser) })
      })
      if (res.ok) {
        const result = await res.json()
        if (result.success === false) {
          alert(result.message || 'Failed to assign numbers')
        } else {
          alert(`Successfully assigned ${result.count} numbers`)
          setSelectedUser("")
          setNumberCount("")
          fetchData(1)
        }
      } else {
        alert('Failed to assign numbers')
      }
    } catch {
      alert('Error assigning numbers')
    } finally {
      setAssigning(false)
    }
  }

  return (
    <PrivateRoute modulePath="admin/telecaller/assign-mobile" action="view">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Assign Mobile Numbers to Employee</h1>
          {activeLocationId ? (
            <p className="text-sm text-muted-foreground mt-1">
              Location: <span className="font-semibold text-primary">{locationName || `ID: ${activeLocationId}`}</span>
            </p>
          ) : (
            <p className="text-sm text-orange-500 mt-1">⚠ No location selected</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Select User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Searchable User Picker */}
              <div className="relative">
                <Input
                  placeholder="Search employee by name or username..."
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value)
                    setShowUserDropdown(true)
                    if (!e.target.value) setSelectedUser("")
                  }}
                  onFocus={() => setShowUserDropdown(true)}
                  onBlur={() => setTimeout(() => setShowUserDropdown(false), 200)}
                  className="w-full"
                />
                {showUserDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-52 overflow-y-auto">
                    {users
                      .filter((u: any) =>
                        !userSearch ||
                        `${u.first_name} ${u.last_name}`.toLowerCase().includes(userSearch.toLowerCase()) ||
                        u.username?.toLowerCase().includes(userSearch.toLowerCase())
                      )
                      .map((user: any) => (
                        <div
                          key={user.id}
                          className={`px-3 py-2 cursor-pointer hover:bg-blue-50 text-sm ${
                            selectedUser === user.id.toString() ? 'bg-blue-100 font-medium' : ''
                          }`}
                          onMouseDown={() => {
                            setSelectedUser(user.id.toString())
                            setUserSearch(`${user.first_name} ${user.last_name} (${user.username})`)
                            setShowUserDropdown(false)
                          }}
                        >
                          {user.first_name} {user.last_name}
                          <span className="text-gray-400 ml-1">({user.username})</span>
                        </div>
                      ))}
                    {users.filter((u: any) =>
                      !userSearch ||
                      `${u.first_name} ${u.last_name}`.toLowerCase().includes(userSearch.toLowerCase()) ||
                      u.username?.toLowerCase().includes(userSearch.toLowerCase())
                    ).length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-400">No users found</div>
                    )}
                  </div>
                )}
              </div>

              <Input
                type="number"
                placeholder="Enter number of records to assign"
                value={numberCount}
                onChange={(e) => setNumberCount(e.target.value)}
                min="1"
                max={pagination.total}
              />

              <Button
                onClick={handleAssignByCount}
                disabled={assigning || !selectedUser || !numberCount}
                className="w-full"
              >
                {assigning ? 'Assigning...' : 'Assign Numbers'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assignment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Selected Numbers: {selectedNumbers.length}</p>
              <p>Available Numbers: {pagination.total}</p>
              {locationName && (
                <p className="text-sm text-muted-foreground mt-1">Location: {locationName}</p>
              )}
              <Button
                onClick={handleAssign}
                disabled={assigning || selectedNumbers.length === 0 || !selectedUser}
                className="mt-4 w-full"
              >
                {assigning ? 'Assigning...' : 'Assign Selected'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              Unassigned Mobile Numbers ({pagination.total})
              {locationName && <span className="text-sm font-normal text-muted-foreground ml-2">— {locationName}</span>}
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="selectAll"
                  checked={selectedNumbers.length === unassignedNumbers.length && unassignedNumbers.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="selectAll" className="text-sm">Select All</label>
              </div>
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
                      <TableHead>Select</TableHead>
                      <TableHead>Mobile Number</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unassignedNumbers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                          No unassigned numbers{locationName ? ` for ${locationName}` : ''}
                        </TableCell>
                      </TableRow>
                    ) : (
                      unassignedNumbers.map((number: any) => (
                        <TableRow key={number.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedNumbers.includes(number.id)}
                              onCheckedChange={(checked) => handleNumberSelect(number.id, checked as boolean)}
                            />
                          </TableCell>
                          <TableCell>{number.mobile}</TableCell>
                          <TableCell>{new Date(number.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">
                    Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page <= 1}
                      onClick={() => fetchData(pagination.page - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => fetchData(pagination.page + 1)}
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
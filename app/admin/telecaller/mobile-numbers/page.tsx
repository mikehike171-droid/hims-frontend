"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Download } from "lucide-react"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"

// Reads the currently active location ID from localStorage.
// Priority matches how branch-context stores it:
//   1. selectedBranchId  — set UNCONDITIONALLY on every branch switch (always current)
//   2. selected_location_id — set when switch-location API succeeds
//   3. user.primary_location_id — original login location (final fallback)
function getActiveLocationId(): number | null {
  if (typeof window === 'undefined') return null
  try {
    // 1. Always-updated on branch switch
    const branchId = localStorage.getItem('selectedBranchId')
    if (branchId && branchId !== 'null') return parseInt(branchId)

    // 2. Updated when switch-location API call succeeds
    const selectedLoc = localStorage.getItem('selected_location_id')
    if (selectedLoc && selectedLoc !== 'null') return parseInt(selectedLoc)

    // 3. Original login location
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user?.primary_location_id) return parseInt(String(user.primary_location_id))
  } catch { /* ignore */ }
  return null
}

export default function MobileNumbersPage() {
  const [mobileNumbers, setMobileNumbers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [newMobile, setNewMobile] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [locationName, setLocationName] = useState<string>('')
  const [activeLocationId, setActiveLocationId] = useState<number | null>(null)
  const limit = 10

  // Read current location on mount and on branch change
  useEffect(() => {
    const locId = getActiveLocationId()
    setActiveLocationId(locId)
    loadLocationName(locId)

    const onBranchChange = () => {
      const newLocId = getActiveLocationId()
      setActiveLocationId(newLocId)
      loadLocationName(newLocId)
      fetchMobileNumbers(1, newLocId)
      setPage(1)
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

  const fetchMobileNumbers = async (pageNum: number = page, locId: number | null = getActiveLocationId()) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('authToken')
      const locationParam = locId ? `&locationId=${locId}` : ''
      const url = `${authService.getSettingsApiUrl()}/mobile-assign/unassigned?page=${pageNum}&limit=${limit}${locationParam}`
      console.log('[MobileNumbers] fetch url:', url, '| locationId:', locId)
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      })
      if (res.ok) {
        const result = await res.json()
        setMobileNumbers(result.data || [])
        setTotalPages(result.pagination?.totalPages || 1)
        setTotal(result.pagination?.total || 0)
      }
    } catch (err) {
      console.error('fetchMobileNumbers error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const locId = getActiveLocationId()
    setActiveLocationId(locId)
    fetchMobileNumbers(page, locId)
  }, [page])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Read location FRESH at the moment of upload
    const locId = getActiveLocationId()
    console.log('[BulkUpload] activeLocationId:', locId)

    if (!locId) {
      alert('No location selected. Please select a location first.')
      event.target.value = ''
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const token = localStorage.getItem('authToken')

      // Pass locationId as query param to backend
      const url = `${authService.getSettingsApiUrl()}/mobile-numbers/bulk-upload?locationId=${locId}`
      console.log('[BulkUpload] POST url:', url)

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      if (res.ok) {
        const result = await res.json()
        alert(`Successfully uploaded ${result.count} mobile numbers for location ${locId}`)
        fetchMobileNumbers(1, locId)
        setPage(1)
      } else {
        const err = await res.json().catch(() => ({}))
        alert(err.message || 'Failed to upload file')
      }
    } catch {
      alert('Error uploading file')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const handleAddMobile = async () => {
    if (!newMobile.trim()) return

    // Read location FRESH at the moment of adding
    const locId = getActiveLocationId()
    console.log('[AddMobile] activeLocationId:', locId)

    if (!locId) {
      alert('No location selected. Please select a location first.')
      return
    }

    try {
      const token = localStorage.getItem('authToken')
      const body = { mobile: newMobile.trim(), locationId: locId }
      console.log('[AddMobile] POST body:', JSON.stringify(body))

      const res = await fetch(`${authService.getSettingsApiUrl()}/mobile-numbers`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (res.ok) {
        setNewMobile("")
        fetchMobileNumbers(1, locId)
        setPage(1)
      } else {
        const err = await res.json().catch(() => ({}))
        alert(err.message || 'Failed to add mobile number')
      }
    } catch (err) {
      console.error('handleAddMobile error:', err)
    }
  }

  const downloadTemplate = () => {
    const csvContent = "mobile\n9876543210\n9876543211\n9876543212"
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mobile_numbers_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <PrivateRoute modulePath="admin/telecaller/mobile-numbers" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Mobile Numbers Management</h1>
            {activeLocationId ? (
              <p className="text-sm text-muted-foreground mt-1">
                Location: <span className="font-semibold text-primary">{locationName || `ID: ${activeLocationId}`}</span>
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  ID = {activeLocationId}
                </span>
              </p>
            ) : (
              <p className="text-sm text-orange-500 mt-1">⚠ No location selected</p>
            )}
          </div>
          <Button onClick={downloadTemplate} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  disabled={uploading || !activeLocationId}
                />
                <p className="text-sm text-gray-500 mt-2">
                  CSV uploads will be saved to: <strong>{locationName || `Location ${activeLocationId}`}</strong>
                </p>
              </div>
              {uploading && <p className="text-blue-600">Uploading...</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Single Number</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter mobile number"
                  value={newMobile}
                  onChange={(e) => setNewMobile(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddMobile()}
                  disabled={!activeLocationId}
                />
                <Button onClick={handleAddMobile} disabled={!activeLocationId}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Will be inserted with location_id = <strong>{activeLocationId ?? 'none'}</strong>
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              Mobile Numbers ({total})
              {locationName && <span className="text-sm font-normal text-muted-foreground ml-2">— {locationName}</span>}
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
                      <TableHead>Location</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mobileNumbers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                          No records found{locationName ? ` for ${locationName}` : ''}
                        </TableCell>
                      </TableRow>
                    ) : (
                      mobileNumbers.map((number: any) => (
                        <TableRow key={number.id}>
                          <TableCell>{number.mobile}</TableCell>
                          <TableCell>{locationName || number.location_id}</TableCell>
                          <TableCell>{new Date(number.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">
                    Page {page} of {totalPages} (Total: {total})
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      variant="outline"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      variant="outline"
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
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, Plus, Download } from "lucide-react"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function MobileNumbersPage() {
  const [mobileNumbers, setMobileNumbers] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [newMobile, setNewMobile] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 10

  useEffect(() => {
    fetchMobileNumbers()
  }, [page])

  const fetchMobileNumbers = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/mobile-assign/unassigned?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const result = await response.json()
        setMobileNumbers(result.data || [])
        setTotalPages(result.pagination?.totalPages || 1)
        setTotal(result.pagination?.total || 0)
      }
    } catch (error) {
      console.error('Error fetching mobile numbers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/mobile-numbers/bulk-upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Successfully uploaded ${result.count} mobile numbers`)
        fetchMobileNumbers()
      } else {
        alert('Failed to upload file')
      }
    } catch (error) {
      alert('Error uploading file')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const handleAddMobile = async () => {
    if (!newMobile) return

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/mobile-numbers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile: newMobile })
      })

      if (response.ok) {
        setNewMobile("")
        fetchMobileNumbers()
      }
    } catch (error) {
      console.error('Error adding mobile number:', error)
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
          <h1 className="text-2xl font-bold">Mobile Numbers Management</h1>
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
                  disabled={uploading}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Upload CSV file with mobile numbers
                </p>
              </div>
              {uploading && (
                <p className="text-blue-600">Uploading...</p>
              )}
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
                />
                <Button onClick={handleAddMobile}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Mobile Numbers ({total})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Mobile Number</TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mobileNumbers.map((number: any) => (
                    <TableRow key={number.id}>
                      <TableCell>{number.id}</TableCell>
                      <TableCell>{number.mobile}</TableCell>
                      <TableCell>{new Date(number.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Page {page} of {totalPages} (Total: {total} numbers)
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
"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, DollarSign, RefreshCw, Minus, TrendingDown, Download } from 'lucide-react'
import authService from '@/lib/authService'
import settingsApi, { ApprovedExpense } from '@/lib/settingsApi'
import PrivateRoute from "@/components/auth/PrivateRoute"

interface CashCollection {
  date: string
  credit: string
  debit: string
  balance: string
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface CashCollectionsResponse {
  data: CashCollection[]
  pagination: PaginationInfo
  summary: {
    totalCash: number
    totalExpenses: number
    currentBalance: number
  }
}

export default function CashbookPage() {
  const [collections, setCollections] = useState<CashCollection[]>([])
  const [summary, setSummary] = useState({ totalCash: 0, totalExpenses: 0, currentBalance: 0 })
  const [approvedExpenses, setApprovedExpenses] = useState<ApprovedExpense[]>([])
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })
  const [loading, setLoading] = useState(false)
  const [showTable, setShowTable] = useState(false)
  const hasLoadedRef = useRef(false)
  const expensesLoadedRef = useRef(false)

  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true
      fetchCashCollections()
    }
    if (!expensesLoadedRef.current) {
      expensesLoadedRef.current = true
      fetchApprovedExpenses()
    }
  }, [])

  const fetchApprovedExpenses = async () => {
    try {
      const locationId = authService.getLocationId()
      const response = await settingsApi.getApprovedExpensesByLocation(
        locationId ? parseInt(locationId) : undefined
      )
      setApprovedExpenses(response)
    } catch (error) {
      console.error('Error fetching approved expenses:', error)
    }
  }

  const fetchCashCollections = async (page: number = 1) => {
    try {
      setLoading(true)
      const locationId = authService.getLocationId()
      const params: any = {
        locationId: locationId ? parseInt(locationId) : undefined,
        page,
        limit: 10
      }
      if (fromDate) params.fromDate = fromDate
      if (toDate) params.toDate = toDate
      
      const response = await settingsApi.getCashCollections(
        params.locationId,
        params.page,
        params.limit,
        params.fromDate,
        params.toDate
      )
      setCollections(response.data)
      setPagination(response.pagination)
      if (response.summary) {
        setSummary(response.summary)
      }
    } catch (error) {
      console.error('Error fetching cash collections:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTotalCash = () => {
    return summary.totalCash
  }

  const getTotalApprovedExpenses = () => {
    return summary.totalExpenses
  }

  const getRemainingBalance = () => {
    return summary.currentBalance
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const handleDownloadExcel = () => {
    // Prepare data for Excel
    const excelData = collections.map(item => ({
      'Date': formatDate(item.date),
      'Credit Amount': Number(item.credit) > 0 ? Number(item.credit).toFixed(2) : '-',
      'Debit Amount': Number(item.debit) > 0 ? Number(item.debit).toFixed(2) : '-',
      'Balance': Number(item.balance).toFixed(2)
    }))

    // Add summary row
    excelData.push({
      'Date': 'SUMMARY',
      'Credit Amount': getTotalCash().toFixed(2),
      'Debit Amount': getTotalApprovedExpenses().toFixed(2),
      'Balance': getRemainingBalance().toFixed(2)
    })

    // Convert to CSV
    const headers = Object.keys(excelData[0])
    const csvContent = [
      headers.join(','),
      ...excelData.map(row => headers.map(header => row[header]).join(','))
    ].join('\n')

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cashbook_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <PrivateRoute modulePath="admin/accounts/cashbook" action="view">
      <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cash Book</h1>
          <p className="text-gray-600">Cash-only payment collections</p>
        </div>
        <div className="flex gap-2">
          <div>
            <Label>From Date</Label>
            <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div>
            <Label>To Date</Label>
            <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
          <Button onClick={() => {
            fetchCashCollections(1)
            fetchApprovedExpenses()
          }} disabled={loading} className="mt-6">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Search
          </Button>
          <Button onClick={handleDownloadExcel} disabled={loading || collections.length === 0} className="mt-6 bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Download Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setShowTable(!showTable)}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(getTotalCash())}
                </div>
                <div className="text-sm text-gray-600">Total Cash Collections</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Minus className="h-8 w-8 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(getTotalApprovedExpenses())}
                </div>
                <div className="text-sm text-gray-600">Approved Expenses</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className={`h-8 w-8 ${getRemainingBalance() >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
              <div>
                <div className={`text-2xl font-bold ${getRemainingBalance() >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(getRemainingBalance())}
                </div>
                <div className="text-sm text-gray-600">Remaining Balance</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Badge variant="default" className="bg-green-600 text-lg px-3 py-1">CASH ONLY</Badge>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {pagination.total}
                </div>
                <div className="text-sm text-gray-600">Cash Transactions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showTable && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cash Book Transactions ({pagination.total}) - Page {pagination.page} of {pagination.totalPages}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Credit Amount</TableHead>
                    <TableHead>Debit Amount</TableHead>
                    <TableHead>Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        Loading transactions...
                      </TableCell>
                    </TableRow>
                  ) : collections.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    collections.map((item, index) => (
                      <TableRow key={`${item.date}-${index}`}>
                        <TableCell>{formatDate(item.date)}</TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {Number(item.credit) > 0 ? formatCurrency(Number(item.credit)) : '-'}
                        </TableCell>
                        <TableCell className="font-semibold text-red-600">
                          {Number(item.debit) > 0 ? formatCurrency(Number(item.debit)) : '-'}
                        </TableCell>
                        <TableCell className={`font-bold ${Number(item.balance) >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                          {formatCurrency(Number(item.balance))}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchCashCollections(pagination.page - 1)}
                      disabled={!pagination.hasPrev || loading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchCashCollections(pagination.page + 1)}
                      disabled={!pagination.hasNext || loading}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </PrivateRoute>
  )
}
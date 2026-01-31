"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, DollarSign, RefreshCw, Minus, TrendingDown } from 'lucide-react'
import authService from '@/lib/authService'
import settingsApi, { ApprovedExpense } from '@/lib/settingsApi'

interface CashCollection {
  installmentid: number
  examinationdate: string
  totalamount: string
  installmentamount: string
  paymentdate: string
  paymentmethod: string
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
}

export default function CashbookPage() {
  const [collections, setCollections] = useState<CashCollection[]>([])
  const [approvedExpenses, setApprovedExpenses] = useState<ApprovedExpense[]>([])
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
      const response = await settingsApi.getCashCollections(
        locationId ? parseInt(locationId) : undefined,
        page,
        10
      )
      setCollections(response.data)
      setPagination(response.pagination)
    } catch (error) {
      console.error('Error fetching cash collections:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTotalCash = () => {
    return collections.reduce((sum, collection) => sum + Number(collection.installmentamount), 0)
  }

  const getTotalApprovedExpenses = () => {
    return approvedExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
  }

  const getRemainingBalance = () => {
    return getTotalCash() - getTotalApprovedExpenses()
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString()
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cash Book</h1>
          <p className="text-gray-600">Cash-only payment collections</p>
        </div>
        <Button onClick={() => {
          fetchCashCollections(1)
          fetchApprovedExpenses()
        }} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
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
              <CardTitle>Cash Collections ({pagination.total}) - Page {pagination.page} of {pagination.totalPages}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Examination Date</TableHead>
                    <TableHead>Payment Time</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        Loading cash collections...
                      </TableCell>
                    </TableRow>
                  ) : collections.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        No cash collections found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    collections.map((collection) => (
                      <TableRow key={collection.installmentid}>
                        <TableCell>{formatDate(collection.examinationdate)}</TableCell>
                        <TableCell>{formatTime(collection.paymentdate)}</TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-600">CASH</Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-green-600">
                          {formatCurrency(Number(collection.installmentamount))}
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

          <Card>
            <CardHeader>
              <CardTitle>Approved Expenses ({approvedExpenses.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedExpenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No approved expenses found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    approvedExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>
                          <div className="font-medium">
                            {expense.employee.firstName} {expense.employee.lastName}
                          </div>
                        </TableCell>
                        <TableCell>{expense.expenseCategory.name}</TableCell>
                        <TableCell>{formatDate(expense.expenseDate)}</TableCell>
                        <TableCell>{expense.description || 'N/A'}</TableCell>
                        <TableCell className="font-semibold text-red-600">
                          -{formatCurrency(Number(expense.amount))}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
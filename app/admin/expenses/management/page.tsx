"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Check, X, Eye, Filter, FileText, Calendar as CalendarIcon, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import authService from '@/lib/authService'
import settingsApi from '@/lib/settingsApi'
import PrivateRoute from "@/components/auth/PrivateRoute"
import { format } from 'date-fns'

interface ExpenseCategory {
  id: number
  name: string
  description?: string
}

interface Employee {
  id: number
  firstName: string
  lastName: string
  email: string
}

interface EmployeeExpense {
  id: number
  amount: number
  description?: string
  expenseDate: string
  receipt?: string
  status: 'pending' | 'approved' | 'rejected' | 'paid'
  expenseCategory: ExpenseCategory
  employee: Employee
  rejectionReason?: string
  createdAt: string
}

export default function ExpenseManagementPage() {
  const [expenses, setExpenses] = useState<EmployeeExpense[]>([])
  const [filteredExpenses, setFilteredExpenses] = useState<EmployeeExpense[]>([])
  const [categories, setCategories] = useState<ExpenseCategory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<EmployeeExpense | null>(null)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const expensesLoadedRef = useRef(false)
  const categoriesLoadedRef = useRef(false)

  // Filters
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  // Pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalRecords, setTotalRecords] = useState(0)

  useEffect(() => {
    if (!expensesLoadedRef.current) {
      expensesLoadedRef.current = true
      fetchAllExpenses()
    }
    if (!categoriesLoadedRef.current) {
      categoriesLoadedRef.current = true
      fetchCategories()
    }
  }, [])

  useEffect(() => {
    applyFilters()
  }, [expenses, statusFilter, categoryFilter, searchTerm])

  const fetchAllExpenses = async (currentPage = page, filters: any = {}) => {
    try {
      setIsLoading(true)
      const queryFilters = {
        ...filters,
        fromDate: fromDate || filters.fromDate,
        toDate: toDate || filters.toDate,
        page: currentPage,
        limit: 10
      }
      const response = await settingsApi.getAllEmployeeExpenses(queryFilters)
      setExpenses(response.data || [])
      setTotalRecords(response.total || 0)
      setTotalPages(response.totalPages || 0)
      setPage(response.page || 1)
    } catch (error) {
      console.error('Error fetching expenses:', error)
      setExpenses([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    if (categoriesLoadedRef.current && categories.length > 0) return
    try {
      const data = await settingsApi.getExpenseCategories()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const applyFilters = () => {
    let filtered = expenses

    if (statusFilter !== 'all') {
      filtered = filtered.filter(expense => expense.status === statusFilter)
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(expense => expense.expenseCategory.id === parseInt(categoryFilter))
    }

    if (searchTerm) {
      filtered = filtered.filter(expense =>
        expense.employee?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.employee?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.employee?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.expenseCategory.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredExpenses(filtered)
  }

  const handleSearch = () => {
    setPage(1)
    fetchAllExpenses(1)
  }

  const handleApprove = async (expenseId: number) => {
    if (!confirm('Are you sure you want to approve this expense?')) return

    try {
      await settingsApi.updateExpenseStatus(expenseId, 'approved')
      expensesLoadedRef.current = false
      fetchAllExpenses()
      alert('Expense approved successfully!')
    } catch (error) {
      console.error('Error approving expense:', error)
      alert('Error approving expense')
    }
  }

  const handleReject = async () => {
    if (!selectedExpense || !rejectionReason.trim()) return

    try {
      await settingsApi.updateExpenseStatus(selectedExpense.id, 'rejected', rejectionReason)
      expensesLoadedRef.current = false
      fetchAllExpenses()
      setShowRejectDialog(false)
      setRejectionReason('')
      setSelectedExpense(null)
      alert('Expense rejected successfully!')
    } catch (error) {
      console.error('Error rejecting expense:', error)
      alert('Error rejecting expense')
    }
  }

  const getStatusBadge = (status: string) => {
    if (!status) return <Badge className="bg-gray-100 text-gray-800">UNKNOWN</Badge>

    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      paid: 'bg-blue-100 text-blue-800'
    }
    return <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>{status.toUpperCase()}</Badge>
  }

  const getTotalAmount = () => {
    return filteredExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0)
  }

  const getPageNumbers = () => {
    const pages = [];
    const windowSize = 7;
    let start = Math.max(1, page - Math.floor(windowSize / 2));
    let end = Math.min(totalPages, start + windowSize - 1);

    if (end - start + 1 < windowSize) {
      start = Math.max(1, end - windowSize + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  return (
    <PrivateRoute modulePath="admin/expenses/management" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Expense Management</h1>
            <p className="text-gray-600">Review and approve employee expense applications</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {expenses.filter(e => e.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {expenses.filter(e => e.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {expenses.filter(e => e.status === 'rejected').length}
              </div>
              <div className="text-sm text-gray-600">Rejected</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                ₹{getTotalAmount().toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Amount</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-6 gap-4">
              <div>
                <Label>Search Employee</Label>
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-200",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {fromDate ? format(new Date(fromDate), "dd/MM/yyyy") : <span>From Date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-xl bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={fromDate ? new Date(fromDate) : undefined}
                      onSelect={(date: Date | undefined) => setFromDate(date ? format(date, 'yyyy-MM-dd') : '')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col gap-2">
                <Label>To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal border-gray-200",
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {toDate ? format(new Date(toDate), "dd/MM/yyyy") : <span>To Date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-xl bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={toDate ? new Date(toDate) : undefined}
                      onSelect={(date: Date | undefined) => setToDate(date ? format(date, 'yyyy-MM-dd') : '')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} disabled={isLoading}>
                  {isLoading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Table */}
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-gray-100/50 bg-white/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Employee Expenses ({totalRecords})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {expense.employee?.firstName || 'N/A'} {expense.employee?.lastName || ''}
                        </div>
                        <div className="text-sm text-gray-500">{expense.employee?.email || 'N/A'}</div>
                      </div>
                    </TableCell>
                    <TableCell>{expense.expenseDate ? format(new Date(expense.expenseDate), 'dd/MM/yyyy') : 'N/A'}</TableCell>
                    <TableCell>{expense.expenseCategory.name}</TableCell>
                    <TableCell>₹{Number(expense.amount).toFixed(2)}</TableCell>
                    <TableCell>
                      {expense.receipt ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`${process.env.NEXT_PUBLIC_SETTINGS_API_URL?.replace('/api', '')}/${expense.receipt}`, '_blank')}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      ) : (
                        <span className="text-gray-400">No file</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(expense.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Expense Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div><strong>Employee:</strong> {expense.employee?.firstName || 'N/A'} {expense.employee?.lastName || ''}</div>
                              <div><strong>Category:</strong> {expense.expenseCategory.name}</div>
                              <div><strong>Amount:</strong> ₹{Number(expense.amount).toFixed(2)}</div>
                              <div><strong>Date:</strong> {expense.expenseDate ? format(new Date(expense.expenseDate), 'dd/MM/yyyy') : 'N/A'}</div>
                              <div>
                                <strong>Receipt:</strong>
                                {expense.receipt ? (
                                  <Button
                                    size="sm"
                                    variant="link"
                                    onClick={() => window.open(`${process.env.NEXT_PUBLIC_SETTINGS_API_URL?.replace('/api', '')}/${expense.receipt}`, '_blank')}
                                  >
                                    View Receipt
                                  </Button>
                                ) : (
                                  ' N/A'
                                )}
                              </div>
                              <div><strong>Description:</strong> {expense.description || 'N/A'}</div>
                              <div><strong>Status:</strong> {getStatusBadge(expense.status)}</div>
                              {expense.rejectionReason && (
                                <div><strong>Rejection Reason:</strong> {expense.rejectionReason}</div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        {expense.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600"
                              onClick={() => handleApprove(expense.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600"
                              onClick={() => {
                                setSelectedExpense(expense)
                                setShowRejectDialog(true)
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredExpenses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No expenses found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            {!isLoading && totalRecords > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t gap-4">
                <div className="text-sm text-gray-600">
                  Showing {Math.min(((page - 1) * 10) + 1, totalRecords)} to {Math.min(page * 10, totalRecords)} of {totalRecords} expenses
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchAllExpenses(page - 1)}
                    disabled={page === 1 || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((pageNum) => (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => fetchAllExpenses(pageNum)}
                        disabled={isLoading}
                        className="w-10"
                      >
                        {pageNum}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchAllExpenses(page + 1)}
                    disabled={page >= totalPages || isLoading}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Rejection Reason *</Label>
                <Textarea
                  placeholder="Please provide a reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleReject}
                  disabled={!rejectionReason.trim()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Reject Expense
                </Button>
                <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PrivateRoute>
  )
}
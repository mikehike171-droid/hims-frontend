"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Plus, Trash2, Receipt, Check, ChevronsUpDown, Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import authService from '@/lib/authService'
import settingsApi from '@/lib/settingsApi'

interface ExpenseCategory {
  id: number
  name: string
  description?: string
}

interface EmployeeExpense {
  id: number
  amount: number
  description?: string
  expenseDate: string
  receipt?: string
  status: 'pending' | 'approved' | 'rejected' | 'paid'
  expenseCategory: ExpenseCategory
  rejectionReason?: string
  createdAt: string
}

export default function EmployeeExpensesPage() {
  const [expenses, setExpenses] = useState<EmployeeExpense[]>([])
  const [categories, setCategories] = useState<ExpenseCategory[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const categoriesLoadedRef = useRef(false)
  const expensesLoadedRef = useRef(false)

  const [selectedLocationId, setSelectedLocationId] = useState(authService.getLocationId())

  const [formData, setFormData] = useState({
    expenseCategoryId: '',
    amount: '',
    description: '',
    expenseDate: '',
    receipt: ''
  })

  useEffect(() => {
    const initializeData = async () => {
      const token = localStorage.getItem('authToken')
      if (!token) {
        console.error('No auth token found')
        setLoading(false)
        return
      }

      if (!expensesLoadedRef.current) {
        expensesLoadedRef.current = true
        await fetchExpenses()
      }

      if (!categoriesLoadedRef.current) {
        await fetchCategories()
      }
    }

    initializeData()
  }, [])

  useEffect(() => {
    const handleLocationChange = () => {
      const currentLocationId = authService.getLocationId()
      if (currentLocationId !== selectedLocationId) {
        setSelectedLocationId(currentLocationId)
        expensesLoadedRef.current = false
        fetchExpenses()
      }
    }

    window.addEventListener('locationChanged', handleLocationChange)

    return () => {
      window.removeEventListener('locationChanged', handleLocationChange)
    }
  }, [selectedLocationId])

  const fetchExpenses = async () => {
    if (expensesLoadedRef.current && loading === false) return

    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const apiUrl = authService.getSettingsApiUrl()
      const locationId = authService.getLocationId()

      const url = locationId
        ? `${apiUrl}/employee-expenses?location_id=${locationId}`
        : `${apiUrl}/employee-expenses`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
      })

      if (response.ok || response.status === 304) {
        const data = await response.json()
        if (Array.isArray(data)) {
          setExpenses(data)
        } else {
          setExpenses([])
        }
      } else {
        setExpenses([])
      }
    } catch (error) {
      console.error('Error fetching expenses:', error)
      setExpenses([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    if (categoriesLoadedRef.current) return
    categoriesLoadedRef.current = true
    console.log('fetchCategories called - using settingsApi')
    try {
      console.log('Calling settingsApi.getExpenseCategories...')
      const data = await settingsApi.getExpenseCategories()
      console.log('settingsApi response:', data)
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching expense categories:', error)
      categoriesLoadedRef.current = false
    }
  }

  const handleSave = async () => {
    try {
      setFormLoading(true)
      const token = localStorage.getItem('authToken')
      const locationId = authService.getLocationId()

      const formDataToSend = new FormData()
      formDataToSend.append('expenseCategoryId', formData.expenseCategoryId)
      formDataToSend.append('amount', formData.amount)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('expenseDate', formData.expenseDate)

      if (locationId) {
        formDataToSend.append('location_id', locationId)
      }

      // Get the actual file from the input
      const fileInput = document.getElementById('receipt') as HTMLInputElement
      if (fileInput?.files?.[0]) {
        formDataToSend.append('receipt', fileInput.files[0])
      }

      console.log('Submitting expense with FormData')

      const response = await fetch(`${authService.getSettingsApiUrl()}/employee-expenses`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Browser will automatically set the correct Content-Type with boundary
        },
        body: formDataToSend,
      })

      console.log('Response status:', response.status)

      if (response.ok) {
        resetForm()
        setShowDialog(false)
        fetchExpenses()
        alert('Expense submitted successfully!')
      } else {
        const errorText = await response.text()
        console.error('API Error:', response.status, errorText)
        alert(`Failed to submit expense: ${errorText}`)
      }
    } catch (error: any) {
      console.error('Error submitting expense:', error)
      alert(`Error submitting expense: ${error.message}`)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this expense?')) return

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/employee-expenses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchExpenses()
        alert('Expense deleted successfully!')
      } else {
        alert('Failed to delete expense')
      }
    } catch (error) {
      console.error('Error deleting expense:', error)
      alert('Error deleting expense')
    }
  }

  const resetForm = () => {
    setFormData({
      expenseCategoryId: '',
      amount: '',
      description: '',
      expenseDate: '',
      receipt: ''
    })
  }

  const handleAddNew = () => {
    resetForm()
    setShowDialog(true)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      paid: 'bg-blue-100 text-blue-800'
    }
    return <Badge className={variants[status as keyof typeof variants]}>{status.toUpperCase()}</Badge>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Expenses</h1>
          <p className="text-gray-600">Submit and track your expense applications</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Receipt className="h-5 w-5" />
              <span>Employee Expenses</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
              <Button variant="outline" onClick={() => {
                expensesLoadedRef.current = false
                fetchExpenses()
              }}>
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Loading expenses...
                  </TableCell>
                </TableRow>
              ) : expenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                    No expenses found
                  </TableCell>
                </TableRow>
              ) : (
                expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{new Date(expense.expenseDate).toLocaleDateString()}</TableCell>
                    <TableCell>{expense.expenseCategory.name}</TableCell>
                    <TableCell>${Number(expense.amount || 0).toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(expense.status)}</TableCell>
                    <TableCell>{expense.description || '-'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={categoryOpen}
                    className="w-full justify-between"
                  >
                    {formData.expenseCategoryId
                      ? categories.find((category) => category.id.toString() === formData.expenseCategoryId)?.name
                      : "Select category..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {categories.map((category) => (
                        <CommandItem
                          key={category.id}
                          value={category.name}
                          onSelect={() => {
                            setFormData({ ...formData, expenseCategoryId: category.id.toString() })
                            setCategoryOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.expenseCategoryId === category.id.toString() ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {category.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Expense Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal border-gray-200 hover:border-gray-300 focus:ring-2 focus:ring-primary/20 transition-all",
                      !formData.expenseDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                    {formData.expenseDate ? format(new Date(formData.expenseDate), "dd/MM/yyyy") : <span>Select Expense Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-xl overflow-hidden bg-white" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.expenseDate ? new Date(formData.expenseDate) : undefined}
                    onSelect={(date: Date | undefined) => {
                      setFormData({ ...formData, expenseDate: date ? format(date, 'yyyy-MM-dd') : '' })
                    }}
                    initialFocus
                    className="p-3"
                  />
                </PopoverContent>
              </Popover>
              <p className="text-[10px] text-muted-foreground mt-0.5">Format: DD/MM/YYYY</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter expense description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="receipt">Receipt (Optional)</Label>
              <Input
                id="receipt"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setFormData({ ...formData, receipt: file.name })
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={formLoading}>
              {formLoading ? 'Saving...' : 'Save Expense'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
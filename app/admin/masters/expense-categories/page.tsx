"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Tag } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { settingsApi } from "@/lib/settingsApi"

export default function ExpenseCategoriesPage() {
  const [expenseCategories, setExpenseCategories] = useState<any[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true
  })

  useEffect(() => {
    fetchExpenseCategories()
  }, [])

  const fetchExpenseCategories = async () => {
    try {
      setLoading(true)
      const data = await settingsApi.getExpenseCategories()
      setExpenseCategories(data || [])
    } catch (error) {
      console.error('Error fetching expense categories:', error)
      toast({
        title: "Error",
        description: "Failed to fetch expense categories",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      if (editingCategory) {
        await settingsApi.updateExpenseCategory(editingCategory.id, formData)
        toast({
          title: "Success",
          description: "Expense category updated successfully",
        })
      } else {
        await settingsApi.createExpenseCategory(formData)
        toast({
          title: "Success", 
          description: "Expense category created successfully",
        })
      }
      setShowDialog(false)
      resetForm()
      fetchExpenseCategories()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save expense category",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (category: any) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
      isActive: category.isActive
    })
    setShowDialog(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this expense category?')) return
    
    try {
      setLoading(true)
      await settingsApi.deleteExpenseCategory(id)
      toast({
        title: "Success",
        description: "Expense category deleted successfully",
      })
      fetchExpenseCategories()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete expense category",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      isActive: true
    })
    setEditingCategory(null)
  }

  const handleAddNew = () => {
    resetForm()
    setShowDialog(true)
  }

  return (
    <PrivateRoute modulePath="admin/expenses/management" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expense Categories</h1>
            <p className="text-gray-600">Manage categories for employee expenses</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Tag className="h-5 w-5" />
                <span>Expense Categories</span>
              </CardTitle>
              <Button onClick={handleAddNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add Expense Category
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : expenseCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">No expense categories found</TableCell>
                  </TableRow>
                ) : (
                  expenseCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.description || '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(category.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Expense Category' : 'Add Expense Category'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter expense category name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter description"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading || !formData.name}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PrivateRoute>
  )
}

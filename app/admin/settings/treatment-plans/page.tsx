"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Calendar, IndianRupee } from "lucide-react"
import PrivateRoute from "@/components/auth/PrivateRoute"
import authService from "@/lib/authService"

interface TreatmentPlan {
  id: number
  name: string
  months: number
  description: string
  status: 'active' | 'inactive'
  created_at: string
}

export default function TreatmentPlansPage() {
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [editingPlan, setEditingPlan] = useState<TreatmentPlan | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    months: '',
    description: '',
    status: 'active'
  })

  useEffect(() => {
    fetchTreatmentPlans()
  }, [])

  const fetchTreatmentPlans = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/treatment-plans`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setTreatmentPlans(data)
      }
    } catch (error) {
      console.error('Error fetching treatment plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const token = localStorage.getItem('authToken')
      const url = editingPlan 
        ? `${authService.getSettingsApiUrl()}/treatment-plans/${editingPlan.id}`
        : `${authService.getSettingsApiUrl()}/treatment-plans`
      
      const method = editingPlan ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          months: parseInt(formData.months),
          description: formData.description,
          status: formData.status
        })
      })
      
      if (response.ok) {
        fetchTreatmentPlans()
        setShowDialog(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error saving treatment plan:', error)
    }
  }

  const handleEdit = (plan: TreatmentPlan) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      months: plan.months.toString(),
      description: plan.description,
      status: plan.status
    })
    setShowDialog(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this treatment plan?')) return
    
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/treatment-plans/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        fetchTreatmentPlans()
      }
    } catch (error) {
      console.error('Error deleting treatment plan:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      months: '',
      description: '',
      status: 'active'
    })
    setEditingPlan(null)
  }

  const handleDialogClose = () => {
    setShowDialog(false)
    resetForm()
  }

  return (
    <PrivateRoute modulePath="admin/settings/treatment-plans" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Treatment Plans</h1>
            <p className="text-gray-600">Manage treatment plan packages and pricing</p>
          </div>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => setShowDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Treatment Plan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingPlan ? 'Edit Treatment Plan' : 'Add New Treatment Plan'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Plan Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Basic Package"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="months">Duration (Months)</Label>
                  <Input
                    id="months"
                    type="number"
                    value={formData.months}
                    onChange={(e) => setFormData({...formData, months: e.target.value})}
                    placeholder="e.g., 3"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Brief description of the plan"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'inactive'})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingPlan ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Treatment Plans List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
                  </TableRow>
                ) : treatmentPlans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">No treatment plans found</TableCell>
                  </TableRow>
                ) : (
                  treatmentPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell className="font-medium">{plan.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {plan.months} month{plan.months > 1 ? 's' : ''}
                        </div>
                      </TableCell>

                      <TableCell>{plan.description || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                          {plan.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(plan)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(plan.id)}
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
      </div>
    </PrivateRoute>
  )
}
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Globe, Activity } from "lucide-react"
import { settingsApi } from "@/lib/settingsApi"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function TreatmentsListPage() {
  const router = useRouter()
  const [treatments, setTreatments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTreatments()
  }, [])

  const fetchTreatments = async () => {
    try {
      setLoading(true)
      const data = await settingsApi.getTreatments()
      setTreatments(data || [])
    } catch (error) {
      console.error('Error fetching treatments:', error)
      toast({
        title: "Error",
        description: "Failed to fetch treatments list",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this treatment? This will remove it from the public website.')) return
    
    try {
      await settingsApi.deleteTreatment(id)
      toast({
        title: "Success",
        description: "Treatment deleted successfully",
      })
      fetchTreatments()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete treatment",
        variant: "destructive",
      })
    }
  }

  return (
    <PrivateRoute modulePath="admin/settings" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Website Treatments</h1>
            <p className="text-gray-600">Manage the diseases and treatments displayed on the public website</p>
          </div>
          <Button onClick={() => router.push('/admin/website/treatments/add')} className="bg-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Treatment
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-primary" />
              <span>All Treatments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Treatment Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-400">Loading treatments...</TableCell>
                  </TableRow>
                ) : treatments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-gray-400">No treatments found. Click 'Add Treatment' to create one.</TableCell>
                  </TableRow>
                ) : (
                  treatments.map((treatment) => (
                    <TableRow key={treatment.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                            <Activity size={16} />
                          </div>
                          {treatment.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 uppercase text-[10px] font-bold">
                          {treatment.category || 'General'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${treatment.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} border-none uppercase text-[10px] font-bold`}>
                          {treatment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        {new Date(treatment.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/website/treatments/edit/${treatment.id}`)}
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(treatment.id)}
                            className="hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
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

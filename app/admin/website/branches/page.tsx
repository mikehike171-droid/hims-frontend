"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, MapPin, Globe } from "lucide-react"
import { settingsApi } from "@/lib/settingsApi"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function BranchesListPage() {
  const router = useRouter()
  const [branches, setBranches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBranches()
  }, [])

  const fetchBranches = async () => {
    try {
      setLoading(true)
      const data = await settingsApi.getBranches()
      setBranches(data || [])
    } catch (error) {
      console.error('Error fetching branches:', error)
      toast({
        title: "Error",
        description: "Failed to fetch branches list",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this branch? This will remove it from the public website.')) return
    
    try {
      const success = await settingsApi.deleteBranch(id)
      if (success) {
        toast({
          title: "Success",
          description: "Branch deleted successfully",
        })
        fetchBranches()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete branch",
        variant: "destructive",
      })
    }
  }

  return (
    <PrivateRoute modulePath="admin/website" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clinic Branches</h1>
            <p className="text-gray-600">Manage the clinical branches displayed on the public website</p>
          </div>
          <Button onClick={() => router.push('/admin/website/branches/add')} className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Branch
          </Button>
        </div>

        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl">
              <MapPin className="h-5 w-5 text-primary" />
              <span>All Branches</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-slate-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-bold text-slate-700">Branch Name</TableHead>
                    <TableHead className="font-bold text-slate-700">Slug</TableHead>
                    <TableHead className="font-bold text-slate-700">Contact</TableHead>
                    <TableHead className="font-bold text-slate-700">Status</TableHead>
                    <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-slate-400">Loading branches...</TableCell>
                    </TableRow>
                  ) : branches.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-slate-400">No branches found. Click 'Add Branch' to create one.</TableCell>
                    </TableRow>
                  ) : (
                    branches.map((branch) => (
                      <TableRow key={branch.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center overflow-hidden border border-primary/10">
                              {branch.image_url ? (
                                <img src={branch.image_url.startsWith('http') ? branch.image_url : `${process.env.NEXT_PUBLIC_SETTINGS_API_URL}${branch.image_url}`} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Globe size={20} className="text-primary/40" />
                              )}
                            </div>
                            <span className="font-bold text-[#1a2e5a]">{branch.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="bg-slate-100 px-2 py-1 rounded text-xs text-slate-600 font-medium">/{branch.slug}</code>
                        </TableCell>
                        <TableCell className="text-slate-600 text-sm">
                          <div className="flex flex-col">
                            <span>{branch.phone}</span>
                            <span className="text-[10px] text-slate-400">{branch.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${branch.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'} border-none uppercase text-[10px] font-black tracking-widest px-3 py-1 ring-1 ring-inset ${branch.status === 'active' ? 'ring-emerald-600/20' : 'ring-rose-600/20'}`}>
                            {branch.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/admin/website/branches/edit/${branch.id}`)}
                              className="h-9 w-9 p-0 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-lg"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(branch.id)}
                              className="h-9 w-9 p-0 hover:bg-rose-50 hover:text-rose-600 transition-colors rounded-lg"
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
            </div>
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Star, User, Calendar, Loader2 } from "lucide-react"
import { settingsApi } from "@/lib/settingsApi"
import { toast } from "@/components/ui/use-toast"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function EditGoogleReviewPage() {
  const router = useRouter()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [branches, setBranches] = useState<any[]>([])
  const [formData, setFormData] = useState({
    reviewer_name: "",
    reviewer_stats: "",
    review_date: "",
    review_text: "",
    rating: 5,
    branch_name: "",
    status: "active"
  })

  useEffect(() => {
    if (id) {
      fetchReview()
      fetchBranches()
    }
  }, [id])

  const fetchBranches = async () => {
    try {
      const data = await settingsApi.getBranches()
      setBranches(data)
    } catch (error) {
      console.error('Error fetching branches:', error)
    }
  }

  const fetchReview = async () => {
    try {
      setLoading(true)
      const data = await settingsApi.getGoogleReview(Number(id))
      setFormData({
        reviewer_name: data.reviewer_name,
        reviewer_stats: data.reviewer_stats || "",
        review_date: data.review_date || "",
        review_text: data.review_text,
        rating: data.rating,
        branch_name: data.branch_name,
        status: data.status
      })
    } catch (error) {
      console.error('Error fetching review:', error)
      toast({
        title: "Error",
        description: "Failed to fetch review details",
        variant: "destructive"
      })
      router.push('/admin/website/googlereview')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.reviewer_name || !formData.review_text) {
      toast({
        title: "Error",
        description: "Name and Review text are required",
        variant: "destructive"
      })
      return
    }

    try {
      setSaving(true)
      await settingsApi.updateGoogleReview(Number(id), formData)
      toast({
        title: "Success",
        description: "Review updated successfully",
      })
      router.push('/admin/website/googlereview')
    } catch (error) {
      console.error('Error updating review:', error)
      toast({
        title: "Error",
        description: "Failed to update review",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <PrivateRoute modulePath="admin/website" action="view">
      <div className="p-6 space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Review</h1>
        </div>

        <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
          <CardHeader className="bg-primary/5 pb-8">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Star className="h-5 w-5 fill-primary" />
              <span>Modify Review Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="reviewer_name" className="text-xs font-black uppercase tracking-widest text-slate-400">Reviewer Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="reviewer_name"
                    className="pl-10 h-11 bg-slate-50/50 border-slate-100 rounded-xl focus:ring-primary/20"
                    value={formData.reviewer_name}
                    onChange={(e) => setFormData({ ...formData, reviewer_name: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch" className="text-xs font-black uppercase tracking-widest text-slate-400">Branch</Label>
                <Select
                  value={formData.branch_name}
                  onValueChange={(val) => setFormData({ ...formData, branch_name: val })}
                >
                  <SelectTrigger className="h-11 bg-slate-50/50 border-slate-100 rounded-xl">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                    {branches.map((branch: any) => (
                      <SelectItem key={branch.id} value={branch.name}>{branch.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="reviewer_stats" className="text-xs font-black uppercase tracking-widest text-slate-400">Reviewer Stats</Label>
                <Input
                  id="reviewer_stats"
                  className="h-11 bg-slate-50/50 border-slate-100 rounded-xl"
                  value={formData.reviewer_stats}
                  onChange={(e) => setFormData({ ...formData, reviewer_stats: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="review_date" className="text-xs font-black uppercase tracking-widest text-slate-400">Date Display</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="review_date"
                    className="pl-10 h-11 bg-slate-50/50 border-slate-100 rounded-xl"
                    value={formData.review_date}
                    onChange={(e) => setFormData({ ...formData, review_date: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating" className="text-xs font-black uppercase tracking-widest text-slate-400">Rating (1-5)</Label>
              <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-6 w-6 cursor-pointer transition-all ${s <= formData.rating ? 'text-yellow-500 fill-yellow-500 scale-110' : 'text-slate-200'}`}
                      onClick={() => setFormData({ ...formData, rating: s })}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-500">{formData.rating} Stars selected</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="review_text" className="text-xs font-black uppercase tracking-widest text-slate-400">Review Text</Label>
              <Textarea
                id="review_text"
                className="min-h-[120px] bg-slate-50/50 border-slate-100 rounded-2xl p-4 focus:ring-primary/20"
                value={formData.review_text}
                onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-slate-700">Display Status</Label>
                <p className="text-xs text-slate-400 font-medium italic">Current status: {formData.status}</p>
              </div>
              <Switch
                checked={formData.status === 'active'}
                onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? 'active' : 'inactive' })}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 bg-slate-50/50 p-8 border-t border-slate-100">
            <Button variant="outline" className="rounded-xl px-6" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 shadow-lg shadow-primary/20">
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Updating..." : "Update Review"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PrivateRoute>
  )
}

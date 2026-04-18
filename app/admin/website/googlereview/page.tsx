"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Star, MapPin, Loader2 } from "lucide-react"
import { settingsApi } from "@/lib/settingsApi"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function GoogleReviewsListPage() {
  const router = useRouter()
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [limit] = useState(10)
  const totalPages = Math.ceil(totalCount / limit)

  useEffect(() => {
    fetchReviews()
  }, [currentPage])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await settingsApi.getGoogleReviews(currentPage, limit)
      // API now returns { data: [], total: number, ... }
      setReviews(response.data || [])
      setTotalCount(response.total || 0)
    } catch (error) {
      console.error('Error fetching reviews:', error)
      toast({
        title: "Error",
        description: "Failed to fetch Google reviews list",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return
    
    try {
      await settingsApi.deleteGoogleReview(id)
      toast({
        title: "Success",
        description: "Review deleted successfully",
      })
      fetchReviews()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      })
    }
  }

  return (
    <PrivateRoute modulePath="admin/website" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Google Reviews</h1>
            <p className="text-gray-600">Manage manually entered patient reviews for branches</p>
          </div>
          <Button onClick={() => router.push('/admin/website/googlereview/add')} className="bg-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add New Review
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span>All Patient Reviews</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        <span>Loading reviews...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : reviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-gray-400">
                      No reviews found. Click 'Add New Review' to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  reviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{review.reviewer_name}</span>
                          <span className="text-xs text-gray-400">{review.reviewer_stats}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 font-medium text-slate-700">
                          <MapPin size={14} className="text-primary" />
                          {review.branch_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-bold">{review.rating}</span>
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${review.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} border-none uppercase text-[10px] font-bold`}>
                          {review.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500 text-sm">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/admin/website/googlereview/edit/${review.id}`)}
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(review.id)}
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
          
          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50/50">
            <div className="text-sm text-gray-500">
              Showing <span className="font-bold text-gray-900">{Math.min((currentPage-1) * limit + 1, totalCount)}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * limit, totalCount)}</span> of <span className="font-bold text-gray-900">{totalCount}</span> reviews
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1 || loading}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="rounded-lg h-9"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1 mx-2">
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i+1}
                    variant={currentPage === i + 1 ? "default" : "ghost"}
                    size="sm"
                    className="w-9 h-9 rounded-lg p-0"
                    onClick={() => setCurrentPage(i + 1)}
                    disabled={loading}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage >= totalPages || loading}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="rounded-lg h-9"
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PrivateRoute>
  )
}

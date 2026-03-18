"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import {
  Search,
  Eye,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { settingsApi } from "@/lib/settingsApi"
import authService from "@/lib/authService"
import { cn } from "@/lib/utils"

interface Policy {
  id: number
  policyNumber: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
}

interface AcceptedPolicy {
  policyId: number
}

export default function EmployeeHRPoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [acceptedPolicyIds, setAcceptedPolicyIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState<number | null>(null)
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Pagination State
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const limit = 10

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const user = authService.getCurrentUser()
      setCurrentUser(user)

      const policiesResponse = await settingsApi.getHRPolicies({ 
        page, 
        limit,
        search: searchTerm 
      })
      setPolicies(policiesResponse.data || [])
      setTotalPages(policiesResponse.totalPages || 1)
      setTotalRecords(policiesResponse.total || 0)

      if (user?.id) {
        const accepted: AcceptedPolicy[] = await settingsApi.getAcceptedPolicies(user.id)
        setAcceptedPolicyIds(new Set(accepted.map((a) => a.policyId)))
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Failed to load HR policies")
    } finally {
      setLoading(false)
    }
  }, [page, searchTerm])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSearch = () => {
    setPage(1)
    fetchData()
  }

  const handleAccept = async (policy: Policy) => {
    if (!currentUser?.id) {
      toast.error("User session not found")
      return
    }

    const locationId = Number(authService.getLocationId()) || 0
    setAccepting(policy.id)
    try {
      await settingsApi.acceptHRPolicy({
        userId: currentUser.id,
        policyId: policy.id,
        locationId,
      })

      setAcceptedPolicyIds((prev) => new Set(prev).add(policy.id))
      toast.success(`Policy accepted: ${policy.title}`)
      if (selectedPolicy?.id === policy.id) {
        setSelectedPolicy(null)
      }
    } catch (error: any) {
      console.error("Error accepting policy:", error)
      toast.error(error?.message || "Failed to accept the policy")
    } finally {
      setAccepting(null)
    }
  }

  const isAccepted = (policyId: number) => acceptedPolicyIds.has(policyId)

  const getPageNumbers = () => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-[#008fba]" />
            HR Policies
          </h1>
          <p className="text-gray-500">Read and accept organization policies</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <span className="text-sm font-medium text-gray-500">Completion Status:</span>
          <span className="ml-2 text-sm font-bold text-[#008fba]">
            {acceptedPolicyIds.size} / {totalRecords} Accepted
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search policies by number or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10 h-10 border-gray-200 focus:ring-[#008fba]"
              />
            </div>
            <Button 
              className="bg-gray-900 hover:bg-black text-white"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Policies Table */}
      <Card className="border-none shadow-xl bg-white rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-xl font-bold text-gray-800">Available Policies</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="w-[180px]">Policy Number</TableHead>
                <TableHead>Policy Title</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-[#008fba] mx-auto mb-2" />
                    <span className="text-gray-400">Loading your policies...</span>
                  </TableCell>
                </TableRow>
              ) : policies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 text-gray-400">
                    No HR policies found.
                  </TableCell>
                </TableRow>
              ) : (
                policies.map((policy) => {
                  const accepted = isAccepted(policy.id)
                  return (
                    <TableRow key={policy.id} className="hover:bg-gray-50/50 transition-colors">
                      <TableCell className="font-semibold text-[#008fba]">{policy.policyNumber}</TableCell>
                      <TableCell className="font-medium text-gray-800">{policy.title}</TableCell>
                      <TableCell className="text-center">
                        {accepted ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle2 className="h-3 w-3" />
                            Accepted
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            Pending
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#008fba] hover:bg-blue-50"
                            onClick={() => setSelectedPolicy(policy)}
                          >
                            <Eye className="h-4 w-4 mr-1.5" />
                            View
                          </Button>
                          {accepted ? (
                            <span className="text-sm font-semibold text-green-600 px-3">
                              Policy Accepted
                            </span>
                          ) : (
                            <Button
                              size="sm"
                              className="bg-gray-900 hover:bg-black text-white min-w-[80px]"
                              onClick={() => handleAccept(policy)}
                              disabled={accepting === policy.id}
                            >
                              {accepting === policy.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                "Accept"
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>

          {/* Pagination UI */}
          {!loading && totalRecords > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t gap-4">
              <div className="text-sm text-gray-600 font-medium">
                Showing {Math.min(((page - 1) * limit) + 1, totalRecords)} to {Math.min(page * limit, totalRecords)} of {totalRecords} policies
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1 || loading}
                  className="rounded-lg"
                >
                  <ChevronLeft className="h-4 w-4 mr-1.5" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                      disabled={loading}
                      className={cn(
                        "w-9 h-9 font-bold transition-all rounded-lg",
                        page === pageNum
                          ? "bg-gray-900 text-white border-gray-900 hover:bg-black shadow-sm"
                          : "hover:border-gray-900 hover:text-gray-900 text-gray-600"
                      )}
                    >
                      {pageNum}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page >= totalPages || loading}
                  className="rounded-lg"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Policy Detail Modal */}
      <Dialog open={!!selectedPolicy} onOpenChange={(open) => !open && setSelectedPolicy(null)}>
        {selectedPolicy && (
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="border-b pb-4">
              <DialogTitle className="text-2xl font-bold text-gray-900">{selectedPolicy.title}</DialogTitle>
              <DialogDescription className="text-gray-500 mt-1">
                Policy Number: <span className="font-semibold text-[#008fba]">{selectedPolicy.policyNumber}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="py-6">
              <div
                className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: selectedPolicy.description || "" }}
              />
            </div>

            <DialogFooter className="border-t pt-4 gap-3">
              <Button variant="outline" onClick={() => setSelectedPolicy(null)}>Close</Button>
              {isAccepted(selectedPolicy.id) ? (
                <div className="flex items-center gap-2 text-green-600 font-semibold px-4">
                  <CheckCircle2 className="h-5 w-5" />
                  You have accepted this policy
                </div>
              ) : (
                <Button
                  className="bg-gray-900 hover:bg-black text-white"
                  onClick={() => handleAccept(selectedPolicy)}
                  disabled={accepting === selectedPolicy.id}
                >
                  {accepting === selectedPolicy.id ? "Accepting..." : "Accept Policy"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, FileText, ChevronLeft, ChevronRight, Edit, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { cn } from "@/lib/utils"
import settingsApi from "@/lib/settingsApi"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { format } from "date-fns"

export default function HRPoliciesListPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalRecords, setTotalRecords] = useState(0)
    const [policies, setPolicies] = useState<any[]>([])
    const [selectedPolicy, setSelectedPolicy] = useState<any>(null)
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

    const fetchPolicies = async () => {
        setLoading(true)
        try {
            const response = await settingsApi.getHRPolicies({
                page,
                limit: 10,
                search: searchTerm
            })
            setPolicies(response.data)
            setTotalPages(response.totalPages)
            setTotalRecords(response.total)
        } catch (error) {
            console.error("Error fetching policies:", error)
            toast.error("Failed to fetch policies")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPolicies()
    }, [page])

    const handleSearch = () => {
        setPage(1)
        fetchPolicies()
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this policy?")) return

        try {
            await settingsApi.deleteHRPolicy(id)
            toast.success("Policy deleted successfully")
            fetchPolicies()
        } catch (error) {
            console.error("Error deleting policy:", error)
            toast.error("Failed to delete policy")
        }
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
        <PrivateRoute modulePath="admin/hr-management/policies" action="view">
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">HR Policies</h1>
                        <p className="text-gray-600">Create and manage organization-wide HR policies</p>
                    </div>
                    <Link href="/admin/hr-management/policies/create">
                        <Button className="bg-gray-900 hover:bg-black text-white shadow-lg shadow-gray-900/10">
                            <Plus className="h-4 w-4 mr-2" />
                            New HR Policy
                        </Button>
                    </Link>
                </div>

                {/* Search Section */}
                <Card className="border-none shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search policies by number or title..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button
                                className="bg-gray-900 hover:bg-black text-white shadow-md shadow-gray-900/5"
                                onClick={handleSearch}
                                disabled={loading}
                            >
                                {loading ? "Searching..." : "Search"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Policies Table */}
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden">
                    <CardHeader className="border-b border-gray-100/50 bg-white/50">
                        <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Registered Policies
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-gray-50/50">
                                <TableRow>
                                    <TableHead>Policy Number</TableHead>
                                    <TableHead>Policy Title</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead className="text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {policies.map((policy) => (
                                    <TableRow key={policy.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <TableCell className="font-semibold text-[#008fba]">{policy.policyNumber}</TableCell>
                                        <TableCell className="font-medium">{policy.title}</TableCell>
                                        <TableCell className="text-gray-500">{policy.createdAt ? format(new Date(policy.createdAt), "dd/MM/yyyy") : "-"}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-3">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-9 w-9 p-0 text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition-all rounded-lg"
                                                    title="View"
                                                    onClick={() => {
                                                        setSelectedPolicy(policy)
                                                        setIsViewDialogOpen(true)
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Link href={`/admin/hr-management/policies/edit/${policy.id}`}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-9 w-9 p-0 text-green-600 hover:bg-green-50 border border-transparent hover:border-green-100 transition-all rounded-lg"
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-9 w-9 p-0 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all rounded-lg"
                                                    onClick={() => handleDelete(policy.id)}
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {policies.length === 0 && !loading && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-10 text-gray-400">
                                            No policies found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {!loading && totalRecords > 0 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t gap-4">
                                <div className="text-sm text-gray-600">
                                    Showing {Math.min(((page - 1) * 10) + 1, totalRecords)} to {Math.min(page * 10, totalRecords)} of {totalRecords} policies
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1 || loading}
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
                                                onClick={() => setPage(pageNum)}
                                                disabled={loading}
                                                className={cn(
                                                    "w-10 h-10 font-bold transition-all",
                                                    page === pageNum
                                                        ? "bg-gray-900 text-white border-gray-900 hover:bg-black shadow-md shadow-gray-900/20"
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
                                        onClick={() => setPage(page + 1)}
                                        disabled={page >= totalPages || loading}
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* View Policy Dialog */}
                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader className="border-b pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <DialogTitle className="text-2xl font-bold text-gray-900">{selectedPolicy?.title}</DialogTitle>
                                    <DialogDescription className="text-gray-500 mt-1">
                                        Policy Number: <span className="font-semibold text-[#008fba]">{selectedPolicy?.policyNumber}</span>
                                    </DialogDescription>
                                </div>
                                <div className="text-right text-xs text-gray-400 mr-8">
                                    Last Updated: {selectedPolicy?.updatedAt ? format(new Date(selectedPolicy.updatedAt), "dd/MM/yyyy HH:mm") : "-"}
                                </div>
                            </div>
                        </DialogHeader>
                        <div className="py-6">
                            <div className="prose prose-sm max-w-none prose-slate">
                                <div
                                    className="text-gray-700 leading-relaxed font-normal"
                                    dangerouslySetInnerHTML={{ __html: selectedPolicy?.description || "" }}
                                />
                            </div>
                        </div>
                        <DialogFooter className="border-t pt-4">
                            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                                Close
                            </Button>
                            <Link href={`/admin/hr-management/policies/edit/${selectedPolicy?.id}`}>
                                <Button className="bg-gray-900 hover:bg-black text-white">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Policy
                                </Button>
                            </Link>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </PrivateRoute>
    )
}

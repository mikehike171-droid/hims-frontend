"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Download, Upload, Search, FileDown, Phone, Calendar } from "lucide-react";
import { campaignsApi } from "@/lib/campaignsApi";
import { toast } from "@/components/ui/use-toast";
import PrivateRoute from "@/components/auth/PrivateRoute";
import { useBranch } from "@/contexts/branch-context";

export default function CampaignsListPage() {
  const router = useRouter();
  const { currentBranch } = useBranch();
  const selectedLocationId = currentBranch?.id;

  const getCurrentMonthDates = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const formatDate = (date: Date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };
    return {
      from: formatDate(firstDay),
      to: formatDate(lastDay)
    };
  };

  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState<string>(getCurrentMonthDates().from);
  const [toDate, setToDate] = useState<string>(getCurrentMonthDates().to);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedLocationId) {
      fetchCampaigns();
    } else {
      setCampaigns([]);
    }
  }, [page, selectedLocationId]);

  const fetchCampaigns = async () => {
    if (!selectedLocationId) return;
    try {
      setLoading(true);
      let apiFromDate = "";
      let apiToDate = "";
      
      if (!search) {
        if (fromDate) {
          const [day, month, year] = fromDate.split('/');
          apiFromDate = `${year}-${month}-${day}`;
        }
        if (toDate) {
          const [day, month, year] = toDate.split('/');
          apiToDate = `${year}-${month}-${day}`;
        }
      }

      const data = await campaignsApi.getCampaigns(page, 10, search, selectedLocationId, apiFromDate, apiToDate);
      setCampaigns(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
      toast({ title: "Error", description: "Failed to load campaigns", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };


  const handleExport = () => {
    if (!selectedLocationId) return;
    const url = campaignsApi.getExportUrl(selectedLocationId);
    window.open(url, '_blank');
  };

  const handleDownloadSample = () => {
    const url = campaignsApi.getSampleTemplateUrl();
    window.open(url, '_blank');
  };

  const handleImportClick = () => {
    if (!selectedLocationId) {
      toast({ title: "Select Location", description: "Please select a location first.", variant: "destructive" });
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedLocationId) return;

    try {
      setLoading(true);
      const res = await campaignsApi.importCampaigns(file, selectedLocationId);
      toast({ title: "Success", description: `Imported ${res.count} campaigns successfully` });
      setPage(1);
      fetchCampaigns();
    } catch (error: any) {
      toast({ title: "Import Failed", description: error.message || "Failed to import campaigns", variant: "destructive" });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
      setLoading(false);
    }
  };

  const handleAddCampaign = () => {
    if (!selectedLocationId) {
      toast({ title: "Select Location", description: "Please select a location to add a campaign.", variant: "destructive" });
      return;
    }
    router.push(`/admin/telecaller/campaigns/add?locationId=${selectedLocationId}`);
  };

  return (
    <PrivateRoute modulePath="admin/telecaller/campaigns" action="view">
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
            <p className="text-gray-600">Manage marketing campaigns mapped to specific locations.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" onClick={handleDownloadSample} className="text-blue-600 border-blue-200 hover:bg-blue-50">
                <FileDown className="h-4 w-4 mr-2" /> Sample
              </Button>
              <Button variant="outline" onClick={handleImportClick} disabled={!selectedLocationId} className="text-green-600 border-green-200 hover:bg-green-50">
                <Upload className="h-4 w-4 mr-2" /> Import
              </Button>
              <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx, .xls" onChange={handleFileChange} />
              
              <Button variant="outline" onClick={handleExport} disabled={!selectedLocationId}>
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
              <Button onClick={handleAddCampaign} disabled={!selectedLocationId} className="bg-primary">
                <Plus className="h-4 w-4 mr-2" /> Add Campaign
              </Button>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Filter Campaigns</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="search" className="text-sm font-medium">Search:</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Name, Mobile..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setPage(1);
                        fetchCampaigns();
                      }
                    }}
                    className="pl-10"
                    disabled={!selectedLocationId}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromDate" className="text-sm font-medium">From Date:</Label>
                <div className="relative">
                  <input
                    id="fromDateInput"
                    type="date"
                    disabled={!!search || !selectedLocationId}
                    value={fromDate ? (() => {
                      const [day, month, year] = fromDate.split('/');
                      return `${year}-${month}-${day}`;
                    })() : ''}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      const day = String(date.getDate()).padStart(2, '0');
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const year = date.getFullYear();
                      setFromDate(`${day}/${month}/${year}`);
                    }}
                    className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                  />
                  <Input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={fromDate}
                    readOnly
                    disabled={!!search || !selectedLocationId}
                    className="w-full"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="toDate" className="text-sm font-medium">To Date:</Label>
                <div className="relative">
                  <input
                    id="toDateInput"
                    type="date"
                    disabled={!!search || !selectedLocationId}
                    value={toDate ? (() => {
                      const [day, month, year] = toDate.split('/');
                      return `${year}-${month}-${day}`;
                    })() : ''}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      const day = String(date.getDate()).padStart(2, '0');
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const year = date.getFullYear();
                      setToDate(`${day}/${month}/${year}`);
                    }}
                    className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                  />
                  <Input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={toDate}
                    readOnly
                    disabled={!!search || !selectedLocationId}
                    className="w-full"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="flex items-end h-full">
                <Button
                  onClick={() => { setPage(1); fetchCampaigns(); }}
                  variant="default"
                  className="w-full"
                  disabled={loading || !selectedLocationId}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Diseases</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!selectedLocationId ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-gray-400">Please select a location first.</TableCell>
                    </TableRow>
                  ) : loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-gray-400">Loading...</TableCell>
                    </TableRow>
                  ) : campaigns.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-gray-400">No campaigns found for this location.</TableCell>
                    </TableRow>
                  ) : (
                    campaigns.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell>{c.mobile}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{c.diseases}</TableCell>
                        <TableCell className="text-gray-500 text-sm">
                          {(() => {
                            const date = new Date(c.createdAt);
                            const day = String(date.getDate()).padStart(2, '0');
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const year = date.getFullYear();
                            return `${day}/${month}/${year}`;
                          })()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/telecaller/campaigns/edit/${c.id}?locationId=${selectedLocationId}`)}>
                              <Edit className="h-4 w-4 text-blue-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-4">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                  Previous
                </Button>
                <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  );
}

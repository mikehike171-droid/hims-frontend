"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { campaignsApi } from "@/lib/campaignsApi";
import { toast } from "@/components/ui/use-toast";
import PrivateRoute from "@/components/auth/PrivateRoute";
import { useBranch } from "@/contexts/branch-context";

export default function EditCampaignPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  
  const { currentBranch } = useBranch();
  const locationIdParam = currentBranch?.id;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    diseases: "",
  });

  useEffect(() => {
    if (!id || isNaN(id)) {
      router.push('/admin/telecaller/campaigns');
      return;
    }
    fetchCampaignDetails();
  }, [id]);

  const fetchCampaignDetails = async () => {
    try {
      setFetching(true);
      const data = await campaignsApi.getCampaign(id);
      if (data) {
        setFormData({
          name: data.name || "",
          mobile: data.mobile || "",
          diseases: data.diseases || "",
        });
      } else {
        toast({ title: "Error", description: "Campaign not found", variant: "destructive" });
        router.push('/admin/telecaller/campaigns');
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load campaign details", variant: "destructive" });
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Campaign Name is required", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      const payload: any = { ...formData };
      if (locationIdParam) payload.locationId = Number(locationIdParam);

      await campaignsApi.updateCampaign(id, payload);
      toast({ title: "Success", description: "Campaign updated successfully" });
      router.push('/admin/telecaller/campaigns');
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update campaign", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-10 text-center text-gray-500">Loading...</div>;

  return (
    <PrivateRoute modulePath="admin/telecaller/campaigns" action="edit">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Campaign</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="E.g. Winter Health Camp"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="E.g. 9876543210"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="diseases">Diseases (comma separated)</Label>
                  <Textarea
                    id="diseases"
                    value={formData.diseases}
                    onChange={(e) => setFormData({ ...formData, diseases: e.target.value })}
                    placeholder="E.g. Flu, Cold, Fever"
                    rows={3}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={loading} className="bg-primary">
                  {loading ? "Saving..." : <><Save className="w-4 h-4 mr-2"/> Update Campaign</>}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  );
}

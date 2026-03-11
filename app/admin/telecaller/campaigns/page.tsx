"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Search, Plus, Target, Users, TrendingUp, Play, Pause, Edit, Trash2, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import PrivateRoute from "@/components/auth/PrivateRoute"

// Mock campaigns data
const mockCampaigns = [
  {
    id: 1,
    name: "Annual Health Checkup 2024",
    description: "Comprehensive health screening packages for corporate employees",
    type: "health_package",
    status: "active",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    targetCount: 500,
    completedCount: 287,
    conversionCount: 45,
    revenueTarget: 250000,
    revenueAchieved: 135000,
    createdBy: "John Doe",
    createdAt: "2023-12-15",
  },
  {
    id: 2,
    name: "Diabetes Awareness Campaign",
    description: "Follow-up calls for diabetes patients and screening for high-risk individuals",
    type: "follow_up",
    status: "active",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    targetCount: 200,
    completedCount: 156,
    conversionCount: 28,
    revenueTarget: 80000,
    revenueAchieved: 42000,
    createdBy: "Jane Smith",
    createdAt: "2024-01-10",
  },
  {
    id: 3,
    name: "COVID-19 Vaccination Drive",
    description: "Vaccination reminders and appointment booking for eligible patients",
    type: "vaccine",
    status: "completed",
    startDate: "2023-12-01",
    endDate: "2023-12-31",
    targetCount: 1000,
    completedCount: 1000,
    conversionCount: 850,
    revenueTarget: 170000,
    revenueAchieved: 144500,
    createdBy: "Dr. Patel",
    createdAt: "2023-11-25",
  },
  {
    id: 4,
    name: "Cardiac Screening Program",
    description: "Heart health screening for patients above 40 years",
    type: "health_package",
    status: "paused",
    startDate: "2024-01-20",
    endDate: "2024-04-20",
    targetCount: 300,
    completedCount: 89,
    conversionCount: 12,
    revenueTarget: 180000,
    revenueAchieved: 36000,
    createdBy: "Dr. Singh",
    createdAt: "2024-01-15",
  },
  {
    id: 5,
    name: "Women's Health Awareness",
    description: "Gynecological health checkups and awareness program",
    type: "general",
    status: "draft",
    startDate: "2024-02-01",
    endDate: "2024-04-30",
    targetCount: 400,
    completedCount: 0,
    conversionCount: 0,
    revenueTarget: 200000,
    revenueAchieved: 0,
    createdBy: "Dr. Sharma",
    createdAt: "2024-01-18",
  },
]

export default function Campaigns() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [showNewCampaignDialog, setShowNewCampaignDialog] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    type: "",
    targetCount: "",
    revenueTarget: "",
    startDate: "",
    endDate: "",
  })

  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    if (searchTerm && !campaign.name.toLowerCase().includes(searchTerm.toLowerCase())) return false
    if (statusFilter !== "all" && campaign.status !== statusFilter) return false
    if (typeFilter !== "all" && campaign.type !== typeFilter) return false
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "health_package":
        return "bg-purple-100 text-purple-800"
      case "vaccine":
        return "bg-green-100 text-green-800"
      case "follow_up":
        return "bg-blue-100 text-blue-800"
      case "general":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCampaignAction = (campaignId: number, action: string) => {
    const campaign = mockCampaigns.find((c) => c.id === campaignId)
    switch (action) {
      case "start":
        toast.success(`Campaign "${campaign?.name}" started successfully`)
        break
      case "pause":
        toast.success(`Campaign "${campaign?.name}" paused`)
        break
      case "edit":
        toast.info(`Editing campaign "${campaign?.name}"`)
        break
      case "delete":
        toast.success(`Campaign "${campaign?.name}" deleted`)
        break
    }
  }

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.type) {
      toast.error("Please fill all required fields")
      return
    }
    toast.success("Campaign created successfully!")
    setShowNewCampaignDialog(false)
    setNewCampaign({
      name: "",
      description: "",
      type: "",
      targetCount: "",
      revenueTarget: "",
      startDate: "",
      endDate: "",
    })
  }

  const totalCampaigns = filteredCampaigns.length
  const activeCampaigns = filteredCampaigns.filter((c) => c.status === "active").length
  const totalRevenue = filteredCampaigns.reduce((sum, c) => sum + c.revenueAchieved, 0)
  const totalConversions = filteredCampaigns.reduce((sum, c) => sum + c.conversionCount, 0)

  return (
    <PrivateRoute modulePath="admin/telecaller/campaigns" action="view">
      <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Campaign Management</h1>
            <p className="text-muted-foreground">Create and manage telecaller campaigns</p>
          </div>
        </div>
        <Dialog open={showNewCampaignDialog} onOpenChange={setShowNewCampaignDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Campaign Name *</Label>
                  <Input
                    id="campaign-name"
                    placeholder="Enter campaign name"
                    value={newCampaign.name}
                    onChange={(e) => setNewCampaign((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-type">Campaign Type *</Label>
                  <Select
                    value={newCampaign.type}
                    onValueChange={(value) => setNewCampaign((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="health_package">Health Package</SelectItem>
                      <SelectItem value="vaccine">Vaccine</SelectItem>
                      <SelectItem value="follow_up">Follow-up</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-description">Description</Label>
                <Textarea
                  id="campaign-description"
                  placeholder="Campaign description..."
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target-count">Target Count</Label>
                  <Input
                    id="target-count"
                    type="number"
                    placeholder="Number of contacts"
                    value={newCampaign.targetCount}
                    onChange={(e) => setNewCampaign((prev) => ({ ...prev, targetCount: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="revenue-target">Revenue Target (₹)</Label>
                  <Input
                    id="revenue-target"
                    type="number"
                    placeholder="Expected revenue"
                    value={newCampaign.revenueTarget}
                    onChange={(e) => setNewCampaign((prev) => ({ ...prev, revenueTarget: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={newCampaign.startDate}
                    onChange={(e) => setNewCampaign((prev) => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={newCampaign.endDate}
                    onChange={(e) => setNewCampaign((prev) => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateCampaign} className="flex-1">
                  Create Campaign
                </Button>
                <Button variant="outline" onClick={() => setShowNewCampaignDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">{activeCampaigns} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions}</div>
            <p className="text-xs text-muted-foreground">Across all campaigns</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Campaign revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Conversion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredCampaigns.length > 0
                ? Math.round((totalConversions / filteredCampaigns.reduce((sum, c) => sum + c.completedCount, 0)) * 100)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Campaign List</CardTitle>
              <CardDescription>Manage your telecaller campaigns</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="health_package">Health Package</SelectItem>
                  <SelectItem value="vaccine">Vaccine</SelectItem>
                  <SelectItem value="follow_up">Follow-up</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{campaign.name}</h3>
                      <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                      <Badge className={getTypeColor(campaign.type)}>{campaign.type.replace("_", " ")}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{campaign.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-muted-foreground">Progress</div>
                        <div className="flex items-center gap-2">
                          <Progress value={(campaign.completedCount / campaign.targetCount) * 100} className="flex-1" />
                          <span className="text-sm font-medium">
                            {Math.round((campaign.completedCount / campaign.targetCount) * 100)}%
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {campaign.completedCount} / {campaign.targetCount}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Conversions</div>
                        <div className="text-lg font-semibold">{campaign.conversionCount}</div>
                        <div className="text-xs text-muted-foreground">
                          {campaign.completedCount > 0
                            ? Math.round((campaign.conversionCount / campaign.completedCount) * 100)
                            : 0}
                          % rate
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Revenue</div>
                        <div className="text-lg font-semibold">₹{campaign.revenueAchieved.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          Target: ₹{campaign.revenueTarget.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Duration</div>
                        <div className="text-sm">
                          {campaign.startDate} to {campaign.endDate}
                        </div>
                        <div className="text-xs text-muted-foreground">Created by {campaign.createdBy}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1 ml-4">
                    {campaign.status === "draft" && (
                      <Button size="sm" onClick={() => handleCampaignAction(campaign.id, "start")}>
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    {campaign.status === "active" && (
                      <Button size="sm" variant="outline" onClick={() => handleCampaignAction(campaign.id, "pause")}>
                        <Pause className="h-4 w-4" />
                      </Button>
                    )}
                    {campaign.status === "paused" && (
                      <Button size="sm" onClick={() => handleCampaignAction(campaign.id, "start")}>
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleCampaignAction(campaign.id, "edit")}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleCampaignAction(campaign.id, "delete")}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {filteredCampaigns.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No campaigns found matching your criteria</div>
            )}
          </div>
        </CardContent>
      </Card>
      </div>
    </PrivateRoute>
  )
}

"use client"

import { useState } from "react"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Zap,
  TrendingUp,
  Brain,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Lightbulb,
  Clock,
  DollarSign,
} from "lucide-react"

export default function AIInsightsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  // Mock data
  const demandForecast = [
    {
      id: 1,
      itemName: "Paracetamol 500mg",
      currentStock: 2500,
      forecastedDemand: 3200,
      recommendedOrder: 1200,
      confidence: 94,
      trend: "increasing",
      seasonality: "high",
    },
    {
      id: 2,
      itemName: "Surgical Gloves (Medium)",
      currentStock: 150,
      forecastedDemand: 800,
      recommendedOrder: 650,
      confidence: 87,
      trend: "stable",
      seasonality: "low",
    },
    {
      id: 3,
      itemName: "IV Fluid 500ml",
      currentStock: 200,
      forecastedDemand: 450,
      recommendedOrder: 300,
      confidence: 91,
      trend: "decreasing",
      seasonality: "medium",
    },
  ]

  const optimizationRecommendations = [
    {
      id: 1,
      category: "Inventory Optimization",
      recommendation: "Reduce safety stock for slow-moving items",
      impact: "₹2.5L cost reduction",
      priority: "High",
      implementation: "Easy",
      timeline: "1 week",
    },
    {
      id: 2,
      category: "Vendor Optimization",
      recommendation: "Consolidate orders with top-performing vendors",
      impact: "15% better pricing",
      priority: "Medium",
      implementation: "Medium",
      timeline: "2 weeks",
    },
    {
      id: 3,
      category: "Procurement Timing",
      recommendation: "Adjust reorder points based on seasonal patterns",
      impact: "20% reduction in stockouts",
      priority: "High",
      implementation: "Easy",
      timeline: "3 days",
    },
  ]

  const costSavingOpportunities = [
    {
      id: 1,
      opportunity: "Volume Consolidation",
      description: "Combine orders for similar items across departments",
      potentialSaving: 125000,
      effort: "Low",
      timeframe: "Immediate",
      status: "Available",
    },
    {
      id: 2,
      opportunity: "Alternative Sourcing",
      description: "Identify alternative vendors for high-cost items",
      potentialSaving: 85000,
      effort: "Medium",
      timeframe: "1 month",
      status: "In Progress",
    },
    {
      id: 3,
      opportunity: "Contract Renegotiation",
      description: "Renegotiate terms with underperforming vendors",
      potentialSaving: 200000,
      effort: "High",
      timeframe: "3 months",
      status: "Planned",
    },
  ]

  const performanceMetrics = [
    { metric: "Forecast Accuracy", value: "94%", target: "90%", status: "above" },
    { metric: "Cost Savings Identified", value: "₹12.5L", target: "₹10L", status: "above" },
    { metric: "Stockout Reduction", value: "25%", target: "20%", status: "above" },
    { metric: "Inventory Turnover", value: "8.2x", target: "8.0x", status: "above" },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "decreasing":
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
      default:
        return <BarChart3 className="h-4 w-4 text-blue-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-800"
      case "in progress":
        return "bg-blue-100 text-blue-800"
      case "planned":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <PrivateRoute modulePath="admin/material-management/ai-insights" action="view">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">AI Optimization</h1>
          <p className="text-muted-foreground">Demand forecasting and intelligent recommendations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Brain className="h-4 w-4 mr-2" />
            Retrain Model
          </Button>
          <Button>
            <Zap className="h-4 w-4 mr-2" />
            Generate Insights
          </Button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {performanceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
              {metric.status === "above" ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">Target: {metric.target}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="forecast" className="space-y-4">
        <TabsList>
          <TabsTrigger value="forecast">Demand Forecast</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="savings">Cost Savings</TabsTrigger>
          <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>
        </TabsList>

        {/* Demand Forecast Tab */}
        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Demand Forecast</CardTitle>
              <CardDescription>Intelligent demand predictions based on historical data and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">Item Name</th>
                        <th className="text-left p-3 font-medium">Current Stock</th>
                        <th className="text-left p-3 font-medium">Forecasted Demand</th>
                        <th className="text-left p-3 font-medium">Recommended Order</th>
                        <th className="text-left p-3 font-medium">Confidence</th>
                        <th className="text-left p-3 font-medium">Trend</th>
                        <th className="text-left p-3 font-medium">Seasonality</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demandForecast.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <div className="font-medium">{item.itemName}</div>
                          </td>
                          <td className="p-3">{item.currentStock}</td>
                          <td className="p-3">
                            <div className="font-medium">{item.forecastedDemand}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-medium text-blue-600">{item.recommendedOrder}</div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium">{item.confidence}%</div>
                              {item.confidence >= 90 ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {getTrendIcon(item.trend)}
                              <span className="capitalize">{item.trend}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="capitalize">
                              {item.seasonality}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Button size="sm" variant="outline">
                              Create PO
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimization Recommendations</CardTitle>
              <CardDescription>AI-generated recommendations to improve efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizationRecommendations.map((rec) => (
                  <div key={rec.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="h-5 w-5 text-yellow-500" />
                          <Badge variant="outline">{rec.category}</Badge>
                          <Badge className={getPriorityColor(rec.priority)}>{rec.priority}</Badge>
                        </div>
                        <h3 className="font-semibold mb-2">{rec.recommendation}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{rec.impact}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span>Implementation: {rec.implementation}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Timeline: {rec.timeline}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button size="sm">Implement</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cost Savings Tab */}
        <TabsContent value="savings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost Saving Opportunities</CardTitle>
              <CardDescription>Identified opportunities for cost reduction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-medium">Opportunity</th>
                        <th className="text-left p-3 font-medium">Description</th>
                        <th className="text-left p-3 font-medium">Potential Saving</th>
                        <th className="text-left p-3 font-medium">Effort Required</th>
                        <th className="text-left p-3 font-medium">Timeframe</th>
                        <th className="text-left p-3 font-medium">Status</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {costSavingOpportunities.map((opportunity) => (
                        <tr key={opportunity.id} className="border-b hover:bg-muted/50">
                          <td className="p-3">
                            <div className="font-medium">{opportunity.opportunity}</div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm">{opportunity.description}</div>
                          </td>
                          <td className="p-3">
                            <div className="font-medium text-green-600">
                              ₹{opportunity.potentialSaving.toLocaleString()}
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline">{opportunity.effort}</Badge>
                          </td>
                          <td className="p-3">{opportunity.timeframe}</td>
                          <td className="p-3">
                            <Badge className={getStatusColor(opportunity.status)}>{opportunity.status}</Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline">
                                View
                              </Button>
                              <Button size="sm">Execute</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Deep insights and predictive analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Brain className="h-5 w-5 text-primary" />
                      <Badge variant="outline">ML Model</Badge>
                    </div>
                    <CardTitle className="text-lg">Forecast Accuracy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">94%</div>
                    <p className="text-sm text-muted-foreground">+2% improvement this month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <Badge variant="outline">Savings</Badge>
                    </div>
                    <CardTitle className="text-lg">AI-Driven Savings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">₹12.5L</div>
                    <p className="text-sm text-muted-foreground">This fiscal year</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Target className="h-5 w-5 text-primary" />
                      <Badge variant="outline">Efficiency</Badge>
                    </div>
                    <CardTitle className="text-lg">Process Optimization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">35%</div>
                    <p className="text-sm text-muted-foreground">Time reduction in procurement</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </PrivateRoute>
  )
}

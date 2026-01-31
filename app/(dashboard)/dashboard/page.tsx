"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useBranch } from "@/contexts/branch-context"
import { Users, Calendar, Stethoscope, CreditCard, TrendingUp, AlertTriangle, RefreshCw, Plus } from "lucide-react"

interface DashboardStats {
  totalPatients: string
  queueWaiting: string
  activeConsultations: string
  revenueToday: string
  totalPatientsChange: string
  queueWaitingChange: string
  activeConsultationsChange: string
  revenueTodayChange: string
}

interface RecentActivity {
  patient: string
  action: string
  time: string
  type: string
}

export default function Dashboard() {
  const { currentBranch } = useBranch()
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: "0",
    queueWaiting: "0",
    activeConsultations: "0",
    revenueToday: "₹0",
    totalPatientsChange: "+0%",
    queueWaitingChange: "+0%",
    activeConsultationsChange: "+0%",
    revenueTodayChange: "+0%",
  })

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])

  useEffect(() => {
    const fetchBranchData = async () => {
      if (!currentBranch) return

      // Simulate API call with branch-specific data
      const branchSpecificData: Record<string, { stats: DashboardStats; activities: RecentActivity[] }> = {
        "1": {
          // Main Branch
          stats: {
            totalPatients: "247",
            queueWaiting: "23",
            activeConsultations: "18",
            revenueToday: "₹2,45,000",
            totalPatientsChange: "+12%",
            queueWaitingChange: "-5%",
            activeConsultationsChange: "+8%",
            revenueTodayChange: "+15%",
          },
          activities: [
            { patient: "John Doe", action: "Registered", time: "2 mins ago", type: "registration" },
            { patient: "Jane Smith", action: "Vitals Recorded", time: "5 mins ago", type: "vitals" },
            { patient: "Mike Johnson", action: "Prescription Generated", time: "8 mins ago", type: "prescription" },
            { patient: "Sarah Wilson", action: "Payment Completed", time: "12 mins ago", type: "payment" },
          ],
        },
        "2": {
          // Whitefield
          stats: {
            totalPatients: "189",
            queueWaiting: "18",
            activeConsultations: "14",
            revenueToday: "₹1,89,000",
            totalPatientsChange: "+8%",
            queueWaitingChange: "-3%",
            activeConsultationsChange: "+6%",
            revenueTodayChange: "+12%",
          },
          activities: [
            { patient: "Raj Kumar", action: "Registered", time: "1 min ago", type: "registration" },
            { patient: "Priya Sharma", action: "Lab Test Ordered", time: "4 mins ago", type: "lab" },
            { patient: "Amit Patel", action: "Consultation Completed", time: "7 mins ago", type: "consultation" },
            { patient: "Sneha Reddy", action: "Prescription Dispensed", time: "10 mins ago", type: "pharmacy" },
          ],
        },
        "3": {
          // Koramangala
          stats: {
            totalPatients: "156",
            queueWaiting: "15",
            activeConsultations: "11",
            revenueToday: "₹1,56,000",
            totalPatientsChange: "+10%",
            queueWaitingChange: "-2%",
            activeConsultationsChange: "+5%",
            revenueTodayChange: "+9%",
          },
          activities: [
            { patient: "Kavya Nair", action: "Appointment Booked", time: "3 mins ago", type: "appointment" },
            { patient: "Ravi Gupta", action: "Insurance Verified", time: "6 mins ago", type: "insurance" },
            { patient: "Meera Singh", action: "Discharge Completed", time: "9 mins ago", type: "discharge" },
            { patient: "Arjun Das", action: "Follow-up Scheduled", time: "11 mins ago", type: "followup" },
          ],
        },
        "4": {
          // Electronic City
          stats: {
            totalPatients: "134",
            queueWaiting: "12",
            activeConsultations: "9",
            revenueToday: "₹1,34,000",
            totalPatientsChange: "+7%",
            queueWaitingChange: "-4%",
            activeConsultationsChange: "+4%",
            revenueTodayChange: "+11%",
          },
          activities: [
            { patient: "Deepak Joshi", action: "Emergency Admission", time: "1 min ago", type: "emergency" },
            { patient: "Lakshmi Iyer", action: "Surgery Scheduled", time: "5 mins ago", type: "surgery" },
            { patient: "Vikram Rao", action: "Radiology Report", time: "8 mins ago", type: "radiology" },
            { patient: "Anita Menon", action: "Billing Completed", time: "13 mins ago", type: "billing" },
          ],
        },
      }

      const data = branchSpecificData[currentBranch.id] || branchSpecificData["1"]
      setStats(data.stats)
      setRecentActivities(data.activities)
    }

    fetchBranchData()

    // Listen for branch changes
    const handleBranchChange = () => {
      fetchBranchData()
    }

    window.addEventListener("branchChanged", handleBranchChange)
    return () => window.removeEventListener("branchChanged", handleBranchChange)
  }, [currentBranch])

  const statsConfig = [
    {
      title: "Total Patients Today",
      value: stats.totalPatients,
      change: stats.totalPatientsChange,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Queue Waiting",
      value: stats.queueWaiting,
      change: stats.queueWaitingChange,
      icon: Calendar,
      color: "text-orange-600",
    },
    {
      title: "Active Consultations",
      value: stats.activeConsultations,
      change: stats.activeConsultationsChange,
      icon: Stethoscope,
      color: "text-green-600",
    },
    {
      title: "Revenue Today",
      value: stats.revenueToday,
      change: stats.revenueTodayChange,
      icon: CreditCard,
      color: "text-red-600",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header with Branch Info */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          {currentBranch && (
            <p className="text-gray-600 mt-1">
              {currentBranch.name} •{" "}
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Quick Actions
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                    {stat.change} from yesterday
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-red-600" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{activity.patient}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-600" />
              AI Alerts & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-medium text-red-800">Critical Patient Alert</p>
                <p className="text-sm text-red-600">Patient ID: P001234 - Abnormal vitals detected</p>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="font-medium text-orange-800">Inventory Alert</p>
                <p className="text-sm text-orange-600">Low stock: Paracetamol 500mg - 15 units remaining</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-medium text-blue-800">Queue Optimization</p>
                <p className="text-sm text-blue-600">Suggested: Move emergency patient to priority queue</p>
              </div>
              {currentBranch && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="font-medium text-green-800">Branch Status</p>
                  <p className="text-sm text-green-600">{currentBranch.name} - All systems operational</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

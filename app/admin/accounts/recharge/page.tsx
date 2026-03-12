"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Edit2, Calendar, Smartphone, User, DollarSign, Search, Clock } from "lucide-react"

export default function MobileRechargeManagement() {
  const router = useRouter()
  const [plans, setPlans] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [unassignedSims, setUnassignedSims] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false)
  const [isEditPlanOpen, setIsEditPlanOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    simMasterId: "",
    userId: "",
    rechargeDays: "28",
    amount: "",
    rechargeDate: new Date().toISOString().split('T')[0]
  })
  
  const [editData, setEditData] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])

  const fetchHistory = async (simMasterId: number) => {
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/mobile-recharge/plans/history/${simMasterId}`, {
        headers: { 'Authorization': `Bearer ${authService.getCurrentToken()}` }
      })
      if (response.ok) {
        setHistory(await response.json())
      }
    } catch (error) {
      console.error("Error fetching history:", error)
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-"
    const [year, month, day] = dateStr.split("-")
    if (day && month && year) {
      return `${day}/${month}/${year}`
    }
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return dateStr
    const d = String(date.getDate()).padStart(2, '0')
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const y = date.getFullYear()
    return `${d}/${m}/${y}`
  }

  const fetchData = async () => {
    try {
      const token = authService.getCurrentToken()
      const headers = { 'Authorization': `Bearer ${token}` }
      const apiUrl = authService.getSettingsApiUrl()

      const locationId = authService.getLocationId()
      const [plansRes, usersRes, simsRes] = await Promise.all([
        fetch(`${apiUrl}/mobile-recharge/plans/employee-list`, { headers }),
        fetch(`${apiUrl}/settings/users?limit=1000${locationId ? `&locationId=${locationId}` : ''}`, { headers }),
        fetch(`${apiUrl}/mobile-recharge/sims/unassigned`, { headers })
      ])

      if (plansRes.ok) setPlans(await plansRes.json())
      if (usersRes.ok) {
        const userData = await usersRes.json()
        setEmployees(Array.isArray(userData) ? userData : (userData.users || userData.items || []))
      }
      if (simsRes.ok) setUnassignedSims(await simsRes.json())
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreatePlan = async () => {
    if (!formData.simMasterId || !formData.userId || !formData.amount) return
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/mobile-recharge/plans`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authService.getCurrentToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          simMasterId: parseInt(formData.simMasterId),
          userId: parseInt(formData.userId),
          rechargeDays: parseInt(formData.rechargeDays),
          amount: parseFloat(formData.amount)
        })
      })
      if (response.ok) {
        setIsAddPlanOpen(false)
        setFormData({
          simMasterId: "",
          userId: "",
          rechargeDays: "28",
          amount: "",
          rechargeDate: new Date().toISOString().split('T')[0]
        })
        fetchData()
      }
    } catch (error) {
      console.error("Error creating plan:", error)
    }
  }

  const handleUpdatePlan = async () => {
    if (!editData) return
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/mobile-recharge/plans/${editData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authService.getCurrentToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rechargeDays: parseInt(editData.rechargeDays),
          amount: parseFloat(editData.amount),
          rechargeDate: editData.rechargeDate
        })
      })
      if (response.ok) {
        setIsEditPlanOpen(false)
        setEditData(null)
        fetchData()
      }
    } catch (error) {
      console.error("Error updating plan:", error)
    }
  }

  const handleRenewPlan = async () => {
    if (!editData) return
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/mobile-recharge/plans`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authService.getCurrentToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          simMasterId: editData.simMasterId,
          userId: editData.userId,
          rechargeDays: parseInt(editData.rechargeDays),
          amount: parseFloat(editData.amount),
          rechargeDate: editData.rechargeDate
        })
      })
      if (response.ok) {
        setIsEditPlanOpen(false)
        setEditData(null)
        fetchData()
      }
    } catch (error) {
      console.error("Error renewing plan:", error)
    }
  }

  const filteredPlans = plans.filter(p => 
    `${p.user?.firstName} ${p.user?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.simMaster?.mobileNumber.includes(searchTerm)
  )

  return (
    <PrivateRoute modulePath="admin/accounts/recharge" action="view">
      <div className="min-h-screen bg-gray-50/50 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mobile Recharge Management</h1>
              <p className="text-gray-500 mt-1">Assign and manage mobile recharges for employees</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => router.push('/admin/accounts/recharge/masters')}>
                View Masters
              </Button>
              <Dialog open={isAddPlanOpen} onOpenChange={setIsAddPlanOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" /> Assign SIM
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Assign Mobile Number to Employee</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Employee</Label>
                      <Select onValueChange={(val) => setFormData({ ...formData, userId: val })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {employees.map(emp => (
                            <SelectItem key={emp.id} value={emp.id.toString()}>
                              {emp.firstName} {emp.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Mobile Number</Label>
                      <Select onValueChange={(val) => setFormData({ ...formData, simMasterId: val })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select SIM" />
                        </SelectTrigger>
                        <SelectContent>
                          {unassignedSims.map(sim => (
                            <SelectItem key={sim.id} value={sim.id.toString()}>
                              {sim.mobileNumber} ({sim.operator?.name})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Validity (Days)</Label>
                        <Input 
                          type="number" 
                          value={formData.rechargeDays}
                          onChange={(e) => setFormData({ ...formData, rechargeDays: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Amount (₹)</Label>
                        <Input 
                          type="number" 
                          placeholder="0.00"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Recharge Date</Label>
                      <Input 
                        type="date" 
                        value={formData.rechargeDate}
                        onChange={(e) => setFormData({ ...formData, rechargeDate: e.target.value })}
                      />
                    </div>
                    <Button className="w-full bg-green-600" onClick={handleCreatePlan}>
                      Confirm Assignment
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card className="shadow-sm border-none">
            <CardHeader className="border-b pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">Active Assignments</CardTitle>
                <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search by name or number..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead className="pl-6">Employee</TableHead>
                    <TableHead>SIM Details</TableHead>
                    <TableHead>Plan Validity</TableHead>
                    <TableHead>Recharge Date</TableHead>
                    <TableHead>Next Recharge</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.map((plan) => (
                    <TableRow key={plan.id} className="hover:bg-gray-50/30 transition-colors">
                      <TableCell className="pl-6">
                        <div className="flex items-center">
                          <div className="h-9 w-9 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <span className="font-medium block">{plan.user?.firstName} {plan.user?.lastName}</span>
                            <span className="text-xs text-gray-500">{plan.user?.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Smartphone className="h-4 w-4 mr-2 text-indigo-500" />
                          <div>
                            <span className="font-medium block">{plan.simMaster?.mobileNumber}</span>
                            <Badge variant="secondary" className="text-[10px] h-4 uppercase">{plan.simMaster?.operator?.name}</Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{plan.rechargeDays} Days</TableCell>
                      <TableCell>{formatDate(plan.rechargeDate)}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-orange-600 font-medium">
                          <Calendar className="h-4 w-4 mr-1.5" />
                          {formatDate(plan.nextRechargeDate)}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900">₹{parseFloat(plan.amount).toLocaleString()}</TableCell>
                      <TableCell className="text-right pr-6">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => {
                            setEditData({ ...plan })
                            setHistory([])
                            fetchHistory(plan.simMasterId)
                            setIsEditPlanOpen(true)
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredPlans.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                        {searchTerm ? "No assignments match your search." : "No active assignments found."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Plan Dialog */}
      <Dialog open={isEditPlanOpen} onOpenChange={setIsEditPlanOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Recharge Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="p-3 bg-blue-50 rounded-lg flex items-center mb-2">
              <Smartphone className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <span className="text-sm font-medium text-blue-900">{editData?.simMaster?.mobileNumber}</span>
                <span className="text-xs text-blue-700 block">{editData?.user?.firstName} {editData?.user?.lastName}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Validity (Days)</Label>
                <Input 
                  type="number" 
                  value={editData?.rechargeDays || ""}
                  onChange={(e) => setEditData({ ...editData, rechargeDays: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input 
                  type="number" 
                  value={editData?.amount || ""}
                  onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Recharge Date</Label>
              <Input 
                type="date" 
                value={editData?.rechargeDate || ""}
                onChange={(e) => setEditData({ ...editData, rechargeDate: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full" onClick={handleUpdatePlan}>
                Update Current
              </Button>
              <Button className="w-full bg-blue-600" onClick={handleRenewPlan}>
                Renew (New)
              </Button>
            </div>

            {/* History Section */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                Recharge History
              </h3>
              <div className="max-h-[300px] overflow-auto rounded-md border border-gray-100">
                <Table>
                  <TableHeader className="bg-gray-50 sticky top-0 z-10">
                    <TableRow className="h-8">
                      <TableHead className="text-[10px] uppercase px-3">Date</TableHead>
                      <TableHead className="text-[10px] uppercase px-3">Amount</TableHead>
                      <TableHead className="text-[10px] uppercase px-3">Next Due</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((h, idx) => (
                      <TableRow key={h.id} className="h-9">
                        <TableCell className="text-xs px-3">{formatDate(h.rechargeDate)}</TableCell>
                        <TableCell className="text-xs px-3 font-medium">₹{h.amount}</TableCell>
                        <TableCell className="text-xs px-3 text-orange-600">{formatDate(h.nextRechargeDate)}</TableCell>
                      </TableRow>
                    ))}
                    {history.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4 text-xs text-gray-500">
                          No history found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PrivateRoute>
  )
}

function Save({ className, ...props }: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
      <path d="M7 3v4a1 1 0 0 0 1 1h7" />
    </svg>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Smartphone, Building2, Save } from "lucide-react"

export default function MobileMasters() {
  const router = useRouter()
  const [operators, setOperators] = useState<any[]>([])
  const [sims, setSims] = useState<any[]>([])
  const [newOperator, setNewOperator] = useState("")
  const [newSim, setNewSim] = useState({ mobileNumber: "", operatorId: "" })
  const [isOpDialogOpen, setIsOpDialogOpen] = useState(false)
  const [isSimDialogOpen, setIsSimDialogOpen] = useState(false)

  const fetchData = async () => {
    try {
      const token = authService.getCurrentToken()
      const headers = { 'Authorization': `Bearer ${token}` }
      const apiUrl = authService.getSettingsApiUrl()

      const [opsRes, simsRes] = await Promise.all([
        fetch(`${apiUrl}/mobile-recharge/operators`, { headers }),
        fetch(`${apiUrl}/mobile-recharge/sims`, { headers })
      ])

      if (opsRes.ok) setOperators(await opsRes.json())
      if (simsRes.ok) setSims(await simsRes.json())
    } catch (error) {
      console.error("Error fetching masters:", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAddOperator = async () => {
    if (!newOperator) return
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/mobile-recharge/operators`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authService.getCurrentToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newOperator })
      })
      if (response.ok) {
        setNewOperator("")
        setIsOpDialogOpen(false)
        fetchData()
      }
    } catch (error) {
      console.error("Error adding operator:", error)
    }
  }

  const handleAddSim = async () => {
    if (!newSim.mobileNumber || !newSim.operatorId) return
    try {
      const response = await fetch(`${authService.getSettingsApiUrl()}/mobile-recharge/sims`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authService.getCurrentToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mobileNumber: newSim.mobileNumber,
          operatorId: parseInt(newSim.operatorId)
        })
      })
      if (response.ok) {
        setNewSim({ mobileNumber: "", operatorId: "" })
        setIsSimDialogOpen(false)
        fetchData()
      }
    } catch (error) {
      console.error("Error adding SIM:", error)
    }
  }

  return (
    <PrivateRoute modulePath="admin/accounts/recharge" action="view">
      <div className="min-h-screen bg-gray-50/50 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mobile Masters</h1>
              <p className="text-gray-500 mt-1">Manage operators and company mobile numbers</p>
            </div>
            <Button variant="outline" onClick={() => router.push('/admin/accounts/recharge')}>
              Back to Recharge List
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Operators Section */}
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl font-semibold flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                  Operators
                </CardTitle>
                <Dialog open={isOpDialogOpen} onOpenChange={setIsOpDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-1" /> Add Operator
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Operator</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Operator Name</Label>
                        <Input 
                          placeholder="e.g. Airtel, Jio" 
                          value={newOperator}
                          onChange={(e) => setNewOperator(e.target.value)}
                        />
                      </div>
                      <Button className="w-full bg-blue-600" onClick={handleAddOperator}>
                        <Save className="h-4 w-4 mr-2" /> Save Operator
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Operator Name</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {operators.map((op, idx) => (
                      <TableRow key={op.id}>
                        <TableCell className="font-medium">{idx + 1}</TableCell>
                        <TableCell>{op.name}</TableCell>
                      </TableRow>
                    ))}
                    {operators.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-8 text-gray-500">
                          No operators found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Mobile Numbers Section */}
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-xl font-semibold flex items-center">
                  <Smartphone className="h-5 w-5 mr-2 text-indigo-600" />
                  Mobile Numbers
                </CardTitle>
                <Dialog open={isSimDialogOpen} onOpenChange={setIsSimDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                      <Plus className="h-4 w-4 mr-1" /> Add Number
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Company Mobile Number</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Mobile Number</Label>
                        <Input 
                          placeholder="e.g. 9876543210" 
                          value={newSim.mobileNumber}
                          onChange={(e) => setNewSim({ ...newSim, mobileNumber: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Operator</Label>
                        <Select onValueChange={(val) => setNewSim({ ...newSim, operatorId: val })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select operator" />
                          </SelectTrigger>
                          <SelectContent>
                            {operators.map(op => (
                              <SelectItem key={op.id} value={op.id.toString()}>{op.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full bg-indigo-600" onClick={handleAddSim}>
                        <Save className="h-4 w-4 mr-2" /> Save Number
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Number</TableHead>
                      <TableHead>Operator</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sims.map((sim) => (
                      <TableRow key={sim.id}>
                        <TableCell className="font-medium">{sim.mobileNumber}</TableCell>
                        <TableCell>{sim.operator?.name}</TableCell>
                      </TableRow>
                    ))}
                    {sims.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-8 text-gray-500">
                          No mobile numbers found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PrivateRoute>
  )
}

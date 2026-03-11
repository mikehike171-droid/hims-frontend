"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { TrendingUp, TrendingDown } from "lucide-react"

export default function SalaryCalculationPage() {
  const [salaryData, setSalaryData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const locationId = authService.getLocationId()
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [selectedUserDetails, setSelectedUserDetails] = useState<any>(null)

  const fetchSalaryData = async () => {
    if (!locationId) return
    try {
      setLoading(true)
      const response = await fetch(
        `${authService.getSettingsApiUrl()}/settings/salary-calculation/monthly?locationId=${locationId}&month=${selectedMonth}&year=${selectedYear}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        }
      )
      const data = await response.json()
      setSalaryData(data)
    } catch (error) {
      console.error('Error fetching salary data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSalaryData()
  }, [selectedMonth, selectedYear, locationId])

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  return (
    <PrivateRoute modulePath="admin/settings" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Monthly Salary Calculation</h1>
            <p className="text-gray-600">View calculated salaries based on attendance</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(parseInt(v))}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map(m => (
                  <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map(y => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={fetchSalaryData}>Calculate</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Salary Details - {months.find(m => m.value === selectedMonth)?.label} {selectedYear}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Base Salary</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Worked Days</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Worked Hours</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved Leaves</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pending Leaves</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Absent</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Addition</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deduction</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Final Salary</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y">
                    {salaryData.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-gray-500">No data available</td>
                      </tr>
                    ) : (
                      salaryData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-blue-600 cursor-pointer hover:underline" onClick={() => {
                            setSelectedUserDetails(item)
                            setShowDetailsDialog(true)
                          }}>{item.userName}</td>
                          <td className="px-4 py-3">₹{item.monthlySalary?.toLocaleString()}</td>
                          <td className="px-4 py-3">{item.totalWorkedDays}/{item.expectedWorkingDays}</td>
                          <td className="px-4 py-3">{item.totalWorkedHours}h</td>
                          <td className="px-4 py-3 text-green-600">{item.approvedLeaveDays}</td>
                          <td className="px-4 py-3 text-orange-600">{item.pendingLeaveDays || 0}</td>
                          <td className="px-4 py-3 text-red-600">{item.absentDays}</td>
                          <td className="px-4 py-3 text-green-600">
                            {item.salaryAddition > 0 && (
                              <span className="flex items-center gap-1">
                                <TrendingUp className="h-4 w-4" />
                                ₹{item.salaryAddition?.toLocaleString()}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-red-600">
                            {item.salaryDeduction > 0 && (
                              <span className="flex items-center gap-1">
                                <TrendingDown className="h-4 w-4" />
                                ₹{item.salaryDeduction?.toLocaleString()}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-bold text-green-700">₹{item.finalSalary?.toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedUserDetails?.userName} - Salary Details</DialogTitle>
            </DialogHeader>
            {selectedUserDetails && (
              <div className="space-y-4 pb-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-gray-500">Total Working Hours</div>
                      <div className="text-2xl font-bold">{selectedUserDetails.totalWorkedHours}h</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-gray-500">Total Working Days</div>
                      <div className="text-2xl font-bold">{selectedUserDetails.totalWorkedDays}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-gray-500">Approved Leaves</div>
                      <div className="text-2xl font-bold text-green-600">{selectedUserDetails.approvedLeaveDays}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-gray-500">Pending Leaves</div>
                      <div className="text-2xl font-bold text-orange-600">{selectedUserDetails.pendingLeaveDays || 0}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-sm text-gray-500">Extra Working Days</div>
                      <div className="text-2xl font-bold text-green-600">{selectedUserDetails.extraDaysWorked}</div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Salary Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Base Monthly Salary:</span>
                        <span className="font-semibold">₹{selectedUserDetails.monthlySalary?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Daily Salary:</span>
                        <span className="font-semibold">₹{selectedUserDetails.dailySalary?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expected Working Days:</span>
                        <span className="font-semibold">{selectedUserDetails.expectedWorkingDays}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Absent Days:</span>
                        <span className="font-semibold text-red-600">{selectedUserDetails.absentDays}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Approved Leave Days:</span>
                        <span className="font-semibold text-green-600">{selectedUserDetails.approvedLeaveDays}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending Leave Days:</span>
                        <span className="font-semibold text-orange-600">{selectedUserDetails.pendingLeaveDays || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Holiday Days:</span>
                        <span className="font-semibold">{selectedUserDetails.holidayDays}</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between text-green-600">
                        <span>Salary Addition:</span>
                        <span className="font-semibold">+₹{selectedUserDetails.salaryAddition?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Salary Deduction:</span>
                        <span className="font-semibold">-₹{selectedUserDetails.salaryDeduction?.toLocaleString()}</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between text-lg font-bold text-green-700">
                        <span>Final Salary:</span>
                        <span>₹{selectedUserDetails.finalSalary?.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PrivateRoute>
  )
}

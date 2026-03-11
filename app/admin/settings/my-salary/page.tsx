"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { DollarSign, Calendar, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle } from "lucide-react"

export default function MySalaryPage() {
  const [salaryData, setSalaryData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const currentUser = authService.getCurrentUser()
  const userId = currentUser?.id
  const locationId = authService.getLocationId()

  const fetchSalaryData = async () => {
    if (!userId || !locationId) return
    try {
      setLoading(true)
      const response = await fetch(
        `${authService.getSettingsApiUrl()}/settings/salary-calculation/user?userId=${userId}&locationId=${locationId}&month=${selectedMonth}&year=${selectedYear}`,
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
  }, [selectedMonth, selectedYear, userId, locationId])

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
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Salary Sheet</h1>
            <p className="text-gray-600">View your monthly salary details</p>
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
            <Button onClick={fetchSalaryData}>Refresh</Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : salaryData ? (
          <>
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <DollarSign className="h-4 w-4" />
                    Base Salary
                  </div>
                  <div className="text-2xl font-bold">₹{salaryData.monthlySalary?.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Calendar className="h-4 w-4" />
                    Working Days
                  </div>
                  <div className="text-2xl font-bold">{salaryData.totalWorkedDays}/{salaryData.expectedWorkingDays}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Clock className="h-4 w-4" />
                    Total Hours
                  </div>
                  <div className="text-2xl font-bold">{salaryData.totalWorkedHours}h</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <DollarSign className="h-4 w-4" />
                    Final Salary
                  </div>
                  <div className="text-2xl font-bold text-green-700">₹{salaryData.finalSalary?.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Approved Leaves</span>
                    </div>
                    <span className="font-bold text-green-700">{salaryData.approvedLeaveDays} days</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-orange-600" />
                      <span>Pending Leaves</span>
                    </div>
                    <span className="font-bold text-orange-700">{salaryData.pendingLeaveDays || 0} days</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span>Absent Days</span>
                    </div>
                    <span className="font-bold text-red-700">{salaryData.absentDays} days</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <span>Holiday Days</span>
                    </div>
                    <span className="font-bold text-blue-700">{salaryData.holidayDays} days</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      <span>Extra Days Worked</span>
                    </div>
                    <span className="font-bold text-purple-700">{salaryData.extraDaysWorked} days</span>
                  </div>

                  {salaryData.shortHours > 0 && (
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        <span>Short Hours</span>
                      </div>
                      <span className="font-bold text-yellow-700">{salaryData.shortHours}h</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Salary Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Base Monthly Salary</span>
                      <span className="font-semibold">₹{salaryData.monthlySalary?.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Daily Salary Rate</span>
                      <span className="font-semibold">₹{salaryData.dailySalary?.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Total Days in Month</span>
                      <span className="font-semibold">{salaryData.totalDaysInMonth} days</span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Expected Working Days</span>
                      <span className="font-semibold">{salaryData.expectedWorkingDays} days</span>
                    </div>

                    <div className="border-t pt-3 mt-3">
                      {salaryData.salaryAddition > 0 && (
                        <div className="flex justify-between py-2 text-green-600">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            <span>Salary Addition</span>
                          </div>
                          <span className="font-semibold">+₹{salaryData.salaryAddition?.toLocaleString()}</span>
                        </div>
                      )}

                      {salaryData.salaryDeduction > 0 && (
                        <div className="flex justify-between py-2 text-red-600">
                          <div className="flex items-center gap-2">
                            <TrendingDown className="h-4 w-4" />
                            <span>Salary Deduction</span>
                          </div>
                          <span className="font-semibold">-₹{salaryData.salaryDeduction?.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-3 mt-3 flex justify-between text-lg font-bold">
                      <span>Final Salary</span>
                      <span className="text-green-700">₹{salaryData.finalSalary?.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Important Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Working hours: 9 hours per day (including 1h lunch, 15min tea break, 15min grace time)</li>
                  <li>• Required working hours: 7.5 hours per day</li>
                  <li>• Approved leaves do not affect salary</li>
                  <li>• Absent days and short hours result in salary deduction</li>
                  <li>• Extra days worked are added to salary</li>
                  <li>• Monthly mandatory week-offs: 4 days</li>
                </ul>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">No salary data available</div>
        )}
      </div>
    </PrivateRoute>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Calendar as CalendarIcon,
  Filter,
  Users,
  TrendingUp,
  MapPin,
  ArrowLeft,
  RefreshCw,
  Search,
  PieChart
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import PrivateRoute from "@/components/auth/PrivateRoute"
import authService from "@/lib/authService"
import { settingsApi } from "@/lib/settingsApi"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function PatientSourcePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [sourceCounts, setSourceCounts] = useState<any[]>([])
  
  // Date filters - Default to 1st of current month to today
  const [fromDate, setFromDate] = useState<Date>(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [toDate, setToDate] = useState<Date>(new Date())
  
  // Location selection (default to selected branch ID or "all")
  const [selectedLocationId, setSelectedLocationId] = useState<string>("all")
  
  // Stats
  const [totalPatients, setTotalPatients] = useState<number>(0)
  const [topSource, setTopSource] = useState<{ title: string; count: number }>({ title: "N/A", count: 0 })

  useEffect(() => {
    // Set initial branch from authService
    const currentBranchId = authService.getSelectedBranchId() || authService.getLocationId() || "all"
    setSelectedLocationId(currentBranchId)
  }, [])

  // Refetch counts only when location changes
  useEffect(() => {
    fetchSourceCounts()
  }, [selectedLocationId])

  // Sync with global branch selection
  useEffect(() => {
    const handleBranchChange = () => {
      const currentBranchId = authService.getSelectedBranchId()
      if (currentBranchId) {
        setSelectedLocationId(currentBranchId)
      }
    }

    window.addEventListener('branchChanged', handleBranchChange)
    return () => {
      window.removeEventListener('branchChanged', handleBranchChange)
    }
  }, [])



  const fetchSourceCounts = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const params = new URLSearchParams()
      
      if (selectedLocationId && selectedLocationId !== "all" && selectedLocationId !== "0") {
        params.append('locationId', selectedLocationId)
      }
      
      if (fromDate) params.append('fromDate', format(fromDate, "yyyy-MM-dd"))
      if (toDate) params.append('toDate', format(toDate, "yyyy-MM-dd"))

      const url = `${authService.getSettingsApiUrl()}/patients/source-wise-counts?${params}`

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          setSourceCounts(data)
          
          // Calculate stats
          const total = data.reduce((sum, item) => sum + item.count, 0)
          setTotalPatients(total)

          if (data.length > 0) {
            const sorted = [...data].sort((a, b) => b.count - a.count)
            setTopSource({ title: sorted[0].title, count: sorted[0].count })
          } else {
            setTopSource({ title: "N/A", count: 0 })
          }
        }
      }
    } catch (error) {
      console.error("Error fetching patient source counts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    fetchSourceCounts()
  }

  return (
    <PrivateRoute modulePath="admin/front-office/patients" action="view">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Patient Source Counts</h1>
              <p className="text-gray-600">Analyze patient registration count broken down by source</p>
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">

              {/* From Date */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarIcon className="h-3.5 w-3.5 text-blue-500" />
                  From Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full h-9 justify-start text-left font-normal border-gray-200",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {fromDate ? format(fromDate, "dd/MM/yyyy") : <span>From Date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-xl bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={(date: Date | undefined) => date && setFromDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* To Date */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarIcon className="h-3.5 w-3.5 text-blue-500" />
                  To Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full h-9 justify-start text-left font-normal border-gray-200",
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                      {toDate ? format(toDate, "dd/MM/yyyy") : <span>To Date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-xl bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={(date: Date | undefined) => date && setToDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="flex-1 h-9 bg-red-600 hover:bg-red-700 transition-colors"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 border-gray-200"
                  onClick={fetchSourceCounts}
                  disabled={loading}
                  title="Reload Stats"
                >
                  <RefreshCw className={cn("h-4 w-4 text-gray-600", loading && "animate-spin")} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>



        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading channel distribution...</div>
            ) : sourceCounts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No registration data found for the selected filters.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-700 w-1/3">Source Name</TableHead>
                      <TableHead className="font-semibold text-gray-700 w-1/3">Count</TableHead>
                      <TableHead className="font-semibold text-gray-700 w-1/3">Share</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sourceCounts.map((sourceItem) => {
                      const pct = totalPatients > 0 ? Math.round((sourceItem.count / totalPatients) * 100) : 0
                      return (
                        <TableRow key={sourceItem.source} className="hover:bg-gray-50/50">
                          <TableCell className="font-medium text-gray-900">{sourceItem.title}</TableCell>
                          <TableCell className="font-semibold text-gray-900">{sourceItem.count}</TableCell>
                          <TableCell className="text-gray-600 font-medium">{pct}%</TableCell>
                        </TableRow>
                      )
                    })}
                    <TableRow className="bg-gray-50/80 font-bold">
                      <TableCell colSpan={1} className="text-gray-800">Total</TableCell>
                      <TableCell className="text-red-600">{totalPatients}</TableCell>
                      <TableCell className="text-gray-800">100%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  )
}

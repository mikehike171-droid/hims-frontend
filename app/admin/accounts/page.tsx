"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Calendar, DollarSign, CreditCard, RefreshCw } from 'lucide-react'
import authService from '@/lib/authService'
import settingsApi from '@/lib/settingsApi'
import PrivateRoute from "@/components/auth/PrivateRoute"

interface TodayCollection {
  examinationid: number
  patientid: number
  examinationdate: string
  totalamount: string
  installmentamount: string
  total_installment_amount: string
  paymentdate: string
  paymentmethod: string
  firstname: string
  lastname: string
  custompatientid: string
  patient_fee: string
  patient_fee_type: string
  patient_amount: string
  locationid: number
}

export default function TodayCollectionsPage() {
  const [collections, setCollections] = useState<TodayCollection[]>([])
  const [filteredCollections, setFilteredCollections] = useState<TodayCollection[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0])
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    fetchTodayCollections()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [collections, searchTerm])

  const fetchTodayCollections = async () => {
    try {
      setLoading(true)
      const locationId = authService.getLocationId()
      const data = await settingsApi.getTodayCollections(
        locationId ? parseInt(locationId) : undefined,
        fromDate,
        toDate
      )
      setCollections(data)
    } catch (error) {
      console.error('Error fetching today collections:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = collections

    if (searchTerm) {
      filtered = filtered.filter(collection =>
        collection.patientid?.toString().includes(searchTerm) ||
        collection.examinationid?.toString().includes(searchTerm) ||
        collection.paymentmethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.custompatientid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${collection.firstname} ${collection.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredCollections(filtered)
  }

  const getTotalCollections = () => {
    return filteredCollections.reduce((sum, collection) => 
      sum + Number(collection.patient_amount || 0) + Number(collection.total_installment_amount || 0), 0)
  }

  const getRegistrationTotal = () => {
    return filteredCollections.reduce((sum, collection) => sum + Number(collection.patient_amount || 0), 0)
  }

  const getBillingTotal = () => {
    return filteredCollections.reduce((sum, collection) => sum + Number(collection.total_installment_amount || 0), 0)
  }

  const getPaymentMethodCounts = () => {
    const counts: { [key: string]: { count: number; amount: number } } = {}
    filteredCollections.forEach(collection => {
      const methods = (collection.paymentmethod || '').split(', ')
      methods.forEach((method, idx) => {
        const trimmedMethod = method.trim()
        if (!trimmedMethod) return
        if (!counts[trimmedMethod]) {
          counts[trimmedMethod] = { count: 0, amount: 0 }
        }
        counts[trimmedMethod].count++
        const amounts = (collection.installmentamount || '').split(', ')
        counts[trimmedMethod].amount += Number(amounts[idx] || 0)
      })
    })
    return counts
  }

  const getFeeTypeCounts = () => {
    const counts: { [key: string]: { count: number; amount: number } } = {}
    filteredCollections.forEach(collection => {
      const feeType = collection.patient_fee_type || 'Other'
      if (!counts[feeType]) {
        counts[feeType] = { count: 0, amount: 0 }
      }
      counts[feeType].count++
      // For Fee Type Summary, strictly sum Reg Amounts
      counts[feeType].amount += Number(collection.patient_amount || 0)
    })
    return counts
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString()
  }

  return (
    <PrivateRoute modulePath="admin/accounts" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Collections</h1>
            <p className="text-gray-600">View payment collections</p>
          </div>
          <Button onClick={fetchTodayCollections} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-green-600 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-black text-green-700">
                    {formatCurrency(getTotalCollections())}
                  </div>
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">Grand Total</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-purple-500 shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-xl font-black text-purple-700">{formatCurrency(getRegistrationTotal())}</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Registration Fees</div>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Badge variant="outline" className="text-purple-700 border-purple-200">Fee Types</Badge>
                </div>
              </div>
              <div className="space-y-1 max-h-[80px] overflow-y-auto mt-2">
                {Object.entries(getFeeTypeCounts()).map(([fType, data]) => (
                  <div key={fType} className="flex justify-between text-[11px] font-medium border-b border-gray-50 py-0.5">
                    <span className="text-gray-500">{fType}:</span>
                    <span className="text-purple-600 font-bold">{formatCurrency((data as any).amount || 0)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-blue-500 shadow-md">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-xl font-black text-blue-700">{formatCurrency(getBillingTotal())}</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Examination Billing</div>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Badge variant="outline" className="text-blue-700 border-blue-200">Methods</Badge>
                </div>
              </div>
              <div className="space-y-1 max-h-[80px] overflow-y-auto mt-2">
                {Object.entries(getPaymentMethodCounts()).map(([method, data]) => (
                  <div key={method} className="flex justify-between text-[11px] font-medium border-b border-gray-50 py-0.5">
                    <span className="text-gray-500">{method}:</span>
                    <span className="text-blue-600 font-bold">{formatCurrency((data as any).amount || 0)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-gray-400 shadow-md">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-gray-500" />
                <div className="text-sm font-bold text-gray-700">
                  {filteredCollections.length} <span className="text-xs font-normal text-gray-400">Transactions</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 border-t border-gray-50 pt-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div className="text-sm font-bold text-gray-700">
                  {new Set(filteredCollections.map(c => c.patientid)).size} <span className="text-xs font-normal text-gray-400">Patients</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>From Date</Label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div>
                <Label>To Date</Label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              <div>
                <Label>Search</Label>
                <Input
                  placeholder="Search by Patient ID, Name, Method..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-end gap-2">
                <Button
                  onClick={fetchTodayCollections}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Search
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    const today = new Date().toISOString().split('T')[0]
                    setFromDate(today)
                    setToDate(today)
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Collections ({filteredCollections.length}) - {fromDate === toDate ? formatDate(fromDate) : `${formatDate(fromDate)} to ${formatDate(toDate)}`}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loc ID</TableHead>
                  <TableHead>Examination Date</TableHead>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Fee Type</TableHead>
                  <TableHead>Reg. Amount</TableHead>
                  <TableHead>Inst. Amount</TableHead>
                  <TableHead>Total Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filteredCollections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No collections found for the selected date range.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCollections.map((collection) => (
                  <TableRow key={`${collection.examinationid}`}>
                    <TableCell>{collection.locationid || 'N/A'}</TableCell>
                    <TableCell>{formatDate(collection.examinationdate)}</TableCell>
                    <TableCell className="font-medium">{collection.custompatientid || 'N/A'}</TableCell>
                    <TableCell>{`${collection.firstname || ''} ${collection.lastname || ''}`.trim() || 'Unknown'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {collection.paymentmethod.split(', ').map((method, idx) => (
                          <Badge key={idx} variant="outline">{method}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{collection.patient_fee_type || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(Number(collection.patient_amount || 0))}
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Breakdown: {collection.installmentamount}</span>
                        <span>{formatCurrency(Number(collection.total_installment_amount))}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-blue-600">
                      {formatCurrency(Number(collection.patient_amount || 0) + Number(collection.total_installment_amount || 0))}
                    </TableCell>
                  </TableRow>
                ))
                )}
              </TableBody>
              {filteredCollections.length > 0 && (
                <tfoot className="bg-gray-50 font-bold border-t-2 border-gray-200">
                  <TableRow>
                    <TableCell colSpan={6} className="text-right">Totals:</TableCell>
                    <TableCell>
                      {formatCurrency(filteredCollections.reduce((sum, c) => sum + Number(c.patient_amount || 0), 0))}
                    </TableCell>
                    <TableCell className="text-green-600">
                      {formatCurrency(filteredCollections.reduce((sum, c) => sum + Number(c.total_installment_amount || 0), 0))}
                    </TableCell>
                    <TableCell className="text-blue-600">
                      {formatCurrency(getTotalCollections())}
                    </TableCell>
                  </TableRow>
                </tfoot>
              )}
            </Table>
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  )
}
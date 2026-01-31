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

interface TodayCollection {
  examinationid: number
  patientid: number
  examinationdate: string
  totalamount: string
  installmentid: number
  installmentamount: string
  paymentdate: string
  paymentmethod: string
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
        collection.patientid.toString().includes(searchTerm) ||
        collection.examinationid.toString().includes(searchTerm) ||
        collection.paymentmethod.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredCollections(filtered)
  }

  const getTotalCollections = () => {
    return filteredCollections.reduce((sum, collection) => sum + Number(collection.installmentamount), 0)
  }

  const getPaymentMethodCounts = () => {
    const counts: { [key: string]: { count: number; amount: number } } = {}
    filteredCollections.forEach(collection => {
      const method = collection.paymentmethod
      if (!counts[method]) {
        counts[method] = { count: 0, amount: 0 }
      }
      counts[method].count++
      counts[method].amount += Number(collection.installmentamount)
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(getTotalCollections())}
                </div>
                <div className="text-sm text-gray-600">Total Collections</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {filteredCollections.length}
                </div>
                <div className="text-sm text-gray-600">Total Transactions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(filteredCollections.map(c => c.patientid)).size}
                </div>
                <div className="text-sm text-gray-600">Unique Patients</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-semibold text-gray-700">Payment Methods</div>
            <div className="space-y-1 mt-2">
              {Object.entries(getPaymentMethodCounts()).map(([method, data]) => (
                <div key={method} className="flex justify-between text-sm">
                  <span>{method}:</span>
                  <span className="font-medium">{formatCurrency(data.amount)}</span>
                </div>
              ))}
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
                placeholder="Search by Patient ID, Examination ID..."
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
                <TableHead>Examination Date</TableHead>
                <TableHead>Payment Time</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredCollections.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No collections found for the selected date range.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCollections.map((collection) => (
                  <TableRow key={`${collection.installmentid}-${collection.examinationid}`}>
                    <TableCell>{formatDate(collection.examinationdate)}</TableCell>
                    <TableCell>{formatTime(collection.paymentdate)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{collection.paymentmethod}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {formatCurrency(Number(collection.installmentamount))}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
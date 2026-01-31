"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import authService from "@/lib/authService"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function AssignMobilePage() {
  const [unassignedNumbers, setUnassignedNumbers] = useState([])
  const [users, setUsers] = useState([])
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])
  const [selectedUser, setSelectedUser] = useState("")
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState(false)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 })
  const hasFetched = useRef(false)
  const [numberCount, setNumberCount] = useState("")

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true
      fetchData()
    }
  }, [])

  const fetchData = async (page = 1) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      
      // Fetch unassigned numbers with pagination
      const numbersResponse = await fetch(`${authService.getSettingsApiUrl()}/mobile-assign/unassigned?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (numbersResponse.ok) {
        const result = await numbersResponse.json()
        setUnassignedNumbers(result.data)
        setPagination(result.pagination)
      }

      // Fetch users only once
      if (users.length === 0) {
        const usersResponse = await fetch(`${authService.getSettingsApiUrl()}/mobile-assign/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          setUsers(usersData)
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNumberSelect = (numberId: number, checked: boolean) => {
    if (checked) {
      setSelectedNumbers([...selectedNumbers, numberId])
    } else {
      setSelectedNumbers(selectedNumbers.filter(id => id !== numberId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedNumbers(unassignedNumbers.map((num: any) => num.id))
    } else {
      setSelectedNumbers([])
    }
  }

  const handleAssign = async () => {
    if (selectedNumbers.length === 0 || !selectedUser) {
      alert('Please select numbers and user')
      return
    }

    setAssigning(true)
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/mobile-assign/assign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobileIds: selectedNumbers,
          userId: parseInt(selectedUser)
        })
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Successfully assigned ${result.count} numbers`)
        setSelectedNumbers([])
        setSelectedUser("")
        fetchData()
      } else {
        alert('Failed to assign numbers')
      }
    } catch (error) {
      alert('Error assigning numbers')
    } finally {
      setAssigning(false)
    }
  }

  const handleAssignByCount = async () => {
    if (!selectedUser || !numberCount) {
      alert('Please select user and enter number count')
      return
    }

    const count = parseInt(numberCount)
    if (count <= 0 || count > unassignedNumbers.length) {
      alert(`Please enter a number between 1 and ${unassignedNumbers.length}`)
      return
    }

    const numbersToAssign = unassignedNumbers.slice(0, count).map((num: any) => num.id)

    setAssigning(true)
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/mobile-assign/assign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobileIds: numbersToAssign,
          userId: parseInt(selectedUser)
        })
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Successfully assigned ${result.count} numbers`)
        setSelectedUser("")
        setNumberCount("")
        fetchData()
      } else {
        alert('Failed to assign numbers')
      }
    } catch (error) {
      alert('Error assigning numbers')
    } finally {
      setAssigning(false)
    }
  }

  return (
    <PrivateRoute>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Assign Mobile Numbers to Employee</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Select User</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user: any) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.first_name} {user.last_name} ({user.username})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                type="number"
                placeholder="Enter number of records to assign"
                value={numberCount}
                onChange={(e) => setNumberCount(e.target.value)}
                min="1"
                max={unassignedNumbers.length}
              />
              
              <Button 
                onClick={handleAssignByCount} 
                disabled={assigning || !selectedUser || !numberCount}
                className="w-full"
              >
                {assigning ? 'Assigning...' : 'Assign Numbers'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assignment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Selected Numbers: {selectedNumbers.length}</p>
              <p>Available Numbers: {unassignedNumbers.length}</p>
              <Button 
                onClick={handleAssign} 
                disabled={assigning || selectedNumbers.length === 0 || !selectedUser}
                className="mt-4 w-full"
              >
                {assigning ? 'Assigning...' : 'Assign Numbers'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              Unassigned Mobile Numbers ({pagination.total})
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="selectAll"
                  checked={selectedNumbers.length === unassignedNumbers.length && unassignedNumbers.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <label htmlFor="selectAll" className="text-sm">Select All</label>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Select</TableHead>
                      <TableHead>Mobile Number</TableHead>
                      <TableHead>Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unassignedNumbers.map((number: any) => (
                      <TableRow key={number.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedNumbers.includes(number.id)}
                            onCheckedChange={(checked) => handleNumberSelect(number.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>{number.mobile}</TableCell>
                        <TableCell>{new Date(number.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">
                    Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={pagination.page <= 1}
                      onClick={() => fetchData(pagination.page - 1)}
                    >
                      Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => fetchData(pagination.page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  )
}
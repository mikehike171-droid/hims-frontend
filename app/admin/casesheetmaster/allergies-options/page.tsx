"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, List, Edit } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { settingsApi } from "@/lib/settingsApi"
import authService from "@/lib/authService"

export default function AllergiesOptionsPage() {
  const [allergies, setAllergies] = useState<any[]>([])
  const [allOptions, setAllOptions] = useState<any[]>([])
  const [selectedAllergyId, setSelectedAllergyId] = useState<string>("")
  const [optionTitle, setOptionTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true
      const loadData = async () => {
        await fetchAllergies()
        await fetchAllOptions()
      }
      loadData()
    }
  }, [])

  const fetchAllergies = async () => {
    try {
      const locationId = authService.getLocationId()
      const data = await settingsApi.getAllergies(locationId ? parseInt(locationId) : 1)
      setAllergies(data || [])
      return data
    } catch (error) {
      console.error('Error fetching allergies:', error)
      return []
    }
  }

  const fetchAllOptions = async () => {
    try {
      setLoading(true)
      const allOptionsData = await settingsApi.getAllAllergiesOptions()
      setAllOptions(allOptionsData || [])
    } catch (error) {
      console.error('Error fetching all options:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!selectedAllergyId || !optionTitle.trim()) {
      toast({
        title: "Error",
        description: "Please select an allergy category and enter option title",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      const dataToSave = {
        title: optionTitle.trim(),
        allergy_id: parseInt(selectedAllergyId)
      }
      
      await settingsApi.createAllergyOption(dataToSave)
      toast({
        title: "Success", 
        description: "Allergy option created successfully",
      })
      
      // Reset form
      setSelectedAllergyId("")
      setOptionTitle("")
      
      // Refresh options
      await fetchAllOptions()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save allergy option",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PrivateRoute modulePath="admin/casesheetmaster" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Allergies Options</h1>
            <p className="text-gray-600">Add options for allergy categories</p>
          </div>
        </div>

        {/* Add New Option Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add New Option</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label>Allergy Category *</Label>
                <Select 
                  value={selectedAllergyId} 
                  onValueChange={setSelectedAllergyId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {allergies.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Option Title *</Label>
                <Input
                  value={optionTitle}
                  onChange={(e) => setOptionTitle(e.target.value)}
                  placeholder="Enter option title"
                />
              </div>
              
              <Button 
                onClick={handleSave} 
                disabled={loading || !selectedAllergyId || !optionTitle.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Saving...' : 'Save Option'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* All Options Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <List className="h-5 w-5" />
              <span>All Allergy Options</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Option Title</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">Loading...</TableCell>
                  </TableRow>
                ) : allOptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">No options found</TableCell>
                  </TableRow>
                ) : (
                  allOptions.map((option) => (
                    <TableRow key={option.id}>
                      <TableCell className="font-medium">
                        {allergies.find(h => h.id === option.allergy_id)?.title || 'Unknown'}
                      </TableCell>
                      <TableCell>{option.title}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAllergyId(option.allergy_id.toString())
                            setOptionTitle(option.title)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  )
}
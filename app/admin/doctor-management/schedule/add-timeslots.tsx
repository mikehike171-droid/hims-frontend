"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, Save } from "lucide-react"
import { doctorsApi, Doctor } from "@/lib/doctorsApi"
import { Calendar } from "@/components/ui/calendar"

export default function AddTimeSlotsComponent() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    doctorId: "",
    selectedDates: [] as string[],
    timeSlots: [{ startTime: "", endTime: "", duration: 30 }],
  })

  useEffect(() => {
    loadDoctors()
  }, [])

  const loadDoctors = async () => {
    try {
      setLoading(true)
      const response = await doctorsApi.getDoctors()
      if (Array.isArray(response) && response.length > 0) {
        setDoctors(response)
      } else {
        setDoctors([])
      }
    } catch (error) {
      console.error('Error loading doctors:', error)
      setDoctors([])
    } finally {
      setLoading(false)
    }
  }

  const addTimeSlot = () => {
    setFormData({
      ...formData,
      timeSlots: [...formData.timeSlots, { startTime: "", endTime: "", duration: 30 }],
    })
  }

  const removeTimeSlot = (index: number) => {
    const newTimeSlots = formData.timeSlots.filter((_, i) => i !== index)
    setFormData({ ...formData, timeSlots: newTimeSlots })
  }

  const updateTimeSlot = (index: number, field: "startTime" | "endTime" | "duration", value: string | number) => {
    const newTimeSlots = [...formData.timeSlots]
    newTimeSlots[index][field] = value
    setFormData({ ...formData, timeSlots: newTimeSlots })
  }

  const handleDateSelection = (date: string) => {
    if (!date) return
    const newDates = formData.selectedDates.includes(date)
      ? formData.selectedDates.filter(d => d !== date)
      : [...formData.selectedDates, date]
    setFormData({ ...formData, selectedDates: newDates })
  }

  const clearAllDates = () => {
    setFormData({ ...formData, selectedDates: [] })
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const validTimeSlots = formData.timeSlots.filter(slot => slot.startTime && slot.endTime)
      
      if (formData.selectedDates.length === 0 || validTimeSlots.length === 0) {
        alert('Please select at least one date and one time slot')
        return
      }

      let successCount = 0
      let errorCount = 0

      for (const date of formData.selectedDates) {
        for (const slot of validTimeSlots) {
          try {
            await doctorsApi.createBulkTimeslots({
              userId: parseInt(formData.doctorId),
              date: date,
              fromTime: slot.startTime,
              toTime: slot.endTime,
              duration: slot.duration || 30,
              locationId: 1
            })
            successCount++
          } catch (error) {
            console.error(`Error saving slot for ${date}:`, error)
            errorCount++
          }
        }
      }
      
      if (errorCount === 0) {
        alert(`Time slots saved successfully for ${formData.selectedDates.length} date(s)!`)
      } else {
        alert(`Saved ${successCount} slots, ${errorCount} failed.`)
      }
      
      setFormData({
        doctorId: "",
        selectedDates: [],
        timeSlots: [{ startTime: "", endTime: "", duration: 30 }],
      })
    } catch (error) {
      console.error('Error saving timeslots:', error)
      alert('Error saving time slots')
    } finally {
      setLoading(false)
    }
  }

  const selectedDoctor = doctors.find(d => d.id.toString() === formData.doctorId)

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Time Slots</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="doctor">Select Doctor *</Label>
              <Select 
                value={formData.doctorId} 
                onValueChange={(value) => setFormData({...formData, doctorId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors && doctors.length > 0 ? doctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                      Dr. {doctor.first_name} {doctor.last_name} - {doctor.department_name}
                    </SelectItem>
                  )) : (
                    <SelectItem value="no-doctors" disabled>
                      No doctors available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Select Dates * ({formData.selectedDates.length} selected)</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllDates}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
              <div className="border rounded p-3">
                <Calendar
                  mode="multiple"
                  selected={formData.selectedDates.map(date => new Date(date))}
                  onSelect={(dates) => {
                    if (dates) {
                      const dateStrings = dates.map(date => date.toISOString().split('T')[0])
                      setFormData({ ...formData, selectedDates: dateStrings })
                    } else {
                      setFormData({ ...formData, selectedDates: [] })
                    }
                  }}
                  className="rounded-md"
                />
                {formData.selectedDates.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <Label className="text-xs text-gray-600">Selected Dates ({formData.selectedDates.length}):</Label>
                    <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                      {formData.selectedDates.sort().map((date, index) => (
                        <div key={`${date}-${index}`} className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {date}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDateSelection(date)}
                            className="ml-1 h-4 w-4 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {selectedDoctor && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900">Selected Doctor</h3>
              <p className="text-sm text-blue-700">
                Dr. {selectedDoctor.first_name} {selectedDoctor.last_name}
              </p>
              <p className="text-sm text-blue-600">{selectedDoctor.department_name}</p>
              <p className="text-sm text-blue-600">{selectedDoctor.email}</p>
            </div>
          )}
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>Time Slots *</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addTimeSlot}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Slot
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.timeSlots.map((slot, index) => (
                <div key={index} className="flex gap-3 items-center p-3 border rounded-lg">
                  <div className="flex-1">
                    <Label className="text-xs text-gray-600">Start Time</Label>
                    <Input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => updateTimeSlot(index, "startTime", e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-gray-600">End Time</Label>
                    <Input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => updateTimeSlot(index, "endTime", e.target.value)}
                    />
                  </div>
                  <div className="w-24">
                    <Label className="text-xs text-gray-600">Duration (min)</Label>
                    <Input
                      type="number"
                      value={slot.duration}
                      onChange={(e) => updateTimeSlot(index, "duration", parseInt(e.target.value) || 30)}
                      min="15"
                      step="15"
                    />
                  </div>
                  {formData.timeSlots.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeTimeSlot(index)}
                      className="mt-5"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={loading || !formData.doctorId || formData.selectedDates.length === 0}
            className="w-full"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Time Slots'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
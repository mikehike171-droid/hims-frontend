"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Phone } from "lucide-react"
import authService from "@/lib/authService"

interface CallHistoryRecord {
  sno: number
  dateTime: string
  nextCallDate: string
  disposition: string
  callerName: string
  patientFeeling: string
  notes: string
}

interface Click2CallModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId?: string
  patientName?: string
}

export function Click2CallModal({ open, onOpenChange, patientId, patientName }: Click2CallModalProps) {
  const [nextCallDate, setNextCallDate] = useState("")
  const [disposition, setDisposition] = useState("")
  const [patientFeeling, setPatientFeeling] = useState("")
  const [notes, setNotes] = useState("")
  const [isHistoryOpen, setIsHistoryOpen] = useState(true)
  const [callHistory, setCallHistory] = useState<CallHistoryRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Fetch call history when modal opens
  useEffect(() => {
    if (open && patientId) {
      fetchCallHistory()
    }
  }, [open, patientId])

  const fetchCallHistory = async () => {
    if (!patientId) return
    
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const baseUrl = authService.getSettingsApiUrl()
      const locationId = authService.getLocationId()
      
      const response = await fetch(`${baseUrl}/patients/${patientId}/call-history?locationId=${locationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const history = await response.json()
        setCallHistory(Array.isArray(history) ? history : [])
      } else {
        console.error('Failed to fetch call history:', response.status)
      }
    } catch (error) {
      console.error('Error fetching call history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCall = async () => {
    if (!patientId) return
    
    try {
      setSubmitting(true)
      const token = localStorage.getItem('authToken')
      const baseUrl = authService.getSettingsApiUrl()
      const locationId = authService.getLocationId()
      
      const callData = {
        nextCallDate: nextCallDate || null,
        disposition,
        patientFeeling,
        notes: notes || 'Call initiated'
      }
      
      const response = await fetch(`${baseUrl}/patients/${patientId}/call-history?locationId=${locationId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(callData)
      })
      
      if (response.ok) {
        // Reset form
        setNextCallDate('')
        setDisposition('')
        setPatientFeeling('')
        setNotes('')
        
        // Refresh call history
        await fetchCallHistory()
        
        alert('Call record saved successfully!')
      } else {
        alert('Failed to save call record')
      }
    } catch (error) {
      console.error('Error saving call record:', error)
      alert('Error saving call record')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Click 2 Call Patient</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nextCallDate">Next Call Date</Label>
              <Input
                id="nextCallDate"
                type="date"
                value={nextCallDate}
                onChange={(e) => setNextCallDate(e.target.value)}
                placeholder="mm/dd/yyyy"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="disposition">Disposition</Label>
              <Select value={disposition} onValueChange={setDisposition}>
                <SelectTrigger>
                  <SelectValue placeholder="--Select--" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="answered">Answered</SelectItem>
                  <SelectItem value="no-answer">No Answer</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="voicemail">Voicemail</SelectItem>
                  <SelectItem value="wrong-number">Wrong Number</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="patientFeeling">Patient Feeling</Label>
              <Select value={patientFeeling} onValueChange={setPatientFeeling}>
                <SelectTrigger>
                  <SelectValue placeholder="--Select--" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="better">Better</SelectItem>
                  <SelectItem value="same">Same</SelectItem>
                  <SelectItem value="worse">Worse</SelectItem>
                  <SelectItem value="much-better">Much Better</SelectItem>
                  <SelectItem value="much-worse">Much Worse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">My Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter your notes here..."
              className="min-h-[80px]"
            />
          </div>

          <Button 
            onClick={handleCall} 
            disabled={submitting}
            className="bg-green-600 hover:bg-green-700"
          >
            <Phone className="w-4 h-4 mr-2" />
            {submitting ? 'Saving...' : 'Click 2 Call'}
          </Button>

          <Collapsible open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
            <div className="border-t-2 border-cyan-500 pt-4">
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between cursor-pointer">
                  <h3 className="text-lg font-semibold">Call History</h3>
                  {isHistoryOpen ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-4">
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sno</TableHead>
                        <TableHead>DateTime</TableHead>
                        <TableHead>Next Call Date</TableHead>
                        <TableHead>Disposition</TableHead>
                        <TableHead>Caller Name</TableHead>
                        <TableHead>Patient Feeling</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                            Loading call history...
                          </TableCell>
                        </TableRow>
                      ) : callHistory.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                            No call history available
                          </TableCell>
                        </TableRow>
                      ) : (
                        callHistory.map((record) => (
                          <TableRow key={record.sno}>
                            <TableCell>{record.sno}</TableCell>
                            <TableCell>{record.dateTime}</TableCell>
                            <TableCell>{record.nextCallDate}</TableCell>
                            <TableCell>{record.disposition}</TableCell>
                            <TableCell>{record.callerName}</TableCell>
                            <TableCell>{record.patientFeeling}</TableCell>
                            <TableCell>{record.notes}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>
      </DialogContent>
    </Dialog>
  )
}
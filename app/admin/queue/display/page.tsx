"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Stethoscope, Users, CheckCircle, Loader2, MapPinned } from "lucide-react"
import { useBranch } from "@/contexts/branch-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import authService from "@/lib/authService"

interface Patient {
  id: number
  appointmentId: string
  patientId: number
  patientRegId: string
  patientName: string
  patientPhone: string
  appointmentTime: string
  appointmentType: string
  typeName: string
  status: string
  notes: string
  queuePosition: number
  appointmentNumber?: string
}

interface DoctorQueue {
  doctorId: number
  doctorName: string
  locationId: number
  locationName: string
  patients: Patient[]
  currentPatient: Patient | null
  waitingCount: number
  completedCount: number
  totalCount: number
}

export default function QueueDisplayPage() {
  const { currentBranch } = useBranch()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [doctors, setDoctors] = useState<DoctorQueue[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const [isFullScreen, setIsFullScreen] = useState(false)

  const toggleLayout = (full: boolean) => {
    setIsFullScreen(full)
    window.dispatchEvent(new CustomEvent('toggle-fullscreen-queue', { detail: full }))
  }

  const lastFetchRef = useRef<{ locationId: string; time: number } | null>(null)
  const fetchQueueData = useCallback(async () => {
    try {
      const rawLocationId = localStorage.getItem("selected_location_id")
      const locationId = (rawLocationId ? rawLocationId.replace(/"/g, '') : "") || currentBranch?.id

      if (!locationId) {
        setLoading(false)
        return
      }

      const response = await fetch(
        `${authService.getSettingsApiUrl()}/queue/appointments?location_id=${locationId}`
      )
      const result = await response.json()
      setDoctors(result.doctors || [])
    } catch (error) {
      console.error("Error fetching queue data:", error)
    } finally {
      setLoading(false)
    }
  }, [currentBranch?.id])

  useEffect(() => {
    fetchQueueData()

    // Connect to Server-Sent Events (SSE) stream
    const rawLocationId = localStorage.getItem("selected_location_id")
    const locationId = (rawLocationId ? rawLocationId.replace(/"/g, '') : "") || currentBranch?.id

    if (!locationId) return

    const eventSource = new EventSource(
      `${authService.getSettingsApiUrl()}/queue/stream?location_id=${locationId}`
    )

    eventSource.onmessage = (event) => {
      // Server pushed an update, fetch newest data once
      fetchQueueData()
    }

    eventSource.onerror = (error) => {
      console.error("SSE connection error, retrying...", error)
      eventSource.close()
      // Fallback: if SSE drops, attempt to reconnect after a delay (browser usually auto-reconnects, but this is a safety net if it fully closes)
      setTimeout(() => {
        fetchQueueData()
      }, 5000)
    }

    return () => {
      eventSource.close()
    }
  }, [fetchQueueData, currentBranch?.id])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Auto-scrolling logic
  useEffect(() => {
    if (loading || doctors.length === 0) return

    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationFrameId: number
    let isMouseOver = false
    let currentScroll = scrollContainer.scrollTop

    const scrollSpeed = 0.5

    const scroll = () => {
      if (!isMouseOver && scrollContainer.scrollHeight > scrollContainer.clientHeight) {
        currentScroll += scrollSpeed

        if (currentScroll >= scrollContainer.scrollHeight - scrollContainer.clientHeight) {
          currentScroll = 0
        }

        scrollContainer.scrollTop = currentScroll
      }
      animationFrameId = requestAnimationFrame(scroll)
    }

    const handleMouseEnter = () => isMouseOver = true
    const handleMouseLeave = () => isMouseOver = false

    scrollContainer.addEventListener('mouseenter', handleMouseEnter)
    scrollContainer.addEventListener('mouseleave', handleMouseLeave)

    animationFrameId = requestAnimationFrame(scroll)

    return () => {
      cancelAnimationFrame(animationFrameId)
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter)
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [doctors, loading])

  const allPatients = doctors.flatMap(doc =>
    doc.patients.map(p => ({
      ...p,
      doctorName: doc.doctorName,
      locationName: doc.locationName
    }))
  ).filter(p => !['completed', 'cancelled', 'no_show', 'done'].includes(p.status.toLowerCase()))
    .sort((a, b) => {
      // Priority sorting: with_doctor first, then others
      const statusOrder: Record<string, number> = {
        'with_doctor': 0,
        'in_progress': 0,
        'waiting': 1,
        'scheduled': 2,
        'confirmed': 2
      }
      const orderA = statusOrder[a.status.toLowerCase()] ?? 3
      const orderB = statusOrder[b.status.toLowerCase()] ?? 3

      if (orderA !== orderB) return orderA - orderB
      return a.appointmentTime.localeCompare(b.appointmentTime)
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    )
  }

  // Icons for toggles
  const MaximizeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" /></svg>
  )
  const MinimizeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3" /><path d="M21 8h-3a2 2 0 0 1-2-2V3" /><path d="M3 16h3a2 2 0 0 1 2 2v3" /><path d="M16 21v-3a2 2 0 0 1 2-2h3" /></svg>
  )

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Header */}
      <div className="px-8 py-6 flex items-center gap-4 border-b-4 border-blue-600">
        <Clock className="h-10 w-10 text-blue-700" />
        <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight uppercase">
          Patient Queue
        </h1>
        <div className="ml-8 flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={isFullScreen ? 'default' : 'ghost'}
            size="sm"
            onClick={() => toggleLayout(true)}
            className={`gap-2 ${isFullScreen ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' : 'text-gray-600'}`}
          >
            <MaximizeIcon /> Full
          </Button>
          <Button
            variant={!isFullScreen ? 'default' : 'ghost'}
            size="sm"
            onClick={() => toggleLayout(false)}
            className={`gap-2 ${!isFullScreen ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' : 'text-gray-600'}`}
          >
            <MinimizeIcon /> Half
          </Button>
        </div>
        <div className="ml-auto text-right">
          <p className="text-3xl font-bold text-blue-900">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
          <p className="text-lg font-semibold text-blue-700">{currentTime.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Table Header */}
      <div className="bg-blue-600 text-white px-8 py-4 grid grid-cols-[100px_1.5fr_1fr_150px] gap-6 items-center sticky top-0 z-10 shadow-md uppercase font-bold text-sm tracking-wider">
        <div>Token</div>
        <div>Patient Name</div>
        <div className="text-center">Status</div>
        <div className="text-end">Est. Time</div>
      </div>

      {/* Scrollable List */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-hidden"
      >
        <div className="px-6 py-4 space-y-4">
          {allPatients.length === 0 ? (
            <div className="text-center py-20">
              <Users className="h-20 w-20 text-gray-200 mx-auto mb-4" />
              <p className="text-2xl font-bold text-gray-400 uppercase">No active queue data</p>
            </div>
          ) : (
            allPatients.map((patient, idx) => (
              <div
                key={patient.appointmentId}
                className={`grid grid-cols-[100px_1.5fr_1fr_150px] gap-6 items-center p-6 rounded-2xl border-4 shadow-md transition-all
                  ${patient.status === 'with_doctor'
                    ? 'bg-emerald-600 text-white border-emerald-400 animate-pulse'
                    : patient.status === 'waiting'
                      ? 'bg-yellow-50 text-gray-900 border-yellow-200'
                      : 'bg-white text-gray-900 border-gray-100'
                  }`}
              >
                {/* Token with blinking effect if active */}
                <div className={`h-16 flex items-center justify-center rounded-xl font-black text-2xl shadow-inner
                  ${patient.status === 'with_doctor'
                    ? 'bg-white text-emerald-700 animate-[blink_1s_infinite]'
                    : patient.status === 'waiting'
                      ? 'bg-yellow-200 text-yellow-900'
                      : 'bg-gray-200 text-gray-600'}`}>
                  {patient.appointmentNumber || patient.id}
                </div>

                {/* Patient Name */}
                <div className="text-2xl font-black tracking-tight uppercase">
                  <div>{patient.patientName}</div>
                  <div className={`text-sm font-bold ${patient.status === 'with_doctor' ? 'text-emerald-100' : 'text-gray-500'}`}>
                    Dr. {patient.doctorName}
                  </div>
                </div>

                {/* Status */}
                <div className="flex justify-center">
                  <Badge className={`px-4 py-2 text-sm font-black uppercase tracking-tighter border-none rounded-lg
                    ${patient.status === 'with_doctor'
                      ? 'bg-emerald-500 text-white shadow-lg scale-110'
                      : patient.status === 'waiting'
                        ? 'bg-yellow-400 text-gray-900 shadow-sm'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                    {patient.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </Badge>
                </div>

                {/* Est. Time */}
                <div className="flex items-center justify-end gap-2">
                  <Clock className={`h-5 w-5 ${patient.status === 'with_doctor' ? 'text-white' : 'text-gray-400'}`} />
                  <span className={`text-lg font-black ${patient.status === 'with_doctor' ? 'text-white' : 'text-gray-800'}`}>
                    {patient.appointmentTime}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes blink {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}



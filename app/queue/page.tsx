"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Clock, Stethoscope, Calendar } from "lucide-react"
import { Card } from "@/components/ui/card"
import { queueApi, type QueueData } from "@/lib/queueApi"

  const getDoctorStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-emerald-500"
      case "busy":
        return "bg-red-500"
      case "consulting":
        return "bg-orange-500"
      case "emergency":
        return "bg-red-500"
      case "unavailable":
      case "not available":
        return "bg-gray-400"
      default:
        return "bg-gray-500"
    }
  }

    const getDoctorStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-emerald-500 text-white"
      case "busy":
        return "bg-red-500 text-white"
      case "emergency":
        return "bg-red-500 text-white"
      case "consulting":
        return "bg-orange-500 text-white"
      case "unavailable":
      case "not available":
        return "bg-gray-400 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }
  
function QueueContent() {
  const searchParams = useSearchParams()
  const locationId = parseInt(searchParams.get('location_id') || '1')
  const [currentTime, setCurrentTime] = useState<Date | null>(null)

  const [queueData, setQueueData] = useState<QueueData | null>(null)
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCurrentTime(new Date())
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchQueueData = async () => {
      try {
        setLoading(true)
        console.log('Fetching queue data...')
        const data = await queueApi.getDoctorsByDepartment(locationId)
        console.log('Queue data received:', data)
        setQueueData(data)
      } catch (error) {
        console.error('Failed to fetch queue data:', error)
        // Set empty data on error to prevent infinite loading
        setQueueData({ doctorsByDepartment: {} })
      } finally {
        setLoading(false)
      }
    }

    fetchQueueData()
    const interval = setInterval(fetchQueueData, 60000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [locationId])



  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let scrollTop = 0
    const scrollStep = 1
    const pauseTime = 2000
    let isPaused = false

    const autoScroll = () => {
      if (isPaused) return

      const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight
      
      if (maxScroll > 0) {
        scrollTop += scrollStep
        
        if (scrollTop >= maxScroll) {
          isPaused = true
          setTimeout(() => {
            scrollTop = 0
            scrollContainer.scrollTop = 0
            isPaused = false
          }, pauseTime)
        }
        
        scrollContainer.scrollTop = scrollTop
      }
    }

    const interval = setInterval(autoScroll, 50)
    return () => clearInterval(interval)
  }, [])



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="rounded-xl shadow-xl p-4 mb-4" style={{backgroundColor: '#8E222A'}}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">PRANAAM HOSPITAL</h1>
            <p className="text-lg text-blue-50">Doctors Availability</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{currentTime?.toLocaleTimeString() || '--:--:--'}</p>
            <p className="text-sm text-blue-50">{currentTime?.toLocaleDateString() || '--/--/----'}</p>
          </div>
        </div>
      </div>

      <Card>

        <div ref={scrollRef} className="space-y-6 h-80 overflow-hidden p-6">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-lg text-gray-600">Loading doctors...</div>
            </div>
          ) : queueData ? (
            Object.entries(queueData.doctorsByDepartment)
              .sort(([, doctorsA], [, doctorsB]) => {
                const checkedInA = doctorsA.filter(d => d.isCheckedIn).length;
                const checkedInB = doctorsB.filter(d => d.isCheckedIn).length;
                // Sort by checked-in count (descending), then by department name
                if (checkedInB !== checkedInA) {
                  return checkedInB - checkedInA;
                }
                return 0;
              })
              .map(([deptKey, doctors]) => (
              <div key={deptKey} className="border-b pb-6 last:border-b-0 last:pb-0">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  {deptKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  <Badge variant="secondary" className="ml-3">
                    {doctors.filter((d) => d.isCheckedIn).length} / {doctors.length} Available
                  </Badge>
                </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className={`bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border-2 transition-all ${
                      doctor.isCheckedIn
                        ? "border-emerald-200 hover:border-blue-600 hover:shadow-lg"
                        : "border-gray-300 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-white rounded-lg p-2" style={{backgroundColor: '#8E222A'}}>
                        <Stethoscope className="h-5 w-5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getDoctorStatusColor(doctor.status)} animate-pulse`}
                        ></div>
                        <Badge className={`${getDoctorStatusBadge(doctor.status)} text-xs px-2 py-0.5`}>
                          {doctor.status || "Not Available"}
                        </Badge>
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-gray-900 mb-1 truncate">Dr.{doctor.name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}</h4>

                    {doctor.isCheckedIn && doctor.checkInTime && (
                      <div className="flex items-center text-xs text-blue-600 mb-2">
                        <Clock className="h-3 w-3 mr-1" />
                        Checked In: {new Date(`1970-01-01T${doctor.checkInTime}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </div>
                    )}

                    <div className="pt-2 border-t border-gray-200">
                      {!doctor.isCheckedIn && (doctor.working_days || doctor.working_hours) && (
                        <div className="mb-2">
                          {doctor.working_days && (
                            <div className="flex items-center text-xs text-gray-600 mb-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              {doctor.working_days}
                            </div>
                          )}
                          {doctor.working_hours && (
                            <div className="flex items-center text-xs text-gray-600">
                              <Clock className="h-3 w-3 mr-1" />
                              {doctor.working_hours}
                            </div>
                          )}
                        </div>
                      )}

                      {doctor.currentPatient ? (
                        <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                          <p className="text-xs text-blue-700 font-medium mb-1">NOW SERVING</p>
                          <p className="text-lg font-bold text-blue-900">{doctor.currentPatient}</p>
                        </div>
                      ) : doctor.isCheckedIn && (doctor.status?.toLowerCase() === 'available' || doctor.status?.toLowerCase() === 'consulting') ? (
                        <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-200">
                          <p className="text-xs text-emerald-700 font-medium text-center">Ready for next patient</p>
                        </div>
                      ) : doctor.isCheckedIn ? (
                        <div className="bg-orange-50 rounded-lg p-2 border border-orange-200">
                          <p className="text-xs text-orange-700 font-medium text-center">Doctor busy, please wait</p>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                          <p className="text-xs text-gray-500 font-medium text-center">Not checked in</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-full">
              <div className="text-lg text-gray-600">No data available</div>
            </div>
          )}
        </div>
      </Card>



      <div className="mt-6 rounded-2xl shadow-xl p-4" style={{backgroundColor: '#8E222A'}}>
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-emerald-300 rounded-full animate-pulse"></div>
            <p className="text-lg font-medium">Auto-Scrolling Display • Updates Every 60 Seconds</p>
          </div>
          <div className="flex items-center space-x-6 text-base">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-emerald-400 rounded-full"></div>
              <span>AVAILABLE</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-400 rounded-full"></div>
              <span>CONSULTING</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-300 rounded-full animate-pulse"></div>
              <span>BUSY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function QueueDisplayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center"><div className="text-lg text-gray-600">Loading...</div></div>}>
      <QueueContent />
    </Suspense>
  )
}

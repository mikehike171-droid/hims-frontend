"use client"

import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Clock, Stethoscope } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


const doctorsByDepartment = {
  cardiology: [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      status: "available",
      consultingRoom: "Room 101",
      currentPatient: "C001",
      isCheckedIn: true,
      checkInTime: "08:30 AM",
    },
    {
      id: 2,
      name: "Dr. Anjali Desai",
      status: "consulting",
      consultingRoom: "Room 102",
      currentPatient: "C004",
      isCheckedIn: true,
      checkInTime: "08:45 AM",
    },
    {
      id: 3,
      name: "Dr. Vikram Rao",
      status: "unavailable",
      consultingRoom: "Room 103",
      currentPatient: null,
      isCheckedIn: false,
      checkInTime: null,
    },
  ],
  orthopedics: [
    {
      id: 4,
      name: "Dr. Priya Sharma",
      status: "consulting",
      consultingRoom: "Room 201",
      currentPatient: "O002",
      isCheckedIn: true,
      checkInTime: "08:15 AM",
    },
    {
      id: 5,
      name: "Dr. Suresh Reddy",
      status: "available",
      consultingRoom: "Room 202",
      currentPatient: null,
      isCheckedIn: true,
      checkInTime: "09:00 AM",
    },
  ],
  general: [
    {
      id: 6,
      name: "Dr. Amit Singh",
      status: "consulting",
      consultingRoom: "Room 301",
      currentPatient: "G001",
      isCheckedIn: true,
      checkInTime: "08:00 AM",
    },
    {
      id: 7,
      name: "Dr. Kavita Menon",
      status: "available",
      consultingRoom: "Room 302",
      currentPatient: null,
      isCheckedIn: true,
      checkInTime: "08:30 AM",
    },
    {
      id: 8,
      name: "Dr. Ramesh Gupta",
      status: "available",
      consultingRoom: "Room 303",
      currentPatient: null,
      isCheckedIn: true,
      checkInTime: "09:15 AM",
    },
  ],
  pediatrics: [
    {
      id: 9,
      name: "Dr. Sunita Patel",
      status: "available",
      consultingRoom: "Room 401",
      currentPatient: null,
      isCheckedIn: true,
      checkInTime: "09:00 AM",
    },
    {
      id: 10,
      name: "Dr. Meera Iyer",
      status: "consulting",
      consultingRoom: "Room 402",
      currentPatient: "P002",
      isCheckedIn: true,
      checkInTime: "08:30 AM",
    },
  ],
  emergency: [
    {
      id: 11,
      name: "Dr. Emergency Team",
      status: "consulting",
      consultingRoom: "Emergency Wing",
      currentPatient: "E001",
      isCheckedIn: true,
      checkInTime: "24/7",
    },
  ],
}


const departmentNames = {
  cardiology: "Cardiology",
  orthopedics: "Orthopedics",
  general: "General Medicine",
  pediatrics: "Pediatrics",
  emergency: "Emergency",
}


const availableDoctors = [
  {
    id: 1,
    name: "Dr. Rajesh Kumar",
    specialty: "Cardiology",
    status: "available",
    consultingRoom: "Room 101",
    currentPatient: "C001",
  },
  {
    id: 2,
    name: "Dr. Priya Sharma",
    specialty: "Orthopedics",
    status: "consulting",
    consultingRoom: "Room 102",
    currentPatient: "O002",
  },
  {
    id: 3,
    name: "Dr. Amit Singh",
    specialty: "General Medicine",
    status: "consulting",
    consultingRoom: "Room 103",
    currentPatient: "G001",
  },
  {
    id: 4,
    name: "Dr. Sunita Patel",
    specialty: "Pediatrics",
    status: "available",
    consultingRoom: "Room 104",
    currentPatient: null,
  },
  {
    id: 5,
    name: "Dr. Emergency Team",
    specialty: "Emergency",
    status: "consulting",
    consultingRoom: "Emergency Wing",
    currentPatient: "E001",
  },
]

const allPatients = [
  {
    tokenNumber: "C001",
    patientName: "Ramesh Gupta",
    department: "Cardiology",
    doctor: "Dr. Rajesh Kumar",
    status: "NOW CALLING",
    room: "101",
    estimatedTime: "NOW",
    priority: "High",
  },
  {
    tokenNumber: "C002",
    patientName: "Sunita Verma",
    department: "Cardiology",
    doctor: "Dr. Rajesh Kumar",
    status: "WAITING",
    room: "101",
    estimatedTime: "10:15 AM",
    priority: "Normal",
  },
  {
    tokenNumber: "C003",
    patientName: "Anil Kapoor",
    department: "Cardiology",
    doctor: "Dr. Rajesh Kumar",
    status: "WAITING",
    room: "101",
    estimatedTime: "10:35 AM",
    priority: "Normal",
  },
  {
    tokenNumber: "O001",
    patientName: "Priya Mehta",
    department: "Orthopedics",
    doctor: "Dr. Priya Sharma",
    status: "WAITING",
    room: "102",
    estimatedTime: "10:05 AM",
    priority: "Normal",
  },
  {
    tokenNumber: "O002",
    patientName: "Rajiv Kumar",
    department: "Orthopedics",
    doctor: "Dr. Priya Sharma",
    status: "NOW CALLING",
    room: "102",
    estimatedTime: "NOW",
    priority: "High",
  },
  {
    tokenNumber: "O003",
    patientName: "Meena Sharma",
    department: "Orthopedics",
    doctor: "Dr. Priya Sharma",
    status: "WAITING",
    room: "102",
    estimatedTime: "10:25 AM",
    priority: "Normal",
  },
  {
    tokenNumber: "G001",
    patientName: "Vijay Singh",
    department: "General Medicine",
    doctor: "Dr. Amit Singh",
    status: "NOW CALLING",
    room: "103",
    estimatedTime: "NOW",
    priority: "Emergency",
  },
  {
    tokenNumber: "G002",
    patientName: "Kavita Reddy",
    department: "General Medicine",
    doctor: "Dr. Amit Singh",
    status: "WAITING",
    room: "103",
    estimatedTime: "10:20 AM",
    priority: "Normal",
  },
  {
    tokenNumber: "G003",
    patientName: "Suresh Patel",
    department: "General Medicine",
    doctor: "Dr. Amit Singh",
    status: "WAITING",
    room: "103",
    estimatedTime: "10:40 AM",
    priority: "Normal",
  },
  {
    tokenNumber: "P001",
    patientName: "Baby Arjun",
    department: "Pediatrics",
    doctor: "Dr. Sunita Patel",
    status: "WAITING",
    room: "104",
    estimatedTime: "10:12 AM",
    priority: "Normal",
  },
  {
    tokenNumber: "P002",
    patientName: "Baby Ananya",
    department: "Pediatrics",
    doctor: "Dr. Sunita Patel",
    status: "WAITING",
    room: "104",
    estimatedTime: "10:22 AM",
    priority: "High",
  },
  {
    tokenNumber: "E001",
    patientName: "Emergency Case",
    department: "Emergency",
    doctor: "Dr. Emergency Team",
    status: "IN PROGRESS",
    room: "Emergency",
    estimatedTime: "IMMEDIATE",
    priority: "Emergency",
  },
]

  const getDoctorStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-emerald-500"
      case "consulting":
        return "bg-orange-500"
      case "unavailable":
        return "bg-gray-400"
      default:
        return "bg-gray-500"
    }
  }

    const getDoctorStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return "bg-emerald-500 text-white"
      case "consulting":
        return "bg-orange-500 text-white"
      case "unavailable":
        return "bg-gray-400 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }
  
export default function QueueDisplayPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [flashCalled, setFlashCalled] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const flashTimer = setInterval(() => {
      setFlashCalled((prev) => !prev)
    }, 800)
    return () => clearInterval(flashTimer)
  }, [])

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let scrollPosition = 0
    const scrollSpeed = 0.5
    const pauseDuration = 3000
    let isPaused = false
    let pauseTimer: NodeJS.Timeout

    const scroll = () => {
      if (isPaused) return

      scrollPosition += scrollSpeed

      if (scrollPosition >= scrollContainer.scrollHeight - scrollContainer.clientHeight) {
        isPaused = true
        pauseTimer = setTimeout(() => {
          scrollPosition = 0
          scrollContainer.scrollTop = 0
          isPaused = false
        }, pauseDuration)
      }

      scrollContainer.scrollTop = scrollPosition
    }

    const intervalId = setInterval(scroll, 20)

    return () => {
      clearInterval(intervalId)
      if (pauseTimer) clearTimeout(pauseTimer)
    }
  }, [])

  const getStatusColor = (status: string) => {
    if (status === "available") return "bg-emerald-500"
    if (status === "consulting") return "bg-orange-500"
    return "bg-gray-500"
  }

  const getStatusBadgeColor = (status: string) => {
    if (status === "available") return "bg-emerald-500 text-white"
    if (status === "consulting") return "bg-orange-500 text-white"
    return "bg-gray-500 text-white"
  }

  const getRowColor = (status: string, shouldFlash: boolean) => {
    if (status === "NOW CALLING" && shouldFlash) {
      return "bg-blue-700 text-white"
    }
    if (status === "NOW CALLING") {
      return "bg-blue-600 text-white"
    }
    if (status === "IN PROGRESS") {
      return "bg-blue-800 text-white"
    }
    return "bg-white text-gray-900"
  }

  const getPriorityBadge = (priority: string) => {
    if (priority === "Emergency") {
      return <Badge className="bg-red-600 text-white text-base px-3 py-1">EMERGENCY</Badge>
    }
    if (priority === "High") {
      return <Badge className="bg-orange-500 text-white text-base px-3 py-1">HIGH</Badge>
    }
    return <Badge className="bg-emerald-500 text-white text-base px-3 py-1">NORMAL</Badge>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="bg-blue-700 rounded-2xl shadow-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold text-white mb-1">PRANAM HOSPITAL</h1>
            <p className="text-2xl text-blue-50">Queue Management System</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-white">{currentTime.toLocaleTimeString()}</p>
            <p className="text-xl text-blue-50">{currentTime.toLocaleDateString()}</p>
          </div>
        </div>
      </div>
{/* 
      <div className="mb-6">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center border-b-4 border-blue-700 pb-3">
            <Stethoscope className="h-8 w-8 mr-3 text-blue-700" />
            AVAILABLE DOCTORS
          </h2>
          <div className="grid grid-cols-5 gap-4">
            {availableDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border-2 border-gray-200 hover:border-blue-600 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="bg-blue-700 text-white rounded-lg p-2">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div className={`w-4 h-4 rounded-full ${getStatusColor(doctor.status)} animate-pulse`}></div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{doctor.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{doctor.specialty}</p>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-sm font-semibold text-gray-700">{doctor.consultingRoom}</p>
                  {doctor.currentPatient && (
                    <div className="mt-2 bg-blue-50 rounded-lg p-2">
                      <p className="text-xs text-blue-700 font-medium">NOW SERVING</p>
                      <p className="text-lg font-bold text-blue-900">{doctor.currentPatient}</p>
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <Badge className={`${getStatusBadgeColor(doctor.status)} text-xs px-2 py-1`}>
                    {doctor.status === "available" ? "AVAILABLE" : "CONSULTING"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Stethoscope className="h-6 w-6 mr-3 text-blue-700" />
            Available Doctors by Department
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(doctorsByDepartment).map(([deptKey, doctors]) => (
            <div key={deptKey} className="border-b pb-6 last:border-b-0 last:pb-0">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                {departmentNames[deptKey as keyof typeof departmentNames]}
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
                      <div className="bg-blue-700 text-white rounded-lg p-2">
                        <Stethoscope className="h-5 w-5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getDoctorStatusColor(doctor.status)} animate-pulse`}
                        ></div>
                        <Badge className={`${getDoctorStatusBadge(doctor.status)} text-xs px-2 py-0.5`}>
                          {doctor.status === "available"
                            ? "Available"
                            : doctor.status === "consulting"
                              ? "Consulting"
                              : "Not Available"}
                        </Badge>
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-gray-900 mb-1 truncate">{doctor.name}</h4>

                    {doctor.isCheckedIn && doctor.checkInTime && (
                      <div className="flex items-center text-xs text-blue-600 mb-2">
                        <Clock className="h-3 w-3 mr-1" />
                        Checked In: {doctor.checkInTime}
                      </div>
                    )}

                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-2">{doctor.consultingRoom}</p>

                      {doctor.currentPatient ? (
                        <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                          <p className="text-xs text-blue-700 font-medium mb-1">NOW SERVING</p>
                          <p className="text-lg font-bold text-blue-900">{doctor.currentPatient}</p>
                        </div>
                      ) : doctor.isCheckedIn ? (
                        <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-200">
                          <p className="text-xs text-emerald-700 font-medium text-center">Ready for next patient</p>
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
          ))}
        </CardContent>
      </Card>

      {/* <div>
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center border-b-4 border-blue-700 pb-3">
            <Clock className="h-8 w-8 mr-3 text-blue-700" />
            PATIENT QUEUE - ALL DEPARTMENTS
          </h2>

          <div className="bg-blue-700 rounded-xl p-4 mb-3">
            <div className="grid grid-cols-12 gap-3 text-white font-bold text-lg">
              <div className="col-span-1 text-center">TOKEN</div>
              <div className="col-span-2">PATIENT NAME</div>
              <div className="col-span-2">DEPARTMENT</div>
              <div className="col-span-2">STATUS</div>
              <div className="col-span-2">ROOM</div>
              <div className="col-span-2">EST. TIME</div>
              <div className="col-span-1 text-center">PRIORITY</div>
            </div>
          </div>

          <div ref={scrollRef} className="space-y-2 overflow-hidden" style={{ height: "400px" }}>
            {allPatients.map((patient, index) => {
              const isNowCalling = patient.status === "NOW CALLING"
              const shouldFlash = isNowCalling && flashCalled

              return (
                <div
                  key={index}
                  className={`rounded-xl p-4 transition-all duration-300 border-2 ${getRowColor(patient.status, shouldFlash)} ${shouldFlash ? "scale-[1.02] shadow-xl border-yellow-400" : "border-gray-200"}`}
                >
                  <div className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-1 flex justify-center">
                      <div
                        className={`text-2xl font-bold px-3 py-2 rounded-lg text-center min-w-[80px] ${
                          shouldFlash
                            ? "bg-yellow-400 text-gray-900 animate-pulse"
                            : isNowCalling
                              ? "bg-white text-blue-700"
                              : patient.status === "IN PROGRESS"
                                ? "bg-white text-blue-900"
                                : "bg-blue-700 text-white"
                        }`}
                      >
                        {patient.tokenNumber}
                      </div>
                    </div>

                    <div className="col-span-2">
                      <p
                        className={`text-lg font-bold leading-tight ${isNowCalling || patient.status === "IN PROGRESS" ? "text-white" : "text-gray-900"}`}
                      >
                        {patient.patientName}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <p
                        className={`text-base font-bold leading-tight ${isNowCalling || patient.status === "IN PROGRESS" ? "text-white" : "text-gray-900"}`}
                      >
                        {patient.department}
                      </p>
                      <p
                        className={`text-sm leading-tight ${isNowCalling || patient.status === "IN PROGRESS" ? "text-blue-100" : "text-gray-600"}`}
                      >
                        {patient.doctor}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <Badge
                        className={`text-sm px-3 py-1 font-bold ${
                          shouldFlash
                            ? "bg-yellow-400 text-gray-900 animate-pulse"
                            : isNowCalling
                              ? "bg-yellow-500 text-gray-900"
                              : patient.status === "IN PROGRESS"
                                ? "bg-orange-500 text-white"
                                : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {patient.status}
                      </Badge>
                    </div>

                    <div className="col-span-2">
                      <p
                        className={`text-xl font-bold leading-tight ${isNowCalling || patient.status === "IN PROGRESS" ? "text-white" : "text-blue-700"}`}
                      >
                        {patient.room}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <div className="flex items-center">
                        <Clock
                          className={`h-5 w-5 mr-2 flex-shrink-0 ${isNowCalling || patient.status === "IN PROGRESS" ? "text-white" : "text-gray-600"}`}
                        />
                        <p
                          className={`text-xl font-bold leading-tight ${
                            patient.estimatedTime === "NOW" || patient.estimatedTime === "IMMEDIATE"
                              ? "text-red-500"
                              : isNowCalling || patient.status === "IN PROGRESS"
                                ? "text-white"
                                : "text-gray-900"
                          }`}
                        >
                          {patient.estimatedTime}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-1 flex justify-center">{getPriorityBadge(patient.priority)}</div>
                  </div>
                </div>
              )
            })}

            <div className="h-16"></div>
          </div>
        </div>
      </div> */}

      <div className="mt-6 bg-blue-700 rounded-2xl shadow-xl p-4">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-emerald-300 rounded-full animate-pulse"></div>
            <p className="text-lg font-medium">Auto-Scrolling Display • Updates Every 5 Seconds</p>
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
              <div className="w-4 h-4 bg-yellow-300 rounded-full animate-pulse"></div>
              <span>NOW CALLING</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

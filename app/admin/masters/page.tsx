"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  CreditCard, 
  Users, 
  CalendarDays, 
  UserSquare2, 
  ArrowRight,
  Settings2
} from "lucide-react"
import Link from "next/link"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function MastersIndexPage() {
  const masters = [
    {
      title: "Medicine Days",
      description: "Manage default medicine day options for prescriptions",
      icon: CalendarDays,
      href: "/admin/masters/medicine-days",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Payment Types",
      description: "Manage different methods of payment accepted",
      icon: CreditCard,
      href: "/admin/masters/payment-type",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Patient Sources",
      description: "Manage how patients find your clinic/hospital",
      icon: Users,
      href: "/admin/masters/patient-sources",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "User Types",
      description: "Manage categories of users in the system",
      icon: UserSquare2,
      href: "/admin/masters/user-types",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Appointment Types",
      description: "Manage categories of appointments",
      icon: CalendarDays,
      href: "/admin/masters/appointment-types",
      color: "text-red-600",
      bgColor: "bg-red-100"
    }
  ]

  return (
    <PrivateRoute modulePath="admin/settings" action="view">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Masters Configuration</h1>
            <p className="text-gray-600">Centralized management for all system master data</p>
          </div>
          <Settings2 className="h-8 w-8 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {masters.map((master) => {
            const Icon = master.icon
            return (
              <Card key={master.href} className="hover:shadow-md transition-shadow group">
                <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                  <div className={`p-3 rounded-lg ${master.bgColor}`}>
                    <Icon className={`h-6 w-6 ${master.color}`} />
                  </div>
                  <CardTitle className="text-xl">{master.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{master.description}</p>
                  <Link href={master.href}>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Go to {master.title}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </PrivateRoute>
  )
}

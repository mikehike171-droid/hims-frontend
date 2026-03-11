"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FlaskConical, Package, Settings, TestTube, FileText, Microscope, Activity } from "lucide-react"

export default function LaboratoryMastersPage() {
  const router = useRouter()

  const masters = [
    {
      title: "Units",
      description: "Manage laboratory measurement units",
      icon: Settings,
      href: "/laboratory/units",
      color: "bg-blue-500",
    },
    {
      title: "Specimens",
      description: "Manage specimen types and collection",
      icon: FlaskConical,
      href: "/laboratory/specimens",
      color: "bg-green-500",
    },
    {
      title: "Containers",
      description: "Manage sample containers",
      icon: Package,
      href: "/laboratory/containers",
      color: "bg-purple-500",
    },
    {
      title: "Methods",
      description: "Manage laboratory test methods",
      icon: Settings,
      href: "/laboratory/methods",
      color: "bg-orange-500",
    },
    {
      title: "Templates",
      description: "Manage report templates",
      icon: FileText,
      href: "/laboratory/templates",
      color: "bg-pink-500",
    },
    {
      title: "Investigation Master",
      description: "Manage laboratory investigations",
      icon: Microscope,
      href: "/laboratory/investigation-master",
      color: "bg-indigo-500",
    },
    {
      title: "Test Master",
      description: "Manage laboratory tests",
      icon: TestTube,
      href: "/laboratory/test-master",
      color: "bg-red-500",
    },
    {
      title: "Profile To Test Link",
      description: "Link test profiles to tests",
      icon: Activity,
      href: "/laboratory/profile-test-link",
      color: "bg-teal-500",
    },
    {
      title: "Test To Template Link",
      description: "Link tests to templates",
      icon: Activity,
      href: "/laboratory/test-template-link",
      color: "bg-cyan-500",
    },
  ]

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">Laboratory Masters</h1>
        <p className="text-sm text-gray-600 mt-1">Manage all laboratory master data</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {masters.map((master) => (
            <Card
              key={master.href}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(master.href)}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`${master.color} p-3 rounded-lg`}>
                    <master.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{master.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{master.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

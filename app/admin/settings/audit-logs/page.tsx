"use client"

import PrivateRoute from "@/components/auth/PrivateRoute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Download,
  Filter,
  Check,
  X,
  Calendar,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

const mockAuditLogs = [
  {
    id: 1,
    user: "Dr. Rajesh Kumar",
    action: "Login",
    details: "Successful login",
    timestamp: "2024-01-10 09:30:15",
    ipAddress: "192.168.1.100",
    success: true,
  },
  {
    id: 2,
    user: "Sister Mary Joseph",
    action: "Update Patient",
    details: "Updated patient P001234 vitals",
    timestamp: "2024-01-10 09:25:30",
    ipAddress: "192.168.1.101",
    success: true,
  },
  {
    id: 3,
    user: "Mr. Amit Sharma",
    action: "Create Prescription",
    details: "Created prescription PR001567",
    timestamp: "2024-01-10 09:20:45",
    ipAddress: "192.168.1.102",
    success: true,
  },
  {
    id: 4,
    user: "Admin User",
    action: "System Settings",
    details: "Updated notification settings",
    timestamp: "2024-01-10 09:15:00",
    ipAddress: "192.168.1.103",
    success: true,
  },
  {
    id: 5,
    user: "Unknown User",
    action: "Failed Login",
    details: "Invalid credentials for user: test@example.com",
    timestamp: "2024-01-10 09:10:30",
    ipAddress: "192.168.1.104",
    success: false,
  },
]

export default function AuditLogsPage() {
  return (
    <PrivateRoute modulePath="admin/settings" action="view">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
            <p className="text-gray-600">View system activity logs and security events</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Audit Logs</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Logs
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{log.user}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline">{log.action}</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">{log.details}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-2" />
                            {log.timestamp}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ipAddress}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {log.success ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <Check className="h-3 w-3 mr-1" />
                              Success
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-red-100 text-red-800">
                              <X className="h-3 w-3 mr-1" />
                              Failed
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  )
}
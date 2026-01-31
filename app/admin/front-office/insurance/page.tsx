"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Shield, CheckCircle, Search, Phone, FileText, Download, Eye, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import PrivateRoute from "@/components/auth/PrivateRoute"

export default function FrontOfficeInsurancePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null)

  // Sample data
  const insuranceProviders = [
    { id: "1", name: "Star Health Insurance", phone: "1800-425-2255", email: "care@starhealth.in" },
    { id: "2", name: "HDFC ERGO", phone: "1800-266-4356", email: "support@hdfcergo.com" },
    { id: "3", name: "ICICI Lombard", phone: "1800-266-4422", email: "care@icicilombard.com" },
    { id: "4", name: "Bajaj Allianz", phone: "1800-209-5858", email: "bagichelp@bajajallianz.co.in" },
  ]

  const preAuthRequests = [
    {
      id: "PA-001",
      patientName: "John Doe",
      policyNumber: "SH-123456789",
      provider: "Star Health Insurance",
      treatmentType: "Cardiac Surgery",
      estimatedAmount: 250000,
      requestedAmount: 200000,
      status: "Approved",
      submittedDate: new Date(Date.now() - 86400000),
      approvalDate: new Date(),
      validTill: new Date(Date.now() + 7 * 86400000),
      authNumber: "AUTH-2024-001",
    },
    {
      id: "PA-002",
      patientName: "Jane Smith",
      policyNumber: "HD-987654321",
      provider: "HDFC ERGO",
      treatmentType: "Orthopedic Procedure",
      estimatedAmount: 150000,
      requestedAmount: 150000,
      status: "Pending",
      submittedDate: new Date(Date.now() - 43200000),
      approvalDate: null,
      validTill: null,
      authNumber: "",
    },
  ]

  const claims = [
    {
      id: "CLM-001",
      patientName: "Mike Johnson",
      policyNumber: "IC-456789123",
      provider: "ICICI Lombard",
      claimAmount: 75000,
      approvedAmount: 70000,
      status: "Approved",
      submittedDate: new Date(Date.now() - 5 * 86400000),
      processedDate: new Date(Date.now() - 2 * 86400000),
      claimNumber: "CLM-2024-001",
      remarks: "Approved with standard deductible",
    },
  ]

  const PolicyVerification = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Insurance Policy Verification
          </CardTitle>
          <CardDescription>Verify patient insurance coverage and benefits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Patient Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search by name, ID, or phone" className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Policy Number</Label>
              <Input placeholder="Enter policy number" />
            </div>

            <div className="space-y-2">
              <Label>Insurance Provider</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {insuranceProviders.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input type="date" />
            </div>
          </div>

          <div className="flex gap-4">
            <Button>
              <CheckCircle className="h-4 w-4 mr-2" />
              Verify Policy
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
          </div>

          {/* Policy Details Card */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Policy Verified
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-600">Policy Holder:</span>
                    <p className="font-medium">John Doe</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Policy Number:</span>
                    <p className="font-medium">SH-123456789</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Insurance Provider:</span>
                    <p className="font-medium">Star Health Insurance</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Policy Status:</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-600">Sum Insured:</span>
                    <p className="font-medium">₹5,00,000</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Available Limit:</span>
                    <p className="font-medium">₹4,25,000</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Deductible:</span>
                    <p className="font-medium">₹5,000</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Valid Till:</span>
                    <p className="font-medium">31/12/2024</p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h4 className="font-semibold mb-2">Coverage Details:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Hospitalization: Covered up to sum insured</li>
                  <li>• Day Care Procedures: Covered</li>
                  <li>• Pre & Post Hospitalization: 60 days pre, 90 days post</li>
                  <li>• Ambulance: ₹2,000 per trip</li>
                  <li>• Room Rent: No limit</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )

  const PreAuthorization = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Pre-Authorization Requests</h3>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      <div className="grid gap-4">
        {preAuthRequests.map((request) => (
          <Card key={request.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold">{request.patientName}</h4>
                  <p className="text-sm text-gray-600">{request.policyNumber}</p>
                </div>
                <Badge
                  variant={
                    request.status === "Approved"
                      ? "default"
                      : request.status === "Pending"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {request.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-600">Treatment:</span>
                  <p className="font-medium">{request.treatmentType}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Requested Amount:</span>
                  <p className="font-medium">₹{request.requestedAmount.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Provider:</span>
                  <p className="font-medium">{request.provider}</p>
                </div>
              </div>

              {request.status === "Approved" && (
                <div className="bg-green-50 p-3 rounded-lg mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Approved</span>
                  </div>
                  <div className="text-sm text-green-700">
                    Authorization Number: {request.authNumber}
                    <br />
                    Valid Till: {request.validTill && format(request.validTill, "PPP")}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                {request.status === "Pending" && (
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Follow Up
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const ClaimsManagement = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Insurance Claims</h3>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Submit Claim
        </Button>
      </div>

      <div className="grid gap-4">
        {claims.map((claim) => (
          <Card key={claim.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold">{claim.patientName}</h4>
                  <p className="text-sm text-gray-600">Claim: {claim.claimNumber}</p>
                </div>
                <Badge variant={claim.status === "Approved" ? "default" : "secondary"}>{claim.status}</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-600">Policy Number:</span>
                  <p className="font-medium">{claim.policyNumber}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Claim Amount:</span>
                  <p className="font-medium">₹{claim.claimAmount.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Approved Amount:</span>
                  <p className="font-medium">₹{claim.approvedAmount.toLocaleString()}</p>
                </div>
              </div>

              {claim.remarks && (
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <span className="text-sm font-medium text-blue-800">Remarks:</span>
                  <p className="text-sm text-blue-700">{claim.remarks}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const TPAContacts = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Insurance Provider Contacts</h3>

      <div className="grid gap-4">
        {insuranceProviders.map((provider) => (
          <Card key={provider.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">{provider.name}</h4>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline">
                    Email
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Customer Care:</span>
                  <p className="font-medium">{provider.phone}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="font-medium">{provider.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  return (
    <PrivateRoute modulePath="admin/front-office/insurance" action="view">
      <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Insurance Desk</h1>
        <p className="text-gray-600">Manage insurance policies, pre-authorizations, and claims</p>
      </div>

      <Tabs defaultValue="verification" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="verification">Policy Verification</TabsTrigger>
          <TabsTrigger value="preauth">Pre-Authorization</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="contacts">TPA Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="verification">
          <PolicyVerification />
        </TabsContent>

        <TabsContent value="preauth">
          <PreAuthorization />
        </TabsContent>

        <TabsContent value="claims">
          <ClaimsManagement />
        </TabsContent>

        <TabsContent value="contacts">
          <TPAContacts />
        </TabsContent>
      </Tabs>
      </div>
    </PrivateRoute>
  )
}

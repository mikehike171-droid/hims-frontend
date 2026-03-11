"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, X, Plus, Printer, FileText, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ServiceItem {
  id: string
  serviceCode: string
  serviceName: string
  qty: number
  rate: number
  amount: number
  discount: number
  discountAmt: number
  netAmt: number
  reportingDoctor: string
  department: string
}

const mockPatients = [
  {
    mrNumber: "MR2400008854",
    mobile: "919074392850",
    email: "sanjeevgoundlaa@gmail.com",
    name: "DEVENDRA KUMAR",
    patientCategory: "PAYING",
    tariffCategory: "Hospital",
    revisionId: "",
    company: "",
    paymentType: "Cash",
    refPro: "019",
    refDoctor: "R00064",
    aadharNo: "",
    dob: "18/03/1978",
    age: { years: 47, months: 6, days: 11 },
    doctor: { code: "000085", name: "VISHNUCHAND ZAMP" },
  },
  {
    mrNumber: "MR2400008855",
    mobile: "919876543210",
    email: "patient2@gmail.com",
    name: "RAJESH SHARMA",
    patientCategory: "PAYING",
    tariffCategory: "Hospital",
    revisionId: "",
    company: "",
    paymentType: "Card",
    refPro: "020",
    refDoctor: "R00065",
    aadharNo: "123456789012",
    dob: "15/05/1985",
    age: { years: 39, months: 4, days: 15 },
    doctor: { code: "000086", name: "DR. PRIYA SINGH" },
  },
  {
    mrNumber: "MR2400008856",
    mobile: "919123456789",
    email: "patient3@gmail.com",
    name: "SUNITA DEVI",
    patientCategory: "GENERAL",
    tariffCategory: "Hospital",
    revisionId: "",
    company: "ABC Corp",
    paymentType: "UPI",
    refPro: "021",
    refDoctor: "R00066",
    aadharNo: "987654321098",
    dob: "22/12/1990",
    age: { years: 34, months: 9, days: 8 },
    doctor: { code: "000087", name: "DR. AMIT KUMAR" },
  },
]

export default function InvestigationBillPage() {
  const { toast } = useToast()
  const [searchBy, setSearchBy] = useState("MR_NUMBER")
  const [searchMrNumber, setSearchMrNumber] = useState("")
  const [searchMobile, setSearchMobile] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const [patientData, setPatientData] = useState({
    mrNumber: "",
    mobile: "",
    email: "",
    name: "",
    patientCategory: "",
    tariffCategory: "",
    revisionId: "",
    company: "",
    paymentType: "Cash",
    refPro: "",
    refDoctor: "",
    aadharNo: "",
    dob: "",
    age: { years: 0, months: 0, days: 0 },
    doctor: { code: "", name: "" },
  })

  const [paymentDetails, setPaymentDetails] = useState({
    payMode: "Digital Payments",
    chequeNo: "",
    drawnOn: "",
    payDate: "",
    emergency: false,
    multiPayment: false,
    depositAdjust: false,
  })

  const [services, setServices] = useState<ServiceItem[]>([
    {
      id: "1",
      serviceCode: "SR0056",
      serviceName: "HBA1C",
      qty: 1,
      rate: 750.0,
      amount: 750.0,
      discount: 0,
      discountAmt: 0.0,
      netAmt: 750.0,
      reportingDoctor: "HAEMATOLOGY",
      department: "HAEMATOLOGY",
    },
    {
      id: "2",
      serviceCode: "SR0030",
      serviceName: "COMPLETE URINE EXAMINATION",
      qty: 1,
      rate: 230.0,
      amount: 230.0,
      discount: 0,
      discountAmt: 0.0,
      netAmt: 230.0,
      reportingDoctor: "HAEMATOLOGY",
      department: "HAEMATOLOGY",
    },
  ])

  const [billingDetails, setBillingDetails] = useState({
    overallDiscountPercent: 0,
    overallDiscountAmount: 0,
    emergencyPercent: 0,
    creditAuthorisedBy: "",
    discountAuthorisedBy: "",
    discountCategory: "",
    remarks: "",
  })

  const calculateTotals = () => {
    const serviceAmount = services.reduce((sum, service) => sum + service.netAmt, 0)
    const companyAmount = 0.0
    const patientAmount = serviceAmount
    const totalAmount = serviceAmount
    const paidAmount = serviceAmount
    const depositAmount = 0.0
    const dueAmount = 0.0

    return {
      serviceAmount,
      companyAmount,
      patientAmount,
      totalAmount,
      paidAmount,
      depositAmount,
      dueAmount,
    }
  }

  const totals = calculateTotals()

  const removeService = (id: string) => {
    setServices(services.filter((service) => service.id !== id))
  }

  const addNewService = () => {
    const newService: ServiceItem = {
      id: Date.now().toString(),
      serviceCode: "",
      serviceName: "",
      qty: 1,
      rate: 0,
      amount: 0,
      discount: 0,
      discountAmt: 0,
      netAmt: 0,
      reportingDoctor: "",
      department: "",
    }
    setServices([...services, newService])
  }

  const updateService = (id: string, field: keyof ServiceItem, value: any) => {
    setServices(
      services.map((service) => {
        if (service.id === id) {
          const updatedService = { ...service, [field]: value }
          // Recalculate amount and netAmt when qty, rate, or discount changes
          if (field === "qty" || field === "rate" || field === "discount") {
            updatedService.amount = updatedService.qty * updatedService.rate
            updatedService.discountAmt = (updatedService.amount * updatedService.discount) / 100
            updatedService.netAmt = updatedService.amount - updatedService.discountAmt
          }
          return updatedService
        }
        return service
      }),
    )
  }

  const searchPatient = async () => {
    setIsSearching(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      let patient = null

      if (searchBy === "MR_NUMBER" && searchMrNumber) {
        patient = mockPatients.find((p) => p.mrNumber === searchMrNumber)
      } else if (searchBy === "MOBILE" && searchMobile) {
        patient = mockPatients.find((p) => p.mobile === searchMobile)
      }

      if (patient) {
        setPatientData(patient)
        setSearchMrNumber(patient.mrNumber)
        setSearchMobile(patient.mobile)
        toast({
          title: "Patient Found",
          description: `Patient ${patient.name} details loaded successfully.`,
        })
      } else {
        toast({
          title: "Patient Not Found",
          description: "No patient found with the provided search criteria.",
          variant: "destructive",
        })
        // Clear patient data if not found
        setPatientData({
          mrNumber: "",
          mobile: "",
          email: "",
          name: "",
          patientCategory: "",
          tariffCategory: "",
          revisionId: "",
          company: "",
          paymentType: "Cash",
          refPro: "",
          refDoctor: "",
          aadharNo: "",
          dob: "",
          age: { years: 0, months: 0, days: 0 },
          doctor: { code: "", name: "" },
        })
      }
    } catch (error) {
      toast({
        title: "Search Error",
        description: "An error occurred while searching for the patient.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchPatient()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Investigation Bill</h1>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold bg-gray-100 text-black px-4 py-2 rounded">
              PATIENT DETAILS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Search By</Label>
                <div className="flex space-x-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="mr_number"
                      name="searchBy"
                      checked={searchBy === "MR_NUMBER"}
                      onChange={() => setSearchBy("MR_NUMBER")}
                    />
                    <Label htmlFor="mr_number">MR NUMBER</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="mobile"
                      name="searchBy"
                      checked={searchBy === "MOBILE"}
                      onChange={() => setSearchBy("MOBILE")}
                    />
                    <Label htmlFor="mobile">MOBILENO</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Name*</Label>
                <div className="flex space-x-2">
                  <Select defaultValue="Mr.">
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mr.">Mr.</SelectItem>
                      <SelectItem value="Mrs.">Mrs.</SelectItem>
                      <SelectItem value="Ms.">Ms.</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={patientData.name}
                    onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                    className="flex-1 font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>MR No.*</Label>
                <div className="flex space-x-2">
                  <Input
                    value={searchBy === "MR_NUMBER" ? searchMrNumber : patientData.mrNumber}
                    onChange={(e) => {
                      if (searchBy === "MR_NUMBER") {
                        setSearchMrNumber(e.target.value)
                      } else {
                        setPatientData({ ...patientData, mrNumber: e.target.value })
                      }
                    }}
                    onKeyPress={handleSearchKeyPress}
                    placeholder="Enter MR number"
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={searchPatient}
                    disabled={isSearching || (searchBy === "MR_NUMBER" && !searchMrNumber)}
                  >
                    {isSearching ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Mobile</Label>
                <div className="flex space-x-2">
                  <Input
                    value={searchBy === "MOBILE" ? searchMobile : patientData.mobile}
                    onChange={(e) => {
                      if (searchBy === "MOBILE") {
                        setSearchMobile(e.target.value)
                      } else {
                        setPatientData({ ...patientData, mobile: e.target.value })
                      }
                    }}
                    onKeyPress={handleSearchKeyPress}
                    placeholder="Enter mobile number"
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={searchPatient}
                    disabled={isSearching || (searchBy === "MOBILE" && !searchMobile)}
                  >
                    {isSearching ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  value={patientData.email}
                  onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>D.O.B</Label>
                <Input
                  value={patientData.dob}
                  onChange={(e) => setPatientData({ ...patientData, dob: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Patient Category</Label>
                <Input
                  value={patientData.patientCategory}
                  onChange={(e) => setPatientData({ ...patientData, patientCategory: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tariff Category</Label>
                <Input
                  value={patientData.tariffCategory}
                  onChange={(e) => setPatientData({ ...patientData, tariffCategory: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  value={patientData.company}
                  onChange={(e) => setPatientData({ ...patientData, company: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Age</Label>
                <div className="flex space-x-2">
                  <Input
                    value={patientData.age.years.toString()}
                    onChange={(e) =>
                      setPatientData({
                        ...patientData,
                        age: { ...patientData.age, years: Number.parseInt(e.target.value) || 0 },
                      })
                    }
                    className="w-16"
                  />
                  <Label className="self-center">Y:</Label>
                  <Input
                    value={patientData.age.months.toString()}
                    onChange={(e) =>
                      setPatientData({
                        ...patientData,
                        age: { ...patientData.age, months: Number.parseInt(e.target.value) || 0 },
                      })
                    }
                    className="w-16"
                  />
                  <Label className="self-center">M:</Label>
                  <Input
                    value={patientData.age.days.toString()}
                    onChange={(e) =>
                      setPatientData({
                        ...patientData,
                        age: { ...patientData.age, days: Number.parseInt(e.target.value) || 0 },
                      })
                    }
                    className="w-16"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Doctor</Label>
                <div className="flex space-x-2">
                  <Input
                    value={patientData.doctor.code}
                    onChange={(e) =>
                      setPatientData({ ...patientData, doctor: { ...patientData.doctor, code: e.target.value } })
                    }
                    className="w-20"
                  />
                  <Input
                    value={patientData.doctor.name}
                    onChange={(e) =>
                      setPatientData({ ...patientData, doctor: { ...patientData.doctor, name: e.target.value } })
                    }
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Ref.Doctor</Label>
                <Input
                  value={patientData.refDoctor}
                  onChange={(e) => setPatientData({ ...patientData, refDoctor: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Aadhar No</Label>
                <Input
                  value={patientData.aadharNo}
                  onChange={(e) => setPatientData({ ...patientData, aadharNo: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold bg-gray-100 text-black px-4 py-2 rounded">
              PAYMENT DETAILS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Pay Mode</Label>
                <Select
                  value={paymentDetails.payMode}
                  onValueChange={(value) => setPaymentDetails({ ...paymentDetails, payMode: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Digital Payments">Digital Payments</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cheque/DD No.</Label>
                <Input
                  value={paymentDetails.chequeNo}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, chequeNo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Drawn On</Label>
                <Input
                  value={paymentDetails.drawnOn}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, drawnOn: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Pay Date</Label>
                <Input
                  type="date"
                  value={paymentDetails.payDate}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, payDate: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-4 flex space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emergency"
                  checked={paymentDetails.emergency}
                  onCheckedChange={(checked) => setPaymentDetails({ ...paymentDetails, emergency: checked as boolean })}
                />
                <Label htmlFor="emergency">Emergency</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="multiPayment"
                  checked={paymentDetails.multiPayment}
                  onCheckedChange={(checked) =>
                    setPaymentDetails({ ...paymentDetails, multiPayment: checked as boolean })
                  }
                />
                <Label htmlFor="multiPayment">Multi Payment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="depositAdjust"
                  checked={paymentDetails.depositAdjust}
                  onCheckedChange={(checked) =>
                    setPaymentDetails({ ...paymentDetails, depositAdjust: checked as boolean })
                  }
                />
                <Label htmlFor="depositAdjust">Deposit Adjust</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold bg-gray-100 text-black px-4 py-2 rounded">
              SERVICE DETAILS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100 text-black">
                    <th className="border border-gray-300 px-2 py-2 text-xs">S NO</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs">SERVICE CODE</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs">SERVICE NAME</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs">QTY</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs">RATE</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs">AMOUNT (RS.)</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs">DISCOUNT (%)</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs">DISCOUNT AMT(RS.)</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs">NET AMT(RS.)</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs">REPORTING DOCTOR</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs">DEPARTMENT</th>
                    <th className="border border-gray-300 px-2 py-2 text-xs">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, index) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-2 py-2 text-center text-sm">{index + 1}</td>
                      <td className="border border-gray-300 px-2 py-2 text-sm">
                        <Input
                          value={service.serviceCode}
                          onChange={(e) => updateService(service.id, "serviceCode", e.target.value)}
                          className="h-8 text-xs"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-sm">
                        <Input
                          value={service.serviceName}
                          onChange={(e) => updateService(service.id, "serviceName", e.target.value)}
                          className="h-8 text-xs"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center text-sm">
                        <Input
                          type="number"
                          value={service.qty}
                          onChange={(e) => updateService(service.id, "qty", Number.parseFloat(e.target.value) || 0)}
                          className="h-8 text-xs w-16"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-right text-sm">
                        <Input
                          type="number"
                          value={service.rate}
                          onChange={(e) => updateService(service.id, "rate", Number.parseFloat(e.target.value) || 0)}
                          className="h-8 text-xs w-20"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-right text-sm">
                        {service.amount.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-right text-sm">
                        <Input
                          type="number"
                          value={service.discount}
                          onChange={(e) =>
                            updateService(service.id, "discount", Number.parseFloat(e.target.value) || 0)
                          }
                          className="h-8 text-xs w-16"
                        />
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-right text-sm">
                        {service.discountAmt.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-right text-sm">
                        {service.netAmt.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-sm">
                        <Select
                          value={service.reportingDoctor}
                          onValueChange={(value) => updateService(service.id, "reportingDoctor", value)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="HAEMATOLOGY">HAEMATOLOGY</SelectItem>
                            <SelectItem value="BIOCHEMISTRY">BIOCHEMISTRY</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-sm">
                        <Select
                          value={service.department}
                          onValueChange={(value) => updateService(service.id, "department", value)}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="HAEMATOLOGY">HAEMATOLOGY</SelectItem>
                            <SelectItem value="BIOCHEMISTRY">BIOCHEMISTRY</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeService(service.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={12} className="border border-gray-300 px-2 py-2">
                      <Button onClick={addNewService} variant="outline" size="sm" className="w-full bg-transparent">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Row
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold bg-gray-100 text-black px-4 py-2 rounded">
              OTHER DETAILS & SUMMARY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left side - Other Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Overall Discount (%)</Label>
                    <Input
                      type="number"
                      value={billingDetails.overallDiscountPercent}
                      onChange={(e) =>
                        setBillingDetails({
                          ...billingDetails,
                          overallDiscountPercent: Number.parseFloat(e.target.value) || 0,
                        })
                      }
                      className="text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Overall Discount (Rs.)</Label>
                    <Input
                      type="number"
                      value={billingDetails.overallDiscountAmount}
                      onChange={(e) =>
                        setBillingDetails({
                          ...billingDetails,
                          overallDiscountAmount: Number.parseFloat(e.target.value) || 0,
                        })
                      }
                      className="text-right"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Credit Authorised By</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="-Select-" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Discount Authorised By</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="-Select-" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Remarks</Label>
                  <Textarea
                    value={billingDetails.remarks}
                    onChange={(e) => setBillingDetails({ ...billingDetails, remarks: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              {/* Right side - Amount Summary */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Service Amount</Label>
                    <Input value={totals.serviceAmount.toFixed(2)} readOnly className="text-right" />
                  </div>
                  <div className="space-y-2">
                    <Label>Discount Amount</Label>
                    <Input value="0.00" readOnly className="text-right" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Net Amount</Label>
                    <Input value={totals.totalAmount.toFixed(2)} readOnly className="text-right" />
                  </div>
                  <div className="space-y-2">
                    <Label>Paid Amount</Label>
                    <Input value={totals.paidAmount.toFixed(2)} readOnly className="text-right" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Deposit Amount</Label>
                    <Input value={totals.depositAmount.toFixed(2)} readOnly className="text-right" />
                  </div>
                  <div className="space-y-2">
                    <Label>Due Amount</Label>
                    <Input value={totals.dueAmount.toFixed(4)} readOnly className="text-right" />
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="mt-6 space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-blue-600">Company</span>
                    <span className="font-bold">{totals.companyAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-blue-600">Patient</span>
                    <span className="font-bold">{totals.patientAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="font-medium text-blue-600">Total</span>
                    <span className="font-bold">{totals.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2 mt-6">
                  <Button className="bg-black hover:bg-black-700">
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Change
                  </Button>
                  <Button variant="outline">Cancel</Button>
                  <Button variant="outline">Clear</Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                  <Button variant="outline">Close</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { User, Plus, Printer } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { frontOfficeApi, Gender, BloodGroup, MaritalStatus, PatientSource, FeeMasters } from "@/lib/frontOfficeApi"
import { settingsApi } from '@/lib/settingsApi'
import { useRouter, useSearchParams } from "next/navigation"
import authService from "@/lib/authService"

export default function PatientRegistrationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const patientId = searchParams.get('patientId')
  const isEditMode = !!patientId
  const [dobDate, setDobDate] = useState<Date>()
  const [years, setYears] = useState(0)
  const [months, setMonths] = useState(0)
  const [days, setDays] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [showPrintDialog, setShowPrintDialog] = useState(false)
  const [registeredPatient, setRegisteredPatient] = useState<any>(null)

  // Master data states
  const [genders, setGenders] = useState<Gender[]>([])
  const [bloodGroups, setBloodGroups] = useState<BloodGroup[]>([])
  const [maritalStatuses, setMaritalStatuses] = useState<MaritalStatus[]>([])
  const [patientSources, setPatientSources] = useState<PatientSource[]>([])
  const [feeMasters, setFeeMasters] = useState<FeeMasters[]>([])
  const [paymentTypes, setPaymentTypes] = useState<any[]>([])

  // Load master data on component mount
  useEffect(() => {
    const loadMasterData = async () => {
      try {
        const [gendersData, bloodGroupsData, maritalStatusesData, patientSourcesData, feeMastersData, paymentTypesData] = await Promise.all([
          frontOfficeApi.getGenders(),
          frontOfficeApi.getBloodGroups(),
          frontOfficeApi.getMaritalStatuses(),
          frontOfficeApi.getPatientSources(),
          frontOfficeApi.getFeeMasters(),
          settingsApi.getPaymentTypes(),
        ])

        setGenders(gendersData)
        setBloodGroups(bloodGroupsData)
        setMaritalStatuses(maritalStatusesData)
        setPatientSources(patientSourcesData)
        setFeeMasters(feeMastersData)
        setPaymentTypes(paymentTypesData)
      } catch (error) {
        console.error('Failed to load master data:', error)
      }
    }

    loadMasterData()
  }, [])

  // Load patient data if editing
  useEffect(() => {
    if (isEditMode && patientId) {
      loadPatientData()
    }
  }, [patientId, isEditMode])

  const loadPatientData = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`${authService.getSettingsApiUrl()}/patients/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const patient = await response.json()
        setSalutation(patient.salutation || '')
        setFirstName(patient.first_name || '')
        setMiddleName(patient.middle_name || '')
        setLastName(patient.last_name || '')
        setFatherSpouseName(patient.father_spouse_name || '')
        setGender(patient.gender?.toLowerCase() || '')
        setMobile(patient.mobile || patient.phone || '')
        setEmail(patient.email || '')
        if (patient.date_of_birth) {
          setDobDate(new Date(patient.date_of_birth))
        }
        setBloodGroup(patient.blood_group?.toLowerCase() || '')
        setMaritalStatus(patient.marital_status?.toLowerCase() || '')
        setAddress1(patient.address1 || '')
        setDistrict(patient.district || 'HYDERABAD')
        setState(patient.state || 'TELANGANA')
        setCountry(patient.country || 'INDIA')
        setPinCode(patient.pin_code || '')
        setEmergencyContact(patient.emergency_contact || '')
        setMedicalHistory(patient.medical_history || '')
        setMedicalConditions(patient.medical_conditions || '')
        setFee(patient.fee || '')
        setAmount(patient.amount?.toString() || '')
        setFeeType(patient.fee_type || '')
        setSource(patient.source || '')
        setOccupation(patient.occupation || '')
        setSpecialization(patient.specialization || '')
        setDoctor(patient.doctor || '')
      }
    } catch (error) {
      console.error('Failed to load patient data:', error)
    }
  }

  // Calculate age when DOB changes
  useEffect(() => {
    if (dobDate) {
      const today = new Date()
      const birthDate = new Date(dobDate)

      let ageYears = today.getFullYear() - birthDate.getFullYear()
      let ageMonths = today.getMonth() - birthDate.getMonth()
      let ageDays = today.getDate() - birthDate.getDate()

      if (ageDays < 0) {
        ageMonths--
        ageDays += new Date(today.getFullYear(), today.getMonth(), 0).getDate()
      }

      if (ageMonths < 0) {
        ageYears--
        ageMonths += 12
      }

      // Check if values actually changed to avoid unnecessary re-renders or loops
      if (years !== ageYears) setYears(ageYears)
      if (months !== ageMonths) setMonths(ageMonths)
      if (days !== ageDays) setDays(ageDays)
    }
  }, [dobDate])

  // Calculate DOB when Age changes
  const handleAgeChange = (y: number, m: number, d: number) => {
    const today = new Date()
    const birthDate = new Date(today.getFullYear() - y, today.getMonth() - m, today.getDate() - d)
    setDobDate(birthDate)
  }

  // Form state variables
  const [salutation, setSalutation] = useState("")
  const [firstName, setFirstName] = useState("")
  const [middleName, setMiddleName] = useState("")
  const [lastName, setLastName] = useState("")
  const [fatherSpouseName, setFatherSpouseName] = useState("")
  const [gender, setGender] = useState("")
  const [mobile, setMobile] = useState("")
  const [bloodGroup, setBloodGroup] = useState("")
  const [maritalStatus, setMaritalStatus] = useState("")
  const [address1, setAddress1] = useState("")
  const [pinCode, setPinCode] = useState("")
  const [emergencyContact, setEmergencyContact] = useState("")
  const [email, setEmail] = useState("")
  const [district, setDistrict] = useState("")
  const [state, setState] = useState("")
  const [country, setCountry] = useState("INDIA")
  const [districtSearch, setDistrictSearch] = useState("")

  // State and District data
  const stateDistrictData = {
    "Telangana": [
      "ADILABAD", "BHADRADRI KOTHAGUDEM", "HANUMAKONDA", "HYDERABAD", "JAGTIAL",
      "JANGOAN", "JAYASHANKAR BHOOPALPALLY", "JOGULAMBA GADWAL", "KAMAREDDY",
      "KARIMNAGAR", "KHAMMAM", "KOMARAM BHEEM ASIFABAD", "MAHABUBABAD",
      "MAHABUBNAGAR", "MANCHERIAL", "MEDAK", "MEDCHAL-MALKAJGIRI", "MULUGU",
      "NAGARKURNOOL", "NALGONDA", "NARAYANPET", "NIRMAL", "NIZAMABAD",
      "PEDDAPALLI", "RAJANNA SIRCILLA", "RANGAREDDY", "SANGAREDDY", "SIDDIPET",
      "SURYAPET", "VIKARABAD", "WANAPARTHY", "WARANGAL", "YADADRI BHUVANAGIRI"
    ],
    "Andhra Pradesh": [
      "Srikakulam", "Parvathipuram Manyam", "Vizianagaram", "Visakhapatnam",
      "Alluri Sitharama Raju", "Anakapalli", "Polavaram", "Kakinada", "East Godavari",
      "Dr. B. R. Ambedkar Konaseema", "Eluru", "West Godavari", "NTR", "Krishna",
      "Palnadu", "Guntur", "Bapatla", "Prakasam", "Markapuram",
      "Sri Potti Sriramulu Nellore", "Kurnool", "Nandyal", "Ananthapuramu",
      "Sri Sathya Sai", "YSR Kadapa", "Annamayya", "Tirupati", "Chittoor"
    ]
  }

  // Additional form fields
  const [medicalHistory, setMedicalHistory] = useState("")
  const [medicalConditions, setMedicalConditions] = useState("")
  const [fee, setFee] = useState("")
  const [amount, setAmount] = useState("")
  const [feeType, setFeeType] = useState("")
  const [source, setSource] = useState("")
  const [occupation, setOccupation] = useState("")
  const [specialization, setSpecialization] = useState("")
  const [doctor, setDoctor] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Handle patient registration/update
  const handleRegister = async () => {
    // Validate required fields
    const newErrors: { [key: string]: string } = {}

    if (!salutation) newErrors.salutation = 'Title is required'
    if (!firstName) newErrors.firstName = 'First Name is required'
    if (!lastName) newErrors.lastName = 'Last Name is required'
    if (!gender) newErrors.gender = 'Gender is required'
    if (!mobile) newErrors.mobile = 'Mobile Number is required'
    if (!address1) newErrors.address1 = 'Address is required'
    if (!pinCode) newErrors.pinCode = 'Pin Code is required'
    if (!state) newErrors.state = 'State is required'
    if (!district) newErrors.district = 'District is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})

    setIsLoading(true)
    try {
      const patientData = {
        salutation,
        firstName,
        middleName,
        lastName,
        fatherSpouseName,
        gender,
        mobile,
        email,
        dateOfBirth: dobDate ? format(dobDate, 'yyyy-MM-dd') : null,
        bloodGroup,
        maritalStatus,
        address1,
        district,
        state,
        country,
        pinCode,
        emergencyContact,
        medicalHistory,
        medicalConditions,
        fee,
        amount,
        feeType,
        source,
        occupation,
        specialization,
        doctor,
        password
      }

      const token = localStorage.getItem('authToken')

      if (!token) {
        return
      }

      const url = isEditMode
        ? `${authService.getSettingsApiUrl()}/patients/${patientId}`
        : `${authService.getSettingsApiUrl()}/patients/register`

      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(patientData),
      })

      if (response.ok) {
        const result = await response.json()

        if (isEditMode) {
          router.push('/admin/front-office/patients')
        } else {
          setRegisteredPatient({
            patientId: result.patient.patientId,
            name: `${firstName} ${lastName}`,
            gender: gender,
            mobile: mobile,
            amount: amount || '0'
          })
          setShowPrintDialog(true)
        }
      }
    } catch (error) {
      console.error('Operation error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-4 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{isEditMode ? 'Edit Patient' : 'Patient Registration'}</h1>
          <p className="text-gray-600">{isEditMode ? 'Update patient information' : 'Register new patients'}</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-3">
            {/* Title */}
            <div className="space-y-1">
              <Label>Title *</Label>
              <Select value={salutation} onValueChange={setSalutation}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mr">Mr.</SelectItem>
                  <SelectItem value="mrs">Mrs.</SelectItem>
                  <SelectItem value="ms">Ms.</SelectItem>
                  <SelectItem value="dr">Dr.</SelectItem>
                  <SelectItem value="master">Master</SelectItem>
                  <SelectItem value="baby">Baby</SelectItem>
                </SelectContent>
              </Select>
              {errors.salutation && <p className="text-xs text-red-600">{errors.salutation}</p>}
            </div>

            {/* First Name */}
            <div className="space-y-1">
              <Label>First Name *</Label>
              <Input className="h-9" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              {errors.firstName && <p className="text-xs text-red-600">{errors.firstName}</p>}
            </div>

            {/* Middle Name */}
            {/* <div className="space-y-1">
              <Label>Middle Name</Label>
              <Input className="h-9" placeholder="Enter middle name" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
            </div> */}

            {/* Last Name */}
            <div className="space-y-1">
              <Label>Last Name *</Label>
              <Input className="h-9" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              {errors.lastName && <p className="text-xs text-red-600">{errors.lastName}</p>}
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <Label>Gender *</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  {genders.map((gender) => (
                    <SelectItem key={gender.id} value={gender.code.toLowerCase()}>
                      {gender.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-xs text-red-600">{errors.gender}</p>}
            </div>

            {/* Father/Spouse Name */}
            <div className="space-y-1">
              <Label>Father/Spouse Name</Label>
              <Input className="h-9" placeholder="Enter father/spouse name" value={fatherSpouseName} onChange={(e) => setFatherSpouseName(e.target.value)} />
            </div>

            {/* Date of Birth */}
            <div className="space-y-1">
              <Label>Date of Birth</Label>
              <Input
                type="date"
                className="h-9"
                value={dobDate ? format(dobDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    setDobDate(new Date(e.target.value))
                  } else {
                    setDobDate(undefined)
                  }
                }}
                max={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>

            {/* Age */}
            <div className="space-y-1">
              <Label>Age</Label>
              <div className="flex gap-1 items-center">
                <Input
                  type="number"
                  value={years}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0
                    setYears(val)
                    handleAgeChange(val, months, days)
                  }}
                  className="w-20 h-9"
                  placeholder="0"
                />
                <span className="text-xs">Y</span>
                <Input
                  type="number"
                  value={months}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0
                    setMonths(val)
                    handleAgeChange(years, val, days)
                  }}
                  className="w-20 h-9"
                  placeholder="0"
                />
                <span className="text-xs">M</span>
                <Input
                  type="number"
                  value={days}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0
                    setDays(val)
                    handleAgeChange(years, months, val)
                  }}
                  className="w-20 h-9"
                  placeholder="0"
                />
                <span className="text-xs">D</span>
              </div>
            </div>

            {/* Mobile No. */}
            <div className="space-y-1">
              <Label>Mobile No. *</Label>
              <Input className="h-9" type="tel" placeholder="Enter 10-digit mobile" maxLength={10} value={mobile} onChange={(e) => setMobile(e.target.value)} />
              {errors.mobile && <p className="text-xs text-red-600">{errors.mobile}</p>}
            </div>

            {/* Blood Group */}
            <div className="space-y-1">
              <Label>Blood Group</Label>
              <Select value={bloodGroup} onValueChange={setBloodGroup}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Select Blood Group" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((bloodGroup) => (
                    <SelectItem key={bloodGroup.id} value={bloodGroup.code.toLowerCase()}>
                      {bloodGroup.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Marital Status */}
            <div className="space-y-1">
              <Label>Marital Status</Label>
              <Select value={maritalStatus} onValueChange={setMaritalStatus}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Select Martial Status" />
                </SelectTrigger>
                <SelectContent>
                  {maritalStatuses.map((status) => (
                    <SelectItem key={status.id} value={status.code.toLowerCase()}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label>Email</Label>
              <Input className="h-9" type="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            {/* Emergency Contact */}
            <div className="space-y-1">
              <Label>Emergency Contact</Label>
              <Input className="h-9" type="tel" placeholder="Emergency contact number" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} />
            </div>

            {/* Address Line 1 */}
            <div className="space-y-1">
              <Label>Address Line 1 *</Label>
              <Input className="h-9" placeholder="House/Flat No, Building" value={address1} onChange={(e) => setAddress1(e.target.value)} />
              {errors.address1 && <p className="text-xs text-red-600">{errors.address1}</p>}
            </div>

            {/* Pin Code */}
            <div className="space-y-1">
              <Label>Pin Code *</Label>
              <Input className="h-9" placeholder="Enter 6-digit PIN" maxLength={6} value={pinCode} onChange={(e) => setPinCode(e.target.value)} />
              {errors.pinCode && <p className="text-xs text-red-600">{errors.pinCode}</p>}
            </div>

            {/* State */}
            <div className="space-y-1">
              <Label>State *</Label>
              <Select value={state} onValueChange={(value) => {
                setState(value)
                setDistrict("")
              }}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Telangana">Telangana</SelectItem>
                  <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                </SelectContent>
              </Select>
              {errors.state && <p className="text-xs text-red-600">{errors.state}</p>}
            </div>

            {/* District */}
            <div className="space-y-1">
              <Label>District *</Label>
              <Select
                value={district}
                onValueChange={setDistrict}
                disabled={!state}
                onOpenChange={(open) => {
                  if (open) setDistrictSearch("")
                }}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder={state ? "Select district" : "Select state first"} />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <div className="p-2 sticky top-0 bg-white z-10 border-b">
                    <Input
                      placeholder="Search district..."
                      value={districtSearch}
                      onChange={(e) => setDistrictSearch(e.target.value)}
                      className="h-8"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                  {state && stateDistrictData[state as keyof typeof stateDistrictData]
                    ?.filter(dist => dist.toLowerCase().includes(districtSearch.toLowerCase()))
                    .map((dist) => (
                      <SelectItem key={dist} value={dist}>
                        {dist}
                      </SelectItem>
                    ))}
                  {state && stateDistrictData[state as keyof typeof stateDistrictData]
                    ?.filter(dist => dist.toLowerCase().includes(districtSearch.toLowerCase())).length === 0 && (
                      <div className="p-2 text-sm text-gray-500 text-center">No districts found</div>
                    )}
                </SelectContent>
              </Select>
              {errors.district && <p className="text-xs text-red-600">{errors.district}</p>}
            </div>

            {/* Country */}
            <div className="space-y-1">
              <Label>Country</Label>
              <Input className="h-9" value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>

            {/* Medical History */}
            <div className="space-y-1">
              <Label>Medical History</Label>
              <Input className="h-9" placeholder="Medical History" value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} />
            </div>

            {/* Medical conditions */}
            <div className="space-y-1">
              <Label>Medical conditions</Label>
              <Input className="h-9" placeholder="Medical conditions" value={medicalConditions} onChange={(e) => setMedicalConditions(e.target.value)} />
            </div>

            {/* Fee */}
            <div className="space-y-1">
              <Label>Fee</Label>
              <Select value={fee} onValueChange={setFee}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Please select" />
                </SelectTrigger>
                <SelectContent>
                  {feeMasters.map((feeMaster) => (
                    <SelectItem key={feeMaster.id} value={feeMaster.code.toLowerCase()}>
                      {feeMaster.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-1">
              <Label>Amount</Label>
              <Input
                className="h-9"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* Type */}
            <div className="space-y-1">
              <Label>Type</Label>
              <Select value={feeType} onValueChange={setFeeType}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Please select option" />
                </SelectTrigger>
                <SelectContent>
                  {paymentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.code || type.name.toLowerCase()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Source */}
            <div className="space-y-1">
              <Label>Source</Label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="--Select--" />
                </SelectTrigger>
                <SelectContent>
                  {patientSources.map((patientSource) => (
                    <SelectItem key={patientSource.id} value={patientSource.code.toLowerCase()}>
                      {patientSource.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label>Password</Label>
              <Input className="h-9" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            {/* Occupation */}
            {/* <div className="space-y-1">
              <Label>Occupation</Label>
              <Input className="h-9" placeholder="Occupation" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
            </div> */}

            {/* Specialization */}
            {/* <div className="space-y-1">
              <Label>Specialization</Label>
              <Input className="h-9" placeholder="Specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
            </div> */}

            {/* Doctor */}
            {/* <div className="space-y-1">
              <Label>Doctor</Label>
              <Select value={doctor} onValueChange={setDoctor}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Please select doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                  <SelectItem value="dr-johnson">Dr. Johnson</SelectItem>
                  <SelectItem value="dr-williams">Dr. Williams</SelectItem>
                  <SelectItem value="dr-brown">Dr. Brown</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button
          className="bg-red-600 hover:bg-red-700"
          onClick={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (isEditMode ? 'Updating...' : 'Registering...') : (isEditMode ? 'Update Patient' : 'Register Patient')}
        </Button>
      </div>

      {/* Print Receipt Dialog */}
      <Dialog open={showPrintDialog} onOpenChange={setShowPrintDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Registration Successful</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center p-6 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-bold mb-4">Patient Receipt</h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="font-medium">Patient ID:</span>
                  <span>{registeredPatient?.patientId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{registeredPatient?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Gender:</span>
                  <span className="capitalize">{registeredPatient?.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Mobile:</span>
                  <span>{registeredPatient?.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Amount:</span>
                  <span>₹{registeredPatient?.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="flex-1"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Receipt
              </Button>
              <Button
                onClick={() => {
                  setShowPrintDialog(false)
                  router.push('/admin/front-office/patients')
                }}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
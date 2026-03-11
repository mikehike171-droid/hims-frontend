"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ChevronLeft } from "lucide-react"
import { frontOfficeApi, Gender, BloodGroup, MaritalStatus, PatientSource, FeeMasters } from "@/lib/frontOfficeApi"
import { settingsApi } from '@/lib/settingsApi'
import { format } from "date-fns"
import authService from "@/lib/authService"
import { useRouter } from "next/navigation"

export default function AddRefPatientPage() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [selectedPatient, setSelectedPatient] = useState<any>(null)
    const [isSearching, setIsSearching] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Master data states
    const [genders, setGenders] = useState<Gender[]>([])
    const [bloodGroups, setBloodGroups] = useState<BloodGroup[]>([])
    const [maritalStatuses, setMaritalStatuses] = useState<MaritalStatus[]>([])
    const [patientSources, setPatientSources] = useState<PatientSource[]>([])
    const [feeMasters, setFeeMasters] = useState<FeeMasters[]>([])
    const [paymentTypes, setPaymentTypes] = useState<any[]>([])

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
    const [dobDate, setDobDate] = useState<Date>()
    const [years, setYears] = useState(0)
    const [months, setMonths] = useState(0)
    const [days, setDays] = useState(0)
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

            setYears(ageYears)
            setMonths(ageMonths)
            setDays(ageDays)
        }
    }, [dobDate])

    // Search patients
    const handleSearch = async () => {
        if (!searchQuery.trim()) return

        setIsSearching(true)
        try {
            const token = localStorage.getItem('authToken')
            const response = await fetch(`${authService.getSettingsApiUrl()}/patients?search=${searchQuery}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                const data = await response.json()
                setSearchResults(data.data || data)
            }
        } catch (error) {
            console.error('Search failed:', error)
            setSearchResults([])
        } finally {
            setIsSearching(false)
        }
    }

    const handleSelectPatient = (patient: any) => {
        setSelectedPatient(patient)
        setSearchResults([])
    }

    // Handle REF patient creation
    const handleCreateRefPatient = async () => {
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
            const refPatientData = {
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
                password,
                refPatientId: selectedPatient?.patient_id || null
            }

            const token = localStorage.getItem('authToken')

            if (!token) {
                alert('Please login again')
                return
            }

            const response = await fetch(`${authService.getSettingsApiUrl()}/patients/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(refPatientData),
            })

            if (response.ok) {
                setErrors({})
                resetForm()
                router.push("/admin/REF/ref-patient")
            } else {
                const error = await response.json()
                alert(error.message || "Failed to create REF patient")
            }
        } catch (error) {
            console.error('Creation error:', error)
            alert("An error occurred during registration")
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setSelectedPatient(null)
        setSearchQuery("")
        setSalutation("")
        setFirstName("")
        setMiddleName("")
        setLastName("")
        setFatherSpouseName("")
        setGender("")
        setMobile("")
        setEmail("")
        setDobDate(undefined)
        setBloodGroup("")
        setMaritalStatus("")
        setAddress1("")
        setDistrict("")
        setState("")
        setCountry("INDIA")
        setPinCode("")
        setEmergencyContact("")
        setMedicalHistory("")
        setMedicalConditions("")
        setFee("")
        setAmount("")
        setFeeType("")
        setSource("")
        setOccupation("")
        setSpecialization("")
        setDoctor("")
        setPassword("")
    }

    return (
        <div className="p-6 space-y-4 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push("/admin/REF/ref-patient")}>
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">New REF Patient</h1>
                        <p className="text-gray-600">Search old patient and create REF patient</p>
                    </div>
                </div>
            </div>

            {/* Patient Search Box */}
            <Card>
                <CardHeader>
                    <CardTitle>Search Old Patient</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Search by Patient ID, Name, or Mobile Number"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="flex-1"
                        />
                        <Button onClick={handleSearch} disabled={isSearching}>
                            <Search className="h-4 w-4 mr-2" />
                            {isSearching ? 'Searching...' : 'Search'}
                        </Button>
                    </div>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <div className="mt-4 border rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Patient ID</th>
                                        <th className="px-4 py-2 text-left">Name</th>
                                        <th className="px-4 py-2 text-left">Mobile</th>
                                        <th className="px-4 py-2 text-left">Gender</th>
                                        <th className="px-4 py-2 text-left">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchResults.map((patient) => (
                                        <tr key={patient.id} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-2">{patient.patientId}</td>
                                            <td className="px-4 py-2">{`${patient.first_name} ${patient.last_name}`}</td>
                                            <td className="px-4 py-2">{patient.mobile}</td>
                                            <td className="px-4 py-2 capitalize">{patient.gender}</td>
                                            <td className="px-4 py-2">
                                                <Button size="sm" onClick={() => handleSelectPatient(patient)}>
                                                    Select
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {selectedPatient && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800">
                                Selected Patient: <strong>{selectedPatient.patientId}</strong> - {selectedPatient.first_name} {selectedPatient.last_name}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Registration Form */}
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
                            <Label>Age (Auto-calculated)</Label>
                            <div className="flex gap-1 items-center">
                                <Input
                                    type="number"
                                    value={years}
                                    readOnly
                                    className="w-12 h-9 bg-gray-50"
                                    placeholder="0"
                                />
                                <span className="text-xs">Y</span>
                                <Input
                                    type="number"
                                    value={months}
                                    readOnly
                                    className="w-12 h-9 bg-gray-50"
                                    placeholder="0"
                                />
                                <span className="text-xs">M</span>
                                <Input
                                    type="number"
                                    value={days}
                                    readOnly
                                    className="w-12 h-9 bg-gray-50"
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
                            >
                                <SelectTrigger className="h-9 w-full">
                                    <SelectValue placeholder={state ? "Select district" : "Select state first"} />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                    {state && stateDistrictData[state as keyof typeof stateDistrictData]
                                        ?.filter(dist => dist.toLowerCase().includes(districtSearch.toLowerCase()))
                                        .map((dist) => (
                                            <SelectItem key={dist} value={dist}>
                                                {dist}
                                            </SelectItem>
                                        ))}
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
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={resetForm}>
                    Reset
                </Button>
                <Button
                    className="bg-red-600 hover:bg-red-700"
                    onClick={handleCreateRefPatient}
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating...' : 'Create REF Patient'}
                </Button>
            </div>
        </div>
    )
}

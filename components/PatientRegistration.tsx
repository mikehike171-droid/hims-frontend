'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PatientRegistration() {
  const [patientData, setPatientData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    emergency_contact: '',
    blood_group: '',
    allergies: '',
    medical_history: ''
  });

  const [consultationData, setConsultationData] = useState({
    doctor_id: '',
    chief_complaint: '',
    diagnosis: '',
    treatment_plan: '',
    consultation_fee: ''
  });

  const [billData, setBillData] = useState({
    total_amount: '',
    discount_amount: '0',
    tax_amount: '0',
    net_amount: '',
    payment_method: '',
    payment_status: 'completed',
    items: [{ item_name: 'Consultation Fee', unit_price: '', total_price: '' }]
  });

  const handlePatientChange = (field: string, value: string) => {
    setPatientData(prev => ({ ...prev, [field]: value }));
  };

  const handleConsultationChange = (field: string, value: string) => {
    setConsultationData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'consultation_fee') {
      setBillData(prev => ({
        ...prev,
        total_amount: value,
        net_amount: value,
        items: [{ ...prev.items[0], unit_price: value, total_price: value }]
      }));
    }
  };

  const handleBillChange = (field: string, value: string) => {
    setBillData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    try {
      const registerPayload = {
        patient: patientData,
        consultation: consultationData,
        bill: {
          ...billData,
          created_by: 1 // Current user ID
        }
      };

      const response = await fetch('http://localhost:3002/patients/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-location-id': '1',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(registerPayload)
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Patient registered successfully! Patient ID: ${result.patient_id}`);
        // Reset forms
        setPatientData({
          first_name: '', last_name: '', date_of_birth: '', gender: '',
          phone: '', email: '', address: '', emergency_contact: '',
          blood_group: '', allergies: '', medical_history: ''
        });
        setConsultationData({
          doctor_id: '', chief_complaint: '', diagnosis: '',
          treatment_plan: '', consultation_fee: ''
        });
        setBillData({
          total_amount: '', discount_amount: '0', tax_amount: '0',
          net_amount: '', payment_method: '', payment_status: 'completed',
          items: [{ item_name: 'Consultation Fee', unit_price: '', total_price: '' }]
        });
      } else {
        alert('Registration failed: ' + result.message);
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Patient Registration</h1>
      
      <Tabs defaultValue="patient" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="patient">Patient Information</TabsTrigger>
          <TabsTrigger value="consultation">Consultation Details</TabsTrigger>
          <TabsTrigger value="billing">Billing & Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="patient">
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    value={patientData.first_name}
                    onChange={(e) => handlePatientChange('first_name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    value={patientData.last_name}
                    onChange={(e) => handlePatientChange('last_name', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date_of_birth">Date of Birth *</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={patientData.date_of_birth}
                    onChange={(e) => handlePatientChange('date_of_birth', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select onValueChange={(value) => handlePatientChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={patientData.phone}
                    onChange={(e) => handlePatientChange('phone', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={patientData.email}
                    onChange={(e) => handlePatientChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={patientData.address}
                  onChange={(e) => handlePatientChange('address', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergency_contact">Emergency Contact</Label>
                  <Input
                    id="emergency_contact"
                    value={patientData.emergency_contact}
                    onChange={(e) => handlePatientChange('emergency_contact', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="blood_group">Blood Group</Label>
                  <Select onValueChange={(value) => handlePatientChange('blood_group', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  value={patientData.allergies}
                  onChange={(e) => handlePatientChange('allergies', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="medical_history">Medical History</Label>
                <Textarea
                  id="medical_history"
                  value={patientData.medical_history}
                  onChange={(e) => handlePatientChange('medical_history', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultation">
          <Card>
            <CardHeader>
              <CardTitle>Consultation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="doctor_id">Doctor *</Label>
                <Select onValueChange={(value) => handleConsultationChange('doctor_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Dr. Smith</SelectItem>
                    <SelectItem value="2">Dr. Johnson</SelectItem>
                    <SelectItem value="3">Dr. Williams</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="chief_complaint">Chief Complaint</Label>
                <Textarea
                  id="chief_complaint"
                  value={consultationData.chief_complaint}
                  onChange={(e) => handleConsultationChange('chief_complaint', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Textarea
                  id="diagnosis"
                  value={consultationData.diagnosis}
                  onChange={(e) => handleConsultationChange('diagnosis', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="treatment_plan">Treatment Plan</Label>
                <Textarea
                  id="treatment_plan"
                  value={consultationData.treatment_plan}
                  onChange={(e) => handleConsultationChange('treatment_plan', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="consultation_fee">Consultation Fee *</Label>
                <Input
                  id="consultation_fee"
                  type="number"
                  value={consultationData.consultation_fee}
                  onChange={(e) => handleConsultationChange('consultation_fee', e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="total_amount">Total Amount</Label>
                  <Input
                    id="total_amount"
                    type="number"
                    value={billData.total_amount}
                    onChange={(e) => handleBillChange('total_amount', e.target.value)}
                    readOnly
                  />
                </div>
                <div>
                  <Label htmlFor="discount_amount">Discount</Label>
                  <Input
                    id="discount_amount"
                    type="number"
                    value={billData.discount_amount}
                    onChange={(e) => handleBillChange('discount_amount', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="net_amount">Net Amount</Label>
                  <Input
                    id="net_amount"
                    type="number"
                    value={billData.net_amount}
                    onChange={(e) => handleBillChange('net_amount', e.target.value)}
                    readOnly
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="payment_method">Payment Method *</Label>
                <Select onValueChange={(value) => handleBillChange('payment_method', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mt-6">
                <Button onClick={handleRegister} className="w-full" size="lg">
                  Register Patient
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
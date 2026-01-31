            <TabsTrigger 
              value="treatment" 
              className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm px-3 py-2 text-xs font-medium rounded transition-all duration-200 hover:bg-white/50"
            >
              Treatment Plan
            </TabsTrigger>

        {/* Treatment Plan Tab */}
        <TabsContent value="treatment" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Treatment Plan & Homeopathy Prescription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column - Medicine Selection */}
                <div className="space-y-4">
                  <div>
                    <Label>Search Homeopathy Medicine</Label>
                    <Input placeholder="Search medicine name..." className="mb-4" />
                  </div>
                  
                  <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                    <h4 className="font-medium mb-3">Available Medicines</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer">
                        <span>Arnica Montana 30C</span>
                        <Button size="sm" variant="outline">Add</Button>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer">
                        <span>Belladonna 200C</span>
                        <Button size="sm" variant="outline">Add</Button>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer">
                        <span>Nux Vomica 30C</span>
                        <Button size="sm" variant="outline">Add</Button>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer">
                        <span>Pulsatilla 30C</span>
                        <Button size="sm" variant="outline">Add</Button>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer">
                        <span>Sulphur 200C</span>
                        <Button size="sm" variant="outline">Add</Button>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer">
                        <span>Calcarea Carbonica 30C</span>
                        <Button size="sm" variant="outline">Add</Button>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer">
                        <span>Lycopodium 200C</span>
                        <Button size="sm" variant="outline">Add</Button>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer">
                        <span>Rhus Toxicodendron 30C</span>
                        <Button size="sm" variant="outline">Add</Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Prescription Details */}
                <div className="space-y-4">
                  <div>
                    <Label>Selected Medicines</Label>
                    <div className="border rounded-lg p-4 min-h-48 max-h-96 overflow-y-auto">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded bg-blue-50">
                          <div className="flex-1">
                            <p className="font-medium">Arnica Montana 30C</p>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                              <Select>
                                <SelectTrigger className="h-8">
                                  <SelectValue placeholder="Dosage" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="2drops">2 drops</SelectItem>
                                  <SelectItem value="3drops">3 drops</SelectItem>
                                  <SelectItem value="5drops">5 drops</SelectItem>
                                  <SelectItem value="10drops">10 drops</SelectItem>
                                </SelectContent>
                              </Select>
                              <Select>
                                <SelectTrigger className="h-8">
                                  <SelectValue placeholder="Frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="od">OD (Once daily)</SelectItem>
                                  <SelectItem value="bd">BD (Twice daily)</SelectItem>
                                  <SelectItem value="tds">TDS (Thrice daily)</SelectItem>
                                  <SelectItem value="qds">QDS (Four times daily)</SelectItem>
                                </SelectContent>
                              </Select>
                              <Select>
                                <SelectTrigger className="h-8">
                                  <SelectValue placeholder="Duration" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="3days">3 days</SelectItem>
                                  <SelectItem value="7days">7 days</SelectItem>
                                  <SelectItem value="15days">15 days</SelectItem>
                                  <SelectItem value="30days">30 days</SelectItem>
                                  <SelectItem value="60days">60 days</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="ml-2">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="text-center text-gray-500 py-4">
                          No medicines selected. Add medicines from the left panel.
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Special Instructions</Label>
                    <Textarea 
                      placeholder="Enter special instructions for the patient (e.g., take before meals, avoid coffee, etc.)"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Follow-up Date</Label>
                      <Input type="date" />
                    </div>
                    <div>
                      <Label>Next Appointment</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning (9-12 AM)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (12-4 PM)</SelectItem>
                          <SelectItem value="evening">Evening (4-7 PM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Treatment Notes */}
              <div className="mt-6 space-y-4">
                <div>
                  <Label>Treatment Notes & Doctor's Observations</Label>
                  <Textarea 
                    placeholder="Enter detailed treatment notes, patient response, observations, and recommendations..."
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Diagnosis</Label>
                    <Input placeholder="Primary diagnosis" />
                  </div>
                  <div>
                    <Label>Prognosis</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select prognosis" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="guarded">Guarded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline">Save as Draft</Button>
                <Button>Save Prescription</Button>
                <Button variant="secondary">
                  <Printer className="h-4 w-4 mr-2" />
                  Print Prescription
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Previous Prescriptions */}
          <Card>
            <CardHeader>
              <CardTitle>Previous Prescriptions & Treatment History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Medicines Prescribed</TableHead>
                    <TableHead>Dosage & Duration</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>15/01/2024</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div>Arnica Montana 30C</div>
                        <div>Belladonna 200C</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div>3 drops BD - 15 days</div>
                        <div>5 drops TDS - 15 days</div>
                      </div>
                    </TableCell>
                    <TableCell>Dr. Smith</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-green-600">Completed</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Print</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>01/01/2024</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div>Nux Vomica 30C</div>
                        <div>Pulsatilla 30C</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div>2 drops BD - 30 days</div>
                        <div>3 drops TDS - 30 days</div>
                      </div>
                    </TableCell>
                    <TableCell>Dr. Johnson</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
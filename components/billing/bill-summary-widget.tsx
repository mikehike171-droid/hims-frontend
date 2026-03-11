"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calculator, Plus, Minus, X, Receipt, Save, Percent, IndianRupee } from "lucide-react"

interface BillItem {
  id: string
  name: string
  price: number
  quantity: number
  discount: number
  total: number
  category?: string
}

interface Service {
  id: string
  name: string
  price: number
  category: string
  description?: string
}

interface BillSummaryWidgetProps {
  items?: BillItem[]
  onItemsChange?: (items: BillItem[]) => void
  onGenerateBill?: (billData: any) => void
  onSaveDraft?: (billData: any) => void
  showPaymentOptions?: boolean
  className?: string
  availableServices?: Service[]
}

const defaultServices: Service[] = [
  {
    id: "S001",
    name: "General Consultation",
    price: 500,
    category: "Consultation",
    description: "General physician consultation",
  },
  {
    id: "S002",
    name: "Cardiology Consultation",
    price: 800,
    category: "Consultation",
    description: "Specialist cardiology consultation",
  },
  {
    id: "S003",
    name: "Dermatology Consultation",
    price: 600,
    category: "Consultation",
    description: "Skin specialist consultation",
  },
  {
    id: "S004",
    name: "Orthopedic Consultation",
    price: 700,
    category: "Consultation",
    description: "Bone and joint specialist",
  },
  {
    id: "S005",
    name: "Pediatric Consultation",
    price: 500,
    category: "Consultation",
    description: "Child specialist consultation",
  },
  { id: "S006", name: "ECG", price: 200, category: "Investigation", description: "Electrocardiogram test" },
  { id: "S007", name: "Echo Cardiogram", price: 1500, category: "Investigation", description: "Heart ultrasound" },
  { id: "S008", name: "X-Ray Chest", price: 400, category: "Radiology", description: "Chest X-ray imaging" },
  { id: "S009", name: "X-Ray Limbs", price: 350, category: "Radiology", description: "Limb X-ray imaging" },
  { id: "S010", name: "CT Scan Head", price: 3000, category: "Radiology", description: "Head CT scan" },
  { id: "S011", name: "MRI Brain", price: 8000, category: "Radiology", description: "Brain MRI scan" },
  { id: "S012", name: "Blood Test - CBC", price: 300, category: "Laboratory", description: "Complete blood count" },
  { id: "S013", name: "Blood Sugar Fasting", price: 150, category: "Laboratory", description: "Fasting blood glucose" },
  { id: "S014", name: "Lipid Profile", price: 500, category: "Laboratory", description: "Cholesterol and lipid tests" },
  { id: "S015", name: "Liver Function Test", price: 600, category: "Laboratory", description: "LFT panel" },
  { id: "S016", name: "Kidney Function Test", price: 550, category: "Laboratory", description: "KFT panel" },
  { id: "S017", name: "Thyroid Profile", price: 800, category: "Laboratory", description: "T3, T4, TSH tests" },
  { id: "S018", name: "Urine Routine", price: 200, category: "Laboratory", description: "Urine analysis" },
  {
    id: "S019",
    name: "Physiotherapy Session",
    price: 400,
    category: "Therapy",
    description: "Physical therapy session",
  },
  { id: "S020", name: "Dressing", price: 150, category: "Procedure", description: "Wound dressing" },
]

export function BillSummaryWidget({
  items = [],
  onItemsChange,
  onGenerateBill,
  onSaveDraft,
  showPaymentOptions = true,
  className = "",
  availableServices = defaultServices,
}: BillSummaryWidgetProps) {
  const [billItems, setBillItems] = useState<BillItem[]>(items)
  const [billDiscountType, setBillDiscountType] = useState("none")
  const [billDiscountValue, setBillDiscountValue] = useState(0)
  const [partialPayment, setPartialPayment] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [paidAmount, setPaidAmount] = useState(0)
  const [serviceSearchOpen, setServiceSearchOpen] = useState(false)
  const [serviceSearchTerm, setServiceSearchTerm] = useState("")

  // Update items when props change
  useEffect(() => {
    setBillItems(items)
  }, [items])

  // Filter services based on search
  const filteredServices = availableServices.filter(
    (service) =>
      service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(serviceSearchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(serviceSearchTerm.toLowerCase()),
  )

  // Group services by category
  const servicesByCategory = filteredServices.reduce(
    (acc, service) => {
      if (!acc[service.category]) {
        acc[service.category] = []
      }
      acc[service.category].push(service)
      return acc
    },
    {} as Record<string, Service[]>,
  )

  // Calculate totals
  const subtotal = billItems.reduce((sum, item) => sum + item.total, 0)

  const billDiscount =
    billDiscountType === "percentage"
      ? (subtotal * billDiscountValue) / 100
      : billDiscountType === "amount"
        ? billDiscountValue
        : billDiscountType === "senior"
          ? (subtotal * 10) / 100
          : billDiscountType === "employee"
            ? (subtotal * 15) / 100
            : billDiscountType === "corporate"
              ? (subtotal * 20) / 100
              : 0

  const afterDiscount = subtotal - billDiscount
  const tax = afterDiscount * 0.18 // 18% GST
  const grandTotal = afterDiscount + tax

  const updateItem = (id: string, field: keyof BillItem, value: number) => {
    const updatedItems = billItems.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }

        // Recalculate total when quantity or discount changes
        if (field === "quantity" || field === "discount") {
          updatedItem.total = updatedItem.price * updatedItem.quantity - updatedItem.discount
        }

        return updatedItem
      }
      return item
    })

    setBillItems(updatedItems)
    onItemsChange?.(updatedItems)
  }

  const removeItem = (id: string) => {
    const updatedItems = billItems.filter((item) => item.id !== id)
    setBillItems(updatedItems)
    onItemsChange?.(updatedItems)
  }

  const addService = (service: Service) => {
    const existingItem = billItems.find((item) => item.id === service.id)

    if (existingItem) {
      updateItem(existingItem.id, "quantity", existingItem.quantity + 1)
    } else {
      const newItem: BillItem = {
        id: service.id,
        name: service.name,
        price: service.price,
        quantity: 1,
        discount: 0,
        total: service.price,
        category: service.category,
      }
      const updatedItems = [...billItems, newItem]
      setBillItems(updatedItems)
      onItemsChange?.(updatedItems)
    }

    setServiceSearchOpen(false)
    setServiceSearchTerm("")
  }

  const handleGenerateBill = () => {
    const billData = {
      items: billItems,
      subtotal,
      billDiscount,
      tax,
      grandTotal,
      paymentMethod,
      partialPayment,
      paidAmount: partialPayment ? paidAmount : grandTotal,
      balanceAmount: partialPayment ? grandTotal - paidAmount : 0,
    }
    onGenerateBill?.(billData)
  }

  const handleSaveDraft = () => {
    const draftData = {
      items: billItems,
      subtotal,
      billDiscount,
      tax,
      grandTotal,
      paymentMethod,
      partialPayment,
      paidAmount,
    }
    onSaveDraft?.(draftData)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Bill Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Bill Summary
            </div>
            <Popover open={serviceSearchOpen} onOpenChange={setServiceSearchOpen}>
              <PopoverTrigger asChild>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0" align="end">
                <Command>
                  <CommandInput
                    placeholder="Search services..."
                    value={serviceSearchTerm}
                    onValueChange={setServiceSearchTerm}
                  />
                  <CommandList>
                    <CommandEmpty>No services found.</CommandEmpty>
                    {Object.entries(servicesByCategory).map(([category, services]) => (
                      <CommandGroup key={category} heading={category}>
                        {services.map((service) => (
                          <CommandItem key={service.id} onSelect={() => addService(service)} className="cursor-pointer">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex-1">
                                <p className="font-medium">{service.name}</p>
                                <p className="text-sm text-gray-600">{service.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {service.category}
                                  </Badge>
                                  <span className="text-sm font-semibold text-green-600">₹{service.price}</span>
                                </div>
                              </div>
                              <Plus className="h-4 w-4 text-blue-600 ml-2" />
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </CardTitle>
          <p className="text-sm text-muted-foreground">Selected services and total amount</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {billItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No services selected</p>
              <p className="text-sm">Click "Add Service" to start billing</p>
            </div>
          ) : (
            <ScrollArea className="max-h-64">
              <div className="space-y-3">
                {billItems.map((item) => (
                  <div key={item.id} className="space-y-2 p-3 border rounded-lg">
                    {/* Item Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                        {item.category && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {item.category}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateItem(item.id, "quantity", Math.max(1, item.quantity - 1))}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateItem(item.id, "quantity", item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeItem(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Item Discount */}
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">Item Discount:</Label>
                      <div className="relative flex-1">
                        <IndianRupee className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="0"
                          value={item.discount}
                          onChange={(e) => updateItem(item.id, "discount", Number(e.target.value) || 0)}
                          className="h-8 text-xs pl-6"
                          min="0"
                          max={item.price * item.quantity}
                        />
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <span className="font-semibold">₹{item.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {billItems.length > 0 && (
            <>
              <Separator />

              {/* Calculations */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>

                {/* Bill Discount */}
                <div className="space-y-2">
                  <Label className="text-sm">Bill Discount Type</Label>
                  <Select value={billDiscountType} onValueChange={setBillDiscountType}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Discount</SelectItem>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="amount">Fixed Amount</SelectItem>
                      <SelectItem value="senior">Senior Citizen (10%)</SelectItem>
                      <SelectItem value="employee">Employee (15%)</SelectItem>
                      <SelectItem value="corporate">Corporate (20%)</SelectItem>
                    </SelectContent>
                  </Select>

                  {(billDiscountType === "percentage" || billDiscountType === "amount") && (
                    <div className="relative">
                      {billDiscountType === "percentage" ? (
                        <Percent className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                      ) : (
                        <IndianRupee className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                      )}
                      <Input
                        type="number"
                        placeholder={billDiscountType === "percentage" ? "Enter %" : "Enter amount"}
                        value={billDiscountValue}
                        onChange={(e) => setBillDiscountValue(Number(e.target.value) || 0)}
                        className="h-9 pl-6"
                        min="0"
                        max={billDiscountType === "percentage" ? 100 : subtotal}
                      />
                    </div>
                  )}
                </div>

                {billDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Bill Discount:</span>
                    <span>-₹{billDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Tax (18% GST):</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Payment Options */}
      {showPaymentOptions && billItems.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Payment Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Partial Payment */}
            <div className="flex items-center space-x-2">
              <Checkbox id="partial-payment" checked={partialPayment} onCheckedChange={setPartialPayment} />
              <Label htmlFor="partial-payment">Partial Payment</Label>
            </div>

            {partialPayment && (
              <div className="space-y-2">
                <Label>Amount Paying Now</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value) || 0)}
                    className="pl-8"
                    min="0"
                    max={grandTotal}
                  />
                </div>
                <p className="text-sm text-muted-foreground">Balance: ₹{(grandTotal - paidAmount).toFixed(2)}</p>
              </div>
            )}

            {/* Payment Method */}
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="netbanking">Net Banking</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="insurance">Insurance</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button onClick={handleGenerateBill} className="flex-1" disabled={billItems.length === 0}>
                <Receipt className="h-4 w-4 mr-2" />
                Generate Bill
              </Button>
              <Button variant="outline" onClick={handleSaveDraft} disabled={billItems.length === 0}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

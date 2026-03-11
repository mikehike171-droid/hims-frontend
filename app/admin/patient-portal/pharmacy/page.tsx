"use client"

import { useState } from "react"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ShoppingCart,
  Pill,
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  CheckCircle,
  Truck,
  Store,
  AlertCircle,
  Calculator,
  Receipt,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function PharmacyOrder() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelectedMedication = searchParams.get("medication")

  const [cartItems, setCartItems] = useState([
    ...(preSelectedMedication
      ? [
          {
            id: "cart1",
            name: preSelectedMedication,
            genericName: "Generic " + preSelectedMedication,
            strength: "500mg",
            form: "Tablet",
            quantity: 30,
            unitPrice: 12.5,
            prescriptionRequired: true,
            inStock: true,
            manufacturer: "Apollo Pharmacy",
            expiryDate: "12/2025",
            discount: 10,
          },
        ]
      : []),
  ])

  const [deliveryMethod, setDeliveryMethod] = useState("delivery")
  const [paymentMethod, setPaymentMethod] = useState("online")
  const [deliveryAddress, setDeliveryAddress] = useState({
    type: "home",
    address: "123 Main Street, Apartment 4B",
    city: "Mumbai",
    pincode: "400001",
    landmark: "Near ABC Mall",
  })

  const availableMedications = [
    {
      id: "med1",
      name: "Metformin 500mg",
      genericName: "Metformin Hydrochloride",
      strength: "500mg",
      form: "Tablet",
      unitPrice: 12.5,
      prescriptionRequired: true,
      inStock: true,
      stockCount: 150,
      manufacturer: "Apollo Pharmacy",
      expiryDate: "12/2025",
      discount: 10,
      rating: 4.5,
    },
    {
      id: "med2",
      name: "Lisinopril 10mg",
      genericName: "Lisinopril",
      strength: "10mg",
      form: "Tablet",
      unitPrice: 8.75,
      prescriptionRequired: true,
      inStock: true,
      stockCount: 80,
      manufacturer: "Cipla",
      expiryDate: "10/2025",
      discount: 15,
      rating: 4.3,
    },
    {
      id: "med3",
      name: "Paracetamol 500mg",
      genericName: "Acetaminophen",
      strength: "500mg",
      form: "Tablet",
      unitPrice: 3.25,
      prescriptionRequired: false,
      inStock: true,
      stockCount: 200,
      manufacturer: "Mankind Pharma",
      expiryDate: "08/2025",
      discount: 5,
      rating: 4.7,
    },
    {
      id: "med4",
      name: "Ibuprofen 400mg",
      genericName: "Ibuprofen",
      strength: "400mg",
      form: "Tablet",
      unitPrice: 6.5,
      prescriptionRequired: false,
      inStock: false,
      stockCount: 0,
      manufacturer: "Dr. Reddy's",
      expiryDate: "06/2025",
      discount: 8,
      rating: 4.4,
    },
  ]

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredMedications = availableMedications.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "prescription" && med.prescriptionRequired) ||
      (selectedCategory === "otc" && !med.prescriptionRequired)
    return matchesSearch && matchesCategory
  })

  const addToCart = (medication: any, quantity = 30) => {
    const existingItem = cartItems.find((item) => item.id === medication.id)
    if (existingItem) {
      updateCartQuantity(medication.id, existingItem.quantity + quantity)
    } else {
      setCartItems([
        ...cartItems,
        {
          id: medication.id,
          name: medication.name,
          genericName: medication.genericName,
          strength: medication.strength,
          form: medication.form,
          quantity: quantity,
          unitPrice: medication.unitPrice,
          prescriptionRequired: medication.prescriptionRequired,
          inStock: medication.inStock,
          manufacturer: medication.manufacturer,
          expiryDate: medication.expiryDate,
          discount: medication.discount,
        },
      ])
    }
  }

  const removeFromCart = (medicationId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== medicationId))
  }

  const updateCartQuantity = (medicationId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(medicationId)
      return
    }
    setCartItems(cartItems.map((item) => (item.id === medicationId ? { ...item, quantity: newQuantity } : item)))
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.unitPrice * item.quantity, 0)
  }

  const calculateDiscount = () => {
    return cartItems.reduce((total, item) => {
      const itemTotal = item.unitPrice * item.quantity
      return total + (itemTotal * (item.discount || 0)) / 100
    }, 0)
  }

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.12 // 12% GST
  }

  const calculateDeliveryFee = () => {
    const subtotal = calculateSubtotal()
    return subtotal >= 500 ? 0 : 50 // Free delivery for orders above ₹500
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const discount = calculateDiscount()
    const tax = calculateTax(subtotal - discount)
    const delivery = deliveryMethod === "delivery" ? calculateDeliveryFee() : 0
    return subtotal - discount + tax + delivery
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Please add items to cart before checkout")
      return
    }

    const hasRxItems = cartItems.some((item) => item.prescriptionRequired)
    if (hasRxItems) {
      alert("Prescription required items detected. Please upload valid prescription during checkout.")
    }

    // Simulate order placement
    const orderData = {
      items: cartItems,
      deliveryMethod,
      paymentMethod,
      deliveryAddress: deliveryMethod === "delivery" ? deliveryAddress : null,
      total: calculateTotal(),
      orderDate: new Date().toISOString(),
      orderId: "ORD" + Date.now(),
    }

    console.log("Order placed:", orderData)
    alert("Order placed successfully! Order ID: " + orderData.orderId)

    // Clear cart and redirect
    setCartItems([])
    router.push("/patient-portal/pharmacy/orders")
  }

  const estimatedDeliveryTime = () => {
    if (deliveryMethod === "pickup") return "Ready for pickup in 2 hours"

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return `Delivery by ${tomorrow.toLocaleDateString()}, 6:00 PM`
  }

  return (
    <PrivateRoute modulePath="admin/patient-portal/pharmacy" action="view">
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pharmacy & Medicine Orders</h1>
            <p className="text-gray-600">Order your medications and healthcare products</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push("/patient-portal/pharmacy/orders")}>
              <Receipt className="h-4 w-4 mr-2" />
              Order History
            </Button>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-gray-600" />
              <Badge className="bg-red-500">{cartItems.length}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Medicine Catalog */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="browse" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="browse">Browse Medicines</TabsTrigger>
                <TabsTrigger value="upload">Upload Prescription</TabsTrigger>
                <TabsTrigger value="refill">Quick Refill</TabsTrigger>
              </TabsList>

              <TabsContent value="browse" className="space-y-4">
                {/* Search and Filters */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Search medicines by name or generic name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full md:w-48">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Medicines</SelectItem>
                          <SelectItem value="prescription">Prescription</SelectItem>
                          <SelectItem value="otc">Over the Counter</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Medicine List */}
                <div className="space-y-3">
                  {filteredMedications.map((medication) => (
                    <Card key={medication.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-start gap-4">
                              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Pill className="h-8 w-8 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold text-gray-900">{medication.name}</h3>
                                    <p className="text-sm text-gray-600">{medication.genericName}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                      <span className="text-sm text-gray-500">{medication.form}</span>
                                      <span className="text-sm text-gray-500">Mfg: {medication.manufacturer}</span>
                                      <div className="flex items-center gap-1">
                                        <span className="text-yellow-500">★</span>
                                        <span className="text-sm text-gray-600">{medication.rating}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg font-semibold text-gray-900">
                                        ₹{(medication.unitPrice * (1 - medication.discount / 100)).toFixed(2)}
                                      </span>
                                      {medication.discount > 0 && (
                                        <span className="text-sm text-gray-500 line-through">
                                          ₹{medication.unitPrice.toFixed(2)}
                                        </span>
                                      )}
                                    </div>
                                    {medication.discount > 0 && (
                                      <Badge className="bg-green-100 text-green-800 text-xs">
                                        {medication.discount}% OFF
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                  <div className="flex items-center gap-4">
                                    {medication.prescriptionRequired && (
                                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                                        Rx Required
                                      </Badge>
                                    )}
                                    {medication.inStock ? (
                                      <Badge className="bg-green-100 text-green-800">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        In Stock ({medication.stockCount})
                                      </Badge>
                                    ) : (
                                      <Badge className="bg-red-100 text-red-800">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        Out of Stock
                                      </Badge>
                                    )}
                                    <span className="text-xs text-gray-500">Exp: {medication.expiryDate}</span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Select defaultValue="30">
                                      <SelectTrigger className="w-20">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="30">30</SelectItem>
                                        <SelectItem value="60">60</SelectItem>
                                        <SelectItem value="90">90</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Button
                                      size="sm"
                                      disabled={!medication.inStock}
                                      onClick={() => addToCart(medication, 30)}
                                      className="bg-blue-600 hover:bg-blue-700"
                                    >
                                      <Plus className="h-4 w-4 mr-1" />
                                      Add to Cart
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="upload" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Prescription</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <div className="space-y-2">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                          <Receipt className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="font-medium">Upload your prescription</h3>
                        <p className="text-sm text-gray-600">
                          Upload a clear photo of your prescription. We'll process it and add medicines to your cart.
                        </p>
                        <Button className="mt-4">Choose File</Button>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      <h4 className="font-medium mb-2">Guidelines for uploading prescription:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Image should be clear and readable</li>
                        <li>All four corners of the prescription should be visible</li>
                        <li>Doctor's name and signature should be clearly visible</li>
                        <li>Prescription should be dated within the last 6 months</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="refill" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Refill</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-gray-600">Reorder your previous prescriptions with just one click.</p>
                      <div className="space-y-3">
                        {["Metformin 500mg", "Lisinopril 10mg"].map((med, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <Checkbox />
                              <div>
                                <p className="font-medium">{med}</p>
                                <p className="text-sm text-gray-600">Last ordered: 15 days ago</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                addToCart(
                                  availableMedications.find((m) => m.name.includes(med.split(" ")[0])) ||
                                    availableMedications[0],
                                )
                              }
                            >
                              Add to Cart
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button className="w-full bg-green-600 hover:bg-green-700">Add Selected to Cart</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Cart & Checkout */}
          <div className="space-y-6">
            {/* Cart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                  Cart ({cartItems.length} items)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>Your cart is empty</p>
                    </div>
                  ) : (
                    <>
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                            <Pill className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <p className="text-xs text-gray-600">{item.genericName}</p>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 w-6 p-0 bg-transparent"
                                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-sm font-medium">{item.quantity}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 w-6 p-0 bg-transparent"
                                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 text-red-600"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-gray-500">₹{item.unitPrice} each</span>
                              <span className="text-sm font-semibold">
                                ₹{(item.unitPrice * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Delivery & Pickup */}
            {cartItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-green-600" />
                    Delivery Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="delivery"
                        value="delivery"
                        checked={deliveryMethod === "delivery"}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Home Delivery</span>
                        </div>
                        <p className="text-sm text-gray-600">Delivered to your doorstep</p>
                        <p className="text-xs text-blue-600">{estimatedDeliveryTime()}</p>
                      </div>
                      <span className="text-sm font-medium">₹{calculateDeliveryFee()}</span>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="delivery"
                        value="pickup"
                        checked={deliveryMethod === "pickup"}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Store className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">Store Pickup</span>
                        </div>
                        <p className="text-sm text-gray-600">Pick up from nearest store</p>
                        <p className="text-xs text-blue-600">Ready in 2 hours</p>
                      </div>
                      <span className="text-sm font-medium text-green-600">Free</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Summary */}
            {cartItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-purple-600" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span>₹{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    {calculateDiscount() > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-₹{calculateDiscount().toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>GST (12%)</span>
                      <span>₹{calculateTax(calculateSubtotal() - calculateDiscount()).toFixed(2)}</span>
                    </div>
                    {deliveryMethod === "delivery" && (
                      <div className="flex justify-between text-sm">
                        <span>Delivery Fee</span>
                        <span>{calculateDeliveryFee() === 0 ? "Free" : `₹${calculateDeliveryFee()}`}</span>
                      </div>
                    )}
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment & Checkout */}
            {cartItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Pay Online (UPI/Card)</SelectItem>
                        <SelectItem value="cod">Cash on Delivery</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button className="w-full bg-green-600 hover:bg-green-700 h-12" onClick={handleCheckout}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Place Order - ₹{calculateTotal().toFixed(2)}
                    </Button>

                    <p className="text-xs text-gray-600 text-center">
                      By placing this order, you agree to our terms and conditions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      </div>
    </PrivateRoute>
  )
}

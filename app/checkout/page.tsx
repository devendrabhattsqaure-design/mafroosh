"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Check, Loader2, CreditCard, Wallet } from "lucide-react"
import { useCartItems, useCartSubtotal, useCartActions } from "@/store/cartStore"
import AnimatedSection from "@/components/AnimatedSection"
import { useRouter } from "next/navigation"
import { toast } from 'react-hot-toast'

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartItems()
  const subtotal = useCartSubtotal()
  const { clearCart } = useCartActions()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderData, setOrderData] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  })

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ;

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    
    return () => {
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
      if (existingScript) {
        document.body.removeChild(existingScript)
      }
    }
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const calculateTotal = () => {
    const shipping = subtotal >= 5000 ? 0 : 100
    const tax = Math.round(subtotal * 0.18)
    return subtotal + shipping + tax
  }

  const handleRazorpayPayment = async () => {
    try {
      setIsSubmitting(true)

      // Step 1: Create Razorpay order
      const orderResponse = await fetch(`${API_BASE_URL}/website-payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: calculateTotal(),
          customer: {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            phone: formData.phone
          }
        })
      })

      const orderData = await orderResponse.json()

      if (!orderData.success) {
        throw new Error('Failed to initialize payment')
      }

      // Step 2: Open Razorpay checkout
      const options = {
        key: orderData.data.key_id,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'Your Store Name',
        description: 'Payment for order',
        order_id: orderData.data.order_id,
        handler: async (response) => {
          try {
            // Step 3: Verify payment
            const verifyResponse = await fetch(`${API_BASE_URL}/website-payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            })

            const verifyData = await verifyResponse.json()

            if (!verifyData.success) {
              throw new Error('Payment verification failed')
            }

            // Step 4: Create order only after successful payment
            const createOrderResponse = await fetch(`${API_BASE_URL}/website-payment/create-order-after-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
                customer_email: formData.email,
                customer_phone: formData.phone,
                customer_address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zipCode}, ${formData.country}`,
                items: items.map(item => ({
                  product_id: item.id,
                  quantity: item.quantity,
                  price: item.price
                })),
                payment_method: 'razorpay',
                notes: 'Order placed from website',
                org_id: 1,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: calculateTotal()
              })
            })

            const orderResult = await createOrderResponse.json()

            if (orderResult.success) {
              setOrderData(orderResult.data)
              setOrderPlaced(true)
              clearCart()
              toast.success('Payment successful! Order placed.')
            } else {
              throw new Error('Failed to create order')
            }
          } catch (error) {
            console.error('Error in payment handler:', error)
            toast.error('Payment failed. Please try again.')
            setIsSubmitting(false)
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false)
            toast.error('Payment cancelled')
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (error) {
      console.error('Razorpay error:', error)
      toast.error('Payment failed. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleCodOrder = async () => {
    try {
      setIsSubmitting(true)

      const response = await fetch(`${API_BASE_URL}/website-payment/cod-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
          customer_email: formData.email,
          customer_phone: formData.phone,
          customer_address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zipCode}, ${formData.country}`,
          items: items.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price
          })),
          notes: 'Order placed from website',
          org_id: 1
        })
      })

      const data = await response.json()

      if (data.success) {
        setOrderData(data.data)
        setOrderPlaced(true)
        clearCart()
        toast.success('Order placed successfully!')
      } else {
        throw new Error(data.message || 'Failed to place order')
      }
    } catch (error: any) {
      console.error('COD order error:', error)
      toast.error(error.message || 'Failed to place order')
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (paymentMethod === 'razorpay') {
      await handleRazorpayPayment()
    } else {
      await handleCodOrder()
    }
  }

  if (orderPlaced && orderData) {
    return (
      <div className="min-h-screen bg-background py-20 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
              <Check className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground mb-2">
            Thank you for your order, {formData.firstName}!
          </p>
          <p className="text-muted-foreground mb-4">
            Order Number: <span className="font-bold text-primary">#{orderData.order_number}</span>
          </p>
          <p className="text-muted-foreground mb-2">
            Payment Method: <span className="font-semibold">{paymentMethod === 'razorpay' ? 'Online Payment' : 'Cash on Delivery'}</span>
          </p>
          <p className="text-muted-foreground mb-8">
            We've sent a confirmation email to {formData.email}. 
            You can track your order status using the link below.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row justify-center">
            <Link
              href={`/track-order/${orderData.order_number}`}
              className="rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Track Your Order
            </Link>
            <Link
              href="/products"
              className="rounded-lg border-2 border-primary px-8 py-3 font-semibold text-primary hover:bg-primary/10"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!items.length && !orderPlaced) {
    router.push("/products")
    return null
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection className="mb-12">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
            Checkout
          </h1>
        </AnimatedSection>

        <div className="grid gap-8 lg:grid-cols-3">
          <AnimatedSection className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="rounded-lg bg-card p-6 border border-border">
                <h2 className="font-serif text-lg font-semibold text-foreground mb-4">
                  Personal Information
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary sm:col-span-2"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary sm:col-span-2"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="rounded-lg bg-card p-6 border border-border">
                <h2 className="font-serif text-lg font-semibold text-foreground mb-4">
                  Shipping Address
                </h2>
                <div className="grid gap-4">
                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State / Province"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="Postal Code"
                      required
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option>India</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Canada</option>
                      <option>Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-lg bg-card p-6 border border-border">
                <h2 className="font-serif text-lg font-semibold text-foreground mb-4">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-primary"
                    />
                    <Wallet className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-gray-500">Pay when you receive your order</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-primary"
                    />
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Pay Online (Razorpay)</p>
                      <p className="text-sm text-gray-500">Credit/Debit card, UPI, NetBanking</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="w-full rounded-lg bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  paymentMethod === 'razorpay' ? 'Pay Online' : 'Place Order (COD)'
                )}
              </button>
            </form>
          </AnimatedSection>

          {/* Order Summary Sidebar */}
          <AnimatedSection delay={100}>
            <div className="rounded-lg bg-card p-6 border border-border sticky top-6">
              <h2 className="font-serif text-lg font-semibold text-foreground mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-bold text-primary mt-1">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border mb-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-foreground">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold text-foreground">
                    {subtotal >= 5000 ? 'Free' : '₹100'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (18% GST)</span>
                  <span className="font-semibold text-foreground">
                    ₹{Math.round(subtotal * 0.18).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="mt-4 border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-lg text-primary">
                    ₹{calculateTotal().toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
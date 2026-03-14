"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  ArrowLeft, 
  Check, 
  Loader2, 
  CreditCard, 
  Wallet, 
  User, 
  MapPin, 
  ShieldCheck, 
  ChevronRight,
  Info
} from "lucide-react"
import { useCartItems, useCartSubtotal, useCartActions } from "@/store/cartStore"
import AnimatedSection from "@/components/AnimatedSection"
import { useRouter } from "next/navigation"
import { toast } from 'react-hot-toast'

declare global {
  interface Window {
    Razorpay: any;
  }
}

type Step = 'information' | 'payment' | 'confirmation';

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartItems()
  const subtotal = useCartSubtotal()
  const { clearCart } = useCartActions()
  
  const [currentStep, setCurrentStep] = useState<Step>('information')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderData, setOrderData] = useState<any>(null)
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

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

  const totals = useMemo(() => {
    const shipping = subtotal >= 5000 ? 0 : 100
    const tax = Math.round(subtotal * 0.18)
    const total = subtotal + shipping + tax
    return { shipping, tax, total }
  }, [subtotal])

  const validateInformation = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode']
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(`Please fill in your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`)
        return false
      }
    }
    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address')
      return false
    }
    return true
  }

  const handleRazorpayPayment = async () => {
    try {
      setIsSubmitting(true)

      const orderResponse = await fetch(`${API_BASE_URL}/website-payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totals.total,
          customer: {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            phone: formData.phone
          }
        })
      })

      const checkoutOrder = await orderResponse.json()

      if (!checkoutOrder.success) {
        throw new Error('Failed to initialize payment')
      }

      const options = {
        key: checkoutOrder.data.key_id,
        amount: checkoutOrder.data.amount,
        currency: checkoutOrder.data.currency,
        name: 'Mafroosh',
        description: 'Luxury Furniture Purchase',
        order_id: checkoutOrder.data.order_id,
        handler: async (response: any) => {
          try {
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
                amount: totals.total
              })
            })

            const orderResult = await createOrderResponse.json()

            if (orderResult.success) {
              setOrderData(orderResult.data)
              setOrderPlaced(true)
              setCurrentStep('confirmation')
              clearCart()
              toast.success('Payment successful! Your order has been placed.')
            } else {
              throw new Error('Failed to create order')
            }
          } catch (error) {
            console.error('Error in payment handler:', error)
            toast.error('Something went wrong during final order processing.')
            setIsSubmitting(false)
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#1A1212'
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
      toast.error('Payment initialization failed. Please try again.')
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
        setCurrentStep('confirmation')
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
    if (currentStep === 'information') {
      if (validateInformation()) {
        setCurrentStep('payment')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else if (currentStep === 'payment') {
      if (paymentMethod === 'razorpay') {
        await handleRazorpayPayment()
      } else {
        await handleCodOrder()
      }
    }
  }

  if (orderPlaced && orderData) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] py-20 px-6">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <div className="mb-10 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-secondary/20 h-20 w-20"></div>
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-secondary shadow-xl">
                <ShieldCheck className="h-10 w-10 text-secondary-foreground" />
              </div>
            </div>
          </div>
          <h1 className="font-serif text-4xl font-bold text-primary mb-6">
            Thank you for choosing Mafroosh.
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Your sanctuary is one step closer. We've received your order and our artisans are beginning their work.
          </p>
          
          <div className="rounded-2xl border border-border bg-white p-8 shadow-sm mb-12 text-left">
            <h3 className="font-bold text-primary uppercase tracking-widest text-xs mb-6 border-b pb-4">Order Details</h3>
            <div className="grid gap-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground font-medium">Order Number</span>
                <span className="text-sm font-bold text-primary">#{orderData.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground font-medium">Status</span>
                <span className="text-xs font-bold uppercase py-1 px-3 rounded-full bg-green-100 text-green-700">Confirmed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground font-medium">Recipient</span>
                <span className="text-sm font-semibold text-primary">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex justify-between border-t pt-4">
                <span className="text-sm text-primary font-bold">Total Amount</span>
                <span className="text-lg font-bold text-secondary">₹{totals.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row justify-center">
            <Link
              href={`/track-order/${orderData.order_number}`}
              className="group flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 font-bold text-primary-foreground shadow-lg transition-all hover:bg-secondary hover:text-secondary-foreground hover:scale-105"
            >
              Track Your Haven
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/products"
              className="flex items-center justify-center rounded-xl border border-primary/20 bg-white px-8 py-4 font-bold text-primary transition-all hover:bg-muted"
            >
              Continue Exploring
            </Link>
          </div>
        </AnimatedSection>
      </div>
    )
  }

  if (!items.length && !orderPlaced) {
    router.push("/products")
    return null
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)] py-12 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header & Stepper */}
        <div className="mb-12 text-center">
          <AnimatedSection>
            <button
              onClick={() => {
                if (currentStep === 'payment') setCurrentStep('information')
                else router.back()
              }}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary mb-8"
            >
              <ArrowLeft className="h-3 w-3" />
              Go Back
            </button>
            <h1 className="font-serif text-4xl font-bold text-primary md:text-5xl mb-12">
              Secure Checkout
            </h1>

            {/* Steps Visualizer */}
            <div className="relative mx-auto flex max-w-xl items-center justify-between">
              <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-border md:block hidden"></div>
              
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-500 bg-white ${currentStep !== 'confirmation' ? 'border-secondary bg-secondary text-secondary-foreground shadow-lg scale-110' : 'border-border text-muted-foreground'}`}>
                  <User className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Information</span>
              </div>

              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-500 bg-white ${currentStep === 'payment' ? 'border-secondary bg-secondary text-secondary-foreground shadow-lg scale-110' : 'border-border text-muted-foreground'}`}>
                  <CreditCard className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Payment</span>
              </div>

              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-white transition-all duration-500 text-muted-foreground`}>
                  <Check className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Completion</span>
              </div>
            </div>
          </AnimatedSection>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 items-start">
          <div className="lg:col-span-8 space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {currentStep === 'information' && (
                <AnimatedSection className="space-y-8">
                  {/* Personal Details */}
                  <div className="rounded-3xl bg-white p-8 border border-border/40 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/5 text-primary">
                        <User className="h-5 w-5" />
                      </div>
                      <h2 className="font-serif text-2xl font-bold text-primary">Contact information</h2>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          placeholder="Julian"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-border bg-background px-5 py-3.5 text-sm font-medium transition-all focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Auer"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-border bg-background px-5 py-3.5 text-sm font-medium transition-all focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          placeholder="julian@example.com"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-border bg-background px-5 py-3.5 text-sm font-medium transition-all focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none"
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+91 98765 43210"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-border bg-background px-5 py-3.5 text-sm font-medium transition-all focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="rounded-3xl bg-white p-8 border border-border/40 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/5 text-primary">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <h2 className="font-serif text-2xl font-bold text-primary">Shipping destination</h2>
                    </div>
                    <div className="grid gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Street Address</label>
                        <input
                          type="text"
                          name="address"
                          placeholder="Apartment, suite, unit, etc."
                          required
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-border bg-background px-5 py-3.5 text-sm font-medium transition-all focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none"
                        />
                      </div>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">City</label>
                          <input
                            type="text"
                            name="city"
                            placeholder="Lucknow"
                            required
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full rounded-xl border border-border bg-background px-5 py-3.5 text-sm font-medium transition-all focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">State</label>
                          <input
                            type="text"
                            name="state"
                            placeholder="Uttar Pradesh"
                            required
                            value={formData.state}
                            onChange={handleInputChange}
                            className="w-full rounded-xl border border-border bg-background px-5 py-3.5 text-sm font-medium transition-all focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Postal Code</label>
                          <input
                            type="text"
                            name="zipCode"
                            placeholder="226022"
                            required
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            className="w-full rounded-xl border border-border bg-background px-5 py-3.5 text-sm font-medium transition-all focus:border-secondary focus:ring-4 focus:ring-secondary/5 outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Country</label>
                          <select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full rounded-xl border border-border bg-background px-5 py-3.5 text-sm font-medium appearance-none outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 cursor-pointer"
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
                  </div>

                  <button
                    type="submit"
                    className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-5 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-xl transition-all hover:bg-secondary hover:text-secondary-foreground hover:scale-[1.02]"
                  >
                    Proceed to Payment
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </AnimatedSection>
              )}

              {currentStep === 'payment' && (
                <AnimatedSection className="space-y-8">
                  <div className="rounded-3xl bg-white p-8 border border-border/40 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/5 text-primary">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <h2 className="font-serif text-2xl font-bold text-primary">Payment details</h2>
                    </div>
                    
                    <div className="grid gap-6">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('razorpay')}
                        className={`group relative flex items-center justify-between gap-4 rounded-2xl border-2 p-6 transition-all text-left ${
                          paymentMethod === 'razorpay' 
                            ? "border-secondary bg-secondary/5 shadow-inner" 
                            : "border-border hover:border-primary/20 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${paymentMethod === 'razorpay' ? 'bg-secondary text-primary' : 'bg-muted text-muted-foreground'}`}>
                            <CreditCard className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-bold text-primary">Online Secure Payment</p>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">Credit/Debit Card, UPI, NetBanking</p>
                          </div>
                        </div>
                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'razorpay' ? 'border-secondary bg-secondary' : 'border-border'}`}>
                          {paymentMethod === 'razorpay' && <Check className="h-3 w-3 text-secondary-foreground font-black" />}
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`group relative flex items-center justify-between gap-4 rounded-2xl border-2 p-6 transition-all text-left ${
                          paymentMethod === 'cod' 
                            ? "border-secondary bg-secondary/5 shadow-inner" 
                            : "border-border hover:border-primary/20 bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${paymentMethod === 'cod' ? 'bg-secondary text-primary' : 'bg-muted text-muted-foreground'}`}>
                            <Wallet className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-bold text-primary">Cash on Delivery</p>
                            <p className="text-xs text-muted-foreground mt-1 font-medium">Pay securely at your doorstep</p>
                          </div>
                        </div>
                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-secondary bg-secondary' : 'border-border'}`}>
                          {paymentMethod === 'cod' && <Check className="h-3 w-3 text-secondary-foreground font-black" />}
                        </div>
                      </button>
                    </div>

                    <div className="mt-8 rounded-2xl bg-primary/5 p-6 flex items-start gap-3">
                      <Info className="h-5 w-5 text-primary mt-1 shrink-0" />
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        Your transaction is encrypted and secure. By placing this order, you agree to Mafroosh's 
                        <Link href="/terms" className="text-primary hover:underline font-semibold mx-1">Terms of Service</Link> 
                        and 
                        <Link href="/privacy" className="text-primary hover:underline font-semibold mx-1">Privacy Policy</Link>.
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-5 text-sm font-bold uppercase tracking-widest text-primary-foreground shadow-xl transition-all hover:bg-secondary hover:text-secondary-foreground hover:scale-[1.02] disabled:opacity-70 disabled:filter disabled:grayscale"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-5 w-5" />
                        Place Your Order
                      </>
                    )}
                  </button>
                </AnimatedSection>
              )}
            </form>
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-10">
            <AnimatedSection delay={200} className="space-y-6">
              <div className="rounded-3xl bg-white p-8 border border-border/40 shadow-soft">
                <h3 className="font-serif text-2xl font-bold text-primary mb-8">Purchase Summary</h3>
                
                <div className="space-y-6 mb-8 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.id} className="group flex items-center gap-4">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-muted shadow-sm transition-transform group-hover:scale-105">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-primary line-clamp-1 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-semibold mt-1">
                          Collection Item • ×{item.quantity}
                        </p>
                        <p className="text-sm font-bold text-secondary mt-2">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-8 border-t border-dashed">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium italic">Net Total</span>
                    <span className="font-semibold text-primary">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium italic">Handcrafted Delivery</span>
                    <span className={`font-semibold ${totals.shipping === 0 ? 'text-secondary' : 'text-primary'}`}>
                      {totals.shipping === 0 ? 'Complimentary' : `₹${totals.shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium italic">Government Taxes</span>
                    <span className="font-semibold text-primary">₹{totals.tax.toLocaleString("en-IN")}</span>
                  </div>
                  
                  <div className="mt-8 rounded-2xl bg-secondary p-6 shadow-lg shadow-secondary/20">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-secondary-foreground opacity-80">Final Total</span>
                      <span className="text-2xl font-black text-secondary-foreground font-serif">
                        ₹{totals.total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white p-4 border border-border/40 text-center flex flex-col items-center gap-2">
                  <ShieldCheck className="h-6 w-6 text-secondary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Secure SSL</span>
                </div>
                <div className="rounded-2xl bg-white p-4 border border-border/40 text-center flex flex-col items-center gap-2">
                   <div className="flex -space-x-1">
                      <div className="h-5 w-5 rounded-full bg-blue-500 border border-white"></div>
                      <div className="h-5 w-5 rounded-full bg-red-500 border border-white"></div>
                   </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Encrypted</span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </div>
  )
}
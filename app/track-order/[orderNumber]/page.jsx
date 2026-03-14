// app/track-order/[orderNumber]/page.jsx
"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { 
  Package, 
  CheckCircle, 
  Clock, 
  Truck, 
  XCircle,
  ArrowLeft,
  Loader2 
} from "lucide-react"

export default function TrackOrderPage() {
  const { orderNumber } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL 

  useEffect(() => {
    fetchOrderDetails()
  }, [orderNumber])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      // Use public endpoint - no authentication
      const response = await fetch(`${API_BASE_URL}/public/orders/track/${orderNumber}`)
      
      if (response.ok) {
        const data = await response.json()
        setOrder(data.data)
      } else {
        setError('Order not found')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      setError('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <Clock className="w-6 h-6 text-yellow-500" />
      case 'confirmed': return <CheckCircle className="w-6 h-6 text-blue-500" />
      case 'processing': return <Package className="w-6 h-6 text-purple-500" />
      case 'shipped': return <Truck className="w-6 h-6 text-indigo-500" />
      case 'delivered': return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'cancelled': return <XCircle className="w-6 h-6 text-red-500" />
      default: return <Package className="w-6 h-6 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      case 'shipped': return 'bg-indigo-100 text-indigo-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusMessage = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'Your order has been placed and is awaiting confirmation.'
      case 'confirmed': return 'Your order has been confirmed and will be processed soon.'
      case 'processing': return 'Your order is being prepared for shipment.'
      case 'shipped': return 'Your order has been shipped and is on its way.'
      case 'delivered': return 'Your order has been delivered successfully.'
      case 'cancelled': return 'Your order has been cancelled.'
      default: return 'Status update pending.'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || "The order you're looking for doesn't exist."}
          </p>
          <Link
            href="/"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90"
          >
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            Track Your Order
          </h1>
          <p className="text-muted-foreground">
            Order Number: <span className="font-bold text-primary">#{order.order_number}</span>
          </p>
        </div>

        {/* Order Status Card */}
        <div className="bg-white rounded-lg shadow-lg border p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-3 rounded-full ${getStatusColor(order.order_status)}`}>
              {getStatusIcon(order.order_status)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Order Status: {order.order_status?.toUpperCase()}
              </h2>
              <p className="text-muted-foreground">
                {getStatusMessage(order.order_status)}
              </p>
            </div>
          </div>

          {/* Status Timeline */}
     

{/* Status Timeline with Timestamps */}
<div className="mt-8">
  <h3 className="font-semibold text-foreground mb-4">Order Timeline</h3>
  <div className="space-y-4">
    {/* Order Placed - Always visible */}
    <div className="flex gap-3">
      <div className="relative">
        <div className="w-3 h-3 rounded-full bg-green-500 mt-1.5"></div>
        {order.order_status !== 'cancelled' && order.order_status !== 'delivered' && (
          <div className="absolute top-4 left-1.5 w-0.5 h-12 bg-gray-300 -translate-x-1/2"></div>
        )}
      </div>
      <div>
        <p className="font-medium text-foreground">Order Placed</p>
        <p className="text-sm text-muted-foreground">
          {new Date(order.created_at).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>

    {/* Order Confirmed */}
    <div className="flex gap-3">
      <div className="relative">
        <div className={`w-3 h-3 rounded-full ${order.confirmed_at ? 'bg-green-500' : 'bg-gray-300'} mt-1.5`}></div>
        {order.confirmed_at && order.order_status !== 'cancelled' && order.order_status !== 'delivered' && (
          <div className="absolute top-4 left-1.5 w-0.5 h-12 bg-gray-300 -translate-x-1/2"></div>
        )}
      </div>
      <div>
        <p className="font-medium text-foreground">Order Confirmed</p>
        {order.confirmed_at ? (
          <p className="text-sm text-muted-foreground">
            {new Date(order.confirmed_at).toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Pending confirmation</p>
        )}
      </div>
    </div>

    {/* Order Shipped */}
    <div className="flex gap-3">
      <div className="relative">
        <div className={`w-3 h-3 rounded-full ${order.shipped_at ? 'bg-green-500' : 'bg-gray-300'} mt-1.5`}></div>
        {order.shipped_at && order.order_status !== 'cancelled' && order.order_status !== 'delivered' && (
          <div className="absolute top-4 left-1.5 w-0.5 h-12 bg-gray-300 -translate-x-1/2"></div>
        )}
      </div>
      <div>
        <p className="font-medium text-foreground">Order Shipped</p>
        {order.shipped_at ? (
          <p className="text-sm text-muted-foreground">
            {new Date(order.shipped_at).toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Not shipped yet</p>
        )}
      </div>
    </div>

    {/* Order Delivered */}
    <div className="flex gap-3">
      <div className="relative">
        <div className={`w-3 h-3 rounded-full ${order.delivered_at ? 'bg-green-500' : 'bg-gray-300'} mt-1.5`}></div>
      </div>
      <div>
        <p className="font-medium text-foreground">Order Delivered</p>
        {order.delivered_at ? (
          <p className="text-sm text-muted-foreground">
            {new Date(order.delivered_at).toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Not delivered yet</p>
        )}
      </div>
    </div>

    {/* Order Cancelled (if applicable) */}
    {order.order_status === 'cancelled' && order.cancelled_at && (
      <div className="flex gap-3">
        <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5"></div>
        <div>
          <p className="font-medium text-foreground">Order Cancelled</p>
          <p className="text-sm text-muted-foreground">
            {new Date(order.cancelled_at).toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    )}
  </div>
</div>
        </div>

        {/* Customer Details */}
        <div className="grid gap-8 md:grid-cols-2">
          <div className="bg-white rounded-lg shadow-lg border p-6">
            <h3 className="font-semibold text-lg text-foreground mb-4">Customer Details</h3>
            <div className="space-y-2">
              <p><span className="text-muted-foreground">Name:</span> {order.customer_name}</p>
              <p><span className="text-muted-foreground">Email:</span> {order.customer_email}</p>
              <p><span className="text-muted-foreground">Phone:</span> {order.customer_phone}</p>
              <p><span className="text-muted-foreground">Address:</span> {order.customer_address}</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-lg border p-6">
            <h3 className="font-semibold text-lg text-foreground mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">₹{parseFloat(order.subtotal || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax:</span>
                <span className="font-medium">₹{parseFloat(order.tax_amount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping:</span>
                <span className="font-medium">₹{parseFloat(order.shipping_amount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-primary">₹{parseFloat(order.total_amount || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-8 bg-white rounded-lg shadow-lg border p-6">
          <h3 className="font-semibold text-lg text-foreground mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{item.product_name}</p>
                  <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                  <div className="flex justify-between mt-2">
                    <span>Qty: {item.quantity}</span>
                    <span className="font-medium">₹{parseFloat(item.total_price || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/products"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90"
          >
            Continue Shopping
          </Link>
          <button
            onClick={() => window.print()}
            className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/10"
          >
            Print Details
          </button>
        </div>
      </div>
    </div>
  )
}
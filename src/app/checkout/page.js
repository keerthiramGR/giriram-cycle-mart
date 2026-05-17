"use client";

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Script from 'next/script';
import { CreditCard, Truck, MapPin, Phone, User, Mail, Home, Building, Navigation, Banknote, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart, shippingOption } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    landmark: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
    paymentMethod: 'razorpay',
    deliveryNotes: '',
    useCurrentLocation: false,
  });

  const STATES = ['Tamil Nadu', 'Karnataka', 'Kerala', 'Andhra Pradesh', 'Telangana', 'Maharashtra', 'Delhi', 'Other'];

  const shippingCost = shippingOption === 'express' ? 500 : 0;
  const grandTotal = cartTotal + shippingCost;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    toast.loading('Getting your location...', { id: 'location' });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setForm(f => ({
          ...f,
          useCurrentLocation: true,
          address: `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        }));
        toast.success('Location captured! Please add your full address.', { id: 'location' });
      },
      () => {
        toast.error('Unable to get location. Please enter address manually.', { id: 'location' });
      }
    );
  };

  const processCheckout = async (paymentMethod, paymentDetails = {}) => {
    const shippingAddress = {
      address: form.address,
      landmark: form.landmark,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      deliveryNotes: form.deliveryNotes,
    };

    const cartItems = cart.map(item => ({
      productId: item.id || null,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: form.fullName,
        customerEmail: form.email,
        customerPhone: form.phone,
        shippingAddress,
        paymentMethod,
        cartItems,
        totalAmount: grandTotal,
        shippingCost,
        ...paymentDetails
      }),
    });

    const json = await res.json();
    if (json.error) throw new Error(json.error);
    return json;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Initiating Payment...');

    try {
      if (form.paymentMethod === 'razorpay') {
        if (!window.Razorpay) {
          throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
        }

        // 1. Create order on server
        const orderRes = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: grandTotal }),
        });
        const orderData = await orderRes.json();
        
        if (orderData.error) throw new Error(orderData.error);

        toast.dismiss(toastId);

        // 2. Open Razorpay Interface
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use Razorpay testing key 
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'GIRIRAM CYCLE MART',
          description: 'Secure Checkout Purchase',
          order_id: orderData.id,
          handler: async function (response) {
            const processingToast = toast.loading('Verifying Payment...');
            try {
              const res = await processCheckout('razorpay', {
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id
              });
              toast.success('Payment Successful & Order Placed!', { id: processingToast });
              setOrderId(res.orderRef || res.orderId);
              setOrderPlaced(true);
              clearCart();
            } catch (err) {
              toast.error('Payment verified but order failed. Contact support.', { id: processingToast });
            }
          },
          prefill: {
            name: form.fullName,
            email: form.email,
            contact: form.phone
          },
          theme: {
            color: '#1E40AF'
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          toast.error(`Payment failed: ${response.error.description}`);
          setIsSubmitting(false); // Enable button again
        });
        rzp.open();
        
      } else {
        // COD Route
        const res = await processCheckout('cod');
        toast.success('Order placed successfully!', { id: toastId });
        setOrderId(res.orderRef || res.orderId);
        setOrderPlaced(true);
        clearCart();
      }
    } catch (err) {
      toast.error('Failed to process order: ' + err.message, { id: toastId });
      setIsSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', backgroundColor: 'var(--white)', padding: '3rem', borderRadius: '1.5rem', border: '1px solid var(--border-color)', maxWidth: '500px', width: '100%' }}>
          <div style={{ width: '5rem', height: '5rem', borderRadius: '50%', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle size={40} style={{ color: 'var(--success)' }} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '1rem' }}>Order Placed!</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Thank you for shopping with <strong>GIRIRAM CYCLE MART</strong></p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Your Tracking ID: <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.125rem' }}>{orderId}</span>
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            {form.paymentMethod === 'cod'
              ? 'Pay securely with cash when your order arrives at your doorstep.'
              : 'Your online payment was successful and your order is instantly confirmed!'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/products"><Button>Continue Shopping</Button></Link>
            <Link href="/track"><button className="btn btn-outline" style={{ display: 'flex', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: '1px solid var(--primary)', color: 'var(--primary)', fontWeight: '600' }}>Track Order</button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '3rem 0' }}>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Checkout</h1>
          <p className="page-subtitle">Complete your order delivery details below</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="cart-layout">
            {/* Left - Form Fields */}
            <div className="cart-items" style={{ gap: '0' }}>

              {/* Personal Details */}
              <div className="checkout-box">
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={20} style={{ color: 'var(--primary)' }} /> Personal Details
                </h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <div style={{ position: 'relative' }}>
                      <input name="fullName" type="text" className="form-input" placeholder="John Doe" value={form.fullName} onChange={handleChange} required style={{ paddingLeft: '2.5rem' }} />
                      <User size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <div style={{ position: 'relative' }}>
                      <input name="email" type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required style={{ paddingLeft: '2.5rem' }} />
                      <Mail size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <div style={{ position: 'relative' }}>
                      <input name="phone" type="tel" className="form-input" placeholder="+91 98652 22646" value={form.phone} onChange={handleChange} required style={{ paddingLeft: '2.5rem' }} />
                      <Phone size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="checkout-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={20} style={{ color: 'var(--primary)' }} /> Delivery Address
                  </h2>
                  <button type="button" onClick={handleGetLocation} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', backgroundColor: '#EFF6FF', color: '#1E40AF', fontWeight: '600', fontSize: '0.875rem', border: '1px solid #BFDBFE' }}>
                    <Navigation size={16} /> Use Current Location
                  </button>
                </div>
                <div className="form-grid">
                  <div className="form-group focus-full">
                    <label className="form-label">Street Address *</label>
                    <div style={{ position: 'relative' }}>
                      <input name="address" type="text" className="form-input" placeholder="House No, Street, Area" value={form.address} onChange={handleChange} required style={{ paddingLeft: '2.5rem' }} />
                      <Home size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Landmark</label>
                    <input name="landmark" type="text" className="form-input" placeholder="Near temple, opposite school..." value={form.landmark} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <div style={{ position: 'relative' }}>
                      <input name="city" type="text" className="form-input" placeholder="Gobichettipalayam" value={form.city} onChange={handleChange} required style={{ paddingLeft: '2.5rem' }} />
                      <Building size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <select name="state" className="form-input" value={form.state} onChange={handleChange} required style={{ backgroundColor: 'white' }}>
                      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">PIN Code *</label>
                    <input name="pincode" type="text" className="form-input" placeholder="638452" value={form.pincode} onChange={handleChange} required maxLength={6} pattern="[0-9]{6}" />
                  </div>
                </div>
              </div>

              {/* Delivery Notes */}
              <div className="checkout-box">
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Truck size={20} style={{ color: 'var(--primary)' }} /> Delivery Instructions
                </h2>
                <div className="form-group">
                  <label className="form-label">Special Instructions (optional)</label>
                  <textarea name="deliveryNotes" className="form-input" rows={3} placeholder="e.g., Call before delivery, leave at gate, preferred time..." value={form.deliveryNotes} onChange={handleChange} style={{ resize: 'vertical' }} />
                </div>
              </div>

              {/* Payment Method */}
              <div className="checkout-box" style={{ paddingBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={20} style={{ color: 'var(--primary)' }} /> Secure Payment
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                  {/* Razorpay Online */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', borderRadius: '0.75rem', border: form.paymentMethod === 'razorpay' ? '2px solid var(--primary)' : '1px solid var(--border-color)', backgroundColor: form.paymentMethod === 'razorpay' ? '#EFF6FF' : 'var(--white)', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <input type="radio" name="paymentMethod" value="razorpay" checked={form.paymentMethod === 'razorpay'} onChange={handleChange} style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} />
                    <div style={{ width: '44px', height: '44px', borderRadius: '0.75rem', backgroundColor: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CreditCard size={24} style={{ color: '#1E40AF' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '700', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Pay Online Instantly</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Credit/Debit Cards, UPI, NetBanking, Wallets</p>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', borderRadius: '0.75rem', border: form.paymentMethod === 'cod' ? '2px solid var(--primary)' : '1px solid var(--border-color)', backgroundColor: form.paymentMethod === 'cod' ? '#FFF7ED' : 'var(--white)', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <input type="radio" name="paymentMethod" value="cod" checked={form.paymentMethod === 'cod'} onChange={handleChange} style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} />
                    <div style={{ width: '44px', height: '44px', borderRadius: '0.75rem', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Banknote size={24} style={{ color: '#B45309' }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: '700', color: 'var(--secondary)' }}>Cash on Delivery (COD)</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Pay when your order arrives at your doorstep</p>
                    </div>
                  </label>

                </div>
              </div>
            </div>

            {/* Right - Order Summary */}
            <div className="cart-summary" style={{ position: 'sticky', top: '6rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '1.5rem' }}>Order Summary</h2>
              
              {cart.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>Your cart is empty</p>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', maxHeight: '250px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                    {cart.map((item) => (
                      <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '0.5rem', overflow: 'hidden', backgroundColor: '#F1F5F9', flexShrink: 0 }}>
                          {item.primary_image_url && <img src={item.primary_image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</p>
                        </div>
                        <p style={{ fontWeight: '700', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>

                  <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
                  <div className="summary-row"><span>Shipping ({shippingOption === 'express' ? 'Express' : 'Standard'})</span><span style={{ color: shippingCost === 0 ? 'var(--success)' : undefined }}>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span></div>
                  <div className="summary-total"><span>Grand Total</span><span style={{ color: 'var(--primary)' }}>₹{grandTotal.toLocaleString('en-IN')}</span></div>

                  <Button type="submit" className="btn-full" disabled={isSubmitting || cart.length === 0} style={{ padding: '1rem', fontSize: '1.125rem', fontWeight: '700' }}>
                    {isSubmitting ? 'Processing...' : (form.paymentMethod === 'razorpay' ? `Pay Securely • ₹${grandTotal.toLocaleString('en-IN')}` : `Place COD Order • ₹${grandTotal.toLocaleString('en-IN')}`)}
                  </Button>

                  <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Your payment details are fully encrypted and secure.
                  </p>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { CreditCard, Truck, MapPin, Phone, User, Mail, Home, Building, Navigation, Banknote, Smartphone, CheckCircle, Upload, ImageIcon, Landmark, Copy, CheckCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const UPI_ID = 'ramprakashgobi@oksbi';
const UPI_NAME = 'Ramprakashgobi Ramprakash';

const BANK_DETAILS = {
  accountHolder: 'GIRIRAM CYCLE MART',
  bankName: 'State Bank of India',
  accountNumber: '1234567890',
  ifsc: 'SBIN0001234',
  branch: 'Central Market Branch',
};

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [paymentScreenshotPreview, setPaymentScreenshotPreview] = useState(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    landmark: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
    paymentMethod: 'cod',
    deliveryNotes: '',
    useCurrentLocation: false,
  });

  const STATES = ['Tamil Nadu', 'Karnataka', 'Kerala', 'Andhra Pradesh', 'Telangana', 'Maharashtra', 'Delhi', 'Other'];

  const shippingCost = cartTotal > 5000 ? 0 : 149;
  const grandTotal = cartTotal + shippingCost;

  const upiPaymentString = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${grandTotal}&cu=INR`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Reset screenshot when payment method changes
    if (name === 'paymentMethod') {
      setPaymentScreenshot(null);
      setPaymentScreenshotPreview(null);
    }
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

  const handleScreenshotUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file (JPG, PNG, etc.)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be under 5MB');
        return;
      }
      setPaymentScreenshot(file);
      setPaymentScreenshotPreview(URL.createObjectURL(file));
      toast.success('Payment screenshot uploaded!');
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    toast.success('UPI ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    if ((form.paymentMethod === 'upi' || form.paymentMethod === 'bank') && !paymentScreenshot) {
      toast.error('Please upload your payment screenshot as proof before placing the order.');
      return;
    }
    setIsSubmitting(true);
    const toastId = toast.loading('Placing your order...');
    try {
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
          paymentMethod: form.paymentMethod,
          cartItems,
          totalAmount: grandTotal,
          shippingCost,
        }),
      });

      const json = await res.json();
      if (json.error) throw new Error(json.error);

      toast.success('Order placed successfully!', { id: toastId });
      setOrderId(json.orderRef || json.orderId);
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      toast.error('Failed to place order: ' + err.message, { id: toastId });
    } finally {
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
            Your Order ID: <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.125rem' }}>{orderId}</span>
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            {form.paymentMethod === 'cod'
              ? 'Pay when your order arrives at your doorstep.'
              : form.paymentMethod === 'upi'
              ? 'Your UPI payment screenshot has been submitted. We will verify and confirm shortly.'
              : 'Your bank transfer screenshot has been submitted. We will verify and confirm shortly.'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/products"><Button>Continue Shopping</Button></Link>
            <Link href="/"><button className="btn btn-outline">Go Home</button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '3rem 0' }}>
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Checkout</h1>
          <p className="page-subtitle">Complete your order details below</p>
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
                      <input name="phone" type="tel" className="form-input" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} required style={{ paddingLeft: '2.5rem' }} />
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
                      <input name="city" type="text" className="form-input" placeholder="Bangalore" value={form.city} onChange={handleChange} required style={{ paddingLeft: '2.5rem' }} />
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
                    <input name="pincode" type="text" className="form-input" placeholder="560001" value={form.pincode} onChange={handleChange} required maxLength={6} pattern="[0-9]{6}" />
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
              <div className="checkout-box">
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CreditCard size={20} style={{ color: 'var(--primary)' }} /> Payment Method
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

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

                  {/* UPI / GPay - with QR Code */}
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', borderRadius: '0.75rem', border: form.paymentMethod === 'upi' ? '2px solid var(--primary)' : '1px solid var(--border-color)', backgroundColor: form.paymentMethod === 'upi' ? '#FFF7ED' : 'var(--white)', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <input type="radio" name="paymentMethod" value="upi" checked={form.paymentMethod === 'upi'} onChange={handleChange} style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} />
                      <div style={{ width: '44px', height: '44px', borderRadius: '0.75rem', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Smartphone size={24} style={{ color: '#1E40AF' }} />
                      </div>
                      <div>
                        <p style={{ fontWeight: '700', color: 'var(--secondary)' }}>UPI / Google Pay / PhonePe</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Scan QR code and pay instantly</p>
                      </div>
                    </label>

                    {/* UPI Expanded - QR Code */}
                    {form.paymentMethod === 'upi' && (
                      <div className="payment-expanded">
                        <div className="payment-qr-section">
                          <p style={{ fontWeight: '700', color: 'var(--secondary)', fontSize: '1rem' }}>Scan to Pay ₹{grandTotal.toLocaleString('en-IN')}</p>
                          <div style={{ borderRadius: '1rem', overflow: 'hidden', border: '3px solid #e5e7eb', display: 'inline-block' }}>
                            <Image src="/payment-qr.jpg" alt="GPay QR Code" width={200} height={200} style={{ display: 'block' }} />
                          </div>
                          <p className="payment-qr-label">Open GPay / PhonePe / Paytm and scan this QR code</p>
                          <div className="payment-qr-upi-id">
                            <Smartphone size={16} />
                            <span>{UPI_ID}</span>
                            <button type="button" onClick={handleCopyUpi} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1E40AF', display: 'flex', alignItems: 'center' }}>
                              {copied ? <CheckCheck size={16} /> : <Copy size={16} />}
                            </button>
                          </div>
                        </div>

                        {/* Screenshot Upload */}
                        <div
                          className={`screenshot-upload-area ${paymentScreenshot ? 'has-file' : ''}`}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleScreenshotUpload}
                          />
                          <div className="screenshot-upload-icon">
                            {paymentScreenshot ? <CheckCircle size={24} /> : <Upload size={24} />}
                          </div>
                          <p className="screenshot-upload-text">
                            {paymentScreenshot
                              ? <><strong>✓ Screenshot uploaded:</strong> {paymentScreenshot.name}</>
                              : <><strong>Upload payment screenshot</strong> as proof of payment</>
                            }
                          </p>
                          {paymentScreenshotPreview && (
                            <div className="screenshot-preview">
                              <img src={paymentScreenshotPreview} alt="Payment proof" />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bank Transfer */}
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', borderRadius: '0.75rem', border: form.paymentMethod === 'bank' ? '2px solid var(--primary)' : '1px solid var(--border-color)', backgroundColor: form.paymentMethod === 'bank' ? '#FFF7ED' : 'var(--white)', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <input type="radio" name="paymentMethod" value="bank" checked={form.paymentMethod === 'bank'} onChange={handleChange} style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }} />
                      <div style={{ width: '44px', height: '44px', borderRadius: '0.75rem', backgroundColor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Landmark size={24} style={{ color: '#15803D' }} />
                      </div>
                      <div>
                        <p style={{ fontWeight: '700', color: 'var(--secondary)' }}>Bank Transfer (NEFT / IMPS)</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Transfer to our bank account & upload screenshot</p>
                      </div>
                    </label>

                    {/* Bank Transfer Expanded */}
                    {form.paymentMethod === 'bank' && (
                      <div className="payment-expanded">
                        <div className="bank-details-card">
                          <h4><Landmark size={18} style={{ color: 'var(--primary)' }} /> Bank Account Details</h4>
                          <div className="bank-detail-row">
                            <span className="bank-detail-label">Account Holder</span>
                            <span className="bank-detail-value">{BANK_DETAILS.accountHolder}</span>
                          </div>
                          <div className="bank-detail-row">
                            <span className="bank-detail-label">Bank Name</span>
                            <span className="bank-detail-value">{BANK_DETAILS.bankName}</span>
                          </div>
                          <div className="bank-detail-row">
                            <span className="bank-detail-label">Account Number</span>
                            <span className="bank-detail-value">{BANK_DETAILS.accountNumber}</span>
                          </div>
                          <div className="bank-detail-row">
                            <span className="bank-detail-label">IFSC Code</span>
                            <span className="bank-detail-value">{BANK_DETAILS.ifsc}</span>
                          </div>
                          <div className="bank-detail-row">
                            <span className="bank-detail-label">Branch</span>
                            <span className="bank-detail-value">{BANK_DETAILS.branch}</span>
                          </div>
                          <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#FFF7ED', fontSize: '0.8125rem', color: '#B45309', fontWeight: '500', textAlign: 'center' }}>
                            Transfer exactly <strong>₹{grandTotal.toLocaleString('en-IN')}</strong> to the above account
                          </div>
                        </div>

                        {/* Screenshot Upload */}
                        <div
                          className={`screenshot-upload-area ${paymentScreenshot ? 'has-file' : ''}`}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleScreenshotUpload}
                          />
                          <div className="screenshot-upload-icon">
                            {paymentScreenshot ? <CheckCircle size={24} /> : <Upload size={24} />}
                          </div>
                          <p className="screenshot-upload-text">
                            {paymentScreenshot
                              ? <><strong>✓ Screenshot uploaded:</strong> {paymentScreenshot.name}</>
                              : <><strong>Upload payment screenshot</strong> as proof of bank transfer</>
                            }
                          </p>
                          {paymentScreenshotPreview && (
                            <div className="screenshot-preview">
                              <img src={paymentScreenshotPreview} alt="Payment proof" />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

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
                  <div className="summary-row"><span>Shipping</span><span style={{ color: shippingCost === 0 ? 'var(--success)' : undefined }}>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span></div>
                  {shippingCost > 0 && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Free delivery on orders above ₹5,000</p>}
                  <div className="summary-total"><span>Grand Total</span><span style={{ color: 'var(--primary)' }}>₹{grandTotal.toLocaleString('en-IN')}</span></div>

                  {(form.paymentMethod === 'upi' || form.paymentMethod === 'bank') && !paymentScreenshot && (
                    <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#FEF2F2', color: '#B91C1C', fontSize: '0.8125rem', fontWeight: '500', marginBottom: '1rem', textAlign: 'center' }}>
                      ⚠ Upload payment screenshot to place order
                    </div>
                  )}

                  <Button type="submit" className="btn-full" disabled={isSubmitting || cart.length === 0} style={{ padding: '1rem', fontSize: '1.125rem', fontWeight: '700' }}>
                    {isSubmitting ? 'Placing Order...' : `Place Order • ₹${grandTotal.toLocaleString('en-IN')}`}
                  </Button>

                  <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    By placing this order, you agree to our Terms & Conditions
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

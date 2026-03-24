"use client";

import { useState, useRef, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { Wrench, Smartphone, Landmark, Upload, CheckCircle, Copy, CheckCheck, AlertTriangle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';

const UPI_ID = 'ramprakashgobi@oksbi';
const UPI_NAME = 'Ramprakashgobi Ramprakash';

const BANK_DETAILS = {
  accountHolder: 'GIRIRAM CYCLE MART',
  bankName: 'State Bank of India',
  accountNumber: '1234567890',
  ifsc: 'SBIN0001234',
  branch: 'Central Market Branch',
};

function RepairPayContent() {
  const searchParams = useSearchParams();
  const refId = searchParams.get('ref') || '';
  
  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function fetchRepair() {
      if (!refId) {
        setLoading(false);
        setErrorStatus('not_found');
        return;
      }
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('repair_bookings')
          .select('*')
          .eq('tracking_id', refId)
          .single();

        if (error || !data) {
          setErrorStatus('not_found');
        } else {
          setRepair({
            customer: data.customer_name,
            cycle: data.cycle_model,
            issue: data.issue_description,
            cost: data.estimated_cost || 0,
            status: data.status,
            tracking_id: data.tracking_id
          });
        }
      } catch (err) {
        setErrorStatus('error');
      } finally {
        setLoading(false);
      }
    }
    fetchRepair();
  }, [refId]);

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading payment details...</p>
      </div>
    );
  }

  if (errorStatus === 'not_found' || !repair) {
    return (
      <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', backgroundColor: 'var(--white)', padding: '3rem', borderRadius: '1.5rem', border: '1px solid var(--border-color)', maxWidth: '500px', width: '100%' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#FEF2F2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <AlertTriangle size={40} style={{ color: '#EF4444' }} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '0.75rem' }}>Repair Not Found</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            The repair reference <strong>{refId || 'N/A'}</strong> was not found. Please check the link shared by the store.
          </p>
          <Link href="/repair/status"><Button>Track Repair Status</Button></Link>
        </div>
      </div>
    );
  }

  if (repair.cost <= 0) {
    return (
      <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', backgroundColor: 'var(--white)', padding: '3rem', borderRadius: '1.5rem', border: '1px solid var(--border-color)', maxWidth: '500px', width: '100%' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#FFFBEB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Wrench size={40} style={{ color: '#F59E0B' }} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '0.75rem' }}>Cost Not Set Yet</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            The repair cost for <strong>{repair.tracking_id}</strong> hasn't been set by the store yet.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
            Our team is still diagnosing your cycle. You'll be notified once the cost is confirmed.
          </p>
          <Link href="/repair/status"><Button>Track Repair Status</Button></Link>
        </div>
      </div>
    );
  }

  const amount = repair.cost;
  const upiPaymentString = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR`;

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
      setScreenshot(file);
      setScreenshotPreview(URL.createObjectURL(file));
      toast.success('Payment screenshot uploaded!');
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    toast.success('UPI ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    if (!screenshot) {
      toast.error('Please upload your payment screenshot before submitting.');
      return;
    }
    setIsSubmitting(true);
    // In production we would upload the screenshot to Supabase storage
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ textAlign: 'center', backgroundColor: 'var(--white)', padding: '3rem', borderRadius: '1.5rem', border: '1px solid var(--border-color)', maxWidth: '500px', width: '100%' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#ECFDF5', border: '4px solid #D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle size={40} style={{ color: '#059669' }} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '0.75rem' }}>Payment Submitted!</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Your payment proof for <strong>{repair.tracking_id}</strong> has been received.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
            We'll verify the payment and update your repair status. You can track your repair online.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/repair/status"><Button variant="outline">Track Repair</Button></Link>
            <Link href="/"><Button>Go Home</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '3rem 0' }}>
      <div className="container repair-pay-container">

        <div style={{ marginBottom: '2rem' }}>
          <Link href="/repair/status" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>
            <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} /> Back to Status
          </Link>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(255, 107, 0, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Wrench size={32} style={{ color: 'var(--primary)' }} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '0.5rem' }}>Repair Payment</h1>
          <p style={{ color: 'var(--text-muted)' }}>Complete the payment for your cycle repair service</p>
        </div>

        {/* Repair Summary Card */}
        <div className="repair-pay-summary">
          <div className="ref-badge">{repair.tracking_id}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em' }}>Customer</p>
              <p style={{ fontWeight: '600', color: 'var(--secondary)' }}>{repair.customer}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em' }}>Cycle</p>
              <p style={{ fontWeight: '600', color: 'var(--secondary)' }}>{repair.cycle}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em' }}>Issue</p>
              <p style={{ fontWeight: '600', color: 'var(--secondary)' }}>{repair.issue}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em' }}>Status</p>
              <span style={{ padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: repair.status === 'completed' ? '#D1FAE5' : '#EFF6FF', color: repair.status === 'completed' ? '#065F46' : '#1E3A8A' }}>{repair.status.replace('_', ' ')}</span>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>Amount to Pay</span>
            <span className="repair-pay-amount">₹{amount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setPaymentMethod('upi')}
            style={{
              flex: 1, padding: '1rem', borderRadius: '0.75rem', fontWeight: '700', fontSize: '0.9375rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              border: paymentMethod === 'upi' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
              backgroundColor: paymentMethod === 'upi' ? '#FFF7ED' : 'var(--white)',
              color: paymentMethod === 'upi' ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'all 0.2s'
            }}
          >
            <Smartphone size={20} /> GPay / UPI
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod('bank')}
            style={{
              flex: 1, padding: '1rem', borderRadius: '0.75rem', fontWeight: '700', fontSize: '0.9375rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              border: paymentMethod === 'bank' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
              backgroundColor: paymentMethod === 'bank' ? '#FFF7ED' : 'var(--white)',
              color: paymentMethod === 'bank' ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'all 0.2s'
            }}
          >
            <Landmark size={20} /> Bank Transfer
          </button>
        </div>

        {/* UPI / QR Section */}
        {paymentMethod === 'upi' && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div className="payment-qr-section">
              <p style={{ fontWeight: '700', color: 'var(--secondary)', fontSize: '1rem' }}>Scan to Pay ₹{amount.toLocaleString('en-IN')}</p>
              <div style={{ borderRadius: '1rem', overflow: 'hidden', border: '3px solid #e5e7eb', display: 'inline-block' }}>
                <img src="/payment-qr.jpg" alt="GPay QR Code" style={{ display: 'block', width: '220px', height: '220px', objectFit: 'contain' }} />
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
          </div>
        )}

        {/* Bank Transfer Section */}
        {paymentMethod === 'bank' && (
          <div style={{ marginBottom: '1.5rem' }}>
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
                Transfer exactly <strong>₹{amount.toLocaleString('en-IN')}</strong> to the above account
              </div>
            </div>
          </div>
        )}

        {/* Screenshot Upload */}
        <div
          className={`screenshot-upload-area ${screenshot ? 'has-file' : ''}`}
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
            {screenshot ? <CheckCircle size={24} /> : <Upload size={24} />}
          </div>
          <p className="screenshot-upload-text">
            {screenshot
              ? <><strong>✓ Screenshot uploaded:</strong> {screenshot.name}</>
              : <><strong>Upload payment screenshot</strong> as proof of payment</>
            }
          </p>
          {screenshotPreview && (
            <div className="screenshot-preview">
              <img src={screenshotPreview} alt="Payment proof" />
            </div>
          )}
        </div>

        {/* Submit */}
        <div style={{ marginTop: '1.5rem' }}>
          {!screenshot && (
            <div style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#FEF2F2', color: '#B91C1C', fontSize: '0.8125rem', fontWeight: '500', marginBottom: '1rem', textAlign: 'center' }}>
              ⚠ Please upload your payment screenshot to submit
            </div>
          )}
          <Button onClick={handleSubmit} className="btn-full" disabled={isSubmitting} style={{ padding: '1rem', fontSize: '1.125rem', fontWeight: '700' }}>
            {isSubmitting ? 'Submitting...' : `Submit Payment Proof • ₹${amount.toLocaleString('en-IN')}`}
          </Button>
        </div>

      </div>
    </div>
  );
}

export default function RepairPayPage() {
  return (
    <Suspense fallback={
      <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading payment details...</p>
      </div>
    }>
      <RepairPayContent />
    </Suspense>
  );
}

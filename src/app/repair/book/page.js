"use client";

import { useState } from 'react';
import { Wrench, Calendar, Clock, Bike, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function RepairBookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [trackingId, setTrackingId] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cycleModel: '',
    issue: '',
    date: '',
    time: 'morning',
    serviceType: 'store_visit',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('repair_bookings')
        .insert({
          customer_name: formData.name,
          phone_number: formData.phone,
          cycle_model: formData.cycleModel,
          issue_description: formData.issue,
          preferred_date: formData.date,
          preferred_time_slot: formData.time,
          service_type: formData.serviceType,
          status: 'submitted',
        })
        .select('tracking_id')
        .single();

      if (error) throw error;

      setTrackingId(data.tracking_id);
      setIsSuccess(true);
      toast.success('Repair booking confirmed!');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ backgroundColor: 'var(--white)', padding: '4rem', borderRadius: '1rem', border: '1px solid var(--border-color)', textAlign: 'center', maxWidth: '500px', width: '100%', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: '#ECFDF5', border: '4px solid #D1FAE5', color: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle size={40} />
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '1rem' }}>Booking Confirmed!</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Your repair slot for <strong>{formData.date}</strong> has been successfully booked. Please bring your cycle to the store at your convenience.
          </p>

          <div style={{ backgroundColor: 'var(--bg-color)', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem', border: '1px dashed var(--border-color)' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Your Tracking Reference</span>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '4px', fontFamily: 'monospace' }}>
              {trackingId}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>📋 Save this ID to track your repair status online.</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/repair/status">
              <Button variant="outline">Track Status</Button>
            </Link>
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '4rem 0' }}>
      <div className="container">

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(255, 107, 0, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Wrench style={{ color: 'var(--primary)', width: '32px', height: '32px' }} />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--secondary)', letterSpacing: '-0.025em', marginBottom: '1rem' }}>Book a Repair Service</h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Professional maintenance and repair for all types of cycles.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="form-grid">

          {/* Booking Form */}
          <div style={{ backgroundColor: 'var(--white)', borderRadius: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-color)' }}>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">

                  {/* Personal Info */}
                  <div className="focus-full" style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--secondary)', marginBottom: '1.5rem', borderBottom: '2px solid var(--bg-color)', paddingBottom: '0.5rem' }}>Personal Details</h3>
                    <div className="form-grid">
                      <div>
                        <label className="form-label">Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-input" placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="form-label">Phone Number</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="form-input" placeholder="+91 98652 22646" />
                      </div>
                    </div>
                  </div>

                  {/* Cycle Info */}
                  <div className="focus-full" style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--secondary)', marginBottom: '1.5rem', borderBottom: '2px solid var(--bg-color)', paddingBottom: '0.5rem' }}>Cycle Details</h3>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label className="form-label">Cycle Brand & Model</label>
                      <input type="text" name="cycleModel" value={formData.cycleModel} onChange={handleChange} required className="form-input" placeholder="e.g. Hero Sprint Pro 27.5T" />
                    </div>
                    <div>
                      <label className="form-label">Describe the issue</label>
                      <textarea name="issue" value={formData.issue} onChange={handleChange} required rows={4} className="form-input" placeholder="e.g. Brakes are feeling loose, gears are not shifting smoothly..." />
                    </div>
                  </div>

                  {/* Service Type */}
                  <div className="focus-full" style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--secondary)', marginBottom: '1.5rem', borderBottom: '2px solid var(--bg-color)', paddingBottom: '0.5rem' }}>Service Type</h3>
                    <div className="form-grid">
                      {['store_visit', 'pickup'].map(type => (
                        <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: '0.75rem', border: `2px solid ${formData.serviceType === type ? 'var(--primary)' : 'var(--border-color)'}`, cursor: 'pointer', backgroundColor: formData.serviceType === type ? 'rgba(255,107,0,0.05)' : 'white', transition: 'all 0.2s' }}>
                          <input type="radio" name="serviceType" value={type} checked={formData.serviceType === type} onChange={handleChange} style={{ accentColor: 'var(--primary)' }} />
                          <div>
                            <div style={{ fontWeight: '600', color: 'var(--secondary)', fontSize: '0.9rem' }}>{type === 'store_visit' ? '🏪 Store Visit' : '🚚 Pickup from Home'}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{type === 'store_visit' ? 'Drop off at our store' : 'We pick up from your location'}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Appointment Info */}
                  <div className="focus-full" style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--secondary)', marginBottom: '1.5rem', borderBottom: '2px solid var(--bg-color)', paddingBottom: '0.5rem' }}>Appointment</h3>
                    <div className="form-grid">
                      <div>
                        <label className="form-label">Preferred Date</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} required className="form-input" min={new Date().toISOString().split('T')[0]} />
                      </div>
                      <div>
                        <label className="form-label">Preferred Time</label>
                        <select name="time" value={formData.time} onChange={handleChange} required className="form-input" style={{ backgroundColor: 'white' }}>
                          <option value="morning">Morning (10 AM - 1 PM)</option>
                          <option value="afternoon">Afternoon (2 PM - 5 PM)</option>
                          <option value="evening">Evening (5 PM - 8 PM)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                </div>

                <div style={{ marginTop: '2rem' }}>
                  <Button type="submit" size="lg" disabled={isSubmitting} className="btn-full" style={{ padding: '1rem', fontSize: '1.125rem' }}>
                    {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--white)', borderRadius: '1.5rem', padding: '2rem', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '1.5rem' }}>How it works</h3>
              <div style={{ position: 'relative', paddingLeft: '2rem', borderLeft: '2px dashed var(--border-color)', marginLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {[
                  { n: 1, title: 'Book your slot', desc: 'Fill in your cycle details and pick a convenient date.' },
                  { n: 2, title: 'Drop off your cycle', desc: 'Bring it to our store on your scheduled date.' },
                  { n: 3, title: 'Expert Diagnosis', desc: 'We check the issue and provide a cost estimate.' },
                  { n: 4, title: 'Track & Pickup', desc: 'Track status online using your REP-XXXXX ID!' },
                ].map(step => (
                  <div key={step.n} style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-3rem', top: '0', width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: step.n === 1 ? 'var(--primary)' : 'var(--bg-color)', border: step.n === 1 ? 'none' : '2px solid var(--border-color)', color: step.n === 1 ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{step.n}</div>
                    <h4 style={{ fontWeight: '700', color: 'var(--secondary)', marginBottom: '0.25rem' }}>{step.title}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--secondary)', color: 'white', borderRadius: '1.5rem', padding: '2rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>Have an ongoing repair?</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                Check live status using your <strong style={{ color: 'white' }}>REP-XXXXX</strong> reference number.
              </p>
              <Link href="/repair/status">
                <Button className="btn-full" style={{ backgroundColor: 'white', color: 'var(--secondary)' }}>
                  Track Status
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

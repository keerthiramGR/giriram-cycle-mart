"use client";

import { useState } from 'react';
import { Wrench, Calendar, Camera, Clock, Bike, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function RepairBookingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [refNumber, setRefNumber] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    cycleModel: '',
    issue: '',
    date: '',
    time: 'morning'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setRefNumber(`REP-${Math.floor(10000 + Math.random() * 90000)}`);
    }, 1500);
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
            Your repair slot for {formData.date} has been successfully booked. Please bring your cycle to the store at your convenience.
          </p>
          
          <div style={{ backgroundColor: 'var(--bg-color)', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem', border: '1px dashed var(--border-color)' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Your Tracking Reference</span>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '2px', fontFamily: 'monospace' }}>
              {refNumber}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Save this to track your repair status online.</p>
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
            Professional maintenance and repair for all types of cycles. Trust our experts to get your ride back in top condition.
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
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="form-input" placeholder="+91 98765 43210" />
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
                  
                  {/* Appointment Info */}
                  <div className="focus-full" style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--secondary)', marginBottom: '1.5rem', borderBottom: '2px solid var(--bg-color)', paddingBottom: '0.5rem' }}>Drop-off Appointment</h3>
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
                    {isSubmitting ? 'Processing...' : 'Confirm Booking Slot'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
          
          {/* How it works sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--white)', borderRadius: '1.5rem', padding: '2rem', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '1.5rem' }}>How it works</h3>
              
              <div style={{ position: 'relative', paddingLeft: '2rem', borderLeft: '2px dashed var(--border-color)', marginLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-3rem', top: '0', width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
                  <h4 style={{ fontWeight: '700', color: 'var(--secondary)', marginBottom: '0.25rem' }}>Book your slot</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Fill in your cycle details and pick a convenient date.</p>
                </div>
                
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-3rem', top: '0', width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: 'var(--bg-color)', border: '2px solid var(--border-color)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
                  <h4 style={{ fontWeight: '700', color: 'var(--secondary)', marginBottom: '0.25rem' }}>Drop off your cycle</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Bring it to our store on your scheduled date.</p>
                </div>
                
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-3rem', top: '0', width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: 'var(--bg-color)', border: '2px solid var(--border-color)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</div>
                  <h4 style={{ fontWeight: '700', color: 'var(--secondary)', marginBottom: '0.25rem' }}>Expert Diagnosis</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>We check the issue and provide a cost estimate.</p>
                </div>
                
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-3rem', top: '0', width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: 'var(--bg-color)', border: '2px solid var(--border-color)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>4</div>
                  <h4 style={{ fontWeight: '700', color: 'var(--secondary)', marginBottom: '0.25rem' }}>Track & Pickup</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Track status online and collect when ready!</p>
                </div>
                
              </div>
            </div>
            
            <div style={{ backgroundColor: 'var(--secondary)', color: 'white', borderRadius: '1.5rem', padding: '2rem', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>Have an ongoing repair?</h3>
              <p style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                If you have already dropped off your cycle, you can check its live completion status using your reference number.
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

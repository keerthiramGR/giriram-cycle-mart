"use client";

import { useState } from 'react';
import { Search, Package, Wrench, CheckCircle, Clock, XCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

const STATUS_STEPS = [
  { id: 'submitted',        label: 'Booking Received',    icon: Package },
  { id: 'accepted',         label: 'Accepted',            icon: Search },
  { id: 'in_progress',      label: 'Repairing',           icon: Wrench },
  { id: 'completed',        label: 'Ready for Pickup',    icon: CheckCircle },
];

const STATUS_ORDER = ['submitted', 'accepted', 'in_progress', 'completed', 'ready_for_pickup'];

const STATUS_LABELS = {
  submitted:       { label: 'Booking Received',  color: '#2563EB', bg: '#EFF6FF' },
  accepted:        { label: 'Accepted',           color: '#7C3AED', bg: '#F5F3FF' },
  in_progress:     { label: 'In Progress',        color: '#D97706', bg: '#FFFBEB' },
  completed:       { label: 'Completed',          color: '#059669', bg: '#ECFDF5' },
  ready_for_pickup:{ label: 'Ready for Pickup',   color: '#059669', bg: '#ECFDF5' },
  cancelled:       { label: 'Cancelled',          color: '#DC2626', bg: '#FEF2F2' },
};

export default function RepairStatusPage() {
  const [refNumber, setRefNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmed = refNumber.trim().toUpperCase();
    if (!trimmed) return;

    setIsSearching(true);
    setError('');
    setResult(null);

    try {
      const supabase = createClient();
      const { data, error: dbError } = await supabase
        .from('repair_bookings')
        .select('*')
        .eq('tracking_id', trimmed)
        .single();

      if (dbError || !data) {
        setError('No repair booking found with that reference number. Please check and try again.');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const getStepStatus = (currentStatus, stepId) => {
    const currentIndex = STATUS_ORDER.indexOf(currentStatus);
    const stepIndex = STATUS_ORDER.indexOf(stepId);
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const statusInfo = result ? (STATUS_LABELS[result.status] || { label: result.status, color: '#64748B', bg: '#F8FAFC' }) : null;

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '4rem 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(255, 107, 0, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Search style={{ color: 'var(--primary)', width: '32px', height: '32px' }} />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--secondary)', letterSpacing: '-0.025em', marginBottom: '1rem' }}>Track Repair Status</h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Enter your <strong>REP-XXXXX</strong> reference number to check the live status of your repair.
          </p>
        </div>

        <div style={{ backgroundColor: 'var(--white)', borderRadius: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid var(--border-color)', maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ padding: '2rem 2.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <form onSubmit={handleSearch}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input
                  type="text"
                  placeholder="e.g. REP-12345"
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  style={{ flex: 1, border: '1px solid #CBD5E1', borderRadius: '0.75rem', padding: '1rem 1.25rem', fontSize: '1.125rem', outline: 'none', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'monospace' }}
                />
                <Button type="submit" size="lg" disabled={isSearching || !refNumber.trim()} style={{ padding: '0 2rem' }}>
                  {isSearching ? 'Searching...' : 'Track'}
                </Button>
              </div>
            </form>
            {error && (
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#DC2626', fontWeight: '500' }}>
                <XCircle size={16} /> {error}
              </div>
            )}
          </div>

          {result && (
            <div style={{ padding: '2.5rem', backgroundColor: '#F8FAFC' }}>

              {/* Header Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--secondary)', marginBottom: '0.25rem' }}>{result.cycle_model}</h3>
                  <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <Clock size={14} /> Booked on {new Date(result.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    👤 {result.customer_name} — 📞 {result.phone_number}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Tracking ID</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--primary)', backgroundColor: 'rgba(255, 107, 0, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '0.5rem' }}>
                    {result.tracking_id}
                  </span>
                  <div style={{ marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '0.25rem 0.75rem', borderRadius: '9999px', backgroundColor: statusInfo.bg, color: statusInfo.color }}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div style={{ backgroundColor: 'var(--white)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid var(--border-color)', marginBottom: '1.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <h4 style={{ fontWeight: '600', color: 'var(--secondary)', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>Repair Progress</h4>
                <div className="status-timeline">
                  {STATUS_STEPS.map((step) => {
                    const status = getStepStatus(result.status, step.id);
                    const Icon = step.icon;
                    return (
                      <div key={step.id} className="status-step" style={{ display: 'flex', alignItems: 'center', height: '3rem' }}>
                        <div className={`status-icon ${status}`}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <h5 style={{ fontWeight: '700', fontSize: '1rem', color: status === 'pending' ? 'var(--text-muted)' : 'var(--secondary)' }}>
                            {step.label}
                          </h5>
                          {status === 'current' && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '500', marginTop: '0.1rem' }}>● Currently working on it</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem' }}>
                <div style={{ backgroundColor: 'var(--white)', borderRadius: '1rem', padding: '1.25rem', border: '1px solid var(--border-color)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Reported Issue</span>
                  <p style={{ color: 'var(--secondary)', fontWeight: '500', lineHeight: '1.5' }}>{result.issue_description}</p>
                </div>
                <div style={{ backgroundColor: 'var(--white)', borderRadius: '1rem', padding: '1.25rem', border: '1px solid var(--border-color)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Appointment</span>
                  <p style={{ color: 'var(--secondary)', fontWeight: '600' }}>📅 {result.preferred_date}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem', textTransform: 'capitalize' }}>🕐 {result.preferred_time_slot}</p>
                </div>
                {result.admin_notes && (
                  <div style={{ gridColumn: '1/-1', backgroundColor: '#FFFBEB', borderRadius: '1rem', padding: '1.25rem', border: '1px solid #FDE68A' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>📝 Note from our team</span>
                    <p style={{ color: '#78350F', fontWeight: '500' }}>{result.admin_notes}</p>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

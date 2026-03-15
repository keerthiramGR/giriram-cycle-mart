"use client";

import { useState } from 'react';
import { Search, Package, Wrench, CheckCircle, Clock } from 'lucide-react';
import Button from '@/components/ui/Button';

// Dummy repair status data
const MOCK_REPAIRS = {
  'REP-12345': {
    ref: 'REP-12345',
    customer: 'John Doe',
    cycle: 'Hero Sprint Pro 27.5T',
    issue: 'Brakes loose, gear shifting issue',
    status: 'in_progress',
    date: 'Oct 24, 2023',
    cost: 850
  },
  'REP-98765': {
    ref: 'REP-98765',
    customer: 'Jane Smith',
    cycle: 'Hercules Roadeo Hannibal',
    issue: 'Full servicing and wash',
    status: 'completed',
    date: 'Oct 20, 2023',
    cost: 1200
  }
};

const STATUS_STEPS = [
  { id: 'pending', label: 'Booking Received', icon: Package },
  { id: 'diagnosing', label: 'Diagnosing', icon: Search },
  { id: 'in_progress', label: 'Repairing', icon: Wrench },
  { id: 'completed', label: 'Ready for Pickup', icon: CheckCircle },
];

export default function RepairStatusPage() {
  const [refNumber, setRefNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (!refNumber.trim()) return;

    setIsSearching(true);
    setError('');
    
    setTimeout(() => {
      setIsSearching(false);
      const found = MOCK_REPAIRS[refNumber.toUpperCase()];
      
      if (found) {
        setResult(found);
      } else {
        setResult(null);
        setError('No repair booking found with that reference number. Please check and try again.');
      }
    }, 800);
  };

  const getStepStatus = (currentStatus, stepId) => {
    const statusIndex = STATUS_STEPS.findIndex(s => s.id === currentStatus);
    const stepIndex = STATUS_STEPS.findIndex(s => s.id === stepId);
    
    if (stepIndex < statusIndex) return 'completed';
    if (stepIndex === statusIndex) return 'current';
    return 'pending';
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', padding: '4rem 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(255, 107, 0, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Search style={{ color: 'var(--primary)', width: '32px', height: '32px' }} />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--secondary)', letterSpacing: '-0.025em', marginBottom: '1rem' }}>Track Repair Status</h1>
          <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Enter your booking reference number below to check the real-time status of your cycle repair.
          </p>
        </div>
        
        <div style={{ backgroundColor: 'var(--white)', borderRadius: '1.5rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden', border: '1px solid var(--border-color)', maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ padding: '2rem 2.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
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
            {error && <p style={{ marginTop: '1rem', color: 'var(--error)', fontWeight: '500' }}>{error}</p>}
          </div>
          
          {result && (
            <div style={{ padding: '2.5rem', backgroundColor: '#F8FAFC' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--secondary)', marginBottom: '0.25rem' }}>{result.cycle}</h3>
                  <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                    <Clock size={16} style={{ marginRight: '0.5rem' }} /> Dropped on {result.date}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Ref</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '1.125rem', color: 'var(--primary)', backgroundColor: 'rgba(255, 107, 0, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '0.5rem' }}>
                    {result.ref}
                  </span>
                </div>
              </div>
              
              <div style={{ backgroundColor: 'var(--white)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid var(--border-color)', marginBottom: '2.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                <h4 style={{ fontWeight: '600', color: 'var(--secondary)', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>Repair Status</h4>
                
                <div style={{ padding: '1rem 0' }}>
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
                            <h5 style={{ fontWeight: '700', fontSize: '1.125rem', color: status === 'pending' ? 'var(--text-muted)' : 'var(--secondary)' }}>
                              {step.label}
                            </h5>
                            {status === 'current' && (
                              <p style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: '500', marginTop: '0.25rem' }}>Currently working on it</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1rem' }}>
                <div style={{ backgroundColor: 'var(--white)', borderRadius: '1rem', padding: '1.25rem', border: '1px solid var(--border-color)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', display: 'block' }}>Reported Issue</span>
                  <p style={{ color: 'var(--secondary)', fontWeight: '500', lineHeight: '1.5' }}>{result.issue}</p>
                </div>
                <div style={{ backgroundColor: 'var(--white)', borderRadius: '1rem', padding: '1.25rem', border: '1px solid var(--border-color)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem', display: 'block' }}>Estimated Cost</span>
                  <p style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--secondary)', lineHeight: '1' }}>
                    ₹{result.cost.toLocaleString('en-IN')}
                  </p>
                  {result.status !== 'completed' && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>(Subject to change)</p>}
                </div>
              </div>
              
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}

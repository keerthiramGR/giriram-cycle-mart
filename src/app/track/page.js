"use client";

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Search, Package, Wrench, Clock, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function TrackPage() {
  const [queryId, setQueryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [type, setType] = useState(null); // 'order' or 'repair'

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!queryId.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setType(null);

    const supabase = createClient();
    const isRepair = queryId.toUpperCase().startsWith('REP');

    try {
      if (isRepair) {
        const { data, error: err } = await supabase
          .from('repairs')
          .select('*')
          .eq('tracking_id', queryId.toUpperCase())
          .single();
          
        if (err || !data) throw new Error('Repair request not found. Please check your Tracking ID.');
        setResult(data);
        setType('repair');
      } else {
        const { data, error: err } = await supabase
          .from('orders')
          .select('*')
          .eq('order_ref', queryId.toUpperCase())
          .single();
          
        if (err || !data) throw new Error('Order not found. Please verify your Order Reference ID.');
        setResult(data);
        setType('order');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '80vh', padding: '4rem 1rem' }}>
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--secondary)', marginBottom: '1rem' }}>Track Your Status</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>Enter your Order Reference or Repair Tracking ID below to get live updates.</p>
        </div>

        <div style={{ backgroundColor: 'var(--white)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <form onSubmit={handleTrack} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
              <input 
                type="text" 
                placeholder="e.g. ORD-12345 or REP-98765"
                value={queryId}
                onChange={(e) => setQueryId(e.target.value)}
                required
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '0.75rem', border: '2px solid var(--border-color)', fontSize: '1.125rem', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>
            <Button type="submit" disabled={loading} style={{ padding: '1rem', fontSize: '1.125rem' }}>
              {loading ? 'Searching...' : 'Track Status'}
            </Button>
          </form>

          {error && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: 'var(--error)', borderRadius: '0.75rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          {result && type === 'order' && (
            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                <div style={{ width: '3rem', height: '3rem', backgroundColor: '#F1F5F9', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <Package size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--secondary)' }}>Order Overview</h3>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontFamily: 'monospace', fontWeight: 'bold' }}>{result.order_ref}</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '1.5rem', borderRadius: '0.75rem', border: '1px dashed #CBD5E1', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Current Status:</span>
                  <span style={{ fontWeight: '800', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'capitalize' }}>
                    <CheckCircle size={18} /> {result.status}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Customer Name:</span>
                  <span style={{ fontWeight: '600' }}>{result.customer_name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Items:</span>
                  <span style={{ fontWeight: '600' }}>{JSON.parse(result.items || '[]').length} items</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Total Amount:</span>
                  <span style={{ fontWeight: '800', color: 'var(--secondary)' }}>₹{Number(result.total_amount).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}

          {result && type === 'repair' && (
            <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
                <div style={{ width: '3rem', height: '3rem', backgroundColor: '#FEF3C7', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                  <Wrench size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--secondary)' }}>Repair Status</h3>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontFamily: 'monospace', fontWeight: 'bold' }}>{result.tracking_id}</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '1.5rem', borderRadius: '0.75rem', border: '1px dashed #CBD5E1', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #E2E8F0' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Current State:</span>
                  <span style={{ fontWeight: '800', color: '#D97706', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'capitalize' }}>
                    <Clock size={18} /> {result.status}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Customer Name:</span>
                  <span style={{ fontWeight: '600' }}>{result.customer_name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Cycle Model:</span>
                  <span style={{ fontWeight: '600' }}>{result.cycle_model}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Estimated Cost:</span>
                  <span style={{ fontWeight: '800', color: 'var(--secondary)' }}>₹{Number(result.estimated_cost || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

// Hardcoded admin credentials (for demo purposes)
const ADMIN_CREDENTIALS = {
  email: 'admin@giriramcycles.com',
  password: 'admin123',
};

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate network delay
    setTimeout(() => {
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        // Store admin session in localStorage
        localStorage.setItem('gcm_admin_logged_in', 'true');
        localStorage.setItem('gcm_admin_email', email);
        toast.success('Welcome, Admin!');
        router.push('/admin/dashboard');
      } else {
        setError('Invalid admin email or password. Please try again.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Logo / Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: '4.5rem', height: '4.5rem', borderRadius: '1rem', background: 'linear-gradient(135deg, var(--primary) 0%, #E56000 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 8px 32px rgba(255, 107, 0, 0.30)' }}>
            <Shield size={32} style={{ color: 'white' }} />
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '800', color: 'white', marginBottom: '0.5rem' }}>Admin Panel</h1>
          <p style={{ color: '#94A3B8', fontSize: '0.875rem' }}>GIRIRAM CYCLE MART — Management Console</p>
        </div>

        {/* Login Card */}
        <div style={{ backgroundColor: 'white', borderRadius: '1.25rem', padding: '2.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', borderRadius: '0.75rem', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', marginBottom: '1.5rem' }}>
              <AlertCircle size={20} style={{ color: '#DC2626', flexShrink: 0 }} />
              <p style={{ color: '#991B1B', fontSize: '0.875rem', fontWeight: '500' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ fontWeight: '600' }}>Admin Email</label>
              <div style={{ position: 'relative' }}>
                <input type="email" className="form-input" placeholder="admin@giriramcycles.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ paddingLeft: '2.75rem', paddingTop: '0.875rem', paddingBottom: '0.875rem' }} />
                <Mail size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label className="form-label" style={{ fontWeight: '600' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} className="form-input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ paddingLeft: '2.75rem', paddingRight: '2.75rem', paddingTop: '0.875rem', paddingBottom: '0.875rem' }} />
                <Lock size={18} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="btn-full" disabled={loading} style={{ padding: '0.875rem', fontSize: '1rem', fontWeight: '700' }}>
              {loading ? 'Signing in...' : 'Sign In to Admin Panel'}
            </Button>
          </form>

          {/* Demo credentials hint */}
          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#F8FAFC', borderRadius: '0.75rem', border: '1px solid #E2E8F0' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Demo Credentials</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Email: <code style={{ fontWeight: '600', color: 'var(--primary)' }}>admin@giriramcycles.com</code>
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Password: <code style={{ fontWeight: '600', color: 'var(--primary)' }}>admin123</code>
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#64748B', fontSize: '0.875rem', marginTop: '2rem' }}>
          Not an admin? <a href="/" style={{ color: 'var(--primary)', fontWeight: '600' }}>Go to Homepage</a>
        </p>
      </div>
    </div>
  );
}

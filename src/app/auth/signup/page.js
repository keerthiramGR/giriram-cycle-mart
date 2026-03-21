"use client";

import { Suspense, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

function SignupForm() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { signUp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signUpError } = await signUp({ 
      email, password, 
      options: { data: { full_name: fullName, phone } }
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      toast.success('Registration successful!');
      router.push(redirectTo);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join us and start shopping for premium cycles</p>
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName" className="form-label">Full Name</label>
          <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="form-input" placeholder="John Doe" />
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="form-label">Phone Number</label>
          <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="form-input" placeholder="+91 98765 43210" />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-input" placeholder="you@example.com" />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="form-input" placeholder="••••••••" />
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Minimum 6 characters long</p>
        </div>

        <Button type="submit" className="btn-full" disabled={loading} style={{ marginTop: '1rem', padding: '0.875rem' }}>
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <div className="auth-footer">
        Already have an account?{' '}
        <Link href={`/auth/login?redirect=${redirectTo}`} className="auth-link">Sign In</Link>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <div className="auth-container">
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '4rem' }}>Loading...</div>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}

"use client";

import { Suspense, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await signIn({ email, password });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      toast.success('Successfully logged in!');
      router.push(redirectTo);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your account to continue</p>
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-input" placeholder="you@example.com" />
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label htmlFor="password" className="form-label">Password</label>
          </div>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-input" placeholder="••••••••" />
        </div>

        <Button type="submit" className="btn-full" disabled={loading} style={{ marginTop: '0.5rem', padding: '0.875rem' }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="auth-footer">
        Don&apos;t have an account?{' '}
        <Link href={`/auth/signup?redirect=${redirectTo}`} className="auth-link">Sign Up</Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="auth-container">
      <Suspense fallback={<div style={{ textAlign: 'center', padding: '4rem' }}>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

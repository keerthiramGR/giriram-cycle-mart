"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    const loggedIn = localStorage.getItem('gcm_admin_logged_in');
    if (loggedIn === 'true') {
      router.replace('/admin/dashboard');
    } else {
      router.replace('/admin/login');
    }
  }, [router]);
  
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--text-muted)' }}>Redirecting...</p>
    </div>
  );
}

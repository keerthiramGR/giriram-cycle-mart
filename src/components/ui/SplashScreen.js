"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashScreen() {
  const [phase, setPhase] = useState('show'); // 'show' | 'flash' | 'done'
  const router = useRouter();

  useEffect(() => {
    // After 3s blink effect starts, then redirect to login
    const blinkTimer = setTimeout(() => {
      setPhase('flash');
    }, 3000);

    const redirectTimer = setTimeout(() => {
      setPhase('done');
      router.replace('/auth/login?redirect=/');
    }, 3400);

    return () => {
      clearTimeout(blinkTimer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      backgroundColor: '#0F172A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: phase === 'flash' ? 0 : 1,
      transition: phase === 'flash' ? 'opacity 0.35s ease-in' : 'none',
    }}>

      {/* Glowing ring */}
      <div style={{
        width: '110px',
        height: '110px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #FF6B00, #E56000)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2rem',
        boxShadow: '0 0 60px rgba(255, 107, 0, 0.5), 0 0 120px rgba(255, 107, 0, 0.2)',
        animation: 'pulse 1.8s ease-in-out infinite',
      }}>
        {/* Cycle icon */}
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18.5" cy="17.5" r="3.5"/>
          <circle cx="5.5" cy="17.5" r="3.5"/>
          <circle cx="15" cy="5" r="1"/>
          <path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
        </svg>
      </div>

      {/* Brand name */}
      <h1 style={{
        fontSize: '2.25rem',
        fontWeight: '900',
        color: 'white',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: '0.5rem',
        textShadow: '0 2px 20px rgba(255,107,0,0.4)',
        fontFamily: 'system-ui, sans-serif',
      }}>
        GIRIRAM
      </h1>
      <p style={{
        fontSize: '1rem',
        fontWeight: '600',
        color: '#FF6B00',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        fontFamily: 'system-ui, sans-serif',
      }}>
        CYCLE MART
      </p>

      {/* Loading dots */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '3rem' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#FF6B00',
            animation: `dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            opacity: 0.7,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 60px rgba(255,107,0,0.5), 0 0 120px rgba(255,107,0,0.2); }
          50% { box-shadow: 0 0 90px rgba(255,107,0,0.8), 0 0 160px rgba(255,107,0,0.35); }
        }
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.4; }
          40% { transform: scale(1.3); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

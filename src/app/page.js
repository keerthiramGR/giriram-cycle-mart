"use client";

import { useEffect, useState } from 'react';
import SplashScreen from '@/components/ui/SplashScreen';
import HeroBanner from '@/components/home/HeroBanner';
import CategorySection from '@/components/home/CategorySection';
import BestSellers from '@/components/home/BestSellers';
import RepairCTA from '@/components/home/RepairCTA';

export default function Home() {
  const [showSplash, setShowSplash] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Show splash only once per browser session
    const seen = sessionStorage.getItem('gcm_splash_seen');
    if (!seen) {
      sessionStorage.setItem('gcm_splash_seen', 'true');
      setShowSplash(true);
    }
    setReady(true);
  }, []);

  if (!ready) return null;

  if (showSplash) return <SplashScreen />;

  return (
    <main>
      <HeroBanner />
      <CategorySection />
      <BestSellers />
      <RepairCTA />
    </main>
  );
}

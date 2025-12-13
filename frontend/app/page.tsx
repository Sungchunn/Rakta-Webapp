"use client";

import dynamic from 'next/dynamic';

// Dynamic imports with SSR disabled to prevent server crashes from heavy animations
const BloodCarpet = dynamic(() => import('@/components/BloodCarpet'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black" />
});
const Navbar = dynamic(() => import('@/components/Navbar'), {
  ssr: false,
  loading: () => <div className="h-16" />
});
const Hero = dynamic(() => import('@/components/landing/Hero'), {
  ssr: false,
  loading: () => <div className="min-h-screen" />
});
const Steps = dynamic(() => import('@/components/landing/Steps'), {
  ssr: false
});
const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: false
});

export default function LandingPage() {
  return (
    <>
      <BloodCarpet />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <Steps />
        <Footer />
      </main>
    </>
  );
}

'use client';

// Components
import Navbar from '@/components/Navbar';
import Hero from '@/components/landing/Hero';
import Mission from '@/components/landing/Mission';
import Collaborators from '@/components/landing/Collaborators';
import Steps from '@/components/landing/Steps';
import Footer from '@/components/Footer';

import BloodCarpet from '@/components/BloodCarpet';

export default function Home() {
  return (
    <main style={{ background: 'transparent', minHeight: '100vh', position: 'relative' }}>
      <BloodCarpet />
      <Navbar />
      <Hero />
      <Mission />
      <Collaborators />
      <Steps />
      <Footer />
    </main>
  );
}

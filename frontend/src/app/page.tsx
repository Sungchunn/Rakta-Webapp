'use client';

// Components
import Navbar from '@/components/Navbar';
import Hero from '@/components/landing/Hero';
import Mission from '@/components/landing/Mission';
import Collaborators from '@/components/landing/Collaborators';
import Steps from '@/components/landing/Steps';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main style={{ background: 'white', minHeight: '100vh' }}>
      <Navbar />
      <Hero />
      <Mission />
      <Collaborators />
      <Steps />
      <Footer />
    </main>
  );
}

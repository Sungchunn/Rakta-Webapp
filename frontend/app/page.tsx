"use client";

import BloodCarpet from "@/components/BloodCarpet";
import Navbar from "@/components/Navbar";
import Hero from "@/components/landing/Hero";
import Steps from "@/components/landing/Steps";
import Footer from "@/components/Footer";

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

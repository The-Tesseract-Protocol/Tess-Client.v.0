'use client';
import { ReactLenis } from 'lenis/react';
import { InvestorCarousel } from "./landing/Carousel";
import Features from "./landing/Features";
import Hero from "./landing/Hero";
import Navbar from "./landing/Navbar";
import OverviewSection from "./landing/OverSection";
import Footer from './landing/Footer';
import Reviews from './landing/Reviews';

export default function Home() {
  return (
    <ReactLenis root>
      <main className="bg-black overflow-x-hidden min-h-screen min-w-screen">

        <Navbar />
        <Hero />
        {/* Wrapper for sticky scroll effect between sections */}
        <OverviewSection />

        <Features />

        <Footer />

      </main>
    </ReactLenis>
  );
}

'use client';
import { ReactLenis } from 'lenis/react';
import { InvestorCarousel } from "./landing/Carousel";
import Features from "./landing/Features";
import Hero from "./landing/Hero";
import Navbar from "./landing/Navbar";
import OverviewSection from "./landing/OverSection";
import Footer from './landing/Footer';

export default function Home() {
  return (
    <ReactLenis root>
      <main className="bg-black overflow-x-hidden ">
        <Navbar />
        <Hero />
        <InvestorCarousel />
        {/* Wrapper for sticky scroll effect between sections */}
        <div className="wrapper ">
          <OverviewSection />
          <Features />

        </div>
        <Footer />

      </main>
    </ReactLenis>
  );
}

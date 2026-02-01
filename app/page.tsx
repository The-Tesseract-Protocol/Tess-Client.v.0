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

        <div className="fixed top-0 left-0 w-full z-[100] bg-indigo-600 text-white py-2 text-center text-sm font-medium">
          <span>We have a testnet sandbox ready for you to explore! </span>
          <a href="/dashboard" className="underline hover:text-indigo-200 ml-1">
            Try the Dashboard
          </a>
        </div>
        
        <Navbar />

        <Hero />
        {/* Wrapper for sticky scroll effect between sections */}
        <OverviewSection />

        <Features />

        <Reviews/>
        <Footer />



      </main>
    </ReactLenis>
  );
}

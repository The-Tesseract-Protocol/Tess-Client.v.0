'use client';

import { useRouter } from 'next/navigation';
import Spline from "@splinetool/react-spline";
import { Button } from "../components/ui/button";
import { lexendTera } from "../components/Fonts";

const Hero = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/dashboard');
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden overflow-x-hidden">
      <Spline
        scene="https://draft.spline.design/Tlb8LIb6EIRQVMTc/scene.splinecode"
        className="absolute top-0 left-0 w-full h-full mt-0 md:mt-15 pointer-events-none md:pointer-events-auto"
      />
      <div className="relative z-10 flex flex-col min-h-screen justify-between px-6 py-12 md:px-16 md:py-24 text-white pointer-events-none">
        
        {/* Top/Main Title Section */}
        <div className="max-w-3xl mt-20 md:mt-0 md:mb-auto flex flex-col justify-center h-full md:h-auto md:justify-end flex-1">
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${lexendTera.className}`}>
            We&apos;re Building
            <br />
            <span className="text-glow">Functional Privacy</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/80">
            Confidential Payments | Bulk Settlements
          </p>
        </div>

        {/* Bottom/Description Section */}
        <div className="w-full flex justify-end pointer-events-auto mt-8 md:mt-0">
          <div className="max-w-lg text-left md:text-right bg-black/40 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-4 md:p-0 rounded-2xl md:rounded-none border border-white/10 md:border-none">
            <p className="text-sm md:text-lg text-white/80">
              Make payments on Stellar without exposing who you pay. Settle on-chain with full finality, your operations stay confidential.
            </p>
            <div className="flex gap-x-4 mt-6 md:mt-8 justify-start md:justify-end">
              <Button
                variant="outline"
                className="flex items-center gap-x-2"
                onClick={handleGetStarted}
              >
                Get Started
                <span className="bg-blue-500 rounded-full h-6 w-6 flex items-center justify-center text-black">
                  +
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
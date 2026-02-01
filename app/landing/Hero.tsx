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
        className="absolute top-0 left-0 w-full h-full mt-15"
      />
      <div className="relative z-10 flex flex-col min-h-screen items-start justify-end px-16 py-24 text-white pointer-events-none">
        <div className="max-w-3xl">
          <h1 className={`text-6xl font-bold ${lexendTera.className}`}>
            We&apos;re Building
            <br />
            <span className="text-glow">Functional Privacy</span>
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Confidential Payments | Bulk Settlements
          </p>
        </div>
        <div className="absolute bottom-24 right-16 text-right max-w-lg pointer-events-auto">
          <p className="text-lg text-white/80">
            Make payments on Stellar without exposing who you pay. Settle on-chain with full finality, your operations stay confidential.
          </p>
          {/* <div className="flex gap-x-4 mt-8 justify-end">
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Hero;
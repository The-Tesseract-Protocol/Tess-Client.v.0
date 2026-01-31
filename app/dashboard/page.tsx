'use client';

import { useRouter } from 'next/navigation';
import Background from '@/app/components/ui/background-snippet';
import IsoLevelWarp from '../components/ui/isometric-ui';

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="min-h-screen  text-white">
      <IsoLevelWarp 
        // Cyber-Violet Color
        color="100, 50, 250" 
        density={50} 
        speed={1.5}
      />
      {/* Navigation */}
      <nav className="w-full flex items-center justify-between py-8 px-16 fixed top-0 left-0 z-50">
        <div className="flex items-center gap-x-8 backdrop-blur-lg bg-black/40 rounded-3xl overflow-hidden">
          <a href="/" className="text-white/80 hover:text-white transition-colors mr-2">
            <img src="/Tess_BW.svg" alt="Tesseract Logo" className="h-8 w-8 mr-1 inline-block rounded-2xl font-mono" />
            TESSERACT
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-start px-4 md:px-8 font-space pt-28 pb-8 mt-8">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-white mb-6 drop-shadow-2xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-muted font-mono">
Choose your Path
          </span>
          
        </h1>
        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full mt-5">
          {/* Batch Payments Card */}
          <button
            onClick={() => router.push('/batch-payments')}
            className="group relative overflow-hidden rounded-2xl border border-white/1 bg-gradient-to-br from-white/8 to-muted/30 shadow backdrop-blur-lg p-6 text-left transition-all duration-300 hover:border-white/40 hover:bg-white/5"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-black via-transparent " />
            </div>

            {/* Icon */}
            <div className="relative mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/40 to-muted flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="relative mt-9 font-mono ">
              <h2 className={`text-xl font-semibold mb-2 `}>
                Batch Payments
              </h2>
              <p className="text-white/60 mb-4 text-sm">
                Pay up to 80 recipients in a single transaction with just one signature. Fast, efficient, and atomic.
              </p>

              {/* Features */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Single signature for all payments
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  CSV upload or manual entry
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Atomic transactions
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </button>

          {/* Privacy Pay Card - Active */}
          <button
            onClick={() => router.push('/privacy-pay')}
            className="group relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-white/8 to-muted/30 shadow backdrop-blur-lg p-6 text-left transition-all duration-300 hover:border-white/40 hover:bg-white/5"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-black-500/10 via-transparent to-white-500/10" />
            </div>

            {/* Icon */}
            <div className="relative mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/40 to-muted flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="relative font-mono h-auto">
              <h2 className={`text-xl font-semibold mb-2 `}>
                Privacy Pay
              </h2>
              <p className="text-white/60 mb-4 text-sm">
                End-to-end encrypted payments. Send funds without revealing transaction details on-chain.
              </p>

              {/* Features */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Encrypted recipient list
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Confidential amounts
                </div>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Hash-based identity
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </button>
        </div>

        {/* Network Indicator */}
        <div className="mt-8 flex items-center gap-2 text-sm text-white/40 z-10 font-mono">
          <span>Connected to Stellar Testnet</span>
        </div>
      </div>
    </div>
  );
}

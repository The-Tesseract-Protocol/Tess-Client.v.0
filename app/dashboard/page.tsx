'use client';

import { useRouter } from 'next/navigation';
import NeuralBackground from '../components/ui/flow-field-background';

export default function Dashboard() {
  const router = useRouter();

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Neural Background - Full Screen */}
      <div className="absolute inset-0 z-0">
        <NeuralBackground
          color="#818cf8" // Indigo-400
          trailOpacity={0.1}
          speed={0.8}
        />
      </div>

      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full flex items-center justify-between py-8 px-16 z-50">
        <div className="flex items-center gap-x-8 backdrop-blur-lg bg-black/40 rounded-3xl overflow-hidden p-2">
          <a href="/" className="text-white/80 hover:text-white transition-colors flex items-center">
            <img src="/Tess-W.png" alt="Tesseract Logo" className="h-8 w-8 mr-2 rounded-2xl font-mono" />
            <span className="font-mono">TESSERACT</span>
          </a>
        </div>
      </nav>

      {/* Main Content - Centered */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center justify-center max-w-5xl w-full">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-12 drop-shadow-2xl text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 font-mono">
              Choose your Path
            </span>
          </h1>

          {/* Cards Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {/* Batch Payments Card */}
            <button
              onClick={() => router.push('/batch-payments')}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/20 backdrop-blur-md p-8 text-left transition-all duration-300 hover:border-indigo-500/50 hover:bg-white/5 hover:scale-[1.02]"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent" />
              </div>

              {/* Icon */}
              <div className="relative mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/5 group-hover:border-indigo-500/30 transition-colors">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="relative font-mono">
                <h2 className="text-xl font-semibold mb-3 text-white group-hover:text-indigo-300 transition-colors">
                  Batch Authorisation
                </h2>
                <p className="text-white/60 mb-6 text-sm leading-relaxed min-h-[40px]">
                  Pay up to 80 recipients in a single transaction with just one signature using our Auth Tree.
                </p>

                {/* Features */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <svg className="w-3 h-3 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Single signature execution
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <svg className="w-3 h-3 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    CSV or manual input
                  </div>
                </div>
              </div>
            </button>

            {/* Privacy Pay Card */}
            <button
              onClick={() => router.push('/privacy-pay')}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/20 backdrop-blur-md p-8 text-left transition-all duration-300 hover:border-purple-500/50 hover:bg-white/5 hover:scale-[1.02]"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent" />
              </div>

              {/* Icon */}
              <div className="relative mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/5 group-hover:border-purple-500/30 transition-colors">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="relative font-mono">
                <h2 className="text-xl font-semibold mb-3 text-white group-hover:text-purple-300 transition-colors">
                  Privacy Pay
                </h2>
                <p className="text-white/60 mb-6 text-sm leading-relaxed min-h-[40px]">
                  End-to-end encrypted payments. Send funds confidentially without revealing details on-chain.
                </p>

                {/* Features */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    E2E Encryption (Hybrid)
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Hash-based Identity
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Network Indicator */}
          <div className="mt-12 flex items-center gap-2 text-xs text-white/30 z-10 font-mono bg-white/5 px-4 py-2 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Sandbox on Stellar Testnet</span>
          </div>
        </div>
      </div>
    </main>
  );
}

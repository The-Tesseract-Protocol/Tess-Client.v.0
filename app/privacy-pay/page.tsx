'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { WalletProvider, useWallet, ConnectWalletButton, NetworkBadge } from '@/app/contexts/WalletContext';
import { usePrivacyStore } from '@/app/store/privacyStore';
// import { lexendTera } from '@/app/components/Fonts';
import DepositForm from './components/DepositForm';
import WithdrawForm from './components/WithdrawForm';
import TransactionHistory from './components/TransactionHistory';
import { HoverButton } from '../components/ui/hover-button';
// import { Component } from '../components/ui/living-oragami';
// import IsoLevelWarp from '../components/ui/isometric-ui';
import NeuralBackground from '../components/ui/flow-field-background';
type Tab = 'deposit' | 'withdraw';

function PrivacyPayContent() {
  const router = useRouter();
  const { walletState } = useWallet();
  const { address } = walletState;
  const [activeTab, setActiveTab] = useState<Tab>('deposit');
  const { startPolling, stopPolling } = usePrivacyStore();

  useEffect(() => {
    if (address) {
      startPolling(address);
    } else {
      stopPolling();
    }
    return () => stopPolling();
  }, [address, startPolling, stopPolling]);

  return (

    <div className='min-h-screen'>

      <NeuralBackground
        className='min-h-screen top-0'
        color="#818cf8" // Indigo-400
        trailOpacity={0.1} // Lower = longer trails
        speed={0.5}
      />

      <div className="absolute min-h-screen top-0 text-white font-mono flex flex-col justify-center w-full">

        {/* Navigation */}
        <nav className="absolute top-0 left-0 w-full flex items-center justify-between py-4 md:py-6 px-4 md:px-8 lg:px-16 z-50 bg-transparent pointer-events-none">
          <div className="flex items-center gap-x-2 md:gap-x-4 pointer-events-auto">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-3 py-2 md:px-4 md:py-2 text-sm md:text-base rounded-full border border-white/5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Back</span>
            </button>
            <Link href="/" className="text-white/80 hover:text-white transition-colors flex items-center bg-black/20 backdrop-blur-md px-3 py-2 md:px-4 md:py-2 rounded-full border border-white/5">
              <Image src="/Tess-W.png" alt="Tesseract" width={28} height={28} className="h-6 w-6 md:h-7 md:w-7 inline-block sm:mr-2" />
              <span className="hidden sm:inline font-mono text-sm md:text-base">TESSERACT</span>
            </Link>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">
            <div className="hidden md:block">
              <NetworkBadge />
            </div>
            <ConnectWalletButton />
          </div>
        </nav>

        {/* Main Content */}
        <div className="font-mono w-full max-w-7xl mx-auto mt-24 md:mt-28 lg:mt-12 px-4 md:px-6">
          <div className="mx-auto">
            {/* Header */}
            <div className="text-center mb-6 md:mb-8">

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-white mb-4 md:mb-6 drop-shadow-2xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-muted font-mono">
                  Privacy
                </span>

              </h1>
              <p className="text-xs md:text-sm lg:text-base font-italic tracking-tighter text-white/46 mb-4 md:mb-6 drop-shadow-2xl max-w-2xl mx-auto">
                Deposit and withdraw funds with complete privacy. Your transaction details are encrypted and your operations are end to end encrypted.
              </p>
            </div>

            {/* Main Grid */}
            <div className="flex flex-col lg:flex-row gap-5 max-w-9xl mx-auto pb-10">
              {/* Left Column - Forms */}
              <div className="space-y-4 w-full lg:flex-1">
                {/* Tab Switcher */}
                <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                  <HoverButton
                    onClick={() => setActiveTab('deposit')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl font-medium transition-all text-sm md:text-base ${activeTab === 'deposit'
                      ? 'bg-white text-black'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    Deposit
                  </HoverButton>
                  <HoverButton
                    onClick={() => setActiveTab('withdraw')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl font-medium transition-all text-sm md:text-base ${activeTab === 'withdraw'
                      ? 'bg-white text-black'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    Withdraw
                  </HoverButton>
                </div>

                {/* Form Card */}
                <div className=" backdrop-blur-lg border border-white/10 rounded-2xl p-4 md:p-6  ">
                  {activeTab === 'deposit' ? (
                    <DepositForm />
                  ) : (
                    <WithdrawForm />
                  )}
                </div>

              </div>

              <div className="space-y-4 w-full lg:w-[400px] xl:w-[450px] flex flex-col">
                <div className="bg-transparent backdrop-blur-md border border-white/5 rounded-2xl p-4 md:p-6 h-full">
                  <h3 className={`text-md font-semibold mb-4`}>

                    Your Activity
                  </h3>
                  <TransactionHistory />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default function PrivacyPayPage() {
  return (
    <WalletProvider>
      <PrivacyPayContent />
    </WalletProvider>
  );
}

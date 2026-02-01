'use client';

import { useState } from 'react';
import { WalletProvider, useWallet, ConnectWalletButton } from '@/app/contexts/WalletContext';
import { lexendTera } from '@/app/components/Fonts';
import DepositForm from './components/DepositForm';
import WithdrawForm from './components/WithdrawForm';
import TransactionHistory from './components/TransactionHistory';
import { HoverButton } from '../components/ui/hover-button';
import { Component } from '../components/ui/living-oragami';
import IsoLevelWarp from '../components/ui/isometric-ui';
import NeuralBackground from '../components/ui/flow-field-background';

type Tab = 'deposit' | 'withdraw';

function PrivacyPayContent() {
  const { walletState, formatAddress } = useWallet();
  const { isConnected, address, network } = walletState;
  const [activeTab, setActiveTab] = useState<Tab>('deposit');

  return (

    <div className='min-h-screen'>

      <NeuralBackground
        className='min-h-screen top-0'
        color="#818cf8" // Indigo-400
        trailOpacity={0.1} // Lower = longer trails
        speed={0.8}
      />

      <div className="absolute min-h-screen top-0 text-white font-mono flex flex-col items-center justify-center w-full p-20">
    
        {/* Navigation */}
        <nav className="w-full flex items-center justify-between py-6 px-8 md:px-16 fixed top-0 left-0 z-50 backdrop-blur-sm bg-transparent">
          <div className="flex items-center gap-x-4">
            <a href="/dashboard" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden md:inline">Back</span>
            </a>
            <div className="h-6 w-px bg-white/20 font-mono" />
            <div className="flex items-center gap-2">
              <img src="/Tess-W.png" alt="Tesseract" className="h-6 w-6 rounded" />
              <span className={`text-lg font-bold font-mono`}>Privacy Pay</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Network Badge */}
            {network && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full text-xs">
                <div className={`w-2 h-2 rounded-full ${network.network === 'TESTNET' ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`} />
                <span className="text-white/60">{network.network}</span>
              </div>
            )}

            {/* Wallet */}
            {isConnected && address ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="font-mono text-sm text-white/80">{formatAddress(address)}</span>
              </div>
            ) : (
              <ConnectWalletButton />
            )}
          </div>
        </nav>

        {/* Main Content */}
        <div className="px-4 md:px-8 font-mono max-w-7xl mx-auto">
          <div className="mx-auto">
            {/* Header */}
            <div className="text-center mb-8 mt-8">

              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-white mb-6 drop-shadow-2xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-muted font-mono">
                  Privacy
                </span>

              </h1>
              <p className="text-xs md:text-sm lg:text-md font-italic tracking-tighter text-white/46 mb-6 drop-shadow-2xl">
                Deposit and withdraw funds with complete privacy. Your transaction details are encrypted and your operations are end to end encrypted.
              </p>
            </div>

            {/* Main Grid */}
            <div className="flex flex-row gap-5 max-w-5xl mx-auto">
              {/* Left Column - Forms */}
              <div className="space-y-4 max-w-3xl min-w-xl">
                {/* Tab Switcher */}
                <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                  <HoverButton
                    onClick={() => setActiveTab('deposit')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl font-medium transition-all ${activeTab === 'deposit'
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
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl font-medium transition-all ${activeTab === 'withdraw'
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
                <div className=" backdrop-blur-lg border border-white/10 rounded-2xl p-6  ">
                  {activeTab === 'deposit' ? (
                    <DepositForm />
                  ) : (
                    <WithdrawForm />
                  )}
                </div>
                
              </div>

            <div className="space-y-4 max-w-2xl min-w-lg flex flex-col justify-center ">
              <div className="bg-transparent backdrop-blur-md border border-white/5 rounded-2xl p-6">
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
    </div>
  );
}

export default function PrivacyPayPage() {
  return (
    <WalletProvider>
      <PrivacyPayContent />
    </WalletProvider>
  );
}

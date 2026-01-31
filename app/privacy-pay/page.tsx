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

type Tab = 'deposit' | 'withdraw';

function PrivacyPayContent() {
  const { walletState, formatAddress } = useWallet();
  const { isConnected, address, network } = walletState;
  const [activeTab, setActiveTab] = useState<Tab>('deposit');

  return (
    <div className="min-h-screen text-white font-mono">
      <IsoLevelWarp 
        // Cyber-Violet Color
        color="100, 50, 250" 
        density={50} 
        speed={1.5}
      />
      {/* Navigation */}
      <nav className="w-full flex items-center justify-between py-6 px-8 md:px-16 fixed top-0 left-0 z-50 backdrop-blur-lg bg-black/60 border-b border-white/5">
        <div className="flex items-center gap-x-4">
          <a href="/dashboard" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden md:inline">Back</span>
          </a>
          <div className="h-6 w-px bg-white/20 font-mono" />
          <div className="flex items-center gap-2">
            <img src="/Tess_BW.svg" alt="Tesseract" className="h-6 w-6 rounded" />
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
      <div className="pt-20 px-4 md:px-8 font-mono">
        <div className="max-w-[950px] mx-auto">
          {/* Header */}
          <div className="text-center mb-8 mt-8">
           
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-white mb-6 drop-shadow-2xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-muted font-mono">
Privacy          </span>
          
        </h1>
            <p className="text-xs md:text-sm lg:text-md font-italic tracking-tighter text-white/46 mb-6 drop-shadow-2xl">
              Deposit and withdraw funds with complete privacy. Your transaction details are encrypted and hidden from the public ledger.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-4">
              {/* Tab Switcher */}
              <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                <HoverButton
                  onClick={() => setActiveTab('deposit')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl font-medium transition-all ${
                    activeTab === 'deposit'
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
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl font-medium transition-all ${
                    activeTab === 'withdraw'
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
              <div className=" backdrop-blur-lg border border-white/10 rounded-2xl p-6 ">
                {activeTab === 'deposit' ? (
                  <DepositForm />
                ) : (
                  <WithdrawForm />
                )}
              </div>

              {/* How It Works */}
             { activeTab === 'deposit' &&<div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3 className={`text-lg font-semibold mb-4 `}>
                  How Privacy Pay Works
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                      <span className="text-blue-400 font-bold">1</span>
                    </div>
                    <h4 className="font-medium mb-1">Deposit</h4>
                    <p className="text-sm text-white/50">
                      Funds are linked to a unique hash, not your address
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                      <span className="text-purple-400 font-bold">2</span>
                    </div>
                    <h4 className="font-medium mb-1">Encrypt</h4>
                    <p className="text-sm text-white/50">
                      Withdrawal details are encrypted end-to-end
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-white/5 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                      <span className="text-green-400 font-bold">3</span>
                    </div>
                    <h4 className="font-medium mb-1">Withdraw</h4>
                    <p className="text-sm text-white/50">
                      Recipients receive funds privately
                    </p>
                  </div>
                </div>
              </div>}
            </div>

            {/* Right Column - History */}
            <div className="space-y-4">
              <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h3 className={`text-md font-semibold mb-4`}>

                  Your Activity
                </h3>
                <TransactionHistory />
              </div>

              {/* Info Card */}
             

              {/* Current Limits */}
              
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

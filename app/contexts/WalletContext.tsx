'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
    walletService,
    WalletState,
    WalletError,
    WalletErrorCode,
    isWalletError,
    NetworkInfo,
    SignAuthEntryResult,
} from '../services/walletService';

// ==================== CONTEXT TYPES ====================

interface WalletContextType {
    // State
    walletState: WalletState;
    isLoading: boolean;
    error: WalletError | null;

    // Actions
    connect: () => Promise<boolean>;
    disconnect: () => void;
    refreshState: () => Promise<void>;

    // Signing
    signAuthEntry: (authEntryPreimageXdr: string) => Promise<SignAuthEntryResult | WalletError>;

    // Utilities
    formatAddress: (address: string) => string;
    isTestnet: () => boolean;
}

const defaultWalletState: WalletState = {
    isInstalled: false,
    isConnected: false,
    isAllowed: false,
    address: null,
    network: null,
};

// ==================== CONTEXT ====================

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// ==================== PROVIDER ====================

interface WalletProviderProps {
    children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
    const [walletState, setWalletState] = useState<WalletState>(defaultWalletState);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<WalletError | null>(null);

    /**
     * Refresh the wallet state from Freighter
     */
    const refreshState = useCallback(async () => {
        try {
            const state = await walletService.getWalletState();
            setWalletState(state);
            setError(null);
        } catch (err: any) {
            console.error('Error refreshing wallet state:', err);
            setError({
                code: WalletErrorCode.UNKNOWN,
                message: err.message || 'Failed to refresh wallet state',
            });
        }
    }, []);

    /**
     * Initial load of wallet state
     */
    useEffect(() => {
        const initialize = async () => {
            setIsLoading(true);
            await refreshState();
            setIsLoading(false);
        };

        // Only run in browser
        if (typeof window !== 'undefined') {
            initialize();
        } else {
            setIsLoading(false);
        }
    }, [refreshState]);

    /**
     * Listen for account changes in Freighter
     * Note: This requires Freighter to emit events, which may not be available in all versions
     */
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Poll for changes every 5 seconds if connected
        let pollInterval: NodeJS.Timeout | null = null;

        if (walletState.isConnected) {
            pollInterval = setInterval(async () => {
                const currentAddress = await walletService.getConnectedAddress();
                if (currentAddress !== walletState.address) {
                    await refreshState();
                }
            }, 5000);
        }

        return () => {
            if (pollInterval) {
                clearInterval(pollInterval);
            }
        };
    }, [walletState.isConnected, walletState.address, refreshState]);

    /**
     * Connect to the wallet
     */
    const connect = useCallback(async (): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await walletService.connect();

            if (isWalletError(result)) {
                setError(result);
                setIsLoading(false);
                return false;
            }

            // Successfully connected, refresh state
            await refreshState();
            setIsLoading(false);
            return true;
        } catch (err: any) {
            console.error('Error connecting wallet:', err);
            setError({
                code: WalletErrorCode.UNKNOWN,
                message: err.message || 'Failed to connect wallet',
            });
            setIsLoading(false);
            return false;
        }
    }, [refreshState]);

    /**
     * Disconnect from the wallet (client-side only, doesn't revoke permission)
     */
    const disconnect = useCallback(() => {
        setWalletState({
            ...walletState,
            isConnected: false,
            address: null,
        });
        setError(null);
    }, [walletState]);

    /**
     * Sign an authorization entry
     */
    const signAuthEntry = useCallback(
        async (authEntryPreimageXdr: string): Promise<SignAuthEntryResult | WalletError> => {
            if (!walletState.isConnected || !walletState.address) {
                return {
                    code: WalletErrorCode.NOT_ALLOWED,
                    message: 'Wallet not connected',
                };
            }

            return walletService.signAuthEntry(authEntryPreimageXdr, walletState.address);
        },
        [walletState.isConnected, walletState.address]
    );

    /**
     * Format address for display (truncate middle)
     */
    const formatAddress = useCallback((address: string): string => {
        if (!address || address.length < 10) return address;
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    }, []);

    /**
     * Check if connected to testnet
     */
    const isTestnet = useCallback((): boolean => {
        if (!walletState.network) return false;
        return walletState.network.network === 'TESTNET' ||
            walletState.network.networkPassphrase.includes('Test SDF Network');
    }, [walletState.network]);

    const value: WalletContextType = {
        walletState,
        isLoading,
        error,
        connect,
        disconnect,
        refreshState,
        signAuthEntry,
        formatAddress,
        isTestnet,
    };

    return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

// ==================== HOOK ====================

export function useWallet(): WalletContextType {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}

// ==================== UTILITY COMPONENTS ====================

interface ConnectWalletButtonProps {
    className?: string;
    onConnect?: () => void;
    onError?: (error: WalletError) => void;
}

export function ConnectWalletButton({ className = '', onConnect, onError }: ConnectWalletButtonProps) {
    const { walletState, isLoading, error, connect, disconnect, formatAddress } = useWallet();

    const handleClick = async () => {
        if (walletState.isConnected) {
            disconnect();
        } else {
            const success = await connect();
            if (success) {
                onConnect?.();
            } else if (error) {
                onError?.(error);
            }
        }
    };

    if (!walletState.isInstalled) {
        return (
            <a
                href="https://freighter.app"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium text-sm hover:bg-white/90 transition-colors ${className}`}
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Install Freighter
            </a>
        );
    }

    if (walletState.isConnected && walletState.address) {
        return (
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-sm text-white/80 font-mono">
                        {formatAddress(walletState.address)}
                    </span>
                </div>
                <button
                    onClick={handleClick}
                    className="px-3 py-2 text-sm text-white/50 hover:text-white transition-colors"
                >
                    Disconnect
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleClick}
            disabled={isLoading}
            className={`inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium text-sm hover:bg-white/90 transition-colors disabled:opacity-50 ${className}`}
        >
            {isLoading ? (
                <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Connecting...
                </>
            ) : (
                'Connect Wallet'
            )}
        </button>
    );
}

// Network badge component
export function NetworkBadge() {
    const { walletState, isTestnet } = useWallet();

    if (!walletState.network) return null;

    const isTest = isTestnet();

    return (
        <div className={`flex items-center gap-2 text-sm ${isTest ? 'text-yellow-400' : 'text-green-400'}`}>
            <div className={`w-2 h-2 rounded-full ${isTest ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`} />
            <span>{isTest ? 'Testnet' : 'Mainnet'}</span>
        </div>
    );
}

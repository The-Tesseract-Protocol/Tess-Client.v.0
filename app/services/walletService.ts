/**
 * Wallet Service for Stellar/Soroban integration
 *
 * This service provides a unified interface for wallet operations using the Freighter wallet.
 *
 * References:
 * - Freighter API: https://docs.freighter.app/docs/guide/usingfreighterwebapp/
 * - Sign Auth Entries: https://developers.stellar.org/docs/build/guides/freighter/sign-auth-entries
 */

import {
    isConnected,
    isAllowed,
    setAllowed,
    requestAccess,
    getAddress,
    getNetworkDetails,
    signAuthEntry,
    signTransaction,
} from '@stellar/freighter-api';

// ==================== TYPE DEFINITIONS ====================

export interface WalletState {
    isInstalled: boolean;
    isConnected: boolean;
    isAllowed: boolean;
    address: string | null;
    network: NetworkInfo | null;
}

export interface NetworkInfo {
    network: string;
    networkPassphrase: string;
    networkUrl?: string;
}

export interface SignAuthEntryResult {
    signedAuthEntry: string;
    signerAddress: string;
}

export interface WalletError {
    code: WalletErrorCode;
    message: string;
}

export enum WalletErrorCode {
    NOT_INSTALLED = 'NOT_INSTALLED',
    NOT_ALLOWED = 'NOT_ALLOWED',
    USER_REJECTED = 'USER_REJECTED',
    NETWORK_MISMATCH = 'NETWORK_MISMATCH',
    SIGNING_FAILED = 'SIGNING_FAILED',
    UNKNOWN = 'UNKNOWN',
}

// ==================== WALLET SERVICE CLASS ====================

export class WalletService {
    private static instance: WalletService;

    private constructor() {}

    /**
     * Get singleton instance of WalletService
     */
    static getInstance(): WalletService {
        if (!WalletService.instance) {
            WalletService.instance = new WalletService();
        }
        return WalletService.instance;
    }

    /**
     * Check if Freighter extension is installed in the browser
     */
    async isFreighterInstalled(): Promise<boolean> {
        try {
            const result = await isConnected();
            return result.isConnected;
        } catch (error) {
            console.error('Error checking Freighter installation:', error);
            return false;
        }
    }

    /**
     * Check if the app has been previously allowed by the user
     */
    async isAppAllowed(): Promise<boolean> {
        try {
            const result = await isAllowed();
            return result.isAllowed;
        } catch (error) {
            console.error('Error checking app permission:', error);
            return false;
        }
    }

    /**
     * Request app permission from the user
     * This adds the app to Freighter's allow list
     */
    async requestPermission(): Promise<boolean> {
        try {
            const result = await setAllowed();
            return result.isAllowed;
        } catch (error) {
            console.error('Error requesting permission:', error);
            return false;
        }
    }

    /**
     * Connect to the wallet and get the user's public key
     * This will prompt the user to authorize the app if not already allowed
     */
    async connect(): Promise<{ address: string } | WalletError> {
        try {
            // First check if Freighter is installed
            const installed = await this.isFreighterInstalled();
            if (!installed) {
                return {
                    code: WalletErrorCode.NOT_INSTALLED,
                    message: 'Freighter wallet is not installed. Please install it from https://freighter.app',
                };
            }

            // Request access (this prompts the user if not already allowed)
            const accessResult = await requestAccess();

            if (accessResult.error) {
                // User rejected or other error
                return {
                    code: WalletErrorCode.USER_REJECTED,
                    message: accessResult.error.message || 'User rejected the connection request',
                };
            }

            return { address: accessResult.address };
        } catch (error: any) {
            console.error('Error connecting to wallet:', error);
            return {
                code: WalletErrorCode.UNKNOWN,
                message: error.message || 'Failed to connect to wallet',
            };
        }
    }

    /**
     * Get the currently connected address (without prompting)
     * Returns null if not connected
     */
    async getConnectedAddress(): Promise<string | null> {
        try {
            const allowed = await this.isAppAllowed();
            if (!allowed) {
                return null;
            }

            const result = await getAddress();
            if (result.error) {
                return null;
            }

            return result.address;
        } catch (error) {
            console.error('Error getting address:', error);
            return null;
        }
    }

    /**
     * Get the current network information from Freighter
     */
    async getNetworkInfo(): Promise<NetworkInfo | null> {
        try {
            const result = await getNetworkDetails();
            if (result.error) {
                return null;
            }

            return {
                network: result.network,
                networkPassphrase: result.networkPassphrase,
                networkUrl: result.networkUrl,
            };
        } catch (error) {
            console.error('Error getting network info:', error);
            return null;
        }
    }

    /**
     * Sign an authorization entry for Soroban contract calls
     * This is used for the batch payment authorization tree
     *
     * @param authEntryPreimageXdr - The XDR string of the HashIdPreimageSorobanAuthorization
     * @param address - Optional: specific address to sign with
     * @returns The signed authorization entry as base64 string
     */
    async signAuthEntry(
        authEntryPreimageXdr: string,
        address?: string
    ): Promise<SignAuthEntryResult | WalletError> {
        try {
            const options: { address?: string } = {};
            if (address) {
                options.address = address;
            }

            const result = await signAuthEntry(authEntryPreimageXdr, options);

            if (result.error) {
                return {
                    code: WalletErrorCode.SIGNING_FAILED,
                    message: result.error.message || 'Failed to sign authorization entry',
                };
            }

            return {
                signedAuthEntry: result.signedAuthEntry || '',
                signerAddress: result.signerAddress || address || '',
            };
        } catch (error: any) {
            console.error('Error signing auth entry:', error);

            // Check for user rejection
            if (error.message?.includes('User declined')) {
                return {
                    code: WalletErrorCode.USER_REJECTED,
                    message: 'User declined to sign the authorization entry',
                };
            }

            return {
                code: WalletErrorCode.SIGNING_FAILED,
                message: error.message || 'Failed to sign authorization entry',
            };
        }
    }

    /**
     * Sign a transaction XDR
     *
     * @param transactionXdr - The XDR string of the transaction
     * @param network - Network name (TESTNET, PUBLIC, etc.)
     * @param address - Optional: specific address to sign with
     * @returns The signed transaction XDR
     */
    async signTransaction(
        transactionXdr: string,
        network: string = 'TESTNET',
        address?: string
    ): Promise<string | WalletError> {
        try {
            const options: { network?: string; address?: string; networkPassphrase?: string } = {
                network,
            };

            if (address) {
                options.address = address;
            }

            const result = await signTransaction(transactionXdr, options);

            if (result.error) {
                return {
                    code: WalletErrorCode.SIGNING_FAILED,
                    message: result.error.message || 'Failed to sign transaction',
                };
            }

            return result.signedTxXdr;
        } catch (error: any) {
            console.error('Error signing transaction:', error);

            if (error.message?.includes('User declined')) {
                return {
                    code: WalletErrorCode.USER_REJECTED,
                    message: 'User declined to sign the transaction',
                };
            }

            return {
                code: WalletErrorCode.SIGNING_FAILED,
                message: error.message || 'Failed to sign transaction',
            };
        }
    }

    /**
     * Get the full wallet state
     */
    async getWalletState(): Promise<WalletState> {
        const isInstalled = await this.isFreighterInstalled();

        if (!isInstalled) {
            return {
                isInstalled: false,
                isConnected: false,
                isAllowed: false,
                address: null,
                network: null,
            };
        }

        const allowed = await this.isAppAllowed();

        if (!allowed) {
            return {
                isInstalled: true,
                isConnected: false,
                isAllowed: false,
                address: null,
                network: null,
            };
        }

        const address = await this.getConnectedAddress();
        const network = await this.getNetworkInfo();

        return {
            isInstalled: true,
            isConnected: !!address,
            isAllowed: true,
            address,
            network,
        };
    }

    /**
     * Verify the user is on the expected network
     */
    async verifyNetwork(expectedPassphrase: string): Promise<boolean> {
        const networkInfo = await this.getNetworkInfo();
        if (!networkInfo) {
            return false;
        }
        return networkInfo.networkPassphrase === expectedPassphrase;
    }
}

// Export singleton instance
export const walletService = WalletService.getInstance();

// Helper function to check if a result is an error
export function isWalletError(result: any): result is WalletError {
    return result && typeof result === 'object' && 'code' in result && 'message' in result;
}

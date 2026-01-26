(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/services/walletService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WalletErrorCode",
    ()=>WalletErrorCode,
    "WalletService",
    ()=>WalletService,
    "isWalletError",
    ()=>isWalletError,
    "walletService",
    ()=>walletService
]);
/**
 * Wallet Service for Stellar/Soroban integration
 *
 * This service provides a unified interface for wallet operations using the Freighter wallet.
 *
 * References:
 * - Freighter API: https://docs.freighter.app/docs/guide/usingfreighterwebapp/
 * - Sign Auth Entries: https://developers.stellar.org/docs/build/guides/freighter/sign-auth-entries
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$freighter$2d$api$2f$build$2f$index$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@stellar/freighter-api/build/index.min.js [app-client] (ecmascript)");
;
var WalletErrorCode = /*#__PURE__*/ function(WalletErrorCode) {
    WalletErrorCode["NOT_INSTALLED"] = "NOT_INSTALLED";
    WalletErrorCode["NOT_ALLOWED"] = "NOT_ALLOWED";
    WalletErrorCode["USER_REJECTED"] = "USER_REJECTED";
    WalletErrorCode["NETWORK_MISMATCH"] = "NETWORK_MISMATCH";
    WalletErrorCode["SIGNING_FAILED"] = "SIGNING_FAILED";
    WalletErrorCode["UNKNOWN"] = "UNKNOWN";
    return WalletErrorCode;
}({});
class WalletService {
    static instance;
    constructor(){}
    /**
     * Get singleton instance of WalletService
     */ static getInstance() {
        if (!WalletService.instance) {
            WalletService.instance = new WalletService();
        }
        return WalletService.instance;
    }
    /**
     * Check if Freighter extension is installed in the browser
     */ async isFreighterInstalled() {
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$freighter$2d$api$2f$build$2f$index$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isConnected"])();
            return result.isConnected;
        } catch (error) {
            console.error('Error checking Freighter installation:', error);
            return false;
        }
    }
    /**
     * Check if the app has been previously allowed by the user
     */ async isAppAllowed() {
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$freighter$2d$api$2f$build$2f$index$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isAllowed"])();
            return result.isAllowed;
        } catch (error) {
            console.error('Error checking app permission:', error);
            return false;
        }
    }
    /**
     * Request app permission from the user
     * This adds the app to Freighter's allow list
     */ async requestPermission() {
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$freighter$2d$api$2f$build$2f$index$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAllowed"])();
            return result.isAllowed;
        } catch (error) {
            console.error('Error requesting permission:', error);
            return false;
        }
    }
    /**
     * Connect to the wallet and get the user's public key
     * This will prompt the user to authorize the app if not already allowed
     */ async connect() {
        try {
            // First check if Freighter is installed
            const installed = await this.isFreighterInstalled();
            if (!installed) {
                return {
                    code: "NOT_INSTALLED",
                    message: 'Freighter wallet is not installed. Please install it from https://freighter.app'
                };
            }
            // Request access (this prompts the user if not already allowed)
            const accessResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$freighter$2d$api$2f$build$2f$index$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["requestAccess"])();
            if (accessResult.error) {
                // User rejected or other error
                return {
                    code: "USER_REJECTED",
                    message: accessResult.error.message || 'User rejected the connection request'
                };
            }
            return {
                address: accessResult.address
            };
        } catch (error) {
            console.error('Error connecting to wallet:', error);
            return {
                code: "UNKNOWN",
                message: error.message || 'Failed to connect to wallet'
            };
        }
    }
    /**
     * Get the currently connected address (without prompting)
     * Returns null if not connected
     */ async getConnectedAddress() {
        try {
            const allowed = await this.isAppAllowed();
            if (!allowed) {
                return null;
            }
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$freighter$2d$api$2f$build$2f$index$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAddress"])();
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
     */ async getNetworkInfo() {
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$freighter$2d$api$2f$build$2f$index$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNetworkDetails"])();
            if (result.error) {
                return null;
            }
            return {
                network: result.network,
                networkPassphrase: result.networkPassphrase,
                networkUrl: result.networkUrl
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
     */ async signAuthEntry(authEntryPreimageXdr, address) {
        try {
            const options = {};
            if (address) {
                options.address = address;
            }
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$freighter$2d$api$2f$build$2f$index$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signAuthEntry"])(authEntryPreimageXdr, options);
            if (result.error) {
                return {
                    code: "SIGNING_FAILED",
                    message: result.error.message || 'Failed to sign authorization entry'
                };
            }
            return {
                signedAuthEntry: result.signedAuthEntry || '',
                signerAddress: result.signerAddress || address || ''
            };
        } catch (error) {
            console.error('Error signing auth entry:', error);
            // Check for user rejection
            if (error.message?.includes('User declined')) {
                return {
                    code: "USER_REJECTED",
                    message: 'User declined to sign the authorization entry'
                };
            }
            return {
                code: "SIGNING_FAILED",
                message: error.message || 'Failed to sign authorization entry'
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
     */ async signTransaction(transactionXdr, network = 'TESTNET', address) {
        try {
            const options = {
                network
            };
            if (address) {
                options.address = address;
            }
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$freighter$2d$api$2f$build$2f$index$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signTransaction"])(transactionXdr, options);
            if (result.error) {
                return {
                    code: "SIGNING_FAILED",
                    message: result.error.message || 'Failed to sign transaction'
                };
            }
            return result.signedTxXdr;
        } catch (error) {
            console.error('Error signing transaction:', error);
            if (error.message?.includes('User declined')) {
                return {
                    code: "USER_REJECTED",
                    message: 'User declined to sign the transaction'
                };
            }
            return {
                code: "SIGNING_FAILED",
                message: error.message || 'Failed to sign transaction'
            };
        }
    }
    /**
     * Get the full wallet state
     */ async getWalletState() {
        const isInstalled = await this.isFreighterInstalled();
        if (!isInstalled) {
            return {
                isInstalled: false,
                isConnected: false,
                isAllowed: false,
                address: null,
                network: null
            };
        }
        const allowed = await this.isAppAllowed();
        if (!allowed) {
            return {
                isInstalled: true,
                isConnected: false,
                isAllowed: false,
                address: null,
                network: null
            };
        }
        const address = await this.getConnectedAddress();
        const network = await this.getNetworkInfo();
        return {
            isInstalled: true,
            isConnected: !!address,
            isAllowed: true,
            address,
            network
        };
    }
    /**
     * Verify the user is on the expected network
     */ async verifyNetwork(expectedPassphrase) {
        const networkInfo = await this.getNetworkInfo();
        if (!networkInfo) {
            return false;
        }
        return networkInfo.networkPassphrase === expectedPassphrase;
    }
}
const walletService = WalletService.getInstance();
function isWalletError(result) {
    return result && typeof result === 'object' && 'code' in result && 'message' in result;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/contexts/WalletContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConnectWalletButton",
    ()=>ConnectWalletButton,
    "NetworkBadge",
    ()=>NetworkBadge,
    "WalletProvider",
    ()=>WalletProvider,
    "useWallet",
    ()=>useWallet
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$walletService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/services/walletService.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
'use client';
;
;
const defaultWalletState = {
    isInstalled: false,
    isConnected: false,
    isAllowed: false,
    address: null,
    network: null
};
// ==================== CONTEXT ====================
const WalletContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function WalletProvider({ children }) {
    _s();
    const [walletState, setWalletState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultWalletState);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    /**
     * Refresh the wallet state from Freighter
     */ const refreshState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WalletProvider.useCallback[refreshState]": async ()=>{
            try {
                const state = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$walletService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["walletService"].getWalletState();
                setWalletState(state);
                setError(null);
            } catch (err) {
                console.error('Error refreshing wallet state:', err);
                setError({
                    code: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$walletService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WalletErrorCode"].UNKNOWN,
                    message: err.message || 'Failed to refresh wallet state'
                });
            }
        }
    }["WalletProvider.useCallback[refreshState]"], []);
    /**
     * Initial load of wallet state
     */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WalletProvider.useEffect": ()=>{
            const initialize = {
                "WalletProvider.useEffect.initialize": async ()=>{
                    setIsLoading(true);
                    await refreshState();
                    setIsLoading(false);
                }
            }["WalletProvider.useEffect.initialize"];
            // Only run in browser
            if ("TURBOPACK compile-time truthy", 1) {
                initialize();
            } else //TURBOPACK unreachable
            ;
        }
    }["WalletProvider.useEffect"], [
        refreshState
    ]);
    /**
     * Listen for account changes in Freighter
     * Note: This requires Freighter to emit events, which may not be available in all versions
     */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WalletProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            // Poll for changes every 5 seconds if connected
            let pollInterval = null;
            if (walletState.isConnected) {
                pollInterval = setInterval({
                    "WalletProvider.useEffect": async ()=>{
                        const currentAddress = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$walletService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["walletService"].getConnectedAddress();
                        if (currentAddress !== walletState.address) {
                            await refreshState();
                        }
                    }
                }["WalletProvider.useEffect"], 5000);
            }
            return ({
                "WalletProvider.useEffect": ()=>{
                    if (pollInterval) {
                        clearInterval(pollInterval);
                    }
                }
            })["WalletProvider.useEffect"];
        }
    }["WalletProvider.useEffect"], [
        walletState.isConnected,
        walletState.address,
        refreshState
    ]);
    /**
     * Connect to the wallet
     */ const connect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WalletProvider.useCallback[connect]": async ()=>{
            setIsLoading(true);
            setError(null);
            try {
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$walletService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["walletService"].connect();
                if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$walletService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isWalletError"])(result)) {
                    setError(result);
                    setIsLoading(false);
                    return false;
                }
                // Successfully connected, refresh state
                await refreshState();
                setIsLoading(false);
                return true;
            } catch (err) {
                console.error('Error connecting wallet:', err);
                setError({
                    code: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$walletService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WalletErrorCode"].UNKNOWN,
                    message: err.message || 'Failed to connect wallet'
                });
                setIsLoading(false);
                return false;
            }
        }
    }["WalletProvider.useCallback[connect]"], [
        refreshState
    ]);
    /**
     * Disconnect from the wallet (client-side only, doesn't revoke permission)
     */ const disconnect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WalletProvider.useCallback[disconnect]": ()=>{
            setWalletState({
                ...walletState,
                isConnected: false,
                address: null
            });
            setError(null);
        }
    }["WalletProvider.useCallback[disconnect]"], [
        walletState
    ]);
    /**
     * Sign an authorization entry
     */ const signAuthEntry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WalletProvider.useCallback[signAuthEntry]": async (authEntryPreimageXdr)=>{
            if (!walletState.isConnected || !walletState.address) {
                return {
                    code: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$walletService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WalletErrorCode"].NOT_ALLOWED,
                    message: 'Wallet not connected'
                };
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$walletService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["walletService"].signAuthEntry(authEntryPreimageXdr, walletState.address);
        }
    }["WalletProvider.useCallback[signAuthEntry]"], [
        walletState.isConnected,
        walletState.address
    ]);
    /**
     * Format address for display (truncate middle)
     */ const formatAddress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WalletProvider.useCallback[formatAddress]": (address)=>{
            if (!address || address.length < 10) return address;
            return `${address.slice(0, 4)}...${address.slice(-4)}`;
        }
    }["WalletProvider.useCallback[formatAddress]"], []);
    /**
     * Check if connected to testnet
     */ const isTestnet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WalletProvider.useCallback[isTestnet]": ()=>{
            if (!walletState.network) return false;
            return walletState.network.network === 'TESTNET' || walletState.network.networkPassphrase.includes('Test SDF Network');
        }
    }["WalletProvider.useCallback[isTestnet]"], [
        walletState.network
    ]);
    const value = {
        walletState,
        isLoading,
        error,
        connect,
        disconnect,
        refreshState,
        signAuthEntry,
        formatAddress,
        isTestnet
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(WalletContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/app/contexts/WalletContext.tsx",
        lineNumber: 208,
        columnNumber: 12
    }, this);
}
_s(WalletProvider, "b6X/BYCBoH9yJuhw72eTskrsbP4=");
_c = WalletProvider;
function useWallet() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
}
_s1(useWallet, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
function ConnectWalletButton({ className = '', onConnect, onError }) {
    _s2();
    const { walletState, isLoading, error, connect, disconnect, formatAddress } = useWallet();
    const handleClick = async ()=>{
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
            href: "https://freighter.app",
            target: "_blank",
            rel: "noopener noreferrer",
            className: `inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium text-sm hover:bg-white/90 transition-colors ${className}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-4 h-4",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    }, void 0, false, {
                        fileName: "[project]/app/contexts/WalletContext.tsx",
                        lineNumber: 254,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/contexts/WalletContext.tsx",
                    lineNumber: 253,
                    columnNumber: 17
                }, this),
                "Install Freighter"
            ]
        }, void 0, true, {
            fileName: "[project]/app/contexts/WalletContext.tsx",
            lineNumber: 247,
            columnNumber: 13
        }, this);
    }
    if (walletState.isConnected && walletState.address) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-2 h-2 rounded-full bg-green-500"
                        }, void 0, false, {
                            fileName: "[project]/app/contexts/WalletContext.tsx",
                            lineNumber: 265,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-sm text-white/80 font-mono",
                            children: formatAddress(walletState.address)
                        }, void 0, false, {
                            fileName: "[project]/app/contexts/WalletContext.tsx",
                            lineNumber: 266,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/contexts/WalletContext.tsx",
                    lineNumber: 264,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: handleClick,
                    className: "px-3 py-2 text-sm text-white/50 hover:text-white transition-colors",
                    children: "Disconnect"
                }, void 0, false, {
                    fileName: "[project]/app/contexts/WalletContext.tsx",
                    lineNumber: 270,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/contexts/WalletContext.tsx",
            lineNumber: 263,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: handleClick,
        disabled: isLoading,
        className: `inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium text-sm hover:bg-white/90 transition-colors disabled:opacity-50 ${className}`,
        children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-4 h-4 animate-spin",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            className: "opacity-25",
                            cx: "12",
                            cy: "12",
                            r: "10",
                            stroke: "currentColor",
                            strokeWidth: "4"
                        }, void 0, false, {
                            fileName: "[project]/app/contexts/WalletContext.tsx",
                            lineNumber: 289,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            className: "opacity-75",
                            fill: "currentColor",
                            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        }, void 0, false, {
                            fileName: "[project]/app/contexts/WalletContext.tsx",
                            lineNumber: 290,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/contexts/WalletContext.tsx",
                    lineNumber: 288,
                    columnNumber: 21
                }, this),
                "Connecting..."
            ]
        }, void 0, true) : 'Connect Wallet'
    }, void 0, false, {
        fileName: "[project]/app/contexts/WalletContext.tsx",
        lineNumber: 281,
        columnNumber: 9
    }, this);
}
_s2(ConnectWalletButton, "xX/Ujpi3SKkOl7qBYmNjESWe64Y=", false, function() {
    return [
        useWallet
    ];
});
_c1 = ConnectWalletButton;
function NetworkBadge() {
    _s3();
    const { walletState, isTestnet } = useWallet();
    if (!walletState.network) return null;
    const isTest = isTestnet();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex items-center gap-2 text-sm ${isTest ? 'text-yellow-400' : 'text-green-400'}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `w-2 h-2 rounded-full ${isTest ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`
            }, void 0, false, {
                fileName: "[project]/app/contexts/WalletContext.tsx",
                lineNumber: 311,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: isTest ? 'Testnet' : 'Mainnet'
            }, void 0, false, {
                fileName: "[project]/app/contexts/WalletContext.tsx",
                lineNumber: 312,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/contexts/WalletContext.tsx",
        lineNumber: 310,
        columnNumber: 9
    }, this);
}
_s3(NetworkBadge, "L1tkyOFKb8dWTI9Z+knrQj8LbaY=", false, function() {
    return [
        useWallet
    ];
});
_c2 = NetworkBadge;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "WalletProvider");
__turbopack_context__.k.register(_c1, "ConnectWalletButton");
__turbopack_context__.k.register(_c2, "NetworkBadge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/internal/font/google/lexend_tera_c343b42e.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "className": "lexend_tera_c343b42e-module__33zOOW__className",
  "variable": "lexend_tera_c343b42e-module__33zOOW__variable",
});
}),
"[next]/internal/font/google/lexend_tera_c343b42e.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$lexend_tera_c343b42e$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[next]/internal/font/google/lexend_tera_c343b42e.module.css [app-client] (css module)");
;
const fontData = {
    className: __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$lexend_tera_c343b42e$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].className,
    style: {
        fontFamily: "'Lexend Tera', 'Lexend Tera Fallback'",
        fontStyle: "normal"
    }
};
if (__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$lexend_tera_c343b42e$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].variable != null) {
    fontData.variable = __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$lexend_tera_c343b42e$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].variable;
}
const __TURBOPACK__default__export__ = fontData;
}),
"[project]/app/components/Fonts.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$lexend_tera_c343b42e$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/lexend_tera_c343b42e.js [app-client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
;
}),
"[next]/internal/font/google/lexend_tera_c343b42e.js [app-client] (ecmascript) <export default as lexendTera>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "lexendTera",
    ()=>__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$lexend_tera_c343b42e$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$lexend_tera_c343b42e$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[next]/internal/font/google/lexend_tera_c343b42e.js [app-client] (ecmascript)");
}),
"[project]/app/services/privacyPayService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildDepositTransaction",
    ()=>buildDepositTransaction,
    "checkAccountStatus",
    ()=>checkAccountStatus,
    "checkJobStatuses",
    ()=>checkJobStatuses,
    "deriveIdentity",
    ()=>deriveIdentity,
    "generateHashLN",
    ()=>generateHashLN,
    "generateWalletNonce",
    ()=>generateWalletNonce,
    "getCurrentLedger",
    ()=>getCurrentLedger,
    "getDeposits",
    ()=>getDeposits,
    "getSession",
    ()=>getSession,
    "getWithdrawals",
    ()=>getWithdrawals,
    "saveDeposit",
    ()=>saveDeposit,
    "saveWithdrawal",
    ()=>saveWithdrawal,
    "submitDepositTransaction",
    ()=>submitDepositTransaction,
    "submitWithdrawal",
    ()=>submitWithdrawal,
    "updateDepositStatus",
    ()=>updateDepositStatus,
    "updateWithdrawalStatus",
    ()=>updateWithdrawalStatus,
    "updateWithdrawalTxHash",
    ()=>updateWithdrawalTxHash
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * Privacy Pay Service
 *
 * Handles deposit transactions (on-chain) and withdrawal requests (API + encryption)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$stellar$2d$sdk$2f$dist$2f$stellar$2d$sdk$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@stellar/stellar-sdk/dist/stellar-sdk.min.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tweetnacl$2f$nacl$2d$fast$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tweetnacl/nacl-fast.js [app-client] (ecmascript)");
;
;
// ============================================================================
// Configuration
// ============================================================================
const CONFIG = {
    SOROBAN_RPC_URL: ("TURBOPACK compile-time value", "https://soroban-testnet.stellar.org") || 'https://soroban-testnet.stellar.org',
    NETWORK_PASSPHRASE: ("TURBOPACK compile-time value", "Test SDF Network ; September 2015") || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$stellar$2d$sdk$2f$dist$2f$stellar$2d$sdk$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Networks"].TESTNET,
    TREASURY_CONTRACT_ID: ("TURBOPACK compile-time value", "CDEARQL5O4OU24DP2IROVH2G33NBDQNMZBZGSMZL53QZAX3WC7VE246E") || '',
    IDM_CONTRACT_ID: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_IDM_CONTRACT_ID || '',
    ASSET_ADDRESS: ("TURBOPACK compile-time value", "CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA") || '',
    RELAYER_URL: ("TURBOPACK compile-time value", "http://localhost:3001/api/relayer") || 'http://localhost:3000/api/relayer',
    DISTRIBUTOR_RSA_PUBLIC_KEY: ("TURBOPACK compile-time value", "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1y0YV0EENoTk82DWWy4n57OSv8ilEIWSHSVlsvJMgZ/C+95H0aNJVWKjcIPaYOYSuF7sv/ZLuUtYt6vi8CCiRnyXLLno7huh6rlvC6H8k4Zu8G0P+uNy8XimiF6K8PROnLlQfSjiYRVmjAUkRqCT\nOeDGvvDnC5fTDjMwBOOi8U6ve+HjV5Fnh4x2AN5x+9xKL6q/Gr7Ju8j4oUJJa6xmwU2MIbIrOtiU1irIDhLBQAJ/6vpYs8/xi6KQ3Mu1Gs6UnO51ITu0++0lsSJMHWdjqs6Xpbb56KnsWzOCSlG1TtpSU+8Ny8TCTpViz549MNLoWJvi/5uFxHi7CxxjlwP5rwIDAQAB") || '',
    RELAYER_NACL_PUBLIC_KEY: ("TURBOPACK compile-time value", "W8V80k2Kobco8yhEW6RiyzLmv7ortHBjiCo5OK0l/RM=") || ''
};
const BASE_FEE = '100';
// ============================================================================
// Base64 Utility Functions
// ============================================================================
function encodeBase64(arr) {
    return btoa(String.fromCharCode(...arr));
}
function decodeBase64(s) {
    return Uint8Array.from(atob(s), (c)=>c.charCodeAt(0));
}
async function generateHashLN(ledgerNumber, walletNonce) {
    const combined = `${ledgerNumber}${walletNonce}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(combined);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b)=>b.toString(16).padStart(2, '0')).join('');
    return hashHex.slice(0, 32);
}
async function deriveIdentity(hashLN, depositorAddress) {
    const combined = hashLN + depositorAddress;
    const encoder = new TextEncoder();
    const data = encoder.encode(combined);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = new Uint8Array(hashBuffer);
    // Use first 16 bytes as identity (matches contract)
    const identity = btoa(String.fromCharCode(...hashArray.slice(0, 16)));
    return identity;
}
async function getCurrentLedger() {
    const rpcServer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$stellar$2d$sdk$2f$dist$2f$stellar$2d$sdk$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rpc"].Server(CONFIG.SOROBAN_RPC_URL);
    const health = await rpcServer.getHealth();
    return health.latestLedger;
}
function generateWalletNonce() {
    return Math.floor(Math.random() * 1000000000);
}
async function checkAccountStatus(address) {
    try {
        const rpcServer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$stellar$2d$sdk$2f$dist$2f$stellar$2d$sdk$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rpc"].Server(CONFIG.SOROBAN_RPC_URL);
        // Check if account exists
        try {
            await rpcServer.getAccount(address);
        } catch (e) {
            if (e.message?.includes('Not Found') || e.code === 404) {
                return {
                    exists: false,
                    hasAsset: false,
                    error: 'Account does not exist. Please fund your wallet first.'
                };
            }
            throw e;
        }
        // For now, just return exists = true
        // TODO: Add asset balance check if needed
        return {
            exists: true,
            hasAsset: true
        };
    } catch (error) {
        return {
            exists: false,
            hasAsset: false,
            error: error.message
        };
    }
}
async function buildDepositTransaction(params) {
    const { depositorAddress, hashLN, amount } = params;
    if (!CONFIG.TREASURY_CONTRACT_ID || !CONFIG.ASSET_ADDRESS) {
        throw new Error('Missing required contract IDs. Check environment variables.');
    }
    // Log hashLN details to verify format
    console.log('[PrivacyPay Deposit] hashLN:', hashLN);
    console.log('[PrivacyPay Deposit] hashLN type:', typeof hashLN);
    console.log('[PrivacyPay Deposit] hashLN length:', hashLN.length);
    console.log('[PrivacyPay Deposit] Building deposit transaction:', {
        depositorAddress,
        hashLN,
        amount,
        treasuryContract: CONFIG.TREASURY_CONTRACT_ID,
        assetAddress: CONFIG.ASSET_ADDRESS,
        networkPassphrase: CONFIG.NETWORK_PASSPHRASE
    });
    const rpcServer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$stellar$2d$sdk$2f$dist$2f$stellar$2d$sdk$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rpc"].Server(CONFIG.SOROBAN_RPC_URL);
    // Check account status first
    const accountStatus = await checkAccountStatus(depositorAddress);
    if (!accountStatus.exists) {
        throw new Error(accountStatus.error || 'Account does not exist');
    }
    // Load account from Stellar
    const account = await rpcServer.getAccount(depositorAddress);
    console.log('[PrivacyPay] Account loaded, sequence:', account.sequenceNumber());
    // Create treasury contract instance
    const treasuryContract = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$stellar$2d$sdk$2f$dist$2f$stellar$2d$sdk$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Contract"](CONFIG.TREASURY_CONTRACT_ID);
    // Convert amount to stroops (7 decimals)
    const amountInStroops = Math.floor(amount * 10_000_000);
    console.log('[PrivacyPay] Amount in stroops:', amountInStroops);
    // Build transaction
    const transaction = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$stellar$2d$sdk$2f$dist$2f$stellar$2d$sdk$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransactionBuilder"](new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$stellar$2d$sdk$2f$dist$2f$stellar$2d$sdk$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Account"](depositorAddress, account.sequenceNumber()), {
        fee: BASE_FEE,
        networkPassphrase: CONFIG.NETWORK_PASSPHRASE
    }).addOperation(treasuryContract.call('deposit', (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$stellar$2d$sdk$2f$dist$2f$stellar$2d$sdk$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nativeToScVal"])(depositorAddress, {
        type: 'address'
    }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$stellar$2d$sdk$2f$dist$2f$stellar$2d$sdk$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nativeToScVal"])(hashLN, {
        type: 'string'
    }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$stellar$2d$sdk$2f$dist$2f$stellar$2d$sdk$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["nativeToScVal"])(amountInStroops, {
        type: 'i128'
    }))).setTimeout(30).build();
    console.log('[PrivacyPay] Transaction built, simulating...');
    // Simulate to get resource requirements
    const simulateResponse = await rpcServer.simulateTransaction(transaction);
    console.log('[PrivacyPay] Simulation response:', JSON.stringify(simulateResponse, null, 2));
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$stellar$2d$sdk$2f$dist$2f$stellar$2d$sdk$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rpc"].Api.isSimulationError(simulateResponse)) {
        // Extract more detailed error info
        const errorDetails = simulateResponse.error || 'Unknown simulation error';
        console.error('[PrivacyPay] Simulation error details:', errorDetails);
        throw new Error(`Simulation failed: ${errorDetails}`);
    }
    // Assemble with simulation results
    const preparedTx = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$stellar$2d$sdk$2f$dist$2f$stellar$2d$sdk$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rpc"].assembleTransaction(transaction, simulateResponse).build();
    console.log('[PrivacyPay] Transaction assembled successfully');
    // Return XDR for Freighter to sign
    return preparedTx.toXDR();
}
async function submitDepositTransaction(signedTxXdr) {
    try {
        const rpcServer = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$stellar$2d$sdk$2f$dist$2f$stellar$2d$sdk$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rpc"].Server(CONFIG.SOROBAN_RPC_URL);
        // Reconstruct transaction from XDR
        const transaction = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$stellar$2d$sdk$2f$dist$2f$stellar$2d$sdk$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TransactionBuilder"].fromXDR(signedTxXdr, CONFIG.NETWORK_PASSPHRASE);
        // Submit
        const sendResponse = await rpcServer.sendTransaction(transaction);
        if (sendResponse.status === 'ERROR') {
            return {
                success: false,
                error: `Transaction failed: ${JSON.stringify(sendResponse)}`
            };
        }
        // Wait for confirmation
        let getResponse = await rpcServer.getTransaction(sendResponse.hash);
        let attempts = 0;
        const maxAttempts = 30;
        while(getResponse.status === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$stellar$2d$sdk$2f$dist$2f$stellar$2d$sdk$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rpc"].Api.GetTransactionStatus.NOT_FOUND && attempts < maxAttempts){
            await new Promise((resolve)=>setTimeout(resolve, 1000));
            getResponse = await rpcServer.getTransaction(sendResponse.hash);
            attempts++;
        }
        if (getResponse.status === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$stellar$2d$sdk$2f$dist$2f$stellar$2d$sdk$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rpc"].Api.GetTransactionStatus.SUCCESS) {
            return {
                success: true,
                txHash: sendResponse.hash
            };
        } else {
            return {
                success: false,
                txHash: sendResponse.hash,
                error: `Transaction failed with status: ${getResponse.status}`
            };
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}
// ============================================================================
// Withdrawal Functions (API + Encryption)
// ============================================================================
/**
 * Encrypt recipients payload with Distributor's RSA public key
 * Uses Web Crypto API for browser compatibility
 */ async function encryptForDistributor(recipients) {
    let distributorPublicKeyPem = CONFIG.DISTRIBUTOR_RSA_PUBLIC_KEY;
    if (!distributorPublicKeyPem) {
        throw new Error('Distributor RSA public key not configured');
    }
    // Handle escaped newlines from env variable
    distributorPublicKeyPem = distributorPublicKeyPem.replace(/\\n/g, '\n');
    // Parse PEM to get the key
    const pemContents = distributorPublicKeyPem.replace('-----BEGIN PUBLIC KEY-----', '').replace('-----END PUBLIC KEY-----', '').replace(/\s/g, '');
    const keyData = Uint8Array.from(atob(pemContents), (c)=>c.charCodeAt(0));
    // Import the key
    const publicKey = await crypto.subtle.importKey('spki', keyData, {
        name: 'RSA-OAEP',
        hash: 'SHA-256'
    }, false, [
        'encrypt'
    ]);
    // Encrypt the payload
    const payloadStr = JSON.stringify(recipients);
    const payloadBytes = new TextEncoder().encode(payloadStr);
    const encryptedBuffer = await crypto.subtle.encrypt({
        name: 'RSA-OAEP'
    }, publicKey, payloadBytes);
    // Return as base64
    return btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
}
/**
 * NaCl box encryption for relayer
 * Uses tweetnacl for proper authenticated encryption
 */ function encryptForRelayer(hashLN, totalAmount, encryptedD, senderPublicKeyBase64) {
    const relayerPublicKeyBase64 = CONFIG.RELAYER_NACL_PUBLIC_KEY;
    if (!relayerPublicKeyBase64) {
        throw new Error('Relayer NaCl public key not configured');
    }
    // Decode relayer's public key
    const relayerPublicKey = decodeBase64(relayerPublicKeyBase64);
    const requestId = crypto.randomUUID();
    const timestamp = Date.now();
    // Create inner payload
    const innerPayload = {
        requestId,
        hashLN,
        totalAmount,
        encryptedD,
        senderPublicKey: senderPublicKeyBase64,
        timestamp
    };
    // Log the exact payload being sent to relayer
    console.log('[PrivacyPay Relayer Payload] hashLN in payload:', innerPayload.hashLN);
    console.log('[PrivacyPay Relayer Payload] Full payload (pre-encryption):', {
        requestId: innerPayload.requestId,
        hashLN: innerPayload.hashLN,
        totalAmount: innerPayload.totalAmount,
        senderPublicKey: innerPayload.senderPublicKey,
        timestamp: innerPayload.timestamp
    });
    const innerPayloadStr = JSON.stringify(innerPayload);
    const innerPayloadBytes = new TextEncoder().encode(innerPayloadStr);
    // Generate ephemeral keypair for this request
    const ephemeralKeypair = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tweetnacl$2f$nacl$2d$fast$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].box.keyPair();
    // Generate random nonce
    const nonce = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tweetnacl$2f$nacl$2d$fast$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].randomBytes(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tweetnacl$2f$nacl$2d$fast$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].box.nonceLength);
    // Encrypt with NaCl box
    const encryptedBox = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tweetnacl$2f$nacl$2d$fast$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].box(innerPayloadBytes, nonce, relayerPublicKey, ephemeralKeypair.secretKey);
    // Construct wire format: [EphemeralPublicKey(32)] + [Nonce(24)] + [Ciphertext]
    const wireFormat = new Uint8Array(ephemeralKeypair.publicKey.length + nonce.length + encryptedBox.length);
    wireFormat.set(ephemeralKeypair.publicKey, 0);
    wireFormat.set(nonce, ephemeralKeypair.publicKey.length);
    wireFormat.set(encryptedBox, ephemeralKeypair.publicKey.length + nonce.length);
    return encodeBase64(wireFormat);
}
async function submitWithdrawal(params) {
    try {
        const { hashLN, recipients, senderRawPublicKey } = params;
        // Log hashLN to verify it matches deposit format exactly
        console.log('[PrivacyPay Withdraw] hashLN:', hashLN);
        console.log('[PrivacyPay Withdraw] hashLN type:', typeof hashLN);
        console.log('[PrivacyPay Withdraw] hashLN length:', hashLN.length);
        // Calculate total amount
        const totalAmount = Object.values(recipients).reduce((sum, amt)=>sum + parseFloat(amt), 0);
        // Encrypt inner layer (for Distributor)
        const encryptedD = await encryptForDistributor(recipients);
        // Encrypt outer layer (for Relayer)
        const senderPublicKeyBase64 = encodeBase64(senderRawPublicKey);
        const encryptedPayload = encryptForRelayer(hashLN, totalAmount, encryptedD, senderPublicKeyBase64);
        // Submit to Relayer
        const response = await fetch(`${CONFIG.RELAYER_URL}/withdraw`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                payload: encryptedPayload
            })
        });
        const responseData = await response.json();
        if (!response.ok) {
            return {
                success: false,
                error: `Relayer rejected withdrawal: ${response.status} - ${JSON.stringify(responseData)}`
            };
        }
        return {
            success: true,
            requestId: responseData.requestId || responseData.jobId,
            jobId: responseData.jobId,
            senderIdentity: responseData.senderIdentity
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}
async function checkJobStatuses(jobIds) {
    try {
        // Get all statuses (API doesn't support filtering by jobIds)
        const response = await fetch(`${CONFIG.RELAYER_URL}/status`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Failed to check job statuses: ${response.status}`);
        }
        const allJobs = await response.json();
        // Filter and transform the jobs to match our expected format
        const matchingJobs = allJobs.filter((job)=>jobIds.includes(job._id)).map((job)=>({
                jobId: job._id,
                status: job.status === 'SUCCESS' ? 'completed' : job.status === 'PENDING' ? 'pending' : job.status === 'PROCESSING' ? 'processing' : 'failed',
                txHash: job.stellarTransactionHash
            }));
        return {
            jobs: matchingJobs
        };
    } catch (error) {
        console.error('Error checking job statuses:', error);
        return {
            jobs: []
        };
    }
}
// ============================================================================
// Session Management (localStorage)
// ============================================================================
const STORAGE_KEY = 'tesseract_privacy_pay';
function getSession(walletAddress) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        return {
            walletAddress,
            deposits: {},
            withdrawals: {}
        };
    }
    try {
        const sessions = JSON.parse(stored);
        return sessions[walletAddress] || {
            walletAddress,
            deposits: {},
            withdrawals: {}
        };
    } catch  {
        return {
            walletAddress,
            deposits: {},
            withdrawals: {}
        };
    }
}
/**
 * Save session for a wallet address
 */ function saveSession(session) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const stored = localStorage.getItem(STORAGE_KEY);
    let sessions = {};
    if (stored) {
        try {
            sessions = JSON.parse(stored);
        } catch  {
            sessions = {};
        }
    }
    sessions[session.walletAddress] = session;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}
function saveDeposit(walletAddress, deposit) {
    const session = getSession(walletAddress);
    session.deposits[deposit.hashLN] = deposit;
    saveSession(session);
}
function getDeposits(walletAddress) {
    const session = getSession(walletAddress);
    return Object.values(session.deposits).sort((a, b)=>b.timestamp - a.timestamp);
}
function saveWithdrawal(walletAddress, withdrawal) {
    const session = getSession(walletAddress);
    session.withdrawals[withdrawal.requestId] = withdrawal;
    saveSession(session);
}
function getWithdrawals(walletAddress) {
    const session = getSession(walletAddress);
    return Object.values(session.withdrawals).sort((a, b)=>b.timestamp - a.timestamp);
}
function updateDepositStatus(walletAddress, hashLN, status, txHash) {
    const session = getSession(walletAddress);
    if (session.deposits[hashLN]) {
        session.deposits[hashLN].status = status;
        if (txHash) {
            session.deposits[hashLN].txHash = txHash;
        }
        saveSession(session);
    }
}
function updateWithdrawalStatus(walletAddress, requestId, status) {
    const session = getSession(walletAddress);
    if (session.withdrawals[requestId]) {
        session.withdrawals[requestId].status = status;
        saveSession(session);
    }
}
function updateWithdrawalTxHash(walletAddress, jobId, txHash) {
    const session = getSession(walletAddress);
    const withdrawal = Object.values(session.withdrawals).find((w)=>w.jobId === jobId);
    if (withdrawal) {
        withdrawal.txHash = txHash;
        withdrawal.status = 'completed';
        session.withdrawals[withdrawal.requestId] = withdrawal;
        saveSession(session);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/privacy-pay/components/DepositForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DepositForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$contexts$2f$WalletContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/contexts/WalletContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$privacyPayService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/services/privacyPayService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$freighter$2d$api$2f$build$2f$index$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@stellar/freighter-api/build/index.min.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function DepositForm({ onSuccess }) {
    _s();
    const { walletState } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$contexts$2f$WalletContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWallet"])();
    const { address, isConnected } = walletState;
    const [amount, setAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [txHash, setTxHash] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [generatedHashLN, setGeneratedHashLN] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const handleDeposit = async ()=>{
        if (!address || !amount) return;
        const depositAmount = parseFloat(amount);
        if (isNaN(depositAmount) || depositAmount <= 0) {
            setError('Please enter a valid amount');
            return;
        }
        setError(null);
        setTxHash(null);
        try {
            // Step 1: Generate hashLN
            setStatus('generating');
            const ledgerNumber = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$privacyPayService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentLedger"])();
            const walletNonce = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$privacyPayService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateWalletNonce"])();
            const hashLN = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$privacyPayService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateHashLN"])(ledgerNumber, walletNonce);
            setGeneratedHashLN(hashLN);
            // Derive identity for tracking
            const identity = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$privacyPayService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deriveIdentity"])(hashLN, address);
            // Save pending deposit to session
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$privacyPayService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveDeposit"])(address, {
                hashLN,
                identity,
                amount: depositAmount,
                txHash: '',
                timestamp: Date.now(),
                status: 'pending'
            });
            // Step 2: Build transaction
            setStatus('building');
            const txXdr = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$privacyPayService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildDepositTransaction"])({
                depositorAddress: address,
                hashLN,
                amount: depositAmount
            });
            // Step 3: Sign with Freighter
            setStatus('signing');
            const signResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$freighter$2d$api$2f$build$2f$index$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signTransaction"])(txXdr, {
                networkPassphrase: 'Test SDF Network ; September 2015'
            });
            if (typeof signResult === 'string') {
                throw new Error('Signing was cancelled');
            }
            const signedXdr = signResult.signedTxXdr;
            // Step 4: Submit transaction
            setStatus('submitting');
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$privacyPayService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["submitDepositTransaction"])(signedXdr);
            if (result.success && result.txHash) {
                setTxHash(result.txHash);
                setStatus('success');
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$privacyPayService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDepositStatus"])(address, hashLN, 'confirmed', result.txHash);
                onSuccess?.(result.txHash, hashLN);
            } else {
                throw new Error(result.error || 'Transaction failed');
            }
        } catch (err) {
            console.error('Deposit error:', err);
            setError(err.message || 'Deposit failed');
            setStatus('error');
            if (generatedHashLN && address) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$privacyPayService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDepositStatus"])(address, generatedHashLN, 'failed');
            }
        }
    };
    const getStatusMessage = ()=>{
        switch(status){
            case 'generating':
                return 'Generating secure hash...';
            case 'building':
                return 'Building transaction...';
            case 'signing':
                return 'Please sign in Freighter...';
            case 'submitting':
                return 'Submitting to Stellar...';
            case 'success':
                return 'Deposit successful!';
            case 'error':
                return error || 'An error occurred';
            default:
                return null;
        }
    };
    const isProcessing = [
        'generating',
        'building',
        'signing',
        'submitting'
    ].includes(status);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-sm font-medium text-white/60 mb-2",
                        children: "Deposit Amount (USDC)"
                    }, void 0, false, {
                        fileName: "[project]/app/privacy-pay/components/DepositForm.tsx",
                        lineNumber: 132,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                value: amount,
                                onChange: (e)=>setAmount(e.target.value),
                                placeholder: "0.00",
                                disabled: isProcessing,
                                className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            }, void 0, false, {
                                fileName: "[project]/app/privacy-pay/components/DepositForm.tsx",
                                lineNumber: 136,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-sm",
                                children: "USDC"
                            }, void 0, false, {
                                fileName: "[project]/app/privacy-pay/components/DepositForm.tsx",
                                lineNumber: 144,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/privacy-pay/components/DepositForm.tsx",
                        lineNumber: 135,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/privacy-pay/components/DepositForm.tsx",
                lineNumber: 131,
                columnNumber: 7
            }, this),
            getStatusMessage() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `flex items-center gap-3 p-4 rounded-xl ${status === 'success' ? 'bg-green-500/10 border border-green-500/20' : status === 'error' ? 'bg-red-500/10 border border-red-500/20' : 'bg-white/5 border border-white/10'}`,
                children: [
                    isProcessing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/app/privacy-pay/components/DepositForm.tsx",
                        lineNumber: 168,
                        columnNumber: 13
                    }, this),
                    status === 'success' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-5 h-5 text-green-400",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M5 13l4 4L19 7"
                        }, void 0, false, {
                            fileName: "[project]/app/privacy-pay/components/DepositForm.tsx",
                            lineNumber: 172,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/privacy-pay/components/DepositForm.tsx",
                        lineNumber: 171,
                        columnNumber: 13
                    }, this),
                    status === 'error' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-5 h-5 text-red-400",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M6 18L18 6M6 6l12 12"
                        }, void 0, false, {
                            fileName: "[project]/app/privacy-pay/components/DepositForm.tsx",
                            lineNumber: 177,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/privacy-pay/components/DepositForm.tsx",
                        lineNumber: 176,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `text-sm ${status === 'success' ? 'text-green-400' : status === 'error' ? 'text-red-400' : 'text-white/60'}`,
                        children: getStatusMessage()
                    }, void 0, false, {
                        fileName: "[project]/app/privacy-pay/components/DepositForm.tsx",
                        lineNumber: 180,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/privacy-pay/components/DepositForm.tsx",
                lineNumber: 158,
                columnNumber: 9
            }, this),
            txHash && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white/5 border border-white/10 rounded-xl p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-xs font-medium text-white/40 mb-2",
                        children: "Transaction Hash"
                    }, void 0, false, {
                        fileName: "[project]/app/privacy-pay/components/DepositForm.tsx",
                        lineNumber: 197,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: `https://stellar.expert/explorer/testnet/tx/${txHash}`,
                        target: "_blank",
                        rel: "noopener noreferrer",
                        className: "font-mono text-sm text-blue-400 hover:text-blue-300 transition-colors break-all",
                        children: txHash
                    }, void 0, false, {
                        fileName: "[project]/app/privacy-pay/components/DepositForm.tsx",
                        lineNumber: 200,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/privacy-pay/components/DepositForm.tsx",
                lineNumber: 196,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleDeposit,
                disabled: !isConnected || !amount || isProcessing,
                className: `w-full py-4 rounded-xl font-semibold transition-all ${!isConnected || !amount || isProcessing ? 'bg-white/10 text-white/30 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white'}`,
                children: !isConnected ? 'Connect Wallet First' : isProcessing ? getStatusMessage() : 'Deposit to Privacy Pool'
            }, void 0, false, {
                fileName: "[project]/app/privacy-pay/components/DepositForm.tsx",
                lineNumber: 212,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/privacy-pay/components/DepositForm.tsx",
        lineNumber: 129,
        columnNumber: 5
    }, this);
}
_s(DepositForm, "m81yE6lhXsuevhrnZLBbASX7hUY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$contexts$2f$WalletContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWallet"]
    ];
});
_c = DepositForm;
var _c;
__turbopack_context__.k.register(_c, "DepositForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/privacy-pay/components/WithdrawForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WithdrawForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$contexts$2f$WalletContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/contexts/WalletContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$privacyPayService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/services/privacyPayService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$stellar$2d$sdk$2f$dist$2f$stellar$2d$sdk$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@stellar/stellar-sdk/dist/stellar-sdk.min.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function WithdrawForm({ onSuccess }) {
    _s();
    const { walletState } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$contexts$2f$WalletContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWallet"])();
    const { address, isConnected } = walletState;
    const [hashLN, setHashLN] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [recipients, setRecipients] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            address: '',
            amount: ''
        }
    ]);
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [requestId, setRequestId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // CSV upload state
    const [inputMode, setInputMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('manual');
    const [csvError, setCsvError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [csvFileName, setCsvFileName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Get user's deposits for hashLN selection
    const userDeposits = address ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$privacyPayService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDeposits"])(address) : [];
    // CSV parsing function
    const parseCSV = (content)=>{
        const lines = content.trim().split('\n');
        const parsedRecipients = [];
        // Detect and skip header
        let startLine = 0;
        const firstLine = lines[0]?.toLowerCase() || '';
        if (firstLine.includes('address') || firstLine.includes('recipient') || firstLine.includes('amount')) {
            startLine = 1;
        }
        for(let i = startLine; i < lines.length; i++){
            const line = lines[i].trim();
            if (!line) continue;
            const parts = line.split(',').map((p)=>p.trim());
            if (parts.length < 2) {
                return {
                    recipients: [],
                    error: `Invalid format at line ${i + 1}: expected "address,amount"`
                };
            }
            const addr = parts[0];
            const amount = parts[1];
            // Validate address
            if (!addr || addr.length !== 56 || !addr.startsWith('G')) {
                return {
                    recipients: [],
                    error: `Invalid Stellar address at line ${i + 1}: ${addr}`
                };
            }
            // Validate amount
            const amountNum = parseFloat(amount);
            if (isNaN(amountNum) || amountNum <= 0) {
                return {
                    recipients: [],
                    error: `Invalid amount at line ${i + 1}: ${amount}`
                };
            }
            parsedRecipients.push({
                address: addr,
                amount
            });
        }
        if (parsedRecipients.length === 0) {
            return {
                recipients: [],
                error: 'No valid recipients found in CSV'
            };
        }
        if (parsedRecipients.length > 10) {
            return {
                recipients: [],
                error: 'Maximum 10 recipients allowed per withdrawal'
            };
        }
        return {
            recipients: parsedRecipients
        };
    };
    // Handle CSV file upload
    const handleFileUpload = (event)=>{
        const file = event.target.files?.[0];
        if (!file) return;
        setCsvError(null);
        setCsvFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e)=>{
            const content = e.target?.result;
            const result = parseCSV(content);
            if (result.error) {
                setCsvError(result.error);
                setRecipients([
                    {
                        address: '',
                        amount: ''
                    }
                ]);
            } else {
                setRecipients(result.recipients);
                setCsvError(null);
            }
        };
        reader.onerror = ()=>{
            setCsvError('Failed to read file');
        };
        reader.readAsText(file);
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    // Handle mode switch
    const handleModeSwitch = (mode)=>{
        setInputMode(mode);
        setCsvError(null);
        setCsvFileName(null);
        if (mode === 'manual') {
            setRecipients([
                {
                    address: '',
                    amount: ''
                }
            ]);
        }
    };
    // Clear CSV and reset
    const clearCSV = ()=>{
        setRecipients([
            {
                address: '',
                amount: ''
            }
        ]);
        setCsvFileName(null);
        setCsvError(null);
    };
    const addRecipient = ()=>{
        setRecipients([
            ...recipients,
            {
                address: '',
                amount: ''
            }
        ]);
    };
    const removeRecipient = (index)=>{
        if (recipients.length > 1) {
            setRecipients(recipients.filter((_, i)=>i !== index));
        }
    };
    const updateRecipient = (index, field, value)=>{
        const updated = [
            ...recipients
        ];
        updated[index][field] = value;
        setRecipients(updated);
    };
    const getTotalAmount = ()=>{
        return recipients.reduce((sum, r)=>{
            const amt = parseFloat(r.amount);
            return sum + (isNaN(amt) ? 0 : amt);
        }, 0);
    };
    const isValidRecipient = (r)=>{
        return r.address.length === 56 && r.address.startsWith('G') && !isNaN(parseFloat(r.amount)) && parseFloat(r.amount) > 0;
    };
    const allRecipientsValid = recipients.every(isValidRecipient);
    const handleWithdraw = async ()=>{
        if (!address || !hashLN || !allRecipientsValid) return;
        setError(null);
        setRequestId(null);
        try {
            // Step 1: Prepare recipients map
            setStatus('encrypting');
            const recipientsMap = {};
            recipients.forEach((r)=>{
                recipientsMap[r.address] = r.amount;
            });
            // Get raw public key from address (32 bytes)
            // Note: In a real implementation, you'd need to get this from the wallet
            // For now, we'll derive it from the Stellar address
            const rawPublicKey = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$stellar$2f$stellar$2d$sdk$2f$dist$2f$stellar$2d$sdk$2e$min$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Keypair"].fromPublicKey(address).rawPublicKey();
            // Step 2: Submit withdrawal
            setStatus('submitting');
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$privacyPayService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["submitWithdrawal"])({
                hashLN,
                recipients: recipientsMap,
                senderPublicKey: address,
                senderRawPublicKey: rawPublicKey
            });
            if (result.success && result.requestId) {
                setRequestId(result.requestId);
                setStatus('success');
                // Save withdrawal to session with jobId
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$privacyPayService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveWithdrawal"])(address, {
                    requestId: result.requestId,
                    jobId: result.jobId,
                    hashLN,
                    totalAmount: getTotalAmount(),
                    recipients: recipientsMap,
                    timestamp: Date.now(),
                    status: 'pending',
                    senderIdentity: result.senderIdentity
                });
                onSuccess?.(result.requestId);
            } else {
                throw new Error(result.error || 'Withdrawal request failed');
            }
        } catch (err) {
            console.error('Withdrawal error:', err);
            setError(err.message || 'Withdrawal failed');
            setStatus('error');
        }
    };
    const getStatusMessage = ()=>{
        switch(status){
            case 'encrypting':
                return 'Encrypting withdrawal request...';
            case 'submitting':
                return 'Submitting to relayer...';
            case 'success':
                return 'Withdrawal request submitted!';
            case 'error':
                return error || 'An error occurred';
            default:
                return null;
        }
    };
    const isProcessing = [
        'encrypting',
        'submitting'
    ].includes(status);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-sm font-medium text-white/60 mb-2",
                        children: "Select Deposit"
                    }, void 0, false, {
                        fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                        lineNumber: 251,
                        columnNumber: 9
                    }, this),
                    userDeposits.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: hashLN,
                        onChange: (e)=>setHashLN(e.target.value),
                        disabled: isProcessing,
                        className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all disabled:opacity-50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "Select from your deposits"
                            }, void 0, false, {
                                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                lineNumber: 261,
                                columnNumber: 13
                            }, this),
                            userDeposits.filter((d)=>d.status === 'confirmed').map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: d.hashLN,
                                    children: [
                                        d.hashLN.slice(0, 16),
                                        "... (",
                                        d.amount,
                                        " USDC)"
                                    ]
                                }, d.hashLN, true, {
                                    fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                    lineNumber: 265,
                                    columnNumber: 17
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                        lineNumber: 255,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: hashLN,
                        onChange: (e)=>setHashLN(e.target.value),
                        placeholder: "Enter your deposit hash",
                        disabled: isProcessing,
                        className: "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all disabled:opacity-50 font-mono text-sm"
                    }, void 0, false, {
                        fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                        lineNumber: 271,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                lineNumber: 250,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-white/60",
                                children: "Recipients"
                            }, void 0, false, {
                                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                lineNumber: 286,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1 p-1 bg-white/5 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleModeSwitch('manual'),
                                        disabled: isProcessing,
                                        className: `px-3 py-1.5 text-xs font-medium rounded-md transition-all ${inputMode === 'manual' ? 'bg-purple-500/20 text-purple-400' : 'text-white/40 hover:text-white/60'} disabled:opacity-50`,
                                        children: "Manual"
                                    }, void 0, false, {
                                        fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                        lineNumber: 291,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleModeSwitch('csv'),
                                        disabled: isProcessing,
                                        className: `px-3 py-1.5 text-xs font-medium rounded-md transition-all ${inputMode === 'csv' ? 'bg-purple-500/20 text-purple-400' : 'text-white/40 hover:text-white/60'} disabled:opacity-50`,
                                        children: "CSV Upload"
                                    }, void 0, false, {
                                        fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                        lineNumber: 302,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                lineNumber: 290,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                        lineNumber: 285,
                        columnNumber: 9
                    }, this),
                    inputMode === 'csv' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                ref: fileInputRef,
                                type: "file",
                                accept: ".csv,.txt",
                                onChange: handleFileUpload,
                                className: "hidden"
                            }, void 0, false, {
                                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                lineNumber: 320,
                                columnNumber: 13
                            }, this),
                            !csvFileName ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>fileInputRef.current?.click(),
                                disabled: isProcessing,
                                className: "w-full border-2 border-dashed border-white/20 hover:border-purple-500/50 rounded-xl p-6 text-center transition-all disabled:opacity-50",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-8 h-8 mx-auto mb-2 text-white/40",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 1.5,
                                            d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                        }, void 0, false, {
                                            fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                            lineNumber: 336,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                        lineNumber: 335,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-white/60",
                                        children: "Click to upload CSV"
                                    }, void 0, false, {
                                        fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                        lineNumber: 338,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-white/30 mt-1",
                                        children: "Format: address,amount"
                                    }, void 0, false, {
                                        fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                        lineNumber: 339,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                lineNumber: 330,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white/5 border border-white/10 rounded-xl p-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        className: "w-5 h-5 text-purple-400",
                                                        fill: "none",
                                                        viewBox: "0 0 24 24",
                                                        stroke: "currentColor",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            strokeWidth: 2,
                                                            d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                                            lineNumber: 347,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                                        lineNumber: 346,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                                    lineNumber: 345,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-white",
                                                            children: csvFileName
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                                            lineNumber: 351,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-white/40",
                                                            children: [
                                                                recipients.filter((r)=>r.address && r.amount).length,
                                                                " recipients loaded"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                                            lineNumber: 352,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                                    lineNumber: 350,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                            lineNumber: 344,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: clearCSV,
                                            disabled: isProcessing,
                                            className: "p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-4 h-4 text-white/40",
                                                fill: "none",
                                                viewBox: "0 0 24 24",
                                                stroke: "currentColor",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M6 18L18 6M6 6l12 12"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                                    lineNumber: 361,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                                lineNumber: 360,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                            lineNumber: 355,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                    lineNumber: 343,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                lineNumber: 342,
                                columnNumber: 15
                            }, this),
                            csvError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-4 h-4 text-red-400 flex-shrink-0",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        }, void 0, false, {
                                            fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                            lineNumber: 372,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                        lineNumber: 371,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-red-400",
                                        children: csvError
                                    }, void 0, false, {
                                        fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                        lineNumber: 374,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                lineNumber: 370,
                                columnNumber: 15
                            }, this),
                            csvFileName && recipients.length > 0 && !csvError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white/5 border border-white/10 rounded-xl p-3 max-h-48 overflow-y-auto",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-white/40 mb-2",
                                        children: "Preview:"
                                    }, void 0, false, {
                                        fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                        lineNumber: 381,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1",
                                        children: [
                                            recipients.slice(0, 5).map((r, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex justify-between text-xs",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-mono text-white/60 truncate max-w-[60%]",
                                                            children: r.address
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                                            lineNumber: 385,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-purple-400",
                                                            children: [
                                                                r.amount,
                                                                " USDC"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                                            lineNumber: 386,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, i, true, {
                                                    fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                                    lineNumber: 384,
                                                    columnNumber: 21
                                                }, this)),
                                            recipients.length > 5 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-white/30 text-center pt-1",
                                                children: [
                                                    "+",
                                                    recipients.length - 5,
                                                    " more recipients"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                                lineNumber: 390,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                        lineNumber: 382,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                lineNumber: 380,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                        lineNumber: 318,
                        columnNumber: 11
                    }, this),
                    inputMode === 'manual' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-end mb-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: addRecipient,
                                    disabled: isProcessing || recipients.length >= 10,
                                    className: "text-sm text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50",
                                    children: "+ Add Recipient"
                                }, void 0, false, {
                                    fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                    lineNumber: 404,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                lineNumber: 403,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: recipients.map((recipient, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: recipient.address,
                                                onChange: (e)=>updateRecipient(index, 'address', e.target.value),
                                                placeholder: "G...",
                                                disabled: isProcessing,
                                                className: `flex-1 bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-1 transition-all disabled:opacity-50 font-mono text-sm ${recipient.address && !recipient.address.startsWith('G') ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/50' : 'border-white/10 focus:border-blue-500/50 focus:ring-blue-500/50'}`
                                            }, void 0, false, {
                                                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                                lineNumber: 415,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                value: recipient.amount,
                                                onChange: (e)=>updateRecipient(index, 'amount', e.target.value),
                                                placeholder: "Amount",
                                                disabled: isProcessing,
                                                className: "w-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all disabled:opacity-50"
                                            }, void 0, false, {
                                                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                                lineNumber: 427,
                                                columnNumber: 19
                                            }, this),
                                            recipients.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>removeRecipient(index),
                                                disabled: isProcessing,
                                                className: "p-3 hover:bg-white/10 rounded-xl transition-colors disabled:opacity-50",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "w-5 h-5 text-red-400",
                                                    fill: "none",
                                                    viewBox: "0 0 24 24",
                                                    stroke: "currentColor",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                                        lineNumber: 442,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                                    lineNumber: 441,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                                lineNumber: 436,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, index, true, {
                                        fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                        lineNumber: 414,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                lineNumber: 412,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, void 0, true, {
                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                lineNumber: 284,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white/5 border border-white/10 rounded-xl p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white/60",
                                children: "Total Withdrawal"
                            }, void 0, false, {
                                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                lineNumber: 456,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xl font-semibold text-white",
                                children: [
                                    getTotalAmount().toFixed(2),
                                    " USDC"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                lineNumber: 457,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                        lineNumber: 455,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center mt-2 text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white/40",
                                children: "Recipients"
                            }, void 0, false, {
                                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                lineNumber: 462,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white/60",
                                children: recipients.filter(isValidRecipient).length
                            }, void 0, false, {
                                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                lineNumber: 463,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                        lineNumber: 461,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                lineNumber: 454,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-purple-500/10 border border-purple-500/20 rounded-xl p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0",
                            fill: "none",
                            viewBox: "0 0 24 24",
                            stroke: "currentColor",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            }, void 0, false, {
                                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                lineNumber: 471,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                            lineNumber: 470,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm text-white/60",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-purple-400 font-medium mb-1",
                                    children: "Privacy Protection"
                                }, void 0, false, {
                                    fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                    lineNumber: 474,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-1 text-white/50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "Recipients are encrypted end-to-end"
                                        }, void 0, false, {
                                            fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                            lineNumber: 476,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "Relayer cannot see who receives funds"
                                        }, void 0, false, {
                                            fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                            lineNumber: 477,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: "Only the Distributor can decrypt recipients"
                                        }, void 0, false, {
                                            fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                            lineNumber: 478,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                                    lineNumber: 475,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                            lineNumber: 473,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                    lineNumber: 469,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                lineNumber: 468,
                columnNumber: 7
            }, this),
            getStatusMessage() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `flex items-center gap-3 p-4 rounded-xl ${status === 'success' ? 'bg-green-500/10 border border-green-500/20' : status === 'error' ? 'bg-red-500/10 border border-red-500/20' : 'bg-white/5 border border-white/10'}`,
                children: [
                    isProcessing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                        lineNumber: 496,
                        columnNumber: 13
                    }, this),
                    status === 'success' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-5 h-5 text-green-400",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M5 13l4 4L19 7"
                        }, void 0, false, {
                            fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                            lineNumber: 500,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                        lineNumber: 499,
                        columnNumber: 13
                    }, this),
                    status === 'error' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-5 h-5 text-red-400",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        stroke: "currentColor",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M6 18L18 6M6 6l12 12"
                        }, void 0, false, {
                            fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                            lineNumber: 505,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                        lineNumber: 504,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `text-sm ${status === 'success' ? 'text-green-400' : status === 'error' ? 'text-red-400' : 'text-white/60'}`,
                        children: getStatusMessage()
                    }, void 0, false, {
                        fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                        lineNumber: 508,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                lineNumber: 486,
                columnNumber: 9
            }, this),
            requestId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white/5 border border-white/10 rounded-xl p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-xs font-medium text-white/40 mb-2",
                        children: "Request ID"
                    }, void 0, false, {
                        fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                        lineNumber: 525,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                        className: "font-mono text-sm text-purple-400 break-all",
                        children: requestId
                    }, void 0, false, {
                        fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                        lineNumber: 528,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                lineNumber: 524,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleWithdraw,
                disabled: !isConnected || !hashLN || !allRecipientsValid || isProcessing,
                className: `w-full py-4 rounded-xl font-semibold transition-all ${!isConnected || !hashLN || !allRecipientsValid || isProcessing ? 'bg-white/10 text-white/30 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white'}`,
                children: !isConnected ? 'Connect Wallet First' : isProcessing ? getStatusMessage() : 'Submit Private Withdrawal'
            }, void 0, false, {
                fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
                lineNumber: 535,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/privacy-pay/components/WithdrawForm.tsx",
        lineNumber: 248,
        columnNumber: 5
    }, this);
}
_s(WithdrawForm, "LACb2c5vLzowMSNQe1FQwLu1m4Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$contexts$2f$WalletContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWallet"]
    ];
});
_c = WithdrawForm;
var _c;
__turbopack_context__.k.register(_c, "WithdrawForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/privacy-pay/components/TransactionHistory.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TransactionHistory
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$contexts$2f$WalletContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/contexts/WalletContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$privacyPayService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/services/privacyPayService.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function TransactionHistory() {
    _s();
    const { walletState } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$contexts$2f$WalletContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWallet"])();
    const { address } = walletState;
    const [deposits, setDeposits] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [withdrawals, setWithdrawals] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('deposits');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TransactionHistory.useEffect": ()=>{
            if (address) {
                setDeposits((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$privacyPayService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDeposits"])(address));
                setWithdrawals((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$privacyPayService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWithdrawals"])(address));
            }
        }
    }["TransactionHistory.useEffect"], [
        address,
        deposits.length,
        withdrawals.length
    ]);
    // Poll for job statuses every 3 minutes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TransactionHistory.useEffect": ()=>{
            if (!address) return;
            const pollInterval = 3 * 60 * 1000; // 3 minutes
            const pollJobs = {
                "TransactionHistory.useEffect.pollJobs": async ()=>{
                    // Get pending withdrawals (those without txHash)
                    const pendingWithdrawals = withdrawals.filter({
                        "TransactionHistory.useEffect.pollJobs.pendingWithdrawals": (w)=>w.jobId && !w.txHash
                    }["TransactionHistory.useEffect.pollJobs.pendingWithdrawals"]);
                    if (pendingWithdrawals.length === 0) return;
                    const jobIds = pendingWithdrawals.map({
                        "TransactionHistory.useEffect.pollJobs.jobIds": (w)=>w.jobId
                    }["TransactionHistory.useEffect.pollJobs.jobIds"]);
                    try {
                        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$privacyPayService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["checkJobStatuses"])(jobIds);
                        // Update withdrawals with new txHashes
                        let updated = false;
                        result.jobs.forEach({
                            "TransactionHistory.useEffect.pollJobs": (job)=>{
                                if (job.txHash) {
                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$privacyPayService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateWithdrawalTxHash"])(address, job.jobId, job.txHash);
                                    updated = true;
                                }
                            }
                        }["TransactionHistory.useEffect.pollJobs"]);
                        // Refresh withdrawals if any were updated
                        if (updated) {
                            setWithdrawals((0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$privacyPayService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWithdrawals"])(address));
                        }
                    } catch (error) {
                        console.error('Error polling job statuses:', error);
                    }
                }
            }["TransactionHistory.useEffect.pollJobs"];
            // Poll immediately on mount
            pollJobs();
            // Set up interval for polling
            const interval = setInterval(pollJobs, pollInterval);
            return ({
                "TransactionHistory.useEffect": ()=>clearInterval(interval)
            })["TransactionHistory.useEffect"];
        }
    }["TransactionHistory.useEffect"], [
        address,
        withdrawals
    ]);
    const formatDate = (timestamp)=>{
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const getStatusColor = (status)=>{
        switch(status){
            case 'confirmed':
            case 'completed':
                return 'text-green-400 bg-green-400/10';
            case 'pending':
            case 'processing':
                return 'text-yellow-400 bg-yellow-400/10';
            case 'failed':
                return 'text-red-400 bg-red-400/10';
            default:
                return 'text-white/40 bg-white/10';
        }
    };
    if (!address) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-12",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-12 h-12 text-white/20 mx-auto mb-4",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 1.5,
                        d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    }, void 0, false, {
                        fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                        lineNumber: 100,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                    lineNumber: 99,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-white/40",
                    children: "Connect wallet to view history"
                }, void 0, false, {
                    fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                    lineNumber: 102,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
            lineNumber: 98,
            columnNumber: 7
        }, this);
    }
    const isEmpty = deposits.length === 0 && withdrawals.length === 0;
    if (isEmpty) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center py-12",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: "w-12 h-12 text-white/20 mx-auto mb-4",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 1.5,
                        d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    }, void 0, false, {
                        fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                        lineNumber: 113,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                    lineNumber: 112,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-white/40",
                    children: "No transactions yet"
                }, void 0, false, {
                    fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                    lineNumber: 115,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-white/30 text-sm mt-1",
                    children: "Make a deposit to get started"
                }, void 0, false, {
                    fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                    lineNumber: 116,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
            lineNumber: 111,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('deposits'),
                        className: `px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'deposits' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'}`,
                        children: [
                            "Deposits (",
                            deposits.length,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                        lineNumber: 125,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab('withdrawals'),
                        className: `px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'withdrawals' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-white/5 text-white/60 hover:bg-white/10 border border-transparent'}`,
                        children: [
                            "Withdrawals (",
                            withdrawals.length,
                            ")"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                        lineNumber: 135,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, this),
            activeTab === 'deposits' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: deposits.map((deposit)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "w-4 h-4 text-blue-400",
                                                    fill: "none",
                                                    viewBox: "0 0 24 24",
                                                    stroke: "currentColor",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M19 14l-7 7m0 0l-7-7m7 7V3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                        lineNumber: 159,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                    lineNumber: 158,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                lineNumber: 157,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-white font-medium",
                                                        children: [
                                                            deposit.amount,
                                                            " USDC"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                        lineNumber: 163,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-white/40 text-xs",
                                                        children: formatDate(deposit.timestamp)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                        lineNumber: 164,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                lineNumber: 162,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                        lineNumber: 156,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `px-2 py-1 rounded text-xs font-medium ${getStatusColor(deposit.status)}`,
                                        children: deposit.status
                                    }, void 0, false, {
                                        fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                        lineNumber: 167,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                lineNumber: 155,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white/40",
                                                children: "Hash"
                                            }, void 0, false, {
                                                fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                lineNumber: 178,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                className: "text-white/60 font-mono text-xs",
                                                children: [
                                                    deposit.hashLN.slice(0, 16),
                                                    "..."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                lineNumber: 179,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                        lineNumber: 177,
                                        columnNumber: 17
                                    }, this),
                                    deposit.txHash && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white/40",
                                                children: "Transaction"
                                            }, void 0, false, {
                                                fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                lineNumber: 185,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: `https://stellar.expert/explorer/testnet/tx/${deposit.txHash}`,
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "text-blue-400 hover:text-blue-300 font-mono text-xs",
                                                children: [
                                                    deposit.txHash.slice(0, 8),
                                                    "..."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                lineNumber: 186,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                        lineNumber: 184,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                lineNumber: 176,
                                columnNumber: 15
                            }, this)
                        ]
                    }, deposit.hashLN, true, {
                        fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                        lineNumber: 151,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                lineNumber: 149,
                columnNumber: 9
            }, this),
            activeTab === 'withdrawals' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: withdrawals.map((withdrawal)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center",
                                                children: withdrawal.txHash ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "w-4 h-4 text-purple-400",
                                                    fill: "none",
                                                    viewBox: "0 0 24 24",
                                                    stroke: "currentColor",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M5 13l4 4L19 7"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                        lineNumber: 215,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                    lineNumber: 214,
                                                    columnNumber: 23
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-3 h-3 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                    lineNumber: 218,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                lineNumber: 212,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-white font-medium",
                                                        children: [
                                                            withdrawal.totalAmount,
                                                            " USDC"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                        lineNumber: 222,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-white/40 text-xs",
                                                        children: formatDate(withdrawal.timestamp)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                        lineNumber: 223,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                lineNumber: 221,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                        lineNumber: 211,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `px-2 py-1 rounded text-xs font-medium ${getStatusColor(withdrawal.txHash ? 'completed' : 'pending')}`,
                                        children: withdrawal.txHash ? 'completed' : 'pending'
                                    }, void 0, false, {
                                        fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                        lineNumber: 226,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                lineNumber: 210,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white/40",
                                                children: "Recipients"
                                            }, void 0, false, {
                                                fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                lineNumber: 237,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white/60",
                                                children: Object.keys(withdrawal.recipients).length
                                            }, void 0, false, {
                                                fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                lineNumber: 238,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                        lineNumber: 236,
                                        columnNumber: 17
                                    }, this),
                                    withdrawal.jobId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white/40",
                                                children: "Job ID"
                                            }, void 0, false, {
                                                fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                lineNumber: 244,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                className: "text-white/60 font-mono text-xs",
                                                children: [
                                                    withdrawal.jobId.slice(0, 8),
                                                    "..."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                lineNumber: 245,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                        lineNumber: 243,
                                        columnNumber: 19
                                    }, this),
                                    withdrawal.txHash ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white/40",
                                                children: "Transaction"
                                            }, void 0, false, {
                                                fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                lineNumber: 252,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: `https://stellar.expert/explorer/testnet/tx/${withdrawal.txHash}`,
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "text-purple-400 hover:text-purple-300 font-mono text-xs flex items-center gap-1",
                                                children: [
                                                    withdrawal.txHash.slice(0, 8),
                                                    "...",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        className: "w-3 h-3",
                                                        fill: "none",
                                                        viewBox: "0 0 24 24",
                                                        stroke: "currentColor",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            strokeWidth: 2,
                                                            d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                            lineNumber: 261,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                        lineNumber: 260,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                lineNumber: 253,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                        lineNumber: 251,
                                        columnNumber: 19
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white/40",
                                                children: "Status"
                                            }, void 0, false, {
                                                fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                lineNumber: 267,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-yellow-400 text-xs flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                        lineNumber: 269,
                                                        columnNumber: 23
                                                    }, this),
                                                    "Processing..."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                                lineNumber: 268,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                        lineNumber: 266,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                                lineNumber: 235,
                                columnNumber: 15
                            }, this)
                        ]
                    }, withdrawal.requestId, true, {
                        fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                        lineNumber: 206,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
                lineNumber: 204,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/privacy-pay/components/TransactionHistory.tsx",
        lineNumber: 122,
        columnNumber: 5
    }, this);
}
_s(TransactionHistory, "zoLHwcGO21GQ/jLaGJxp+qhHQ58=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$contexts$2f$WalletContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWallet"]
    ];
});
_c = TransactionHistory;
var _c;
__turbopack_context__.k.register(_c, "TransactionHistory");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/privacy-pay/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PrivacyPayPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$contexts$2f$WalletContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/contexts/WalletContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Fonts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/app/components/Fonts.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$lexend_tera_c343b42e$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lexendTera$3e$__ = __turbopack_context__.i("[next]/internal/font/google/lexend_tera_c343b42e.js [app-client] (ecmascript) <export default as lexendTera>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$privacy$2d$pay$2f$components$2f$DepositForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/privacy-pay/components/DepositForm.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$privacy$2d$pay$2f$components$2f$WithdrawForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/privacy-pay/components/WithdrawForm.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$privacy$2d$pay$2f$components$2f$TransactionHistory$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/privacy-pay/components/TransactionHistory.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function PrivacyPayContent() {
    _s();
    const { walletState, formatAddress } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$contexts$2f$WalletContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWallet"])();
    const { isConnected, address, network } = walletState;
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('deposit');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-black text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "w-full flex items-center justify-between py-6 px-8 md:px-16 fixed top-0 left-0 z-50 backdrop-blur-lg bg-black/60 border-b border-white/5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-x-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "/dashboard",
                                className: "flex items-center gap-2 text-white/80 hover:text-white transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-5 h-5",
                                        fill: "none",
                                        viewBox: "0 0 24 24",
                                        stroke: "currentColor",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M10 19l-7-7m0 0l7-7m-7 7h18"
                                        }, void 0, false, {
                                            fileName: "[project]/app/privacy-pay/page.tsx",
                                            lineNumber: 24,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/privacy-pay/page.tsx",
                                        lineNumber: 23,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hidden md:inline",
                                        children: "Back"
                                    }, void 0, false, {
                                        fileName: "[project]/app/privacy-pay/page.tsx",
                                        lineNumber: 26,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/privacy-pay/page.tsx",
                                lineNumber: 22,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-6 w-px bg-white/20"
                            }, void 0, false, {
                                fileName: "[project]/app/privacy-pay/page.tsx",
                                lineNumber: 28,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: "/Tess_BW.svg",
                                        alt: "Tesseract",
                                        className: "h-6 w-6 rounded"
                                    }, void 0, false, {
                                        fileName: "[project]/app/privacy-pay/page.tsx",
                                        lineNumber: 30,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `text-lg font-bold ${__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$lexend_tera_c343b42e$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lexendTera$3e$__["lexendTera"].className}`,
                                        children: "Privacy Pay"
                                    }, void 0, false, {
                                        fileName: "[project]/app/privacy-pay/page.tsx",
                                        lineNumber: 31,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/privacy-pay/page.tsx",
                                lineNumber: 29,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/privacy-pay/page.tsx",
                        lineNumber: 21,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: [
                            network && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full text-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `w-2 h-2 rounded-full ${network.network === 'TESTNET' ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`
                                    }, void 0, false, {
                                        fileName: "[project]/app/privacy-pay/page.tsx",
                                        lineNumber: 39,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-white/60",
                                        children: network.network
                                    }, void 0, false, {
                                        fileName: "[project]/app/privacy-pay/page.tsx",
                                        lineNumber: 40,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/privacy-pay/page.tsx",
                                lineNumber: 38,
                                columnNumber: 13
                            }, this),
                            isConnected && address ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-2 h-2 rounded-full bg-green-500"
                                    }, void 0, false, {
                                        fileName: "[project]/app/privacy-pay/page.tsx",
                                        lineNumber: 47,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono text-sm text-white/80",
                                        children: formatAddress(address)
                                    }, void 0, false, {
                                        fileName: "[project]/app/privacy-pay/page.tsx",
                                        lineNumber: 48,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/privacy-pay/page.tsx",
                                lineNumber: 46,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$contexts$2f$WalletContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConnectWalletButton"], {}, void 0, false, {
                                fileName: "[project]/app/privacy-pay/page.tsx",
                                lineNumber: 51,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/privacy-pay/page.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/privacy-pay/page.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pt-24 pb-12 px-4 md:px-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-6xl mx-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-12",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-4 h-4 text-purple-400",
                                            fill: "none",
                                            viewBox: "0 0 24 24",
                                            stroke: "currentColor",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            }, void 0, false, {
                                                fileName: "[project]/app/privacy-pay/page.tsx",
                                                lineNumber: 63,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/privacy-pay/page.tsx",
                                            lineNumber: 62,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-purple-400",
                                            children: "End-to-End Encrypted"
                                        }, void 0, false, {
                                            fileName: "[project]/app/privacy-pay/page.tsx",
                                            lineNumber: 65,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/privacy-pay/page.tsx",
                                    lineNumber: 61,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: `text-4xl md:text-5xl font-bold mb-4 ${__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$lexend_tera_c343b42e$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lexendTera$3e$__["lexendTera"].className}`,
                                    children: "Privacy Pay"
                                }, void 0, false, {
                                    fileName: "[project]/app/privacy-pay/page.tsx",
                                    lineNumber: 67,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-white/60 text-lg max-w-2xl mx-auto",
                                    children: "Deposit and withdraw funds with complete privacy. Your transaction details are encrypted and hidden from the public ledger."
                                }, void 0, false, {
                                    fileName: "[project]/app/privacy-pay/page.tsx",
                                    lineNumber: 70,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/privacy-pay/page.tsx",
                            lineNumber: 60,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "lg:col-span-2 space-y-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2 p-1 bg-white/5 rounded-xl",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setActiveTab('deposit'),
                                                    className: `flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${activeTab === 'deposit' ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: "w-5 h-5",
                                                            fill: "none",
                                                            viewBox: "0 0 24 24",
                                                            stroke: "currentColor",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                strokeWidth: 2,
                                                                d: "M19 14l-7 7m0 0l-7-7m7 7V3"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/privacy-pay/page.tsx",
                                                                lineNumber: 90,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/privacy-pay/page.tsx",
                                                            lineNumber: 89,
                                                            columnNumber: 19
                                                        }, this),
                                                        "Deposit"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/privacy-pay/page.tsx",
                                                    lineNumber: 81,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setActiveTab('withdraw'),
                                                    className: `flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${activeTab === 'withdraw' ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: "w-5 h-5",
                                                            fill: "none",
                                                            viewBox: "0 0 24 24",
                                                            stroke: "currentColor",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                strokeLinecap: "round",
                                                                strokeLinejoin: "round",
                                                                strokeWidth: 2,
                                                                d: "M5 10l7-7m0 0l7 7m-7-7v18"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/privacy-pay/page.tsx",
                                                                lineNumber: 103,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/privacy-pay/page.tsx",
                                                            lineNumber: 102,
                                                            columnNumber: 19
                                                        }, this),
                                                        "Withdraw"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/privacy-pay/page.tsx",
                                                    lineNumber: 94,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/privacy-pay/page.tsx",
                                            lineNumber: 80,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8",
                                            children: activeTab === 'deposit' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$privacy$2d$pay$2f$components$2f$DepositForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                fileName: "[project]/app/privacy-pay/page.tsx",
                                                lineNumber: 112,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$privacy$2d$pay$2f$components$2f$WithdrawForm$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                fileName: "[project]/app/privacy-pay/page.tsx",
                                                lineNumber: 114,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/privacy-pay/page.tsx",
                                            lineNumber: 110,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl p-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: `text-lg font-semibold mb-4 ${__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$lexend_tera_c343b42e$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lexendTera$3e$__["lexendTera"].className}`,
                                                    children: "How Privacy Pay Works"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/privacy-pay/page.tsx",
                                                    lineNumber: 120,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col items-center text-center p-4 bg-white/5 rounded-xl",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-3",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-blue-400 font-bold",
                                                                        children: "1"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/privacy-pay/page.tsx",
                                                                        lineNumber: 126,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/privacy-pay/page.tsx",
                                                                    lineNumber: 125,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "font-medium mb-1",
                                                                    children: "Deposit"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/privacy-pay/page.tsx",
                                                                    lineNumber: 128,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-white/50",
                                                                    children: "Funds are linked to a unique hash, not your address"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/privacy-pay/page.tsx",
                                                                    lineNumber: 129,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/privacy-pay/page.tsx",
                                                            lineNumber: 124,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col items-center text-center p-4 bg-white/5 rounded-xl",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-3",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-purple-400 font-bold",
                                                                        children: "2"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/privacy-pay/page.tsx",
                                                                        lineNumber: 135,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/privacy-pay/page.tsx",
                                                                    lineNumber: 134,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "font-medium mb-1",
                                                                    children: "Encrypt"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/privacy-pay/page.tsx",
                                                                    lineNumber: 137,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-white/50",
                                                                    children: "Withdrawal details are encrypted end-to-end"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/privacy-pay/page.tsx",
                                                                    lineNumber: 138,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/privacy-pay/page.tsx",
                                                            lineNumber: 133,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col items-center text-center p-4 bg-white/5 rounded-xl",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mb-3",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-green-400 font-bold",
                                                                        children: "3"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/privacy-pay/page.tsx",
                                                                        lineNumber: 144,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/privacy-pay/page.tsx",
                                                                    lineNumber: 143,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "font-medium mb-1",
                                                                    children: "Withdraw"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/privacy-pay/page.tsx",
                                                                    lineNumber: 146,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-white/50",
                                                                    children: "Recipients receive funds privately"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/privacy-pay/page.tsx",
                                                                    lineNumber: 147,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/privacy-pay/page.tsx",
                                                            lineNumber: 142,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/privacy-pay/page.tsx",
                                                    lineNumber: 123,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/privacy-pay/page.tsx",
                                            lineNumber: 119,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/privacy-pay/page.tsx",
                                    lineNumber: 78,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl p-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: `text-lg font-semibold mb-4 ${__TURBOPACK__imported__module__$5b$next$5d2f$internal$2f$font$2f$google$2f$lexend_tera_c343b42e$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__lexendTera$3e$__["lexendTera"].className}`,
                                                    children: "Your Activity"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/privacy-pay/page.tsx",
                                                    lineNumber: 158,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$privacy$2d$pay$2f$components$2f$TransactionHistory$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                                    fileName: "[project]/app/privacy-pay/page.tsx",
                                                    lineNumber: 161,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/privacy-pay/page.tsx",
                                            lineNumber: 157,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-white/10 rounded-2xl p-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start gap-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        className: "w-5 h-5 text-white/60",
                                                        fill: "none",
                                                        viewBox: "0 0 24 24",
                                                        stroke: "currentColor",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            strokeWidth: 2,
                                                            d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/privacy-pay/page.tsx",
                                                            lineNumber: 169,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/privacy-pay/page.tsx",
                                                        lineNumber: 168,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/privacy-pay/page.tsx",
                                                    lineNumber: 167,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/privacy-pay/page.tsx",
                                                lineNumber: 166,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/privacy-pay/page.tsx",
                                            lineNumber: 165,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/privacy-pay/page.tsx",
                                    lineNumber: 156,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/privacy-pay/page.tsx",
                            lineNumber: 76,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/privacy-pay/page.tsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/privacy-pay/page.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/privacy-pay/page.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
_s(PrivacyPayContent, "uNn/fZUmwP1Hw53QAUEz5slUMTg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$contexts$2f$WalletContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWallet"]
    ];
});
_c = PrivacyPayContent;
function PrivacyPayPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$contexts$2f$WalletContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WalletProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PrivacyPayContent, {}, void 0, false, {
            fileName: "[project]/app/privacy-pay/page.tsx",
            lineNumber: 189,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/privacy-pay/page.tsx",
        lineNumber: 188,
        columnNumber: 5
    }, this);
}
_c1 = PrivacyPayPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "PrivacyPayContent");
__turbopack_context__.k.register(_c1, "PrivacyPayPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__dfe9d867._.js.map
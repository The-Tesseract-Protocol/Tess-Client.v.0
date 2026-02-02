# Tesseract Client

**Tesseract** is a privacy-first financial protocol built on **Stellar Soroban**. This client application provides an interface for institutional-grade financial privacy and efficiency, featuring **Batch Payments** for high-volume transfers and **Privacy Pay** for confidential transactions.

![Tesseract Hero](/public/Hero.png)

## 🚀 Key Features

### 1. Batch Payments (O(1) Authorization)
Execute high-velocity payroll and vendor payments with unprecedented efficiency.
-   **Single Signature**: Authorize up to 80 payments in a single transaction using our novel **Authorization Tree** architecture.
-   **Cost Efficient**: Drastically reduces network fees and ledger footprint compared to sequential payments.
-   **Soroban Powered**: Utilizes smart contracts to orchestrate atomic batch transfers.

### 2. Privacy Pay (Confidential Settlement)
Decouple business intent from public finality.
-   **Private Deposits**: Deposit funds (USDC, XLM) into a shared anonymity pool.
-   **Confidential Withdrawals**: Withdraw funds to multiple recipients without revealing the link to the depositor.
-   **Hybrid Encryption**: Uses **AES-256-CBC + RSA** hybrid encryption to securely transmit withdrawal instructions to a Relayer, ensuring only the final distributor knows the recipients.
-   **Relayer Architecture**: A third-party relayer submits transactions, obfuscating the payer's network identity.

### 3. Modern UI/UX
-   **Neural Backgrounds**: Interactive, shader-like background effects.
-   **Responsive Design**: Fully responsive interface built with Tailwind CSS.
-   **Freighter Integration**: Seamless wallet connection for signing and account management.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **Blockchain SDK**: `@stellar/stellar-sdk`, `@stellar/freighter-api`
-   **State Management**: Zustand
-   **Cryptography**: `tweetnacl` (NaCl), Web Crypto API
-   **Animations**: Framer Motion

## 📋 Prerequisites

-   **Node.js**: v18.17.0 or higher
-   **npm** or **bun**
-   **Freighter Wallet**: Browser extension installed ([Install here](https://www.freighter.app/)).
-   **Stellar Testnet Account**: Your wallet must be funded on the Stellar Testnet.

## ⚙️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/The-Tesseract-Protocol/Tess-Client.v.0.git
    cd Tess-Client.v.0
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    bun install
    ```

3.  **Environment Configuration**
    Create a `.env.local` file in the root directory. You can copy the example below:

    ```env
    # Stellar / Soroban Config
    NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
    NEXT_PUBLIC_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"

    # Contract Addresses (Testnet)
    NEXT_PUBLIC_TREASURY_CONTRACT_ID=CBY... # Your deployed Treasury Contract
    NEXT_PUBLIC_IDM_CONTRACT_ID=...         # Identity Management Contract (if applicable)
    NEXT_PUBLIC_ASSET_ADDRESS_USDC=...      # USDC Token Contract on Testnet
    NEXT_PUBLIC_ASSET_ADDRESS_XLM=...       # XLM Token Contract

    # Backend Services
    NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
    NEXT_PUBLIC_RELAYER_URL=http://localhost:3002

    # Encryption Keys (Public Keys for Hybrid Encryption)
    NEXT_PUBLIC_DISTRIBUTOR_RSA_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----...-----END PUBLIC KEY-----"
    NEXT_PUBLIC_RELAYER_NACL_PUBLIC_KEY="<Base64 Encoded NaCl Public Key>"
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Guide

### Connecting Wallet
Click the **"Connect Wallet"** button in the top right. Approve the connection in your Freighter extension. Ensure you are on **Testnet**.

### Using Batch Payments
1.  Navigate to **Batch Authorisation** from the Dashboard.
2.  **Add Recipients**: Manually enter Stellar addresses and amounts, or upload a CSV file (`address,amount`).
3.  Review the batch summary.
4.  Click **"Pay Recipients"**.
5.  Sign the **Authorization Entry** in Freighter. This single signature approves the entire tree of transfers.
6.  Wait for the transaction to confirm.

### Using Privacy Pay
**Deposit:**
1.  Navigate to **Privacy Pay** -> **Deposit**.
2.  Select a pool (USDC or XLM) and enter an amount.
3.  Click **"Deposit"** and sign the transaction.
4.  Your deposit is mixed into the pool.

**Withdraw:**
1.  Navigate to **Privacy Pay** -> **Withdraw**.
2.  Select an **Encrypted Deposit** (identified by HashLN).
3.  **Decrypt**: You may be asked to sign a message to prove ownership and decrypt your deposit details locally.
4.  Add **Recipients** (who you want to pay anonymously).
5.  Click **"Submit Private Withdrawal"**.
6.  The client encrypts the instructions and sends them to the Relayer. The Relayer submits the proof to the contract, and the contract releases funds to the recipients without linking them to you on-chain.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

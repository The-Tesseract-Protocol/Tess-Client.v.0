---
icon: '8'
cover: ../.gitbook/assets/Screenshot 2026-01-29 at 21.59.46.png
coverY: 0
---

# Wallet Integration

Institutions connect via **Privy (flagship)**, **Freighter (alternative)**, or **Stellar Wallet Kit (fallback)**. The dashboard implements conditional logic to detect available wallets and guide connection.

All wallets provide unified signature verification for withdrawal requests.

***

### Decision Logic <a href="#decision-logic" id="decision-logic"></a>

<figure><img src="../.gitbook/assets/Screenshot 2026-01-29 at 13.16.50.png" alt=""><figcaption></figcaption></figure>

***

### Privy Integration (Flagship) <a href="#privy-integration-flagship" id="privy-integration-flagship"></a>

**Privy**: Embedded wallet with 2FA, social login, multi-device.

#### User Access & Authentication

Identity Management

* User Login: Authenticated via Privy OAuth for seamless social or email-based entry.
* User Signing: All withdrawal requests are signed via Privy directly on the institution's device.
* Key Storage: Private keys are secured within the Privy app (client-side/device-specific), ensuring non-custodial integrity.

***

#### Interface Integration

User Dashboard

* Embedded Privy Widget: A self-contained UI component integrated into the dashboard.
* Functionality: Handles session management, signing prompts, and wallet interactions without redirecting the user.
* Security: Ensures the platform never intercepts the user's signing credentials.

***

### Freighter Integration (Alternative) <a href="#freighter-integration-alternative" id="freighter-integration-alternative"></a>

**Freighter**: Browser extension, Stellar-native, hardware support.

***

### Stellar Wallet Kit (Fallback) <a href="#stellar-wallet-kit-fallback" id="stellar-wallet-kit-fallback"></a>

**For users without Privy/Freighter**: Shows all options via Kit.

***

### Unified Signature Verification Flow <a href="#unified-signature-verification-flow" id="unified-signature-verification-flow"></a>

<figure><img src="../.gitbook/assets/Screenshot 2026-01-29 at 13.21.39.png" alt="" width="375"><figcaption></figcaption></figure>

**Privacy**: Ephemeral keys never persisted.


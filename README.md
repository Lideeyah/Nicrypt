# <div align="center">NICRYPT /// SOVEREIGN LAYER</div>

<div align="center">
  <img src="https://img.shields.io/badge/Network-Solana_Devnet-linear-gradient(90deg%2C%20%239945FF%2C%20%2314F195)?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Privacy-Zero--Knowledge-000000?style=for-the-badge&logo=tor-browser&logoColor=white" />
  <img src="https://img.shields.io/badge/Encryption-AES--256--GCM-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Status-v1.0_Stable-success?style=for-the-badge" />
</div>

<br />

> **"Privacy is not about hiding. It is about retaining the power of consent."**

**Nicrypt** is the first *Sovereign Privacy Interface* built on Solana. It serves as a cryptographic shield between your public on-chain identity and your private financial movements. By combining **Zero-Knowledge Proofs (ZKP)** with **Mock Fully Homomorphic Encryption (FHE)** concepts, Nicrypt demonstrates a future where financial transparency does not come at the cost of personal exposure.

This is not just a wallet. It is a **Sovereign Vault**. 

---

## ⚡ The Sovereign Stack

Nicrypt functions as a Client-Side Privacy Coordinator, orchestrating a complex dance between public ledgers and private state.

### 1. 🌐 The Exposure Scan
Before you can protect yourself, you must understand your vulnerability. 
- **Real-Time Analysis:** Instantly audits your connected wallet (Phantom/Solflare).
- **Footprint Visualization:** Shows exactly what the public ledger sees—your balance, your history, your links.
- **The Wake-Up Call:** Visualizes the "Glass House" nature of public blockchains.

### 2. 🛡️ ZK-Identity Gate
Access requires proof of humanity, not proof of identity.
- **Zero-Knowledge Verification:** Generates a cryptographic proof (simulated) that you are a valid user without revealing *who* you are.
- **Nullifier Generation:** Creates a unique session token that cannot be traced back to your original wallet.

### 3. ⚡ The Bridge (Ingress)
The transition from Public to Sovereign.
- **Atomic Deposits:** Seamlessly moves assets from the Public Ledger (Solana System Program) into the **Shield Program Deployment**.
- **Real-Time Settlement:** Executes verified transactions on Solana Devnet.
- **State Transition:** Assets leave your public balance and enter the "Black Box" of the Sovereign Vault.

### 4. 🔒 Sovereign Vault
Your private Swiss Bank, running entirely in your browser.
- **Client-Side Encryption:** All vault state is encrypted using **AES-256-GCM** with a PIN-derived key (PBKDF2).
- **Zero-Knowledge by Design:** The app itself does not know your PIN or seed. If you lose your PIN, the vault is mathematically inaccessible.
- **Shielded Balances:** View balances that no block explorer can query.

### 5. 👻 Confidential Egress (Zero-Trace)
The ultimate feature: **Getting money out without leaving a trail.**
- **Threat Monitoring:** Automatically scans destination addresses for privacy risks (Exchange Hot Wallets, known surveillance lists).
- **Relayer Dispatch:** Uses a "ShadowWire" mechanism (simulated relayer) to execute withdrawals.
- **Cold Trail:** Funds arrive at the destination wallet as if they materialized from the network itself, breaking the on-chain link between Sender and Receiver.

---

## 🚀 Getting Started

Experience the future of privacy on **Solana Devnet**.

### Prerequisites
- **Node.js** (v16+)
- **Solana Wallet** (Phantom or Solflare) installed in your browser.
- **Devnet SOL:** Ensure your wallet is set to **Devnet** and has some faucet SOL.

### Installation

```bash
# 1. Clone the Sovereign Repository
git clone https://github.com/Lideeyah/Nicrypt.git

# 2. Enter the Citadel
cd Nicrypt

# 3. Install Cryptographic Dependencies
npm install

# 4. Ignite the Reactor
npm run dev
```

### Usage
1.  **Connect:** Link your Phantom wallet to begin the Exposure Scan.
2.  **Verify:** Pass the ZK-Gate (Mock verification for demo).
3.  **Deposit:** Send `0.1 SOL` to the Shield. Watch it vanish from your public balance.
4.  **Withdraw:** Use the "Sovereign Egress" to send funds to a *different* address. Verify on Solscan that the link is obfuscated.

---

## 🏗️ Architecture

```mermaid
graph TD
    A[Public User] -->|Connect Wallet| B(Exposure Layer)
    B -->|ZK Proof| C{Identity Gate}
    C -->|Verified| D[Ingress Bridge]
    D -->|Deposit Transaction| E((Solana Devnet))
    E -->|Confirm| F[Sovereign Vault State]
    F -->|AES-256 Encrypted| G[Local Storage]
    
    H[Egress Request] -->|Sign & Verify| F
    H -->|Threat Check| I[Threat Monitor]
    I -->|Safe| J[Relayer Dispatch]
    J -->|Confidential Tx| E
```

---

## ⚠️ Disclaimer

**Nicrypt is a Proof of Concept (PoC) / Educational Demonstration.**
- It runs on **Solana Devnet**.
- "Encryption" of on-chain state is simulated using local state management for the demo interaction.
- "ZK Proofs" are mocked for UI flow demonstration.
- **DO NOT** use Mainnet SOL. **DO NOT** store real assets.

---

<div align="center">
  <sub>Built with React, Vite, Solana Web3.js, and Paranoia.</sub>
  <br />
  <sub>Copyright © 2026 Nicrypt Sovereign Systems.</sub>
</div>

# 🧠 Braintheria — Decentralized Q&A with ETH Bounties

Braintheria is a **decentralized Question & Answer platform** where users can post questions with an **ETH bounty**, and answerers compete to earn rewards.
Unlike traditional Q&A platforms, Braintheria uses **smart contracts as trustless escrow**, ensuring transparent payouts without intermediaries.

Built for a hackathon using **Ethereum Sepolia**, **Solidity**, **Next.js**, and **QIE (Indexer)** for fast on-chain data access and better UX.

---

## 🚩 Problem

* High-quality technical answers are hard to incentivize
* Existing Q&A platforms rely on centralized moderation and reputation
* Payments and bounties require trust in a third party
* Contributors are often under-rewarded for expert knowledge

---

## 💡 Solution

Braintheria introduces:

* **ETH-backed bounties** locked in smart contracts
* **Trustless payouts** to the selected best answer
* **Asker-based validation** (the asker chooses the winner)
* **Optional staking** to reduce spam and low-effort answers
* **QIE-powered indexing** for fast reads without centralized custody
* A clean Web3 UX without launching a custom token

---

## 🏗️ System Overview

**Core components:**

* **Smart Contract** — Escrow ETH, manage questions & payouts
* **Frontend** — Wallet-based dApp (Next.js)
* **QIE Indexer** — Indexes on-chain events for efficient querying & UX

> All critical logic and funds remain **fully on-chain**. QIE is used only for data indexing and performance.

---

## 📦 Repository Structure

```
.
├── contracts/              # Solidity smart contracts (Foundry)
│   ├── src/
│   │   └── QnAWithBounty.sol
│   ├── script/             # Deployment scripts
│   └── test/               # Contract tests
│
├── frontend/               # Next.js / React dApp
│   ├── app/
│   ├── components/
│   └── lib/
│
├── qie/                    # QIE indexer config & handlers
│   └── indexer.ts
│
├── README.md               # Main project overview (this file)
└── package.json            # Root scripts (if applicable)
```

---

## 🔗 Blockchain & Network

* **Network:** Ethereum Sepolia (testnet)
* **Asset:** ETH
* **Wallets:** MetaMask / WalletConnect
* **Tooling:** Foundry (Anvil, Forge)
* **Indexer:** QIE

---

## 🔐 Reward Model (Summary)

* Askers lock **ETH bounty** when posting a question
* Answerers submit answers (optionally with a small ETH stake)
* **Asker selects the best answer**
* Smart contract releases **100% of the bounty** to the winner
* Platform takes **0% fee**

---

## 🔒 Security Considerations (Summary)

* Reentrancy protection on ETH transfers
* One-time payout per question
* Strict access control (only asker can resolve)
* Immutable answers once submitted
* Indexer has **no fund custody** and cannot affect payouts

> ⚠️ This project is a hackathon prototype and has not undergone a formal security audit.

---

## 🚀 How to Run the Project

### 1️⃣ Smart Contracts

```bash
cd contracts
anvil
forge build

source .env
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $RPC_URL \
  --broadcast \
  -vvvv
```

---

### 2️⃣ QIE Indexer

```bash
cd qie
npm install
npm run dev
```

> The indexer listens to contract events and powers fast queries for the frontend.

---

### 3️⃣ Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🛣️ Future Improvements

* Deploy to low-fee L2 (Base / Polygon)
* DAO or community-based answer validation
* Reputation-based incentives
* Formal smart contract audit
* Dispute resolution & timeouts
* Optional governance token (v2)
## 🏁 Hackathon Notes

* Built with simplicity and security in mind
* Focused on **real economic incentives**, not speculation
* QIE used strictly for **scalability & UX**, not trust

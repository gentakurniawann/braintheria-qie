
# 🧠 Braintheria — Decentralized Q&A with QIE Bounties

Braintheria is a decentralized Question & Answer platform where users can post questions with a BRAIN token bounty, and answerers compete to earn rewards. Unlike traditional Q&A platforms, Braintheria uses smart contracts as trustless escrow, ensuring transparent payouts without intermediaries. Built on qee Network for low-cost transactions and powered by our native BRAIN token for flexible economics, the platform was developed using Solidity, Next.js, and NestJS.

Built for a hackathon using **QIE Network**, **Solidity**, **Next.js**, and an optional backend for indexing and UX improvements.
---

## 🚩 Problem

- High-quality technical answers are hard to incentivize
- Existing Q&A platforms rely on centralized moderation and reputation
- Payments and bounties require trust in a third party
- Contributors are often under-rewarded for expert knowledge

---

## 💡 Solution

Braintheria introduces:

- **QIE-backed bounties** locked in smart contracts
- **Trustless payouts** to the selected best answer
- **Asker-based validation** (the asker chooses the winner)
- **Optional staking** to reduce spam and low-effort answers
- A clean Web3 UX without launching a custom token

---

## 🏗️ System Overview

**Core components:**

- **Smart Contract** — Escrow QIE, manage questions & payouts
- **Frontend** — Wallet-based dApp for users
- **Backend (optional)** — Indexing, caching, and fast queries
- **IPFS (optional)** — Store long question/answer content off-chain

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
├── backend/                # (Optional) NestJS API
│   ├── src/
│   ├── prisma/
│   └── README.md
│
├── README.md               # Main project overview (this file)
└── package.json            # Root scripts (if applicable)
```

---

## 🔗 Blockchain & Network

- **Network:** QIE Network
- **Asset:** QIE
- **Wallets:** MetaMask / WalletConnect
- **Tooling:** Foundry (Anvil, forge)

---

## 🔐 Reward Model (Summary)

- Askers lock **QIE bounty** when posting a question
- Answerers submit answers (optionally with a small QIE stake)
- **Asker selects the best answer**
- Smart contract releases **100% of the bounty** to the winner
- Platform takes **0% fee**

---

## 🔒 Security Considerations (Summary)

- Reentrancy protection on QIE transfers
- One-time payout per question
- Strict access control (only asker can resolve)
- Immutable answers once submitted
- No custom token = reduced attack surface

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

### 2️⃣ Frontend

```bash
cd frontend
npm install
npm run dev
```

---

### 3️⃣ Backend (Optional)

```bash
cd backend
npm install
npm run start:dev
```
---

## 🛣️ Future Improvements

- Deploy to low-fee L2 or other compatible networks
- Add DAO or community voting
- Introduce reputation-based incentives
- Formal smart contract audit
- Dispute resolution & timeouts
- Optional governance token (v2)

---

## 🏁 Hackathon Notes

- Built with simplicity and security in mind
- Focused on **real economic incentives**, not speculation
- Designed for extensibility beyond the hackathon

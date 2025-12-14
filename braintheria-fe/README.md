

---

# 🎨 Frontend (Next.JS + Web3)

This folder contains the **frontend application** for the project.
It connects users to the smart contract via a Web3 wallet and communicates with the backend API.

---

## 📁 Folder Structure

```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   └── config/
│       └── web3.ts
├── public/
├── .env              ← local only (do NOT commit)
├── .env.example      ← template
├── package.json
├── README.md
```

---

## 📦 Prerequisites

You must have:

* **Node.js** ≥ 18
* **npm** or **yarn**
* **MetaMask** (or any EVM wallet)
* **Local smart contract deployed** (Anvil)

Verify Node:

```bash
node -v
npm -v
```

---

## 🌱 Environment Variables

### 📍 Where is `.env`?

The `.env` file must be placed in the **frontend root folder**, next to `package.json`.

---

### 🧪 `.env.example` (SAFE TO COMMIT)

```env
# =========================
# App
# =========================
VITE_APP_NAME=Braintheria

# =========================
# Blockchain (Local)
# =========================
VITE_CHAIN_ID=31337
VITE_RPC_URL=http://127.0.0.1:8545

# Smart contract (fill after deploy)
VITE_CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS

# =========================
# Backend API
# =========================
VITE_API_BASE_URL=http://localhost:3000
```

---

### 🔐 `.env` (LOCAL DEV – DO NOT COMMIT)

```bash
cp .env.example .env
```

Example `.env`:

```env
VITE_APP_NAME=Braintheria

VITE_CHAIN_ID=31337
VITE_RPC_URL=http://127.0.0.1:8545
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3

VITE_API_BASE_URL=http://localhost:3000
```

---

### 🛑 `.gitignore`

```gitignore
.env
```

---

## 🚀 How to Run Frontend Locally

### 1️⃣ Install Dependencies

```bash
npm install
# or
yarn install
```

---

### 2️⃣ Start Development Server

```bash
npm run dev
# or
yarn dev
```

App will be available at:

```
http://localhost:5173
```

---

## 🔗 Wallet & Blockchain Setup

1. Open MetaMask
2. Add Local Network:

```
Network Name: Anvil
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency: ETH
```

3. Import Anvil account (optional):

Use **any private key printed by Anvil** for testing.

---

## 🧠 Web3 Integration Flow

Frontend uses:

* Wallet (MetaMask)
* RPC (`VITE_RPC_URL`)
* Contract address (`VITE_CONTRACT_ADDRESS`)

Flow:

```
User → Frontend → Wallet (sign tx)
                 ↓
              Smart Contract
```

Backend is used for:

* Metadata
* Off-chain indexing
* Read APIs

---

## 🧪 Useful Commands

```bash
npm run dev       # start dev server
npm run build     # production build
npm run preview   # preview build
```

---

## ⚠️ Important Notes

* Frontend **will NOT work** if:

  * contract is not deployed
  * `VITE_CONTRACT_ADDRESS` is empty
  * wrong chain ID
* Restart dev server after changing `.env`
* All env variables **must start with `VITE_`**

---

## 🔁 Typical Local Dev Order

1. `anvil`
2. deploy contract
3. update `VITE_CONTRACT_ADDRESS`
4. run backend
5. run frontend

---



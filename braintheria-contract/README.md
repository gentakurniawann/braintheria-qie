
---

# 🧠 Smart Contract (Foundry)

This folder contains the **smart contract layer** of the project, built using **Foundry**.
It includes contract source code, deployment scripts, and local blockchain setup.

This README explains **exactly**:

* where the `.env` lives
* how to run locally
* how to deploy
* what each step does

---

## 📁 Folder Structure

```
contracts/
├── src/
│   └── core/
│       └── QnAWithBounty.sol
├── script/
│   └── Deploy.s.sol
├── foundry.toml
├── .env              ← LOCAL ONLY (do NOT commit)
├── .env.example      ← TEMPLATE (commit this)
└── README.md
```

---

## 📦 Prerequisites

You must have the following installed:

### 1️⃣ Foundry

Foundry includes:

* `forge` (build & deploy)
* `cast` (interact with chain)
* `anvil` (local blockchain)

Install:

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Verify:

```bash
forge --version
anvil --version
cast --version
```

---

## 🌱 Environment Variables (`.env`)

### 📍 Where is `.env`?

The `.env` file **MUST be in the root of the contracts folder**, next to `foundry.toml`.

---

### 🧪 `.env.example` (SAFE TO COMMIT)

Create this file:

```env
# Local blockchain (Anvil)
RPC_URL=http://127.0.0.1:8545
CHAIN_ID=31337

# Private key used for deployment (local only)
PRIVATE_KEY=your_private_key_here

# Optional (not used for local)
ETHERSCAN_API_KEY=
```

---

### 🔐 `.env` (DO NOT COMMIT)

Create your real env:

```bash
cp .env.example .env
```

Paste **this exact content** for local Anvil:

```env
# =========================
# Local blockchain (Anvil)
# =========================
RPC_URL=http://127.0.0.1:8545
CHAIN_ID=31337

# Anvil default account #0
# SAFE FOR LOCAL USE ONLY
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

ETHERSCAN_API_KEY=
```

---

### 🛑 `.gitignore`

Make sure this exists:

```gitignore
.env
broadcast/
cache/
out/
```

---

## 🚀 How to Run & Deploy Locally

### 1️⃣ Start Local Blockchain

Terminal 1:

```bash
anvil
```

This starts a local Ethereum network at:

```
http://127.0.0.1:8545
Chain ID: 31337
```

⚠️ Keep this terminal running.

---

### 2️⃣ Compile Contracts

Terminal 2:

```bash
forge build
```

This:

* Compiles all Solidity files
* Fails if there are syntax or import errors

---

### 3️⃣ Deploy Contract

Still in Terminal 2:

```bash
source .env

forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $RPC_URL \
  --broadcast \
  -vvvv
```

---

## 📌 What This Deployment Command Does

* Loads environment variables from `.env`
* Executes `DeployScript` in `Deploy.s.sol`
* Signs the transaction using `PRIVATE_KEY`
* Broadcasts it to Anvil
* Prints **very verbose logs** (`-vvvv`)

---

## ✅ Successful Deployment Output

You should see logs similar to:

```
Deployer address: 0x...
QnAWithBounty deployed at: 0x...
```

This means:

* Contract is live on local chain
* Address can now be used by backend / frontend

---

## 🧪 Optional Verification

Check chain status:

```bash
cast chain-id --rpc-url $RPC_URL
cast block-number --rpc-url $RPC_URL
```

---

## 🛠 Useful Commands

```bash
forge build        # Compile contracts
forge test         # Run tests
anvil              # Start local blockchain
cast chain-id      # Check chain ID
```

---

## ⚠️ Important Notes

* **Never use Anvil private keys on public networks**
* `.env` is required — deploy will FAIL without it
* `vm.envUint("PRIVATE_KEY")` in scripts reads directly from `.env`

---

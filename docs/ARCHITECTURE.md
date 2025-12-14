
---

# System Architecture

## Overview

This system is a Web3 Q&A platform where users post questions with a bounty locked on-chain, and answerers compete to earn the bounty. The **frontend** handles wallet connection + user actions, the **smart contract** provides trustless escrow and payout, and the **backend** indexes/caches on-chain activity and stores off-chain content for fast search and a smooth UX.

---

## Components

### 1) Smart Contracts (Solidity + Foundry)

**Core contract: `QnAWithBounty`**

- **Escrow/Bounty logic:** holds bounty funds (native token or ERC-20) until resolved
- **Question lifecycle:** create question → accept answers → resolve/award
- **Permission & security:** owner/admin hooks (if needed), reentrancy guard, event logs

**On-chain data**

- Minimal, trust-critical fields: questionId, bounty amount, asker, status, winner, timestamps
- Emits events: `QuestionCreated`, `AnswerSubmitted`, `QuestionResolved`, `BountyPaid`

> Hackathon tip: keep long text **off-chain** and store only a `contentHash / CID` on-chain.

---

### 2) Frontend (Next.js)

**Tech**

- Next.js (App Router)
- Wallet & chain: **wagmi + viem** (or ethers.js)
- State/data: TanStack Query / Zustand (optional)

**Responsibilities**

- Connect wallet, switch network, sign transactions
- Read on-chain state (questions, bounty, status)
- Post question/answer (tx + optional off-chain upload)
- Real-time UI updates from backend (SSE/WebSocket optional)

---

### 3) Backend (NestJS API)

**Tech**

- NestJS (REST + optional SSE)
- Prisma ORM
- PostgreSQL
- Redis for caching
- Optional worker (BullMQ) for background indexing

**Responsibilities**

- **Indexing:** listen to contract events (via RPC provider) and materialize into DB
- **Caching:** “hot” question lists, trending, pagination
- **Search & filters:** tags, status, bounty range, time, user profile pages
- **Off-chain content:** store/retrieve long text from IPFS (or DB), map to questionId

---

### 4) Storage Layer

- **PostgreSQL:** canonical off-chain index (fast queries, sorting, filtering)
- **Redis:** caching and rate-limiting (optional)
- **IPFS (optional):** long answers, images, markdown content (store CID on-chain + in DB)

---

### 5) Blockchain Network

- Dev: **Anvil (local)**
- Testnet/Mainnet: Base Sepolia / Polygon / Sepolia (choose one for hackathon)
- RPC Provider: Alchemy/Infura/QuickNode (or public RPC)

---

## Data Flow

### A) Post Question + Lock Bounty

1. User writes question in UI
2. (Optional) UI uploads long content to IPFS → gets **CID**
3. Frontend sends tx: `createQuestion(bounty, CID/hash, metadata)` to contract
4. Contract locks bounty in escrow and emits `QuestionCreated(questionId, …)`
5. Backend indexer catches event → saves normalized record in Postgres
6. Frontend fetches from backend for fast rendering (and can verify on-chain)

### B) Submit Answer

1. Answerer writes answer
2. (Optional) upload answer content to IPFS → CID
3. Frontend sends tx: `submitAnswer(questionId, CID/hash)`
4. Contract emits `AnswerSubmitted`
5. Backend indexes → updates answer list

### C) Resolve + Pay Out

1. Resolution trigger (examples): asker selects winner / admin moderation / vote-based logic
2. Frontend calls `resolveQuestion(questionId, winnerAnswerId)`
3. Contract releases escrow bounty to winner, emits `QuestionResolved` + `BountyPaid`
4. Backend indexes payout + final status
5. UI updates: shows winner, payout proof (tx hash), final state

---

## Simple Diagram (tech-centered)

```
+-------------------+            +------------------------+
|   User Wallet      |            |   Blockchain Network   |
| (MetaMask/etc)     |            | (Anvil/Testnet/Mainnet)|
+---------+---------+            +-----------+------------+
          |                                  ^
          | sign tx / read state             | RPC (read/write)
          v                                  |
+--------------------------+        +--------+------------------+
|   Frontend (Next.js)     |<------>| Smart Contract (Solidity) |
| wagmi/viem (or ethers)   |  tx    |  QnAWithBounty (escrow)   |
+------------+-------------+        +--------+------------------+
             |                               |
             | REST/SSE                      | Events
             v                               v
+--------------------------+        +--------------------------+
| Backend (NestJS API)     |<-------| Event Indexer/Worker     |
| Prisma + PostgreSQL      |        | (reads logs via RPC)     |
| Redis cache (optional)   |        +--------------------------+
+------------+-------------+
             |
             | content fetch/store
             v
+--------------------------+
| IPFS (optional)          |
| (CID for long text/media)|
+--------------------------+
```

---

## Why These Choices?

- **On-chain escrow + payout** = trustless rewards, no “admin can rug” concerns
- **Backend indexing (Postgres)** = fast feed, search, filters, analytics (hackathon judges love UX)
- **Redis caching** = smooth performance under load
- **IPFS** (optional) = cheaper than storing long text on-chain; still verifiable via CID
- **Events-driven design** = clean integration between contract ↔ backend (auditable timeline)

---

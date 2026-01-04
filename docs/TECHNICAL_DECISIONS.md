
---

# Technical Decisions

## Blockchain Choice: **Ethereum Sepolia (Testnet)**

**Why:**

* Fastest path to a working demo using a widely recognized Ethereum environment
* Strong tooling support (Foundry, wagmi/viem, explorers, faucets)
* Judges can easily understand and verify transactions + escrow behavior on an Ethereum testnet

**Alternatives considered:**

* **Ethereum mainnet** (real money, too risky/expensive for a hackathon)
* **Polygon/Base** (great for production fees, but Sepolia is simpler for testing + judging)

**Future improvement:**

* Deploy the same contracts to a low-fee L2 (Base/Polygon) for production.

---

## Asset Choice: **ETH (No Custom Token in v1)**

**Why:**

* Avoids token issuance complexity and security risk
* Reduces attack surface (no minting, no supply management)
* Keeps incentives real and simple: *bounty escrow → winner payout*

**Alternative considered:**

* Custom ERC-20 utility token (better long-term design, but too heavy for hackathon scope)

**Future improvement:**

* Add an ERC-20 governance/utility token once product demand is validated.

---

## Smart Contracts: **Solidity + Foundry**

**Why:**

* Foundry provides fast iteration, testing, and local dev via Anvil
* Easy deployment scripts and reproducible builds
* Battle-tested OpenZeppelin patterns available when needed (Ownable, ReentrancyGuard)

**Alternative considered:**

* Hardhat (more common, but Foundry is faster for contract-heavy iteration)

---

## Frontend: **Next.js (React) + wagmi/viem (or ethers.js)**

**Why:**

* Next.js accelerates building a full app with routing and deployment-ready structure
* wagmi/viem provides clean hooks for:

  * wallet connection
  * contract reads/writes
  * chain switching and tx tracking
* Faster UX and better state management than raw RPC calls

**Alternative considered:**

* Plain React SPA (simpler, but Next.js gives better app structure and deployment flow)

---

## Storage: **Hybrid (On-Chain + Optional IPFS)**

**Decision: Store only trust-critical data on-chain**

* On-chain:

  * questionId, asker, bounty amount, status, winner, timestamps
  * content reference hash/CID
* Off-chain (optional IPFS):

  * long question/answer text, markdown, media

**Why:**

* On-chain storage is expensive and not meant for large text
* IPFS keeps content decentralized while being significantly cheaper
* CID/hash provides integrity verification (content can’t be silently altered)

**Alternative considered:**

* Full on-chain storage (too expensive, bloats contract/storage)

---

## Backend Choice: **Optional Indexing Backend (NestJS)**

**v1 decision:** The dApp can run **without a backend** for hackathon demo (pure on-chain reads).
**Why:**

* Maximizes decentralization narrative
* Fewer moving parts; easier to demo reliably

**Trade-off:**

* No advanced search/filtering, slower feeds, limited analytics

**Future improvement (recommended for production):**

* Add backend indexing (NestJS + Postgres + Redis) to enable:

  * fast pagination/search
  * trending feeds
  * notifications
  * spam/throttle heuristics (off-chain)

---

## Validation / Resolution Mechanism: **Asker-Based Winner Selection**

**Why:**

* Simplest and most secure for v1
* Avoids voting manipulation, Sybil attacks, bribery games
* Clear accountability: the asker decides who gets paid

**Alternative considered:**

* Community voting (adds complexity and introduces Sybil/vote-buying vectors)

**Future improvement:**

* Add optional modes:

  * community vote
  * reputation-weighted vote
  * arbitration / dispute resolution timeout if asker disappears

---

## Security Defaults

**Why these are included:**

* Escrow payouts must be protected from common Web3 exploits

**Key controls:**

* Reentrancy protection on payout functions
* Checks–Effects–Interactions ordering
* One-time payout flags per question
* Minimal on-chain data and deterministic state transitions

---

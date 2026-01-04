---

# Technical Decisions

## Blockchain Choice: **QIE Network**

**Why:**
* Native integration with BRAIN token (QIE-based)
* Lower transaction fees compared to Ethereum mainnet, enabling micro-bounties
* Fast finality for better user experience
* QIE ecosystem alignment for future integrations and partnerships

**Alternatives considered:**
* **Ethereum Sepolia (Testnet)** (good for testing, but mainnet fees too high for production)
* **Polygon/Base** (low fees, but less aligned with BRAIN tokenomics and QIE ecosystem)

**Current implementation:**
* Testing on QIE testnet with easy faucet access for judges
* Production deployment ready on QIE mainnet

---

## Asset Choice: **BRAIN Token (ERC-20)**

**Why:**
* Native platform token creates sustainable token economy
* Enables future utility features (governance, staking, premium features)
* Token capture allows value to accrue to platform and community
* Creates clear incentive alignment between platform growth and token value

**Token mechanics:**
* BRAIN is an ERC-20 token deployed on QIE Network
* Users acquire BRAIN through exchange or earn through answering questions
* Platform retains 2% of bounties for sustainability (98% to experts)
* Simple approval + transfer pattern using OpenZeppelin SafeERC20

**Alternative considered:**
* Native QIE (simpler, but no token economy or value capture mechanism)

**Future improvements:**
* Governance rights for BRAIN holders
* Staking mechanisms for reputation/priority
* Token burn mechanisms for deflationary pressure

---

## Smart Contracts: **Solidity + Foundry**

**Why:**
* Foundry provides fast iteration, testing, and local dev via Anvil
* Easy deployment scripts and reproducible builds
* Battle-tested OpenZeppelin patterns available (Ownable, ReentrancyGuard, SafeERC20)
* Gas optimization tools and comprehensive testing framework

**Key contracts:**
* `QnAWithBounty.sol` - Core escrow and resolution logic
* BRAIN token integration via ERC-20 interface
* Upgradeable pattern consideration for future improvements

**Alternative considered:**
* Hardhat (more common, but Foundry is faster for contract-heavy iteration)

---

## Frontend: **Next.js (React) + wagmi/viem**

**Why:**
* Next.js accelerates building a full app with routing and deployment-ready structure
* wagmi/viem provides clean hooks for:
  * wallet connection (MetaMask, WalletConnect, etc.)
  * BRAIN token approval and balance checking
  * contract reads/writes with proper error handling
  * chain switching and tx tracking
* Better UX with loading states and optimistic updates
* Type-safe contract interactions with generated ABIs

**Alternative considered:**
* Plain React SPA (simpler, but Next.js gives better app structure and SEO)

---

## Storage: **Hybrid (On-Chain + Optional IPFS)**

**Decision: Store only trust-critical data on-chain**

* **On-chain:**
  * questionId, asker, bounty amount (in BRAIN), status, winner, timestamps
  * content reference hash/CID
  * token approval and transfer events

* **Off-chain (optional IPFS):**
  * long question/answer text, markdown, code snippets
  * media attachments, diagrams

**Why:**
* On-chain storage is expensive even on QIE (gas costs still matter)
* IPFS keeps content decentralized and censorship-resistant
* CID/hash provides cryptographic integrity verification
* Hybrid approach balances decentralization with practicality

**Alternative considered:**
* Full on-chain storage (prohibitively expensive, bloats state)

---

## Backend Choice: **Optional Indexing Backend (NestJS)**

**v1 decision:** The dApp can run **without a backend** (pure on-chain reads via RPC).

**Why:**
* Maximizes decentralization and trustlessness
* Fewer moving parts; easier to demo reliably
* Frontend can directly query blockchain for all critical data

**Trade-off:**
* No advanced search/filtering
* Slower feeds on question lists
* Limited analytics and trending features

**Future improvement (recommended for production):**
* Add backend indexing (NestJS + Postgres + Redis) to enable:
  * Fast pagination, search, and filtering by tags/bounty/status
  * Trending feeds and leaderboards
  * Email/push notifications for answers and resolutions
  * Rate limiting and spam detection (off-chain)
  * BRAIN token price tracking and USD conversion

---

## Validation / Resolution Mechanism: **Asker-Based Winner Selection**

**Why:**
* Simplest and most secure for v1
* Avoids voting manipulation, Sybil attacks, and bribery games
* Clear accountability: the asker (who funded the bounty) decides who gets paid
* Incentive-aligned: asker wants quality answer to solve their problem

**Alternative considered:**
* Community voting (adds complexity, introduces Sybil/vote-buying vectors, delays resolution)

**Future improvements:**
* Add optional modes:
  * Community/reputation-weighted voting for disputed cases
  * Time-based auto-refund if asker disappears (e.g., 30 days)
  * Third-party arbitration or DAO-based dispute resolution
  * Multi-winner bounty splitting for collaborative answers

---

## Security Defaults

**Why these are included:**
* Token escrow and payouts must be protected from common Web3 exploits
* ERC-20 interactions introduce additional attack vectors vs. native ETH

**Key controls:**

* **Reentrancy protection** on all token transfer functions (OpenZeppelin ReentrancyGuard)
* **Checks–Effects–Interactions** ordering in all state-changing functions
* **One-time payout flags** per question (prevents double-spend)
* **SafeERC20** wrapper for all token operations (handles non-standard tokens)
* **Token approval validation** before accepting question creation
* **Minimal on-chain data** and deterministic state transitions
* **Access control** (only asker can resolve, only owner can pause)

**ERC-20 specific protections:**
* No unlimited approvals requested from users
* Proper handling of transfer return values
* Protection against token contract failures
* Emergency token recovery for accidentally sent tokens

---

## Token Economics & Platform Sustainability

**Fee structure:**
* 2% platform fee on all bounties (98% goes to answer winner)
* Fees collected in BRAIN tokens for platform operations and development
* Transparent fee calculation on-chain

**Why 2% vs. traditional platforms (20-40%):**
* Smart contracts eliminate payment processor fees
* No human moderation overhead for payments
* Trustless escrow reduces operational costs
* Competition with traditional platforms requires compelling economics

**Future considerations:**
* Dynamic fee tiers based on bounty size or user reputation
* Fee discounts for BRAIN stakers
* Treasury management and token buyback programs

---

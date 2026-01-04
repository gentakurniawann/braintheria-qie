
---

# Reward Economics (BRAIN Token – QIE Network)

## Reward Asset

**BRAIN Token (ERC-20 on QIE Network)**

The platform uses **BRAIN tokens on QIE Network** as the bounty, staking, and reward asset. BRAIN is Braintheria's native utility token that creates a sustainable token economy while maintaining simplicity and security.

---

## Roles in the System

* **Question Asker**
  * Posts questions
  * Locks BRAIN token bounty via smart contract approval + transfer
  * Acts as the **validator** by selecting the best answer
  * Pays 2% platform fee (included in bounty amount)

* **Answerer**
  * Submits answers
  * Competes for the bounty
  * Receives 98% of bounty when selected

* **Platform**
  * Facilitates trustless transactions via smart contracts
  * Collects 2% fee for sustainability and development
  * No custody of funds (non-custodial escrow)

There are **no external validators or voters**. Validation authority belongs entirely to the question asker.

---

## Bounty & Reward Distribution

### Winning Answer
* **Answerer receives:** 98% of the BRAIN bounty
* **Platform receives:** 2% of the BRAIN bounty
* **Example:** 100 BRAIN bounty → 98 BRAIN to answerer, 2 BRAIN to platform

### Non-Selected Answers
* No reward
* Answer stake refunded (if staking mechanism is enabled)

### Question Asker
* Does not receive tokens back
* Gains value through solved problems and high-quality answers
* Builds reputation as a fair evaluator

### Why 2% vs. Traditional Platforms (20-40%)?
* Smart contracts eliminate payment processor fees (Stripe, PayPal)
* No human moderation overhead for payment processing
* Trustless escrow reduces operational costs
* Transparent, immutable fee calculation on-chain
* Competitive advantage over centralized alternatives

---

## Anti-Spam & Quality Control Mechanisms

### 1. Minimum Stake to Answer (Optional)

* Answerers must stake a small amount of **BRAIN tokens** to submit an answer
* The stake is:
  * **Returned** if the answer is selected
  * **Forfeited to platform** if the answer is low-effort or after expiry period
* Creates economic cost for spam and low-quality submissions

**Example Parameters:**
* Simple questions (10-100 BRAIN bounty): 1 BRAIN stake
* Complex questions (1000+ BRAIN bounty): 10 BRAIN stake

---

### 2. Asker-Based Validation

* The **question asker selects the best answer**
* No public voting required in v1
* Reduces attack vectors such as:
  * Sybil voting attacks
  * Vote buying/bribery
  * Collusion rings
  * Bot manipulation

This mirrors real-world Q&A dynamics (e.g., Stack Overflow's accepted answer), but with **trustless, automatic payouts** in BRAIN tokens.

---

### 3. Reputation System (Off-Chain + On-Chain Hybrid)

**On-Chain Metrics:**
* Total bounties earned
* Number of accepted answers
* Average bounty size won

**Off-Chain Enhancements:**
* Answer quality ratings
* Response time metrics
* Expertise badges by topic
* Consistency over time

**Reputation Benefits:**
* Answer visibility and ordering
* Eligibility for premium/high-bounty questions
* Priority placement in feeds
* Trust signals for askers

---

## Utility of BRAIN Token in the Platform

* **Bounty Escrow:** BRAIN tokens locked in smart contracts until resolution
* **Spam Resistance:** Answering has real economic cost (stake requirement)
* **Incentive Alignment:** Only quality answers earn rewards
* **Trustless Settlement:** BRAIN payouts are automatic via smart contract
* **Platform Sustainability:** 2% fee funds development and operations
* **Future Governance:** Token holders may vote on protocol changes (v2+)
* **Staking Rewards:** Potential for BRAIN staking mechanisms (future)

---

## Token Economics

### Supply Model
* Fixed or capped supply (depending on BRAIN tokenomics)
* No minting by platform contract
* Deflationary pressure through:
  * Platform fees potentially burned (governance decision)
  * Locked stakes from spam/low-quality answers
* Token utility drives demand organically

### Acquisition Paths
* Purchase BRAIN on QIE DEXs
* Earn BRAIN by answering questions
* Receive BRAIN through promotions/airdrops
* Future: Earn through platform contributions (moderation, curation)

### Price Stability Considerations
* Bounties denominated in BRAIN (not USD-pegged in v1)
* UI shows approximate USD value based on market price
* Future: Option for stablecoin-pegged bounties or dynamic pricing

---

## Example Flow

**Alice posts "Help with Solidity mappings" with a 100 BRAIN bounty**

1. Alice approves contract to spend 100 BRAIN
2. Contract transfers 100 BRAIN from Alice to escrow
3. Bob submits an answer and stakes 1 BRAIN (refundable)
4. Alice reviews all submitted answers
5. Alice selects Bob's answer as the winner
6. Smart contract automatically:
   * Transfers 98 BRAIN to Bob (98%)
   * Transfers 2 BRAIN to platform (2%)
   * Refunds Bob's 1 BRAIN stake
7. Question marked as resolved permanently
8. Bob's reputation increases (+1 accepted answer, +98 BRAIN earned)

---

## Why Asker-Based Validation?

✅ **Clear responsibility** for reward distribution  
✅ **Faster resolution** (no waiting for votes)  
✅ **No governance overhead** in v1  
✅ **Lower attack surface** (no voting manipulation)  
✅ **Incentive alignment** (asker wants quality to solve their problem)  
✅ **Ideal for early-stage** deployment and hackathon scope  
✅ **Clean upgrade path** to community voting or DAO in v2+

---

## v2+ Roadmap: Enhanced Economics

**Governance & Voting:**
* BRAIN token holder governance for protocol parameters
* Community voting option for disputed resolutions
* DAO-controlled treasury and fee parameters

**Advanced Mechanisms:**
* Time-based auto-refund if asker becomes inactive (e.g., 30 days)
* Multi-winner bounty splitting for collaborative answers
* Reputation-weighted validation for high-value questions
* Staking rewards for long-term BRAIN holders
* Premium features unlocked by BRAIN holdings

**Deflationary Mechanics:**
* Quarterly BRAIN burns from platform fees
* Buyback programs during high revenue periods
* Reduced emissions over time

---

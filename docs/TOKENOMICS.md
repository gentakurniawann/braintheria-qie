
---

# Reward Economics (ETH-Based – Sepolia)

## Reward Asset

**ETH (Sepolia Testnet)**

The platform uses **ETH on Sepolia** as the bounty, staking, and reward asset. No custom token is introduced in v1 to keep the system simple, secure, and fully functional within the hackathon scope.

---

## Roles in the System

* **Question Asker**

  * Posts questions
  * Locks ETH bounty
  * Acts as the **validator** by selecting the best answer
* **Answerer**

  * Submits answers
  * Competes for the bounty
* **Platform**

  * Purely facilitative
  * No custody of funds
  * No platform fee in v1

There are **no external validators or voters**. Validation authority belongs entirely to the question asker.

---

## Bounty & Reward Distribution

* **Answerer**

  * Receives **100% of the ETH bounty** when selected by the asker
* **Question Asker**

  * Does not receive tokens
  * Gains value through solved problems and high-quality answers
* **Platform**

  * **0% fee** (non-extractive, hackathon-friendly model)

This model ensures clear accountability and avoids governance complexity in early-stage deployment.

---

## Anti-Spam & Quality Control Mechanisms

### 1. Minimum Stake to Answer

* Answerers must stake a small amount of **ETH** to submit an answer
* The stake is:

  * **Returned** if the answer is selected
  * **Slashed or locked** if the answer is low-effort or rejected
* Creates economic cost for spam and low-quality submissions

---

### 2. Asker-Based Validation

* The **question asker selects the best answer**
* No public voting required
* Reduces attack vectors such as:

  * Sybil voting
  * Bribed validators
  * Vote manipulation

This mirrors real-world Q&A dynamics (e.g., Stack Overflow’s accepted answer), but with **trustless payouts**.

---

### 3. Reputation System (Off-Chain)

* Answerers build reputation through:

  * Accepted answers
  * Consistent quality over time
* Reputation can influence:

  * Answer ordering
  * Eligibility for high-bounty questions
  * Visibility across the platform

---

## Utility of ETH in the Platform

* **Bounty Escrow:** ETH is locked in smart contracts until resolution
* **Spam Resistance:** Answering has a real economic cost
* **Incentive Alignment:** Only useful answers earn rewards
* **Trustless Settlement:** ETH payouts are automatic and irreversible

---

## Supply Model

* Uses existing **ETH supply**
* No minting
* No inflation
* No token speculation

---

## Example Flow

Alice posts **“Help with Solidity mappings”** with a **0.01 ETH bounty**
→ Bob submits an answer and stakes **0.001 ETH**
→ Alice reviews submitted answers
→ Alice selects Bob’s answer
→ Smart contract releases **0.01 ETH** to Bob
→ Bob’s stake is refunded
→ Question is closed permanently

---

## Why Asker-Based Validation?

* Clear responsibility for reward distribution
* Faster resolution
* No governance overhead
* Ideal for early-stage and hackathon deployment
* Clean upgrade path to community voting or DAO validation in v2

---

### (Optional) v2 Roadmap Teaser (1–2 lines)

> In future versions, validation can evolve into community voting or DAO-based arbitration once sufficient reputation and activity data exist.

---
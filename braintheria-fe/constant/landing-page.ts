import { BadgeQuestionMark, NotebookPen, ShieldQuestionMark, Coins } from 'lucide-react';

export const features = [
  {
    title: 'Ask A Question',
    icon: BadgeQuestionMark,
  },
  {
    title: 'Answer',
    icon: NotebookPen,
  },
  {
    title: 'Vote',
    icon: ShieldQuestionMark,
  },
  {
    title: 'Earn Tokens',
    icon: Coins,
  },
];

export const advantages = {
  todaysqna: [
    'Answers generate traffic and ad revenue but contributors earn nothing.',
    'Centralized algorithms decide what’s visible.',
    'High-quality answers get buried; niche expertise is undervalued.',
    'Users don’t own their content or reputation.',
  ],
  braintheria: [
    '💰 Fair compensation: Askers attach ETH bounties to questions.',
    '🔍 Transparent outcomes: Payouts and answer approvals are on-chain.',
    '🧾 Content ownership: IPFS + smart contracts → verifiable, censorship-resistant history.',
    '⚖ Community-aligned incentives: Value is shared with contributors, not just the platform.',
  ],
};

export const users = [
  {
    image: '/images/learner-image.png',
    category: 'Learners',
    description: ['Get reliable answers fast', 'Set a bounty to increase visibility'],
  },
  {
    image: '/images/expert-image.png',
    category: 'Experts',
    description: ['Monetize your knowledge', 'Build verifiable reputation'],
  },
];

export const faqs = [
  {
    question: 'Do I need crypto knowledge to use Braintheria?',
    answer:
      'Not deeply. As a learner, you can sign in with Google, top up a wallet, and attach small bounties to your questions without needing to know all the technical details. If you’re more crypto-native, you still get full control: you connect your own wallet, manage your funds, and track every transaction on-chain.',
  },
  {
    question: 'How do bounties and payments work?',
    answer:
      'When you ask a question, you attach a bounty in ETH that gets locked in a smart contract. Once you mark an answer as accepted, the contract automatically releases the bounty to the answerer. This flow is trustless: Braintheria doesn’t “manually” move your funds and the contract does it based on clear rules.',
  },
  {
    question: 'Which blockchain does Braintheria run on?',
    answer:
      'Braintheria is built on the Base network (starting on Base Sepolia for the alpha phase). This gives you fast, low-cost transactions while still inheriting Ethereum’s security model. All bounty-related actions funding, accepting, and payouts happen on-chain.',
  },
  {
    question: 'Who owns the content I post?',
    answer:
      'You do. Questions and answers are anchored on-chain and the content is stored via IPFS, which means your contributions are verifiable and resistant to censorship. Braintheria acts as an interface and curator, not as the sole owner of your knowledge.',
  },
  {
    question: 'How is my identity handled? Is Braintheria custodial?',
    answer:
      'Braintheria uses a hybrid auth setup: Google OAuth for accessibility and wallet-based identity for on-chain actions. Your private keys are never held by Braintheria you control your wallet. Off-chain data like email and profile details are stored in our backend; on-chain actions are tied to your wallet address and visible on the blockchain.',
  },
];

export const testimonials = [
  {
    name: 'Raka Pratama',
    role: 'Backend Developer',
    comment:
      'Braintheria finally gives me a reason to write long, detailed answers. Instead of just farming upvotes, I actually earn ETH when someone accepts my solution.',
    image: '/images/char-1.png',
  },
  {
    name: 'Sarah Lim',
    role: 'Computer Science Student',
    comment:
      'As a student, I love that I can put a small bounty on hard questions and get serious, in-depth answers. It feels like having a global mentor on demand.',
    image: '/images/char-3.png',
  },
  {
    name: 'Diego Martinez',
    role: 'Smart Contract Engineer',
    comment:
      'The fact that all bounties and payouts are on-chain is huge. I can literally show my answer history and earnings as an on-chain portfolio of my expertise.',
    image: '/images/char-2.png',
  },
  {
    name: 'Aulia Rahman',
    role: 'Web3 Community Lead',
    comment:
      'Braintheria fits perfectly into our Discord community. Members ask questions, attach bounties, and we can see transparent payouts instead of vague ‘thanks bro’ replies.',
    image: '/images/char-4.png',
  },
  {
    name: 'James Nguyen',
    role: 'Full-Stack Developer',
    comment:
      'The UX feels like a normal Q&A site, but under the hood everything is verifiable. I log in with Google, connect my wallet, and the rest just works.',
    image: '/images/char-5.png',
  },
  {
    name: 'Priya Desai',
    role: 'Data Scientist',
    comment:
      'I’ve answered niche ML questions that would normally get ignored elsewhere. On Braintheria, those questions come with bounties, so niche knowledge is finally rewarded.',
    image: '/images/char-8.png',
  },
  {
    name: 'Andre Santos',
    role: 'DevOps Engineer',
    comment:
      'What I like most is the trustless settlement. When my answer is accepted, the bounty goes straight to my wallet—no waiting, no negotiation, no hidden platform cuts.',
    image: '/images/char-7.png',
  },
  {
    name: 'Nadia Kusuma',
    role: 'Blockchain Bootcamp Mentor',
    comment:
      'We use Braintheria in our bootcamp as a place where students can post real questions with micro-bounties. It trains them to value good answers and think clearly.',
    image: '/images/char-6.png',
  },
  {
    name: 'Leo Chen',
    role: 'Product Manager',
    comment:
      'Braintheria turns Q&A into a proper knowledge economy. Incentives are clear: ask better questions, give better answers, and everyone can see the value flow on-chain.',
    image: '/images/char-9.png',
  },
  {
    name: 'Maya Al-Hassan',
    role: 'Web3 Content Creator',
    comment:
      'I love that my answers aren’t just trapped in one platform. With IPFS and on-chain records, my content feels portable, permanent, and truly mine.',
    image: '/images/char-10.png',
  },
];

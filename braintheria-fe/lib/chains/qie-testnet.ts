import { defineChain } from 'viem';

export const qieTestnet = defineChain({
  id: 1983,
  name: 'QIE Testnet',
  nativeCurrency: {
    name: 'QIE',
    symbol: 'QIE',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc1testnet.qie.digital'] },
    public: { http: ['https://rpc1testnet.qie.digital'] },
  },
  blockExplorers: {
    default: { name: 'QIE Testnet Explorer', url: 'https://testnet.qie.digital' },
  },
  testnet: true,
});

export const BRAIN_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_BRAIN_TOKEN_ADDRESS;

// QnAWithBounty Contract - User must approve this contract to spend their BRAIN
export const QNA_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_QNA_CONTRACT_ADDRESS;

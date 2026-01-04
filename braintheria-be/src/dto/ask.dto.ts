export class AskDto {
  title: string;
  bodyMd: string;
  files?: { name: string; cid: string; size: number }[];

  // Optional: For on-chain bounty
  // User must approve QnA contract to spend their BRAIN tokens before submitting
  bounty?: number; // Amount in BRAIN tokens
}

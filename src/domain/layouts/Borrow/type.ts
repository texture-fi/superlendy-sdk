import { PublicKey } from '@solana/web3.js';

export interface BorrowParams {
  amount: BigInt;
  slippage_limit: BigInt;
  position: PublicKey;
  reserve: PublicKey;
  pool: PublicKey;
  curator: PublicKey;
  textureConfig: PublicKey;
  liquidityMint: PublicKey;
  feeAuthority: PublicKey;
  curatorFeeReceiver: PublicKey;
  borrower?: PublicKey;
  memo?: Uint8Array;
}

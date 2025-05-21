import { PublicKey } from '@solana/web3.js';

export interface LockCollateralParams {
  position: PublicKey;
  reserve: PublicKey;
  lpMint: PublicKey;
  sourceLpWallet?: PublicKey;
  amount: BigInt;
  owner?: PublicKey;
  memo?: Uint8Array;
}

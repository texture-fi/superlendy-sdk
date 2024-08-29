import { blob, struct } from '@solana/buffer-layout';
import { PublicKey } from '@solana/web3.js';
import { publicKey, u128 } from '@solana/buffer-layout-utils';

const BORROW_MEMO_LEN = 32;

export interface BorrowedLiquidityLayout {
  borrow_reserve: PublicKey;
  cumulative_borrow_rate: BigInt;
  borrowed_amount: BigInt;
  market_value: BigInt;
  entry_market_value: BigInt;
  memo: Uint8Array;
}

export const borrowedLiquidityLayout = struct<BorrowedLiquidityLayout>([
  publicKey('borrow_reserve'),
  u128('cumulative_borrow_rate'),
  u128('borrowed_amount'),
  u128('market_value'),
  u128('entry_market_value'),
  blob(BORROW_MEMO_LEN, 'memo'),
]);

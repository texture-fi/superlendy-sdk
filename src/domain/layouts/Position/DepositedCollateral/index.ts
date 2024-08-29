import { blob, struct } from '@solana/buffer-layout';
import { PublicKey } from '@solana/web3.js';
import { publicKey, u128, u64 } from '@solana/buffer-layout-utils';

const COLLATERAL_MEMO_LEN = 24;

export interface DepositedCollateralLayout {
  deposit_reserve: PublicKey;
  entry_market_value: BigInt;
  market_value: BigInt;
  deposited_amount: BigInt;
  memo: Uint8Array;
}

export const depositedCollateralLayout = struct<DepositedCollateralLayout>([
  publicKey('deposit_reserve'),
  u128('entry_market_value'),
  u128('market_value'),
  u64('deposited_amount'),
  blob(COLLATERAL_MEMO_LEN, 'memo'),
]);

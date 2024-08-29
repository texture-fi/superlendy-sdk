import { blob, struct, u8 } from '@solana/buffer-layout';
import { publicKey, u128, u64 } from '@solana/buffer-layout-utils';
import { PublicKey } from '@solana/web3.js';

export interface RewardRulesLayout {
  mint: PublicKey;
  borrowed_amount_wads: bigint;
  cumulative_borrow_rate_wads: bigint;
  market_price: bigint;
  curator_performance_fee_wads: bigint;
  texture_performance_fee_wads: bigint;
  borrow_rate: bigint;
  available_amount: bigint;
  _padding: bigint;
  mint_decimals: number;
  _padding1: Uint8Array;
}

export const rewardRulesLayout = (property: string) =>
  struct<RewardRulesLayout>(
    [
      publicKey('mint'),
      u128('borrowed_amount_wads'),
      u128('cumulative_borrow_rate_wads'),
      u128('market_price'),
      u128('curator_performance_fee_wads'),
      u128('texture_performance_fee_wads'),
      u128('borrow_rate'),
      u64('available_amount'),
      u64('_padding'),
      u8('mint_decimals'),
      blob(15 + 32 * 2, '_padding1'),
    ],
    property,
  );

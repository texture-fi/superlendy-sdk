import { seq, struct } from '@solana/buffer-layout';
import { PublicKey } from '@solana/web3.js';
import { publicKey, u64 } from '@solana/buffer-layout-utils';

const MAX_REWARDS = 10;

export interface RewardLayout {
  reward_mint: PublicKey;
  accrued_slot: BigInt;
  accrued_amount: BigInt;
}

const rewardLayout = struct<RewardLayout>([
  publicKey('reward_mint'),
  u64('accrued_slot'),
  u64('accrued_amount'),
]);

export interface RewardsLayout {
  rewards: RewardLayout[];
}

export const rewardsLayout = (property: string) =>
  struct<RewardsLayout>([seq(rewardLayout, MAX_REWARDS, 'rewards')], property);

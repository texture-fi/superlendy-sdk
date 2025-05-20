import { blob, seq, struct, u8 } from '@solana/buffer-layout';
import { PublicKey } from '@solana/web3.js';
import { publicKey, u128, u64 } from '@solana/buffer-layout-utils';
import { LastUpdateLayout, lastUpdateLayout } from '../common/LastUpdate';
import {
  DepositedCollateralLayout,
  depositedCollateralLayout,
} from './DepositedCollateral';
import {
  BorrowedLiquidityLayout,
  borrowedLiquidityLayout,
} from './BorrowedLiquidity';
import { rewardsLayout, RewardsLayout } from '../common/Rewards';
import { PositionType } from './type';

export const MAX_DEPOSITS = 10;
const MAX_BORROWS = 10;

export interface PositionLayout {
  discriminator: Uint8Array;
  version: number;
  position_type: number;
  _flags: Uint8Array;
  last_update: LastUpdateLayout;
  pool: PublicKey;
  owner: PublicKey;
  collateral: DepositedCollateralLayout[];
  borrows: BorrowedLiquidityLayout[];
  rewards: RewardsLayout;
  deposited_value: BigInt;
  borrowed_value: BigInt;
  allowed_borrow_value: BigInt;
  partly_unhealthy_borrow_value: BigInt;
  fully_unhealthy_borrow_value: BigInt;
}

export const positionLayout = struct<PositionLayout>([
  blob(8, 'discriminator'),
  u8('version'),
  u8('position_type'),

  blob(6, '_flags'),
  lastUpdateLayout('last_update'),
  publicKey('pool'),
  publicKey('owner'),
  seq(depositedCollateralLayout, MAX_DEPOSITS, 'collateral'),
  seq(borrowedLiquidityLayout, MAX_BORROWS, 'borrows'),
  rewardsLayout('rewards'),
  u128('deposited_value'),
  u128('borrowed_value'),
  u128('allowed_borrow_value'),
  u128('partly_unhealthy_borrow_value'),
  u128('fully_unhealthy_borrow_value'),
  blob(256, '_padding'),
]);

export interface CreatePositionParamsLayout {
  type: PositionType;
}

export const createPositionParamsLayout = struct<CreatePositionParamsLayout>([
  u8('type'),
]);

export interface PositionParamsLayout {
  deposit_count: number;
  borrow_count: number;
}

export const positionParamsLayout = struct<PositionParamsLayout>([
  u8('deposit_count'),
  u8('borrow_count'),
]);

export interface RepayParamsLayout {
  amount: bigint;
}

export const repayParamsLayout = struct<RepayParamsLayout>([u64('amount')]);

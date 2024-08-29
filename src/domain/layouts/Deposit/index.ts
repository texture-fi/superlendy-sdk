import { struct } from '@solana/buffer-layout';
import { u64 } from '@solana/buffer-layout-utils';

export interface DepositLiquidityParamsLayout {
  amount: bigint;
}

export const depositLiquidityParamsLayout =
  struct<DepositLiquidityParamsLayout>([u64('amount')]);

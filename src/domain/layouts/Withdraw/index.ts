import { struct } from '@solana/buffer-layout';
import { u64 } from '@solana/buffer-layout-utils';

export interface WithdrawLiquidityParamsLayout {
  amount: bigint;
}

export const withdrawLiquidityParamsLayout =
  struct<WithdrawLiquidityParamsLayout>([u64('amount')]);

import { struct } from '@solana/buffer-layout';
import { u64 } from '@solana/buffer-layout-utils';

export interface FlashLoanRepayParamsLayout {
  amount: bigint;
}

export const flashLoanRepayParamsLayout = struct<FlashLoanRepayParamsLayout>([
  u64('amount'),
]);

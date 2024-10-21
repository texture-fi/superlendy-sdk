import { struct } from '@solana/buffer-layout';
import { u64 } from '@solana/buffer-layout-utils';

export interface FlashLoanBorrowParamsLayout {
  amount: bigint;
}

export const flashLoanBorrowParamsLayout = struct<FlashLoanBorrowParamsLayout>([
  u64('amount'),
]);

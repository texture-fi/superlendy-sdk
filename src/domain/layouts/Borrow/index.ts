import { blob, struct } from '@solana/buffer-layout';
import { u64 } from '@solana/buffer-layout-utils';

export const BORROW_MEMO_LEN = 32;

export interface BorrowParamsLayout {
  amount: BigInt;
  slippage_limit: BigInt;
  memo: Uint8Array;
}

export const borrowParamsLayout = struct<BorrowParamsLayout>([
  u64('amount'),
  u64('slippage_limit'),
  blob(BORROW_MEMO_LEN, 'memo'),
]);

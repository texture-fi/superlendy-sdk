import { blob, struct } from '@solana/buffer-layout';
import { u64 } from '@solana/buffer-layout-utils';

export const COLLATERAL_MEMO_LEN = 24;

export interface LockCollateralParamsLayout {
  principal_amount: BigInt;
  memo: Uint8Array;
}

export const lockCollateralParamsLayout = struct<LockCollateralParamsLayout>([
  u64('principal_amount'),
  blob(COLLATERAL_MEMO_LEN, 'memo'),
]);

export interface UnlockCollateralParamsLayout {
  amount: BigInt;
}

export const unlockCollateralParamsLayout =
  struct<UnlockCollateralParamsLayout>([u64('amount')]);

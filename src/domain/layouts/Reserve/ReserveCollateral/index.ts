import { struct } from '@solana/buffer-layout';
import { u64 } from '@solana/buffer-layout-utils';

export interface ReserveCollateralLayout {
  lp_total_supply: bigint;
  _padding: bigint;
}

export const reserveCollateralLayout = (property: string) =>
  struct<ReserveCollateralLayout>(
    [u64('lp_total_supply'), u64('_padding')],
    property,
  );

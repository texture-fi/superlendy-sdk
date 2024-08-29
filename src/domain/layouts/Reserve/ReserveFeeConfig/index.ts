import { blob, struct, u16 } from '@solana/buffer-layout';

export interface ReserveFeesConfigLayout {
  curator_borrow_fee_rate_bps: number;
  curator_performance_fee_rate_bps: number;
  _padding: Uint8Array;
}

export const reserveFeesConfigLayout = (property: string) =>
  struct<ReserveFeesConfigLayout>(
    [
      u16('curator_borrow_fee_rate_bps'),
      u16('curator_performance_fee_rate_bps'),
      blob(12, '_padding'),
    ],
    property,
  );

import { blob, struct, u8 } from '@solana/buffer-layout';
import { u64 } from '@solana/buffer-layout-utils';

export interface LastUpdateLayout {
  slot: BigInt;
  timestamp: BigInt;
  stale: number;
  _padding: Uint8Array;
}

export const lastUpdateLayout = (property: string) =>
  struct<LastUpdateLayout>(
    [u64('slot'), u64('timestamp'), u8('stale'), blob(15, '_padding')],
    property,
  );

import { blob, struct, u16, u8 } from '@solana/buffer-layout';
import { publicKey, u64 } from '@solana/buffer-layout-utils';
import { PublicKey } from '@solana/web3.js';
import {
  reserveFeesConfigLayout,
  ReserveFeesConfigLayout,
} from '../ReserveFeeConfig';

export interface ReserveConfigLayout {
  market_price_feed: PublicKey;
  irm: PublicKey;
  liquidation_bonus_bps: number;
  partly_unhealthy_ltv_bps: number;
  fully_unhealthy_ltv_bps: number;
  partial_liquidation_factor_bps: number;
  max_total_liquidity: bigint;
  max_borrow_ltv_bps: number;
  max_utilization_bps: number;
  price_stale_threshold_sec: number;
  _padding: Uint8Array;
  fees: ReserveFeesConfigLayout;
}

export const reserveConfigLayout = (property: string) =>
  struct<ReserveConfigLayout>(
    [
      publicKey('market_price_feed'),
      publicKey('irm'),
      u16('liquidation_bonus_bps'),
      u16('partly_unhealthy_ltv_bps'),
      u16('fully_unhealthy_ltv_bps'),
      u16('partial_liquidation_factor_bps'),
      u64('max_total_liquidity'),
      u16('max_borrow_ltv_bps'),
      u16('max_utilization_bps'),
      u8('price_stale_threshold_sec'),
      blob(11, '_padding'),
      reserveFeesConfigLayout('fees'),
    ],
    property,
  );

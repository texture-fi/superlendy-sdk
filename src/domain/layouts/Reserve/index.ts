import { blob, struct, u8 } from '@solana/buffer-layout';
import { publicKey } from '@solana/buffer-layout-utils';
import { PublicKey } from '@solana/web3.js';
import { reserveConfigLayout, ReserveConfigLayout } from './ReserveConfig';
import { lastUpdateLayout, LastUpdateLayout } from '../common/LastUpdate';
import {
  ReserveLiquidityLayout,
  reserveLiquidityLayout,
} from './ReserveLiquidity';
import {
  ReserveCollateralLayout,
  reserveCollateralLayout,
} from './ReserveCollateral';
import { RewardRulesLayout, rewardRulesLayout } from './RewardRules';

export interface ReserveLayout {
  discriminator: Uint8Array;
  version: number;
  reserve_type: number;
  mode: number;
  _flags: Uint8Array;
  last_update: LastUpdateLayout;
  pool: PublicKey;
  liquidity: ReserveLiquidityLayout;
  collateral: ReserveCollateralLayout;
  config: ReserveConfigLayout;
  reward_rules: RewardRulesLayout;
  _padding: Uint8Array;
}

export const reserveLayout = struct<ReserveLayout>([
  blob(8, 'discriminator'),
  u8('version'),
  u8('reserve_type'),
  u8('mode'),
  blob(5, '_flags'),
  lastUpdateLayout('last_update'),
  publicKey('pool'),
  reserveLiquidityLayout('liquidity'),
  reserveCollateralLayout('collateral'),
  reserveConfigLayout('config'),
  rewardRulesLayout('reward_rules'),
  blob(256, '_padding'),
]);

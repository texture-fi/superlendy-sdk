import { blob, struct, u8 } from '@solana/buffer-layout';
import { publicKey, u128, u64 } from '@solana/buffer-layout-utils';
import { PublicKey } from '@solana/web3.js';

const SYMBOL_MAX_SIZE = 16;
const LOGO_URL_MAX_LEN = 128;

export interface PriceFeedLayout {
  discriminator: Uint8Array;
  version: number;
  _padding0: Uint8Array;
  feed_type: number;
  quote_symbol: number;
  verification_level: number;
  source_raw: number;
  transform_source_raw: number;
  source_address: PublicKey;
  transform_source_address: PublicKey;
  symbol: Uint8Array;
  logo_url: Uint8Array;
  update_authority: PublicKey;
  update_timestamp: bigint;
  update_slot: bigint;
  price_raw: bigint;
  _padding: Uint8Array;
}

export const priceFeedLayout = struct<PriceFeedLayout>([
  blob(8, 'discriminator'),
  u8('version'),
  blob(2, '_padding0'),
  u8('feed_type'),
  u8('quote_symbol'),
  u8('verification_level'),
  u8('source_raw'),
  u8('transform_source_raw'),
  publicKey('source_address'),
  publicKey('transform_source_address'),
  blob(SYMBOL_MAX_SIZE, 'symbol'),
  blob(LOGO_URL_MAX_LEN, 'logo_url'),
  publicKey('update_authority'),
  u64('update_timestamp'),
  u64('update_slot'),
  u128('price_raw'),
  blob(128, '_padding'),
]);

export interface UpdatePriceLayout {
  maximum_age_sec: bigint;
}

export const updatePriceLayout = struct<UpdatePriceLayout>([
  u64('maximum_age_sec'),
]);

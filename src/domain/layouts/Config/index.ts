import { blob, struct, u16, u8 } from '@solana/buffer-layout';
import { publicKey } from '@solana/buffer-layout-utils';
import { PublicKey } from '@solana/web3.js';

export interface TextureConfigLayout {
  discriminator: Uint8Array;
  version: number;

  /// Vacant to store mode/status flags
  _flags: Uint8Array;

  /// Percentage of (any) borrowed amount which will be paid to texture as loan origination fee
  borrow_fee_rate_bps: number;

  /// Percentage of (any) pool's interest which will be paid to Texture as performance fee
  performance_fee_rate_bps: number;

  /// Owner authority who can change this account
  owner: PublicKey;

  /// This is main wallet address (SOL holding, system program owned) who allowed to claim
  /// Texture performance fees. Also ATA accounts of this authority are used as fee receivers
  /// for borrow fees.
  fees_authority: PublicKey;

  _padding: Uint8Array;
}

export const textureConfigLayout = struct<TextureConfigLayout>([
  blob(8, 'discriminator'),
  u8('version'),
  blob(3, '_flags'),
  u16('borrow_fee_rate_bps'),
  u16('performance_fee_rate_bps'),
  publicKey('owner'),
  publicKey('fees_authority'),
  blob(32 * 8, '_padding'),
]);

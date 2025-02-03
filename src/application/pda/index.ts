import { PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';
import { SUPER_LENDY_ID } from '../../const';

const SEEDS = {
  LP_TOKEN_SEED: Buffer.from('LP_TOKEN'),
  COLLATERAL_SUPPLY_SEED: Buffer.from('COLLATERAL_SUPPLY'),
  LIQUIDITY_SUPPLY_SEED: Buffer.from('LIQUIDITY_SUPPLY'),
  REWARD_SUPPLY_SEED: Buffer.from('REWARD_SUPPLY'),
  AUTHORITY_SEED: Buffer.from('AUTHORITY'),
};

export function findLpTokenMint(reserve: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [reserve.toBuffer(), SEEDS.LP_TOKEN_SEED],
    SUPER_LENDY_ID,
  );
}

export function findReserveCollateralSupply(reserve: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [reserve.toBuffer(), SEEDS.COLLATERAL_SUPPLY_SEED],
    SUPER_LENDY_ID,
  );
}

export function findLiquiditySupply(reserve: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [reserve.toBuffer(), SEEDS.LIQUIDITY_SUPPLY_SEED],
    SUPER_LENDY_ID,
  );
}

export function findRewardSupply(pool: PublicKey, mint: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [pool.toBuffer(), mint.toBuffer(), SEEDS.REWARD_SUPPLY_SEED],
    SUPER_LENDY_ID,
  );
}

export function findProgramAddress() {
  return PublicKey.findProgramAddressSync(
    [SEEDS.AUTHORITY_SEED],
    SUPER_LENDY_ID,
  );
}

export function findRewardProgramAuthority(pool: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [pool.toBuffer(), SEEDS.AUTHORITY_SEED],
    SUPER_LENDY_ID,
  );
}

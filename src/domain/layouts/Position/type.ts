import { PublicKey } from '@solana/web3.js';

export enum PositionType {
  POSITION_TYPE_CLASSIC,
  POSITION_TYPE_LONG_SHORT,
  POSITION_TYPE_LST_LEVERAGE,
}

export interface CreatePositionParams {
  position: PublicKey;
  pool: PublicKey;
  owner?: PublicKey;
  type?: PositionType;
}

import {
  AccountMeta,
  Connection,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
} from '@solana/web3.js';
import { Structure } from '@solana/buffer-layout';
import { Buffer } from 'buffer';

import { PRICE_PROXY_ID, SUPER_LENDY_ID, TEXTURE_CONFIG_ID } from '../../const';
import { PriceProxyInstructionId, SuperLendyInstructionId } from './type';

import {
  BORROW_MEMO_LEN,
  borrowParamsLayout,
  BorrowParamsLayout,
  COLLATERAL_MEMO_LEN,
  CreatePositionParamsLayout,
  createPositionParamsLayout,
  lockCollateralParamsLayout,
  LockCollateralParamsLayout,
} from '../../domain';
import {
  findLiquiditySupply,
  findLpTokenMint,
  findProgramAddress,
  findReserveCollateralSupply,
} from '../pda';
import {
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { SuperLendyAccounts } from '../accounts';
import {
  CreatePositionParams,
  PositionType,
} from '../../domain/layouts/Position/type';
import { LockCollateralParams } from '../../domain/layouts/LockCollateral/type';
import { BorrowParams } from '../../domain/layouts/Borrow/type';
import { updatePriceLayout } from '../../domain/layouts/PriceFeed';
import {
  positionParamsLayout,
  PositionParamsLayout,
  repayParamsLayout,
} from '../../domain/layouts/Position';
import { depositLiquidityParamsLayout } from '../../domain/layouts/Deposit';
import { unlockCollateralParamsLayout } from '../../domain/layouts/LockCollateral';

export class SuperLendyInstruction {
  constructor(
    public readonly auth: PublicKey,
    public readonly connection: Connection,
  ) {}

  public version() {
    const keys = [
      SuperLendyInstruction.meta(SystemProgram.programId, false, false),
    ];

    const data = this.encode(SuperLendyInstructionId.Version);
    return this.ix(keys, data);
  }

  public createPosition({
    position,
    pool,
    owner = this.auth,
    type = PositionType.POSITION_TYPE_CLASSIC,
  }: CreatePositionParams) {
    const keys = [
      SuperLendyInstruction.meta(position, true, true),
      SuperLendyInstruction.meta(pool, false, false),
      SuperLendyInstruction.meta(owner, true, true),
    ];

    const data = this.encode<CreatePositionParamsLayout>(
      SuperLendyInstructionId.CreatePosition,
      { type },
      createPositionParamsLayout,
    );
    return this.ix(keys, data);
  }

  public async createPositionAccount(
    position: PublicKey,
    auth: PublicKey = this.auth,
  ) {
    console.log('position', position.toString());
    console.log('auth', auth.toString());
    const lamports = await this.connection.getMinimumBalanceForRentExemption(
      SuperLendyAccounts.position.span,
    );
    return SystemProgram.createAccount({
      fromPubkey: this.auth,
      space: SuperLendyAccounts.position.span,
      lamports,
      newAccountPubkey: position,
      programId: SUPER_LENDY_ID,
    });
  }

  public lockCollateral({
    amount,
    position,
    reserve,
    lpMint,
    memo = new Uint8Array(COLLATERAL_MEMO_LEN),
    owner = this.auth,
  }: LockCollateralParams) {
    const sourceLpWallet = getAssociatedTokenAddressSync(lpMint, owner);
    const [reserveCollateralSupply] = findReserveCollateralSupply(reserve);

    const keys = [
      SuperLendyInstruction.meta(position, true, false),
      SuperLendyInstruction.meta(sourceLpWallet, true, false),
      SuperLendyInstruction.meta(reserveCollateralSupply, true, false),
      SuperLendyInstruction.meta(owner, false, true),
      SuperLendyInstruction.meta(reserve, false, false),
      SuperLendyInstruction.meta(TOKEN_PROGRAM_ID, false, false),
    ];

    const data = this.encode<LockCollateralParamsLayout>(
      SuperLendyInstructionId.LockCollateral,
      {
        principal_amount: amount,
        memo,
      },
      lockCollateralParamsLayout,
    );
    return this.ix(keys, data);
  }

  public borrow({
    amount,
    slippage_limit,
    position,
    reserve,
    pool,
    curator,
    textureConfig,
    liquidityMint,
    feeAuthority,
    curatorFeeReceiver,
    borrower = this.auth,
    memo = new Uint8Array(BORROW_MEMO_LEN),
  }: BorrowParams) {
    const [reserveLiquiditySupply] = findLiquiditySupply(reserve);
    const destinationLiquidityWallet = getAssociatedTokenAddressSync(
      liquidityMint,
      borrower,
    );

    const textureFeeReceiver = getAssociatedTokenAddressSync(
      liquidityMint,
      feeAuthority,
    );

    const [program_authority] = findProgramAddress();

    const keys = [
      SuperLendyInstruction.meta(position, true, false),
      SuperLendyInstruction.meta(reserveLiquiditySupply, true, false),
      SuperLendyInstruction.meta(destinationLiquidityWallet, true, false),
      SuperLendyInstruction.meta(curatorFeeReceiver, true, false),
      SuperLendyInstruction.meta(borrower, false, true),
      SuperLendyInstruction.meta(reserve, true, false),
      SuperLendyInstruction.meta(pool, false, false),
      SuperLendyInstruction.meta(curator, false, false),
      SuperLendyInstruction.meta(textureFeeReceiver, true, false),
      SuperLendyInstruction.meta(textureConfig, false, false),
      SuperLendyInstruction.meta(program_authority, false, false),
      SuperLendyInstruction.meta(TOKEN_PROGRAM_ID, false, false),
    ];

    const data = this.encode<BorrowParamsLayout>(
      SuperLendyInstructionId.Borrow,
      {
        amount,
        slippage_limit,
        memo,
      },
      borrowParamsLayout,
    );

    return this.ix(keys, data);
  }

  public refreshReserve(
    reserve: PublicKey,
    marketPriceFeed: PublicKey,
    irm: PublicKey,
  ) {
    const keys = [
      SuperLendyInstruction.meta(reserve, true, false),
      SuperLendyInstruction.meta(marketPriceFeed, false, false),
      SuperLendyInstruction.meta(irm, false, false),
      SuperLendyInstruction.meta(TEXTURE_CONFIG_ID, false, false),
    ];

    const data = this.encode(SuperLendyInstructionId.RefreshReserve);

    return this.ix(keys, data);
  }

  public refreshPosition(
    position: PublicKey,
    borrows_reserves: PublicKey[],
    deposits_reserves: PublicKey[],
  ) {
    const keys = [
      SuperLendyInstruction.meta(position, true, false),
      ...deposits_reserves.map((depositReserve) =>
        SuperLendyInstruction.meta(depositReserve, false, false),
      ),
      ...borrows_reserves.map((borrowReserve) =>
        SuperLendyInstruction.meta(borrowReserve, false, false),
      ),
    ];
    const data = this.encode<PositionParamsLayout>(
      SuperLendyInstructionId.RefreshPosition,
      {
        borrow_count: borrows_reserves.length,
        deposit_count: deposits_reserves.length,
      },
      positionParamsLayout,
    );

    return this.ix(keys, data);
  }

  public updatePrice(
    priceFeed: PublicKey,
    sourceAddress: PublicKey,
    maximum_age_sec = 60n,
  ) {
    const keys = [
      SuperLendyInstruction.meta(priceFeed, true, false),
      SuperLendyInstruction.meta(sourceAddress, true, false),
    ];

    const data = this.encode(
      PriceProxyInstructionId.UpdatePrice,
      { maximum_age_sec },
      updatePriceLayout,
    );

    return this.ix(keys, data, PRICE_PROXY_ID);
  }

  public depositLiquidity(
    amount: bigint,
    reserve: PublicKey,
    reserveMint: PublicKey,
    auth = this.auth,
  ) {
    const [lp_mint] = findLpTokenMint(reserve);
    const source = getAssociatedTokenAddressSync(reserveMint, auth);
    const destination = getAssociatedTokenAddressSync(lp_mint, auth);

    const [liquidity_supply] = findLiquiditySupply(reserve);
    const [program_authority] = findProgramAddress();

    const keys = [
      SuperLendyInstruction.meta(auth, false, true),
      SuperLendyInstruction.meta(source, true, false),
      SuperLendyInstruction.meta(destination, true, false),
      SuperLendyInstruction.meta(reserve, true, false),
      SuperLendyInstruction.meta(liquidity_supply, true, false),
      SuperLendyInstruction.meta(lp_mint, true, false),
      SuperLendyInstruction.meta(program_authority, false, false),
      SuperLendyInstruction.meta(TOKEN_PROGRAM_ID, false, false),
    ];

    const data = this.encode(
      SuperLendyInstructionId.DepositLiquidity,
      { amount },
      depositLiquidityParamsLayout,
    );
    return this.ix(keys, data);
  }

  public unlockCollateral(
    amount: bigint,
    position: PublicKey,
    reserve: PublicKey,
    lpMint: PublicKey,
    auth = this.auth,
  ) {
    const [reserve_collateral_supply] = findReserveCollateralSupply(reserve);
    const destination_lp_wallet = getAssociatedTokenAddressSync(lpMint, auth);
    const [program_authority] = findProgramAddress();
    const keys = [
      SuperLendyInstruction.meta(position, true, false),
      SuperLendyInstruction.meta(reserve_collateral_supply, true, false),
      SuperLendyInstruction.meta(destination_lp_wallet, true, false),
      SuperLendyInstruction.meta(auth, false, true),
      SuperLendyInstruction.meta(reserve, false, false),
      SuperLendyInstruction.meta(program_authority, false, false),
      SuperLendyInstruction.meta(TOKEN_PROGRAM_ID, false, false),
    ];

    const data = this.encode(
      SuperLendyInstructionId.UnlockCollateral,
      { amount },
      unlockCollateralParamsLayout,
    );

    return this.ix(keys, data);
  }

  public repay(
    amount: bigint,
    position: PublicKey,
    reserve: PublicKey,
    lpMint: PublicKey,
    auth = this.auth,
  ) {
    const source_liquidity_wallet = getAssociatedTokenAddressSync(lpMint, auth);
    const [liquidity_supply] = findLiquiditySupply(reserve);
    const keys = [
      SuperLendyInstruction.meta(position, true, false),
      SuperLendyInstruction.meta(source_liquidity_wallet, true, false),
      SuperLendyInstruction.meta(liquidity_supply, true, false),
      SuperLendyInstruction.meta(auth, false, true),
      SuperLendyInstruction.meta(reserve, true, false),
      SuperLendyInstruction.meta(TOKEN_PROGRAM_ID, false, false),
    ];

    const data = this.encode(
      SuperLendyInstructionId.Repay,
      { amount },
      repayParamsLayout,
    );

    return this.ix(keys, data);
  }

  public claimReward() {
    const keys = [
      SuperLendyInstruction.meta(SystemProgram.programId, false, false),
    ];
    return this.ix(keys);
  }

  private ix(keys: AccountMeta[], data?: Buffer, programId = SUPER_LENDY_ID) {
    return new TransactionInstruction({
      keys,
      data,
      programId,
    });
  }

  private static meta(
    pubkey: PublicKey,
    isWritable: boolean,
    isSigner: boolean,
  ): AccountMeta {
    return {
      pubkey,
      isSigner,
      isWritable,
    };
  }

  private encode<T>(
    instructionId: SuperLendyInstructionId | PriceProxyInstructionId,
    params?: T,
    layout?: Structure<T>,
  ) {
    if (!params || !layout) {
      return Buffer.from([instructionId]);
    }
    const b = Buffer.alloc(layout.span + 1);

    b.writeUInt8(instructionId);

    layout.encode(params, b, 1);
    // console.log('layout.span:', layout.span);
    // console.log('data:', instructionId, b);
    return b;
  }
}

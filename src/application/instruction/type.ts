export enum SuperLendyInstructionId {
  /// Create TextureConfig account
  CreateTextureConfig,
  /// Change GlobalConfig account
  AlterTextureConfig,
  /// Create Curator account
  CreateCurator,
  /// Create Curator account
  AlterCurator,
  /// Create Pool account
  CreatePool,
  /// Change existing Pool account
  AlterPool,
  /// Creates Reserve.
  CreateReserve,
  /// Change existing reserve.
  AlterReserve,
  /// Accrue interest and update market price of liquidity on a reserve.
  RefreshReserve,
  /// Deposit liquidity in to reserve
  DepositLiquidity,
  /// Withdraw liquidity from reserve
  WithdrawLiquidity,
  /// Create new user position
  CreatePosition,
  ClosePosition,
  /// Refresh existing user position. Requires refreshed reserves (all deposits and borrowings).
  RefreshPosition,
  /// Lock LP tokens as collateral
  LockCollateral,
  /// Unlock and withdraw LP tokens from pool.
  UnlockCollateral,
  /// Borrow liquidity from the pool
  Borrow,
  /// Repay existing loan.
  Repay,
  /// Writes off bad debt for particular unhealthy Position.
  WriteOffBadDebt,
  /// Repay borrowed liquidity to a reserve to receive collateral at a
  /// discount from an unhealthy Position. Requires a refreshed
  /// position and reserves.
  Liquidate,
  /// Permissionless IX to transfer accrued Curators's performance fees on to ATA of
  /// [Curator.fees_authority]
  ClaimCuratorPerformanceFees,
  /// Permissionless IX to transfer accrued Texture's performance fees on to ATA of
  /// [TextureConfig.fees_authority]
  ClaimTexturePerformanceFees,
  /// Initialize contract controlled SPL wallet for particular reward token.
  InitRewardSupply,
  /// Set/change reward rule in the existing reserve.
  SetRewardRules,
  /// Claim reward tokens.
  ClaimReward,
  /// Withdraw reward tokens from reward supply account
  /// Contract doesn't have DepositReward IX as it can be done by SplToken directly.
  WithdrawReward,
  // 26
  /// Flash borrow reserve liquidity
  FlashBorrow,
  // 27
  /// Flash repay reserve liquidity
  FlashRepay,
  ProposeConfig,
  ApplyConfigProposal,
  DeleteReserve,
  TransferTextureConfigOwnership,
  /// Always fails but prints contact version in to returned logs
  Version,
  RefreshReserveWeak,
}

export enum PriceProxyInstructionId {
  CreatePriceFeed,
  WritePrice,
  UpdatePrice,
  AlterPriceFeed,
  DeletePriceFeed,
}

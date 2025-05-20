import { Connection, PublicKey } from '@solana/web3.js';
import { SUPER_LENDY_ID, TEXTURE_CONFIG_ID } from '../../const';
import { reserveLayout, textureConfigLayout } from '../../domain';
import { DISCRIMINATOR, MAX_DEPOSITS, PositionLayout, positionLayout } from '../../domain/layouts/Position';
import { priceFeedLayout } from '../../domain/layouts/PriceFeed';
import { depositedCollateralLayout } from '../../domain/layouts/Position/DepositedCollateral';

export class SuperLendyAccounts {
  constructor(private connection: Connection) {}

  async getConfigAccount() {
    const accountInfo = await this.connection.getAccountInfo(TEXTURE_CONFIG_ID);
    if (!accountInfo) {
      throw Error(`Config account ${TEXTURE_CONFIG_ID} not found`);
    }
    return textureConfigLayout.decode(accountInfo.data);
  }

  async getPositionAccount(position: PublicKey) {
    const accountInfo = await this.connection.getAccountInfo(position);
    if (!accountInfo) {
      throw Error(`Position account ${position} not found`);
    }
    try {
      return positionLayout.decode(accountInfo.data);
    } catch (e) {
      console.error(e);
      throw Error(`Incorrect account ${position}`);
    }
  }

  async getReserveAccount(reserve: PublicKey) {
    const accountInfo = await this.connection.getAccountInfo(reserve);
    if (!accountInfo) {
      throw Error(`Reserve account ${reserve} not found`);
    }
    try {
      return reserveLayout.decode(accountInfo.data);
    } catch (e) {
      console.error(e);
      throw Error(`Incorrect account ${reserve}`);
    }
  }

  async getPriceFeedAccount(priceFeed: PublicKey) {
    const accountInfo = await this.connection.getAccountInfo(priceFeed);
    if (!accountInfo) {
      throw Error(`Price feed account ${priceFeed} not found`);
    }
    try {
      return priceFeedLayout.decode(accountInfo.data);
    } catch (e) {
      console.error(e);
      throw Error(`Incorrect account ${priceFeed}`);
    }
  }

  async getAllPositionsByReserve(reserve: PublicKey) {
    const resultPositions: PositionLayout[] = [];

    for (let i = 0; i < MAX_DEPOSITS; i++) {
      const positions = await this.connection.getProgramAccounts(
        SUPER_LENDY_ID,
        {
          filters: [
            {
              memcmp: {
                offset: 0,
                bytes: DISCRIMINATOR,
              },
            },
            {
              memcmp: {
                offset: 112 + depositedCollateralLayout.span * i,
                bytes: reserve.toBase58(),
              },
            },
          ],
        },
      );

      const positionsBatch = positions.map((position) => {
        if (position.account === null) {
          throw new Error('Invalid account');
        }
        if (!position.account.owner.equals(SUPER_LENDY_ID)) {
          throw new Error("Account doesn't belong to this program");
        }
        const positionData = positionLayout.decode(position.account.data);

        if (!positionData) {
          throw Error('Could not parse position.');
        }

        return positionData;
      });

      resultPositions.push(...positionsBatch);
    }

    return resultPositions;
  }

  static readonly priceFeed = priceFeedLayout;
  static readonly position = positionLayout;
  static readonly reserve = reserveLayout;
}

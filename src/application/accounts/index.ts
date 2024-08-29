import { Connection, PublicKey } from '@solana/web3.js';
import { TEXTURE_CONFIG_ID } from '../../const';
import { reserveLayout, textureConfigLayout } from '../../domain';
import { positionLayout } from '../../domain/layouts/Position';
import { priceFeedLayout } from '../../domain/layouts/PriceFeed';

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

  static readonly priceFeed = priceFeedLayout;
  static readonly position = positionLayout;
  static readonly reserve = reserveLayout;
}

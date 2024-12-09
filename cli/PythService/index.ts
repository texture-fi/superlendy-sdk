import { PriceServiceConnection } from '@pythnetwork/price-service-client';
import {
  Connection,
  PublicKey,
  Signer,
  TransactionInstruction,
} from '@solana/web3.js';
import {
  InstructionWithEphemeralSigners,
  PythSolanaReceiver,
} from '@pythnetwork/pyth-solana-receiver';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';

type BuilderInstruction = {
  instructions: TransactionInstruction[];
  signers: Map<string, Signer>;
  computeUnits: number;
  priceFeedIdToPriceUpdateAccount: Record<string, PublicKey>;
};

export class PythService {
  public readonly priceServiceConnection: PriceServiceConnection;
  public readonly pythSolanaReceiver: PythSolanaReceiver;

  constructor(connection: Connection, wallet: NodeWallet) {
    this.priceServiceConnection = new PriceServiceConnection(
      'https://hermes.pyth.network/',
      { priceFeedRequestConfig: { binary: true } },
    );

    this.pythSolanaReceiver = new PythSolanaReceiver({ connection, wallet });
  }

  public fetchPriceUpdates(priceFeeds: string[]) {
    return this.priceServiceConnection.getLatestVaas(priceFeeds);
  }

  public async getPriceUpdatesTransactionBuilder(
    priceUpdateData: string[],
    addPriceConsumerInstructions?: (
      getPriceUpdateAccount: (priceFeedId: string) => PublicKey,
    ) => Promise<InstructionWithEphemeralSigners[]>,
  ) {
    const transactionBuilder = this.pythSolanaReceiver.newTransactionBuilder({
      closeUpdateAccounts: false,
    });
    await transactionBuilder.addPostPriceUpdates(priceUpdateData);

    if (addPriceConsumerInstructions) {
      await transactionBuilder.addPriceConsumerInstructions(
        addPriceConsumerInstructions,
      );
    }
    return transactionBuilder;
  }

  public async getPriceUpdatesData(priceUpdateData: string[]) {
    const transactionBuilder =
      await this.getPriceUpdatesTransactionBuilder(priceUpdateData);
    const priceFeedIdToPriceUpdateAccount =
      transactionBuilder.priceFeedIdToPriceUpdateAccount;

    return transactionBuilder.transactionInstructions.reduce<BuilderInstruction>(
      (acc, { signers, instructions, computeUnits }) => {
        signers.forEach((signer) =>
          acc.signers.set(signer.publicKey.toString(), signer),
        );
        acc.computeUnits += computeUnits;
        acc.instructions.push(...instructions);

        return acc;
      },
      {
        instructions: [],
        signers: new Map(),
        computeUnits: 0,
        priceFeedIdToPriceUpdateAccount,
      },
    );
  }
}

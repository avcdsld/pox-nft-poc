import { AlchemyProvider, Wallet, Contract, formatUnits, parseUnits } from 'ethers';

class Ethers {
  nftContract: Contract;
  alchemyProvider: AlchemyProvider;

  constructor() {
    const network = process.env.ALCHEMY_NETWORK; // 'matic' or 'maticmum'
    this.alchemyProvider = new AlchemyProvider(network, process.env.ALCHEMY_API_KEY);
    const signer = new Wallet(process.env.POX_ADMIN_PRIVATE_KEY!, this.alchemyProvider);
    const abi = [
      'function mintByOwner(uint16 exhibitionIndex, string memory name, address toAddress)',
    ];
    this.nftContract = new Contract(process.env.POX_CONTRACT_ADDRESS!, abi, signer);
  }

  async mint(exhibitionIndex: number, toAddress: string, name: string): Promise<string> {
    const gas = await this.nftContract.mintByOwner.estimateGas(exhibitionIndex, name, toAddress);
    const txOptions = await this.getTxOptions(gas);
    const tx = await this.nftContract.mintByOwner(exhibitionIndex, name, toAddress, txOptions);
    console.log({ tx })
    return tx.hash;
  }

  async getTxOptions(gasLimit: bigint) {
    const GAS_MULTIPLIER = 1.15;

    const block = await this.alchemyProvider.getBlock('latest');
    const baseFee = parseFloat(formatUnits(Number(block!.baseFeePerGas), 'gwei'));

    const maxPriorityFeeWei = BigInt(await this.alchemyProvider.send('eth_maxPriorityFeePerGas', []));
    const maxPriorityFee = parseFloat(formatUnits(maxPriorityFeeWei, 'gwei'));
    const maxFeePerGas = (baseFee + maxPriorityFee) + (baseFee * 0.25);

    return {
      gasLimit: Math.round(Number(gasLimit) * GAS_MULTIPLIER),
      maxFeePerGas: parseUnits(maxFeePerGas.toFixed(8), 'gwei'),
      maxPriorityFeePerGas: parseUnits(maxPriorityFee.toFixed(8), 'gwei'),
    }
  }
}

export const ethers = new Ethers();

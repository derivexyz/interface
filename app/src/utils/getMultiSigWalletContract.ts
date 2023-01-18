import { Network } from '@lyrafinance/lyra-js'
import { Contract, Signer } from 'ethers'

import MultiSigWalletABI from '../contracts/abis/MultiSigWallet.json'
import { MultiSigWallet } from '../contracts/typechain'
import getLyraSDK from './getLyraSDK'

export default function getMultiSigWalletContract(
  network: Network,
  addressOrName: string,
  signer?: Signer | null
): MultiSigWallet {
  return new Contract(addressOrName, MultiSigWalletABI, signer ?? getLyraSDK(network).provider) as MultiSigWallet
}

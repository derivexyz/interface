import { Contract, Signer } from 'ethers'

import MultiSigWalletABI from '../contracts/abis/MultiSigWallet.json'
import { MultiSigWallet } from '../contracts/typechain'
import lyra from './lyra'

export default function getMultiSigWalletContract(addressOrName: string, signer?: Signer | null): MultiSigWallet {
  return new Contract(addressOrName, MultiSigWalletABI, signer ?? lyra.provider) as MultiSigWallet
}

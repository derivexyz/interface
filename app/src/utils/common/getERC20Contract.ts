import { Contract } from '@ethersproject/contracts'

import { AppNetwork } from '@/app/constants/networks'

import ERC20_ABI from '../../contracts/abis/ERC20.json'
import { ERC20 } from '../../contracts/typechain/ERC20'
import getProvider from '../getProvider'

export default function getERC20Contract(network: AppNetwork, address: string): ERC20 {
  return new Contract(address, ERC20_ABI, getProvider(network)) as ERC20
}

import { Contract } from '@ethersproject/contracts'
import { PopulatedTransaction } from 'ethers'

import { AppNetwork } from '@/app/constants/networks'
import { VestingEscrow } from '@/app/contracts/typechain'

import Vesting_ESCROW_ABI from '../../contracts/abis/VestingEscrow.json'
import buildTx from '../buildTx'
import getProvider from '../getProvider'
import mainnetProvider from '../mainnetProvider'

export function claimEscrow(address: string, account: string): PopulatedTransaction {
  const escrowContract = new Contract(address, Vesting_ESCROW_ABI, getProvider(AppNetwork.Ethereum)) as VestingEscrow
  const calldata = escrowContract.interface.encodeFunctionData('claim')
  return buildTx(mainnetProvider, mainnetProvider.network.chainId, address, account, calldata)
}

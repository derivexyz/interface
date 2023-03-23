import { Network } from '@lyrafinance/lyra-js'
import { BigNumber } from 'ethers'

import { ContractId } from '@/app/constants/contracts'
import { AppNetwork } from '@/app/constants/networks'

import buildTx from '../buildTx'
import getContract from '../common/getContract'
import getNetworkConfig from '../getNetworkConfig'
import getProvider from '../getProvider'

export default function unstakeArrakisOpLPToken(address: string, amount: BigNumber) {
  const arrakisOpStakingRewardsContract = getContract(ContractId.ArrakisOpStakingRewards, AppNetwork.Optimism)
  const calldata = arrakisOpStakingRewardsContract.interface.encodeFunctionData('withdraw', [amount])
  return buildTx(
    getProvider(AppNetwork.Optimism),
    getNetworkConfig(Network.Optimism).chainId,
    arrakisOpStakingRewardsContract.address,
    address,
    calldata
  )
}

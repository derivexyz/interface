import { BigNumber } from 'ethers'

import { LyraGlobalContractId, WETH_ETHEREUM_MAINNET_ADDRESS } from '../constants/contracts'
import { SECONDS_IN_YEAR } from '../constants/time'
import Lyra from '../lyra'
import callContractWithMulticall from './callContractWithMulticall'
import fetchLyraPrice from './fetchLyraPrice'
import fetchTokenSpotPrice from './fetchTokenSpotPrice'
import fromBigNumber from './fromBigNumber'
import getGlobalContract from './getGlobalContract'

const fetchWethLyraStakingData = async (
  lyra: Lyra
): Promise<{
  apy: number
  tokenValue: number
  lyraPerToken: number
  wethPerToken: number
}> => {
  const arrakisVaultContract = getGlobalContract(lyra, LyraGlobalContractId.ArrakisPoolL1, lyra.ethereumProvider)
  const wethLyraStakingContract = getGlobalContract(
    lyra,
    LyraGlobalContractId.WethLyraStakingRewardsL1,
    lyra.ethereumProvider
  )
  const [lyraPrice, wethPrice] = await Promise.all([
    fetchLyraPrice(lyra),
    fetchTokenSpotPrice(lyra, WETH_ETHEREUM_MAINNET_ADDRESS, 'ethereum'),
  ])

  const getUnderlyingBalancesCallData = arrakisVaultContract.interface.encodeFunctionData('getUnderlyingBalances')
  const totalSupplyCallData = wethLyraStakingContract.interface.encodeFunctionData('totalSupply')
  const rewardRateCallData = wethLyraStakingContract.interface.encodeFunctionData('rewardRate')

  const [[amount0Current, amount1Current], [supplyBN], [rewardRate]] = await callContractWithMulticall<
    [[BigNumber, BigNumber], [BigNumber], [BigNumber], [BigNumber]]
  >(
    lyra,
    [
      {
        contract: arrakisVaultContract,
        callData: getUnderlyingBalancesCallData,
        functionFragment: 'getUnderlyingBalances',
      },
      {
        contract: wethLyraStakingContract,
        callData: totalSupplyCallData,
        functionFragment: 'totalSupply',
      },
      {
        contract: wethLyraStakingContract,
        callData: rewardRateCallData,
        functionFragment: 'rewardRate',
      },
    ],
    lyra.ethereumProvider
  )
  const poolLyraBalance = fromBigNumber(amount0Current)
  const poolwethBalance = fromBigNumber(amount1Current)
  const supply = fromBigNumber(supplyBN)
  const lyraPerToken = supply > 0 ? poolLyraBalance / supply : 0
  const wethPerToken = supply > 0 ? poolwethBalance / supply : 0
  const tvl = poolwethBalance * wethPrice + poolLyraBalance * lyraPrice
  const tokenValue = supply > 0 ? tvl / supply : 0
  const rewardsPerSecondPerToken = supply > 0 ? fromBigNumber(rewardRate) / supply : 0
  const apy = tokenValue > 0 ? (rewardsPerSecondPerToken * SECONDS_IN_YEAR * (lyraPrice ?? 0)) / tokenValue : 0
  return { apy, tokenValue, lyraPerToken, wethPerToken }
}

export default fetchWethLyraStakingData

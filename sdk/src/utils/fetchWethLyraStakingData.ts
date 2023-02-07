import { BigNumber } from 'ethers'

import { ZERO_BN } from '../constants/bn'
import {
  LYRA_ETHEREUM_MAINNET_ADDRESS,
  LyraGlobalContractId,
  ONE_INCH_ORACLE_ETHEREUM_MAINNET_ADDRESS,
  USDC_ETHEREUM_MAINNET_ADDRESS,
  USDC_OPTIMISM_MAINNET_DECIMALS,
  WETH_ETHEREUM_MAINNET_ADDRESS,
} from '../constants/contracts'
import { SECONDS_IN_YEAR } from '../constants/time'
import Lyra from '../lyra'
import callContractWithMulticall from './callContractWithMulticall'
import fetchTokenSpotPrice from './fetchTokenSpotPrice'
import fromBigNumber from './fromBigNumber'
import getGlobalContract from './getGlobalContract'

const fetchWethLyraStakingData = async (
  lyra: Lyra
): Promise<{
  apy: number
  tokenValue: number
}> => {
  const arrakisVaultContract = getGlobalContract(lyra, LyraGlobalContractId.ArrakisPoolL1, lyra.ethereumProvider)
  const wethLyraStakingContract = getGlobalContract(
    lyra,
    LyraGlobalContractId.WethLyraStakingRewardsL1,
    lyra.ethereumProvider
  )
  const [lyraPrice, wethPrice] = await Promise.all([
    fetchTokenSpotPrice(lyra, LYRA_ETHEREUM_MAINNET_ADDRESS, {
      oracleAddress: ONE_INCH_ORACLE_ETHEREUM_MAINNET_ADDRESS,
      customProvider: lyra.ethereumProvider,
      stableCoinAddress: USDC_ETHEREUM_MAINNET_ADDRESS,
      stableCoinDecimals: USDC_OPTIMISM_MAINNET_DECIMALS,
    }),
    fetchTokenSpotPrice(lyra, WETH_ETHEREUM_MAINNET_ADDRESS, {
      oracleAddress: ONE_INCH_ORACLE_ETHEREUM_MAINNET_ADDRESS,
      customProvider: lyra.ethereumProvider,
      stableCoinAddress: USDC_ETHEREUM_MAINNET_ADDRESS,
      stableCoinDecimals: USDC_OPTIMISM_MAINNET_DECIMALS,
    }),
  ])

  const getUnderlyingBalancesCallData = arrakisVaultContract.interface.encodeFunctionData('getUnderlyingBalances')
  const totalSupplyCallData = wethLyraStakingContract.interface.encodeFunctionData('totalSupply')
  const rewardPerTokenCallData = wethLyraStakingContract.interface.encodeFunctionData('rewardPerToken')
  const rewardsDurationCallData = wethLyraStakingContract.interface.encodeFunctionData('rewardsDuration')

  const [[amount0Current, amount1Current], [supply], [rewardPerToken], [rewardsDuration]] =
    await callContractWithMulticall<[[BigNumber, BigNumber], [BigNumber], [BigNumber], [BigNumber]]>(
      lyra,
      [
        {
          contract: arrakisVaultContract,
          callData: getUnderlyingBalancesCallData,
          functionFragment: 'getUnderlyingBalances',
        },
        {
          contract: arrakisVaultContract,
          callData: totalSupplyCallData,
          functionFragment: 'totalSupply',
        },
        {
          contract: wethLyraStakingContract,
          callData: rewardPerTokenCallData,
          functionFragment: 'rewardPerToken',
        },
        {
          contract: wethLyraStakingContract,
          callData: rewardsDurationCallData,
          functionFragment: 'rewardsDuration',
        },
      ],
      lyra.ethereumProvider
    )

  const poolLyraValue = fromBigNumber(amount0Current) * lyraPrice
  const poolWethValue = fromBigNumber(amount1Current) * wethPrice
  const tvl = poolWethValue + poolLyraValue
  const tokenValue = supply ? tvl / fromBigNumber(supply) : 0
  const rewardsPerSecondPerToken = rewardsDuration.gt(0) ? rewardPerToken.div(rewardsDuration) : ZERO_BN
  const apy =
    tokenValue > 0 ? (fromBigNumber(rewardsPerSecondPerToken) * SECONDS_IN_YEAR * (lyraPrice ?? 0)) / tokenValue : 0
  return { apy, tokenValue }
}

export default fetchWethLyraStakingData

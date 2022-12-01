import { BigNumber } from 'ethers'

import { LYRA_OPTIMISM_MAINNET_ADDRESS, LyraContractId, WETH_OPTIMISM_MAINNET_ADDRESS } from '../constants/contracts'
import Lyra from '../lyra'
import callContractWithMulticall from './callContractWithMulticall'
import fetchTokenSpotPrice from './fetchTokenSpotPrice'
import fromBigNumber from './fromBigNumber'
import getLyraContract from './getLyraContract'

const fetchLyraWethStakingData = async (
  lyra: Lyra
): Promise<{
  apy: number
  tokenValue: number
}> => {
  const gelatoPoolContract = getLyraContract(lyra.provider, lyra.deployment, LyraContractId.ArrakisPool)
  const stakingContract = getLyraContract(lyra.provider, lyra.deployment, LyraContractId.WethLyraStakingRewards)
  const [lyraPrice, wethPrice] = await Promise.all([
    fetchTokenSpotPrice(lyra, LYRA_OPTIMISM_MAINNET_ADDRESS),
    fetchTokenSpotPrice(lyra, WETH_OPTIMISM_MAINNET_ADDRESS),
  ])
  const rewardRateCallData = stakingContract.interface.encodeFunctionData('rewardRate')
  const balanceOfCallData = gelatoPoolContract.interface.encodeFunctionData('balanceOf', [stakingContract.address])
  const getUnderlyingBalancesCallData = gelatoPoolContract.interface.encodeFunctionData('getUnderlyingBalances')
  const totalSupplyCallData = gelatoPoolContract.interface.encodeFunctionData('totalSupply')
  const [[rewardRate], [balanceOf], [amount0Current, amount1Current], [supply]] = await callContractWithMulticall<
    [[BigNumber], [BigNumber], [BigNumber, BigNumber], [BigNumber]]
  >(lyra, [
    {
      contract: stakingContract,
      callData: rewardRateCallData,
      functionFragment: 'rewardRate',
    },
    {
      contract: gelatoPoolContract,
      callData: balanceOfCallData,
      functionFragment: 'balanceOf',
    },
    {
      contract: gelatoPoolContract,
      callData: getUnderlyingBalancesCallData,
      functionFragment: 'getUnderlyingBalances',
    },
    {
      contract: gelatoPoolContract,
      callData: totalSupplyCallData,
      functionFragment: 'totalSupply',
    },
  ])
  const test = await callContractWithMulticall<[BigNumber, BigNumber, Record<string, BigNumber>, BigNumber]>(lyra, [
    {
      contract: stakingContract,
      callData: rewardRateCallData,
      functionFragment: 'rewardRate',
    },
    {
      contract: gelatoPoolContract,
      callData: balanceOfCallData,
      functionFragment: 'balanceOf',
    },
    {
      contract: gelatoPoolContract,
      callData: getUnderlyingBalancesCallData,
      functionFragment: 'getUnderlyingBalances',
    },
    {
      contract: gelatoPoolContract,
      callData: totalSupplyCallData,
      functionFragment: 'totalSupply',
    },
  ])
  const poolWethValue = fromBigNumber(amount0Current) * wethPrice
  const poolLyraValue = fromBigNumber(amount1Current) * lyraPrice
  const tvl = poolWethValue + poolLyraValue
  const tokenValue = supply ? tvl / fromBigNumber(supply) : 0
  const yieldPerSecondPerToken = balanceOf ? fromBigNumber(rewardRate) / fromBigNumber(balanceOf) : 0
  const apy = tokenValue > 0 ? (yieldPerSecondPerToken * (24 * 60 * 60 * 365) * (lyraPrice ?? 0)) / tokenValue : 0
  return { apy, tokenValue }
}

export default fetchLyraWethStakingData

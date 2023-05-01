import { RewardEpochTokenAmount } from '@lyrafinance/lyra-js'

import { ZERO_ADDRESS } from '@/app/constants/bn'
import { AppNetwork } from '@/app/constants/networks'
import { ERC20 } from '@/app/contracts/typechain'

import fromBigNumber from '../fromBigNumber'
import { getChainIdForNetwork } from '../getChainIdForNetwork'
import getTokenInfo from '../getTokenInfo'
import getERC20Contract from './getERC20Contract'
import multicall, { MulticallRequest } from './multicall'

export type LyraBalances = {
  lyra: {
    [chainId: number]: RewardEpochTokenAmount
  }
  stkLyra: {
    [chainId: number]: RewardEpochTokenAmount
  }
  totalLyra: RewardEpochTokenAmount
  totalStkLyra: RewardEpochTokenAmount
}

export default async function fetchLyraBalances(_account?: string | null): Promise<LyraBalances> {
  const account = _account ?? ZERO_ADDRESS
  const lyraTokenInfo = getTokenInfo('lyra')
  const stkLyraTokenInfo = getTokenInfo('stkLyra')
  if (!lyraTokenInfo || !stkLyraTokenInfo) {
    throw new Error(`Missing LYRA token info`)
  }

  const lyraBalances: LyraBalances = {
    lyra: {},
    stkLyra: {},
    totalLyra: {
      address: lyraTokenInfo.address,
      symbol: lyraTokenInfo.symbol,
      decimals: lyraTokenInfo.decimals,
      amount: 0,
    },
    totalStkLyra: {
      address: stkLyraTokenInfo.address,
      symbol: stkLyraTokenInfo.symbol,
      decimals: stkLyraTokenInfo.decimals,
      amount: 0,
    },
  }

  const multicallRequests = Object.values(AppNetwork).map(network => {
    const chainId = getChainIdForNetwork(network)
    const networkLyraTokenInfo = getTokenInfo('lyra', network)
    const networkStkLyraTokenInfo = getTokenInfo('stkLyra', network)
    if (!networkLyraTokenInfo || !networkStkLyraTokenInfo) {
      throw new Error(`Missing LYRA token info for network: ${network}`)
    }
    const lyraContract = getERC20Contract(network, networkLyraTokenInfo.address)
    const stkLyraContract = getERC20Contract(network, networkStkLyraTokenInfo.address)
    lyraBalances.lyra[chainId] = {
      address: networkLyraTokenInfo.address,
      decimals: networkLyraTokenInfo.decimals,
      symbol: networkLyraTokenInfo.symbol,
      amount: 0,
    }
    lyraBalances.stkLyra[chainId] = {
      address: networkStkLyraTokenInfo.address,
      decimals: networkStkLyraTokenInfo.decimals,
      symbol: networkStkLyraTokenInfo.symbol,
      amount: 0,
    }
    return multicall<[MulticallRequest<ERC20, 'balanceOf'>, MulticallRequest<ERC20, 'balanceOf'>]>(network, [
      {
        contract: lyraContract,
        function: 'balanceOf',
        args: [account],
      },
      {
        contract: stkLyraContract,
        function: 'balanceOf',
        args: [account],
      },
    ])
  })
  const multicallResponses = await Promise.all(multicallRequests)
  Object.values(AppNetwork).forEach((network, i) => {
    const chainId = getChainIdForNetwork(network)
    const {
      returnData: [[lyraBalanceBN], [stkLyraBalanceBN]],
    } = multicallResponses[i]
    const lyraBalance = fromBigNumber(lyraBalanceBN)
    const stkLyraBalance = fromBigNumber(stkLyraBalanceBN)
    lyraBalances.lyra[chainId].amount = lyraBalance
    lyraBalances.stkLyra[chainId].amount = stkLyraBalance
    lyraBalances.totalLyra.amount += lyraBalance
    lyraBalances.totalStkLyra.amount += stkLyraBalance
  })
  return lyraBalances
}

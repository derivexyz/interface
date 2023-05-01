import { AppNetwork } from '@/app/constants/networks'

import { getChainIdForNetwork } from '../getChainIdForNetwork'
import { LyraBalances } from './fetchLyraBalances'

export function getLyraBalanceForNetwork(accountLyraBalances: LyraBalances, network: AppNetwork) {
  const chainId = getChainIdForNetwork(network)
  return accountLyraBalances.lyra[chainId].amount
}
export function getStkLyraBalanceForNetwork(accountLyraBalances: LyraBalances, network: AppNetwork) {
  const chainId = getChainIdForNetwork(network)
  return accountLyraBalances.stkLyra[chainId].amount
}

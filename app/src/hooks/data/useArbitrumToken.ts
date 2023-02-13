import { TokenInfo } from '@uniswap/token-lists'

import getArbitrumChainId from '@/app/utils/getArbitrumChainId'

import useArbitrumTokenList from './useArbitrumTokenList'

export default function useArbitrumToken(tokenNameOrAddress: string): TokenInfo | null {
  const arbitrumTokenList = useArbitrumTokenList()
  if (!arbitrumTokenList) {
    return null
  }
  const chainId = getArbitrumChainId()
  const token = arbitrumTokenList.find(
    token =>
      (token.address === tokenNameOrAddress ||
        token.symbol.toLowerCase() === tokenNameOrAddress.toLowerCase() ||
        token.name.toLowerCase() === tokenNameOrAddress.toLowerCase()) &&
      token.chainId === chainId
  )
  return token ?? null
}

import { TokenInfo } from '@uniswap/token-lists'

import getOptimismChainId from '@/app/utils/getOptimismChainId'

import useOptimismTokenList from './useOptimismTokenList'

export default function useOptimismToken(tokenNameOrAddress: string): TokenInfo | null {
  const optimismTokenList = useOptimismTokenList()
  if (!optimismTokenList) {
    return null
  }
  const chainId = getOptimismChainId()
  const token = optimismTokenList.find(
    token =>
      (token.address === tokenNameOrAddress ||
        token.symbol.toLowerCase() === tokenNameOrAddress.toLowerCase() ||
        token.name.toLowerCase() === tokenNameOrAddress.toLowerCase()) &&
      token.chainId === chainId
  )
  return token ?? null
}

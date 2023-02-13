import { Network } from '@lyrafinance/lyra-js'
import { TokenInfo } from '@uniswap/token-lists'

import useArbitrumToken from './useArbitrumToken'
import useOptimismToken from './useOptimismToken'

export default function useNetworkToken(network: Network, tokenNameOrAddress: string): TokenInfo | null {
  const arbitrumToken = useArbitrumToken(tokenNameOrAddress)
  const optimismToken = useOptimismToken(tokenNameOrAddress)
  switch (network) {
    case Network.Arbitrum:
      return arbitrumToken
    case Network.Optimism:
      return optimismToken
  }
}

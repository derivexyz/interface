import { Chain } from '@lyrafinance/lyra-js'

const getChainForChainId = (chainId: number): Chain => {
  switch (chainId) {
    case 420:
      return Chain.OptimismGoerli
    case 42161:
      return Chain.Arbitrum
    case 421613:
      return Chain.ArbitrumGoerli
    case 10:
      return Chain.Optimism
    default:
      throw new Error('Chain ID is not supported by Lyra')
  }
}

export default getChainForChainId

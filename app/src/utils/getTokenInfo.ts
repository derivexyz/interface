import tokenList from '@/app/constants/tokenlist.json'

import { Network } from '../constants/networks'
import { TokenInfo, TokenList } from '../constants/tokenlist'
import getNetworkConfig from './getNetworkConfig'

export default function getTokenInfo(tokenNameOrAddress: string, network?: Network): TokenInfo | null {
  const shortList = (tokenList as TokenList).tokens.filter(
    token =>
      token.address.toLowerCase() === tokenNameOrAddress.toLowerCase() ||
      token.symbol.toLowerCase() === tokenNameOrAddress.toLowerCase() ||
      token.name.toLowerCase() === tokenNameOrAddress.toLowerCase() ||
      (token.extensions?.bridgeInfo &&
        Object.values(token.extensions.bridgeInfo).find(
          info => info?.tokenAddress?.toLowerCase() === tokenNameOrAddress?.toLowerCase()
        ))
  )

  if (network) {
    // network-specific
    const chainId = getNetworkConfig(network, true).chainId
    const tokenInfoWithChainId = shortList.find(t => t.chainId === chainId)
    if (tokenInfoWithChainId) {
      // direct match
      return tokenInfoWithChainId
    }
    const tokenInfoWithBridge = shortList.find(
      t =>
        t.extensions?.bridgeInfo &&
        !!Object.keys(t.extensions.bridgeInfo).find(bridgeChainId => bridgeChainId === chainId.toString())
    )
    if (tokenInfoWithBridge) {
      const bridgeAddress = tokenInfoWithBridge.extensions?.bridgeInfo
        ? tokenInfoWithBridge.extensions.bridgeInfo[chainId]?.tokenAddress
        : null
      return {
        ...tokenInfoWithBridge,
        chainId,
        address: bridgeAddress ?? tokenInfoWithBridge.address, // should never be used
      }
    }
    return null
  } else {
    // network-agnostic
    return shortList[0] ?? null
  }
}

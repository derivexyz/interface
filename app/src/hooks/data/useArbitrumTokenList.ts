import { TokenInfo } from '@uniswap/token-lists'
import { useMemo } from 'react'

import getUniqueBy from '@/app/utils/getUniqueBy'

import ARBITRUM_TOKEN_LIST from '../../constants/tokenlists/arbitrum.tokenlist.json'

export default function useArbitrumTokenList(): TokenInfo[] {
  return useMemo(
    () =>
      getUniqueBy(
        // Insert custom list last for overrides
        [...ARBITRUM_TOKEN_LIST.tokens],
        token => `${token.address}-${token.chainId}`
      ),
    []
  )
}

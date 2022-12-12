import { TokenInfo } from '@uniswap/token-lists'
import { useMemo } from 'react'

import getUniqueBy from '@/app/utils/getUniqueBy'

import OPTIMISM_TOKEN_LIST from '../../constants/tokenlists/optimism.tokenlist.json'
import OVERRIDES__TOKEN_LIST from '../../constants/tokenlists/overrides.tokenlist.json'
import SYNTH_TOKEN_LIST from '../../constants/tokenlists/synths.tokenlist.json'

export default function useOptimismTokenList(): TokenInfo[] {
  return useMemo(
    () =>
      getUniqueBy(
        // Insert custom list last for overrides
        [...OVERRIDES__TOKEN_LIST.tokens, ...OPTIMISM_TOKEN_LIST.tokens, ...SYNTH_TOKEN_LIST.tokens],
        token => `${token.address}-${token.chainId}`
      ),
    []
  )
}

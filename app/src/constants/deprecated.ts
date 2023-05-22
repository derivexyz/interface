import { Chain, Version } from '@lyrafinance/lyra-js'

import filterNulls from '../utils/filterNulls'

export type DeprecatedVault = {
  chain: Chain
  version: Version
}

export const DEPRECATED_VAULTS_LIST: DeprecatedVault[] = filterNulls([
  {
    chain: Chain.Optimism,
    version: Version.Avalon,
  },
])

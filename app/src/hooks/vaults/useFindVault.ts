import { Network } from '@lyrafinance/lyra-js'
import { useMemo } from 'react'

import { Vault } from '@/app/constants/vault'

export default function useFindVault(
  vaults: Vault[] | null,
  network: Network | null,
  marketAddressOrName: string | null
): Vault | null {
  return useMemo(
    () =>
      network && marketAddressOrName
        ? vaults?.filter(v => v.market.lyra.network === network).find(v => v.market.isEqual(marketAddressOrName)) ??
          null
        : null,
    [vaults, network, marketAddressOrName]
  )
}

import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import React from 'react'

import { Vault } from '@/app/hooks/vaults/useVault'

import VaultsIndexMarketsListMobile from './VaultsIndexMarketsListMobile'
import VaultsIndexMarketsTableDesktop from './VaultsIndexMarketsTableDesktop'

export type VaultsIndexMarketsTableOrListProps = {
  vaults: Vault[]
} & MarginProps &
  LayoutProps

const VaultsIndexMarketsTableOrList = (props: VaultsIndexMarketsTableOrListProps) => {
  const isMobile = useIsMobile()
  return isMobile ? <VaultsIndexMarketsListMobile {...props} /> : <VaultsIndexMarketsTableDesktop {...props} />
}

export default VaultsIndexMarketsTableOrList

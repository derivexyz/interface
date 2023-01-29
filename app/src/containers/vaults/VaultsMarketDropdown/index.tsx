import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import { DropdownIconButtonElement } from '@lyra/ui/components/Button/DropdownIconButton'
import React, { useCallback, useState } from 'react'

import MarketImage from '@/app/components/common/MarketImage'
import { PageId } from '@/app/constants/pages'
import { Vault } from '@/app/constants/vault'
import formatTokenName from '@/app/utils/formatTokenName'
import getPagePath from '@/app/utils/getPagePath'

type Props = {
  vaults: Vault[]
  selectedVault: Vault
}

const VaultsMarketDropdown = ({ vaults, selectedVault, ...styleProps }: Props): DropdownIconButtonElement => {
  const selectedMarket = selectedVault.market
  const [isOpen, setIsOpen] = useState(false)
  const onClose = useCallback(() => setIsOpen(false), [])
  return (
    <DropdownButton
      {...styleProps}
      isOpen={isOpen}
      onClose={onClose}
      onClick={() => setIsOpen(true)}
      textVariant="title"
      ml={-3} // Hack to offset button border radius
      isTransparent
      label={`${formatTokenName(selectedMarket.baseToken)} Vault`}
      leftIcon={<MarketImage market={selectedMarket} />}
    >
      {vaults.map(({ market }) => (
        <DropdownButtonListItem
          key={market.address}
          isSelected={market.address === selectedMarket.address}
          label={`${formatTokenName(market.baseToken)} Vault`}
          href={getPagePath({ page: PageId.Vaults, network: market.lyra.network, marketAddressOrName: market.name })}
          onClick={onClose}
          icon={<MarketImage market={market} />}
        />
      ))}
    </DropdownButton>
  )
}

export default VaultsMarketDropdown

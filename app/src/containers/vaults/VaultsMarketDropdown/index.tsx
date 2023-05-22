import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import { DropdownIconButtonElement } from '@lyra/ui/components/Button/DropdownIconButton'
import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import React, { useCallback, useState } from 'react'

import MarketImage from '@/app/components/common/MarketImage'
import { PageId } from '@/app/constants/pages'
import { Vault } from '@/app/constants/vault'
import formatTokenName from '@/app/utils/formatTokenName'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'
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
      textVariant="heading"
      isTransparent
      label={`${formatTokenName(selectedMarket.baseToken)} Vault`}
      leftIcon={<MarketImage market={selectedMarket} />}
      mobileTitle="Select Vault"
    >
      {vaults
        .filter(vault => !vault.isDeprecated || vault.liquidityToken.balance.gt(0))
        .map(({ market, isDeprecated }) => (
          <DropdownButtonListItem
            key={market.address}
            isSelected={market.address === selectedMarket.address}
            label={`${formatTokenName(market.baseToken)} Vault ${isDeprecated ? '[Deprecated]' : ''}`}
            sublabel={
              <Flex flexDirection="column">
                <Text variant="small" as="span" color="secondaryText">
                  {getNetworkDisplayName(market.lyra.network)}
                </Text>
              </Flex>
            }
            href={getPagePath({
              page: PageId.EarnVaults,
              network: market.lyra.network,
              marketAddressOrName: market.name,
            })}
            onClick={onClose}
            icon={<MarketImage market={market} />}
          />
        ))}
    </DropdownButton>
  )
}

export default VaultsMarketDropdown

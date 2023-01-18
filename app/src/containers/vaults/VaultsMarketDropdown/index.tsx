import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import { DropdownIconButtonElement } from '@lyra/ui/components/Button/DropdownIconButton'
import { Market } from '@lyrafinance/lyra-js'
import React, { useCallback, useMemo, useState } from 'react'

import MarketImage from '@/app/components/common/MarketImage'
import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import useMarkets from '@/app/hooks/market/useMarkets'
import emptyFunction from '@/app/utils/emptyFunction'
import getPagePath from '@/app/utils/getPagePath'

type Props = {
  selectedMarket: Market
}

const VaultsMarketDropdown = withSuspense(
  ({ selectedMarket, ...styleProps }: Props): DropdownIconButtonElement => {
    const [isOpen, setIsOpen] = useState(false)
    const onClose = useCallback(() => setIsOpen(false), [])
    const markets = useMarkets()
    const filteredMarkets = useMemo(() => markets.filter(market => market.liveBoards().length > 0), [markets])
    return (
      <DropdownButton
        {...styleProps}
        isOpen={isOpen}
        onClose={onClose}
        onClick={() => setIsOpen(true)}
        size="lg"
        textVariant="title"
        ml={-3} // Hack to offset button border radius
        isTransparent
        label={`${selectedMarket.baseToken.symbol} Vault`}
        leftIcon={<MarketImage market={selectedMarket} />}
      >
        {filteredMarkets.map(market => (
          <DropdownButtonListItem
            key={market.address}
            isSelected={market.address === selectedMarket.address}
            label={`${market.baseToken.symbol} Vault`}
            href={getPagePath({ page: PageId.Vaults, network: market.lyra.network, marketAddressOrName: market.name })}
            onClick={onClose}
            icon={<MarketImage market={market} />}
          />
        ))}
      </DropdownButton>
    )
  },
  ({ selectedMarket, ...styleProps }) => (
    <DropdownButton
      {...styleProps}
      isOpen={false}
      onClose={emptyFunction}
      onClick={emptyFunction}
      size="lg"
      textVariant="title"
      ml={-3} // Hack to offset button border radius
      isTransparent
      label={`${selectedMarket.baseToken.symbol} Vault`}
      leftIcon={<MarketImage market={selectedMarket} />}
    />
  )
)

export default VaultsMarketDropdown

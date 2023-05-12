import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import { DropdownIconButtonElement } from '@lyra/ui/components/Button/DropdownIconButton'
import { Market } from '@lyrafinance/lyra-js'
import { getAddress } from 'ethers/lib/utils'
import React, { useCallback, useState } from 'react'

import MarketImage from '@/app/components/common/MarketImage'
import MarketLabel from '@/app/components/common/MarketLabel'
import { LogEvent } from '@/app/constants/logEvents'
import { PageId } from '@/app/constants/pages'
import getMarketDisplayName from '@/app/utils/getMarketDisplayName'
import getPagePath from '@/app/utils/getPagePath'
import logEvent from '@/app/utils/logEvent'

import TradeMarketDropdownSpotPrice from './TradeMarketDropdownSpotPrice'

type Props = {
  markets: Market[]
  selectedMarket: Market
  onChangeMarket: (market: Market) => void
}

const TradeMarketDropdown = ({
  markets,
  selectedMarket,
  onChangeMarket,
  ...styleProps
}: Props): DropdownIconButtonElement => {
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
      label={getMarketDisplayName(selectedMarket)}
      leftIcon={<MarketImage market={selectedMarket} />}
      mobileTitle="Select Market"
    >
      {markets.map(market => (
        <DropdownButtonListItem
          onClick={() => {
            logEvent(LogEvent.BoardMarketSelect, { marketName: market.name, marketAddress: market.address })
            onChangeMarket(market)
            onClose()
          }}
          key={market.address}
          isSelected={market.address === getAddress(selectedMarket.address)}
          label={<MarketLabel market={market} />}
          href={getPagePath({ page: PageId.Trade, network: market.lyra.network, marketAddressOrName: market.name })}
          rightContent={<TradeMarketDropdownSpotPrice market={market} />}
        />
      ))}
    </DropdownButton>
  )
}

export default TradeMarketDropdown

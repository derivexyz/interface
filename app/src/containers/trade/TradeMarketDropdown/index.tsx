import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import { DropdownIconButtonElement } from '@lyra/ui/components/Button/DropdownIconButton'
import { Market } from '@lyrafinance/lyra-js'
import { getAddress } from 'ethers/lib/utils'
import React, { useCallback, useMemo, useState } from 'react'

import MarketImage from '@/app/components/common/MarketImage'
import MarketLabel from '@/app/components/common/MarketLabel'
import { LogEvent } from '@/app/constants/logEvents'
import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import useMarkets from '@/app/hooks/market/useMarkets'
import emptyFunction from '@/app/utils/emptyFunction'
import getMarketDisplayName from '@/app/utils/getMarketDisplayName'
import getPagePath from '@/app/utils/getPagePath'
import logEvent from '@/app/utils/logEvent'

import TradeMarketDropdownSpotPrice from './TradeMarketDropdownSpotPrice'

type Props = {
  selectedMarket: Market
  onChangeMarket: (market: Market) => void
}

const TradeMarketDropdown = withSuspense(
  ({ selectedMarket, onChangeMarket, ...styleProps }: Props): DropdownIconButtonElement => {
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
        label={getMarketDisplayName(selectedMarket)}
        leftIcon={<MarketImage market={selectedMarket} />}
      >
        {filteredMarkets.map(market => (
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
  },
  ({ selectedMarket, onChangeMarket, ...styleProps }) => (
    <DropdownButton
      {...styleProps}
      isOpen={false}
      onClose={emptyFunction}
      onClick={emptyFunction}
      size="lg"
      textVariant="title"
      ml={-3} // Hack to offset button border radius
      isTransparent
      label={getMarketDisplayName(selectedMarket)}
      leftIcon={<MarketImage market={selectedMarket} />}
    />
  )
)

export default TradeMarketDropdown

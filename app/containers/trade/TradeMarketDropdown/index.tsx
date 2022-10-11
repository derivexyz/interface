import Button from '@lyra/ui/components/Button'
import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import { DropdownIconButtonElement } from '@lyra/ui/components/Button/DropdownIconButton'
import Spinner from '@lyra/ui/components/Spinner'
import { Market } from '@lyrafinance/lyra-js'
import React, { useCallback, useMemo, useState } from 'react'

import MarketImage from '@/app/components/common/MarketImage'
import { LogEvent } from '@/app/constants/logEvents'
import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import useMarkets from '@/app/hooks/market/useMarkets'
import getPagePath from '@/app/utils/getPagePath'
import isMarketEqual from '@/app/utils/isMarketEqual'
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
        label={selectedMarket.name}
        leftIcon={<MarketImage size={32} name={selectedMarket.name} />}
      >
        {filteredMarkets.map(market => (
          <DropdownButtonListItem
            onClick={() => {
              logEvent(LogEvent.BoardMarketSelect, { marketName: market.name, marketAddress: market.address })
              onChangeMarket(market)
            }}
            key={market.address}
            isSelected={isMarketEqual(market, selectedMarket.address)}
            label={market.name}
            href={getPagePath({ page: PageId.Trade, marketAddressOrName: market.name })}
            icon={<MarketImage size={32} name={market.name} />}
            rightContent={<TradeMarketDropdownSpotPrice market={market} />}
          />
        ))}
      </DropdownButton>
    )
  },
  ({ selectedMarket, onChangeMarket, ...styleProps }) => (
    <Button
      {...styleProps}
      size="lg"
      textVariant="title"
      ml={-3} // Hack to offset button border radius
      isTransparent
      rightIcon={<Spinner size="sm" />}
      label={selectedMarket.name}
      leftIcon={<MarketImage size={32} name={selectedMarket.name} />}
    />
  )
)

export default TradeMarketDropdown

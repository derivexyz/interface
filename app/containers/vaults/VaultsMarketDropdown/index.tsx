import Button from '@lyra/ui/components/Button'
import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import { DropdownIconButtonElement } from '@lyra/ui/components/Button/DropdownIconButton'
import Flex from '@lyra/ui/components/Flex'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import { Market } from '@lyrafinance/lyra-js'
import React, { useCallback, useMemo, useState } from 'react'

import MarketImage from '@/app/components/common/MarketImage'
import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import useMarkets from '@/app/hooks/market/useMarkets'
import getPagePath from '@/app/utils/getPagePath'
import isMarketEqual from '@/app/utils/isMarketEqual'

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
        label={
          <Flex alignItems="flex-start" flexDirection="column">
            <Text variant="title">{`${selectedMarket.name} Vault`}</Text>
          </Flex>
        }
        leftIcon={<MarketImage size={32} name={selectedMarket.name} />}
      >
        {filteredMarkets.map(market => (
          <DropdownButtonListItem
            key={market.address}
            isSelected={isMarketEqual(market, selectedMarket.address)}
            label={`${market.name} Vault`}
            href={getPagePath({ page: PageId.Vaults, marketAddressOrName: market.name })}
            icon={<MarketImage size={32} name={market.name} />}
            rightContent={
              <Flex width={80} flexDirection="column" alignItems="flex-end">
                <Text variant="secondary">{formatTruncatedUSD(market?.tvl ?? 0)}</Text>
              </Flex>
            }
          />
        ))}
      </DropdownButton>
    )
  },
  ({ selectedMarket, ...styleProps }) => (
    <Button
      {...styleProps}
      size="lg"
      textVariant="title"
      ml={-3} // Hack to offset button border radius
      isTransparent
      rightIcon={<Spinner size="sm" />}
      label={`${selectedMarket.name} Vault`}
      leftIcon={<MarketImage size={32} name={selectedMarket.name} />}
    />
  )
)

export default VaultsMarketDropdown

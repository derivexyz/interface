import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import Flex from '@lyra/ui/components/Flex'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import MarketImage from '@/app/components/common/MarketImage'
import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import useMarkets from '@/app/hooks/market/useMarkets'
import getMarketDisplayName from '@/app/utils/getMarketDisplayName'
import getPagePath from '@/app/utils/getPagePath'
import isMarketEqual from '@/app/utils/isMarketEqual'

type Props = {
  marketAddressOrName?: string | null
}

const AdminMarketSelect = withSuspense(
  ({ marketAddressOrName }: Props) => {
    const markets = useMarkets()
    const selectedMarket = useMemo(
      () => (marketAddressOrName ? markets.find(market => isMarketEqual(market, marketAddressOrName)) : null),
      [markets, marketAddressOrName]
    )
    const [isOpen, setIsOpen] = useState(false)
    const onClose = useCallback(() => setIsOpen(false), [])
    const fullName = selectedMarket ? getMarketDisplayName(selectedMarket.baseToken.symbol) : 'Global'
    const router = useRouter()
    useEffect(() => {
      // Prefetch pages to avoid slow switching between markets
      Promise.all(
        markets.map(market =>
          router.prefetch(getPagePath({ page: PageId.AdminMarket, marketAddressOrName: market.name }))
        )
      )
    }, [markets, router])
    return (
      <Flex>
        <DropdownButton
          onClick={() => setIsOpen(!isOpen)}
          isOpen={isOpen}
          onClose={onClose}
          mx={4} // offset border
          isTransparent
          size="lg"
          textVariant="title"
          label={`${fullName}`}
          leftIcon={selectedMarket ? <MarketImage size={28} name={selectedMarket.name} /> : null}
        >
          <>
            <DropdownButtonListItem
              key="global"
              isSelected={marketAddressOrName === null}
              label="Global"
              href={getPagePath({ page: PageId.Admin })}
            />
            {markets.map(market => {
              const fullName = getMarketDisplayName(market.baseToken.symbol)
              return (
                <DropdownButtonListItem
                  key={market.address}
                  isSelected={selectedMarket?.address === market.address}
                  label={fullName}
                  icon={<MarketImage size={28} name={market.name} />}
                  href={getPagePath({ page: PageId.AdminMarket, marketAddressOrName: market.name })}
                />
              )
            })}
          </>
        </DropdownButton>
      </Flex>
    )
  },
  () => <ButtonShimmer size="lg" mx={4} width={140} />
)

export default AdminMarketSelect

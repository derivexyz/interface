import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import Flex from '@lyra/ui/components/Flex'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import React, { useCallback, useState } from 'react'

import MarketImage from '@/app/components/common/MarketImage'
import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import useMarket from '@/app/hooks/market/useMarket'
import useMarkets from '@/app/hooks/market/useMarkets'
import getMarketDisplayName from '@/app/utils/getMarketDisplayName'
import getPagePath from '@/app/utils/getPagePath'

type Props = {
  marketAddressOrName?: string | null
}

const AdminMarketSelect = withSuspense(
  ({ marketAddressOrName = null }: Props) => {
    const markets = useMarkets()
    const selectedMarket = useMarket(marketAddressOrName)
    const [isOpen, setIsOpen] = useState(false)
    const onClose = useCallback(() => setIsOpen(false), [])
    const fullName = selectedMarket ? getMarketDisplayName(selectedMarket.baseToken.symbol) : 'Global'
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
              return (
                <DropdownButtonListItem
                  key={market.address}
                  isSelected={selectedMarket?.address === market.address}
                  label={market.name}
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

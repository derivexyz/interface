import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import { Market } from '@lyrafinance/lyra-js'
import React, { useCallback, useState } from 'react'

import MarketImage from '@/app/components/common/MarketImage'
import MarketLabel from '@/app/components/common/MarketLabel'
import { PageId } from '@/app/constants/pages'
import getMarketDisplayName from '@/app/utils/getMarketDisplayName'
import getPagePath from '@/app/utils/getPagePath'

type Props = {
  markets: Market[]
  selectedMarket: Market
}

const AdminMarketSelect = ({ markets, selectedMarket }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const onClose = useCallback(() => setIsOpen(false), [])
  const fullName = getMarketDisplayName(selectedMarket)
  return (
    <DropdownButton
      onClick={() => setIsOpen(!isOpen)}
      isOpen={isOpen}
      onClose={onClose}
      ml={-3}
      isTransparent
      textVariant="title"
      label={`${fullName}`}
      leftIcon={<MarketImage market={selectedMarket} />}
    >
      {markets.map(market => (
        <DropdownButtonListItem
          key={market.address}
          isSelected={selectedMarket.address === market.address}
          label={<MarketLabel market={market} />}
          href={getPagePath({
            page: PageId.Admin,
            network: market.lyra.network,
            marketAddressOrName: market.name,
          })}
          onClick={onClose}
        />
      ))}
    </DropdownButton>
  )
}

export default AdminMarketSelect

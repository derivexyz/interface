import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import { AccountQuoteBalance } from '@lyrafinance/lyra-js'
import React, { useCallback, useMemo, useState } from 'react'

import TokenImage from '@/app/containers/common/TokenImage'

type Props = {
  stableAddress: string | null
  balances: AccountQuoteBalance[]
  onChangeStableAddress: (stableAddress: string) => void
} & MarginProps &
  Omit<LayoutProps, 'size'>

const TradeFormStableSelector = ({ balances, stableAddress, onChangeStableAddress, ...styleProps }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const stableTokenInfo = useMemo(
    () => balances.find(stable => stable.address === stableAddress ?? ''),
    [balances, stableAddress]
  )

  const onClose = useCallback(() => setIsOpen(false), [])

  return (
    <DropdownButton
      isOpen={isOpen}
      onClose={onClose}
      onClick={() => setIsOpen(!isOpen)}
      placement="bottom-end"
      leftIcon={<TokenImage nameOrAddress={stableTokenInfo?.symbol ?? 'susd'} size={24} />}
      label={stableTokenInfo?.symbol ?? ''}
      {...styleProps}
    >
      <>
        {balances.map(stable => (
          <DropdownButtonListItem
            isSelected={stableAddress === stable.address}
            key={stable.symbol}
            icon={<TokenImage nameOrAddress={stable.symbol} size={24} />}
            label={stable.symbol}
            onClick={() => {
              onClose()
              onChangeStableAddress(stable.address)
            }}
          />
        ))}
      </>
    </DropdownButton>
  )
}

export default TradeFormStableSelector

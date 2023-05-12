import { ButtonSize } from '@lyra/ui/components/Button'
import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import { TextVariant } from '@lyra/ui/components/Text'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import { Market } from '@lyrafinance/lyra-js'
import React, { useCallback, useState } from 'react'

type Props = {
  selectedVault: Market | null
  vaults: Market[]
  onChangeVault: (vault: Market) => void
  size?: ButtonSize
  textVariant?: TextVariant
  isTransparent?: boolean
} & LayoutProps &
  MarginProps

const VaultSelector = ({
  onChangeVault,
  selectedVault,
  vaults,
  size = 'sm',
  textVariant = 'body',
  isTransparent = false,
  ...styleProps
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const onClose = useCallback(() => setIsOpen(false), [])
  return (
    <DropdownButton
      {...styleProps}
      isTransparent={isTransparent}
      onClose={onClose}
      onClick={() => setIsOpen(true)}
      isOpen={isOpen}
      label={`${selectedVault?.name} Vault APY` ?? ''}
      size={size}
      textVariant={textVariant}
      mobileTitle="Select Vault"
    >
      {vaults.map(market => {
        return (
          <DropdownButtonListItem
            key={market.address}
            isSelected={market?.address === selectedVault?.address}
            label={`${market?.name} Vault APY` ?? ''}
            onClick={() => {
              onChangeVault(market)
              onClose()
            }}
          />
        )
      })}
    </DropdownButton>
  )
}

export default VaultSelector

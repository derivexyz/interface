import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import Image from '@lyra/ui/components/Image'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import { Network } from '@lyrafinance/lyra-js'
import React, { useCallback, useState } from 'react'

import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'
import getNetworkLogoURI from '@/app/utils/getNetworkLogoURI'

type Props = {
  selectedNetwork: Network
  onSelectNetwork: (network: Network) => void
} & MarginProps

export default function NetworkDropdownButton({ selectedNetwork, onSelectNetwork, ...styleProps }: Props) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <DropdownButton
      isOpen={isOpen}
      onClick={() => setIsOpen(!isOpen)}
      onClose={handleClose}
      label={
        !isMobile ? (
          getNetworkDisplayName(selectedNetwork)
        ) : (
          <Image size={20} src={getNetworkLogoURI(selectedNetwork)} />
        )
      }
      leftIcon={!isMobile ? <Image size={18} src={getNetworkLogoURI(selectedNetwork)} /> : null}
      {...styleProps}
    >
      {Object.values(Network).map(networkOption => (
        <DropdownButtonListItem
          key={networkOption}
          onClick={() => {
            onSelectNetwork(networkOption)
            handleClose()
          }}
          label={getNetworkDisplayName(networkOption)}
          isSelected={networkOption === selectedNetwork}
          icon={<Image size={isMobile ? 24 : 18} src={getNetworkLogoURI(networkOption)}></Image>}
        />
      ))}
    </DropdownButton>
  )
}

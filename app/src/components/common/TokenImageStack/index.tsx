import Flex from '@lyra/ui/components/Flex'
import Image from '@lyra/ui/components/Image'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'

import { Network } from '@/app/constants/networks'
import TokenImage from '@/app/containers/common/TokenImage'
import getNetworkLogoURI from '@/app/utils/getNetworkLogoURI'

type Props = {
  tokenNameOrAddresses: string[]
  size: number
  network?: Network
} & MarginProps

const OVERLAP = 0.4
const NETWORK_BADGE_SIZE = 16

export default function TokenImageStack({ tokenNameOrAddresses, network, size, ...styleProps }: Props) {
  const width = size * (1 - OVERLAP) * (tokenNameOrAddresses.length - 1) + size
  return (
    <Flex mr={network ? 1 : 0} {...styleProps} width={width} sx={{ position: 'relative' }}>
      {tokenNameOrAddresses.map((tokenNameOrAddress, idx) => (
        <TokenImage
          key={tokenNameOrAddress}
          nameOrAddress={tokenNameOrAddress}
          size={size}
          ml={idx > 0 ? `-${size * OVERLAP}px` : 0}
        />
      ))}
      {network ? (
        <Flex
          width={NETWORK_BADGE_SIZE}
          height={NETWORK_BADGE_SIZE}
          sx={{
            position: 'absolute',
            bottom: '-2px',
            left: width - (2 / 3) * NETWORK_BADGE_SIZE,
            backgroundColor: 'background',
            borderRadius: 'circle',
          }}
          justifyContent="center"
          alignItems="center"
        >
          <Image minWidth="85%" width="85%" minHeight="85%" height="85%" src={getNetworkLogoURI(network)} />
        </Flex>
      ) : null}
    </Flex>
  )
}

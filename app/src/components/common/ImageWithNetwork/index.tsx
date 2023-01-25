import Flex from '@lyra/ui/components/Flex'
import Image from '@lyra/ui/components/Image'
import useThemeValue from '@lyra/ui/hooks/useThemeValue'
import { MarginProps, ResponsiveValue } from '@lyra/ui/types'
import { LayoutProps } from '@lyra/ui/types'
import { Network } from '@lyrafinance/lyra-js'
import React from 'react'

import getAssetSrc from '@/app/utils/getAssetSrc'
import getNetworkLogoURI from '@/app/utils/getNetworkLogoURI'

type Props = {
  src: string
  network: Network
  size?: ResponsiveValue
} & LayoutProps &
  MarginProps

const NETWORK_BADGE_SIZE = 16

export default function ImageWithNetwork({ src, network, size = 32, ...styleProps }: Props): JSX.Element {
  const trueSize = parseInt(String(useThemeValue(size)))

  return (
    <Flex
      width={trueSize + (1 / 3) * NETWORK_BADGE_SIZE}
      height={trueSize}
      minWidth={trueSize + (1 / 3) * NETWORK_BADGE_SIZE}
      minHeight={trueSize}
      sx={{ position: 'relative' }}
      {...styleProps}
    >
      <Image
        sx={{
          objectFit: 'contain',
        }}
        width={trueSize}
        height={trueSize}
        minWidth={trueSize}
        minHeight={trueSize}
        src={getAssetSrc(src)}
      />
      <Flex
        width={NETWORK_BADGE_SIZE}
        height={NETWORK_BADGE_SIZE}
        sx={{
          position: 'absolute',
          bottom: '-2px',
          left: trueSize - (2 / 3) * NETWORK_BADGE_SIZE,
          backgroundColor: 'background',
          borderRadius: 'circle',
        }}
        justifyContent="center"
        alignItems="center"
      >
        <Image minWidth="85%" width="85%" minHeight="85%" height="85%" src={getNetworkLogoURI(network)} />
      </Flex>
    </Flex>
  )
}

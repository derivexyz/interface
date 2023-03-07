import Image from '@lyra/ui/components/Image'
import useThemeValue from '@lyra/ui/hooks/useThemeValue'
import { MarginProps, ResponsiveValue } from '@lyra/ui/types'
import { LayoutProps } from '@lyra/ui/types'
import React from 'react'

import { Network } from '@/app/constants/networks'
import getAssetSrc from '@/app/utils/getAssetSrc'
import getNetworkLogoURI from '@/app/utils/getNetworkLogoURI'

type Props = {
  network: Network
  size?: ResponsiveValue
} & LayoutProps &
  MarginProps

export default function NetworkImage({ network, size = 32, ...styleProps }: Props): JSX.Element {
  const trueSize = parseInt(String(useThemeValue(size)))
  const logoURI: string = getNetworkLogoURI(network)

  return (
    <Image
      sx={{
        borderRadius: trueSize,
        objectFit: 'contain',
      }}
      {...styleProps}
      width={trueSize}
      height={trueSize}
      minWidth={trueSize}
      minHeight={trueSize}
      src={logoURI != null ? getAssetSrc(logoURI) : undefined}
    />
  )
}

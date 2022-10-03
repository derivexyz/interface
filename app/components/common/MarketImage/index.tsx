import Image from '@lyra/ui/components/Image'
import useThemeValue from '@lyra/ui/hooks/useThemeValue'
import { MarginProps, ResponsiveValue } from '@lyra/ui/types'
import { LayoutProps } from '@lyra/ui/types'
import React from 'react'

import getAssetSrc from '@/app/utils/getAssetSrc'
import getMarketLogoURI from '@/app/utils/getMarketLogoURI'

type Props = {
  name: string
  size?: ResponsiveValue
} & LayoutProps &
  MarginProps

export default function MarketImage({ name, size = 24, ...styleProps }: Props): JSX.Element {
  const trueSize = parseInt(String(useThemeValue(size)))
  const logoURI: string = getMarketLogoURI(name)

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

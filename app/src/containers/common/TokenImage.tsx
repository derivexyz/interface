import Image from '@lyra/ui/components/Image'
import useThemeValue from '@lyra/ui/hooks/useThemeValue'
import { MarginProps, ResponsiveValue } from '@lyra/ui/types'
import { LayoutProps } from '@lyra/ui/types'
import React from 'react'

import useOptimismTokenLogoURI from '@/app/hooks/data/useOptimismTokenLogoURI'
import getAssetSrc from '@/app/utils/getAssetSrc'

type Props = {
  nameOrAddress: string
  uri?: string
  size?: ResponsiveValue
} & LayoutProps &
  MarginProps

export default function TokenImage({ nameOrAddress, size = 32, uri = '', ...styleProps }: Props) {
  const trueSize = parseInt(String(useThemeValue(size)))
  const logoURI = useOptimismTokenLogoURI(nameOrAddress) ?? uri
  return (
    <Image
      sx={{
        objectFit: 'contain',
      }}
      {...styleProps}
      width={trueSize}
      height={trueSize}
      minWidth={trueSize}
      minHeight={trueSize}
      src={getAssetSrc(logoURI)}
    />
  )
}

import Image from '@lyra/ui/components/Image'
import useThemeValue from '@lyra/ui/hooks/useThemeValue'
import { MarginProps, ResponsiveValue } from '@lyra/ui/types'
import { LayoutProps } from '@lyra/ui/types'
import React from 'react'
import { useMemo } from 'react'

import getAssetSrc from '@/app/utils/getAssetSrc'
import getTokenInfo from '@/app/utils/getTokenInfo'

type Props = {
  nameOrAddress: string
  uri?: string
  size?: ResponsiveValue
} & LayoutProps &
  MarginProps

export default function TokenImage({ nameOrAddress, size = 32, ...styleProps }: Props) {
  const trueSize = parseInt(String(useThemeValue(size)))
  const logoURI = useMemo(() => {
    if (nameOrAddress.toLowerCase() === 'eth') {
      return '/images/ethereum-logo.png'
    }
    return getTokenInfo(nameOrAddress)?.logoURI ?? ''
  }, [nameOrAddress])
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

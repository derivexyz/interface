import Flex from '@lyra/ui/components/Flex'
import Image from '@lyra/ui/components/Image'
import useThemeValue from '@lyra/ui/hooks/useThemeValue'
import { MarginProps, ResponsiveValue } from '@lyra/ui/types'
import { LayoutProps } from '@lyra/ui/types'
import { Market } from '@lyrafinance/lyra-js'
import React from 'react'

import getAssetSrc from '@/app/utils/getAssetSrc'
import getMarketLogoURI from '@/app/utils/getMarketLogoURI'
import getNetworkLogoURI from '@/app/utils/getNetworkLogoURI'

type Props = {
  market: Market
  size?: ResponsiveValue
} & LayoutProps &
  MarginProps

export default function MarketImage({ market, size = 36, ...styleProps }: Props): JSX.Element {
  const trueSize = parseInt(String(useThemeValue(size)))
  const logoURI: string = getMarketLogoURI(market)

  const trueBadgeSize = (trueSize * 1) / 2

  return (
    <Flex
      width={trueSize + (1 / 3) * trueBadgeSize}
      height={trueSize}
      minWidth={trueSize + (1 / 3) * trueBadgeSize}
      minHeight={trueSize}
      sx={{ position: 'relative' }}
      {...styleProps}
    >
      <Image
        sx={{
          borderRadius: trueSize,
          objectFit: 'contain',
        }}
        width={trueSize}
        height={trueSize}
        minWidth={trueSize}
        minHeight={trueSize}
        src={logoURI != null ? getAssetSrc(logoURI) : undefined}
      />
      <Flex
        width={trueBadgeSize}
        height={trueBadgeSize}
        sx={{
          position: 'absolute',
          bottom: '-2px',
          left: trueSize - (2 / 3) * trueBadgeSize,
          backgroundColor: 'background',
          borderRadius: 'circle',
        }}
        justifyContent="center"
        alignItems="center"
      >
        <Image width={trueBadgeSize - 2} height={trueBadgeSize - 2} src={getNetworkLogoURI(market.lyra.network)} />
      </Flex>
    </Flex>
  )
}

import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import { IconType } from '@lyra/ui/components/Icon'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'

import { MOBILE_FOOTER_HEIGHT } from '@/app/constants/layout'
import withSuspense from '@/app/hooks/data/withSuspense'
import useOpenPositions from '@/app/hooks/position/useOpenPositions'

type Props = {
  label: React.ReactNode
  onClick: () => void
  rightIcon: IconType
} & MarginProps

const TradeOpenPositionsFloatingButton = withSuspense(({ onClick, label, rightIcon, ...styleProps }: Props) => {
  const openPositions = useOpenPositions()
  const isMobile = useIsMobile()
  return openPositions.length ? (
    <Box
      sx={{
        position: 'fixed',
        left: '50%',
        bottom: isMobile ? MOBILE_FOOTER_HEIGHT + 24 : 24,
        transform: 'translateX(-50%)',
      }}
    >
      <Button variant="elevated" label={label} rightIcon={rightIcon} onClick={onClick} {...styleProps} />
    </Box>
  ) : null
})

export default TradeOpenPositionsFloatingButton

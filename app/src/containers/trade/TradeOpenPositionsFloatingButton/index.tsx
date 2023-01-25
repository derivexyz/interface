import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import { IconType } from '@lyra/ui/components/Icon'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'

import { MOBILE_FOOTER_HEIGHT } from '@/app/constants/layout'

type Props = {
  label: React.ReactNode
  onClick: () => void
  rightIcon: IconType
} & MarginProps

const TradeOpenPositionsFloatingButton = React.forwardRef(
  ({ onClick, label, rightIcon, ...styleProps }: Props, ref) => {
    const isMobile = useIsMobile()
    return (
      <Box
        ref={ref}
        sx={{
          position: 'fixed',
          left: '50%',
          bottom: isMobile ? MOBILE_FOOTER_HEIGHT + 24 : 24,
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
      >
        <Button
          sx={{ pointerEvents: 'auto' }}
          variant="primary"
          label={label}
          rightIcon={rightIcon}
          onClick={onClick}
          {...styleProps}
        />
      </Box>
    )
  }
)

export default TradeOpenPositionsFloatingButton

import emptyFunction from '@lyra/ui/utils/emptyFunction'
import { Placement } from '@popperjs/core'
import React, { useEffect } from 'react'
import { usePopperTooltip } from 'react-popper-tooltip'
import { TriggerType } from 'react-popper-tooltip'
import { animated, useTransition } from 'react-spring'
import { Box } from 'rebass'

export type PopoverProps = {
  children: React.ReactNode
  innerRef?: HTMLElement | null
  isOpen: boolean
  onChange: (isOpen: boolean) => void
  isDisabled?: boolean
  trigger?: TriggerType
  placement?: Placement
  interactive?: boolean
  delayHide?: number
}

export type PopoverElement = React.ReactElement<PopoverProps>

const TRANSFORM_PX = 20

const getTransform = (placement: Placement) => {
  const animation = {
    enter: {
      transform: `translate(0,0)`,
      opacity: 1,
    },
  }
  if (placement.startsWith('bottom')) {
    return {
      ...animation,
      from: {
        opacity: 0,
        transform: `translateY(-${TRANSFORM_PX}px)`,
      },
    }
  }
  if (placement.startsWith('top')) {
    return {
      ...animation,
      from: {
        opacity: 0,
        transform: `translateY(${TRANSFORM_PX}px)`,
      },
    }
  }
  if (placement.startsWith('right')) {
    return {
      ...animation,
      from: {
        opacity: 0,
        transform: `translateX(-${TRANSFORM_PX}px)`,
      },
    }
  }
  if (placement.startsWith('left')) {
    return {
      ...animation,
      from: {
        opacity: 0,
        transform: `translateX(${TRANSFORM_PX}px)`,
      },
    }
  }
}

export default function PopoverRef({
  innerRef,
  children,
  isOpen = false,
  onChange = emptyFunction,
  isDisabled,
  placement = 'bottom-start',
  trigger = 'click',
  interactive = false,
  delayHide = 60, // enough time to hover over popover gap
}: PopoverProps): PopoverElement | null {
  const transitions = useTransition(isOpen, {
    ...getTransform(placement),
    config: {
      duration: 150,
    },
  })
  const { getArrowProps, getTooltipProps, triggerRef, setTooltipRef, setTriggerRef } = usePopperTooltip({
    trigger: trigger,
    visible: isOpen && !isDisabled,
    placement,
    onVisibleChange: onChange,
    interactive: interactive,
    delayHide: delayHide,
  })

  useEffect(() => {
    if (innerRef) {
      setTriggerRef(innerRef)
    }
  }, [innerRef, setTriggerRef])

  return isOpen
    ? transitions(styles => (
        <Box ref={setTooltipRef} {...getTooltipProps()} minWidth={triggerRef?.clientWidth} sx={{ zIndex: 'popover' }}>
          <animated.div style={styles}>{children}</animated.div>
          <Box {...getArrowProps()} />
        </Box>
      ))
    : null
}

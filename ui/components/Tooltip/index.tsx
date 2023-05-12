import { ResponsiveValue } from '@lyra/ui/types'
import { Placement } from '@popperjs/core'
import React, { useState } from 'react'
import { TriggerType } from 'react-popper-tooltip'

import Card from '../Card'
import CardBody from '../Card/CardBody'
import Flex, { FlexProps } from '../Flex'
import Icon, { IconType } from '../Icon'
import Link from '../Link'
import PopoverRef from '../Popover'
import Text from '../Text'

export type TooltipTriggerType = TriggerType

export type TooltipConfig = {
  title?: string
  tooltip?: string | React.ReactNode
  href?: string
  hrefLabel?: string
  target?: string
  placement?: Placement
  showInfoIcon?: boolean
  showHelpIcon?: boolean
  iconSize?: ResponsiveValue
  noPadding?: boolean
  isDisabled?: boolean
}

export type TooltipProps = TooltipConfig & FlexProps

export type TooltipElement = React.ReactElement<TooltipProps>

export default function Tooltip({
  title,
  tooltip,
  href,
  hrefLabel = 'Learn more',
  target,
  children,
  placement = 'top-start',
  showInfoIcon,
  showHelpIcon,
  noPadding,
  iconSize = 13,
  isDisabled,
  ...styleProps
}: TooltipProps): TooltipElement {
  const [ref, setRef] = useState<HTMLElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Flex
        ref={setRef}
        onClick={e => {
          setIsOpen(true)
          e.stopPropagation()
        }}
        sx={{
          display: 'inline-block',
          opacity: isOpen ? 0.7 : 1.0,
          cursor: !isDisabled ? 'pointer' : undefined,
          '&:hover': {
            opacity: !isOpen && !isDisabled ? 0.7 : undefined,
          },
        }}
        alignItems="center"
        {...styleProps}
      >
        {children}
        {showHelpIcon || showInfoIcon ? (
          <Icon
            ml={1}
            pb="1px"
            color="secondaryText"
            size={iconSize}
            icon={showHelpIcon ? IconType.HelpCircle : IconType.Info}
          />
        ) : null}
      </Flex>
      {tooltip && !isDisabled ? (
        <PopoverRef placement={placement} innerRef={ref} isOpen={isOpen} onChange={setIsOpen} trigger="click">
          <Card variant="elevated" maxWidth={320}>
            <CardBody noPadding={noPadding}>
              {title != null ? (
                <Text textAlign="left" mx={noPadding ? 6 : 0} mt={noPadding ? 6 : 0} mb={4} variant="bodyMedium">
                  {title}
                </Text>
              ) : null}
              {typeof tooltip === 'string' ? (
                <Text textAlign="left" color="secondaryText">
                  {tooltip}
                </Text>
              ) : (
                tooltip
              )}
              {href ? (
                <Link mt={4} href={href} target={target} showRightIcon>
                  {hrefLabel}
                </Link>
              ) : null}
            </CardBody>
          </Card>
        </PopoverRef>
      ) : null}
    </>
  )
}

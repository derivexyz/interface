import React from 'react'
import { LayoutProps, MarginProps } from 'styled-system'

import Box from '../Box'
import Flex from '../Flex'
import { IconType } from '../Icon'
import IconOrImage from '../Icon/IconOrImage'
import Link from '../Link'
import Text, { TextColor } from '../Text'

export type AlertVariant = 'default' | 'info' | 'primary' | 'error' | 'warning'

type Props = {
  variant?: AlertVariant
  icon?: IconType | React.ReactNode
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  linkHref?: string
  linkText?: string
} & MarginProps &
  LayoutProps

const getVariant = (variant: AlertVariant): string => {
  switch (variant) {
    case 'error':
      return 'variants.alertError'
    case 'default':
    case 'info':
      return 'variants.alertInfo'
    case 'primary':
      return 'variants.alertPrimary'
    case 'warning':
      return 'variants.alertWarning'
  }
}

const getLinkTextColor = (variant: AlertVariant): TextColor => {
  switch (variant) {
    case 'error':
      return 'errorText'
    case 'default':
    case 'info':
      return 'secondaryText'
    case 'primary':
      return 'primaryText'
    case 'warning':
      return 'warningText'
  }
}

export default function Alert({
  variant = 'default',
  title,
  description,
  icon,
  linkHref,
  linkText = 'Learn more',
  ...styleProps
}: Props) {
  return (
    <Box {...styleProps} variant={getVariant(variant)}>
      <Flex alignItems="center">
        {icon ? <Box mr={2}>{typeof icon === 'string' ? <IconOrImage size={14} src={icon} /> : icon}</Box> : null}
        <Text variant="bodyMedium" color="inherit">
          {title}
        </Text>
      </Flex>
      {description ? (
        <Text mt={title ? 1 : 0} color="inherit" variant="small">
          {description}
        </Text>
      ) : null}
      {linkHref ? (
        <Link mt={1} href={linkHref} target="_blank" variant="small" color={getLinkTextColor(variant)} showRightIcon>
          {linkText}
        </Link>
      ) : null}
    </Box>
  )
}

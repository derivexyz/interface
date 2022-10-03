import React from 'react'
import { LayoutProps, MarginProps } from 'styled-system'

import Box from '../Box'
import Flex from '../Flex'
import { IconType } from '../Icon'
import IconOrImage from '../Icon/IconOrImage'
import Text from '../Text'

export type AlertVariant = 'default' | 'info' | 'primary' | 'error' | 'warning'

type Props = {
  variant?: AlertVariant
  icon?: IconType | React.ReactNode
  title?: string | React.ReactNode
  description?: string | React.ReactNode
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

export default function Alert({ variant = 'default', title, description, icon, ...styleProps }: Props) {
  return (
    <Box {...styleProps} variant={getVariant(variant)}>
      <Flex alignItems="center">
        {icon ? <Box mr={2}>{typeof icon === 'string' ? <IconOrImage size={14} src={icon} /> : icon}</Box> : null}
        <Text variant="secondaryMedium" color="inherit">
          {title}
        </Text>
      </Flex>
      {description ? (
        <Text mt={title ? 1 : 0} color="inherit" variant="small">
          {description}
        </Text>
      ) : null}
    </Box>
  )
}

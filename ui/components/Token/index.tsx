import React from 'react'
import { Text as RebassText } from 'rebass'
import { LayoutProps, MarginProps } from 'styled-system'

export type TokenVariant = 'default' | 'primary' | 'error' | 'warning'

export type TokenProps = {
  label?: string | null
  variant?: TokenVariant
  onClick?: React.ReactEventHandler
} & MarginProps &
  LayoutProps

const getTokenVariant = (variant: TokenVariant): string => {
  switch (variant) {
    case 'default':
      return 'variants.tokenDefault'
    case 'primary':
      return 'variants.tokenPrimary'
    case 'error':
      return 'variants.tokenError'
    case 'warning':
      return 'variants.tokenWarning'
  }
}

export default function Token({ label, variant = 'default', onClick, ...styleProps }: TokenProps) {
  return (
    <RebassText textAlign="center" as="p" variant={getTokenVariant(variant)} onClick={onClick} {...styleProps}>
      {label}
    </RebassText>
  )
}

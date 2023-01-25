import { MarginProps, ResponsiveValue } from '@lyra/ui/types'
import React from 'react'
import styled from 'styled-components'

import Box from '../Box'

export type SpinnerSize = 'sm' | 'small' | 'md' | 'medium' | 'lg' | 'large' | ResponsiveValue

export type SpinnerVariant = 'primary' | 'light' | 'warning' | 'error'

type Props = {
  size?: SpinnerSize
  variant?: SpinnerVariant
} & MarginProps

export const getSpinnerWidth = (size: SpinnerSize): ResponsiveValue => {
  switch (size) {
    case 'sm':
    case 'small':
      return 18
    case 'md':
    case 'medium':
      return 36
    case 'lg':
    case 'large':
      return 64
    default:
      return size
  }
}

export const getSpinnerStrokeWidth = (size: SpinnerSize): ResponsiveValue => {
  switch (size) {
    case 'sm':
    case 'small':
      return 2
    case 'md':
    case 'medium':
      return 3
    case 'lg':
    case 'large':
      return 4
    default:
      return 2
  }
}

const getStrokeColor = (variant: SpinnerVariant): string => {
  switch (variant) {
    case 'primary':
      return 'primarySpinner'
    case 'light':
      return 'lightSpinner'
    case 'warning':
      return 'warningSpinner'
    case 'error':
      return 'errorSpinner'
  }
}

const getStrokeBg = (variant: SpinnerVariant): string => {
  switch (variant) {
    case 'primary':
      return 'primarySpinnerBg'
    case 'light':
      return 'lightSpinnerBg'
    case 'warning':
      return 'warningSpinnerBg'
    case 'error':
      return 'errorSpinnerBg'
  }
}

function SpinnerRaw({ size = 'md', variant = 'primary', ...styleProps }: Props) {
  const trueSize = getSpinnerWidth(size)
  const strokeWidth = getSpinnerStrokeWidth(size)
  const strokeColor = getStrokeColor(variant)
  const strokeBg = getStrokeBg(variant)
  return (
    <Box
      {...styleProps}
      width={trueSize}
      height={trueSize}
      sx={{
        borderRadius: 'circle',
        borderColor: strokeColor,
        borderWidth: strokeWidth,
        borderStyle: 'solid',
        borderBottomColor: strokeBg,
        borderLeftColor: strokeBg,
        borderRightColor: strokeBg,
        animation: 'spinner 1s linear infinite',
      }}
    />
  )
}

const Spinner = styled(SpinnerRaw)`
  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

export default Spinner

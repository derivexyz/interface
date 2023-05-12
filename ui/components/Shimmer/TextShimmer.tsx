import Flex from '@lyra/ui/components/Flex'
import useFontSize from '@lyra/ui/hooks/useFontSize'
import React from 'react'
import { LayoutProps, MarginProps } from 'styled-system'

import useLineHeight from '../../hooks/useLineHeight'
import { TextVariant } from '../Text'
import Shimmer from '.'

type Props = {
  variant?: TextVariant
} & Omit<LayoutProps, 'h' | 'height'> &
  MarginProps

export default function TextShimmer({ variant = 'body', ...styleProps }: Props) {
  const lineHeight = useLineHeight(variant)
  const fontSize = useFontSize(variant)
  if (isNaN(lineHeight) || isNaN(fontSize)) {
    console.warn('lineHeight / fontSize does not exist for variant')
    return null
  }
  const PY = (lineHeight - fontSize) / 2
  return (
    <Flex {...styleProps} width={styleProps.width ?? 100} py={`${PY}px`}>
      <Shimmer borderRadius={'text'} height={`${fontSize}px`} width="100%" />
    </Flex>
  )
}

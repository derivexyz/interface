import React from 'react'
import { Image as RebassImage, ImageProps } from 'rebass'

import NextLink from '../Link/NextLink'

export default function Image({ href, ...imageProps }: ImageProps) {
  return (
    <NextLink href={href}>
      <RebassImage {...(imageProps as any)} sx={{ cursor: href ? 'pointer' : undefined, ...imageProps.sx }} />
    </NextLink>
  )
}

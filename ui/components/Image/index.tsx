import React from 'react'
import { Image as RebassImage, ImageProps } from 'rebass'

export default function Image({ href, ...imageProps }: ImageProps) {
  return <RebassImage {...(imageProps as any)} sx={{ cursor: href ? 'pointer' : undefined, ...imageProps.sx }} />
}

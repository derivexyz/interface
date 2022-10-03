import React from 'react'

import { CustomIconProps } from './IconSVG'

export default function DotIcon({ size, color }: CustomIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 9" width={size} height={size} fill={color}>
      <circle cx="4.5" cy="4.5" r="3.5" />
    </svg>
  )
}

import React from 'react'

import { CustomIconProps } from './IconSVG'

export default function MoreIcon({ size, color }: CustomIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.875 23.375L26.125 23.375"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6.875 16.5H26.125" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.875 9.625L17.875 9.625" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

import React from 'react'

import { CustomIconProps } from './IconSVG'

export default function RewardsIcon({ size, color }: CustomIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 41" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="33" r="7" transform="rotate(180 20 33)" stroke={color} strokeWidth="2" />
      <circle cx="6" cy="19" r="5" transform="rotate(180 6 19)" stroke={color} strokeWidth="2" />
      <circle cx="19" cy="4" r="3" transform="rotate(180 19 4)" stroke={color} strokeWidth="2" />
    </svg>
  )
}

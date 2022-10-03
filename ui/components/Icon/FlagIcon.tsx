import React from 'react'

import { CustomIconProps } from './IconSVG'

export default function FlagIcon({ size, color }: CustomIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.54947 36.2391L1.83911 9.99121"
        stroke="#60DDBF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32.5687 20.8121C24.932 30.7154 13.9575 17.6191 6.32077 27.5224L1.55079 8.86441C9.18749 -1.03894 20.162 12.0574 27.7987 2.15405L32.5687 20.8121Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

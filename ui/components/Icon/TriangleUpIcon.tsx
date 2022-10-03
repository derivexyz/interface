import React from 'react'

import { CustomIconProps } from './IconSVG'

export default function TriangleUpIcon({ size, color }: CustomIconProps) {
  return (
    <svg
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      id="Layer_1"
      height={size}
      width={size}
      viewBox="0 0 531.74 460.5"
      overflow="visible"
      enableBackground="new 0 0 531.74 460.5"
      xmlSpace="preserve"
    >
      <polygon stroke="#000000" points="0.866,460 265.87,1 530.874,460 " />
    </svg>
  )
}

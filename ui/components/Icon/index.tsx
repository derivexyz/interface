import { MarginProps, PaddingProps } from '@lyra/ui/types'
import React from 'react'

import Center from '../Center'
import IconSVG, { SVGIconProps } from './IconSVG'
export { IconType } from './IconSVG'

type Props = {
  onClick?: React.ReactEventHandler
  onMouseOut?: React.MouseEventHandler
  onMouseOver?: React.MouseEventHandler
} & SVGIconProps &
  MarginProps &
  PaddingProps

export default function Icon({
  icon,
  size,
  color,
  strokeWidth,
  onMouseOut,
  onMouseOver,
  onClick,
  ...marginProps
}: Props) {
  return (
    <Center
      {...marginProps}
      width={size}
      height={size}
      color={color}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onClick={onClick}
    >
      <IconSVG icon={icon} size={size} color="currentColor" strokeWidth={strokeWidth} />
    </Center>
  )
}

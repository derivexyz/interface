import Image from '@lyra/ui/components/Image'
import { MarginProps } from '@lyra/ui/types'
import coerce from '@lyra/ui/utils/coerce'
import React from 'react'

import Icon from '.'
import { IconType, SVGIconProps } from './IconSVG'

type Props = {
  src?: IconType | string
} & Omit<SVGIconProps, 'icon'> &
  MarginProps

export default function IconOrImage({ src, size, ...props }: Props) {
  const iconType = coerce(IconType, src)
  return iconType ? (
    <Icon icon={iconType} size={size} {...props} />
  ) : (
    <Image src={src} width={size} height={size} {...props} />
  )
}

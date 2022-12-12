import Image from '@lyra/ui/components/Image'
import { AvatarComponentProps } from '@rainbow-me/rainbowkit/dist/components/RainbowKitProvider/AvatarContext'
import React from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

const Avatar = ({ address, ensImage, size }: AvatarComponentProps) => {
  return ensImage ? (
    <Image src={ensImage} width={size} height={size} style={{ borderRadius: 999 }} />
  ) : (
    <Jazzicon diameter={size} seed={jsNumberForAddress(address)} />
  )
}

export default Avatar

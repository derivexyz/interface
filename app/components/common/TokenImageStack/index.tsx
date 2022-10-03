import Flex from '@lyra/ui/components/Flex'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'

import TokenImage from '@/app/containers/common/TokenImage'

type Props = {
  tokenNameOrAddresses: string[]
  size: number
} & MarginProps

const OVERLAP = 0.4

export default function TokenImageStack({ tokenNameOrAddresses, size, ...styleProps }: Props) {
  const width = size * (1 - OVERLAP) * (tokenNameOrAddresses.length - 1) + size
  return (
    <Flex {...styleProps} width={width}>
      {tokenNameOrAddresses.map((tokenNameOrAddress, idx) => (
        <TokenImage
          key={tokenNameOrAddress}
          nameOrAddress={tokenNameOrAddress}
          size={size}
          ml={idx > 0 ? `-${size * OVERLAP}px` : 0}
        />
      ))}
    </Flex>
  )
}

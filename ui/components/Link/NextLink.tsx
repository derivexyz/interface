import isExternalURL from '@lyra/ui/utils/isExternalURL'
import NextLinkRaw from 'next/link'
import React from 'react'

type Props = {
  href?: string | null
  children?: React.ReactNode
}

export default function NextLink({ href, children }: Props): JSX.Element {
  if (href && !isExternalURL(href)) {
    return <NextLinkRaw href={href}>{children}</NextLinkRaw>
  } else {
    return <>{children}</>
  }
}

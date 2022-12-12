import isExternalURL from '@lyra/ui/utils/isExternalURL'
import React from 'react'
import { Link as ReactBaseLink } from 'react-router-dom'
import { Link as RebassLink, LinkProps as RebassLinkProps } from 'rebass'

type Props = {
  href?: string | null
  children?: React.ReactNode
} & RebassLinkProps

export default function BaseLink({ href, children, ...props }: Props): JSX.Element {
  if (href && !isExternalURL(href)) {
    // Hack to pass "to" prop to BaseLink
    const hrefProps: any = { to: href, href }
    return (
      <RebassLink {...props} {...hrefProps} as={ReactBaseLink}>
        {children}
      </RebassLink>
    )
  } else {
    return (
      <RebassLink {...props} href={href}>
        {children}
      </RebassLink>
    )
  }
}

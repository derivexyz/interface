import ThemeGlobalStyle from '@lyra/ui/theme/ThemeGlobalStyle'
import Head from 'next/head'
import React from 'react'

import MetaTags from '../MetaTags'
import NoSSR from '../NoSSR'

type Props = {
  children?: React.ReactNode
}

// Shared between all pages
// TODO: @dappbeast Move Layout skeleton into shared AppLayout
export default function AppLayout({ children }: Props): JSX.Element {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
      </Head>
      <MetaTags />
      {/* Disable SSR for all page content */}
      <NoSSR>
        <ThemeGlobalStyle />
        {children}
      </NoSSR>
    </>
  )
}

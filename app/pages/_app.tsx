import '@rainbow-me/rainbowkit/styles.css'

import ThemeProvider from '@lyra/ui/theme/ThemeProvider'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import posthog from 'posthog-js'
import React, { useEffect } from 'react'
import { SWRConfig } from 'swr'

import { DEFAULT_MARKET } from '../constants/defaults'
import { LogEvent } from '../constants/logEvents'
import { PageId } from '../constants/pages'
import AppLayout from '../page_helpers/common/AppLayout'
import LocalStorageProvider from '../providers/LocalStorageProvider'
import { QueryParamProvider } from '../providers/QueryParamProvider'
import { WalletProvider } from '../providers/WalletProvider'
import compare from '../utils/compare'
import getPagePath from '../utils/getPagePath'
import isProd from '../utils/isProd'
import isServer from '../utils/isServer'
import logEvent from '../utils/logEvent'

const POST_HOG_API_KEY = process.env.NEXT_PUBLIC_POST_HOG_API_KEY

function Application({ Component, pageProps }: AppProps): JSX.Element {
  // Initialize PostHog
  useEffect(() => {
    if (POST_HOG_API_KEY) {
      posthog.init(POST_HOG_API_KEY, {
        api_host: 'https://app.posthog.com',
        capture_pageview: false,
        autocapture: false,
      })
    } else if (isProd()) {
      console.warn('PostHog failed to initialize')
    }
  }, [])

  const { prefetch, asPath } = useRouter()

  // Prefetch navigation pages
  useEffect(() => {
    Promise.all([
      prefetch(getPagePath({ page: PageId.Portfolio })),
      prefetch(getPagePath({ page: PageId.Trade, marketAddressOrName: DEFAULT_MARKET })),
      prefetch(getPagePath({ page: PageId.VaultsIndex })),
      prefetch(getPagePath({ page: PageId.Rewards })),
      prefetch(getPagePath({ page: PageId.Competition })),
    ]).then(() => {
      console.debug('Prefetched nav pages')
    })
  }, [prefetch])

  // Log page views to PostHog
  useEffect(() => {
    if (!isServer()) {
      logEvent(LogEvent.PageView)
    }
  }, [asPath])

  return (
    <QueryParamProvider>
      <LocalStorageProvider>
        <SWRConfig
          value={{
            suspense: true,
            revalidateOnFocus: false,
            errorRetryCount: 0,
            shouldRetryOnError: false,
            revalidateOnMount: true,
            refreshWhenHidden: false,
            refreshWhenOffline: false,
            compare,
          }}
        >
          <ThemeProvider>
            <WalletProvider>
              <AppLayout>
                <Component {...pageProps} />
              </AppLayout>
            </WalletProvider>
          </ThemeProvider>
        </SWRConfig>
      </LocalStorageProvider>
    </QueryParamProvider>
  )
}

export default Application

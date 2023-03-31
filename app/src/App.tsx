import '@rainbow-me/rainbowkit/styles.css'

import ThemeProvider from '@lyra/ui/theme/ThemeProvider'
import * as Sentry from '@sentry/react'
import spindl from '@spindl-xyz/attribution-lite'
import posthog from 'posthog-js'
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SWRConfig } from 'swr'

import { LogEvent } from './constants/logEvents'
import Layout from './page_helpers/common/Layout'
import PageRoutes from './PageRoutes'
import LocalStorageProvider from './providers/LocalStorageProvider'
import { WalletProvider } from './providers/WalletProvider'
import compare from './utils/compare'
import initSentry from './utils/initSentry'
import logEvent from './utils/logEvent'

// Initialize Spindl
if (process.env.REACT_APP_SPINDL_API_KEY) {
  spindl.configure({ API_KEY: process.env.REACT_APP_SPINDL_API_KEY })
  console.debug('Spindl initialized')
} else {
  console.warn('Spindl failed to initialize')
}

if (process.env.REACT_APP_POST_HOG_API_KEY) {
  posthog.init(process.env.REACT_APP_POST_HOG_API_KEY, {
    api_host: 'https://app.posthog.com',
    capture_pageview: false,
    autocapture: false,
  })
  console.debug('PostHog initialized')
} else {
  console.warn('PostHog failed to initialize')
}

console.debug('NODE_ENV', process.env.NODE_ENV)
console.debug('REACT_APP_ENV', process.env.REACT_APP_ENV)

// Initialize Sentry
initSentry()

function App(): JSX.Element {
  const navigate = useNavigate()

  const { pathname, search } = useLocation()

  // pathname changes
  useEffect(() => {
    // Log page views to PostHog
    logEvent(LogEvent.PageView)

    // Log page views to Spindl
    if (process.env.REACT_APP_SPINDL_API_KEY) {
      try {
        spindl.configure({ API_KEY: process.env.REACT_APP_SPINDL_API_KEY })
        spindl.pageView()
      } catch (err) {
        console.warn('Spindl pageView failed')
      }
    }

    // Reset page scroll
    window.scrollTo(0, 0)

    // Remove /:pathname# prefix from url path
    const basePathSearch = (location.pathname + location.search).substring(1)
    if (!basePathSearch.startsWith('#') && pathname === '/') {
      navigate(basePathSearch, { replace: true })
    }
    const timeout = setTimeout(() => {
      if (!basePathSearch.startsWith('#')) {
        window.history.replaceState({}, '', '/#' + pathname + search)
      }
    }, 200)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <Sentry.ErrorBoundary>
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
              <Layout>
                <PageRoutes />
              </Layout>
            </WalletProvider>
          </ThemeProvider>
        </SWRConfig>
      </LocalStorageProvider>
    </Sentry.ErrorBoundary>
  )
}

export default App

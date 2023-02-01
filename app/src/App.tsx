import '@rainbow-me/rainbowkit/styles.css'

import ThemeProvider from '@lyra/ui/theme/ThemeProvider'
import * as Sentry from '@sentry/react'
import spindl from '@spindl-xyz/attribution-lite'
import posthog from 'posthog-js'
import React, { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { SWRConfig } from 'swr'

import { LogEvent } from './constants/logEvents'
import Layout from './page_helpers/common/Layout'
import PortfolioHistoryPageHelper from './page_helpers/PortfolioHistoryPageHelper'
import AdminBoardPage from './pages/AdminBoardPage'
import AdminMarketPage from './pages/AdminPage'
import NotFoundPage from './pages/NotFoundPage'
import PortfolioPage from './pages/PortfolioPage'
import PositionPage from './pages/PositionPage'
import RewardsHistoryPage from './pages/RewardsHistoryPage'
import RewardsPage from './pages/RewardsPage'
import StoryBookPage from './pages/StoryBookPage'
import TradePage from './pages/TradePage'
import VaultsHistoryPage from './pages/VaultsHistoryPage'
import VaultsIndexPage from './pages/VaultsIndexPage'
import VaultsPage from './pages/VaultsPage'
import LocalStorageProvider from './providers/LocalStorageProvider'
import { WalletProvider } from './providers/WalletProvider'
import compare from './utils/compare'
import { getDefaultMarket } from './utils/getDefaultMarket'
import initSentry from './utils/initSentry'
import logEvent from './utils/logEvent'
import useDefaultNetwork from './utils/useDefaultNetwork'

// Initialize Spindl
if (process.env.REACT_APP_SPINDL_API_KEY) {
  spindl.configure({ API_KEY: process.env.REACT_APP_SPINDL_API_KEY })
  console.debug('Spindl initialized')
} else {
  console.warn('Spindl failed to initialize')
}

console.debug('NODE_ENV', process.env.NODE_ENV)
console.debug('REACT_APP_ENV', process.env.REACT_APP_ENV)

// Initialize Sentry
initSentry()

function App(): JSX.Element {
  useEffect(() => {
    // Initialize PostHog
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
  }, [])

  const navigate = useNavigate()

  const { pathname, search } = useLocation()

  // Redirect /:pathname to /#/:pathname for backwards compatibility
  useEffect(() => {
    const basePathSearch = (location.pathname + location.search).substring(1)
    if (!basePathSearch.startsWith('#') && pathname === '/') {
      navigate(basePathSearch, { replace: true })
    }
    // Remove /:pathname# prefix from url path
    const timeout = setTimeout(() => {
      if (!basePathSearch.startsWith('#')) {
        window.history.replaceState({}, '', '/#' + pathname + search)
      }
    }, 200)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Log page views to PostHog
  useEffect(() => {
    logEvent(LogEvent.PageView)
    if (process.env.REACT_APP_SPINDL_API_KEY) {
      try {
        spindl.configure({ API_KEY: process.env.REACT_APP_SPINDL_API_KEY })
        spindl.pageView()
      } catch (err) {
        console.warn('Spindl pageView failed')
      }
    }
  }, [pathname])

  const defaultNetwork = useDefaultNetwork()

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
                <Routes>
                  <Route index element={<Navigate to="/portfolio" />} />
                  <Route path="/portfolio" element={<PortfolioPage />} />
                  <Route path="/portfolio/history" element={<PortfolioHistoryPageHelper />} />
                  <Route
                    path="/trade"
                    element={<Navigate to={`/trade/${defaultNetwork}/${getDefaultMarket(defaultNetwork)}`} />}
                  />
                  <Route path="/trade/:network/:marketAddressOrName" element={<TradePage />} />
                  <Route path="/vaults" element={<VaultsIndexPage />} />
                  <Route path="/vaults/:network/:marketAddressOrName" element={<VaultsPage />} />
                  <Route path="/vaults/history" element={<VaultsHistoryPage />} />
                  <Route path="/position/:network/:marketAddressOrName/:positionId" element={<PositionPage />} />
                  <Route path="/rewards" element={<RewardsPage />} />
                  <Route path="/rewards/history" element={<RewardsHistoryPage />} />
                  <Route path="/storybook" element={<StoryBookPage />} />
                  <Route
                    path="/admin"
                    element={<Navigate to={`/admin/${defaultNetwork}/${getDefaultMarket(defaultNetwork)}`} />}
                  />
                  <Route path="/admin/:network/:marketAddressOrName" element={<AdminMarketPage />} />
                  <Route path="/admin/:network/:marketAddressOrName/:boardId" element={<AdminBoardPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Layout>
            </WalletProvider>
          </ThemeProvider>
        </SWRConfig>
      </LocalStorageProvider>
    </Sentry.ErrorBoundary>
  )
}

export default App

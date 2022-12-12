import '@rainbow-me/rainbowkit/styles.css'

import ThemeProvider from '@lyra/ui/theme/ThemeProvider'
import { Network } from '@lyrafinance/lyra-js'
import posthog from 'posthog-js'
import React, { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { SWRConfig } from 'swr'

import { getDefaultMarket } from './constants/defaults'
import { LogEvent } from './constants/logEvents'
import AppLayout from './page_helpers/common/AppLayout'
import PortfolioHistoryPageHelper from './page_helpers/PortfolioHistoryPageHelper'
import AdminBoardPage from './pages/AdminBoardPage'
import AdminMarketPage from './pages/AdminMarketPage'
import AdminPage from './pages/AdminPage'
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
import isProd from './utils/isProd'
import logEvent from './utils/logEvent'

const POST_HOG_API_KEY = process.env.REACT_APP_POST_HOG_API_KEY

function App(): JSX.Element {
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

  const navigate = useNavigate()

  const { pathname } = useLocation()

  // Redirect /:pathname to /#/:pathname for old links
  useEffect(() => {
    const basePathSearch = (location.pathname + location.search).substring(1)
    if (basePathSearch != '' && pathname === '/') {
      navigate(basePathSearch, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Log page views to PostHog
  useEffect(() => {
    logEvent(LogEvent.PageView)
  }, [pathname])

  return (
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
              <Routes>
                <Route index element={<Navigate to="/portfolio" />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/portfolio/history" element={<PortfolioHistoryPageHelper />} />
                <Route path="/trade" element={<Navigate to={`/trade/${getDefaultMarket(Network.Optimism)}`} />} />
                <Route path="/trade/:marketAddressOrName" element={<TradePage />} />
                <Route path="/vaults" element={<VaultsIndexPage />} />
                <Route path="/vaults/:marketAddressOrName" element={<VaultsPage />} />
                <Route path="/vaults/history" element={<VaultsHistoryPage />} />
                <Route path="/position/:marketAddressOrName/:positionId" element={<PositionPage />} />
                <Route path="/rewards" element={<RewardsPage />} />
                <Route path="/rewards/history" element={<RewardsHistoryPage />} />
                <Route path="/storybook" element={<StoryBookPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/:marketAddressOrName" element={<AdminMarketPage />} />
                <Route path="/admin/:marketAddressOrName/:boardId" element={<AdminBoardPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </AppLayout>
          </WalletProvider>
        </ThemeProvider>
      </SWRConfig>
    </LocalStorageProvider>
  )
}

export default App

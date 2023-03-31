import '@rainbow-me/rainbowkit/styles.css'

import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import useNetwork from './hooks/account/useNetwork'
import PortfolioHistoryPageHelper from './page_helpers/PortfolioHistoryPageHelper'
import AdminBoardPage from './pages/AdminBoardPage'
import AdminMarketPage from './pages/AdminPage'
import FaucetPage from './pages/FaucetPage'
import NotFoundPage from './pages/NotFoundPage'
import PortfolioPage from './pages/PortfolioPage'
import PositionPage from './pages/PositionPage'
import RewardsArrakisPage from './pages/RewardsArrakisPage'
import RewardsIndexPage from './pages/RewardsIndexPage'
import RewardsTradingPage from './pages/RewardsTradingPage'
import RewardsVaultsPage from './pages/RewardsVaultsPage'
import StoryBookPage from './pages/StoryBookPage'
import TradePage from './pages/TradePage'
import VaultsHistoryPage from './pages/VaultsHistoryPage'
import VaultsIndexPage from './pages/VaultsIndexPage'
import VaultsPage from './pages/VaultsPage'
import { getDefaultMarket } from './utils/getDefaultMarket'
import isMainnet from './utils/isMainnet'

export default function PageRoutes() {
  const network = useNetwork()

  return (
    <Routes>
      <Route index element={<Navigate to="/portfolio" />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="/portfolio/history" element={<PortfolioHistoryPageHelper />} />
      <Route path="/trade" element={<Navigate to={`/trade/${network}/${getDefaultMarket(network)}`} />} />
      <Route path="/trade/:network/:marketAddressOrName" element={<TradePage />} />
      <Route path="/vaults" element={<VaultsIndexPage />} />
      <Route path="/vaults/:network/:marketAddressOrName" element={<VaultsPage />} />
      <Route path="/vaults/history" element={<VaultsHistoryPage />} />
      <Route path="/position/:network/:marketAddressOrName/:positionId" element={<PositionPage />} />
      {isMainnet() ? (
        <>
          <Route path="/rewards" element={<RewardsIndexPage />} />
          <Route path="/rewards/trading/:network" element={<RewardsTradingPage />} />
          <Route path="/rewards/vaults/:network/:marketAddressOrName" element={<RewardsVaultsPage />} />
          <Route path="/rewards/arrakis" element={<RewardsArrakisPage />} />
        </>
      ) : null}
      {!isMainnet() ? <Route path="/faucet" element={<FaucetPage />} /> : null}
      <Route path="/storybook" element={<StoryBookPage />} />
      <Route path="/admin" element={<Navigate to={`/admin/${network}/${getDefaultMarket(network)}`} />} />
      <Route path="/admin/:network/:marketAddressOrName" element={<AdminMarketPage />} />
      <Route path="/admin/:network/:marketAddressOrName/:boardId" element={<AdminBoardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

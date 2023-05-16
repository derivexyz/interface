import '@rainbow-me/rainbowkit/styles.css'

import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import useNetwork from './hooks/account/useNetwork'
import AdminBoardPage from './pages/AdminBoardPage'
import AdminMarketPage from './pages/AdminPage'
import EarnArrakisPage from './pages/EarnArrakisPage'
import EarnIndexPage from './pages/EarnIndexPage'
import EarnVaultsPage from './pages/EarnVaultsPage'
import EscrowPage from './pages/EscrowPage'
import FaucetPage from './pages/FaucetPage'
import LeaderboardHistoryPage from './pages/LeaderboardHistoryPage'
import LeaderboardPage from './pages/LeaderboardPage'
import NotFoundPage from './pages/NotFoundPage'
import PositionPage from './pages/PositionPage'
import ReferralsPage from './pages/ReferralsPage'
import StoryBookPage from './pages/StoryBookPage'
import TradeHistoryPage from './pages/TradeHistoryPage'
import TradePage from './pages/TradePage'
import VoteIndexPage from './pages/VoteIndexPage'
import VoteProposalCreatePage from './pages/VoteProposalCreatePage'
import VoteProposalDetailsPage from './pages/VoteProposalDetailsPage'
import { getDefaultMarket } from './utils/getDefaultMarket'
import isMainnet from './utils/isMainnet'

export default function PageRoutes() {
  const network = useNetwork()
  return (
    <Routes>
      <Route index element={<Navigate to="/trade" />} />
      <Route path="/trade" element={<Navigate to={`/trade/${network}/${getDefaultMarket(network)}`} />} />
      <Route path="/trade/:network/:marketAddressOrName" element={<TradePage />} />
      <Route path="/trade/history" element={<TradeHistoryPage />} />
      <Route path="/position/:network/:marketAddressOrName/:positionId" element={<PositionPage />} />
      {isMainnet() ? (
        <>
          <Route path="/leaderboard" element={<Navigate to={`/airdrop/${network}`} />} />
          <Route path="/leaderboard/:network" element={<Navigate to={`/airdrop/${network}`} />} />
          <Route path="/leaderboard/history" element={<Navigate to="/airdrop/history" />} />
          <Route path="/airdrop" element={<Navigate to={`/leaderboard/${network}`} />} />
          <Route path="/airdrop/:network" element={<LeaderboardPage />} />
          <Route path="/airdrop/history" element={<LeaderboardHistoryPage />} />
          <Route path="/earn/referrals/:network" element={<ReferralsPage />} />
          <Route path="/earn" element={<EarnIndexPage />} />
          <Route path="/earn/vaults/:network/:marketAddressOrName" element={<EarnVaultsPage />} />
          <Route path="/earn/arrakis" element={<EarnArrakisPage />} />
          <Route path="/vaults" element={<EarnIndexPage />} />
          <Route path="/rewards" element={<EarnIndexPage />} />
        </>
      ) : null}
      <Route path="/vote" element={<VoteIndexPage />} />
      <Route path="/vote/proposal/create" element={<VoteProposalCreatePage />} />
      <Route path="/vote/proposal/:proposalId" element={<VoteProposalDetailsPage />} />
      {!isMainnet() ? <Route path="/faucet" element={<FaucetPage />} /> : null}
      <Route path="/storybook" element={<StoryBookPage />} />
      <Route path="/admin" element={<Navigate to={`/admin/${network}/${getDefaultMarket(network)}`} />} />
      <Route path="/admin/:network/:marketAddressOrName" element={<AdminMarketPage />} />
      <Route path="/admin/:network/:marketAddressOrName/:boardId" element={<AdminBoardPage />} />
      <Route path="/escrow" element={<EscrowPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

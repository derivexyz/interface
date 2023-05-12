import '@rainbow-me/rainbowkit/styles.css'

import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import useNetwork from './hooks/account/useNetwork'
import AdminBoardPage from './pages/AdminBoardPage'
import AdminMarketPage from './pages/AdminPage'
import EscrowPage from './pages/EscrowPage'
import FaucetPage from './pages/FaucetPage'
import LeaderboardHistoryPage from './pages/LeaderboardHistoryPage'
import LeaderboardPage from './pages/LeaderboardPage'
import NotFoundPage from './pages/NotFoundPage'
import PositionPage from './pages/PositionPage'
import ReferralsPage from './pages/ReferralsPage'
import RewardsArrakisPage from './pages/RewardsArrakisPage'
import RewardsIndexPage from './pages/RewardsIndexPage'
import RewardsVaultsPage from './pages/RewardsVaultsPage'
import StoryBookPage from './pages/StoryBookPage'
import TradeHistoryPage from './pages/TradeHistoryPage'
import TradePage from './pages/TradePage'
import VaultsHistoryPage from './pages/VaultsHistoryPage'
import VaultsIndexPage from './pages/VaultsIndexPage'
import VaultsPage from './pages/VaultsPage'
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
      <Route path="/vaults" element={<VaultsIndexPage />} />
      <Route path="/vaults/:network/:marketAddressOrName" element={<VaultsPage />} />
      <Route path="/vaults/history" element={<VaultsHistoryPage />} />
      <Route path="/position/:network/:marketAddressOrName/:positionId" element={<PositionPage />} />
      {isMainnet() ? (
        <>
          <Route path="/leaderboard" element={<Navigate to={`/airdrop/${network}`} />} />
          <Route path="/leaderboard/:network" element={<Navigate to={`/airdrop/${network}`} />} />
          <Route path="/leaderboard/history" element={<Navigate to="/airdrop/history" />} />
          <Route path="/airdrop" element={<Navigate to={`/leaderboard/${network}`} />} />
          <Route path="/airdrop/:network" element={<LeaderboardPage />} />
          <Route path="/airdrop/history" element={<LeaderboardHistoryPage />} />
          <Route path="/rewards/referrals/:network" element={<ReferralsPage />} />
          <Route path="/rewards" element={<RewardsIndexPage />} />
          <Route path="/rewards/vaults/:network/:marketAddressOrName" element={<RewardsVaultsPage />} />
          <Route path="/rewards/arrakis" element={<RewardsArrakisPage />} />
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

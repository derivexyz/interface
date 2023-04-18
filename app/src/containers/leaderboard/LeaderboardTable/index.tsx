import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import { Network } from '@lyrafinance/lyra-js'
import React from 'react'
import { useState } from 'react'

import TradingLeaderboardTable from '@/app/components/common/TradingLeaderboardTable'
import { PageId } from '@/app/constants/pages'
import { LeaderboardPageData } from '@/app/hooks/leaderboard/useLeaderboardPageData'
import getPagePath from '@/app/utils/getPagePath'

import LeaderboardBoostModal from '../LeaderboardBoostModal'

type Props = {
  network: Network
  data: LeaderboardPageData
} & MarginProps

const LeaderboardTable = ({ data, network, ...marginProps }: Props) => {
  const { leaderboard, latestGlobalRewardEpoch, lyraBalances, currentTrader } = data
  const [isOpen, setIsOpen] = useState(false)
  if (!leaderboard.length) {
    return (
      <CardBody {...marginProps} height={112} justifyContent="center">
        <Card variant="nested" width={232}>
          <CardBody p={4}>
            <Text variant="secondary" color="secondaryText">
              There is no available data for this leaderboard.
            </Text>
          </CardBody>
        </Card>
      </CardBody>
    )
  }
  return (
    <>
      <TradingLeaderboardTable
        network={network}
        currentTrader={currentTrader}
        leaderboard={leaderboard}
        onClick={trader => {
          window.open(
            `/#${getPagePath({
              page: PageId.History,
            })}?see=${trader}`,
            '_blank'
          )
        }}
        onBoostClick={() => setIsOpen(true)}
        pageSize={10}
      />
      <LeaderboardBoostModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        latestGlobalRewardEpoch={latestGlobalRewardEpoch}
        leaderboard={leaderboard}
        lyraBalances={lyraBalances}
      />
    </>
  )
}

export default LeaderboardTable

import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'
import { useState } from 'react'

import TradingLeaderboardTable from '@/app/components/common/TradingLeaderboardTable'
import { PageId } from '@/app/constants/pages'
import useAccountLyraBalances from '@/app/hooks/account/useAccountLyraBalances'
import withSuspense from '@/app/hooks/data/withSuspense'
import { LeaderboardPageData } from '@/app/hooks/leaderboard/useLeaderboardPageData'
import getPagePath from '@/app/utils/getPagePath'

import LeaderboardBoostModal from '../LeaderboardBoostModal'

type Props = {
  data: LeaderboardPageData
} & MarginProps

const LeaderboardTable = withSuspense(
  ({ data, ...marginProps }: Props) => {
    const { traders, latestGlobalRewardEpoch } = data
    const lyraBalances = useAccountLyraBalances()
    const [isOpen, setIsOpen] = useState(false)
    if (!traders.length) {
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
          traders={traders}
          onClick={trader => {
            window.open(
              `${getPagePath({
                page: PageId.Portfolio,
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
          traders={traders}
          lyraBalances={lyraBalances}
        />
      </>
    )
  },
  () => (
    <CardBody height={112}>
      <Center width="100%" height="100%">
        <Spinner />
      </Center>
    </CardBody>
  )
)

export default LeaderboardTable

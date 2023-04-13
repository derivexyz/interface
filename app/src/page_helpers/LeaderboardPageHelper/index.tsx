import Link from '@lyra/ui/components/Link'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import { Network } from '@lyrafinance/lyra-js'
import React from 'react'

import { TRADING_REWARDS_BLOG_URL } from '@/app/constants/links'
import LeaderboardKeyMetricsCard from '@/app/containers/leaderboard/LeaderboardKeyMetricsCard'
import LeaderboardPageHeader from '@/app/containers/leaderboard/LeaderboardPageHeader'
import LeaderboardTable from '@/app/containers/leaderboard/LeaderboardTable'
import useNetwork from '@/app/hooks/account/useNetwork'
import { LeaderboardPageData } from '@/app/hooks/leaderboard/useLeaderboardPageData'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

type Props = {
  data: LeaderboardPageData
} & MarginProps

const LeaderboardPageHelper = ({ data, ...marginProps }: Props): JSX.Element => {
  const network = useNetwork()
  const { latestGlobalRewardEpoch, latestAccountRewardEpoch } = data
  const epochNumber = network === Network.Arbitrum ? latestGlobalRewardEpoch.id - 5 : latestGlobalRewardEpoch.id - 18
  const isMobile = useIsMobile()
  return (
    <Page
      noHeaderPadding
      header={
        !isMobile ? (
          <LeaderboardPageHeader
            latestAccountRewardEpoch={latestAccountRewardEpoch}
            latestGlobalRewardEpoch={latestGlobalRewardEpoch}
            showBackButton={false}
          />
        ) : null
      }
      {...marginProps}
    >
      <PageGrid>
        <Text variant="heading" color="text" mt={[4, 0]} ml={[4, 0]}>
          Epoch {epochNumber}
        </Text>
        <Text variant="secondary" color="secondaryText" sx={{ lineHeight: 2 }} mt={[0, -4]} ml={[4, 0]}>
          Traders earn their share of a pool of rewards every 2 weeks for opening and holding positions. Traders earn
          more rewards when they pay more fees, open shorter-dated positions and hold positions until expiry. Traders
          also receive daily multipliers on their rewards for staking LYRA, being a top active trader, and being
          referred by another trader. Learn more about trading rewards{' '}
          <Link textVariant="secondary" showRightIcon href={TRADING_REWARDS_BLOG_URL} target="_blank">
            here
          </Link>
        </Text>
        <LeaderboardKeyMetricsCard my={4} data={data} />
        <LeaderboardTable data={data} />
      </PageGrid>
    </Page>
  )
}

export default LeaderboardPageHelper

import Flex from '@lyra/ui/components/Flex'
import Link from '@lyra/ui/components/Link'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { Network } from '@lyrafinance/lyra-js'
import React from 'react'

import { TRADING_REWARDS_BLOG_URL } from '@/app/constants/links'
import LeaderboardKeyMetricsCard from '@/app/containers/leaderboard/LeaderboardKeyMetricsCard'
import LeaderboardPageHeader from '@/app/containers/leaderboard/LeaderboardPageHeader'
import LeaderboardTable from '@/app/containers/leaderboard/LeaderboardTable'
import { LeaderboardPageData } from '@/app/hooks/leaderboard/useLeaderboardPageData'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

type Props = {
  network: Network
  data: LeaderboardPageData
}

const LeaderboardPageHelper = ({ data, network }: Props): JSX.Element => {
  const { latestGlobalRewardEpoch, latestAccountRewardEpoch, leaderboardEpochNumber } = data
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
    >
      <PageGrid>
        <Flex mt={[4, 0]} ml={[4, 0]}>
          <Text variant="title" color="text">
            Epoch {leaderboardEpochNumber}
          </Text>
          <Text color="secondaryText" variant="title">
            &nbsp;·&nbsp;{getNetworkDisplayName(latestGlobalRewardEpoch.lyra.network)}
          </Text>
        </Flex>
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
        <LeaderboardTable data={data} network={network} />
      </PageGrid>
    </Page>
  )
}

export default LeaderboardPageHelper

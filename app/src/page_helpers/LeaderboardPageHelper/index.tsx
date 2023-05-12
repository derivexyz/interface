import Link from '@lyra/ui/components/Link'
import Text from '@lyra/ui/components/Text'
import { Network } from '@lyrafinance/lyra-js'
import React from 'react'

import { TRADING_REWARDS_BLOG_URL } from '@/app/constants/links'
import LeaderboardHeaderCard from '@/app/containers/leaderboard/LeaderboardHeaderCard'
import LeaderboardKeyMetricsCard from '@/app/containers/leaderboard/LeaderboardKeyMetricsCard'
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
  return (
    <Page
      title="Airdrop"
      subtitle={`Earn ${latestGlobalRewardEpoch.tradingRewardTokens[0].symbol} rewards for trading`}
      headerCard={
        <LeaderboardHeaderCard
          latestAccountRewardEpoch={latestAccountRewardEpoch}
          latestGlobalRewardEpoch={latestGlobalRewardEpoch}
        />
      }
    >
      <PageGrid>
        <Text variant="heading">
          Epoch {leaderboardEpochNumber}
          <Text color="secondaryText" as="span">
            &nbsp;·&nbsp;{getNetworkDisplayName(latestGlobalRewardEpoch.lyra.network)}
          </Text>
        </Text>
        <Text color="secondaryText">
          Traders earn their share of a pool of rewards every 2 weeks for opening and holding positions. Traders earn
          more rewards when they pay more fees, open shorter-dated positions and hold positions until expiry. Traders
          also receive daily multipliers on their rewards for staking LYRA, being a top active trader, and being
          referred by another trader. Learn more about trading rewards{' '}
          <Link showRightIcon href={TRADING_REWARDS_BLOG_URL} target="_blank">
            here
          </Link>
        </Text>
        <LeaderboardKeyMetricsCard my={[0, 4]} data={data} />
        <LeaderboardTable data={data} network={network} />
      </PageGrid>
    </Page>
  )
}

export default LeaderboardPageHelper

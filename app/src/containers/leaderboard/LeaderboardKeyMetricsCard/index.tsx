import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Grid from '@lyra/ui/components/Grid'
import Text from '@lyra/ui/components/Text'
import Countdown from '@lyra/ui/components/Text/CountdownText'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatTruncatedNumber from '@lyra/ui/utils/formatTruncatedNumber'
import React from 'react'
import { useMemo } from 'react'

import LabelItem from '@/app/components/common/LabelItem'
import { LeaderboardPageData } from '@/app/hooks/leaderboard/useLeaderboardPageData'
import getAssetSrc from '@/app/utils/getAssetSrc'

type Props = {
  data: LeaderboardPageData
} & MarginProps

const LeaderboardKeyMetricsCard = ({ data, ...marginProps }: Props) => {
  const isMobile = useIsMobile()
  const { latestGlobalRewardEpoch, traders } = data
  const reward = latestGlobalRewardEpoch.tradingRewardsCap[0]
  const traderCount = useMemo(() => {
    const traderAddresses = traders.map(trader => trader.trader)
    return [...new Set(traderAddresses)].length
  }, [traders])

  return (
    <Card
      {...marginProps}
      sx={{
        backgroundImage: `url(${getAssetSrc(
          `${isMobile ? '/images/leaderboard_key_metrics_square.png' : '/images/leaderboard_key_metrics.png'}`
        )})`,
        backgroundSize: 'cover',
        borderRadius: isMobile ? 25 : 0,
      }}
    >
      <CardBody>
        <Grid sx={{ gridTemplateColumns: ['1fr', '1fr 1fr 1fr'], gridGap: 3 }} justifyItems="center" py={4}>
          <LabelItem
            label="Traders"
            labelColor="text"
            valueTextVariant="bodyLargeMedium"
            value={
              <Text variant="title" color="text">
                {traderCount}
              </Text>
            }
            sx={{ alignItems: 'center' }}
            mb={[4, 0]}
          />
          <LabelItem
            label="Rewards"
            labelColor="text"
            valueTextVariant="bodyLargeMedium"
            value={
              <Text variant="title" color="primaryText">
                {formatTruncatedNumber(reward.amount)} {reward.symbol.toUpperCase()}
              </Text>
            }
            sx={{ alignItems: 'center' }}
            mb={[4, 0]}
          />
          <LabelItem
            label="Countdown"
            labelColor="text"
            valueTextVariant="bodyLargeMedium"
            value={
              <Countdown
                timestamp={latestGlobalRewardEpoch.endTimestamp}
                variant="title"
                fallback="Waiting for distribution"
              />
            }
            sx={{ alignItems: 'center' }}
          />
        </Grid>
      </CardBody>
    </Card>
  )
}

export default LeaderboardKeyMetricsCard

import Box from '@lyra/ui/components/Box'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Grid from '@lyra/ui/components/Grid'
import Text from '@lyra/ui/components/Text'
import Countdown from '@lyra/ui/components/Text/CountdownText'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatTruncatedNumber from '@lyra/ui/utils/formatTruncatedNumber'
import React from 'react'
import { useMemo } from 'react'

import { LeaderboardPageData } from '@/app/hooks/leaderboard/useLeaderboardPageData'
import getAssetSrc from '@/app/utils/getAssetSrc'

type Props = {
  data: LeaderboardPageData
} & MarginProps

const LeaderboardKeyMetricsCard = ({ data, ...marginProps }: Props) => {
  const isMobile = useIsMobile()
  const { latestGlobalRewardEpoch, leaderboard } = data
  const reward = latestGlobalRewardEpoch.tradingRewardsCap[0]
  const traderCount = useMemo(() => {
    const traderAddresses = leaderboard.map(trader => trader.trader)
    return new Set(traderAddresses).size
  }, [leaderboard])

  return (
    <Card
      {...marginProps}
      sx={{
        backgroundImage: `url(${getAssetSrc(
          `${isMobile ? '/images/leaderboard_key_metrics_square.png' : '/images/leaderboard_key_metrics.png'}`
        )})`,
        backgroundSize: 'cover',
        borderRadius: 25,
      }}
    >
      <CardBody>
        <Grid sx={{ gridTemplateColumns: ['1fr', '1fr 1fr 1fr'], gridGap: 3 }} justifyItems="center" py={2}>
          <Center mb={[6, 0]}>
            <Box textAlign="center">
              <Text mb={3}>Traders</Text>
              <Text variant="subtitle" sx={{ fontWeight: 'medium' }}>
                {traderCount}
              </Text>
            </Box>
          </Center>
          <Center mb={[6, 0]}>
            <Box textAlign="center">
              <Text mb={3}>Rewards</Text>
              <Text variant="subtitle" color="primaryText" sx={{ fontWeight: 'medium' }}>
                {formatTruncatedNumber(reward.amount)} {reward.symbol.toUpperCase()}
              </Text>
            </Box>
          </Center>
          <Center mb={[6, 0]}>
            <Box textAlign="center">
              <Text mb={3}>Countdown</Text>
              <Text variant="subtitle" sx={{ fontWeight: 'medium' }}>
                <Countdown
                  timestamp={latestGlobalRewardEpoch.endTimestamp}
                  as="span"
                  fallback="Waiting for distribution"
                />
              </Text>
            </Box>
          </Center>
        </Grid>
      </CardBody>
    </Card>
  )
}

export default LeaderboardKeyMetricsCard

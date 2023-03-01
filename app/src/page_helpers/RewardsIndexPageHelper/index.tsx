import Box from '@lyra/ui/components/Box'
import Grid from '@lyra/ui/components/Grid'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { WethLyraStaking } from '@lyrafinance/lyra-js'
import React from 'react'

import RewardsLastUpdatedAlert from '@/app/containers/common/RewardsLastUpdatedAlert'
import RewardsTokenSupplyCard from '@/app/containers/rewards/RewardsTokenSupplyCard'
import ShortRewardsSection from '@/app/containers/rewards/ShortRewardsSection'
import StakingRewardsCard from '@/app/containers/rewards/StakingRewardsCard'
import TradingRewardsSection from '@/app/containers/rewards/TradingRewardsSection'
import VaultsRewardsSection from '@/app/containers/rewards/VaultsRewardsSection'
import WethLyraLPRewardsSection from '@/app/containers/rewards/WethLyraLPRewardsSection'
import { LatestRewardEpoch } from '@/app/hooks/rewards/useLatestRewardEpoch'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

type Props = {
  latestRewardEpochs: LatestRewardEpoch[]
  wethLyraStaking: WethLyraStaking | null
}

const RewardsIndexPageHelper = ({ latestRewardEpochs, wethLyraStaking }: Props) => {
  const isMobile = useIsMobile()
  const pageHeader = (
    <Grid mb={4} p={[6, 0]} sx={{ gridTemplateColumns: ['1fr', '1fr auto'], alignItems: 'center' }}>
      <Box>
        <Text variant="xlTitle" mb={2}>
          Rewards
        </Text>
        <Text variant="heading" color="secondaryText" sx={{ fontWeight: 300 }}>
          Stake and Earn
        </Text>
      </Box>
      <RewardsTokenSupplyCard mt={[56, 0]} />
    </Grid>
  )
  return (
    <Page noHeaderPadding header={!isMobile ? pageHeader : null}>
      <PageGrid>
        {isMobile ? pageHeader : null}
        <RewardsLastUpdatedAlert latestRewardEpochs={latestRewardEpochs} />
        <StakingRewardsCard latestRewardEpochs={latestRewardEpochs} />
        <VaultsRewardsSection latestRewardEpochs={latestRewardEpochs} />
        <TradingRewardsSection latestRewardEpochs={latestRewardEpochs} />
        <ShortRewardsSection latestRewardEpochs={latestRewardEpochs} />
        <WethLyraLPRewardsSection wethLyraStaking={wethLyraStaking} />
      </PageGrid>
    </Page>
  )
}

export default RewardsIndexPageHelper

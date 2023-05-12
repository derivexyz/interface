import Box from '@lyra/ui/components/Box'
import Text from '@lyra/ui/components/Text'
import { NewTradingRewardsReferredTraders } from '@lyrafinance/lyra-js/src/utils/fetchAccountRewardEpochData'
import React from 'react'

import { Vault } from '@/app/constants/vault'
import TotalSupplyHeaderCard from '@/app/containers/common/TotalSupplyHeaderCard'
import RewardsLastUpdatedAlert from '@/app/containers/rewards_index/RewardsLastUpdatedAlert'
import RewardsReferralsSection from '@/app/containers/rewards_index/RewardsReferralsSection'
import RewardsStakingCard from '@/app/containers/rewards_index/RewardsStakingCard'
import RewardsVaultsSection from '@/app/containers/rewards_index/RewardsVaultsSection'
import RewardsWethLyraLPSection from '@/app/containers/rewards_index/RewardsWethLyraLPSection'
import { LatestRewardEpoch } from '@/app/hooks/rewards/useRewardsPageData'
import { LyraBalances } from '@/app/utils/common/fetchLyraBalances'
import { LyraStaking } from '@/app/utils/rewards/fetchLyraStaking'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

type Props = {
  latestRewardEpochs: LatestRewardEpoch[]
  vaults: Vault[]
  lyraBalances: LyraBalances
  lyraStaking: LyraStaking
  referredTraders: NewTradingRewardsReferredTraders
}

const RewardsIndexPageHelper = ({ latestRewardEpochs, vaults, lyraBalances, lyraStaking, referredTraders }: Props) => {
  return (
    <Page title="Rewards" subtitle="Stake, deposit and refer" headerCard={<TotalSupplyHeaderCard />}>
      <PageGrid>
        <RewardsLastUpdatedAlert latestRewardEpochs={latestRewardEpochs} />
        <Box>
          <Text mb={2} variant="heading">
            Staking
          </Text>
          <Text color="secondaryText">
            Stake LYRA to earn staking rewards and boost your trading and vault rewards.
          </Text>
        </Box>
        <RewardsStakingCard
          latestRewardEpochs={latestRewardEpochs}
          lyraBalances={lyraBalances}
          lyraStaking={lyraStaking}
        />
        <Box mt={4}>
          <Text mb={2} variant="heading">
            Vaults
          </Text>
          <Text color="secondaryText">Deposit stablecoins to vaults to earn trading fees and rewards.</Text>
        </Box>
        <RewardsVaultsSection vaults={vaults} />
        <Box mt={4}>
          <Text mb={2} variant="heading">
            Referrals
          </Text>
          <Text color="secondaryText">Refer traders to earn a share of their trading fees.</Text>
        </Box>
        <RewardsReferralsSection referredTraders={referredTraders} />
        <Box mt={4}>
          <Text mb={2} variant="heading">
            ETH-LYRA LP
          </Text>
          <Text color="secondaryText">Provide liquidity to ETH-LYRA Uniswap pools to earn rewards.</Text>
        </Box>
        <RewardsWethLyraLPSection />
      </PageGrid>
    </Page>
  )
}

export default RewardsIndexPageHelper

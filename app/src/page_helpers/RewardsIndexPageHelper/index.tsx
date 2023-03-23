import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { AccountLyraBalances, LyraStakingAccount } from '@lyrafinance/lyra-js'
import React from 'react'

import RewardPageHeader from '@/app/containers/rewards/RewardsPageHeader'
import RewardsLastUpdatedAlert from '@/app/containers/rewards_index/RewardsLastUpdatedAlert'
import RewardsShortsSection from '@/app/containers/rewards_index/RewardsShortsSection'
import RewardsStakingCard from '@/app/containers/rewards_index/RewardsStakingCard'
import RewardsTradingSection from '@/app/containers/rewards_index/RewardsTradingSection'
import RewardsVaultsSection from '@/app/containers/rewards_index/RewardsVaultsSection'
import RewardsWethLyraLPSection from '@/app/containers/rewards_index/RewardsWethLyraLPSection'
import { LatestRewardEpoch } from '@/app/hooks/rewards/useLatestRewardEpoch'
import { CamelotStaking } from '@/app/utils/fetchCamelotStaking'
import { VelodromeStaking } from '@/app/utils/fetchVelodromeStaking'
import { ArrakisStaking } from '@/app/utils/rewards/fetchArrakisStaking'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

type Props = {
  latestRewardEpochs: LatestRewardEpoch[]
  lyraBalances: AccountLyraBalances
  lyraStakingAccount: LyraStakingAccount | null
  arrakisStaking: ArrakisStaking | null
  camelotStaking: CamelotStaking | null
  velodromeStaking: VelodromeStaking | null
}

const RewardsIndexPageHelper = ({
  latestRewardEpochs,
  arrakisStaking,
  camelotStaking,
  velodromeStaking,
  lyraBalances,
  lyraStakingAccount,
}: Props) => {
  const isMobile = useIsMobile()

  return (
    <Page noHeaderPadding header={!isMobile ? <RewardPageHeader showBackButton={false} /> : null}>
      <PageGrid>
        {isMobile ? <RewardPageHeader showBackButton={false} /> : null}
        <RewardsLastUpdatedAlert latestRewardEpochs={latestRewardEpochs} />
        <RewardsStakingCard
          latestRewardEpochs={latestRewardEpochs}
          lyraBalances={lyraBalances}
          lyraStakingAccount={lyraStakingAccount}
        />
        <RewardsVaultsSection latestRewardEpochs={latestRewardEpochs} />
        <RewardsTradingSection latestRewardEpochs={latestRewardEpochs} lyraBalances={lyraBalances} />
        <RewardsShortsSection latestRewardEpochs={latestRewardEpochs} />
        <RewardsWethLyraLPSection
          arrakisStaking={arrakisStaking}
          camelotStaking={camelotStaking}
          velodromeStaking={velodromeStaking}
        />
      </PageGrid>
    </Page>
  )
}

export default RewardsIndexPageHelper

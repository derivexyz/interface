import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { AccountLyraBalances, LyraStakingAccount } from '@lyrafinance/lyra-js'
import { LyraStaking } from '@lyrafinance/lyra-js'
import React from 'react'

import { Vault } from '@/app/constants/vault'
import RewardPageHeader from '@/app/containers/rewards/RewardsPageHeader'
import RewardsLastUpdatedAlert from '@/app/containers/rewards_index/RewardsLastUpdatedAlert'
import RewardsStakingCard from '@/app/containers/rewards_index/RewardsStakingCard'
import RewardsTradingSection from '@/app/containers/rewards_index/RewardsTradingSection'
import RewardsVaultsSection from '@/app/containers/rewards_index/RewardsVaultsSection'
import RewardsWethLyraLPSection from '@/app/containers/rewards_index/RewardsWethLyraLPSection'
import { LatestRewardEpoch } from '@/app/hooks/rewards/useRewardsPageData'
import { CamelotStaking } from '@/app/utils/fetchCamelotStaking'
import { VelodromeStaking } from '@/app/utils/fetchVelodromeStaking'
import { ArrakisStaking } from '@/app/utils/rewards/fetchArrakisStaking'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

type Props = {
  latestRewardEpochs: LatestRewardEpoch[]
  vaults: Vault[]
  lyraBalances: AccountLyraBalances
  lyraStaking: LyraStaking
  lyraStakingAccount: LyraStakingAccount | null
  arrakisStaking: ArrakisStaking | null
  camelotStaking: CamelotStaking | null
  velodromeStaking: VelodromeStaking | null
}

const RewardsIndexPageHelper = ({
  latestRewardEpochs,
  vaults,
  arrakisStaking,
  camelotStaking,
  velodromeStaking,
  lyraBalances,
  lyraStaking,
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
          lyraStaking={lyraStaking}
          lyraStakingAccount={lyraStakingAccount}
        />
        <RewardsVaultsSection vaults={vaults} />
        <RewardsTradingSection latestRewardEpochs={latestRewardEpochs} />
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

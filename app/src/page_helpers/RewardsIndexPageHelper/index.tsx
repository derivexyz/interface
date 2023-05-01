import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { NewTradingRewardsReferredTraders } from '@lyrafinance/lyra-js/src/utils/fetchAccountRewardEpochData'
import React from 'react'

import { Vault } from '@/app/constants/vault'
import RewardPageHeader from '@/app/containers/rewards/RewardsPageHeader'
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
        />
        <RewardsVaultsSection vaults={vaults} />
        <RewardsReferralsSection referredTraders={referredTraders} />
        <RewardsWethLyraLPSection />
      </PageGrid>
    </Page>
  )
}

export default RewardsIndexPageHelper

import Box from '@lyra/ui/components/Box'
import { CardElement } from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Grid from '@lyra/ui/components/Grid'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatBalance from '@lyra/ui/utils/formatBalance'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import React, { useState } from 'react'
import { useMemo } from 'react'

import LabelItem from '@/app/components/common/LabelItem'
import { AppNetwork } from '@/app/constants/networks'
import RewardsUnstakeModal from '@/app/containers/earn_index/RewardsUnstakeModal'
import { LatestRewardEpoch } from '@/app/hooks/rewards/useRewardsPageData'
import { LyraBalances } from '@/app/utils/common/fetchLyraBalances'
import { getStkLyraBalanceForNetwork } from '@/app/utils/common/getLyraBalanceForNetwork'
import { LyraStaking } from '@/app/utils/rewards/fetchLyraStaking'

import RewardsStakeModal from '../RewardsStakeModal'
import RewardsStakingClaimModal from '../RewardsStakingClaimModal'
import RewardsStakedCardSectionButton from './RewardsStakedCardSectionButton'

type Props = {
  latestRewardEpochs: LatestRewardEpoch[]
  lyraBalances: LyraBalances
  lyraStaking: LyraStaking
} & MarginProps

const RewardsStakedCardSection = ({
  latestRewardEpochs,
  lyraBalances,
  lyraStaking,
  ...marginProps
}: Props): CardElement => {
  const [isUnstakeOpen, setIsUnstakeOpen] = useState(false)
  const [isStakeOpen, setIsStakeOpen] = useState(false)
  const [isClaimOpen, setIsClaimOpen] = useState(false)
  const isMobile = useIsMobile()

  const balance = useMemo(() => {
    return getStkLyraBalanceForNetwork(lyraBalances, AppNetwork.Ethereum)
  }, [lyraBalances])

  return (
    <CardSection
      justifyContent="space-between"
      isHorizontal={isMobile ? false : true}
      width={!isMobile ? `50%` : undefined}
      {...marginProps}
    >
      <Box flexDirection="column">
        <Text variant="cardHeading">Staked</Text>
        <Text variant="cardHeading" color={balance === 0 ? 'secondaryText' : 'primaryText'}>
          {formatBalance({ balance, symbol: 'stkLYRA', decimals: 18 })}
        </Text>
      </Box>
      <Grid my={8} sx={{ gridTemplateColumns: '1fr 1fr', gridColumnGap: 4 }}>
        <LabelItem label="Claimable Rewards" value={`${formatNumber(lyraStaking.claimableRewards)} stkLYRA`} />
        <LabelItem label="APY" value={formatPercentage(lyraStaking.apy, true)} />
      </Grid>
      <RewardsStakedCardSectionButton
        lyraStaking={lyraStaking}
        onStakeOpen={() => setIsStakeOpen(true)}
        onUnstakeOpen={() => setIsUnstakeOpen(true)}
        onClaim={() => setIsClaimOpen(true)}
      />
      <RewardsUnstakeModal
        isOpen={isUnstakeOpen}
        onClose={() => setIsUnstakeOpen(false)}
        globalRewardEpoch={latestRewardEpochs[0].global}
        lyraBalances={lyraBalances}
        lyraStaking={lyraStaking}
      />
      <RewardsStakeModal isOpen={isStakeOpen} onClose={() => setIsStakeOpen(false)} lyraStaking={lyraStaking} />
      <RewardsStakingClaimModal isOpen={isClaimOpen} onClose={() => setIsClaimOpen(false)} lyraStaking={lyraStaking} />
    </CardSection>
  )
}

export default RewardsStakedCardSection

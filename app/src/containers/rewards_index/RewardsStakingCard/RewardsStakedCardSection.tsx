import Button from '@lyra/ui/components/Button'
import { CardElement } from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Flex from '@lyra/ui/components/Flex'
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
import RewardsBridgeModal from '@/app/components/rewards/RewardsBridgeModal.tsx'
import { AppNetwork } from '@/app/constants/networks'
import RewardsUnstakeModal from '@/app/containers/rewards_index/RewardsUnstakeModal'
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
  const [isBridgeOpen, setIsBridgeOpen] = useState(false)
  const isMobile = useIsMobile()

  const { l2Balance, balance } = useMemo(() => {
    const l2Balance = [AppNetwork.Arbitrum, AppNetwork.Optimism].reduce(
      (sum, network) => sum + getStkLyraBalanceForNetwork(lyraBalances, network),
      0
    )
    const balance = l2Balance + getStkLyraBalanceForNetwork(lyraBalances, AppNetwork.Ethereum)
    return {
      l2Balance,
      balance,
    }
  }, [lyraBalances])

  return (
    <CardSection
      justifyContent="space-between"
      isHorizontal={isMobile ? false : true}
      width={!isMobile ? `50%` : undefined}
      {...marginProps}
    >
      <Grid sx={{ gridTemplateColumns: '2fr 1fr' }}>
        <Flex flexDirection="column">
          <Text variant="heading" mb={2}>
            Staked
          </Text>
          <Text
            variant="heading"
            color={balance === 0 ? 'secondaryText' : l2Balance > 0 ? 'warningText' : 'primaryText'}
          >
            {formatBalance({ balance, symbol: 'stkLYRA', decimals: 18 })}
          </Text>
        </Flex>
        {l2Balance > 0 ? (
          <>
            <Button
              maxHeight={56}
              ml="auto"
              label="Bridge"
              size="lg"
              width={160}
              variant="warning"
              onClick={() => setIsBridgeOpen(true)}
            />
            <RewardsBridgeModal
              balances={lyraBalances}
              isOpen={isBridgeOpen}
              onClose={() => setIsBridgeOpen(false)}
              isStkLYRA
            />
          </>
        ) : null}
      </Grid>
      <Grid my={8} sx={{ gridTemplateColumns: '1fr 1fr', gridColumnGap: 4 }}>
        <LabelItem
          textVariant="body"
          label="Claimable Rewards"
          value={`${formatNumber(lyraStaking.claimableRewards)} stkLYRA`}
        />
        <LabelItem textVariant="body" label="APY" value={formatPercentage(lyraStaking.apy, true)} />
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

import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Text from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import { AccountRewardEpoch, RewardEpochTokenAmount } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'

import LabelItem from '@/app/components/common/LabelItem'

import RewardsClaimModalButton from '../RewardsClaimModalButton'

type Props = {
  latestAccountRewardEpoch: AccountRewardEpoch | null
  totalClaimableRewards: RewardEpochTokenAmount[]
  onClickClaim: () => void
}

const EarnVaultsHeaderCard = ({ latestAccountRewardEpoch, totalClaimableRewards, onClickClaim }: Props) => {
  const claimableAmounts = useMemo(() => {
    const amounts = totalClaimableRewards.map(reward => `${formatNumber(reward.amount)} ${reward.symbol.toUpperCase()}`)
    return amounts
  }, [totalClaimableRewards])

  const hasClaimableAmounts = useMemo(
    () => totalClaimableRewards.some(reward => reward.amount > 0),
    [totalClaimableRewards]
  )

  return (
    <Card variant="outline" width="100%" height="100%">
      <CardBody height="100%">
        <Text variant="cardHeading" mb={4}>
          Vault Rewards
        </Text>
        <LabelItem mt="auto" label="Claimable" value={claimableAmounts.join(', ')} />
        <RewardsClaimModalButton
          mt="auto"
          accountRewardEpoch={latestAccountRewardEpoch}
          isDisabled={!hasClaimableAmounts}
          onClick={onClickClaim}
          width={100}
          size="md"
        />
      </CardBody>
    </Card>
  )
}

export default EarnVaultsHeaderCard

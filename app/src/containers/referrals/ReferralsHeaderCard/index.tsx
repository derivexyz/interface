import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatTruncatedNumber from '@lyra/ui/utils/formatTruncatedNumber'
import React, { useMemo, useState } from 'react'

import { ReferralsPageData } from '@/app/hooks/referrals/useReferralsPageData'

import RewardsClaimModal from '../../rewards/RewardsClaimModal'
import RewardsClaimModalButton from '../../rewards/RewardsClaimModalButton'

type Props = {
  data: ReferralsPageData
  showHistoryButton?: boolean
} & MarginProps

const ReferralsHeaderCard = ({ data, ...marginProps }: Props) => {
  const { latestAccountRewardEpoch, latestGlobalRewardEpoch, currentEpochReferredTradersRewards, allReferredTraders } =
    data
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false)
  const claimableRewards = useMemo(() => {
    return Object.values(allReferredTraders)
      .map(referredTrader => referredTrader.tokens)
      .flat()
  }, [allReferredTraders])

  // TODO: @dillon - add in logic in future
  // const claimableAmount = useMemo(
  //   () => claimableRewards.reduce((total, reward) => total + reward.amount, 0),
  //   [claimableRewards]
  // )

  const claimableAmount = 0

  return (
    <Card variant="outline" minWidth={['100%', 360]} sx={{ borderRadius: 'card' }} {...marginProps}>
      <CardBody>
        <Text variant="heading2" mb={2}>
          Referral rewards
        </Text>
        <Text variant="secondary" color="secondaryText" mb={8}>
          Rewards from previous epochs
        </Text>
        <Text variant="secondary" color="text" mb={4}>
          {formatTruncatedNumber(claimableAmount)} stkLYRA
        </Text>
        <RewardsClaimModalButton
          onClick={() => setIsClaimModalOpen(true)}
          accountRewardEpoch={latestAccountRewardEpoch}
          minWidth={100}
          maxWidth={100}
          isDisabled={true} // TODO: @dillon - add in logic in future
          size="md"
        />
        {latestAccountRewardEpoch ? (
          <RewardsClaimModal
            accountRewardEpoch={latestAccountRewardEpoch}
            isOpen={isClaimModalOpen}
            onClose={() => setIsClaimModalOpen(false)}
          />
        ) : null}
      </CardBody>
    </Card>
  )
}
export default ReferralsHeaderCard

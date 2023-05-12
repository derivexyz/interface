import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatTruncatedNumber from '@lyra/ui/utils/formatTruncatedNumber'
import React, { useMemo, useState } from 'react'

import LabelItem from '@/app/components/common/LabelItem'
import { ReferralsPageData } from '@/app/hooks/referrals/useReferralsPageData'

import RewardsClaimModal from '../../rewards/RewardsClaimModal'
import RewardsClaimModalButton from '../../rewards/RewardsClaimModalButton'

type Props = {
  data: ReferralsPageData
  showHistoryButton?: boolean
} & MarginProps

const ReferralsHeaderCard = ({ data }: Props) => {
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
    <Card variant="outline" width="100%" height="100%">
      <CardBody height="100%">
        <Text variant="cardHeading" mb={2}>
          Referral rewards
        </Text>
        <LabelItem
          mt="auto"
          label="Rewards from previous epochs"
          value={`${formatTruncatedNumber(claimableAmount)} LYRA`}
        />
        <RewardsClaimModalButton
          mt="auto"
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

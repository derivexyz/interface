import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import formatTruncatedNumber from '@lyra/ui/utils/formatTruncatedNumber'
import { AccountRewardEpoch, GlobalRewardEpoch } from '@lyrafinance/lyra-js'
import React, { useMemo, useState } from 'react'

import LabelItem from '@/app/components/common/LabelItem'
import { PageId } from '@/app/constants/pages'
import getPagePath from '@/app/utils/getPagePath'

import RewardsClaimModal from '../../earn/RewardsClaimModal'
import RewardsClaimModalButton from '../../earn/RewardsClaimModalButton'

type Props = {
  latestAccountRewardEpoch?: AccountRewardEpoch
  latestGlobalRewardEpoch: GlobalRewardEpoch
}

const LeaderboardHeaderCard = ({ latestGlobalRewardEpoch, latestAccountRewardEpoch }: Props) => {
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false)
  const claimableRewards = latestAccountRewardEpoch?.totalClaimableTradingRewards.length
    ? latestAccountRewardEpoch.totalClaimableTradingRewards
    : latestGlobalRewardEpoch.tradingRewardTokens.map(t => ({ ...t, amount: 0 }))

  const claimableAmount = useMemo(
    () => claimableRewards.reduce((total, reward) => total + reward.amount, 0),
    [claimableRewards]
  )

  return (
    <Card variant="outline" width="100%" height="100%">
      <CardBody justifyContent="center" height="100%">
        <Text variant="cardHeading">Trading Rewards</Text>
        <LabelItem
          mt="auto"
          label="Rewards from previous epochs"
          value={claimableRewards
            .map(rewards => `${formatTruncatedNumber(rewards.amount)} ${rewards.symbol}`)
            .join(', ')}
          valueColor={claimableAmount > 0 ? 'primaryText' : 'text'}
        />
        <Flex mt="auto" flexDirection="row" justifyContent="space-between">
          <RewardsClaimModalButton
            onClick={() => setIsClaimModalOpen(true)}
            accountRewardEpoch={latestAccountRewardEpoch}
            minWidth={100}
            isDisabled={claimableAmount === 0}
            size="md"
          />
          <Button
            label="History"
            href={getPagePath({ page: PageId.LeaderboardHistory })}
            size="md"
            px={4}
            rightIcon={IconType.ArrowRight}
          />
        </Flex>
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
export default LeaderboardHeaderCard

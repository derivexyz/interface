import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatTruncatedNumber from '@lyra/ui/utils/formatTruncatedNumber'
import { AccountRewardEpoch, GlobalRewardEpoch } from '@lyrafinance/lyra-js'
import React, { useMemo, useState } from 'react'

import { PageId } from '@/app/constants/pages'
import getPagePath from '@/app/utils/getPagePath'

import RewardsClaimModal from '../../rewards/RewardsClaimModal'
import RewardsClaimModalButton from '../../rewards/RewardsClaimModalButton'

type Props = {
  latestAccountRewardEpoch?: AccountRewardEpoch
  latestGlobalRewardEpoch: GlobalRewardEpoch
  showHistoryButton?: boolean
} & MarginProps

const LeaderboardHeaderCard = ({
  latestGlobalRewardEpoch,
  latestAccountRewardEpoch,
  showHistoryButton = true,
  ...styleProps
}: Props) => {
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false)
  const claimableRewards = latestAccountRewardEpoch?.totalClaimableTradingRewards.length
    ? latestAccountRewardEpoch.totalClaimableTradingRewards
    : latestGlobalRewardEpoch.tradingRewardTokens.map(t => ({ ...t, amount: 0 }))

  const claimableAmount = useMemo(
    () => claimableRewards.reduce((total, reward) => total + reward.amount, 0),
    [claimableRewards]
  )

  return (
    <Card variant="outline" minWidth={['100%', 360]} sx={{ borderRadius: 'card' }} {...styleProps}>
      <CardBody>
        <Text variant="heading" mb={4}>
          Trading Rewards
        </Text>
        <Text variant="secondary" color="secondaryText" mb={4}>
          Rewards from previous epochs
        </Text>
        {claimableAmount > 0 ? (
          <Text variant="secondary" color="primaryText" mb={4}>
            {formatTruncatedNumber(claimableAmount)} {claimableRewards[0].symbol.toUpperCase()}
          </Text>
        ) : null}
        <Flex flexDirection="row" justifyContent="space-between">
          <RewardsClaimModalButton
            onClick={() => setIsClaimModalOpen(true)}
            accountRewardEpoch={latestAccountRewardEpoch}
            minWidth={100}
            isDisabled={claimableAmount === 0}
            size="md"
          />
          {showHistoryButton ? (
            <Button
              label="History"
              href={getPagePath({ page: PageId.LeaderboardHistory })}
              size="md"
              px={4}
              rightIcon={IconType.ArrowRight}
            />
          ) : null}
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

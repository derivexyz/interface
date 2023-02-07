import Box from '@lyra/ui/components/Box'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Spinner from '@lyra/ui/components/Spinner'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'

import RowItem from '@/app/components/common/RowItem'
import TokenAmountText from '@/app/components/common/TokenAmountText'
import withSuspense from '@/app/hooks/data/withSuspense'
import useClaimableBalancesL1 from '@/app/hooks/rewards/useClaimableBalanceL1'

type Props = MarginProps

const ClaimWethLyraStakingRewardsModalContent = withSuspense(
  ({ ...styleProps }: Props) => {
    const claimableBalances = useClaimableBalancesL1()
    return (
      <Box {...styleProps}>
        {claimableBalances.lyra.gt(0) ? (
          <Card variant="nested" mb={6}>
            <CardBody>
              <RowItem
                label="Lyra Rewards"
                value={<TokenAmountText tokenNameOrAddress="lyra" amount={claimableBalances.lyra} />}
              />
            </CardBody>
          </Card>
        ) : null}
      </Box>
    )
  },
  () => <Spinner />
)

export default ClaimWethLyraStakingRewardsModalContent

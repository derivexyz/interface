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

const ClaimStakingRewardsModalContent = withSuspense(
  ({ ...styleProps }: Props) => {
    const claimableBalances = useClaimableBalancesL1()
    return (
      <Box {...styleProps} mb={4}>
        {claimableBalances.newStkLyra.gt(0) ? (
          <Card variant="nested">
            <CardBody>
              <RowItem
                label="stkLyra Rewards"
                value={<TokenAmountText tokenNameOrAddress="stkLyra" amount={claimableBalances.newStkLyra} />}
              />
            </CardBody>
          </Card>
        ) : null}
      </Box>
    )
  },
  () => <Spinner />
)

export default ClaimStakingRewardsModalContent

import Box from '@lyra/ui/components/Box'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Checkbox from '@lyra/ui/components/Input/Checkbox'
import Spinner from '@lyra/ui/components/Spinner'
import React from 'react'

import RowItem from '@/app/components/common/RowItem'
import TokenAmountText from '@/app/components/common/TokenAmountText'
import withSuspense from '@/app/hooks/data/withSuspense'
import useClaimableBalancesL1 from '@/app/hooks/rewards/useClaimableBalanceL1'

type Props = {
  isNewStkLyraChecked: boolean
  onClickStkLyra: () => void
}

const ClaimStakingRewardsModalContent = withSuspense(
  ({ isNewStkLyraChecked, onClickStkLyra }: Props) => {
    const claimableBalances = useClaimableBalancesL1()
    return (
      <Box>
        {claimableBalances.newStkLyra.gt(0) ? (
          <Card
            variant="nested"
            mb={6}
            onClick={onClickStkLyra}
            sx={{
              cursor: 'pointer',
              ':hover': { bg: 'active' },
            }}
          >
            <CardBody>
              <RowItem
                mb={3}
                label="stkLyra Rewards"
                value={<TokenAmountText tokenNameOrAddress="lyra" amount={claimableBalances.newStkLyra} mt={4} />}
                textVariant="small"
              />
              <Checkbox checked={isNewStkLyraChecked} onToggle={onClickStkLyra} />
            </CardBody>
          </Card>
        ) : null}
      </Box>
    )
  },
  () => <Spinner />
)

export default ClaimStakingRewardsModalContent

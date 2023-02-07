import Box from '@lyra/ui/components/Box'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import Checkbox from '@lyra/ui/components/Input/Checkbox'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import React from 'react'

import TokenAmountText from '@/app/components/common/TokenAmountText'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAccountWethLyraStakingL2 from '@/app/hooks/rewards/useAccountWethLyraStakingL2'
import useClaimableBalances from '@/app/hooks/rewards/useClaimableBalance'

type Props = {
  isOpChecked: boolean
  isOldStkLyraChecked: boolean
  isNewStkLyraChecked: boolean
  isWethLyraChecked: boolean
  onClickOp: () => void
  onClickNewStkLyra: () => void
  onClickWethLyra: () => void
  onClickOldStkLyra: () => void
}

const ClaimModalContent = withSuspense(
  ({
    isOpChecked,
    isOldStkLyraChecked,
    isNewStkLyraChecked,
    isWethLyraChecked,
    onClickNewStkLyra,
    onClickOp,
    onClickOldStkLyra,
    onClickWethLyra,
  }: Props) => {
    const claimableBalances = useClaimableBalances()
    const wethLyraAccount = useAccountWethLyraStakingL2()
    const isDistributorRewardsDisabled = isWethLyraChecked
    const isWethLyraDisabled = isOpChecked || isNewStkLyraChecked || isOldStkLyraChecked
    return (
      <Box>
        {claimableBalances.oldStkLyra.gt(0) ? (
          <Card
            variant="nested"
            mb={6}
            onClick={onClickOldStkLyra}
            sx={{
              cursor: !isDistributorRewardsDisabled ? 'pointer' : null,
              ':hover': { bg: !isDistributorRewardsDisabled ? 'active' : null },
              bg: isDistributorRewardsDisabled ? 'buttonDisabled' : null,
              pointerEvents: isDistributorRewardsDisabled ? 'none' : null,
            }}
          >
            <CardBody>
              <Flex alignItems="center" justifyContent="space-between">
                <Box>
                  <Text variant="secondary" color="secondaryText">
                    Old stkLyra Rewards
                  </Text>
                  <TokenAmountText tokenNameOrAddress="lyra" amount={claimableBalances.oldStkLyra} mt={4} />
                </Box>
                <Checkbox
                  isDisabled={isDistributorRewardsDisabled}
                  checked={isOldStkLyraChecked}
                  onToggle={onClickOldStkLyra}
                />
              </Flex>
            </CardBody>
          </Card>
        ) : null}
        {claimableBalances.newStkLyra.gt(0) ? (
          <Card
            variant="nested"
            mb={6}
            onClick={onClickNewStkLyra}
            sx={{
              cursor: !isDistributorRewardsDisabled ? 'pointer' : null,
              ':hover': { bg: !isDistributorRewardsDisabled ? 'active' : null },
              bg: isDistributorRewardsDisabled ? 'buttonDisabled' : null,
              pointerEvents: isDistributorRewardsDisabled ? 'none' : null,
            }}
          >
            <CardBody>
              <Flex alignItems="center" justifyContent="space-between">
                <Box>
                  <Text variant="secondary" color="secondaryText">
                    New stkLyra Rewards
                  </Text>
                  <TokenAmountText tokenNameOrAddress="stkLyra" amount={claimableBalances.newStkLyra} mt={4} />
                </Box>
                <Checkbox
                  isDisabled={isDistributorRewardsDisabled}
                  checked={isNewStkLyraChecked}
                  onToggle={onClickNewStkLyra}
                />
              </Flex>
            </CardBody>
          </Card>
        ) : null}
        {claimableBalances.op.gt(0) ? (
          <Card
            variant="nested"
            mb={6}
            onClick={onClickOp}
            sx={{
              cursor: !isDistributorRewardsDisabled ? 'pointer' : null,
              ':hover': { bg: !isDistributorRewardsDisabled ? 'active' : null },
              bg: isDistributorRewardsDisabled ? 'buttonDisabled' : null,
              pointerEvents: isDistributorRewardsDisabled ? 'none' : null,
            }}
          >
            <CardBody>
              <Flex alignItems="center" justifyContent="space-between">
                <Box>
                  <Text variant="secondary" color="secondaryText">
                    OP Rewards
                  </Text>
                  <TokenAmountText tokenNameOrAddress="op" amount={claimableBalances.op} mt={4} />
                </Box>
                <Checkbox isDisabled={isDistributorRewardsDisabled} checked={isOpChecked} onToggle={onClickOp} />
              </Flex>
            </CardBody>
          </Card>
        ) : null}
        {wethLyraAccount?.rewards.gt(0) ? (
          <Card
            variant="nested"
            mb={6}
            onClick={onClickWethLyra}
            sx={{
              cursor: !isWethLyraDisabled ? 'pointer' : null,
              ':hover': { bg: !isWethLyraDisabled ? 'active' : null },
              bg: isWethLyraDisabled ? 'buttonDisabled' : null,
              pointerEvents: isWethLyraDisabled ? 'none' : null,
            }}
          >
            <CardBody>
              <Flex alignItems="center" justifyContent="space-between">
                <Box>
                  <Text variant="secondary" color="secondaryText">
                    WETH-LYRA Rewards
                  </Text>
                  <TokenAmountText tokenNameOrAddress="lyra" amount={wethLyraAccount.rewards} mt={4} />
                </Box>
                <Checkbox isDisabled={isWethLyraDisabled} checked={isWethLyraChecked} onToggle={onClickWethLyra} />
              </Flex>
            </CardBody>
          </Card>
        ) : null}
      </Box>
    )
  },
  () => <Spinner />
)

export default ClaimModalContent

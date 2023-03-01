import Box from '@lyra/ui/components/Box'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import Checkbox from '@lyra/ui/components/Input/Checkbox'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import { Network } from '@lyrafinance/lyra-js'
import React from 'react'

import TokenAmountText from '@/app/components/common/TokenAmountText'
import useNetwork from '@/app/hooks/account/useNetwork'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAccountWethLyraStakingL2 from '@/app/hooks/rewards/useAccountWethLyraStakingL2'
import useClaimableBalances from '@/app/hooks/rewards/useClaimableBalance'

type Props = {
  isLyraChecked: boolean
  isOpChecked: boolean
  isOldStkLyraChecked: boolean
  isNewStkLyraChecked: boolean
  isWethLyraChecked: boolean
  onClickLyra: () => void
  onClickOp: () => void
  onClickNewStkLyra: () => void
  onClickWethLyra: () => void
  onClickOldStkLyra: () => void
}

const ClaimModalContent = withSuspense(
  ({
    isLyraChecked,
    isOpChecked,
    isOldStkLyraChecked,
    isNewStkLyraChecked,
    isWethLyraChecked,
    onClickLyra,
    onClickNewStkLyra,
    onClickOp,
    onClickOldStkLyra,
    onClickWethLyra,
  }: Props) => {
    const network = useNetwork()
    const claimableBalances = useClaimableBalances()
    const wethLyraAccount = useAccountWethLyraStakingL2()
    const isDistributorRewardsDisabled = isWethLyraChecked
    const isWethLyraDisabled = isOpChecked || isNewStkLyraChecked || isOldStkLyraChecked
    return (
      <Box>
        {network === Network.Optimism && claimableBalances.oldStkLyra.gt(0) ? (
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
                    Old stkLYRA Rewards
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
        {claimableBalances.lyra.gt(0) ? (
          <Card
            variant="nested"
            mb={6}
            onClick={onClickLyra}
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
                    LYRA Rewards
                  </Text>
                  <TokenAmountText tokenNameOrAddress="lyra" amount={claimableBalances.lyra} mt={4} />
                </Box>
                <Checkbox isDisabled={isDistributorRewardsDisabled} checked={isLyraChecked} onToggle={onClickLyra} />
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
                    New stkLYRA Rewards
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
        {network === Network.Optimism && claimableBalances.op.gt(0) ? (
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
        {network === Network.Optimism && wethLyraAccount?.rewards.gt(0) ? (
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

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
import useAccountWethLyraStaking from '@/app/hooks/rewards/useAccountWethLyraStaking'
import useClaimableBalances from '@/app/hooks/rewards/useClaimableBalance'

type Props = {
  isOpChecked: boolean
  isStkLyraChecked: boolean
  isWethLyraChecked: boolean
  onClickOp: () => void
  onClickStkLyra: () => void
  onClickWethLyra: () => void
}

const ClaimModalContent = withSuspense(
  ({ isOpChecked, isStkLyraChecked, isWethLyraChecked, onClickStkLyra, onClickOp, onClickWethLyra }: Props) => {
    const claimableBalances = useClaimableBalances()
    const wethLyraAccount = useAccountWethLyraStaking()
    const isOpAndStkLyraDisabled = isWethLyraChecked
    const isWethLyraDisabled = isOpChecked || isStkLyraChecked
    return (
      <Box>
        {claimableBalances.lyra.gt(0) ? (
          <Card
            variant="nested"
            mb={6}
            onClick={onClickStkLyra}
            sx={{
              cursor: !isOpAndStkLyraDisabled ? 'pointer' : null,
              ':hover': { bg: !isOpAndStkLyraDisabled ? 'active' : null },
              bg: isOpAndStkLyraDisabled ? 'buttonDisabled' : null,
              pointerEvents: isOpAndStkLyraDisabled ? 'none' : null,
            }}
          >
            <CardBody>
              <Flex alignItems="center" justifyContent="space-between">
                <Box>
                  <Text variant="secondary" color="secondaryText">
                    stkLyra Rewards
                  </Text>
                  <TokenAmountText tokenNameOrAddress="stkLyra" amount={claimableBalances.lyra} mt={4} />
                </Box>
                <Checkbox isDisabled={isOpAndStkLyraDisabled} checked={isStkLyraChecked} onToggle={onClickStkLyra} />
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
              cursor: !isOpAndStkLyraDisabled ? 'pointer' : null,
              ':hover': { bg: !isOpAndStkLyraDisabled ? 'active' : null },
              bg: isOpAndStkLyraDisabled ? 'buttonDisabled' : null,
              pointerEvents: isOpAndStkLyraDisabled ? 'none' : null,
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
                <Checkbox isDisabled={isOpAndStkLyraDisabled} checked={isOpChecked} onToggle={onClickOp} />
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

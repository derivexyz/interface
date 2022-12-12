import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import { CardElement } from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Grid from '@lyra/ui/components/Grid'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatNumber from '@lyra/ui/utils/formatNumber'
import React, { useState } from 'react'

import TokenAmountText from '@/app/components/common/TokenAmountText'
import TokenAmountTextShimmer from '@/app/components/common/TokenAmountText/TokenAmountTextShimmer'
import { ZERO_BN } from '@/app/constants/bn'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAccountWethLyraStaking from '@/app/hooks/rewards/useAccountWethLyraStaking'
import useClaimableBalances from '@/app/hooks/rewards/useClaimableBalance'

import ClaimModal from '../ClaimModal'

type Props = MarginProps

const ClaimableStakedLyraText = withSuspense(
  (): CardElement => {
    const claimableBalance = useClaimableBalances()
    return (
      <Text variant="heading" color={claimableBalance.stkLyra.gt(0) ? 'primaryText' : 'secondaryText'}>
        {formatNumber(claimableBalance.stkLyra)} stkLYRA
      </Text>
    )
  },
  () => <TextShimmer variant="heading" />
)

const ClaimableRewardsText = withSuspense(
  () => {
    const claimableBalance = useClaimableBalances()
    const wethLyraAccount = useAccountWethLyraStaking()
    const claimableLyra = claimableBalance.lyra.add(wethLyraAccount?.rewards ?? ZERO_BN)
    return (
      <>
        {claimableLyra.gt(0) ? (
          <Box flexGrow={1}>
            <Text variant="secondary" color="secondaryText" mb={2}>
              Claimable LYRA
            </Text>
            <TokenAmountText variant="secondary" tokenNameOrAddress="lyra" amount={claimableLyra} />
          </Box>
        ) : null}
        <Box flexGrow={1}>
          <Text variant="secondary" color="secondaryText" mb={2}>
            Claimable OP
          </Text>
          <TokenAmountText variant="secondary" tokenNameOrAddress="op" amount={claimableBalance.op} />
        </Box>
      </>
    )
  },
  () => (
    <Box>
      <TextShimmer mb={2} variant="secondary" />
      <TokenAmountTextShimmer variant="secondary" width={150} />
    </Box>
  )
)

const OpenClaimModalButton = withSuspense(
  ({ onClick }: { onClick: () => void }) => {
    const claimableBalance = useClaimableBalances()
    const wethLyraAccount = useAccountWethLyraStaking()
    return (
      <Button
        size="lg"
        label="Claim"
        variant="primary"
        onClick={onClick}
        isDisabled={
          claimableBalance.stkLyra.isZero() &&
          claimableBalance.lyra.isZero() &&
          claimableBalance.op.isZero() &&
          wethLyraAccount?.rewards.isZero()
        }
      />
    )
  },
  () => <ButtonShimmer width="100%" size="lg" />
)

const ClaimableRewardsCardSection = ({ ...marginProps }: Props): CardElement => {
  const isMobile = useIsMobile()
  const [isClaimOpen, setIsClaimOpen] = useState(false)
  return (
    <>
      <CardSection
        justifyContent="space-between"
        isHorizontal={!isMobile}
        isVertical
        width={!isMobile ? '50%' : undefined}
        {...marginProps}
      >
        <Box>
          <Text variant="heading" mb={1}>
            Claimable
          </Text>
          <ClaimableStakedLyraText />
        </Box>
        <Grid my={8} sx={{ gridTemplateColumns: '1fr 1fr', gridColumnGap: 4 }}>
          <ClaimableRewardsText />
        </Grid>
        <Grid sx={{ gridTemplateColumns: ['1fr', '1fr 1fr'], gridColumnGap: 4, gridRowGap: 4 }}>
          <OpenClaimModalButton onClick={() => setIsClaimOpen(!isClaimOpen)} />
        </Grid>
        <ClaimModal isOpen={isClaimOpen} onClose={() => setIsClaimOpen(false)} />
      </CardSection>
    </>
  )
}

export default ClaimableRewardsCardSection

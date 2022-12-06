import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Grid from '@lyra/ui/components/Grid'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import formatUSD from '@lyra/ui/utils/formatUSD'
import React, { useState } from 'react'

import TokenAmountText from '@/app/components/common/TokenAmountText'
import TokenAmountTextShimmer from '@/app/components/common/TokenAmountText/TokenAmountTextShimmer'
import { ZERO_BN } from '@/app/constants/bn'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAccountWethLyraStaking from '@/app/hooks/rewards/useAccountWethLyraStaking'
import useWethLyraStaking from '@/app/hooks/rewards/useWethLyraStaking'
import fromBigNumber from '@/app/utils/fromBigNumber'

import WethLyraStakeModal from '../WethLyraStakeModal'
import WethLyraUnstakeModal from '../WethLyraUnstakeModal'

const WethLyraRewardsGridItems = withSuspense(
  () => {
    const accountStaking = useAccountWethLyraStaking()
    const wethLyraStaking = useWethLyraStaking()
    return (
      <>
        <Box>
          <Text variant="secondary" color="secondaryText" mb={2}>
            Your Staked LP Tokens
          </Text>
          <Text>
            {formatNumber(accountStaking?.stakedLPTokenBalance ?? 0)}
            {accountStaking?.stakedLPTokenBalance.gt(0)
              ? ` (${formatUSD(
                  fromBigNumber(accountStaking?.stakedLPTokenBalance ?? ZERO_BN) * (wethLyraStaking?.lpTokenValue ?? 0)
                )})`
              : null}
          </Text>
        </Box>
        <Box>
          <Text variant="secondary" color="secondaryText" mb={2}>
            Total Staked
          </Text>
          <Text>{formatTruncatedUSD(wethLyraStaking?.stakedTVL ?? ZERO_BN)}</Text>
        </Box>
        <Box>
          <Text variant="secondary" color="secondaryText" mb={2}>
            APY
          </Text>
          <Text color="primaryText">{formatPercentage(wethLyraStaking?.apy ?? 0, true)}</Text>
        </Box>
        <Box>
          <Text variant="secondary" color="secondaryText" mb={2}>
            LYRA Rewards
          </Text>
          <TokenAmountText tokenNameOrAddress="lyra" variant="secondary" amount={accountStaking?.rewards ?? 0} />
        </Box>
      </>
    )
  },
  () => (
    <Box>
      <TextShimmer variant="secondary" mb={2} />
      <TokenAmountTextShimmer variant="secondary" width={150} />
    </Box>
  )
)

export default function WethLyraStakingRewardsCardSection() {
  const isMobile = useIsMobile()
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false)
  const [isUnstakeModalOpen, setIsUnstakeModalOpen] = useState(false)
  return (
    <CardSection>
      <Text mb={8} variant="heading">
        WETH/LYRA Rewards
      </Text>
      <Grid mb={8} sx={{ gridTemplateColumns: `${isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr 1fr'}`, gridColumnGap: 4 }}>
        <WethLyraRewardsGridItems />
      </Grid>
      <Text mb={8} maxWidth={['100%', '75%']} variant="secondary" color="secondaryText">
        Lyra's WETH/LYRA program rewards WETH/LYRA liquidity providers on the Uniswap v3 pool via Arrakis Finance.
        Liquidity providers earn LYRA tokens which can be claimed at any time.
      </Text>
      <Grid sx={{ gridTemplateColumns: `${isMobile ? '1fr' : '1fr 1fr 1fr 1fr'}`, gridColumnGap: 4 }}>
        <Button
          label="Stake"
          mb={isMobile ? 4 : 0}
          size="lg"
          variant="primary"
          onClick={() => setIsStakeModalOpen(!isStakeModalOpen)}
        />
        <Button label="Unstake" size="lg" onClick={() => setIsUnstakeModalOpen(!isUnstakeModalOpen)} />
      </Grid>
      <WethLyraStakeModal isOpen={isStakeModalOpen} onClose={() => setIsStakeModalOpen(false)} />
      <WethLyraUnstakeModal isOpen={isUnstakeModalOpen} onClose={() => setIsUnstakeModalOpen(false)} />
    </CardSection>
  )
}

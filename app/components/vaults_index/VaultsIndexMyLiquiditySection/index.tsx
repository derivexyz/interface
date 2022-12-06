import Box from '@lyra/ui/components/Box'
import CardSection, { CardSectionElement } from '@lyra/ui/components/Card/CardSection'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import formatUSD from '@lyra/ui/utils/formatUSD'
import React, { useMemo } from 'react'

import { UNIT, ZERO_BN } from '@/app/constants/bn'
import { VaultBalance } from '@/app/hooks/vaults/useVaultBalance'

import LabelItem from '../../common/LabelItem'
import TokenAmountText from '../../common/TokenAmountText'

type Props = {
  vaultBalances: VaultBalance[]
} & MarginProps &
  LayoutProps

const VaultsIndexMyLiquiditySection = ({ vaultBalances, ...styleProps }: Props): CardSectionElement => {
  const isMobile = useIsMobile()
  const totalLiquidityValue = useMemo(
    () =>
      vaultBalances.reduce(
        (sum, { balances: balance, marketLiquidity }) =>
          sum.add(balance.liquidityToken.balance.mul(marketLiquidity.tokenPrice).div(UNIT)),
        ZERO_BN
      ),
    [vaultBalances]
  )
  const totalRewards = useMemo(
    () =>
      vaultBalances.reduce((sum, { myRewards }) => ({ lyra: myRewards.lyra + sum.lyra, op: myRewards.op + sum.op }), {
        lyra: 0,
        op: 0,
      }),
    [vaultBalances]
  )
  const totalPnl = useMemo(() => vaultBalances.reduce((sum, { myPnl }) => sum + myPnl, 0), [vaultBalances])

  return (
    <CardSection {...styleProps}>
      <Box mb={6}>
        <Text variant="heading">My Liquidity</Text>
        <Text variant="heading">{totalLiquidityValue.gt(0) ? formatUSD(totalLiquidityValue) : '-'}</Text>
      </Box>
      <Grid sx={{ gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr 1fr', gap: [3, 6] }}>
        <LabelItem
          label="Profit / Loss"
          value={totalLiquidityValue.isZero() ? '-' : formatTruncatedUSD(totalPnl, { showSign: true })}
          valueColor={totalLiquidityValue.isZero() ? 'secondaryText' : totalPnl > 0 ? 'primaryText' : 'errorText'}
        />
        <Flex flexDirection="column">
          <Text variant="secondary" color="secondaryText" mb={2}>
            Pending Rewards
          </Text>
          <Flex mt="auto">
            <TokenAmountText tokenNameOrAddress="OP" variant="secondary" amount={totalRewards.op} />
          </Flex>
        </Flex>
      </Grid>
    </CardSection>
  )
}

export default VaultsIndexMyLiquiditySection

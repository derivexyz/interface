import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import CardSection, { CardSectionElement } from '@lyra/ui/components/Card/CardSection'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import formatUSD from '@lyra/ui/utils/formatUSD'
import React from 'react'

import formatPercentage from '@/app/../ui/utils/formatPercentage'
import { UNIT } from '@/app/constants/bn'
import { PageId } from '@/app/constants/pages'
import { VaultBalance } from '@/app/hooks/vaults/useVaultBalance'
import getPagePath from '@/app/utils/getPagePath'

import LabelItem from '../../common/LabelItem'
import TokenAmountText from '../../common/TokenAmountText'
import VaultAPYTooltip from '../../common/VaultAPYTooltip'

type Props = {
  vaultBalance: VaultBalance
} & MarginProps &
  LayoutProps

const VaultsMyLiquiditySection = ({ vaultBalance, ...styleProps }: Props): CardSectionElement => {
  const isMobile = useIsMobile()
  const {
    market,
    balances,
    myApy,
    myRewards,
    myApyMultiplier,
    accountRewardEpoch,
    myPnl,
    myPnlPercent,
    marketLiquidity,
  } = vaultBalance
  const stakedLyraBalance = accountRewardEpoch?.stakedLyraBalance ?? 0
  const liquidityValue = balances.liquidityToken.balance.mul(marketLiquidity.tokenPrice).div(UNIT)
  return (
    <CardSection {...styleProps}>
      <Box mb={6}>
        <Text variant="heading">My Liquidity</Text>
        <Text variant="heading">{liquidityValue.isZero() ? '-' : formatUSD(liquidityValue)}</Text>
      </Box>
      <Grid sx={{ gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr', gap: [3, 6] }}>
        <LabelItem
          label="Profit / Loss"
          value={
            liquidityValue.isZero()
              ? '-'
              : `${formatTruncatedUSD(myPnl, { showSign: true })} (${formatPercentage(myPnlPercent)})`
          }
          valueColor={liquidityValue.isZero() ? 'secondaryText' : myPnl > 0 ? 'primaryText' : 'errorText'}
        />
        <LabelItem
          label={`${stakedLyraBalance > 0 ? 'Boosted' : 'My'} APY`}
          value={
            myApy.total > 0 ? (
              <VaultAPYTooltip
                mt="auto"
                alignItems={'center'}
                marketName={market.name}
                opApy={myApy.op}
                lyraApy={myApy.lyra}
                apyMultiplier={myApyMultiplier}
                stakedLyraBalance={stakedLyraBalance}
              >
                <TokenAmountText
                  variant="secondary"
                  color="primaryText"
                  tokenNameOrAddress={['stkLyra', 'OP']}
                  amount={myApy.total}
                  isPercentage
                />
              </VaultAPYTooltip>
            ) : (
              '-'
            )
          }
          valueColor={myApy.total > 0 ? 'text' : 'secondaryText'}
        />
        <LabelItem
          label="Pending Rewards"
          value={<TokenAmountText tokenNameOrAddress="OP" variant="secondary" amount={myRewards.op} />}
        />
        <Flex alignItems={'center'} justifyContent={'flex-start'}>
          <Button
            label="Boost"
            rightIcon={IconType.ArrowRight}
            href={getPagePath({ page: PageId.Rewards })}
            variant="primary"
          />
        </Flex>
      </Grid>
    </CardSection>
  )
}

export default VaultsMyLiquiditySection

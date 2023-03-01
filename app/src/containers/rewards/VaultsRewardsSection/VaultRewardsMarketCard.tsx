import IconButton from '@lyra/ui/components/Button/IconButton'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { AccountRewardEpoch, GlobalRewardEpoch, Market } from '@lyrafinance/lyra-js'
import React from 'react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import MarketImage from '@/app/components/common/MarketImage'
import { ONE_BN, UNIT, ZERO_BN } from '@/app/constants/bn'
import { ChartInterval } from '@/app/constants/chart'
import { REWARDS_CARD_GRID_COLUMN_TEMPLATE } from '@/app/constants/layout'
import { PageId } from '@/app/constants/pages'
import useAccountBalances from '@/app/hooks/account/useAccountBalances'
import withSuspense from '@/app/hooks/data/withSuspense'
import useVaultStats from '@/app/hooks/vaults/useVaultStats'
import formatAPY from '@/app/utils/formatAPY'
import formatAPYRange from '@/app/utils/formatAPYRange'
import formatTokenName from '@/app/utils/formatTokenName'
import getChartIntervalSeconds from '@/app/utils/getChartIntervalSeconds'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'
import getPagePath from '@/app/utils/getPagePath'

type Props = {
  accountRewardEpoch?: AccountRewardEpoch | null
  globalRewardEpoch: GlobalRewardEpoch
  market: Market
}

const VaultYourLiquidityText = withSuspense(
  ({ market }: { market: Market }) => {
    const balances = useAccountBalances(market)
    const vault = useVaultStats(market, getChartIntervalSeconds(ChartInterval.OneDay))
    const liquidityValue = useMemo(
      () => balances.liquidityToken.balance.mul(vault?.liquidity.tokenPrice ?? ONE_BN).div(UNIT),
      [balances, vault]
    )
    return (
      <Text variant="bodyLarge" sx={{ fontWeight: 400 }}>
        {formatUSD(liquidityValue, { minDps: 0 })}
      </Text>
    )
  },
  () => <TextShimmer variant="bodyLarge" width={50} />
)

const VaultAPYText = withSuspense(
  ({ globalRewardEpoch, accountRewardEpoch, market }: Props) => {
    const balances = useAccountBalances(market)
    const minApy = globalRewardEpoch.minVaultApy(market.address)
    const userApy = accountRewardEpoch?.vaultApy(market.address) ?? minApy
    return balances.liquidityToken.balance.isZero() ? (
      <Text variant="bodyLarge" sx={{ fontWeight: 400 }}>
        {formatAPYRange(minApy, globalRewardEpoch.maxVaultApy(market.address), { showSymbol: false })}
      </Text>
    ) : (
      <Text color="primaryText" variant="bodyLarge" sx={{ fontWeight: 400 }}>
        {formatAPY(userApy, { showSymbol: false })}
      </Text>
    )
  },
  () => <TextShimmer variant="bodyLarge" width={50} />
)

const VaultTVLText = withSuspense(
  ({ market }: { market: Market }) => {
    const vault = useVaultStats(market, getChartIntervalSeconds(ChartInterval.OneDay))
    return (
      <Text variant="bodyLarge" sx={{ fontWeight: 400 }}>
        {formatTruncatedUSD(vault?.tvl ?? ZERO_BN)}
      </Text>
    )
  },
  () => <TextShimmer variant="bodyLarge" width={50} />
)

const VaultRewardsMarketCard = ({ accountRewardEpoch, globalRewardEpoch, market }: Props) => {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  return (
    <Card
      mb={4}
      onClick={() =>
        navigate(
          getPagePath({
            page: PageId.RewardsVaults,
            network: market.lyra.network,
            marketAddressOrName: market.name,
          })
        )
      }
      sx={{
        ':hover': {
          bg: 'cardNestedHover',
          cursor: 'pointer',
        },
        ':active': {
          bg: 'active',
          cursor: 'pointer',
        },
      }}
    >
      <CardBody>
        <Grid
          width="100%"
          sx={{
            gridTemplateColumns: REWARDS_CARD_GRID_COLUMN_TEMPLATE,
            gridColumnGap: 4,
            gridRowGap: 6,
            alignItems: 'center',
          }}
        >
          <Flex alignItems="center">
            <MarketImage market={market} />
            <Text ml={2} variant="bodyLarge" sx={{ fontWeight: 400 }}>
              {formatTokenName(market.baseToken)} · {getNetworkDisplayName(market.lyra.network)}
            </Text>
          </Flex>
          {!isMobile ? (
            <>
              <Flex>
                <Text mr={2} color="secondaryText" variant="bodyLarge" sx={{ fontWeight: 400 }}>
                  TVL
                </Text>
                <VaultTVLText market={market} />
              </Flex>
              <Flex>
                <Text mr={2} color="secondaryText" variant="bodyLarge" sx={{ fontWeight: 400 }}>
                  Your Liquidity
                </Text>
                <VaultYourLiquidityText market={market} />
              </Flex>
              <Flex ml="auto">
                <Text mr={2} color="secondaryText" variant="bodyLarge" sx={{ fontWeight: 400 }}>
                  APY
                </Text>
                <VaultAPYText
                  market={market}
                  globalRewardEpoch={globalRewardEpoch}
                  accountRewardEpoch={accountRewardEpoch}
                />
              </Flex>
            </>
          ) : null}

          <Flex justifySelf="end">
            <IconButton
              icon={IconType.ArrowRight}
              href={getPagePath({
                page: PageId.RewardsVaults,
                network: market.lyra.network,
                marketAddressOrName: market.name,
              })}
            />
          </Flex>
        </Grid>
      </CardBody>
    </Card>
  )
}

export default VaultRewardsMarketCard

import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Grid from '@lyra/ui/components/Grid'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import { Market } from '@lyrafinance/lyra-js'
import React from 'react'

import LabelItem from '@/app/components/common/LabelItem'
import { SECONDS_IN_MONTH } from '@/app/constants/time'
import withSuspense from '@/app/hooks/data/withSuspense'
import useVaultStats from '@/app/hooks/vaults/useVaultStats'

type Props = {
  market: Market
}

const VaultsStatsCard = withSuspense(
  ({ market }: Props) => {
    const vault = useVaultStats(market, SECONDS_IN_MONTH)
    const isMobile = useIsMobile()
    if (!vault) {
      return null
    }

    const isLiquidityData15DOld = market.block.timestamp - vault.liquidityHistory[0].timestamp > SECONDS_IN_MONTH / 2
    const isBoardsLive = vault.market.liveBoards().length > 0

    const { netStdVega, netDelta } = vault.netGreeks
    const { pendingWithdrawals, pendingDeposits, utilization } = vault.liquidity
    const { tokenPriceChangeAnnualized } = vault

    return (
      <Card>
        <CardBody>
          <Text mb={6} variant="heading">
            Stats
          </Text>
          <Grid sx={{ gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr', gridColumnGap: 6, gridRowGap: 6 }}>
            <LabelItem
              label="30D Perf (Annualized)"
              value={isLiquidityData15DOld ? formatPercentage(tokenPriceChangeAnnualized) : 'Not enough data'}
              valueColor="text"
            />
            <LabelItem
              label="Pool Utilization"
              value={isBoardsLive ? formatPercentage(utilization, true) : '-'}
              valueColor="text"
            />
            {isBoardsLive ? (
              <LabelItem label="Pending Deposits" value={formatTruncatedUSD(pendingDeposits)} valueColor="text" />
            ) : null}
            {isBoardsLive ? (
              <LabelItem label="Pending Withdrawals" value={formatTruncatedUSD(pendingWithdrawals)} valueColor="text" />
            ) : null}
            <LabelItem label="Net Delta" value={`${netDelta.gt(0) ? '+' : ''}${formatNumber(netDelta, { dps: 3 })}`} />
            <LabelItem
              label="Net Vega"
              value={`${netStdVega.gt(0) ? '+' : ''}${formatNumber(netStdVega, { dps: 3 })}`}
            />
          </Grid>
        </CardBody>
      </Card>
    )
  },
  () => (
    <Card>
      <CardBody>
        <Text mb={6} variant="heading">
          Stats
        </Text>
        <Center height={[272, 124]}>
          <Spinner />
        </Center>
      </CardBody>
    </Card>
  )
)

export default VaultsStatsCard

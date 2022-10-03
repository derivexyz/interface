import Grid from '@lyra/ui/components/Grid'
import { MarginProps } from '@lyra/ui/types'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import React from 'react'

import LabelItem from '@/app/components/common/LabelItem'
import LabelItemShimmer from '@/app/components/common/LabelItem/LabelItemShimmer'
import { ZERO_BN } from '@/app/constants/bn'
import { CompetitionPool } from '@/app/constants/competition'
import withSuspense from '@/app/hooks/data/withSuspense'
import usePrizePoolRank from '@/app/hooks/position/usePrizePoolRank'
import fromBigNumber from '@/app/utils/fromBigNumber'

type Props = {
  pool: CompetitionPool
} & MarginProps

const CompetitionPrizePoolCardsYourRank = withSuspense(
  ({ pool, ...styleProps }: Props) => {
    const userPrizePoolRank = usePrizePoolRank(pool)
    return userPrizePoolRank ? (
      <Grid sx={{ gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 4 }} {...styleProps}>
        {!pool.isRandom ? (
          <LabelItem label="Rank" value={userPrizePoolRank.rank} />
        ) : (
          <LabelItem label="Status" value={userPrizePoolRank.rank > 0 ? 'Qualified' : 'Not Qualified'} />
        )}
        {!pool.isRandom ? (
          <LabelItem
            label="Profit / Loss"
            value={
              pool.isRankedByPercentage
                ? formatPercentage(fromBigNumber(userPrizePoolRank[pool.rankKey] ?? ZERO_BN))
                : formatUSD(userPrizePoolRank.realizedPnl ?? 0)
            }
          />
        ) : null}
      </Grid>
    ) : (
      <Grid width="100%" sx={{ gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 4 }} {...styleProps}>
        <LabelItem label={pool.isRandom ? 'Status' : 'Rank'} value="Not Qualified" />
        {!pool.isRandom ? (
          <LabelItem label="Profit / Loss" value={pool.isRankedByPercentage ? formatPercentage(0) : formatUSD(0)} />
        ) : null}
      </Grid>
    )
  },
  ({ pool, ...styleProps }: Props) => (
    <Grid sx={{ gridTemplateColumns: 'repeat(2, 1fr)', columnGap: 4 }} {...styleProps}>
      <LabelItemShimmer labelWidth={60} />
    </Grid>
  )
)

export default CompetitionPrizePoolCardsYourRank

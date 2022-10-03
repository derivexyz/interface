import React, { useMemo } from 'react'

import CompetitionBannerCheckCircle from '@/app/components/competition/CompetitionBanner/CompetitionBannerCheckCircle'
import { ZERO_BN } from '@/app/constants/bn'
import { COMPETITION_SEASONS_CONFIG, TRADING_COMP_PREMIUM_THRESHOLD } from '@/app/constants/competition'
import withSuspense from '@/app/hooks/data/withSuspense'
import usePositionHistory from '@/app/hooks/position/usePositionHistory'
import isMarketEqual from '@/app/utils/isMarketEqual'

const CompetitionBannerPremiumsQualification = withSuspense(
  () => {
    const positions = usePositionHistory(true)
    const premiumsTraded = useMemo(
      () =>
        positions
          .filter(
            position =>
              (isMarketEqual(position.market(), 'eth') &&
                position.id > (COMPETITION_SEASONS_CONFIG[0].pools[0].leaderboardFilter?.minPositionIds?.eth ?? 0)) ||
              (isMarketEqual(position.market(), 'btc') &&
                position.id > (COMPETITION_SEASONS_CONFIG[0].pools[0].leaderboardFilter?.minPositionIds?.btc ?? 0))
          )
          .reduce(
            (sum, position) => sum.add(position.trades().reduce((sum, trade) => sum.add(trade.premium), ZERO_BN)),
            ZERO_BN
          ),
      [positions]
    )
    return <CompetitionBannerCheckCircle isChecked={premiumsTraded.gt(TRADING_COMP_PREMIUM_THRESHOLD) ?? false} />
  },
  () => <CompetitionBannerCheckCircle isChecked={false} />
)

export default CompetitionBannerPremiumsQualification

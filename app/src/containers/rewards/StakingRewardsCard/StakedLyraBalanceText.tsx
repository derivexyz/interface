import { CardElement } from '@lyra/ui/components/Card'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import formatBalance from '@lyra/ui/utils/formatBalance'
import React from 'react'

import useAccountLyraBalances from '@/app/hooks/account/useAccountLyraBalances'
import withSuspense from '@/app/hooks/data/withSuspense'

const StakedLyraBalanceText = withSuspense(
  (): CardElement => {
    const lyraBalances = useAccountLyraBalances()
    const optimismOldStkLyra = lyraBalances.optimismOldStkLyra
    const ethereumStkLyra = lyraBalances.ethereumStkLyra
    const optimismStkLyra = lyraBalances.optimismStkLyra
    const arbitrumStkLyra = lyraBalances.arbitrumStkLyra
    const balance = optimismOldStkLyra.add(optimismStkLyra).add(ethereumStkLyra).add(arbitrumStkLyra)
    return (
      <Text variant="heading" color={balance.isZero() ? 'secondaryText' : 'primaryText'}>
        {formatBalance(balance, 'stkLYRA')}
      </Text>
    )
  },
  () => {
    return <TextShimmer variant="heading" />
  }
)

export default StakedLyraBalanceText

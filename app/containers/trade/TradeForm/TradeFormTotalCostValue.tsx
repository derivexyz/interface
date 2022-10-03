import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Trade } from '@lyrafinance/lyra-js'
import React from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import withSuspense from '@/app/hooks/data/withSuspense'
import useBalances from '@/app/hooks/market/useBalances'
import useTradeWithSwap from '@/app/hooks/market/useTradeWithSwap'

type Props = {
  trade: Trade
}

const TradeFormTotalCostValue = withSuspense(
  ({ trade }: Props) => {
    const balances = useBalances()
    const quoteToken = balances.stable(trade.quoteToken.address)
    const tradeWithSwap = useTradeWithSwap(trade, quoteToken.address, quoteToken.decimals)
    const externalSwapFee = tradeWithSwap?.externalSwapFee ?? ZERO_BN
    const premium = tradeWithSwap?.premium ?? ZERO_BN
    const totalCost = trade.isBuy ? premium.add(externalSwapFee) : premium.sub(externalSwapFee)
    return <Text variant="secondary">{totalCost.gt(0) ? formatUSD(totalCost) : '-'}</Text>
  },
  () => <TextShimmer variant="secondary" width={80} />
)

export default TradeFormTotalCostValue

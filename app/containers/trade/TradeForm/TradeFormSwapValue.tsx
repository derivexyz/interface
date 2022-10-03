import Box from '@lyra/ui/components/Box'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import Tooltip from '@lyra/ui/components/Tooltip'
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

const TradeFormSwapValue = withSuspense(
  ({ trade }: Props) => {
    const balances = useBalances()
    const quoteToken = balances.stable(trade.quoteToken.address)
    const tradeWithSwap = useTradeWithSwap(trade, quoteToken.address, quoteToken.decimals)
    const swapFee = tradeWithSwap?.externalSwapFee ?? ZERO_BN
    return (
      <Tooltip
        title="Swap"
        tooltip={
          <Box>
            <Text mb={4} variant="secondary" color="secondaryText">
              Lyra swaps {tradeWithSwap?.isBuy ? `${quoteToken.symbol} to sUSD` : `sUSD to ${quoteToken.symbol}`} via
              Curve to execute this trade.
            </Text>
            <Text variant="secondary" color="secondaryText">
              Swap Fee: {formatUSD(swapFee)}
            </Text>
          </Box>
        }
      >
        <Text variant="small">
          {tradeWithSwap?.isBuy ? `${quoteToken.symbol} → sUSD` : `sUSD → ${quoteToken.symbol}`}
        </Text>
      </Tooltip>
    )
  },
  () => <TextShimmer variant="small" width={60} />
)

export default TradeFormSwapValue

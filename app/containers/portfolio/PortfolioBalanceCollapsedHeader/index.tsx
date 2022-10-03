import withSuspense from '@lyra/app/hooks/data/withSuspense'
import Text from '@lyra/ui/components/Text'
import formatUSD from '@lyra/ui/utils/formatUSD'
import React from 'react'

import usePortfolioBalance from '@/app/hooks/portfolio/usePortfolioBalance'

const PortfolioBalanceCollapsedHeader = withSuspense(() => {
  const { totalValue } = usePortfolioBalance()
  return (
    <Text as="span">
      {/* TODO: @dappbeast Add percentage change */}
      Portfolio {formatUSD(totalValue)}
    </Text>
  )
})

export default PortfolioBalanceCollapsedHeader

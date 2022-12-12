import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import React, { useState } from 'react'

import withSuspense from '@/app/hooks/data/withSuspense'
import useLatestRewardEpochs from '@/app/hooks/rewards/useLatestRewardEpochs'

import FeeRebateModal from '../../common/FeeRebateModal'

const TradeFormFeeRebateValue = withSuspense(
  () => {
    const epochs = useLatestRewardEpochs()
    const global = epochs?.global
    const account = epochs?.account
    const feeRebate = account?.tradingFeeRebate ?? global?.minTradingFeeRebate ?? 0
    const [isOpen, setIsOpen] = useState(false)
    return (
      <>
        <Text
          variant="small"
          color="primaryText"
          onClick={() => setIsOpen(true)}
          sx={{ ':hover': { opacity: 0.5, cursor: 'pointer' } }}
        >
          {formatPercentage(feeRebate, true)}
        </Text>
        <FeeRebateModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    )
  },
  () => <TextShimmer variant="small" width={60} />
)

export default TradeFormFeeRebateValue

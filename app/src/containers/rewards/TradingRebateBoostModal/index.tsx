import Modal from '@lyra/ui/components/Modal'
import ModalBody from '@lyra/ui/components/Modal/ModalBody'
import Text from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import { AccountRewardEpoch, GlobalRewardEpoch } from '@lyrafinance/lyra-js'
import React from 'react'
import { useState } from 'react'
import { useMemo } from 'react'

import RowItem from '@/app/components/common/RowItem'
import { TradingFeeRebateTable } from '@/app/components/rewards/TradingFeeRebateTable'
import { ZERO_BN } from '@/app/constants/bn'

import StakeFormAmountInput from '../StakeModal/StakeFormAmountInput'
import StakeFormButton from '../StakeModal/StakeFormButton'

type Props = {
  isOpen: boolean
  onClose: () => void
  globalRewardEpoch: GlobalRewardEpoch
  accountRewardEpoch?: AccountRewardEpoch | null
}

export default function TradingRebateBoostModal({ isOpen, onClose, globalRewardEpoch, accountRewardEpoch }: Props) {
  const [amount, setAmount] = useState(ZERO_BN)
  const effectiveRebate = accountRewardEpoch?.tradingFeeRebate ?? globalRewardEpoch.tradingFeeRebateTiers[0].feeRebate
  const nextEffectiveRebateTierIdx = useMemo(
    () =>
      Math.min(
        globalRewardEpoch.tradingFeeRebateTiers.findIndex(rebateTier => rebateTier.feeRebate === effectiveRebate) + 1,
        globalRewardEpoch.tradingFeeRebateTiers.length - 1
      ) ?? 1,
    [globalRewardEpoch, effectiveRebate]
  )
  const isMaxFeeRebate = nextEffectiveRebateTierIdx === globalRewardEpoch.tradingFeeRebateTiers.length - 1
  const nextEffectiveRebateTier = globalRewardEpoch.tradingFeeRebateTiers[nextEffectiveRebateTierIdx]
  const stkLyraDiff = nextEffectiveRebateTier.stakedLyraCutoff - (accountRewardEpoch?.stakedLyraBalance ?? 0)
  const lyraBalance = accountRewardEpoch?.lyraBalances.ethereumLyra ?? ZERO_BN
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <Text ml="auto" variant="heading">
          Boost Your Fee Rebate
        </Text>
      }
    >
      <ModalBody>
        <Text color="secondaryText" mb={10}>
          Your are currently receiving a {formatPercentage(effectiveRebate, true)} rebate on your trading fees.{' '}
          {!isMaxFeeRebate
            ? `Stake ${formatNumber(stkLyraDiff)} more LYRA to earn a ${formatPercentage(
                nextEffectiveRebateTier.feeRebate,
                true
              )} rebate.`
            : ''}
        </Text>
        <RowItem
          mb={8}
          label="Amount to Stake"
          value={
            <StakeFormAmountInput
              ml="auto"
              amount={amount}
              onChangeAmount={newAmount => setAmount(newAmount)}
              max={lyraBalance}
            />
          }
        />
        <RowItem mb={8} label="Balance" value={`${formatNumber(lyraBalance)} LYRA`} />
        <TradingFeeRebateTable
          maxHeight={245}
          sx={{ overflow: 'scroll' }}
          feeRebateTiers={globalRewardEpoch.tradingFeeRebateTiers}
          effectiveRebate={effectiveRebate}
        />
        <StakeFormButton mt={6} amount={amount} onClose={onClose} />
      </ModalBody>
    </Modal>
  )
}

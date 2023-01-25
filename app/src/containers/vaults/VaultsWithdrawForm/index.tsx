import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedDuration from '@lyra/ui/utils/formatTruncatedDuration'
import React, { useState } from 'react'

import AmountUpdateText from '@/app/components/common/AmountUpdateText'
import VaultsFormSizeInput from '@/app/components/vaults/VaultsFormSizeInput'
import { ZERO_BN } from '@/app/constants/bn'
import { Vault } from '@/app/constants/vault'
import fromBigNumber from '@/app/utils/fromBigNumber'

import VaultsWithdrawFormButton from './VaultsWithdrawFormButton'

type Props = {
  onClose: () => void
  vault: Vault
} & MarginProps &
  LayoutProps

const VaultsWithdrawForm = ({ vault, onClose, ...styleProps }: Props) => {
  const [amount, setAmount] = useState(ZERO_BN)

  const lpBalance = vault.liquidityToken.balance
  const lpSymbol = vault.liquidityToken.symbol
  const market = vault.market

  return (
    <>
      <CardSection {...styleProps}>
        <Flex alignItems="center" justifyContent="space-between" mb={4}>
          <Text color="secondaryText">Amount</Text>
          <VaultsFormSizeInput amount={amount} max={lpBalance} onChangeAmount={setAmount} />
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          <Text color="secondaryText" variant="secondary">
            Balance
          </Text>
          <AmountUpdateText
            variant="secondary"
            symbol={lpSymbol}
            prevAmount={lpBalance}
            newAmount={lpBalance.sub(amount)}
          />
        </Flex>
      </CardSection>
      <CardSeparator />
      <CardSection>
        <Flex alignItems="center" justifyContent="space-between" mb={4}>
          <Text variant="secondary" color="secondaryText">
            Withdrawal Delay
          </Text>
          <Text variant="secondary">
            {market.liveBoards().length === 0 || market.params.withdrawalDelay === 0
              ? 'Now'
              : formatTruncatedDuration(market.params.withdrawalDelay)}
          </Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" mb={6}>
          <Text variant="secondary" color="secondaryText">
            Withdrawal Fee
          </Text>
          <Text variant="secondary">{formatPercentage(fromBigNumber(market.params.withdrawalFee), true)}</Text>
        </Flex>
        <VaultsWithdrawFormButton vault={vault} amount={amount} onWithdraw={onClose} />
      </CardSection>
    </>
  )
}

export default VaultsWithdrawForm

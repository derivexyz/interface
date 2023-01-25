import Alert from '@lyra/ui/components/Alert'
import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Link from '@lyra/ui/components/Link'
import Text from '@lyra/ui/components/Text'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedDuration from '@lyra/ui/utils/formatTruncatedDuration'
import React, { useState } from 'react'

import AmountUpdateText from '@/app/components/common/AmountUpdateText'
import VaultsFormSizeInput from '@/app/components/vaults/VaultsFormSizeInput'
import { ZERO_BN } from '@/app/constants/bn'
import { WITHDRAW_WARNING_DOC_URL } from '@/app/constants/links'
import { Vault } from '@/app/constants/vault'
import fromBigNumber from '@/app/utils/fromBigNumber'

import VaultsDepositFormButton from './VaultsDepositFormButton'

type Props = {
  vault: Vault
  onClose: () => void
}

const VaultsDepositForm = ({ vault, onClose }: Props) => {
  const [amount, setAmount] = useState(ZERO_BN)

  const { utilization, marketBalances, market } = vault
  const quoteBalance = marketBalances.quoteAsset.balance

  return (
    <>
      <CardSection>
        <Flex alignItems="center" justifyContent="space-between" mb={4}>
          <Text color="secondaryText">Amount</Text>
          <VaultsFormSizeInput amount={amount} max={quoteBalance} onChangeAmount={setAmount} />
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          <Text color="secondaryText" variant="secondary">
            Balance
          </Text>
          <AmountUpdateText
            variant="secondary"
            symbol={market.quoteToken.symbol}
            isUSDFormat
            prevAmount={quoteBalance}
            newAmount={quoteBalance.sub(amount)}
          />
        </Flex>
      </CardSection>
      <CardSeparator />
      <CardSection>
        <Flex alignItems="center" justifyContent="space-between" mb={4}>
          <Text variant="secondary" color="secondaryText">
            Deposit Delay
          </Text>
          <Text variant="secondary">
            {market.liveBoards().length === 0 || market.params.depositDelay === 0
              ? 'None'
              : formatTruncatedDuration(market.params.depositDelay)}
          </Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" mb={4}>
          <Text variant="secondary" color="secondaryText">
            Withdrawal Delay
          </Text>
          <Text variant="secondary">{formatTruncatedDuration(market.params.withdrawalDelay)}</Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" mb={4}>
          <Text variant="secondary" color="secondaryText">
            Withdrawal Fee
          </Text>
          <Text variant="secondary">{formatPercentage(fromBigNumber(market.params.withdrawalFee), true)}</Text>
        </Flex>
        {utilization > 0.9 ? (
          <Alert
            mb={3}
            icon={IconType.AlertTriangle}
            variant="warning"
            title="Disclaimer"
            description={
              <>
                Vault utilization is high, leading to withdrawal delays longer than{' '}
                {formatTruncatedDuration(market.params.withdrawalDelay)}.{' '}
                <Link
                  color="warningText"
                  textVariant="secondary"
                  href={WITHDRAW_WARNING_DOC_URL}
                  target="_blank"
                  showRightIcon
                >
                  Learn more
                </Link>
              </>
            }
          />
        ) : null}
        <VaultsDepositFormButton mt={2} vault={vault} amount={amount} onDeposit={onClose} />
      </CardSection>
    </>
  )
}

export default VaultsDepositForm

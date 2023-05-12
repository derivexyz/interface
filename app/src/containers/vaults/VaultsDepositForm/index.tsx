import Alert from '@lyra/ui/components/Alert'
import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import Link from '@lyra/ui/components/Link'
import Text from '@lyra/ui/components/Text'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedDuration from '@lyra/ui/utils/formatTruncatedDuration'
import React, { useState } from 'react'

import AmountUpdateText from '@/app/components/common/AmountUpdateText'
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
          <BigNumberInput
            width="50%"
            value={amount}
            onChange={setAmount}
            placeholder={ZERO_BN}
            max={quoteBalance}
            decimals={market.quoteToken.decimals}
            min={ZERO_BN}
            textAlign="right"
            showMaxButton
          />
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          <Text color="secondaryText">Balance</Text>
          <AmountUpdateText
            symbol={market.quoteToken.symbol}
            isUSDFormat
            prevAmount={quoteBalance}
            newAmount={quoteBalance.sub(amount)}
            decimals={market.quoteToken.decimals}
          />
        </Flex>
      </CardSection>
      <CardSeparator />
      <CardSection>
        <Flex alignItems="center" justifyContent="space-between" mb={4}>
          <Text color="secondaryText">Deposit Delay</Text>
          <Text>
            {!market.liveBoards().length || !market.params.depositDelay
              ? 'None'
              : formatTruncatedDuration(market.params.depositDelay)}
          </Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" mb={4}>
          <Text color="secondaryText">Withdrawal Delay</Text>
          <Text>{formatTruncatedDuration(market.params.withdrawalDelay)}</Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" mb={4}>
          <Text color="secondaryText">Withdrawal Fee</Text>
          <Text>{formatPercentage(fromBigNumber(market.params.withdrawalFee), true)}</Text>
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
                <Link color="warningText" href={WITHDRAW_WARNING_DOC_URL} target="_blank" showRightIcon>
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

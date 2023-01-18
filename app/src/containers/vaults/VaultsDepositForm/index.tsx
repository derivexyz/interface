import Alert from '@lyra/ui/components/Alert'
import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Link from '@lyra/ui/components/Link'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedDuration from '@lyra/ui/utils/formatTruncatedDuration'
import { Market } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'

import AmountUpdateText from '@/app/components/common/AmountUpdateText'
import VaultsFormSizeInput from '@/app/components/vaults/VaultsFormSizeInput'
import { ZERO_BN } from '@/app/constants/bn'
import { WITHDRAW_WARNING_DOC_URL } from '@/app/constants/links'
import withSuspense from '@/app/hooks/data/withSuspense'
import useVaultBalance from '@/app/hooks/vaults/useVaultBalance'
import fromBigNumber from '@/app/utils/fromBigNumber'

import VaultsDepositFormButton from './VaultsDepositFormButton'

const CARD_SECTION_HEIGHT = 350

type Props = {
  market: Market
  onClose: () => void
}

const VaultsDepositForm = withSuspense(
  ({ market, onClose }: Props) => {
    const vaultBalance = useVaultBalance(market)
    const [amount, setAmount] = useState(ZERO_BN)

    if (!vaultBalance) {
      return null
    }

    const { utilization, marketBalances } = vaultBalance
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
              {market.liveBoards().length === 0 || market.depositDelay === 0
                ? 'None'
                : formatTruncatedDuration(market.depositDelay)}
            </Text>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between" mb={4}>
            <Text variant="secondary" color="secondaryText">
              Withdrawal Delay
            </Text>
            <Text variant="secondary">{formatTruncatedDuration(market.withdrawalDelay)}</Text>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between" mb={4}>
            <Text variant="secondary" color="secondaryText">
              Withdrawal Fee
            </Text>
            <Text variant="secondary">
              {formatPercentage(fromBigNumber(market.__marketData.marketParameters.lpParams.withdrawalFee), true)}
            </Text>
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
                  {formatTruncatedDuration(market.withdrawalDelay)}.{' '}
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
          <VaultsDepositFormButton mt={2} vaultBalance={vaultBalance} amount={amount} onDeposit={onClose} />
        </CardSection>
      </>
    )
  },
  () => (
    <CardSection height={CARD_SECTION_HEIGHT}>
      <Center height="100%" width="100%">
        <Spinner />
      </Center>
    </CardSection>
  )
)

export default VaultsDepositForm

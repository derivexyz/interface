import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedDuration from '@lyra/ui/utils/formatTruncatedDuration'
import React, { useState } from 'react'

import AmountUpdateText from '@/app/components/common/AmountUpdateText'
import VaultsFormSizeInput from '@/app/components/vaults/VaultsFormSizeInput'
import { ZERO_BN } from '@/app/constants/bn'
import withSuspense from '@/app/hooks/data/withSuspense'
import useMarket from '@/app/hooks/market/useMarket'
import useVaultBalance from '@/app/hooks/vaults/useVaultBalance'
import fromBigNumber from '@/app/utils/fromBigNumber'

import VaultsWithdrawFormButton from './VaultsWithdrawFormButton'

type Props = {
  marketAddressOrName: string
} & MarginProps &
  LayoutProps

const VaultsWithdrawForm = withSuspense(
  ({ marketAddressOrName, ...styleProps }: Props) => {
    const market = useMarket(marketAddressOrName)
    const vault = useVaultBalance(marketAddressOrName)
    const lpBalance = vault?.balance.balance ?? ZERO_BN
    const [amount, setAmount] = useState(ZERO_BN)

    if (!market) {
      return null
    }

    return (
      <>
        <CardSection>
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
              symbol="Tokens"
              prevAmount={lpBalance}
              newAmount={lpBalance.sub(amount)}
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
            <Text variant="secondary">
              {market.liveBoards().length === 0 || market.withdrawalDelay === 0
                ? 'Now'
                : formatTruncatedDuration(market.withdrawalDelay)}
            </Text>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between" mb={6}>
            <Text variant="secondary" color="secondaryText">
              Withdrawal Fee
            </Text>
            <Text variant="secondary">
              {formatPercentage(fromBigNumber(market.__marketData.marketParameters.lpParams.withdrawalFee), true)}
            </Text>
          </Flex>
          <VaultsWithdrawFormButton market={market} amount={amount} />
        </CardSection>
      </>
    )
  },
  ({ marketAddressOrName, ...styleProps }: Props) => (
    <CardSection>
      <Center {...styleProps}>
        <Spinner />
      </Center>
    </CardSection>
  )
)

export default VaultsWithdrawForm

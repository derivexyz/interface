import Alert from '@lyra/ui/components/Alert'
import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Link from '@lyra/ui/components/Link'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedDuration from '@lyra/ui/utils/formatTruncatedDuration'
import React, { useState } from 'react'

import AmountUpdateText from '@/app/components/common/AmountUpdateText'
import VaultsFormSizeInput from '@/app/components/vaults/VaultsFormSizeInput'
import { ZERO_BN } from '@/app/constants/bn'
import { WITHDRAW_WARNING_DOC_URL } from '@/app/constants/links'
import withSuspense from '@/app/hooks/data/withSuspense'
import useMarket from '@/app/hooks/market/useMarket'
import useMarketLiquidity from '@/app/hooks/market/useMarketLiquidity'
import useLiquidityDepositBalance from '@/app/hooks/vaults/useLiquidityDepositBalance'
import fromBigNumber from '@/app/utils/fromBigNumber'

import VaultsDepositFormButton from './VaultsDepositFormButton'

type Props = {
  marketAddressOrName: string
} & MarginProps &
  LayoutProps

const VaultsDepositForm = withSuspense(
  ({ marketAddressOrName }: Props) => {
    const market = useMarket(marketAddressOrName)
    const susd = useLiquidityDepositBalance(marketAddressOrName)
    const marketLiquidity = useMarketLiquidity(marketAddressOrName)
    const susdBalance = susd?.balance ?? ZERO_BN
    const [amount, setAmount] = useState(ZERO_BN)

    if (!market) {
      return null
    }

    return (
      <>
        <CardSection>
          <Flex alignItems="center" justifyContent="space-between" mb={4}>
            <Text color="secondaryText">Amount</Text>
            <VaultsFormSizeInput amount={amount} max={susdBalance} onChangeAmount={setAmount} />
          </Flex>
          <Flex alignItems="center" justifyContent="space-between">
            <Text color="secondaryText" variant="secondary">
              Balance
            </Text>
            <AmountUpdateText
              variant="secondary"
              symbol="sUSD"
              isUSDFormat
              prevAmount={susdBalance}
              newAmount={susdBalance.sub(amount)}
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
                ? 'None'
                : formatTruncatedDuration(market.withdrawalDelay)}
            </Text>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between" mb={4}>
            <Text variant="secondary" color="secondaryText">
              Withdrawal Fee
            </Text>
            <Text variant="secondary">
              {formatPercentage(fromBigNumber(market.__marketData.marketParameters.lpParams.withdrawalFee), true)}
            </Text>
          </Flex>
          {marketLiquidity && marketLiquidity.utilization > 0.9 ? (
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
          <VaultsDepositFormButton mt={2} market={market} amount={amount} />
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

export default VaultsDepositForm

import { BigNumber } from '@ethersproject/bignumber'
import Button from '@lyra/ui/components/Button'
import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Center from '@lyra/ui/components/Center'
import Modal from '@lyra/ui/components/Modal'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import formatBalance from '@lyra/ui/utils/formatBalance'
import { Position } from '@lyrafinance/lyra-js'
import { Market, Option } from '@lyrafinance/lyra-js'
import React, { useCallback, useState } from 'react'

import AmountUpdateText from '@/app/components/common/AmountUpdateText'
import RowItem from '@/app/components/common/RowItem'
import { ZERO_BN } from '@/app/constants/bn'
import { MIN_TRADE_CARD_HEIGHT } from '@/app/constants/layout'
import useAccountBalances from '@/app/hooks/account/useAccountBalances'
import withSuspense from '@/app/hooks/data/withSuspense'
import useTradeSync from '@/app/hooks/market/useTradeSync'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getSoftMaxCollateral from '@/app/utils/getSoftMaxCollateral'
import getSoftMinCollateral from '@/app/utils/getSoftMinCollateral'

import TradeFormButton from '../TradeForm/TradeFormButton'
import TradeFormCollateralSection from '../TradeForm/TradeFormCollateralSection'

// TODO: @dappbeast make slippage configurable
const SLIPPAGE = 0.5 / 100 // 0.5%

type Props = {
  isOpen: boolean
  onClose: () => void
  onTrade?: (market: Market, positionId: number) => void
  option: Option
  position: Position
}

const TradeCollateralFormModal = withSuspense(({ isOpen, onClose, onTrade, option, position }: Props) => {
  const market = option.market()
  // TODO: @dappbeast parallelize requests
  const balances = useAccountBalances(market)
  const quoteBalance = balances.quoteAsset
  const baseBalance = balances.baseAsset
  const isBaseCollateral = position.collateral?.isBase
  const defaultCollateralAmount = position.collateral?.amount ?? ZERO_BN
  const [collateralAmount, setCollateralAmount] = useState<BigNumber>(defaultCollateralAmount)

  // Reset to default collateral
  const resetCollateralAmount = useCallback(() => {
    setCollateralAmount(defaultCollateralAmount) // Triggers default fallback
  }, [defaultCollateralAmount])

  const handleTrade = useCallback(
    (market: Market, positionId: number) => {
      resetCollateralAmount()
      if (onTrade) {
        onTrade(market, positionId)
      }
    },
    [onTrade, resetCollateralAmount]
  )

  const trade = useTradeSync({
    option,
    position,
    balances,
    isBuy: true,
    size: ZERO_BN,
    setToCollateral: collateralAmount,
    isBaseCollateral,
    slippage: SLIPPAGE,
  })

  if (!trade.collateral) {
    return null
  }

  const max = getSoftMaxCollateral(trade, trade.collateral)
  const min = getSoftMinCollateral(trade.collateral)
  const isRange = !min.gte(max)

  return (
    <Modal isMobileFullscreen title="Adjust Collateral" isOpen={isOpen} onClose={onClose}>
      {isRange ? (
        <>
          <TradeFormCollateralSection
            trade={trade}
            collateral={trade.collateral}
            collateralAmount={collateralAmount}
            onChangeCollateralAmount={setCollateralAmount}
          />
          <CardSeparator />
          <CardSection>
            <RowItem
              mb={5}
              label="Balance"
              value={
                <AmountUpdateText
                  variant="secondary"
                  prevAmount={
                    isBaseCollateral
                      ? fromBigNumber(baseBalance.balance, baseBalance.decimals)
                      : fromBigNumber(quoteBalance.balance, quoteBalance.decimals)
                  }
                  newAmount={
                    isBaseCollateral
                      ? fromBigNumber(
                          baseBalance.balance.sub(trade.baseToken.transfer).add(trade.baseToken.receive),
                          baseBalance.decimals
                        )
                      : fromBigNumber(
                          quoteBalance.balance.sub(trade.quoteToken.transfer).add(trade.quoteToken.receive),
                          quoteBalance.decimals
                        )
                  }
                  isUSDFormat={!isBaseCollateral}
                  symbol={isBaseCollateral ? trade.baseToken.symbol : trade.quoteToken.symbol}
                />
              }
              valueColor="text"
              textVariant="secondary"
            />
            <TradeFormButton mt={3} width="100%" trade={trade} onTrade={handleTrade} />
          </CardSection>
        </>
      ) : (
        <>
          <CardSection>
            <RowItem
              label="Collateral"
              value={formatBalance(
                {
                  amount: collateralAmount,
                  ...(isBaseCollateral ? trade.baseToken : trade.quoteToken),
                },
                {
                  showDollars: !isBaseCollateral,
                }
              )}
            ></RowItem>
          </CardSection>
          <CardSeparator />
          <CardSection>
            <Text variant="secondary" color="secondaryText">
              This position is too small and has fixed collateral requirements that can't be adjusted.
            </Text>
            <Button mt={6} size="lg" label="Close" onClick={() => onClose()} />
          </CardSection>
        </>
      )}
    </Modal>
  )
})
;() => (
  <CardSection height={MIN_TRADE_CARD_HEIGHT}>
    <Center width="100%" flexGrow={1}>
      <Spinner />
    </Center>
  </CardSection>
)

export default TradeCollateralFormModal

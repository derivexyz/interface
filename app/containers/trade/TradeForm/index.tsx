import { BigNumber } from '@ethersproject/bignumber'
import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Center from '@lyra/ui/components/Center'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import Token from '@lyra/ui/components/Token'
import formatBalance from '@lyra/ui/utils/formatBalance'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Market, Option } from '@lyrafinance/lyra-js'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import RowItem from '@/app/components/common/RowItem'
import { ZERO_BN } from '@/app/constants/bn'
import { MIN_TRADE_CARD_HEIGHT } from '@/app/constants/layout'
import TradeFormSizeInput from '@/app/containers/trade/TradeForm/TradeFormSizeInput'
import TradeFormStableSelector from '@/app/containers/trade/TradeForm/TradeFormStableSelector'
import withSuspense from '@/app/hooks/data/withSuspense'
import useBalances from '@/app/hooks/market/useBalances'
import useTradeSync from '@/app/hooks/market/useTradeSync'
import useOpenPositions from '@/app/hooks/position/useOpenPositions'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getDefaultQuoteSize from '@/app/utils/getDefaultQuoteSize'
import getDefaultStableAddress from '@/app/utils/getDefaultStable'
import isOptimismMainnet from '@/app/utils/isOptimismMainnet'

import ShortYieldValue from '../../common/ShortYieldValue'
import TradeFormButton from './TradeFormButton'
import TradeFormCollateralSection from './TradeFormCollateralSection'
import TradeFormFeeRebateValue from './TradeFormFeeRebateValue'
import TradeFormPayoffSection from './TradeFormPayoffSection'
import TradeFormSwapValue from './TradeFormSwapValue'
import TradeFormTotalCostValue from './TradeFormTotalCostValue'

type Props = {
  isBuy: boolean
  option: Option
  hideTitle?: boolean
  positionId?: number | null
  onTrade?: (market: Market, positionId: number) => void
}

const SLIPPAGE = 5 / 100 // 5.0%

const TradeForm = withSuspense(
  ({ isBuy, option, positionId, onTrade, hideTitle }: Props) => {
    const openPositions = useOpenPositions()
    const position = useMemo(() => {
      if (positionId) {
        return openPositions.find(p => p.id === positionId)
      } else {
        return openPositions.find(
          p =>
            p.marketAddress === option.market().address &&
            p.strikeId === option.strike().id &&
            p.isCall === option.isCall
        )
      }
    }, [positionId, openPositions, option])

    const balances = useBalances()
    const market = option.market()
    const isLong = position ? position.isLong : isBuy

    // TODO - @michaelxuwu re-enable default stable
    const defaultStableAddress = useMemo(
      () => (isOptimismMainnet() ? balances.stable('sUSD') : getDefaultStableAddress(balances)),
      [balances]
    )

    const [isCoveredCall, setIsCoveredCall] = useState(position ? !!position.collateral?.isBase : false)
    const [stableAddress, setStableAddress] = useState<string>(defaultStableAddress.address)

    const isBaseCollateral = isCoveredCall

    const [size, setSize] = useState<BigNumber>(ZERO_BN)

    // Default to 1.0 contracts for new position, 0.0 for modifying a position
    const sizeWithDefaults = size.gt(0) ? size : !position ? getDefaultQuoteSize(market.name) : ZERO_BN

    const [collateralAmount, setCollateralAmount] = useState<BigNumber>(ZERO_BN)

    // Reset to default collateral
    const resetCollateralAmount = useCallback(() => {
      setCollateralAmount(ZERO_BN) // Triggers default fallback
    }, [])

    // Reset size + collateral inputs when option changes
    const strikeId = option.strike().id
    const marketAddress = option.market().address
    const isCall = option.isCall
    useEffect(() => {
      setSize(ZERO_BN)
      resetCollateralAmount()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [strikeId, marketAddress, isBuy, isCall, isCoveredCall, positionId])

    const handleTrade = useCallback(
      (market: Market, positionId: number) => {
        setSize(ZERO_BN)
        resetCollateralAmount()
        if (onTrade) {
          onTrade(market, positionId)
        }
      },
      [onTrade, resetCollateralAmount]
    )

    // Trade with placeholder size, collateral
    const trade = useTradeSync({
      option,
      position,
      isBuy,
      size: sizeWithDefaults,
      setToCollateral: collateralAmount,
      isBaseCollateral,
      slippage: SLIPPAGE,
      stableAddress,
      stableDecimals: balances.stable(stableAddress).decimals,
    })

    const stableBalance = useMemo(() => balances.stable(stableAddress), [balances, stableAddress])
    const baseBalance = useMemo(() => balances.base(trade.baseToken.address), [balances, trade])

    const pnl = useMemo(() => trade.pnl(), [trade])

    return (
      <>
        <CardSection>
          {!hideTitle ? (
            <Text mb={6} variant="heading">
              {isBuy ? 'Buy' : 'Sell'} {option.market().baseToken.symbol} {formatUSD(option.strike().strikePrice)}{' '}
              {option.isCall ? 'Call' : 'Put'}
            </Text>
          ) : null}
          {position ? (
            <RowItem
              label="Position"
              value={
                <Token
                  label={`${position.isLong ? 'LONG' : 'SHORT'} ${formatNumber(position.size)}`}
                  variant={position.isLong ? 'primary' : 'error'}
                />
              }
              mb={6}
            />
          ) : null}
          <RowItem
            label="Contracts"
            value={<TradeFormSizeInput width="50%" trade={trade} size={size} onChangeSize={setSize} />}
            mb={5}
          />
          <RowItem
            label={isBuy ? 'Buy With' : 'Sell With'}
            value={
              <TradeFormStableSelector
                balances={balances.stables}
                stableAddress={stableAddress}
                onChangeStableAddress={setStableAddress}
                width="50%"
              />
            }
            mb={6}
          />
          <RowItem
            label="Price Per Option"
            value={trade.pricePerOption.isZero() ? '-' : formatUSD(trade.pricePerOption)}
            valueColor={trade.pricePerOption.isZero() ? 'secondaryText' : 'text'}
          />
        </CardSection>
        <CardSeparator />
        {!isLong && trade.collateral ? (
          <>
            <TradeFormCollateralSection
              trade={trade}
              collateral={trade.collateral}
              collateralAmount={collateralAmount}
              onChangeCollateralAmount={setCollateralAmount}
              onToggleCoveredCall={setIsCoveredCall}
            />
            <CardSeparator />
          </>
        ) : null}
        <CardSection>
          <RowItem
            mb={6}
            textVariant="body"
            label={trade.isBuy ? 'Max Cost' : 'Min Received'}
            value={<TradeFormTotalCostValue trade={trade} />}
          />
          {stableAddress !== market.quoteToken.address ? (
            <RowItem mb={2} label="Swap" value={<TradeFormSwapValue trade={trade} />} textVariant="small" />
          ) : null}
          {trade.forceClosePenalty.gt(0) ? (
            <RowItem
              textVariant="small"
              label="Force Close Penalty"
              valueColor="warningText"
              value={formatUSD(trade.forceClosePenalty)}
              mb={2}
            />
          ) : null}
          <RowItem
            textVariant="small"
            label="Fees"
            valueColor={trade.fee.isZero() ? 'secondaryText' : 'text'}
            value={trade.fee.isZero() ? '-' : formatUSD(trade.fee)}
            mb={2}
          />
          <RowItem textVariant="small" label="Fee Rebate" value={<TradeFormFeeRebateValue />} mb={2} />
          {!trade.isLong ? (
            <RowItem
              mb={2}
              textVariant="small"
              label="Short Yield / Day"
              value={<ShortYieldValue textVariant="small" tradeOrPosition={trade} option={option} />}
            />
          ) : null}
          {!trade.isOpen ? (
            <RowItem
              mb={2}
              label="Profit / Loss"
              value={pnl.isZero() ? '-' : formatUSD(pnl, { showSign: true })}
              valueColor={pnl.isZero() ? 'secondaryText' : pnl.gt(0) ? 'primaryText' : 'errorText'}
              textVariant="small"
            />
          ) : null}
          <RowItem
            mb={6}
            label="Balance"
            value={
              isBaseCollateral
                ? formatBalance(fromBigNumber(baseBalance.balance, baseBalance.decimals), baseBalance.symbol)
                : formatBalance(fromBigNumber(stableBalance.balance, stableBalance.decimals), stableBalance.symbol, {
                    showDollars: true,
                  })
            }
            valueColor={'text'}
            textVariant="small"
          />
          <TradeFormButton width="100%" trade={trade} onTrade={handleTrade} />
        </CardSection>
        {!position && (
          <>
            <CardSeparator />
            <TradeFormPayoffSection trade={trade} />
          </>
        )}
      </>
    )
  },
  () => (
    <CardSection height={MIN_TRADE_CARD_HEIGHT}>
      <Center width="100%" flexGrow={1}>
        <Spinner />
      </Center>
    </CardSection>
  )
)

export default TradeForm

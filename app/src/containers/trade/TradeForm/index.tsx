import { BigNumber } from '@ethersproject/bignumber'
import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Center from '@lyra/ui/components/Center'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import Token from '@lyra/ui/components/Token'
import filterNulls from '@lyra/ui/utils/filterNulls'
import formatBalance from '@lyra/ui/utils/formatBalance'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatTruncatedBalance from '@lyra/ui/utils/formatTruncatedBalance'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Market, Option } from '@lyrafinance/lyra-js'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import AmountUpdateText from '@/app/components/common/AmountUpdateText'
import RowItem from '@/app/components/common/RowItem'
import { ZERO_BN } from '@/app/constants/bn'
import { MIN_TRADE_CARD_HEIGHT } from '@/app/constants/layout'
import TradeFormSizeInput from '@/app/containers/trade/TradeForm/TradeFormSizeInput'
import withSuspense from '@/app/hooks/data/withSuspense'
import useMarketBalances from '@/app/hooks/market/useMarketBalances'
import useTradeSync from '@/app/hooks/market/useTradeSync'
import useOpenPositions from '@/app/hooks/position/useOpenPositions'
import useLatestRewardEpoch from '@/app/hooks/rewards/useLatestRewardEpoch'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getDefaultQuoteSize from '@/app/utils/getDefaultQuoteSize'

import FeeRebateModal from '../../common/FeeRebateModal'
import ShortYieldValue from '../../common/ShortYieldValue'
import TradeFormButton from './TradeFormButton'
import TradeFormCollateralSection from './TradeFormCollateralSection'
import TradeFormPayoffSection from './TradeFormPayoffSection'

type Props = {
  isBuy: boolean
  option: Option
  hideTitle?: boolean
  positionId?: number | null
  onTrade?: (market: Market, positionId: number) => void
}

const SLIPPAGE = 0.5 / 100 // 0.5%

const TradeForm = withSuspense(
  ({ isBuy, option, positionId, onTrade, hideTitle }: Props) => {
    const openPositions = useOpenPositions()
    const balances = useMarketBalances(option.market())
    const epochs = useLatestRewardEpoch(option.lyra.network, false)

    const market = option.market()
    const position = useMemo(() => {
      if (positionId) {
        return openPositions.find(p => p.id === positionId)
      } else {
        return openPositions.find(
          p => p.marketAddress === market.address && p.strikeId === option.strike().id && p.isCall === option.isCall
        )
      }
    }, [positionId, openPositions, option, market])
    const isLong = position ? position.isLong : isBuy

    // TODO - @michaelxuwu re-enable default stable

    const [isCoveredCall, setIsCoveredCall] = useState(position ? !!position.collateral?.isBase : false)

    const quoteBalance = balances.quoteAsset
    const baseBalance = balances.baseAsset
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
      balances,
      isBuy,
      size: sizeWithDefaults,
      setToCollateral: collateralAmount,
      isBaseCollateral,
      slippage: SLIPPAGE,
    })

    const pnl = useMemo(() => trade.pnl(), [trade])

    const global = epochs?.global
    const stakedLyraBalance = epochs?.account?.stakedLyraBalance ?? 0
    const tradingRewards = global?.tradingRewards(fromBigNumber(trade.fee), stakedLyraBalance)
    const [isFeeRebateOpen, setIsFeeRebateOpen] = useState(false)
    const feeRewardsStr = tradingRewards
      ? filterNulls([
          tradingRewards.lyra ? formatTruncatedBalance(tradingRewards.lyra, 'LYRA') : null,
          tradingRewards.op ? formatTruncatedBalance(tradingRewards.op, 'OP') : null,
        ]).join(', ')
      : null

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
            value={<TradeFormSizeInput width="60%" trade={trade} size={size} onChangeSize={setSize} />}
            mb={5}
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
            mb={5}
            textVariant="secondary"
            label={trade.isBuy ? 'Max Cost' : 'Min Received'}
            valueColor={trade.premium.gt(0) ? 'text' : 'secondaryText'}
            value={
              trade.premium.gt(0) ? formatBalance(trade.premium, trade.quoteToken.symbol, { showDollars: true }) : '-'
            }
          />
          {trade.forceClosePenalty.gt(0) ? (
            <RowItem
              textVariant="secondary"
              label="Force Close Penalty"
              valueColor="warningText"
              value={formatUSD(trade.forceClosePenalty)}
              mb={5}
            />
          ) : null}
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
                    ? fromBigNumber(baseBalance.balance.sub(trade.baseToken.transfer), baseBalance.decimals)
                    : fromBigNumber(quoteBalance.balance.sub(trade.quoteToken.transfer), quoteBalance.decimals)
                }
                isUSDFormat={!isBaseCollateral}
                symbol={isBaseCollateral ? trade.baseToken.symbol : trade.quoteToken.symbol}
              />
            }
            valueColor="text"
            textVariant="secondary"
          />
          {epochs ? (
            <RowItem
              label="Est. Rewards"
              value={
                <>
                  <Text
                    variant="secondary"
                    color={feeRewardsStr ? 'primaryText' : 'secondaryText'}
                    onClick={() => setIsFeeRebateOpen(true)}
                    sx={{ ':hover': { opacity: 0.5, cursor: 'pointer' } }}
                  >
                    {feeRewardsStr ? feeRewardsStr : '-'}
                  </Text>
                  <FeeRebateModal
                    network={trade.lyra.network}
                    isOpen={isFeeRebateOpen}
                    onClose={() => setIsFeeRebateOpen(false)}
                  />
                </>
              }
              mb={5}
            />
          ) : null}
          {epochs && !trade.isLong ? (
            <RowItem
              mb={5}
              label="Short Yield / Day"
              value={<ShortYieldValue textVariant="secondary" tradeOrPosition={trade} option={option} />}
            />
          ) : null}
          {!trade.isOpen ? (
            <RowItem
              mb={5}
              label="Profit / Loss"
              value={pnl.isZero() ? '-' : formatUSD(pnl, { showSign: true })}
              valueColor={pnl.isZero() ? 'secondaryText' : pnl.gt(0) ? 'primaryText' : 'errorText'}
            />
          ) : null}
          <TradeFormButton mt={3} width="100%" trade={trade} onTrade={handleTrade} />
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

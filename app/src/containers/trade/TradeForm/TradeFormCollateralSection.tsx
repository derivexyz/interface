import { BigNumber } from '@ethersproject/bignumber'
import CardSection from '@lyra/ui/components/Card/CardSection'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import Slider from '@lyra/ui/components/Slider'
import Toggle from '@lyra/ui/components/Toggle'
import { MarginProps } from '@lyra/ui/types'
import formatBalance from '@lyra/ui/utils/formatBalance'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedBalance from '@lyra/ui/utils/formatTruncatedBalance'
import formatTruncatedNumber from '@lyra/ui/utils/formatTruncatedNumber'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Trade, TradeCollateral } from '@lyrafinance/lyra-js'
import React, { useEffect } from 'react'

import RowItem from '@/app/components/common/RowItem'
import { ZERO_BN } from '@/app/constants/bn'
import { ERROR_DIST_TO_LIQUIDATION_PRICE, WARNING_DIST_TO_LIQUIDATION_PRICE } from '@/app/constants/contracts'
import { LogEvent } from '@/app/constants/logEvents'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getDistToLiqPrice from '@/app/utils/getDistToLiqPrice'
import getSoftMaxCollateral from '@/app/utils/getSoftMaxCollateral'
import getSoftMinCollateral from '@/app/utils/getSoftMinCollateral'
import getTradeLogData from '@/app/utils/getTradeLogData'
import logEvent from '@/app/utils/logEvent'
import toBigNumber from '@/app/utils/toBigNumber'

type Props = {
  trade: Trade
  collateral: TradeCollateral
  collateralAmount: BigNumber
  onChangeCollateralAmount: (size: BigNumber) => void
  onToggleCoveredCall: (isCoveredCall: boolean) => void
} & MarginProps

const NUM_STEPS = 200

const TradeFormCollateralSection = ({
  trade,
  collateral,
  collateralAmount,
  onChangeCollateralAmount,
  onToggleCoveredCall,
  ...styleProps
}: Props) => {
  const position = trade.position()
  const isFullClose = trade.newSize.isZero()

  const isCall = trade.option().isCall
  const isBaseCollateral = collateral.isBase

  const tradeOrPositionCollateral = collateralAmount ? collateral : position?.collateral

  const max = getSoftMaxCollateral(trade, collateral)
  const min = getSoftMinCollateral(collateral)

  const liqPrice = collateral.liquidationPrice
  const spotPrice = trade.market().spotPrice
  const liqDistToSpot = liqPrice ? getDistToLiqPrice(spotPrice, liqPrice) : null
  const absLiqDistToSpot = liqDistToSpot ? Math.abs(liqDistToSpot) : null

  const sliderDist = max.sub(min)
  const step = fromBigNumber(sliderDist) / NUM_STEPS
  const isRange = !min.gte(max)

  // HACK: When min = max collateral i.e. there is no range, lock collateral to max
  useEffect(() => {
    if (!isRange && !collateralAmount.eq(max)) {
      onChangeCollateralAmount(max)
    }
  }, [isRange, max, collateralAmount, onChangeCollateralAmount])

  // HACK: When fully closing, ensure collateral amount is set to zero
  useEffect(() => {
    if (isFullClose && collateralAmount.gt(0)) {
      onChangeCollateralAmount(ZERO_BN)
    }
  }, [collateralAmount, isFullClose, onChangeCollateralAmount])

  if (trade.isLong) {
    // Skip rendering when trade is long or when trader is closing position
    return null
  }

  return (
    <CardSection {...styleProps}>
      {isCall && !position ? (
        <RowItem
          mb={5}
          label="Covered Call"
          value={<Toggle isChecked={isBaseCollateral} onChange={e => onToggleCoveredCall(e.target.checked)} />}
        />
      ) : null}
      {!isFullClose ? (
        <RowItem
          mb={isRange ? 3 : 0}
          label="Collateral"
          value={
            isRange ? (
              <BigNumberInput
                value={collateralAmount}
                onChange={onChangeCollateralAmount}
                onBlur={() => {
                  logEvent(LogEvent.TradeCollateralInput, {
                    ...getTradeLogData(trade),
                    setToCollateral: collateralAmount,
                  })
                }}
                width="50%"
                placeholder={
                  !isBaseCollateral
                    ? `${formatTruncatedUSD(min)} - ${formatTruncatedUSD(max)}`
                    : `${formatTruncatedNumber(min)} - ${formatTruncatedNumber(max)} ${trade.market().baseToken.symbol}`
                }
                isDisabled={isFullClose}
                max={max}
                // Don't throw input warning on empty input
                min={collateralAmount.isZero() ? undefined : min}
                textAlign="right"
              />
            ) : !isBaseCollateral ? (
              formatUSD(collateralAmount)
            ) : (
              formatBalance(collateralAmount, trade.market().baseToken.symbol)
            )
          }
        />
      ) : (
        <RowItem
          label="Returned Collateral"
          value={
            !isBaseCollateral
              ? formatUSD(trade.prevCollateralAmount())
              : formatBalance(trade.prevCollateralAmount(), trade.market().baseToken.symbol)
          }
        />
      )}
      {isRange ? (
        <Slider
          mb={6}
          flexGrow={1}
          value={fromBigNumber(collateralAmount)}
          max={fromBigNumber(max)}
          min={fromBigNumber(min)}
          onClickMax={() => onChangeCollateralAmount(max)}
          onClickMin={() => onChangeCollateralAmount(min)}
          minButtonLabel={`Min: ${
            isBaseCollateral ? formatTruncatedBalance(min, trade.market().baseToken.symbol) : formatTruncatedUSD(min)
          }`}
          maxButtonLabel={`Max: ${
            isBaseCollateral ? formatTruncatedBalance(max, trade.market().baseToken.symbol) : formatTruncatedUSD(max)
          }`}
          step={step}
          onChange={_value => {
            const value = toBigNumber(_value.toFixed(2))
            if (value) {
              const collateralAmount = value.gt(max) ? max : value.lt(min) ? min : value
              onChangeCollateralAmount(collateralAmount)
            }
          }}
          onBlur={() => {
            logEvent(LogEvent.TradeCollateralSlide, {
              ...getTradeLogData(trade),
              setToCollateral: collateralAmount,
            })
          }}
        />
      ) : null}
      {isRange ? (
        <RowItem
          label="Liquidation Price"
          value={
            !tradeOrPositionCollateral || tradeOrPositionCollateral.amount.lt(tradeOrPositionCollateral.min)
              ? '-'
              : !tradeOrPositionCollateral.liquidationPrice
              ? 'None'
              : `${formatUSD(tradeOrPositionCollateral.liquidationPrice)} (${formatPercentage(
                  liqDistToSpot ?? 0 // Always defined
                )})`
          }
          valueColor={
            absLiqDistToSpot
              ? absLiqDistToSpot > WARNING_DIST_TO_LIQUIDATION_PRICE
                ? 'text'
                : absLiqDistToSpot > ERROR_DIST_TO_LIQUIDATION_PRICE
                ? 'warningText'
                : 'errorText'
              : 'text'
          }
        />
      ) : null}
    </CardSection>
  )
}

export default TradeFormCollateralSection

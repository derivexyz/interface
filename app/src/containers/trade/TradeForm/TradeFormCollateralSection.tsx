import { BigNumber } from '@ethersproject/bignumber'
import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Icon, { IconType } from '@lyra/ui/components/Icon'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import Slider from '@lyra/ui/components/Slider'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatBalance from '@lyra/ui/utils/formatBalance'
import formatTruncatedBalance from '@lyra/ui/utils/formatTruncatedBalance'
import formatTruncatedNumber from '@lyra/ui/utils/formatTruncatedNumber'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Trade, TradeCollateral } from '@lyrafinance/lyra-js'
import React, { useCallback, useEffect, useState } from 'react'

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

import TokenImage from '../../common/TokenImage'

type Props = {
  trade: Trade
  collateral: TradeCollateral
  collateralAmount: BigNumber
  onChangeCollateralAmount: (size: BigNumber) => void
  onToggleCoveredCall?: (isCoveredCall: boolean) => void
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

  const [isOpen, setIsOpen] = useState(false)
  const onClose = useCallback(() => setIsOpen(false), [])
  const onOpen = useCallback(() => setIsOpen(true), [])
  const onSelectCollateral = useCallback(
    (isCoveredCall: boolean) => {
      if (onToggleCoveredCall) {
        onToggleCoveredCall(isCoveredCall)
      }
      onClose()
    },
    [onClose, onToggleCoveredCall]
  )

  if (trade.isLong) {
    // Skip rendering when trade is long or when trader is closing position
    return null
  }

  const collateralToken = isBaseCollateral ? trade.baseToken : trade.quoteToken

  return (
    <CardSection {...styleProps}>
      {isCall && !position ? (
        <RowItem
          mb={5}
          label="Sell With"
          value={
            <DropdownButton
              label={collateralToken.symbol}
              leftIcon={<TokenImage size={24} nameOrAddress={collateralToken.symbol} />}
              isOpen={isOpen}
              onClick={onOpen}
              onClose={onClose}
            >
              <DropdownButtonListItem
                label={trade.quoteToken.symbol}
                icon={<TokenImage size={24} nameOrAddress={trade.quoteToken.symbol} />}
                onClick={() => onSelectCollateral(false)}
                rightContent={!isBaseCollateral ? <Icon icon={IconType.Check} size={16} /> : null}
              />
              <DropdownButtonListItem
                label={trade.baseToken.symbol}
                icon={<TokenImage size={24} nameOrAddress={trade.baseToken.symbol} />}
                onClick={() => onSelectCollateral(true)}
                rightContent={isBaseCollateral ? <Icon icon={IconType.Check} size={16} /> : null}
              />
            </DropdownButton>
          }
        />
      ) : null}
      {!isFullClose ? (
        <RowItem
          mb={isRange ? 5 : 0}
          label="Collateral"
          value={
            isRange ? (
              <BigNumberInput
                rightContent={
                  <Text color="secondaryText">
                    {isBaseCollateral ? trade.baseToken.symbol : trade.quoteToken.symbol}
                  </Text>
                }
                value={collateralAmount}
                onChange={onChangeCollateralAmount}
                onBlur={() => {
                  logEvent(LogEvent.TradeCollateralInput, {
                    ...getTradeLogData(trade),
                    setToCollateral: collateralAmount,
                  })
                }}
                width="60%"
                placeholder={`${formatTruncatedNumber(min)} - ${formatTruncatedNumber(max)}`}
                isDisabled={isFullClose}
                max={max}
                // Don't throw input warning on empty input
                min={collateralAmount.isZero() ? undefined : min}
                textAlign="right"
              />
            ) : (
              formatBalance(collateralAmount, isBaseCollateral ? trade.baseToken.symbol : trade.quoteToken.symbol, {
                showDollars: !isBaseCollateral,
              })
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
          minButtonLabel={`Min: ${formatTruncatedBalance(
            min,
            !isBaseCollateral ? trade.quoteToken.symbol : trade.baseToken.symbol,
            {
              showDollars: !isBaseCollateral,
            }
          )}`}
          maxButtonLabel={`Max: ${formatTruncatedBalance(
            max,
            !isBaseCollateral ? trade.quoteToken.symbol : trade.baseToken.symbol,
            {
              showDollars: !isBaseCollateral,
            }
          )}`}
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
              ? 'Not Liquidatable'
              : `${trade.baseToken.symbol} at ${formatUSD(tradeOrPositionCollateral.liquidationPrice)}`
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

import { LayoutProps, MarginProps } from '@lyra/ui/types'
import { Market, Trade, TradeDisabledReason } from '@lyrafinance/lyra-js'
import React, { useCallback } from 'react'

import { MAX_BN } from '@/app/constants/bn'
import { LogEvent } from '@/app/constants/logEvents'
import { TransactionType } from '@/app/constants/screen'
import useAccount from '@/app/hooks/account/useAccount'
import useTransaction from '@/app/hooks/account/useTransaction'
import useMutateTrade from '@/app/hooks/mutations/useMutateTrade'
import useMutateTradeApprove from '@/app/hooks/mutations/useMutateTradeApprove'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getLyraSDK from '@/app/utils/getLyraSDK'
import getTradeLogData from '@/app/utils/getTradeLogData'
import isDev from '@/app/utils/isDev'
import logEvent from '@/app/utils/logEvent'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  trade: Trade
  onTrade?: (market: Market, positionId: number) => void
} & MarginProps &
  Omit<LayoutProps, 'size'>

const getTradeDisabledMessage = (disabledReason: TradeDisabledReason): string => {
  if (isDev()) {
    return disabledReason
  }
  switch (disabledReason) {
    case TradeDisabledReason.EmptySize:
      return 'Enter amount'
    case TradeDisabledReason.EmptyCollateral:
      return 'Enter collateral'
    case TradeDisabledReason.NotEnoughCollateral:
      return 'Not enough collateral'
    case TradeDisabledReason.TooMuchCollateral:
      return 'Too much collateral'
    case TradeDisabledReason.InsufficientLiquidity:
    case TradeDisabledReason.UnableToHedgeDelta:
      return 'Insufficient liquidity'
    case TradeDisabledReason.Expired:
      return 'Option has expired'
    case TradeDisabledReason.TradingCutoff:
      return 'Option too close to expiry'
    case TradeDisabledReason.PositionClosed:
      return 'Position closed'
    case TradeDisabledReason.PositionNotLargeEnough:
      return 'Position not large enough'
    case TradeDisabledReason.IncorrectOwner:
      return 'You are not the owner'
    case TradeDisabledReason.PositionClosedLeftoverCollateral:
      return 'Set collateral to zero'
    case TradeDisabledReason.PriceVarianceTooHigh:
    case TradeDisabledReason.DeltaOutOfRange:
    case TradeDisabledReason.VolTooHigh:
    case TradeDisabledReason.VolTooLow:
    case TradeDisabledReason.IVTooHigh:
    case TradeDisabledReason.IVTooLow:
    case TradeDisabledReason.SkewTooHigh:
    case TradeDisabledReason.SkewTooLow:
      return 'Price impact too high'
    case TradeDisabledReason.InsufficientBaseAllowance:
    case TradeDisabledReason.InsufficientQuoteAllowance:
      return 'Insufficient Allowance'
    case TradeDisabledReason.InsufficientBaseBalance:
    case TradeDisabledReason.InsufficientQuoteBalance:
      return 'Insufficient Balance'
  }
}

const getTradeButtonLabel = (trade: Trade): string => {
  const position = trade.position()
  const option = trade.option()
  const isBuy = trade.isBuy
  const isClose = !!position && position.isLong !== isBuy && !trade.size.isZero()

  if (trade.isDisabled && trade.disabledReason) {
    return getTradeDisabledMessage(trade.disabledReason)
  } else if (position?.collateral && trade.collateral && trade.isCollateralUpdate) {
    const isAdd = trade.collateral.amount.gt(position.collateral.amount)
    return isAdd ? 'Add Collateral' : 'Remove Collateral'
  } else if (isClose) {
    return 'Close Position'
  } else {
    return `${isBuy ? 'Buy' : 'Sell'} ${option.isCall ? 'Call' : 'Put'}`
  }
}

const TradeFormButton = ({ onTrade, trade, ...styleProps }: Props) => {
  const option = trade.option()
  const position = trade.position()
  const market = option.market()

  const account = useAccount(trade.lyra.network)

  const mutateTrade = useMutateTrade(trade)
  const mutateTradeApprove = useMutateTradeApprove(trade)

  const execute = useTransaction(trade.lyra.network)

  const transactionType = trade.isCollateralUpdate
    ? TransactionType.TradeCollateralUpdate
    : trade.isOpen
    ? TransactionType.TradeOpenPosition
    : TransactionType.TradeClosePosition

  const handleClickApproveQuote = useCallback(async () => {
    if (!account) {
      console.warn('Missing account')
      return
    }
    logEvent(LogEvent.TradeApproveSubmit, { isBase: false })
    const tx = market.approveTradeQuote(account.address, MAX_BN)
    await execute(tx, transactionType, {
      onComplete: async () => {
        await mutateTradeApprove()
        logEvent(LogEvent.TradeApproveSuccess, {
          isBase: false,
        })
      },
    })
  }, [account, market, execute, transactionType, mutateTradeApprove])

  const handleClickApproveBase = useCallback(async () => {
    if (!account) {
      console.warn('Missing account')
      return null
    }
    logEvent(LogEvent.TradeApproveSubmit, { isBase: true })
    const tx = market.approveTradeBase(account.address, MAX_BN)
    await execute(tx, transactionType, {
      onComplete: async () => {
        await mutateTradeApprove()
        logEvent(LogEvent.TradeApproveSuccess, { isBase: true })
      },
    })
  }, [account, market, execute, transactionType, mutateTradeApprove])

  const handleClickTrade = useCallback(async () => {
    if (!account) {
      console.warn('Account or market does not exist')
      return
    }

    const resolveTx = async () => {
      const proposedTrade = await market.trade(
        account.address,
        trade.strikeId,
        trade.isCall,
        trade.isBuy,
        trade.size,
        trade.slippage,
        {
          setToCollateral: trade.collateral?.amount,
          isBaseCollateral: trade.collateral?.isBase,
          positionId: trade.positionId,
          iterations: trade.iterations.length,
        }
      )
      return {
        tx: proposedTrade.tx,
        metadata: {
          ...proposedTrade.measurements,
          blockNumber: proposedTrade.market().block.number,
          isForceClose: proposedTrade.isForceClose,
          iterations: proposedTrade.iterations.map(iteration => ({
            premium: fromBigNumber(iteration.premium),
            optionPriceFee: fromBigNumber(iteration.optionPriceFee),
            spotPriceFee: fromBigNumber(iteration.spotPriceFee),
            vegaUtilFee: fromBigNumber(iteration.vegaUtilFee.vegaUtilFee),
            varianceFee: fromBigNumber(iteration.varianceFee.varianceFee),
            forceClosePenalty: fromBigNumber(iteration.forceClosePenalty),
            volTraded: fromBigNumber(iteration.volTraded),
            newBaseIv: fromBigNumber(iteration.newBaseIv),
            newSkew: fromBigNumber(iteration.newSkew),
            postTradeAmmNetStdVega: fromBigNumber(iteration.postTradeAmmNetStdVega),
          })),
        },
      }
    }

    const receipt = await execute(resolveTx(), transactionType, {
      onComplete: async receipt => {
        const [events] = await Promise.all([getLyraSDK(trade.lyra.network).events(receipt), mutateTrade()])
        const { trades, collateralUpdates } = events
        trades.forEach(trade => logEvent(LogEvent.TradeSuccess, getTradeLogData(trade)))
        collateralUpdates
          .filter(update => update.isAdjustment)
          .forEach(update => logEvent(LogEvent.TradeCollateralUpdateSuccess, getTradeLogData(update)))
      },
    })

    if (onTrade && receipt) {
      const [positionId] = Trade.getPositionIdsForLogs(receipt.logs)
      if (positionId) {
        onTrade(market, positionId)
      }
    }
  }, [account, execute, transactionType, onTrade, market, trade, mutateTrade])

  return (
    <TransactionButton
      requireAllowance={
        trade.disabledReason === TradeDisabledReason.InsufficientQuoteAllowance
          ? {
              ...trade.quoteToken,
              onClick: handleClickApproveQuote,
            }
          : trade.disabledReason === TradeDisabledReason.InsufficientBaseAllowance
          ? {
              ...trade.baseToken,
              onClick: handleClickApproveBase,
            }
          : undefined
      }
      requireBalance={
        trade.disabledReason === TradeDisabledReason.InsufficientQuoteBalance
          ? {
              ...trade.quoteToken,
              context: 'make your trade',
              requiredBalance: trade.quoteToken.transfer,
            }
          : trade.disabledReason === TradeDisabledReason.InsufficientBaseBalance
          ? {
              ...trade.baseToken,
              context: 'collateralize your covered call',
              requiredBalance: trade.baseToken.transfer,
            }
          : undefined
      }
      network={trade.lyra.network}
      transactionType={transactionType}
      onClick={handleClickTrade}
      isDisabled={trade.isDisabled}
      label={getTradeButtonLabel(trade)}
      {...styleProps}
    />
  )
}

export default TradeFormButton

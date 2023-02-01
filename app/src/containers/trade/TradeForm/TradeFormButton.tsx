import { IconType } from '@lyra/ui/components/Icon'
import { createToast } from '@lyra/ui/components/Toast'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import { Market, Trade, TradeDisabledReason } from '@lyrafinance/lyra-js'
import React, { useCallback } from 'react'

import { MAX_BN } from '@/app/constants/bn'
import { ITERATIONS } from '@/app/constants/contracts'
import { LogEvent } from '@/app/constants/logEvents'
import { TransactionType } from '@/app/constants/screen'
import useTransaction from '@/app/hooks/account/useTransaction'
import useAccount from '@/app/hooks/market/useAccount'
import useMutateTrade from '@/app/hooks/mutations/useMutateTrade'
import useMutateTradeApprove from '@/app/hooks/mutations/useMutateTradeApprove'
import getLyraSDK from '@/app/utils/getLyraSDK'
import getTradeLogData from '@/app/utils/getTradeLogData'
import logEvent from '@/app/utils/logEvent'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  trade: Trade
  onTrade?: (market: Market, positionId: number) => void
} & MarginProps &
  Omit<LayoutProps, 'size'>

const getTradeDisabledMessage = (disabledReason: TradeDisabledReason): string => {
  switch (disabledReason) {
    case TradeDisabledReason.EmptySize:
      return 'Enter amount'
    case TradeDisabledReason.EmptyCollateral:
      return 'Enter collateral'
    case TradeDisabledReason.NotEnoughCollateral:
      return 'Not enough collateral'
    case TradeDisabledReason.TooMuchCollateral:
      return 'Too much collateral'
    case TradeDisabledReason.DeltaOutOfRange:
      return 'Delta out of range'
    case TradeDisabledReason.InsufficientLiquidity:
      return 'Insufficient liquidity'
    case TradeDisabledReason.UnableToHedgeDelta:
      return 'Unable to hedge delta'
    case TradeDisabledReason.Expired:
      return 'Strike has expired'
    case TradeDisabledReason.TradingCutoff:
      return 'Trading paused'
    case TradeDisabledReason.PositionClosed:
      return 'Position closed'
    case TradeDisabledReason.PositionNotLargeEnough:
      return 'Position not large enough'
    case TradeDisabledReason.IncorrectOwner:
      return 'You are not the owner'
    case TradeDisabledReason.PositionClosedLeftoverCollateral:
      return 'Set collateral to zero'
    case TradeDisabledReason.VolTooHigh:
    case TradeDisabledReason.VolTooLow:
    case TradeDisabledReason.IVTooHigh:
    case TradeDisabledReason.IVTooLow:
    case TradeDisabledReason.SkewTooHigh:
    case TradeDisabledReason.SkewTooLow:
      return 'Price impact too high'
    case TradeDisabledReason.EmptyPremium:
      return 'Option is worthless'
    case TradeDisabledReason.InsufficientBaseAllowance:
    case TradeDisabledReason.InsufficientQuoteAllowance:
      return 'Insufficient Allowance'
    case TradeDisabledReason.InsufficientBaseBalance:
    case TradeDisabledReason.InsufficientQuoteBalance:
      return 'Insufficient Balance'
    case TradeDisabledReason.PriceVarianceTooHigh:
      return 'Price variance too high'
    case TradeDisabledReason.Unknown:
      return 'Something went wrong'
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

  const handleClickApproveQuote = useCallback(async () => {
    if (!account) {
      console.warn('Missing account')
      return
    }
    logEvent(LogEvent.TradeApproveSubmit, { isBase: false })
    const tx = await trade.approveQuote(account.address, MAX_BN)
    await execute(tx, {
      onComplete: async () => {
        await mutateTradeApprove()
        logEvent(LogEvent.TradeApproveSuccess, {
          isBase: false,
        })
      },
      onError: () => logEvent(LogEvent.TradeApproveError, { isBase: false }),
    })
  }, [account, trade, execute, mutateTradeApprove])

  const handleClickApproveBase = useCallback(async () => {
    if (!account) {
      console.warn('Missing account')
      return null
    }
    logEvent(LogEvent.TradeApproveSubmit, { isBase: true })
    const tx = await trade.approveBase(account.address, MAX_BN)
    await execute(tx, {
      onComplete: async () => {
        await mutateTradeApprove()
        logEvent(LogEvent.TradeApproveSuccess, { isBase: true })
      },
      onError: () => logEvent(LogEvent.TradeApproveError, { isBase: true }),
    })
  }, [account, trade, execute, mutateTradeApprove])

  const handleClickTrade = useCallback(async () => {
    if (!account) {
      console.warn('Account or market does not exist')
      return
    }

    const proposedTrade = await market.trade(
      account.address,
      trade.option().strike().id,
      trade.option().isCall,
      trade.isBuy,
      trade.size,
      trade.slippage,
      {
        setToCollateral: trade.collateral?.amount,
        isBaseCollateral: trade.collateral?.isBase,
        positionId: position?.id,
        iterations: ITERATIONS,
      }
    )

    logEvent(LogEvent.TradeSubmit, getTradeLogData(trade))

    if (proposedTrade.disabledReason) {
      createToast({
        variant: 'error',
        description: `Trade Failed: ${getTradeDisabledMessage(proposedTrade.disabledReason)}`,
        icon: IconType.AlertTriangle,
      })
      return
    }

    const receipt = await execute(proposedTrade.tx, {
      onComplete: async receipt => {
        const [events] = await Promise.all([getLyraSDK(trade.lyra.network).events(receipt), mutateTrade()])
        const { trades, collateralUpdates } = events
        trades.forEach(trade => logEvent(LogEvent.TradeSuccess, getTradeLogData(trade)))
        collateralUpdates
          .filter(update => update.isAdjustment)
          .forEach(update => logEvent(LogEvent.TradeCollateralUpdateSuccess, getTradeLogData(update)))
      },
      onError: error => {
        // For debugging
        console.error(error)
        logEvent(LogEvent.TradeError, { ...getTradeLogData(trade), error: error?.message })
      },
    })
    if (onTrade && receipt) {
      const [positionId] = Trade.getPositionIdsForLogs(receipt.logs)
      if (positionId) {
        onTrade(market, positionId)
      }
    }
  }, [trade, account, execute, onTrade, position, market, mutateTrade])

  const transactionType = trade.isCollateralUpdate
    ? TransactionType.TradeCollateralUpdate
    : trade.isOpen
    ? TransactionType.TradeOpenPosition
    : TransactionType.TradeClosePosition

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

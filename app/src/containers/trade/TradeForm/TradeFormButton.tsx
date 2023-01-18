import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import { Market, MarketTradeOptions, Trade, TradeDisabledReason } from '@lyrafinance/lyra-js'
import React, { useCallback } from 'react'

import { MAX_BN } from '@/app/constants/bn'
import { LogEvent } from '@/app/constants/logEvents'
import { TransactionType } from '@/app/constants/screen'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAccount from '@/app/hooks/market/useAccount'
import { useMutateBalances } from '@/app/hooks/market/useBalances'
import useMarketBalances from '@/app/hooks/market/useMarketBalances'
import { useMutateOpenPositions } from '@/app/hooks/position/useOpenPositions'
import { useMutatePosition } from '@/app/hooks/position/usePosition'
import useTransaction from '@/app/hooks/transaction/useTransaction'
import filterNulls from '@/app/utils/filterNulls'
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
    case TradeDisabledReason.Unknown:
      return 'Unavailable'
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

const TradeFormButton = withSuspense(
  ({ onTrade, trade, ...styleProps }: Props) => {
    const option = trade.option()
    const position = trade.position()
    const market = option.market()
    const network = trade.lyra.network
    const mutateOpenPositions = useMutateOpenPositions()
    const balances = useMarketBalances(trade.market())
    const account = useAccount(network)
    const mutateAccount = useMutateBalances(network)
    const mutatePosition = useMutatePosition(market.lyra)
    const quoteToken = balances.quoteAsset

    const execute = useTransaction(network)

    const handleClickApproveQuote = useCallback(async () => {
      logEvent(LogEvent.TradeApproveSubmit, { isBase: false })
      if (!account || !quoteToken) {
        console.warn('Account or quote token does not exist')
        return null
      }
      const tx = await trade.approveQuote(account.address, MAX_BN)
      await execute(tx, {
        onComplete: () => {
          mutateAccount()
          logEvent(LogEvent.TradeApproveSuccess, {
            isBase: false,
          })
        },
        onError: () => logEvent(LogEvent.TradeApproveError, { isBase: false }),
      })
    }, [account, quoteToken, trade, execute, mutateAccount])

    const handleClickApproveBase = useCallback(async () => {
      logEvent(LogEvent.TradeApproveSubmit, { isBase: true })
      if (!account || !market) {
        console.warn('Account or market does not exist')
        return null
      }
      const tx = await trade.approveBase(account.address, MAX_BN)
      await execute(tx, {
        onComplete: () => {
          mutateAccount()
          logEvent(LogEvent.TradeApproveSuccess, { isBase: true })
        },
        onError: () => logEvent(LogEvent.TradeApproveError, { isBase: true }),
      })
    }, [account, market, trade, execute, mutateAccount])

    const handleClickTrade = useCallback(async () => {
      if (!trade || !account) {
        console.warn('Account or market does not exist')
        return
      }

      logEvent(LogEvent.TradeSubmit, getTradeLogData(trade))

      const resolveTx = async () => {
        const options: MarketTradeOptions = {
          setToCollateral: trade.collateral?.amount,
          isBaseCollateral: trade.collateral?.isBase,
        }
        const { tx, disabledReason } = !position
          ? await market.trade(
              account.address,
              trade.option().strike().id,
              trade.option().isCall,
              trade.isBuy,
              trade.size,
              trade.slippage,
              options
            )
          : await position.trade(trade.isBuy, trade.size, trade.slippage, options)

        if (!tx) {
          throw new Error(disabledReason ? getTradeDisabledMessage(disabledReason) : 'Something went wrong')
        }
        return tx
      }
      const receipt = await execute(resolveTx(), {
        onComplete: async receipt => {
          const mutatePromise = Promise.all(
            filterNulls([
              mutateOpenPositions(),
              position ? mutatePosition(market.name, position.id) : null,
              position ? mutatePosition(market.address, position.id) : null,
              mutateAccount(),
            ])
          )
          const [events] = await Promise.all([getLyraSDK(network).events(receipt), mutatePromise])
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
    }, [
      trade,
      network,
      account,
      execute,
      onTrade,
      position,
      market,
      mutateOpenPositions,
      mutateAccount,
      mutatePosition,
    ])

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
        network={trade.lyra.network}
        transactionType={transactionType}
        onClick={handleClickTrade}
        isDisabled={trade.isDisabled}
        label={getTradeButtonLabel(trade)}
        {...styleProps}
      />
    )
  },
  ({ trade, onTrade, ...styleProps }) => <ButtonShimmer size="lg" width="100%" {...styleProps} />
)
export default TradeFormButton

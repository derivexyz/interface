import Box from '@lyra/ui/components/Box'
import Button, { ButtonVariant } from '@lyra/ui/components/Button'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import { AccountBalances, Market, MarketTradeOptions, Trade, TradeDisabledReason } from '@lyrafinance/lyra-js'
import React, { useCallback, useMemo, useState } from 'react'

import { MAX_BN, UNIT, ZERO_BN } from '@/app/constants/bn'
import { LogEvent } from '@/app/constants/logEvents'
import { Network } from '@/app/constants/networks'
import { TransactionType } from '@/app/constants/screen'
import OnboardingModal, { OnboardingModalStep } from '@/app/containers/common/OnboardingModal'
import useOptimismToken from '@/app/hooks/data/useOptimismToken'
import withSuspense from '@/app/hooks/data/withSuspense'
import useEthBalance from '@/app/hooks/erc20/useEthBalance'
import useAccount from '@/app/hooks/market/useAccount'
import useBalances, { useMutateBalances } from '@/app/hooks/market/useBalances'
import useTradeWithSwap from '@/app/hooks/market/useTradeWithSwap'
import { useMutateOpenPositions } from '@/app/hooks/position/useOpenPositions'
import { useMutatePosition } from '@/app/hooks/position/usePosition'
import useTransaction from '@/app/hooks/transaction/useTransaction'
import { to18DecimalBN } from '@/app/utils/convertBNDecimals'
import filterNulls from '@/app/utils/filterNulls'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getTradeLogData from '@/app/utils/getTradeLogData'
import isOptimismMainnet from '@/app/utils/isOptimismMainnet'
import logEvent from '@/app/utils/logEvent'
import lyra from '@/app/utils/lyra'

import TestFaucetModal from '../../common/TestFaucetModal'
import TransactionButton from '../../common/TransactionButton'

const MAX_PRICE_IMPACT_WITH_SWAP = 0.05

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
    case TradeDisabledReason.PositionWrongOwner:
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
  }
}

const getTradeButtonProps = (
  trade: Trade,
  balances: AccountBalances,
  priceImpactWithSwap: number
): {
  label: string
  variant: ButtonVariant
  isOutline: boolean
  isDisabled: boolean
} => {
  const position = trade.position()
  const option = trade.option()
  const isBuy = trade.isBuy
  const isClose = !!position && position.isLong !== isBuy && !trade.size.isZero()

  const quoteToken = balances.stable(trade.quoteToken.address)
  const baseToken = balances.base(trade.baseToken.address)
  const optionToken = balances.optionToken(trade.market().address)

  const quoteTokenBalance =
    quoteToken.decimals !== 18 ? to18DecimalBN(quoteToken.balance, quoteToken.decimals) : quoteToken.balance
  const baseTokenBalance = baseToken.balance

  const isInsufficientBalance =
    quoteTokenBalance.lt(trade.quoteToken.transfer) || baseTokenBalance.lt(trade.baseToken.transfer)

  const priceImpactTooHigh = priceImpactWithSwap > MAX_PRICE_IMPACT_WITH_SWAP

  if (isInsufficientBalance) {
    return {
      label: 'Insufficient Balance',
      variant: 'default',
      isOutline: false,
      isDisabled: true,
    }
  } else if (priceImpactTooHigh) {
    return {
      label: 'Price impact too high',
      variant: 'default',
      isOutline: false,
      isDisabled: true,
    }
  } else if (trade.isDisabled) {
    return {
      label: trade.disabledReason ? getTradeDisabledMessage(trade.disabledReason) : 'Something went wrong',
      variant: 'default',
      isOutline: false,
      isDisabled: true,
    }
  }

  // For approvals, render disabled label text
  const isInsufficientQuoteAllowance = quoteToken.allowance.lt(trade.quoteToken.transfer)
  const isInsufficientBaseAllowance = baseToken.allowance.lt(trade.baseToken.transfer)
  const isOptionTokenApprovalRequired = !!position && !optionToken.isApprovedForAll
  const isApprovalRequired =
    isInsufficientQuoteAllowance || isInsufficientBaseAllowance || isOptionTokenApprovalRequired

  if (position?.collateral && trade.collateral && trade.isCollateralUpdate) {
    const isAdd = trade.collateral.amount.gt(position.collateral.amount)
    return {
      label: isAdd ? 'Add Collateral' : 'Remove Collateral',
      variant: isAdd ? 'primary' : 'error',
      isOutline: false,
      isDisabled: isApprovalRequired,
    }
  } else if (isClose) {
    return {
      label: 'Close Position',
      variant: 'error',
      isOutline: true,
      isDisabled: isApprovalRequired,
    }
  } else {
    return {
      label: `${isBuy ? 'Buy' : 'Sell'} ${option.isCall ? 'Call' : 'Put'}`,
      variant: isBuy ? 'primary' : 'error',
      isOutline: false,
      isDisabled: isApprovalRequired,
    }
  }
}

const TradeFormButton = withSuspense(
  ({ onTrade, trade, ...styleProps }: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isApproveLoading, setIsApproveLoading] = useState(false)
    const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false)
    const [isFaucetOpen, setIsFaucetOpen] = useState(false)
    const option = trade.option()
    const position = trade.position()
    const market = option.market()
    const mutateOpenPositions = useMutateOpenPositions()
    const optimismQuoteToken = useOptimismToken(trade.quoteToken.address)
    const optimismBaseToken = useOptimismToken(trade.baseToken.address)
    const balances = useBalances()
    const ethBalance = useEthBalance(Network.Optimism)
    const account = useAccount()
    const mutateAccount = useMutateBalances()
    const mutatePosition = useMutatePosition()

    const quoteToken = balances.stable(trade.quoteToken.address)
    const baseToken = balances.base(trade.market().address)
    const optionToken = balances.optionToken(trade.market().address)
    const quoteTokenBalance =
      quoteToken.decimals !== 18 ? to18DecimalBN(quoteToken.balance, quoteToken.decimals) : quoteToken.balance

    const tradeWithSwap = useTradeWithSwap(trade, quoteToken.address, quoteToken.decimals)

    // TODO: @dappbeast Fix this logic
    const priceImpactWithSwap = useMemo(() => {
      const divisor = trade.quoteToken.transfer.gt(0) ? trade.quoteToken.transfer : trade.quoteToken.receive
      return quoteToken.address !== trade.market().quoteToken.address &&
        tradeWithSwap &&
        tradeWithSwap.premium.gt(ZERO_BN) &&
        !divisor.isZero()
        ? Math.abs(
            1 -
              fromBigNumber(
                (tradeWithSwap.quoteToken.transfer.gt(0)
                  ? tradeWithSwap.quoteToken.transfer
                  : tradeWithSwap.quoteToken.receive
                )
                  .mul(UNIT)
                  .div(divisor)
              )
          )
        : 0
    }, [tradeWithSwap, trade, quoteToken])

    const isInsufficientQuoteAllowance = quoteToken.allowance.lt(trade.quoteToken.transfer)
    const isInsufficientBaseAllowance = baseToken.allowance.lt(trade.baseToken.transfer)
    const isOptionTokenApprovalRequired = !!position && !optionToken.isApprovedForAll

    const isInsufficientQuoteBalance = quoteTokenBalance.lt(trade.quoteToken.transfer)
    const isInsufficientBaseBalance = baseToken.balance.lt(trade.baseToken.transfer)
    const isInsufficientBalance = isInsufficientQuoteBalance || isInsufficientBaseBalance

    const execute = useTransaction()

    const handleClickApproveQuote = useCallback(async () => {
      logEvent(LogEvent.TradeApproveSubmit, { isBase: false })
      if (!account || !quoteToken) {
        console.warn('Account or quote token does not exist')
        return null
      }
      setIsApproveLoading(true)
      const tx = await account.approveStableToken(quoteToken.address, MAX_BN)
      await execute(tx, {
        onComplete: () => {
          mutateAccount()
          logEvent(LogEvent.TradeApproveSuccess, {
            isBase: false,
          })
        },
        onError: () => logEvent(LogEvent.TradeApproveError, { isBase: false }),
      })
      setIsApproveLoading(false)
    }, [account, quoteToken, execute, mutateAccount])

    const handleClickApproveBase = useCallback(async () => {
      logEvent(LogEvent.TradeApproveSubmit, { isBase: true })
      if (!account || !market) {
        console.warn('Account or market does not exist')
        return null
      }
      setIsApproveLoading(true)
      const tx = await account.approveBaseToken(market.baseToken.address, MAX_BN)
      await execute(tx, {
        onComplete: () => {
          mutateAccount()
          logEvent(LogEvent.TradeApproveSuccess, { isBase: true })
        },
        onError: () => logEvent(LogEvent.TradeApproveError, { isBase: true }),
      })
      setIsApproveLoading(false)
    }, [account, market, execute, mutateAccount])

    const handleClickApproveOptionToken = useCallback(async () => {
      if (!account) {
        console.warn('Account does not exist')
        return null
      }
      setIsApproveLoading(true)
      const tx = await account.approveOptionToken(market.address, true)
      await execute(tx, {
        onComplete: mutateAccount,
      })
      setIsApproveLoading(false)
    }, [account, market.address, execute, mutateAccount])

    const handleClickTrade = useCallback(async () => {
      if (!trade || !account) {
        console.warn('Account or market does not exist')
        return
      }
      setIsLoading(true)

      logEvent(LogEvent.TradeSubmit, getTradeLogData(trade))

      const resolveTx = async () => {
        const options: MarketTradeOptions = {
          setToCollateral: trade.collateral?.amount,
          isBaseCollateral: trade.collateral?.isBase,
          inputAsset: {
            address: quoteToken?.address,
            decimals: quoteToken?.decimals,
          },
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
          : await position.trade(trade.isBuy, trade.size, trade.slippage, {
              ...options,
              inputAsset: {
                address: quoteToken?.address,
                decimals: quoteToken?.decimals,
              },
            })

        if (!tx) {
          setIsLoading(false)
          throw new Error(disabledReason ? getTradeDisabledMessage(disabledReason) : 'Something went wrong')
        }
        return tx
      }
      const receipt = await execute(resolveTx(), {
        onComplete: async receipt => {
          const mutatePromise = Promise.all(
            filterNulls([
              mutateOpenPositions(),
              mutateAccount(),
              position ? mutatePosition(market.name, position.id) : null,
            ])
          )
          const [events] = await Promise.all([lyra.events(receipt), mutatePromise])
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
      setIsLoading(false)
    }, [
      trade,
      account,
      execute,
      onTrade,
      quoteToken?.address,
      quoteToken?.decimals,
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

    const isApprovalRequired =
      isInsufficientQuoteAllowance || isInsufficientBaseAllowance || isOptionTokenApprovalRequired

    const swapButton = (
      <>
        {isOptimismMainnet() ? (
          <TransactionButton
            transactionType={transactionType}
            hideIfNotReady
            sx={{ width: '100%' }}
            variant="primary"
            size="lg"
            label={`Swap to ${isInsufficientQuoteBalance ? 'Stables' : 'Synths'}`}
            onClick={() => setIsOnboardingModalOpen(true)}
          />
        ) : (
          <TransactionButton
            transactionType={transactionType}
            hideIfNotReady
            sx={{ width: '100%' }}
            size="lg"
            variant="primary"
            label={`Drip ${isInsufficientQuoteBalance ? 'Stables' : 'Synths'}`}
            onClick={() => setIsFaucetOpen(true)}
          />
        )}
        {/* Disabled trading button */}
        <Button
          mt={3}
          size="lg"
          width="100%"
          {...getTradeButtonProps(trade, balances, priceImpactWithSwap)}
          isDisabled
        />
      </>
    )

    const approveButton = (
      <>
        <TransactionButton
          transactionType={transactionType}
          hideIfNotReady
          size="lg"
          sx={{ width: '100%' }}
          isLoading={isApproveLoading}
          variant="primary"
          onClick={
            isInsufficientQuoteAllowance
              ? handleClickApproveQuote
              : isInsufficientBaseAllowance
              ? handleClickApproveBase
              : isOptionTokenApprovalRequired
              ? handleClickApproveOptionToken
              : undefined
          }
          label={
            isInsufficientQuoteAllowance
              ? `Allow Lyra to use your ${quoteToken.symbol}`
              : isInsufficientBaseAllowance
              ? `Allow Lyra to use your ${market.baseToken.symbol}`
              : isOptionTokenApprovalRequired
              ? `Allow Lyra to ${trade.newSize.isZero() ? 'close' : 'modify'} your position`
              : 'Something went wrong'
          }
        />
        {/* Disabled trading button */}
        <Button
          mt={3}
          size="lg"
          width="100%"
          {...getTradeButtonProps(trade, balances, priceImpactWithSwap)}
          isDisabled
        />
      </>
    )

    const tradeButton = (
      <TransactionButton
        transactionType={transactionType}
        size="lg"
        sx={{ width: '100%' }}
        isLoading={isLoading}
        onClick={handleClickTrade}
        {...getTradeButtonProps(trade, balances, priceImpactWithSwap)}
      />
    )

    return (
      <Box {...styleProps}>
        {isInsufficientBalance ? swapButton : isApprovalRequired ? approveButton : tradeButton}
        <TestFaucetModal isOpen={isFaucetOpen} onClose={() => setIsFaucetOpen(false)} />
        <OnboardingModal
          isOpen={isOnboardingModalOpen}
          onClose={() => setIsOnboardingModalOpen(false)}
          step={ethBalance.eq(0) ? OnboardingModalStep.GetETH : OnboardingModalStep.GetTokens}
          toToken={
            isInsufficientQuoteBalance ? optimismQuoteToken : isInsufficientBaseBalance ? optimismBaseToken : null
          }
        />
      </Box>
    )
  },
  ({ trade, onTrade, ...styleProps }) => <ButtonShimmer size="lg" width="100%" {...styleProps} />
)
export default TradeFormButton

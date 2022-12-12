import { BigNumber } from '@ethersproject/bignumber'
import { Trade } from '@lyrafinance/lyra-js'
import { useCallback, useEffect, useState } from 'react'

import { ZERO_ADDRESS } from '@/app/constants/bn'
import debounce from '@/app/utils/debounce'
import lyra from '@/app/utils/lyra'

import useFetch from '../data/useFetch'
import useWalletAccount from '../wallet/useWalletAccount'

const fetcher = async (
  account: string,
  marketAddress: string,
  strikeId: number,
  isCall: boolean,
  isBuy: boolean,
  size: BigNumber,
  premiumSlippage: number,
  positionId?: number,
  setToCollateral?: BigNumber | null,
  isBaseCollateral?: boolean,
  stableAddress?: string,
  stableDecimals?: number
) => {
  return await Trade.get(lyra, account, marketAddress, strikeId, isCall, isBuy, BigNumber.from(size), {
    positionId,
    setToCollateral: setToCollateral ? BigNumber.from(setToCollateral) : undefined,
    isBaseCollateral,
    premiumSlippage,
    inputAsset:
      stableAddress && stableDecimals
        ? {
            address: stableAddress,
            decimals: stableDecimals,
          }
        : undefined,
  })
}

export default function useTradeWithSwap(trade: Trade, stableAddress: string, stableDecimals: number): Trade | null {
  const account = useWalletAccount() ?? ZERO_ADDRESS
  const isSUSD = stableAddress === trade.market().quoteToken.address

  const [debouncedTrade, _setDebouncedTrade] = useState(trade)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setDebouncedTrade = useCallback(debounce(_setDebouncedTrade), [_setDebouncedTrade])
  useEffect(() => {
    setDebouncedTrade(trade)
  }, [setDebouncedTrade, trade])

  const [tradeWithSwap] = useFetch(
    'TradeWithSwap',
    !isSUSD
      ? [
          account,
          debouncedTrade.marketAddress,
          debouncedTrade.strikeId,
          debouncedTrade.isCall,
          debouncedTrade.isBuy,
          debouncedTrade.size,
          debouncedTrade.slippage,
          debouncedTrade.positionId,
          debouncedTrade.collateral?.amount,
          debouncedTrade.collateral?.isBase,
          stableAddress,
          stableDecimals,
        ]
      : null,
    fetcher
  )
  return isSUSD ? trade : tradeWithSwap
}

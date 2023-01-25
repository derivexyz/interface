import { BigNumber } from '@ethersproject/bignumber'
import { AccountBalances, Option, Position, Trade } from '@lyrafinance/lyra-js'
import { useMemo } from 'react'

import { ZERO_ADDRESS } from '@/app/constants/bn'

import useWalletAccount from '../account/useWalletAccount'

export default function useTradeSync({
  option,
  isBuy,
  size,
  slippage,
  position,
  balances,
  setToCollateral,
  isBaseCollateral,
}: {
  option: Option
  isBuy: boolean
  size: BigNumber
  slippage: number
  balances: AccountBalances
  position?: Position | null
  setToCollateral?: BigNumber | null
  isBaseCollateral?: boolean
}): Trade {
  const account = useWalletAccount() ?? ZERO_ADDRESS
  return useMemo(() => {
    return Trade.getSync(option.lyra, account, option, isBuy, size, balances, {
      position: position ?? undefined,
      setToCollateral: setToCollateral ?? undefined,
      isBaseCollateral,
      slippage,
    })
  }, [option, account, isBuy, size, balances, position, setToCollateral, isBaseCollateral, slippage])
}

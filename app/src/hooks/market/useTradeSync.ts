import { BigNumber } from '@ethersproject/bignumber'
import { AccountBalances, Option, Position, Trade } from '@lyrafinance/lyra-js'
import { useMemo } from 'react'

import { ZERO_ADDRESS } from '@/app/constants/bn'
import { ITERATIONS } from '@/app/constants/contracts'

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
  referrer,
}: {
  option: Option
  isBuy: boolean
  size: BigNumber
  slippage: number
  balances: AccountBalances
  position?: Position | null
  setToCollateral?: BigNumber | null
  isBaseCollateral?: boolean
  referrer?: string
}): Trade {
  const account = useWalletAccount() ?? ZERO_ADDRESS
  return useMemo(() => {
    const trade = Trade.getSync(option.lyra, account, option, isBuy, size, slippage, balances, {
      position: position ?? undefined,
      setToCollateral: setToCollateral ?? undefined,
      isBaseCollateral,
      iterations: ITERATIONS,
      referrer,
    })
    return trade
  }, [option, account, isBuy, size, slippage, balances, position, setToCollateral, isBaseCollateral, referrer])
}

import { BigNumber } from '@ethersproject/bignumber'
import lyra from '@lyra/app/utils/lyra'
import { Option, Position, Trade } from '@lyrafinance/lyra-js'
import { useMemo } from 'react'

import { ZERO_ADDRESS } from '@/app/constants/bn'

import useWalletAccount from '../wallet/useWalletAccount'

export default function useTradeSync({
  option,
  isBuy,
  size,
  slippage: premiumSlippage,
  position,
  setToCollateral,
  isBaseCollateral,
  stableAddress,
  stableDecimals,
}: {
  option: Option
  isBuy: boolean
  size: BigNumber
  slippage: number
  position?: Position | null
  setToCollateral?: BigNumber | null
  isBaseCollateral?: boolean
  stableAddress: string
  stableDecimals: number
}): Trade {
  const account = useWalletAccount() ?? ZERO_ADDRESS
  return useMemo(() => {
    return Trade.getSync(lyra, account, option, isBuy, size, {
      position: position ?? undefined,
      setToCollateral: setToCollateral ?? undefined,
      isBaseCollateral,
      premiumSlippage,
      inputAsset: {
        address: stableAddress,
        decimals: stableDecimals,
      },
    })
  }, [
    option,
    isBuy,
    size,
    premiumSlippage,
    setToCollateral,
    isBaseCollateral,
    stableAddress,
    stableDecimals,
    account,
    position,
  ])
}

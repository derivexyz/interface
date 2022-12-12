import { BigNumber } from '@ethersproject/bignumber'
import { Option, OptionQuotes } from '@lyrafinance/lyra-js'
import { useMemo } from 'react'

export default function useOptionQuotesSync(option: Option, size: BigNumber): OptionQuotes {
  return useMemo(() => option.quoteAllSync(size), [option, size])
}

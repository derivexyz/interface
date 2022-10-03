import { Option } from '@lyrafinance/lyra-js'

import lyra from '@/app/utils/lyra'

import useOptimismBlockFetch from '../data/useOptimismBlockFetch'

export const fetchOption = async (marketId: string, strikeId: number, isCall: boolean): Promise<Option> =>
  await lyra.option(marketId, strikeId, isCall)

export default function useOption(
  marketId: string | null,
  strikeId: number | null,
  isCall: boolean | null
): Option | null {
  const [option] = useOptimismBlockFetch(
    'Option',
    marketId && strikeId && isCall !== null ? [marketId, strikeId, isCall] : null,
    fetchOption
  )
  return option
}

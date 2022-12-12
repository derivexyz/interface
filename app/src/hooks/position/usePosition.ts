import { Option, Position } from '@lyrafinance/lyra-js'
import { useMemo } from 'react'

import lyra from '@/app/utils/lyra'

import useFetch, { useMutate } from '../data/useFetch'

export const fetchPosition = async (
  marketAddressOrName: string,
  positionId: number
): Promise<{ position: Position; option: Option }> => {
  const position = await lyra.position(marketAddressOrName, positionId)
  const option = await position.option()
  return { position, option }
}

export const useMutatePosition = () => {
  return useMutate('Position', fetchPosition)
}

export default function usePosition(
  marketAddressOrName: string | null,
  positionId: number | null
): { position: Position | null; option: Option | null } {
  const [positionAndOption] = useFetch(
    'Position',
    marketAddressOrName && positionId ? [marketAddressOrName, positionId] : null,
    fetchPosition
  )
  return useMemo(
    () => ({ option: positionAndOption?.option ?? null, position: positionAndOption?.position ?? null }),
    [positionAndOption]
  )
}

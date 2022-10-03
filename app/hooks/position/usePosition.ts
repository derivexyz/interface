import { Position } from '@lyrafinance/lyra-js'

import lyra from '@/app/utils/lyra'

import useFetch, { useMutate } from '../data/useFetch'

export const fetchPosition = async (marketAddressOrName: string, positionId: number): Promise<Position> => {
  return await lyra.position(marketAddressOrName, positionId)
}

export const useMutatePosition = () => {
  return useMutate('Position', fetchPosition)
}

export default function usePosition(marketAddressOrName: string | null, positionId: number | null): Position | null {
  const [position] = useFetch(
    'Position',
    marketAddressOrName && positionId ? [marketAddressOrName, positionId] : null,
    fetchPosition
  )
  return position
}

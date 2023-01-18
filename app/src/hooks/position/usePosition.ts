import { Network, Option, Position } from '@lyrafinance/lyra-js'
import Lyra from '@lyrafinance/lyra-js'
import { useMemo } from 'react'

import getLyraSDK from '@/app/utils/getLyraSDK'

import { useLyraFetch, useLyraMutate } from '../data/useLyraFetch'

export const fetchPosition = async (
  lyra: Lyra,
  marketAddressOrName: string,
  positionId: number
): Promise<{ position: Position; option: Option }> => {
  const position = await lyra.position(marketAddressOrName, positionId)
  const option = await position.option()
  return { position, option }
}

export const useMutatePosition = (lyra: Lyra) => {
  return useLyraMutate('Position', lyra, fetchPosition)
}

export default function usePosition(
  network: Network | null,
  marketAddressOrName: string | null,
  positionId: number | null
): { position: Position | null; option: Option | null } {
  const [positionAndOption] = useLyraFetch(
    'Position',
    network ? getLyraSDK(network) : null,
    marketAddressOrName && positionId ? [marketAddressOrName, positionId] : null,
    fetchPosition
  )
  return useMemo(
    () => ({ option: positionAndOption?.option ?? null, position: positionAndOption?.position ?? null }),
    [positionAndOption]
  )
}

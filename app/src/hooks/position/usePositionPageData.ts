import coerce from '@lyra/ui/utils/coerce'
import { Network, Option, Position } from '@lyrafinance/lyra-js'
import { useMemo } from 'react'
import { useCallback } from 'react'
import { useParams } from 'react-router'

import { FetchId } from '@/app/constants/fetch'
import getLyraSDK from '@/app/utils/getLyraSDK'
import getPageHeartbeat from '@/app/utils/getPageHeartbeat'

import useFetch, { useMutate } from '../data/useFetch'

const fetchPositionPageData = async (
  network: Network,
  marketAddressOrName: string,
  positionId: number
): Promise<{ position: Position; option: Option }> => {
  const lyra = getLyraSDK(network)
  const position = await lyra.position(marketAddressOrName, positionId)
  const option = await position.option()
  return { position, option }
}

export default function usePositionPageData(): { position: Position | null; option: Option | null } {
  const { marketAddressOrName = null, positionId: positionIdStr, network: networkStr } = useParams()
  const network = coerce(Network, networkStr) ?? null
  const positionId = positionIdStr ? parseInt(positionIdStr) : NaN

  const [positionAndOption] = useFetch(
    FetchId.PositionPageData,
    marketAddressOrName && positionId && network ? [network, marketAddressOrName, positionId] : null,
    fetchPositionPageData,
    { refreshInterval: network ? getPageHeartbeat(network) : undefined }
  )

  return useMemo(
    () => ({ option: positionAndOption?.option ?? null, position: positionAndOption?.position ?? null }),
    [positionAndOption]
  )
}

export const useMutatePositionPageData = () => {
  const { marketAddressOrName = null, positionId: positionIdStr, network: networkStr } = useParams()
  const network = coerce(Network, networkStr) ?? null
  const positionId = positionIdStr ? parseInt(positionIdStr) : NaN

  const mutate = useMutate(FetchId.PositionPageData, fetchPositionPageData)

  return useCallback(
    async () =>
      marketAddressOrName && positionId && network ? await mutate(network, marketAddressOrName, positionId) : null,
    [marketAddressOrName, mutate, network, positionId]
  )
}

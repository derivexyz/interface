import { Network } from '@lyrafinance/lyra-js'
import { useCallback, useEffect, useMemo, useState } from 'react'

import useFetch, { FetchArg, FetchConfig, Fetcher, FetchResponse, useMutate } from './useFetch'

const getFetchKey = (network: Network | 'ethereum', queryId: string) => ['__web3__', network, queryId].join('-')

export const useBlockMutate = <Data, Args extends any[]>(
  network: Network | 'ethereum',
  queryId: string,
  fetcher: Fetcher<Data, Args> | null
) => {
  const mutate = useMutate(getFetchKey(network, queryId), fetcher)
  return useCallback(
    async (...params: Args) => {
      const data = await mutate(...params)
      return data
    },
    [network, queryId, fetcher, mutate]
  )
}

export type BlockFetchResponse<Data> = FetchResponse<Data>

// Polls data as blocks are mined
// TODO: Fix block polling
export default function useBlockFetch<Data, Args extends FetchArg[]>(
  network: Network | 'ethereum',
  queryId: string,
  _params: Args | null,
  fetcher: Fetcher<Data, Args>,
  config?: FetchConfig<Data, Args>
): FetchResponse<Data> {
  const dep = JSON.stringify(_params)
  // memoize params deeply, assuming no functions
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  const params = useMemo(() => _params ?? null, [dep])

  const [suspendedData] = useFetch(getFetchKey(network, queryId), params, fetcher, config)
  const [data, setData] = useState<Data | null>(suspendedData)

  // Update useFetch suspended changes
  useEffect(() => {
    if (data !== suspendedData) {
      setData(suspendedData)
    }
  }, [data, suspendedData])

  // For manual mutations, force latest block update
  const mutate = useMutate(getFetchKey(network, queryId), fetcher)
  const mutateWithParams = useCallback(async () => (params ? mutate(...params) : null), [mutate, params])

  // Refresh data as blocks update
  // TODO: Re-enable block polling
  // useBlockPoll(network, () => mutateWithParams(), [fetcher, mutateWithParams])

  return useMemo(() => [data, mutateWithParams], [data, mutateWithParams])
}

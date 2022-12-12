import { Network } from '@lyrafinance/lyra-js'

import useBlockFetch, { BlockFetchResponse, useBlockMutate } from './useBlockFetch'
import { FetchArg, FetchConfig, Fetcher } from './useFetch'

export const useOptimismBlockMutate = <Data, Args extends FetchArg[]>(
  queryId: string,
  fetcher: Fetcher<Data, Args>
) => {
  return useBlockMutate(Network.Optimism, queryId, fetcher)
}

export default function useOptimismBlockFetch<Data, Args extends FetchArg[]>(
  queryId: string,
  _params: Args | null,
  fetcher: Fetcher<Data, Args>,
  config?: FetchConfig<Data, Args>
): BlockFetchResponse<Data> {
  return useBlockFetch(Network.Optimism, queryId, _params, fetcher, config)
}

import { Network } from '@lyrafinance/lyra-js'

import useBlockFetch, { BlockFetchResponse, useBlockMutate } from './useBlockFetch'
import { FetchArg, FetchConfig, Fetcher } from './useFetch'

export const useArbitrumBlockMutate = <Data, Args extends FetchArg[]>(
  queryId: string,
  fetcher: Fetcher<Data, Args>
) => {
  return useBlockMutate(Network.Arbitrum, queryId, fetcher)
}

export default function useArbitrumBlockFetch<Data, Args extends FetchArg[]>(
  queryId: string,
  _params: Args | null,
  fetcher: Fetcher<Data, Args>,
  config?: FetchConfig<Data, Args>
): BlockFetchResponse<Data> {
  return useBlockFetch(Network.Arbitrum, queryId, _params, fetcher, config)
}

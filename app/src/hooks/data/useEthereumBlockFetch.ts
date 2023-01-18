import useBlockFetch, { BlockFetchResponse, useBlockMutate } from './useBlockFetch'
import { FetchArg, FetchConfig, Fetcher } from './useFetch'

export const useEthereumBlockMutate = <Data, Args extends FetchArg[]>(
  queryId: string,
  fetcher: Fetcher<Data, Args>
) => {
  return useBlockMutate('ethereum', queryId, fetcher)
}

export default function useEthereumBlockFetch<Data, Args extends FetchArg[]>(
  queryId: string,
  _params: Args | null,
  fetcher: Fetcher<Data, Args>,
  config?: FetchConfig<Data, Args>
): BlockFetchResponse<Data> {
  return useBlockFetch('ethereum', queryId, _params, fetcher, config)
}

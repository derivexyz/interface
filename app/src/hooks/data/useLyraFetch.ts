import Lyra from '@lyrafinance/lyra-js'

import useFetch, { createFetcherWithThrow, FetchArg, FetchConfig, FetchResponse, Mutate, useMutate } from './useFetch'

export type LyraFetcher<Data, Args extends FetchArg[]> = (lyra: Lyra, ...params: Args) => Promise<Data | null>

export const createLyraFetcher =
  <Data, Args extends FetchArg[]>(lyra: Lyra | null | undefined, fetcher: LyraFetcher<Data, Args>) =>
  async (...params: Args): Promise<Data | null> => {
    // HACK @michaelxuwu remove _queryId by position to avoid type error
    const _queryId = params[0]?.toString()
    if (!lyra || !_queryId) {
      return null
    }
    return await createFetcherWithThrow(fetcher)(_queryId, lyra, ...params)
  }

export function useLyraFetch<Data, Args extends FetchArg[]>(
  queryId: string,
  lyra: Lyra | null | undefined,
  params: Args | null,
  fetcher: LyraFetcher<Data, Args>,
  config?: FetchConfig<Data, Args>
): FetchResponse<Data> {
  // Wrap fetcher to remove queryId from fetcher arguments
  const wrappedFetcher = createLyraFetcher(lyra, fetcher)
  return useFetch(queryId, params, wrappedFetcher, config)
}

export const useLyraMutate = <Data, Args extends FetchArg[]>(
  queryId: string,
  lyra: Lyra | null | undefined,
  fetcher: LyraFetcher<Data, Args>
): Mutate<Data, Args> => {
  const wrappedFetcher = createLyraFetcher(lyra, fetcher)
  return useMutate(queryId, wrappedFetcher)
}

import { BigNumber, BigNumberish } from 'ethers'
import { useCallback, useMemo } from 'react'
import useSWR, { Arguments, mutate, SWRConfiguration } from 'swr'

import isServer from '@/app/utils/isServer'

export type Fetcher<Data, Args extends FetchArg[]> = (...params: Args) => Promise<Data | null>
// We do not support optimistic rendering for mutations yet, i.e. we always revalidate queries
export type Mutate<Data, Args extends FetchArg[]> = (...params: Args) => Promise<Data | null>
export type MutateWithParams<Data> = () => Promise<Data | null>
// Limited set of arguments supported by cache key
export type FetchArg = Arguments | number | boolean | BigNumberish
export type FetchKey<T extends FetchArg[]> = {
  [Key in keyof T]: T[Key] extends null ? undefined : T[Key] extends BigNumberish ? string : T[Key]
}
export type FetchResponse<Data> = [Data | null, MutateWithParams<Data>]
export type FetchConfig<Data, Args extends FetchArg[]> = Omit<
  SWRConfiguration<any, any, Fetcher<Data, Args>>,
  'fetcher'
>

const getFetchKey = <Args extends FetchArg[]>(queryId: string, params: Args): [string, ...Args] => [
  queryId,
  ...(getCacheKey(params) as Args),
]

function getCacheKey<T extends FetchArg[]>(args: T): FetchKey<T> {
  const key = args.map(arg => {
    if (arg === null || arg === undefined) {
      return null
    } else if (BigNumber.isBigNumber(arg)) {
      return arg.toString()
    } else if (typeof arg === 'object' && arg != null) {
      console.warn('attempting to use object / array as cache key:', arg)
      return JSON.stringify(arg)
    } else {
      return arg
    }
  })
  return key as FetchKey<T>
}

export const createFetcher =
  <Data, Args extends FetchArg[]>(fetcher: Fetcher<Data, Args>) =>
  async (_queryId: string, ...params: Args): Promise<Data | null> => {
    const _fetcher = createFetcherWithThrow(fetcher)
    try {
      return await _fetcher(_queryId, ...params)
    } catch (error) {
      return null
    }
  }

export const createFetcherWithThrow =
  <Data, Args extends FetchArg[]>(fetcher: Fetcher<Data, Args>) =>
  async (_queryId: string, ...params: Args): Promise<Data | null> => {
    if (!params || !fetcher) {
      return null
    }
    if (_queryId == null) {
      console.warn('missing queryId, returning null')
      return null
    }
    return await fetcher(...params)
  }

export const useMutate = <Data, Args extends FetchArg[]>(
  queryId: string,
  fetcher: Fetcher<Data, Args> | null
): Mutate<Data, Args> => {
  return useCallback(
    async (...params: Args): Promise<Data | null> => {
      if (!fetcher) {
        return null
      }
      const data = await fetcher(...params)
      console.debug('mutate', { queryId, params, data })
      return await mutate(getFetchKey(queryId, params), data, false)
    },
    [queryId, fetcher]
  )
}

export default function useFetch<Data, Args extends FetchArg[]>(
  queryId: string,
  _params: Args | null,
  fetcher: Fetcher<Data, Args>,
  config?: FetchConfig<Data, Args>
): FetchResponse<Data> {
  const dep = JSON.stringify(_params)
  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  const params = useMemo(() => _params, [dep])
  const fetchKey = params !== null ? getFetchKey(queryId, params) : null

  // Wrap fetcher to remove queryId from fetcher arguments
  const wrappedFetcher = !isServer() ? createFetcher(fetcher) : null
  // Suspended fetch
  const { data } = useSWR(fetchKey, wrappedFetcher, config)
  const mutate = useMutate(queryId, fetcher)
  const mutateWithParams = useCallback(async () => (params != null ? await mutate(...params) : null), [mutate, params])
  return useMemo(() => {
    return [data ?? null, mutateWithParams]
  }, [data, mutateWithParams])
}

import { useCallback, useMemo } from 'react'
import useSWR, { SWRConfiguration } from 'swr'
import { useSWRConfig } from 'swr'

import { FetchId } from '@/app/constants/fetch'

type FetchArg = string | number | boolean | null | undefined
export type Fetcher<Data, Args extends FetchArg[]> = (...args: Args) => Promise<Data | null>
export type Mutate<Data, Args extends FetchArg[]> = (...args: Args) => Promise<Data | null>

export const createFetcherWithFetchId =
  <Data, Args extends FetchArg[]>(fetcher: Fetcher<Data, Args>) =>
  async ([fetchId, ...args]: [FetchId, ...Args]): Promise<Data | null> => {
    if (!args) {
      return null
    }
    const data = await fetcher(...args)
    console.debug('fetch', fetchId, args, { data })
    return data
  }

export const useMutate = <Data, Args extends FetchArg[]>(
  fetchId: FetchId,
  _fetcher?: Fetcher<Data, Args> // Optionally use for type inference
): Mutate<Data, Args> => {
  const { mutate } = useSWRConfig()
  return useCallback(
    async (...args: Args) => {
      const data = await mutate<Data>([fetchId, ...args])
      console.debug('mutate', fetchId, args, { data })
      return data !== undefined ? data : null
    },
    [mutate, fetchId]
  )
}

export default function useFetch<Data, Args extends FetchArg[]>(
  fetchId: FetchId,
  args: Args | null,
  fetcher: Fetcher<Data, Args>,
  config?: Partial<SWRConfiguration<Data | null>>
): [Data | null, Mutate<Data, Args>] {
  const fetchKey: [FetchId, ...Args] | null = useMemo(
    () => (args ? [fetchId, ...args] : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(args), fetchId]
  )
  const fetcherWithQueryId = createFetcherWithFetchId(fetcher)
  const { data } = useSWR(fetchKey, fetcherWithQueryId, config)
  const mutate = useMutate<Data, Args>(fetchId)
  return useMemo(() => [data !== undefined ? data : null, mutate], [data, mutate])
}

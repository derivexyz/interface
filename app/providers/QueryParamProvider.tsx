import { useRouter } from 'next/router'
import React, { createContext, memo, useCallback, useEffect, useState } from 'react'

import emptyFunction from '../utils/emptyFunction'

type QueryParams = Record<string, string>

export const QueryParamContext = createContext<{
  queries: QueryParams
  setQuery: (key: string, val: string | null) => void
  resetQueryParams: () => void
}>({
  queries: {},
  setQuery: emptyFunction,
  resetQueryParams: emptyFunction,
})

export const QueryParamProvider = ({ children }: { children?: React.ReactNode }) => {
  const [queries, setQueries] = useState<QueryParams>({})
  const router = useRouter()

  const setQueryParam = useCallback(
    (key: string, val: string | null) => {
      if ('URLSearchParams' in window) {
        const newPath = new URL(window.location.href)
        if (val != null) {
          newPath.searchParams.set(key, val)
        } else {
          newPath.searchParams.delete(key)
        }
        router.replace(newPath, newPath, { shallow: true })
      }
    },
    [router]
  )

  const setQuery = (key: string, val: string | null) => {
    if (val != null) {
      setQueries(queries => ({
        ...queries,
        [key]: val,
      }))
    } else {
      setQueries(queries => {
        const queriesCopy = Object.assign({}, queries)
        delete queriesCopy[key]
        return queriesCopy
      })
    }
    setQueryParam(key, val)
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const initialQueries = Array.from(searchParams.entries()).reduce(
      (queries, [key, val]) => ({
        ...queries,
        [key]: val,
      }),
      {}
    )
    setQueries(initialQueries)
  }, [])
  const resetQueryParams = () => {
    setQueries({})
    history.replaceState(null, '', '')
  }
  return (
    <QueryParamContext.Provider value={{ queries, setQuery, resetQueryParams }}>{children}</QueryParamContext.Provider>
  )
}

export default memo(QueryParamProvider)

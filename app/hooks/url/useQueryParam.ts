import { useCallback, useContext, useMemo } from 'react'

import { QueryParamContext } from '../../providers/QueryParamProvider'

export default function useQueryParam(key: string): [string | null, (value: string | null) => void] {
  const { queries, setQuery } = useContext(QueryParamContext)
  const set = useCallback((val: string | null) => setQuery(key, val), [key])
  return useMemo(() => [queries[key] || null, set], [queries, key, set])
}

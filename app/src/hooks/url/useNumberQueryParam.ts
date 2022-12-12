import { useCallback } from 'react'

import useQueryParam from './useQueryParam'

export default function useNumberQueryParam(key: string): [number | null, (val: number | null) => void] {
  const [query, setQuery] = useQueryParam(key)
  const setNumber = useCallback((val: number | null) => setQuery(val ? val.toString() : null), [setQuery])
  return [query ? parseInt(query) : null, setNumber]
}

import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function useQueryParam(key: string): [string | null, (value: string | null) => void] {
  const [searchParams, setSearchParams] = useSearchParams()
  const set = useCallback(
    (val: string | null) =>
      setSearchParams(params => {
        if (val) {
          params.set(key, val)
        } else {
          params.delete(key)
        }
        return params
      }),
    [key, setSearchParams]
  )
  return useMemo(() => [searchParams.get(key) || null, set], [searchParams, key, set])
}

import React from 'react'

import useQueryParam from './useQueryParam'

type BoolQueryOptions = {
  isNullTrue?: boolean
}

export default function useBoolQueryParam(key: string, options?: BoolQueryOptions): [boolean, (val: boolean) => void] {
  const [query, setQuery] = useQueryParam(key)
  const setBool = React.useCallback(
    (val: boolean) => {
      setQuery(val ? '1' : '0')
    },
    [setQuery]
  )
  const isNullTrue = options?.isNullTrue ?? false
  return [(query === null && isNullTrue) || query === '1', setBool]
}

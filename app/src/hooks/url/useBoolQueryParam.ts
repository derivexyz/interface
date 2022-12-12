import React from 'react'

import useQueryParam from './useQueryParam'

export default function useBoolQueryParam(key: string): [boolean, (val: boolean) => void] {
  const [query, setQuery] = useQueryParam(key)
  const setBool = React.useCallback(
    (val: boolean) => {
      setQuery(val ? '1' : null)
    },
    [setQuery]
  )
  return [query === '1', setBool]
}

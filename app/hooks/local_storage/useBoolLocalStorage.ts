import React, { useCallback, useMemo } from 'react'

import useLocalStorage from './useLocalStorage'

export default function useBoolLocalStorage(key: string): [boolean, React.Dispatch<boolean>] {
  const [val, setItem] = useLocalStorage(key)
  const setBoolItem = useCallback((val: boolean) => setItem(val ? 'true' : null), [setItem])
  return useMemo(() => {
    const bool = val === 'true'
    return [bool, setBoolItem]
  }, [setBoolItem, val])
}

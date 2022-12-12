import React, { useCallback, useContext, useMemo, useRef } from 'react'

import { LocalStorageContext } from '@/app/providers/LocalStorageProvider'

export default function useLocalStorage<T extends string>(key: string): [T, React.Dispatch<T | null>] {
  const { localStorage, localStorageIsSet, setItem } = useContext(LocalStorageContext)
  const initialItemValue = useRef(window.localStorage.getItem(key)).current
  const setKeyItem = useCallback((val: string | null) => setItem(key, val), [key, setItem])
  return useMemo(() => {
    const val = localStorage[key] ?? (!localStorageIsSet[key] ? initialItemValue : null)
    return [val as T, setKeyItem]
  }, [initialItemValue, key, localStorage, localStorageIsSet, setKeyItem])
}

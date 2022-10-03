import React, { useCallback, useContext, useMemo, useRef } from 'react'

import { LocalStorageContext } from '@/app/providers/LocalStorageProvider'
import isServer from '@/app/utils/isServer'

export default function useLocalStorage(key: string): [string, React.Dispatch<string | null>] {
  const { localStorage, localStorageIsSet, setItem } = useContext(LocalStorageContext)
  const initialItemValue = useRef(!isServer() ? window.localStorage.getItem(key) : null).current
  const setKeyItem = useCallback((val: string | null) => setItem(key, val), [key, setItem])
  return useMemo(() => {
    const val = localStorage[key] ?? (!localStorageIsSet[key] ? initialItemValue : null)
    return [val, setKeyItem]
  }, [initialItemValue, key, localStorage, localStorageIsSet, setKeyItem])
}

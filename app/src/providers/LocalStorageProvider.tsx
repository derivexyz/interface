import React, { createContext, memo, useState } from 'react'

import emptyFunction from '../utils/emptyFunction'

type LocalStorage = Record<string, string>
type LocalStorageIsSet = Record<string, boolean>

export const LocalStorageContext = createContext<{
  localStorage: LocalStorage
  localStorageIsSet: LocalStorageIsSet
  setItem: (key: string, val: string | null) => void
}>({
  localStorage: {},
  localStorageIsSet: {},
  setItem: emptyFunction,
})

export const LocalStorageProvider = ({ children }: { children?: React.ReactNode }) => {
  const [localStorage, setLocalStorage] = useState<LocalStorage>({})
  const [localStorageIsSet, setLocalStorageIsSet] = useState<LocalStorageIsSet>({})
  const setItem = (key: string, val: string | null) => {
    setLocalStorageIsSet(localStorageIsSet => ({
      ...localStorageIsSet,
      [key]: true,
    }))
    if (val != null) {
      setLocalStorage(localStorage => ({
        ...localStorage,
        [key]: val,
      }))
      window.localStorage.setItem(key, val)
    } else {
      setLocalStorage(localStorage => {
        const localStorageCopy = Object.assign({}, localStorage)
        delete localStorageCopy[key]
        return localStorageCopy
      })
      window.localStorage.removeItem(key)
    }
  }
  return (
    <LocalStorageContext.Provider value={{ localStorage, localStorageIsSet, setItem }}>
      {children}
    </LocalStorageContext.Provider>
  )
}

export default memo(LocalStorageProvider)

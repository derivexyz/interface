import { Dispatch, useCallback } from 'react'
import { useColorMode } from 'theme-ui'

import emptyFunction from '../utils/emptyFunction'

export default function useIsDarkMode(isDefaultDarkMode?: boolean): [boolean, Dispatch<boolean>] {
  try {
    const [colorMode, setColorMode] = useColorMode<'dark' | 'light'>('dark')
    const isDarkMode = colorMode === 'dark'
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const setIsDarkMode = useCallback(
      (isDarkMode: boolean) => {
        setColorMode(isDarkMode ? 'dark' : 'light')
      },
      [setColorMode]
    )
    return [isDarkMode, setIsDarkMode]
  } catch (err) {
    // server-side
    return [!!isDefaultDarkMode, emptyFunction]
  }
}

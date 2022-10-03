import { useResponsiveValue } from '@theme-ui/match-media'

import { ResponsiveValue } from '../types'

function useThemeValue(arg: ResponsiveValue | null = null): number | string {
  let arr = arg
  if (arg == null) {
    arr = []
  } else if (!Array.isArray(arg)) {
    arr = [arg.toString()]
  }
  return useResponsiveValue(arr)
}

export default useThemeValue

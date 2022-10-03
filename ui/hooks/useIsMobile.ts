import isServer from '@lyra/ui/utils/isServer'
import { useBreakpointIndex } from '@theme-ui/match-media'

export default function useIsMobile(): boolean {
  const index = useBreakpointIndex()
  if (isServer()) {
    // default to non-mobile
    return false
  }
  // theme has 2 breakpoints
  return index === 0
}

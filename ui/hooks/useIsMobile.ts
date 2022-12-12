import { useBreakpointIndex } from '@theme-ui/match-media'

export default function useIsMobile(): boolean {
  const index = useBreakpointIndex()
  // theme has 2 breakpoints
  return index === 0
}

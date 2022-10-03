import { Board } from '@lyrafinance/lyra-js'

import useIsGlobalPaused from './useIsGlobalPaused'

export default function useIsPaused(board?: Board): boolean {
  const isGlobalPaused = useIsGlobalPaused()
  return isGlobalPaused || !!board?.market().isPaused || !!board?.isPaused
}

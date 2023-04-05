import { Board } from '@lyrafinance/lyra-js'
import { useCallback, useEffect, useMemo } from 'react'

import useNumberQueryParam from '../url/useNumberQueryParam'

export default function useQueryStrikeIdSync(board: Board | null): [number | null, (strikeId: number | null) => void] {
  const liveStrikes = useMemo(() => board?.strikes() ?? [], [board])

  const [queryStrikeId, setQueryStrikeId] = useNumberQueryParam('strike')

  const strike = useMemo(() => liveStrikes.find(b => b.id === queryStrikeId) ?? null, [queryStrikeId, liveStrikes])

  const strikeId = strike?.id ?? null

  const setStrikeId = useCallback(
    (strikeId: number | null) => {
      const strike = strikeId && liveStrikes.find(s => s.id === strikeId)
      if (strike) {
        setQueryStrikeId(strike.id)
      } else {
        setQueryStrikeId(null)
      }
    },
    [liveStrikes, setQueryStrikeId]
  )

  // always set or reset strike query param when board changes
  useEffect(() => {
    setStrikeId(strikeId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board?.id])

  return useMemo(() => [strikeId, setStrikeId], [setStrikeId, strikeId])
}

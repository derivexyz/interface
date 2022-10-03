import { Position } from '@lyrafinance/lyra-js'

import lyra from '@/app/utils/lyra'

import useFetch from '../data/useFetch'
import useWalletAccount from '../wallet/useWalletAccount'

const fetcher = async (owner: string, includeOpen: boolean): Promise<Position[]> => {
  const positions = await lyra.positions(owner)
  return positions
    .filter(p => includeOpen || !p.isOpen)
    .sort((a, b) => {
      const at = a.isSettled ? a.expiryTimestamp : a.lastTrade()?.timestamp ?? 0
      const bt = b.isSettled ? b.expiryTimestamp : b.lastTrade()?.timestamp ?? 0
      return bt - at
    })
}

const EMPTY: Position[] = []

export default function usePositionHistory(includeOpen = false): Position[] {
  const owner = useWalletAccount()
  const [positions] = useFetch('OwnerPositionHistory', owner ? [owner, includeOpen] : null, fetcher)
  return positions ?? EMPTY
}

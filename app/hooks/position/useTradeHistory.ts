import { CollateralUpdateEvent, Position, SettleEvent, TradeEvent } from '@lyrafinance/lyra-js'

import filterNulls from '@/app/utils/filterNulls'
import lyra from '@/app/utils/lyra'

import useFetch from '../data/useFetch'
import useWalletAccount from '../wallet/useWalletAccount'

// TODO: @dappbeast Add TransferEvent
const fetcher = async (
  owner: string
): Promise<{ event: TradeEvent | CollateralUpdateEvent | SettleEvent; position: Position }[]> => {
  const positions = await lyra.positions(owner)
  const trades = positions.flatMap(position => position.trades().map(event => ({ event, position })))
  const collateralUpdates = positions.flatMap(position =>
    position.collateralUpdates().map(event => ({ event, position }))
  )
  const settles = filterNulls(
    positions.map(position => {
      const settle = position.settle()
      return settle ? { event: settle, position } : null
    })
  )
  return [...trades, ...collateralUpdates.filter(c => c.event.isAdjustment), ...settles].sort(
    (a, b) => b.event.blockNumber - a.event.blockNumber
  )
}

const EMPTY: { event: TradeEvent | CollateralUpdateEvent | SettleEvent; position: Position }[] = []

export default function useTradeHistory(): {
  event: TradeEvent | CollateralUpdateEvent | SettleEvent
  position: Position
}[] {
  const owner = useWalletAccount()
  const [tradeEvents] = useFetch('OwnerTradeHistory', owner ? [owner] : null, fetcher)
  return tradeEvents ?? EMPTY
}

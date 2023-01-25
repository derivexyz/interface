import { CollateralUpdateEvent, Network, Position, SettleEvent, TradeEvent } from '@lyrafinance/lyra-js'

import { FetchId } from '@/app/constants/fetch'
import filterNulls from '@/app/utils/filterNulls'
import getLyraSDK from '@/app/utils/getLyraSDK'

import useWalletAccount from '../account/useWalletAccount'
import useFetch from '../data/useFetch'

const fetcher = async (
  owner: string
): Promise<{ event: TradeEvent | CollateralUpdateEvent | SettleEvent; position: Position }[]> => {
  const networkPositions = await Promise.all(
    Object.values(Network).map(network => getLyraSDK(network).positions(owner))
  )
  const positions = networkPositions.flat()
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
    (a, b) => b.event.timestamp - a.event.timestamp
  )
}

const EMPTY: { event: TradeEvent | CollateralUpdateEvent | SettleEvent; position: Position }[] = []

// TODO: @dappbeast add transfer event
export default function useTradeHistory(): {
  event: TradeEvent | CollateralUpdateEvent | SettleEvent
  position: Position
}[] {
  const owner = useWalletAccount()
  const [tradeEvents] = useFetch(FetchId.TradeHistory, owner ? [owner] : null, fetcher)
  return tradeEvents ?? EMPTY
}

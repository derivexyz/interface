import { CollateralUpdateEvent, Network, Position, SettleEvent, TradeEvent } from '@lyrafinance/lyra-js'

import filterNulls from '@/app/utils/filterNulls'
import getLyraSDK from '@/app/utils/getLyraSDK'
import { lyraArbitrum, lyraOptimism } from '@/app/utils/lyra'

import useFetch from '../data/useFetch'
import useWalletAccount from '../wallet/useWalletAccount'

// TODO: @dappbeast Add TransferEvent
const fetcher = async (
  owner: string,
  network?: Network
): Promise<{ event: TradeEvent | CollateralUpdateEvent | SettleEvent; position: Position }[]> => {
  let positions: Position[] = []
  if (network) {
    positions = await getLyraSDK(network).positions(owner)
  } else {
    const [opPositions, arbPositions] = await Promise.all([
      lyraOptimism.positions(owner),
      lyraArbitrum.positions(owner),
    ])
    positions = [...opPositions, ...arbPositions]
  }
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

export default function useTradeHistory(network?: Network): {
  event: TradeEvent | CollateralUpdateEvent | SettleEvent
  position: Position
}[] {
  const owner = useWalletAccount()
  const [tradeEvents] = useFetch('OwnerTradeHistory', owner ? [owner, network] : null, fetcher)
  return tradeEvents ?? EMPTY
}

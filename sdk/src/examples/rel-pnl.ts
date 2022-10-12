import { BigNumber } from 'ethers'

import { PositionLeaderboardSortBy } from '../'
import getLyra from './utils/getLyra'

const UNIT = BigNumber.from(10).pow(18)

const PRIZES = [
  2000, 1000, 500, 250, 250, 250, 250, 250, 250, 250, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150,
  150, 150, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
  100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
  100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
  100, 100, 100, 100, 100, 100, 100, 100,
]

export default async function relPnl() {
  const lyra = getLyra()
  const traders = await lyra.leaderboard({
    sortBy: PositionLeaderboardSortBy.RealizedLongPnlPercentage,
    minTotalPremiums: UNIT.mul(100),
    minPositionIds: {
      eth: 4490,
      btc: 178,
    },
    maxCloseTimestamp: 1665131400,
  })
  console.log('traders:', traders.length)
  const totalPrizes = PRIZES.reduce((sum, prize) => sum + prize, 0)
  console.log('total prizes:', totalPrizes)
  console.log(traders.slice(0, 100).map(t => t.account))
  console.log('=== abs pool winners ===')
  PRIZES.map((prize, idx) => {
    console.log(idx + 1, traders[idx].account, prize)
  })
}

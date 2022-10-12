import { BigNumber } from 'ethers'

import { PositionLeaderboardSortBy } from '../'
import getLyra from './utils/getLyra'

const UNIT = BigNumber.from(10).pow(18)

const PRIZES = [5000, 3000, 2000, 1500, 1000, 500, 500, 500, 500, 500]

export default async function absPnl() {
  const lyra = getLyra()
  const traders = await lyra.leaderboard({
    sortBy: PositionLeaderboardSortBy.RealizedPnl,
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
  console.log(traders.slice(0, 10).map(t => t.account))
  console.log('=== abs pool winners ===')
  PRIZES.map((prize, idx) => {
    console.log(idx + 1, traders[idx].account, prize)
  })
}

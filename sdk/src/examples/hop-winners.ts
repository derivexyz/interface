import { BigNumber } from 'ethers'
import _ from 'underscore'

import { PositionLeaderboardSortBy } from '../'
import { fetchHopTransfers } from './utils/fetchHopTransfers'
import getLyra from './utils/getLyra'

const UNIT = BigNumber.from(10).pow(18)

export default async function hopWinners() {
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
  const top2kAccounts = traders.slice(0, 2000).map(t => t.account)
  console.log('top 2k traders:', top2kAccounts.length)
  const top2kAccountsTransfers = await fetchHopTransfers(top2kAccounts)
  const top2kAccountsWithTransfers = top2kAccountsTransfers
    .filter(({ transfers }) => transfers.length)
    .map(({ account }) => account)
  console.log('top 2k traders with hop transfers:', top2kAccountsWithTransfers.length)
  const winners = _.sample(top2kAccountsWithTransfers, 3)
  console.log('=== hop pool winners ===')
  winners.forEach((winner, idx) => {
    console.log(idx + 1, winner, 2500)
  })
}

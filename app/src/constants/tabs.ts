import { LogEvent } from '../constants/logEvents'
import { PageId } from '../constants/pages'
import getPagePath from '../utils/getPagePath'
import isMainnet from '../utils/isMainnet'

type Tab = {
  path: string
  rootPageId: PageId
  name: string
  logEvent: LogEvent
}

const TABS: Tab[] = [
  {
    path: getPagePath({ page: PageId.TradeIndex }),
    rootPageId: PageId.Trade,
    name: 'Trade',
    logEvent: LogEvent.NavTradeTabClick,
  },
  isMainnet()
    ? {
        path: getPagePath({ page: PageId.EarnIndex }),
        rootPageId: PageId.EarnIndex,
        name: 'Earn',
        logEvent: LogEvent.NavEarnTabClick,
      }
    : {
        path: getPagePath({ page: PageId.Faucet }),
        rootPageId: PageId.Faucet,
        name: 'Faucet',
        logEvent: LogEvent.NavFaucetTabClick,
      },
  {
    path: getPagePath({ page: PageId.LeaderboardIndex }),
    rootPageId: PageId.Leaderboard,
    name: 'Airdrop',
    logEvent: LogEvent.NavLeaderboardTabClick,
  },
  // {
  //   path: getPagePath({ page: PageId.VoteIndex }),
  //   rootPageId: PageId.VoteIndex,
  //   name: 'Vote',
  //   logEvent: LogEvent.NavVoteTabClick,
  // },
]

export default TABS

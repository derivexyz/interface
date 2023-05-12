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
  {
    path: getPagePath({ page: PageId.VaultsIndex }),
    rootPageId: PageId.VaultsIndex,
    name: 'Vaults',
    logEvent: LogEvent.NavVaultsTabClick,
  },
  isMainnet()
    ? {
        path: getPagePath({ page: PageId.RewardsIndex }),
        rootPageId: PageId.RewardsIndex,
        name: 'Rewards',
        logEvent: LogEvent.NavRewardsTabClick,
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

import { Network } from '@lyrafinance/lyra-js'

import { LogEvent } from '../constants/logEvents'
import { PageId } from '../constants/pages'
import { getDefaultMarket } from './getDefaultMarket'
import getPagePath from './getPagePath'
import isMainnet from './isMainnet'

type Tab = {
  path: string
  rootPageId: PageId
  name: string
  logEvent: LogEvent
}

const getTabs = (network: Network): Tab[] => [
  {
    path: getPagePath({ page: PageId.Portfolio }),
    rootPageId: PageId.Portfolio,
    name: 'Portfolio',
    logEvent: LogEvent.NavPortfolioTabClick,
  },
  {
    path: getPagePath({ page: PageId.Trade, network, marketAddressOrName: getDefaultMarket(network) }),
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
]

export default getTabs

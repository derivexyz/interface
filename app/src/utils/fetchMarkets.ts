import { Market, Network } from '@lyrafinance/lyra-js'

import { IGNORE_MARKETS_LIST } from '../constants/ignore'
import getLyraSDK from './getLyraSDK'
import { lyraAvalon } from './lyra'

export default async function fetchMarkets(networks?: Network[]): Promise<Market[]> {
  const selectedNetworks = networks ? networks : Object.values(Network)
  let networkMarkets = await Promise.all(selectedNetworks.map(network => getLyraSDK(network).markets()))
  if (selectedNetworks.includes(Network.Optimism)) {
    networkMarkets = networkMarkets.concat(await lyraAvalon.markets())
  }
  return networkMarkets
    .flat()
    .filter(m => !IGNORE_MARKETS_LIST.find(i => i.marketName === m.name && i.chain === m.lyra.chain))
}

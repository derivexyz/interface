import { Market, Network } from '@lyrafinance/lyra-js'

import { DEPRECATED_VAULTS_LIST } from '../constants/deprecated'
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
    .filter(m => !DEPRECATED_VAULTS_LIST.find(i => i.chain === m.lyra.chain && i.version === m.lyra.version))
}

import { BigNumber } from 'ethers'

import Lyra from '../lyra'
import fetchWithCache from './fetchWithCache'
import fromBigNumber from './fromBigNumber'
import isTestnet from './isTestnet'

export default async function fetchStkLyraBalance(lyra: Lyra, owner: string): Promise<number> {
  const testnet = isTestnet(lyra)
  const data = await fetchWithCache<{
    mainnetStkLYRA: string
  }>(`${lyra.apiUri}/lyra-balances?&owner=${owner}&testnet=${testnet}`)
  return fromBigNumber(BigNumber.from(data.mainnetStkLYRA))
}

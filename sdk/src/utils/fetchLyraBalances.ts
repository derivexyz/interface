import { BigNumber } from 'ethers'

import { AccountLyraBalances } from '../account'
import { LYRA_API_URL } from '../constants/links'
import fetchWithCache from './fetchWithCache'

export default async function fetchLyraBalances(owner: string): Promise<AccountLyraBalances> {
  const data = await fetchWithCache<{
    mainnetLYRA: string
    opLYRA: string
    opOldStkLYRA: string
    arbitrumLYRA: string
    mainnetStkLYRA: string
    opStkLYRA: string
    arbitrumStkLYRA: string
    migrationAllowance: string
    stakingAllowance: string
  }>(`${LYRA_API_URL}/lyra-balances?&owner=${owner}`)
  return {
    ethereumLyra: BigNumber.from(data.mainnetLYRA),
    optimismLyra: BigNumber.from(data.opLYRA),
    arbitrumLyra: BigNumber.from(data.arbitrumLYRA),
    optimismOldStkLyra: BigNumber.from(data.opOldStkLYRA),
    ethereumStkLyra: BigNumber.from(data.mainnetStkLYRA),
    optimismStkLyra: BigNumber.from(data.opStkLYRA),
    arbitrumStkLyra: BigNumber.from(data.arbitrumStkLYRA),
    migrationAllowance: BigNumber.from(data.migrationAllowance),
    stakingAllowance: BigNumber.from(data.stakingAllowance),
  }
}

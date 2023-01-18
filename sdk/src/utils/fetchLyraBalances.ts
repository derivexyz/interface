import fetch from 'cross-fetch'
import { BigNumber } from 'ethers'

export type LyraBalancesData = {
  mainnetLYRA: BigNumber
  opLYRA: BigNumber
  opOldStkLYRA: BigNumber
  mainnetStkLYRA: BigNumber
  opStkLYRA: BigNumber
}

export default async function fetchLyraBalances(owner: string): Promise<LyraBalancesData> {
  const res = await fetch(`https://api.lyra.finance/lyra-balances?&owner=${owner}`, {
    method: 'GET',
  })
  const data = await res.json()
  return {
    mainnetLYRA: BigNumber.from(data.mainnetLYRA),
    opLYRA: BigNumber.from(data.opLYRA),
    opOldStkLYRA: BigNumber.from(data.opOldStkLYRA),
    mainnetStkLYRA: BigNumber.from(data.mainnetStkLYRA),
    opStkLYRA: BigNumber.from(data.opStkLYRA),
  }
}

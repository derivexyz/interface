import { AccountPnlSnapshot, MAX_END_TIMESTAMP, MIN_START_TIMESTAMP, Network } from '@lyrafinance/lyra-js'

import { ChartInterval } from '@/app/constants/chart'
import { FetchId } from '@/app/constants/fetch'
import getChartStartTimestamp from '@/app/utils/getChartStartTimestamp'
import groupTimeSnapshots from '@/app/utils/groupTimeSnapshots'

import useNetwork from '../account/useNetwork'
import useWalletAccount from '../account/useWalletAccount'
import useFetch from '../data/useFetch'

type UserPnlResponse = {
  data: {
    timestamp: string
    live_pnl: string
  }[]
}

// Frequency of snapshots
const getPnlPeriod = (interval: ChartInterval) => {
  switch (interval) {
    case ChartInterval.AllTime:
    case ChartInterval.OneYear:
    case ChartInterval.SixMonths:
    case ChartInterval.ThreeMonths:
      return 'day'
    default:
      return 'hour'
  }
}

const getPnlPeriodNum = (interval: ChartInterval) => {
  switch (interval) {
    case ChartInterval.AllTime:
    case ChartInterval.OneYear:
    case ChartInterval.SixMonths:
    case ChartInterval.ThreeMonths:
      return 86400
    default:
      return 3600
  }
}

export const fetchProfitLossHistory = async (
  network: Network,
  owner: string,
  interval: ChartInterval
): Promise<AccountPnlSnapshot[]> => {
  const endTimestamp = Math.floor(Date.now() / 1000)
  const startTimestamp = getChartStartTimestamp(endTimestamp, interval)
  const reqParams = new URLSearchParams({
    startDate: MIN_START_TIMESTAMP.toString(),
    endDate: MAX_END_TIMESTAMP.toString(),
    address: owner,
    period: getPnlPeriod(interval),
    chain: network === Network.Arbitrum ? 'arbitrum-mainnet' : 'optimism-mainnet',
  })
  const res = await fetch(`${process.env.REACT_APP_API_URL}/stats/user-pnl?${reqParams.toString()}`, {
    method: 'GET',
    mode: 'cors',
  })
  if (res.status !== 200) {
    return []
  }

  const { data: _pnlHistory }: UserPnlResponse = await res.json()

  if (!_pnlHistory.length) {
    return []
  }

  const pnlHistory = _pnlHistory
    .map(d => ({
      livePnl: parseFloat(d.live_pnl),
      timestamp: Math.floor(new Date(d.timestamp).getTime() / 1000),
    }))
    .sort((a, b) => a.timestamp - b.timestamp)
  const smoothedPnlHistory = groupTimeSnapshots(
    pnlHistory,
    pnlHistory[0].timestamp,
    endTimestamp,
    getPnlPeriodNum(interval)
  )
  return smoothedPnlHistory.filter(d => d.timestamp >= startTimestamp && d.timestamp <= endTimestamp)
}

const EMPTY: AccountPnlSnapshot[] = []

export default function useProfitLossHistory(interval: ChartInterval): AccountPnlSnapshot[] {
  const account = useWalletAccount()
  const network = useNetwork()
  const [data] = useFetch(
    FetchId.PortfolioUserProfitLossHistory,
    account ? [network, account, interval] : null,
    fetchProfitLossHistory
  )
  return data ?? EMPTY
}

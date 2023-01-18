import { Network } from '@lyrafinance/lyra-js'

import getLyraSDK from '@/app/utils/getLyraSDK'

import useFetch from '../data/useFetch'

const fetcher = async (network: Network) => await getLyraSDK(network).admin().globalOwner()

export default function useAdminGlobalOwner(network: Network): string | null {
  const [globalOwner] = useFetch('GlobalOwner', [network], fetcher)
  return globalOwner
}

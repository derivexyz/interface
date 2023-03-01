import { FetchId } from '@/app/constants/fetch'

import useFetch from '../data/useFetch'

type TokenSupplyResponse = {
  mainnetCirculatingSupply: number
  optimismCirculatingSupply: number
  arbitrumCirculatingSupply: number
  totalCirculatingSupply: number
  totalSupply: number
}

async function fetcher() {
  const res = await fetch(`${process.env.REACT_APP_API_URL}/supply`)
  const data: TokenSupplyResponse = await res.json()
  return data
}

export default function useTokenSupply() {
  const [data] = useFetch(FetchId.TokenSupply, [], fetcher)
  return data
}

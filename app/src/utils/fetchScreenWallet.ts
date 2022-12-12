import { ScreenWalletData, ScreenWalletResponse } from '../constants/screen'

export default async function fetchScreenWallet(address: string, isConnect: boolean): Promise<ScreenWalletData> {
  const res = await fetch(
    `${process.env.REACT_APP_API_URL}/screen/wallet?address=${address}&connect=${isConnect ? 1 : 0}`,
    {
      method: 'GET',
      mode: 'cors',
    }
  )
  const data: ScreenWalletResponse = await res.json()
  if ('error' in data) {
    throw new Error(data.error)
  } else {
    return data
  }
}

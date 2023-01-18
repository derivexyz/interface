import { Network } from '@lyrafinance/lyra-js'

import getLyraSDK from './getLyraSDK'

export default async function getIsOwnerMultiSig(network: Network, owner: string): Promise<boolean> {
  try {
    const code = await getLyraSDK(network).provider.getCode(owner)
    // No contract deployed
    if (code === '0x') {
      return false
    }
  } catch (e) {
    return false
  }
  return true
}

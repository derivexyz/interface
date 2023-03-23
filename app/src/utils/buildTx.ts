import { JsonRpcProvider } from '@ethersproject/providers'
import { PopulatedTransaction } from 'ethers'

export default function buildTx(
  provider: JsonRpcProvider,
  chainId: number,
  to: string,
  from: string,
  data: string
): PopulatedTransaction {
  return {
    to,
    data,
    from,
    chainId: chainId ?? provider.network.chainId,
  }
}

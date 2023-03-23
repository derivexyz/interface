import { Contract } from 'ethers'

import { ContractId } from '@/app/constants/contracts'
import { AppNetwork } from '@/app/constants/networks'

import getContract from './getContract'

export type MulticallRequest<C extends Contract = Contract, F extends keyof C['functions'] & string = string> = {
  contract: C
  function: F
  args: Parameters<C['functions'][F]>
}

type MulticallResponse<R extends MulticallRequest> = Awaited<ReturnType<R['contract']['functions'][R['function']]>>

type MulticallResponses<Reqs extends MulticallRequest[]> = { [K in keyof Reqs]: MulticallResponse<Reqs[K]> }

export default async function multicall<Reqs extends MulticallRequest[]>(
  network: AppNetwork,
  requests: Reqs
): Promise<{
  returnData: MulticallResponses<Reqs>
  blockNumber: number
}> {
  const multicall3Contract = getContract(ContractId.Multicall3, network)
  const calls = requests.map(req => ({
    target: req.contract.address,
    callData: req.contract.interface.encodeFunctionData(req.function, req.args),
  }))
  const { returnData, blockNumber } = await multicall3Contract.callStatic.aggregate(calls)
  const result = requests.map((req, idx) => {
    const contract = req.contract
    const result = contract.interface.decodeFunctionResult(req.function, returnData[idx])
    return result
  })
  return {
    returnData: result as MulticallResponses<Reqs>,
    blockNumber: blockNumber.toNumber(),
  }
}

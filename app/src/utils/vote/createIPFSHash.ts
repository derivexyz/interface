import { BigNumber } from 'ethers'

type CreateProposalResult = {
  IpfsHash: string
  PinSize: string
  Timestamp: string
}

const createIPFSHash = async (
  executor: string,
  targets: string,
  ethAmount: BigNumber,
  tokenAddress: string,
  tokenAmount: BigNumber,
  signatures: string,
  title: string,
  summary: string,
  motivation: string,
  specification: string,
  references: string
): Promise<CreateProposalResult> => {
  const reqParams = new URLSearchParams({
    executor,
    targets,
    ethAmount: ethAmount.toString(),
    tokenAddress,
    tokenAmount: tokenAmount.toString(),
    signatures,
    title,
    summary,
    motivation,
    specification,
    references,
  })

  const res = await fetch(`${process.env.REACT_APP_API_URL}/proposal/create?${reqParams.toString()}`, {
    method: 'GET',
    mode: 'cors',
  })

  if (res.status !== 200) {
    return {
      IpfsHash: '',
      PinSize: '',
      Timestamp: '',
    }
  }

  const result = await res.json()
  return result
}

export default createIPFSHash

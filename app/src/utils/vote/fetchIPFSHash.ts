import { BigNumber } from 'ethers'

import { ZERO_BN } from '@/app/constants/bn'

export type ProposalMetaData = {
  executorId: string
  motivation: string
  references: string
  signatures: string
  specification: string
  summary: string
  targets: string
  title: string
  tokenAddress: string
  tokenAmount: BigNumber
  ethAmount: BigNumber
}

export const EMPTY_PROPOSAL_META_DATA = {
  executorId: '',
  motivation: '',
  references: '',
  signatures: '',
  specification: '',
  summary: '',
  targets: '',
  title: '',
  tokenAddress: '',
  tokenAmount: ZERO_BN,
  ethAmount: ZERO_BN,
}

const fetchIPFSHash = async (ipfsHash: string): Promise<ProposalMetaData> => {
  const reqParams = new URLSearchParams({
    ipfsHash,
  })

  // TODO: @dillon - figure out why Lyndon's hash was not working
  if (ipfsHash.toLowerCase() == 'QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51'.toLowerCase()) {
    return EMPTY_PROPOSAL_META_DATA
  }

  const res = await fetch(`${process.env.REACT_APP_API_URL}/proposal/get?${reqParams.toString()}`, {
    method: 'GET',
    mode: 'cors',
  })

  if (res.status !== 200) {
    return EMPTY_PROPOSAL_META_DATA
  }

  const result = await res.json()
  return {
    executorId: result.executor,
    motivation: result.motivation,
    references: result.references,
    signatures: result.signatures,
    specification: result.specification,
    summary: result.summary,
    targets: result.targets,
    title: result.title,
    tokenAddress: result.tokenAddress,
    tokenAmount: BigNumber.from(result.tokenAmount),
    ethAmount: BigNumber.from(result.ethAmount),
  }
}

export default fetchIPFSHash

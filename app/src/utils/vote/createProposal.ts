import { BigNumber, ethers, PopulatedTransaction } from 'ethers'

import { ZERO_ADDRESS, ZERO_BN } from '@/app/constants/bn'
import { ContractId } from '@/app/constants/contracts'
import { AppChain, AppNetwork, NETWORK_CONFIGS } from '@/app/constants/networks'
import buildTx from '@/app/utils/buildTx'
import isMainnet from '@/app/utils/isMainnet'
import mainnetProvider from '@/app/utils/mainnetProvider'

import getContract from '../common/getContract'
import createIPFSHash from './createIPFSHash'

const createProposal = async (
  account: string,
  executor: string,
  target: string,
  ethAmount: BigNumber,
  tokenAddress: string,
  tokenAmount: BigNumber,
  calldata: string,
  proposalNetwork: AppNetwork,
  title: string,
  summary: string,
  motivation: string,
  specification: string,
  references: string
): Promise<PopulatedTransaction> => {
  const lyraGovernanceV2Contract = getContract(ContractId.LyraGovernanceV2, AppNetwork.Ethereum)
  const includeEthTransfer = ethAmount.gt(0)
  const transferEthContract = includeEthTransfer ? getContract(ContractId.TransferEth, AppNetwork.Ethereum) : null
  const transferEthTx = includeEthTransfer
    ? await transferEthContract?.populateTransaction.transferEth(target, ethAmount)
    : null
  const types = ['address', 'uint256']
  let signatures = ''
  if (proposalNetwork === AppNetwork.Optimism) {
    signatures = 'sendMessage(address,bytes,uint32)'
  } else if (proposalNetwork === AppNetwork.Arbitrum) {
    signatures = 'createRetryableTicket(address,uint256,uint256,address,address,uint256,uint256,bytes)'
  }
  const values = [tokenAddress !== '' ? tokenAddress : ZERO_ADDRESS, tokenAmount]
  const callDatas =
    calldata !== ''
      ? calldata
      : tokenAmount === ZERO_BN
      ? ethers.utils.defaultAbiCoder.encode([], [])
      : ethers.utils.defaultAbiCoder.encode(types, values)
  const withDelegateCalls = includeEthTransfer ? true : false
  const ipfsPayload = await createIPFSHash(
    executor,
    target,
    ethAmount,
    tokenAddress,
    tokenAmount,
    signatures,
    title,
    summary,
    motivation,
    specification,
    references
  )
  const ipfsHash = ethers.utils.hexlify(ethers.utils.base58.decode(ipfsPayload.IpfsHash.toString()).slice(2))
  const data = lyraGovernanceV2Contract.interface.encodeFunctionData('create', [
    executor,
    includeEthTransfer ? [transferEthContract?.address ?? ZERO_ADDRESS] : [target],
    [ZERO_BN],
    includeEthTransfer ? [''] : [signatures],
    includeEthTransfer ? [transferEthTx?.data as string] : [callDatas],
    [withDelegateCalls],
    ipfsHash,
  ])
  const tx = buildTx(
    mainnetProvider,
    isMainnet() ? NETWORK_CONFIGS[AppChain.Ethereum].chainId : NETWORK_CONFIGS[AppChain.EthereumGoerli].chainId,
    lyraGovernanceV2Contract.address,
    account,
    data
  )
  return tx
}

export default createProposal

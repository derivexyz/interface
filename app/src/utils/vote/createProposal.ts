import { BigNumber, ethers, PopulatedTransaction } from 'ethers'

import { ZERO_BN } from '@/app/constants/bn'
import { ContractId } from '@/app/constants/contracts'
import {
  ARBITRUM_GOERLI_TARGET_ADDRESS,
  ARBITRUM_MAINNET_TARGET_ADDRESS,
  OPTIMISM_GOERLI_TARGET_ADDRESS,
  OPTIMISM_MAINNET_TARGET_ADDRESS,
  ProposalAction,
} from '@/app/constants/governance'
import { AppChain, AppNetwork, NETWORK_CONFIGS } from '@/app/constants/networks'
import buildTx from '@/app/utils/buildTx'
import isMainnet from '@/app/utils/isMainnet'
import mainnetProvider from '@/app/utils/mainnetProvider'

import getContract from '../common/getContract'
import getERC20Contract from '../common/getERC20Contract'
import createIPFSHash from './createIPFSHash'

const createProposal = async (
  action: ProposalAction,
  account: string,
  executor: string,
  target: string,
  value: BigNumber,
  ethAmount: BigNumber,
  tokenAddress: string,
  tokenAmount: BigNumber,
  calldata: string,
  title: string,
  summary: string,
  motivation: string,
  specification: string,
  references: string
): Promise<PopulatedTransaction> => {
  const lyraGovernanceV2Contract = getContract(ContractId.LyraGovernanceV2, AppNetwork.Ethereum)

  let targetAddress = target
  let values = ZERO_BN
  let signatures = ''
  let callDatas = ''
  let withDelegateCalls = false

  switch (action) {
    case ProposalAction.CustomArbitrum:
      values = value
      targetAddress = isMainnet() ? ARBITRUM_MAINNET_TARGET_ADDRESS : ARBITRUM_GOERLI_TARGET_ADDRESS
      callDatas = calldata
      break
    case ProposalAction.CustomOptimism:
      targetAddress = isMainnet() ? OPTIMISM_MAINNET_TARGET_ADDRESS : OPTIMISM_GOERLI_TARGET_ADDRESS
      callDatas = calldata
      signatures = 'sendMessage(address,bytes,uint32)'
      break
    case ProposalAction.CustomEthereum:
      callDatas = calldata
      break
    case ProposalAction.MetaGovernance:
      callDatas = calldata
      break
    case ProposalAction.Transfer:
      targetAddress = tokenAddress
      const erc20Contract = getERC20Contract(AppNetwork.Ethereum, tokenAddress)
      const tx = await erc20Contract.populateTransaction.transfer(target, tokenAmount)
      callDatas = tx.data as string
      break
    case ProposalAction.TransferEth:
      withDelegateCalls = true
      const transferEthContract = getContract(ContractId.TransferEth, AppNetwork.Ethereum)
      targetAddress = transferEthContract.address
      const transferEthTx = await transferEthContract.populateTransaction.transferEth(target, ethAmount)
      callDatas = transferEthTx.data as string
      break
  }

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
    [targetAddress],
    [values],
    [signatures],
    [callDatas],
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

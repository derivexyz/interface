import { Contract, ContractInterface } from '@ethersproject/contracts'

import { AppNetwork } from '@/app/constants/networks'

import { ContractId, ContractMap } from '../../constants/contracts'
import ARRAKIS_POOL_L1_ABI from '../../contracts/abis/ArrakisPoolL1.json'
import ARRAKIS_POOL_L2_ABI from '../../contracts/abis/ArrakisPoolL2.json'
import ARRAKIS_STAKING_REWARDS_ABI from '../../contracts/abis/ArrakisStakingRewards.json'
import MULTICALL_ABI from '../../contracts/abis/Multicall3.json'
import ADDRESS_MAP from '../../contracts/addresses/ethereum.addresses.json'
import OPTIMISM_ADDRESS_MAP from '../../contracts/addresses/optimism.addresses.json'
import getProvider from '../getProvider'

const getContractAddress = (contractId: ContractId): string => {
  return ({ ...ADDRESS_MAP, ...OPTIMISM_ADDRESS_MAP } as Record<string, string>)[contractId]
}

const getContractABI = (contractId: ContractId): ContractInterface => {
  switch (contractId) {
    case ContractId.ArrakisPoolL1:
      return ARRAKIS_POOL_L1_ABI
    case ContractId.ArrakisPoolL2:
      return ARRAKIS_POOL_L2_ABI
    case ContractId.ArrakisStakingRewards:
    case ContractId.ArrakisOpStakingRewards:
      return ARRAKIS_STAKING_REWARDS_ABI
    case ContractId.Multicall3:
      return MULTICALL_ABI
  }
}

export default function getContract<C extends ContractId>(contractId: C, network: AppNetwork): ContractMap[C] {
  const address = getContractAddress(contractId)
  const abi = getContractABI(contractId)
  return new Contract(address, abi, getProvider(network)) as ContractMap[C]
}

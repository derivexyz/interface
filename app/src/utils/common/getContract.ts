import { Contract, ContractInterface } from '@ethersproject/contracts'

import { AppNetwork } from '@/app/constants/networks'

import { ContractId, ContractMap } from '../../constants/contracts'
import ARRAKIS_POOL_L1_ABI from '../../contracts/abis/ArrakisPoolL1.json'
import ARRAKIS_POOL_L2_ABI from '../../contracts/abis/ArrakisPoolL2.json'
import ARRAKIS_STAKING_REWARDS_ABI from '../../contracts/abis/ArrakisStakingRewards.json'
import CAMELOT_NITRO_POOL_ABI from '../../contracts/abis/CamelotNitroPool.json'
import CAMELOT_POOL_ABI from '../../contracts/abis/CamelotPool.json'
import LONG_EXECUTOR_ABI from '../../contracts/abis/LongExecutor.json'
import LYRA_GOVERNANCE_STRATEGY_ABI from '../../contracts/abis/LyraGovernanceStrategy.json'
import LYRA_GOVERNANCE_V2_ABI from '../../contracts/abis/LyraGovernanceV2.json'
import LYRA_STAKING_ABI from '../../contracts/abis/LyraStaking.json'
import MULTICALL_ABI from '../../contracts/abis/Multicall3.json'
import SHORT_EXECUTOR_ABI from '../../contracts/abis/ShortExecutor.json'
import TRANSFER_ETH_ABI from '../../contracts/abis/TransferEth.json'
import VELODROME_POOL_ABI from '../../contracts/abis/VelodromePool.json'
import VELODROME_STAKING_ABI from '../../contracts/abis/VelodromeStaking.json'
import VESTING_ESCROW_ABI from '../../contracts/abis/VestingEscrow.json'
import VESTING_ESCROW_FACTORY_ABI from '../../contracts/abis/VestingEscrowFactory.json'
import ARBITRUM_ADDRESS_MAP from '../../contracts/addresses/arbitrum.addresses.json'
import ADDRESS_MAP from '../../contracts/addresses/ethereum.addresses.json'
import ETHEREUM_GOERLI_ADDRESS_MAP from '../../contracts/addresses/ethereum-goerli.addresses.json'
import OPTIMISM_ADDRESS_MAP from '../../contracts/addresses/optimism.addresses.json'
import getProvider from '../getProvider'
import isMainnet from '../isMainnet'

export const getContractAddress = (contractId: ContractId): string => {
  if (isMainnet()) {
    return ({ ...ADDRESS_MAP, ...OPTIMISM_ADDRESS_MAP, ...ARBITRUM_ADDRESS_MAP } as Record<string, string>)[contractId]
  } else {
    return (
      { ...ETHEREUM_GOERLI_ADDRESS_MAP, ...OPTIMISM_ADDRESS_MAP, ...ARBITRUM_ADDRESS_MAP } as Record<string, string>
    )[contractId]
  }
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
    case ContractId.CamelotPool:
      return CAMELOT_POOL_ABI
    case ContractId.CamelotNitroPool:
      return CAMELOT_NITRO_POOL_ABI
    case ContractId.Multicall3:
      return MULTICALL_ABI
    case ContractId.VelodromePool:
      return VELODROME_POOL_ABI
    case ContractId.VelodromeStaking:
      return VELODROME_STAKING_ABI
    case ContractId.Multicall3:
      return MULTICALL_ABI
    case ContractId.ShortExecutor:
      return SHORT_EXECUTOR_ABI
    case ContractId.LongExecutor:
      return LONG_EXECUTOR_ABI
    case ContractId.LyraGovernanceStrategy:
      return LYRA_GOVERNANCE_STRATEGY_ABI
    case ContractId.LyraGovernanceV2:
      return LYRA_GOVERNANCE_V2_ABI
    case ContractId.TransferEth:
      return TRANSFER_ETH_ABI
    case ContractId.LyraStaking:
      return LYRA_STAKING_ABI
    case ContractId.VestingEscrowFactory1:
      return VESTING_ESCROW_FACTORY_ABI
    case ContractId.VestingEscrowFactory2:
      return VESTING_ESCROW_FACTORY_ABI
    case ContractId.VestingEscrow:
      return VESTING_ESCROW_ABI
  }
}

export default function getContract<C extends ContractId>(contractId: C, network: AppNetwork): ContractMap[C] {
  const address = getContractAddress(contractId)
  const abi = getContractABI(contractId)
  return new Contract(address, abi, getProvider(network)) as ContractMap[C]
}

import { BigNumber } from '@ethersproject/bignumber'
import { ContractInterface, PopulatedTransaction } from '@ethersproject/contracts'

import Lyra, { LyraRegistry, OptionMarketViewer } from '..'
import { LyraContractId, LyraMarketContractId } from '../constants/contracts'
import buildTx from '../utils/buildTx'
import getGlobalOwner from '../utils/getGlobalOwner'
import getLyraContract from '../utils/getLyraContract'
import getLyraContractABI from '../utils/getLyraContractABI'
import getLyraContractAddress from '../utils/getLyraContractAddress'

export class Admin {
  private lyra: Lyra

  constructor(lyra: Lyra) {
    this.lyra = lyra
  }

  static get(lyra: Lyra): Admin {
    return new Admin(lyra)
  }

  getLyraContractABI(contractId: LyraContractId | LyraMarketContractId): ContractInterface {
    return getLyraContractABI(contractId)
  }
  getLyraContractAddress(contractId: LyraContractId): ContractInterface {
    return getLyraContractAddress(this.lyra.deployment, contractId)
  }
  getLyraContract(contractId: LyraContractId) {
    return getLyraContract(this.lyra.provider, this.lyra.deployment, contractId)
  }

  async globalOwner(): Promise<string> {
    return await getGlobalOwner(this.lyra)
  }

  async isMarketPaused(marketAddress: string): Promise<boolean> {
    const synthetixAdapter = getLyraContract(this.lyra.provider, this.lyra.deployment, LyraContractId.SynthetixAdapter)
    return await synthetixAdapter.isMarketPaused(marketAddress)
  }

  async isGlobalPaused(): Promise<boolean> {
    const synthetixAdapter = getLyraContract(this.lyra.provider, this.lyra.deployment, LyraContractId.SynthetixAdapter)
    return await synthetixAdapter.isGlobalPaused()
  }

  setGlobalPaused(account: string, isPaused: boolean): PopulatedTransaction {
    const synthetixAdapter = getLyraContract(this.lyra.provider, this.lyra.deployment, LyraContractId.SynthetixAdapter)
    const calldata = synthetixAdapter.interface.encodeFunctionData('setGlobalPaused', [isPaused])
    const tx = buildTx(this.lyra, synthetixAdapter.address, account, calldata)
    return {
      ...tx,
      gasLimit: BigNumber.from(10_000_000),
    }
  }

  setMarketPaused(account: string, marketAddress: string, isPaused: boolean): PopulatedTransaction {
    const synthetixAdapter = getLyraContract(this.lyra.provider, this.lyra.deployment, LyraContractId.SynthetixAdapter)
    const calldata = synthetixAdapter.interface.encodeFunctionData('setMarketPaused', [marketAddress, isPaused])
    const tx = buildTx(this.lyra, synthetixAdapter.address, account, calldata)
    return {
      ...tx,
      gasLimit: BigNumber.from(10_000_000),
    }
  }

  addMarketToWrapper(
    account: string,
    id: number,
    newMarketAddresses: OptionMarketViewer.OptionMarketAddressesStruct
  ): PopulatedTransaction {
    const { optionMarket, quoteAsset, baseAsset, optionToken, liquidityPool, liquidityToken } = newMarketAddresses
    const wrapper = getLyraContract(this.lyra.provider, this.lyra.deployment, LyraContractId.OptionMarketWrapper)
    const calldata = wrapper.interface.encodeFunctionData('addMarket', [
      optionMarket,
      id,
      { quoteAsset, baseAsset, optionToken, liquidityPool, liquidityToken },
    ])
    const tx = buildTx(this.lyra, wrapper.address, account, calldata)
    return {
      ...tx,
      gasLimit: BigNumber.from(10_000_000),
    }
  }

  addMarketToViewer(
    account: string,
    newMarketAddresses: OptionMarketViewer.OptionMarketAddressesStruct
  ): PopulatedTransaction {
    const viewer = getLyraContract(this.lyra.provider, this.lyra.deployment, LyraContractId.OptionMarketViewer)
    const calldata = viewer.interface.encodeFunctionData('addMarket', [newMarketAddresses])
    const tx = buildTx(this.lyra, viewer.address, account, calldata)
    return {
      ...tx,
      gasLimit: BigNumber.from(10_000_000),
    }
  }

  addMarketToRegistry(
    account: string,
    newMarketAddresses: LyraRegistry.OptionMarketAddressesStruct
  ): PopulatedTransaction {
    const registry = getLyraContract(this.lyra.provider, this.lyra.deployment, LyraContractId.LyraRegistry)
    const calldata = registry.interface.encodeFunctionData('addMarket', [newMarketAddresses])
    const tx = buildTx(this.lyra, registry.address, account, calldata)
    return {
      ...tx,
      gasLimit: BigNumber.from(10_000_000),
    }
  }
}

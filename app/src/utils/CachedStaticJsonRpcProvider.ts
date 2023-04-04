import { FilterByBlockHash } from '@ethersproject/abstract-provider'
import { Block, BlockTag, Filter, Log, StaticJsonRpcProvider, TransactionRequest } from '@ethersproject/providers'
import { Deferrable } from 'ethers/lib/utils'

// Enables retries, caching
export default class CachedStaticJsonRpcProvider extends StaticJsonRpcProvider {
  callPromiseCache: Record<string, Promise<string>> = {}
  logsPromiseCache: Record<string, Promise<Log[]>> = {}
  blockPromiseCache: Record<string, Promise<Block>> = {}
  // Refresh latest block every 1 second
  latestBlockCacheTimeout = 1 * 1000
  latestBlockUpdateTimestamp: number = 0

  async call(
    transaction: Deferrable<TransactionRequest>,
    blockTag: BlockTag | Promise<BlockTag> | undefined = 'latest'
  ): Promise<string> {
    const { number: blockNumber } = await this.getBlock(blockTag)
    const key = [blockNumber, JSON.stringify(transaction)].join()
    this.callPromiseCache[key] = this.callPromiseCache[key] ?? super.call(transaction, blockNumber)
    return this.callPromiseCache[key]
  }

  async getLogs(filter: Filter | FilterByBlockHash | Promise<Filter | FilterByBlockHash>): Promise<Log[]> {
    const resolvedFilter = await filter
    let key: string
    if ((resolvedFilter as any)?.toBlock === 'latest') {
      const { number: blockNumber } = await this.getBlock('latest')
      key = [blockNumber, JSON.stringify(resolvedFilter)].join()
    } else {
      key = JSON.stringify(resolvedFilter)
    }
    this.logsPromiseCache[key] = this.logsPromiseCache[key] ?? super.getLogs(filter)
    return this.logsPromiseCache[key]
  }

  async getBlock(_blockHashOrBlockTag: BlockTag | Promise<BlockTag>, skipLatestBlockCache?: boolean): Promise<Block> {
    const blockHashOrBlockTag = await _blockHashOrBlockTag
    if (blockHashOrBlockTag === 'latest') {
      const now = Date.now()
      if (
        skipLatestBlockCache ||
        !this.blockPromiseCache[blockHashOrBlockTag] ||
        now > this.latestBlockUpdateTimestamp + this.latestBlockCacheTimeout
      ) {
        // Query latest block
        this.blockPromiseCache[blockHashOrBlockTag] = super.getBlock(blockHashOrBlockTag)
        this.latestBlockUpdateTimestamp = now
      }
      const block = await this.blockPromiseCache[blockHashOrBlockTag]
      this.blockPromiseCache[blockHashOrBlockTag] = new Promise(resolve => resolve(block))
      return block
    } else if (typeof blockHashOrBlockTag === 'number') {
      // Query specific block
      if (!this.blockPromiseCache[blockHashOrBlockTag]) {
        this.blockPromiseCache[blockHashOrBlockTag] = super.getBlock(blockHashOrBlockTag)
      }
      const block = await this.blockPromiseCache[blockHashOrBlockTag]
      return block
    } else {
      console.warn("Querying block that isn't specified or latest")
      return await super.getBlock(blockHashOrBlockTag)
    }
  }
}

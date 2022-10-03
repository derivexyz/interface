import { Block, BlockTag, StaticJsonRpcProvider, TransactionRequest } from '@ethersproject/providers'
import { Deferrable } from 'ethers/lib/utils'

// Caches calls and blocks
export default class CachedStaticJsonRpcProvider extends StaticJsonRpcProvider {
  callPromiseCache: Record<string, Promise<string>> = {}
  blockPromiseCache: Record<string, Promise<Block>> = {}
  // Refresh latest block every 5 seconds
  latestBlockCacheTimeout = 5 * 1000
  latestBlockUpdateTimestamp: number = 0

  async call(
    transaction: Deferrable<TransactionRequest>,
    blockTag?: BlockTag | Promise<BlockTag> | undefined
  ): Promise<string> {
    const { number: blockNumber } = await this.getBlock('latest')
    const key = [blockNumber, JSON.stringify(transaction)].join()
    this.callPromiseCache[key] = this.callPromiseCache[key] ?? super.call(transaction, blockTag)
    return this.callPromiseCache[key]
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

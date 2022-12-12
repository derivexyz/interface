import { Block, BlockTag, StaticJsonRpcProvider, TransactionRequest } from '@ethersproject/providers'
import { deepCopy, Deferrable, fetchJson } from 'ethers/lib/utils'

function getResult(payload: { error?: { code?: number; data?: any; message?: string }; result?: any }): any {
  if (payload.error) {
    const error: any = new Error(payload.error.message)
    error.code = payload.error.code
    error.data = payload.error.data
    throw error
  }

  return payload.result
}

// Enables retries, caching
export default class CachedStaticJsonRpcProvider extends StaticJsonRpcProvider {
  urls: string[]
  callPromiseCache: Record<string, Promise<string>> = {}
  blockPromiseCache: Record<string, Promise<Block>> = {}
  // Refresh latest block every 5 seconds
  latestBlockCacheTimeout = 5 * 1000
  latestBlockUpdateTimestamp: number = 0

  constructor(urls: string[], chainId: number) {
    super(
      {
        url: urls[0],
        throttleLimit: 1, // Disable retries
        timeout: 3 * 1000, // 3 seconds
      },
      chainId
    )
    this.urls = urls
  }

  // Modified from JsonRpcProvider
  async send(method: string, params: Array<any>): Promise<any> {
    const request = {
      method: method,
      params: params,
      id: this._nextId++,
      jsonrpc: '2.0',
    }

    for (let i = 0; i < this.urls.length; i++) {
      const url = this.urls[i]
      try {
        this.emit('debug', {
          action: 'request',
          request: deepCopy(request),
          provider: this,
        })

        // TODO: Move getBlock and call caching here
        const cache = ['eth_chainId', 'eth_blockNumber'].indexOf(method) >= 0
        if (cache && (this._cache[method] as Promise<any> | undefined)) {
          return this._cache[method]
        }

        // Override connection URL
        const result = await fetchJson(
          {
            ...this.connection,
            url,
          },
          JSON.stringify(request),
          getResult
        )
        this.emit('debug', {
          action: 'response',
          request: request,
          response: result,
          provider: this,
        })
        return result
      } catch (error) {
        console.error(error)
        if (i === this.urls.length - 1) {
          // Throw on last request failure
          this.emit('debug', {
            action: 'response',
            error: error,
            request: request,
            provider: this,
          })
          throw error
        }
      }
    }
  }
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

import { JsonRpcProvider, TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import { IconType } from '@lyra/ui/components/Icon'
import { closeToast, createPendingToast, updatePendingToast, updateToast } from '@lyra/ui/components/Toast'
import { BigNumber, Contract, ContractReceipt, PopulatedTransaction } from 'ethers'
import { useCallback } from 'react'

import { AppNetwork, Network } from '@/app/constants/networks'
import { TransactionType } from '@/app/constants/screen'
import { getChainIdForNetwork } from '@/app/utils/getChainIdForNetwork'
import getExplorerUrl from '@/app/utils/getExplorerUrl'
import getNetworkConfig from '@/app/utils/getNetworkConfig'
import getProvider from '@/app/utils/getProvider'
import postTransactionError from '@/app/utils/postTransactionError'
import postTransactionSuccess from '@/app/utils/postTransactionSuccess'
import resolveNetwork from '@/app/utils/resolveNetwork'

import useWallet from './useWallet'

const DEFAULT_TOAST_TIMEOUT = 1000 * 5 // 5 seconds
const POLL_INTERVAL = 250 // 0.25 seconds

// https://docs.ethers.io/v5/single-page/#/v5/api/providers/types/-%23-providers-TransactionReceipt
enum TransactionStatus {
  Failure = 0,
  Success = 1,
}

export enum TransactionFailureStage {
  GasEstimate = 'GasEstimate',
  Wallet = 'Wallet',
  Reverted = 'Reverted',
}

type Value = string | number | boolean

type TransactionMetadata = Record<string, Value | Record<string, Value> | Array<Record<string, Value>>>

export type TransactionSuccessOptions = {
  chain: number
  network: Network
  toastId: string
  txName: TransactionType
  signer: string
  metadata?: TransactionMetadata
  txHash: string
  txBlock: number
}

export type TransactionErrorOptions = {
  error: any
  network: Network
  chain: number
  stage: TransactionFailureStage
  toastId: string
  txName: TransactionType
  signer: string
  metadata?: TransactionMetadata
  txHash?: string | null
  txBlock?: number
}

export type Transaction<
  C extends Contract = Contract,
  M extends keyof Contract['functions'] & string = string,
  P extends Parameters<C['functions'][M]> = any
> =
  | PopulatedTransaction
  | Promise<PopulatedTransaction>
  | {
      tx: PopulatedTransaction
      metadata?: TransactionMetadata
    }
  | Promise<{
      tx: PopulatedTransaction
      metadata?: TransactionMetadata
    }>
  | {
      contract: C
      method: M
      params: P
      options?: { gasLimit?: BigNumber }
      metadata?: TransactionMetadata
    }

export type TransactionOptions = {
  onComplete?: (receipt: ContractReceipt) => any | Promise<any>
  metadata?: TransactionMetadata
}

// Add custom error messages as they appear
const parseTransactionErrorMessage = (error: any) => {
  let errorMessage = String(error?.errorName ?? error?.data?.error?.message ?? error?.message).split('[')[0]
  if (!errorMessage) {
    errorMessage = 'Something went wrong'
  }
  switch (errorMessage) {
    case 'TotalCostOutsideOfSpecifiedBounds':
      return 'Slippage out of bounds'
    default:
      return errorMessage
  }
}

const reportError = (options: TransactionErrorOptions) => {
  const { network, error: _error, toastId, txHash } = options

  let error = _error
  if (error?.code === 4001 || JSON.stringify(error).includes('user rejected transaction')) {
    // User rejected the transaction, skip report
    closeToast(toastId)
    return null
  }

  if (
    error?.code === 'UNPREDICTABLE_GAS_LIMIT' &&
    error?.error &&
    error?.error?.code &&
    error?.error?.message &&
    error?.error?.data
  ) {
    // Unpredictable gas limit indicates nested error
    error = error.error
  }

  console.error(error)

  // Attempt to extract errorName to parse message
  const message = parseTransactionErrorMessage(error)

  // Post transaction error metadata to db
  postTransactionError(options)

  updateToast(toastId, {
    variant: 'error',
    description: message,
    icon: IconType.AlertTriangle,
    href: txHash ? getExplorerUrl(network, txHash) : undefined,
    target: '_blank',
    autoClose: false,
  })
}

const getTimeout = (network: Network): number => {
  switch (resolveNetwork(network)) {
    case AppNetwork.Arbitrum:
    case AppNetwork.Optimism:
      return 10 * 1000
    case AppNetwork.Ethereum:
      return 60 * 1000
  }
}

async function getRawTxGasLimit(
  network: Network,
  provider: JsonRpcProvider,
  tx: PopulatedTransaction
): Promise<BigNumber> {
  const config = getNetworkConfig(network)
  const gasLimit = tx.gasLimit ?? (await provider.estimateGas(tx)).mul(10000 * Math.max(1, config.gasBuffer)).div(10000)
  if (gasLimit.lt(config.minGas)) {
    return config.minGas
  }
  if (gasLimit.gt(config.maxGas)) {
    return config.maxGas
  }
  return gasLimit
}

async function getContractTxGasLimit(
  network: Network,
  contract: Contract,
  method: string,
  params: any,
  options?: { gasLimit?: BigNumber }
): Promise<BigNumber> {
  const config = getNetworkConfig(network)
  const gasLimit =
    options?.gasLimit ??
    (await contract.estimateGas[method](...params)).mul(10000 * Math.max(1, config.gasBuffer)).div(10000)
  if (gasLimit.lt(config.minGas)) {
    return config.minGas
  }
  if (gasLimit.gt(config.maxGas)) {
    return config.maxGas
  }
  return gasLimit
}

export default function useTransaction(network: Network) {
  const { account, signer } = useWallet()

  return useCallback(
    async <
      C extends Contract = Contract,
      M extends keyof Contract['functions'] & string = string,
      P extends Parameters<C['functions'][M]> = any
    >(
      _tx: Transaction<C, M, P>,
      txName: TransactionType,
      options?: TransactionOptions
    ): Promise<ContractReceipt | null> => {
      const provider = getProvider(network)

      if (!signer || !account) {
        console.warn('No signer')
        return null
      }

      const toastId = createPendingToast({
        description: 'Confirm your transaction',
        autoClose: false,
      })

      const successOrErrorOptions = {
        network,
        chain: getChainIdForNetwork(network),
        toastId,
        txName,
        metadata: options?.metadata,
        signer: account,
      }

      let response: TransactionResponse

      if ('contract' in _tx) {
        const contract = _tx['contract']
        const method = _tx['method']
        const params = _tx['params']
        const options = _tx['options']
        const signedContract = contract.connect(signer)

        let gasLimit: BigNumber
        try {
          gasLimit = await getContractTxGasLimit(network, signedContract, method, params, options)
        } catch (error) {
          reportError({ ...successOrErrorOptions, error, stage: TransactionFailureStage.GasEstimate })
          return null
        }

        try {
          console.time('tx')
          response = await signedContract[method](...params, { gasLimit })
          console.timeEnd('tx')
        } catch (error) {
          console.timeEnd('tx')
          reportError({ ...successOrErrorOptions, error, stage: TransactionFailureStage.Wallet })
          return null
        }
      } else {
        let tx: PopulatedTransaction
        try {
          const resolvedTx = await _tx
          if ('tx' in resolvedTx) {
            tx = resolvedTx['tx']
            successOrErrorOptions.metadata = { ...successOrErrorOptions.metadata, ...resolvedTx['metadata'] }
          } else {
            tx = resolvedTx
          }
        } catch (error) {
          reportError({ ...successOrErrorOptions, error, stage: TransactionFailureStage.GasEstimate })
          return null
        }

        try {
          tx.gasLimit = await getRawTxGasLimit(network, provider, tx)
        } catch (error) {
          reportError({ ...successOrErrorOptions, error, stage: TransactionFailureStage.GasEstimate })
          return null
        }

        try {
          console.time('tx')
          console.debug('tx', tx)
          response = await signer.sendTransaction(tx)
          console.timeEnd('tx')
        } catch (error) {
          console.timeEnd('tx')
          reportError({ ...successOrErrorOptions, error, stage: TransactionFailureStage.Wallet })
          return null
        }
      }

      const transactionTimeout = getTimeout(network)
      const autoClose = transactionTimeout + POLL_INTERVAL // add buffer
      const txHref = getExplorerUrl(network, response.hash)

      updatePendingToast(toastId, {
        description: `Your transaction is pending, click to view on etherscan`,
        href: txHref,
        target: '_blank',
        autoClose,
      })

      console.debug('response', response)
      console.time('waitForTransaction')
      // Poll for transaction receipt (can lead to faster results than .wait())
      const receipt = await new Promise<TransactionReceipt | null>(resolve => {
        let n = 0
        const pollReceipt = async () => {
          const receipt = await provider.getTransactionReceipt(response.hash)
          if (receipt) {
            resolve(receipt)
          } else if (n < 100) {
            n++
            setTimeout(pollReceipt, POLL_INTERVAL)
          } else {
            console.warn('Max retries exceeded')
            resolve(null)
          }
        }
        setTimeout(pollReceipt, POLL_INTERVAL)
      })
      console.debug('receipt', receipt)
      console.timeEnd('waitForTransaction')

      if (receipt) {
        if (receipt.status === TransactionStatus.Failure) {
          try {
            const transaction = await provider.getTransaction(response.hash)
            await provider.call(transaction as any, response.blockNumber)
          } catch (error) {
            reportError({
              ...successOrErrorOptions,
              error,
              stage: TransactionFailureStage.Reverted,
              txHash: receipt.transactionHash,
              txBlock: receipt.blockNumber,
            })
          }
          return null
        } else {
          // Transaction was polled successfully
          if (options?.onComplete != null) {
            // Execute middleware mutation for successful transactions
            console.time('onComplete')
            await options.onComplete(receipt)
            console.timeEnd('onComplete')
          }

          postTransactionSuccess({
            ...successOrErrorOptions,
            txHash: receipt.transactionHash,
            txBlock: receipt.blockNumber,
          })

          updateToast(toastId, {
            variant: 'success',
            description: `Your transaction was successful`,
            href: txHref,
            target: '_blank',
            autoClose: DEFAULT_TOAST_TIMEOUT,
            icon: IconType.Check,
          })
          return receipt
        }
      } else {
        // Transaction timed out
        updateToast(toastId, {
          variant: 'warning',
          description: `Your transaction took longer than ${Math.floor(
            transactionTimeout / 1000
          )} seconds, click to view on etherscan`,
          href: txHref,
          target: '_blank',
          autoClose: DEFAULT_TOAST_TIMEOUT,
          icon: IconType.AlertTriangle,
        })
        return null
      }
    },
    [network, signer, account]
  )
}

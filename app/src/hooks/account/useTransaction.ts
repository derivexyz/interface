import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import { IconType } from '@lyra/ui/components/Icon'
import {
  closeToast,
  createPendingToast,
  CreateToastOptions,
  updatePendingToast,
  updateToast,
} from '@lyra/ui/components/Toast'
import { ContractReceipt, PopulatedTransaction } from 'ethers'
import { useCallback } from 'react'

import { Network } from '@/app/constants/networks'
import { TransactionType } from '@/app/constants/screen'
import getExplorerUrl from '@/app/utils/getExplorerUrl'
import getProvider from '@/app/utils/getProvider'
import isScreeningEnabled from '@/app/utils/isScreeningEnabled'
import logError from '@/app/utils/logError'
import postTransaction from '@/app/utils/postTransaction'
import postTransactionError from '@/app/utils/postTransactionError'

import emptyFunction from '../../utils/emptyFunction'
import useWallet from './useWallet'

const DEFAULT_OPTIMISM_TRANSACTION_TIMEOUT = 1000 * 10 // 10 seconds
const DEFAULT_TOAST_TIMEOUT = 1000 * 5 // 5 seconds
const POLL_INTERVAL = 1000 // 1 second

// https://docs.ethers.io/v5/single-page/#/v5/api/providers/types/-%23-providers-TransactionReceipt
enum TransactionStatus {
  Failure = 0,
  Success = 1,
}

// TODO: Add custom error messages as they appear
const getErrorMessage = (errorName: string) => {
  switch (errorName) {
    case 'TotalCostOutsideOfSpecifiedBounds':
      return 'Slippage out of bounds'
    default:
      return errorName
  }
}

export enum TransactionStage {
  Check = 'Check',
  Submit = 'Submit',
  Failure = 'Failure',
}

const reportError = (
  network: Network,
  error: any,
  stage: TransactionStage,
  toastId: string,
  txName: TransactionType,
  receipt?: TransactionReceipt | null
) => {
  if (error?.code === 4001 || JSON.stringify(error).includes('user rejected transaction')) {
    // User rejected the transaction, skip report
    closeToast(toastId)
    return null
  }

  console.error(error)

  // Attempt to extract errorName to parse message

  const rawErrorMessage = String(error?.errorName ?? error?.data?.error?.message ?? error?.message).split('[')[0]

  let message = rawErrorMessage ? `Transaction Failed: ${getErrorMessage(rawErrorMessage)}` : 'Transaction Failed'
  if (receipt?.transactionHash) {
    message += ', click to view on etherscan'
  }

  // Log error to Sentry
  logError('TransactionFailed', { error, txName, stage, hash: receipt?.transactionHash, network })

  if (isScreeningEnabled()) {
    postTransactionError(network, stage, message, txName, receipt?.transactionHash)
  }

  updateToast(toastId, {
    variant: 'error',
    description: message,
    icon: IconType.AlertTriangle,
    href: receipt ? getExplorerUrl(network, receipt.transactionHash) : undefined,
    target: '_blank',
    autoClose: false,
  })
}

export type TransactionOptions = {
  title?: string
  description?: string
  timeout?: number
  onComplete?: (receipt: ContractReceipt) => any
  onSubmitted?: (receipt: TransactionResponse) => any
  onError?: (error: Error) => any
}

export default function useTransaction(
  network: Network
): (
  populatedTx: PopulatedTransaction | Promise<PopulatedTransaction>,
  txName: TransactionType,
  options?: TransactionOptions
) => Promise<ContractReceipt | null> {
  const { signer } = useWallet()

  return useCallback(
    async (
      populatedTx: PopulatedTransaction | Promise<PopulatedTransaction>,
      txName: TransactionType,
      options?: TransactionOptions
    ): Promise<ContractReceipt | null> => {
      const provider = getProvider(network)

      if (!signer) {
        console.warn('No signer')
        return null
      }

      const onError = options?.onError ?? emptyFunction

      const description = options?.description ? options.description.toLowerCase() : 'transaction'
      const toastId = createPendingToast({
        description: `Confirm your ${description}`,
        autoClose: false,
      })

      let tx: PopulatedTransaction
      try {
        tx = await populatedTx
      } catch (err) {
        reportError(network, err, TransactionStage.Check, toastId, txName)
        onError(err as Error)
        return null
      }

      let response: TransactionResponse
      try {
        console.time('tx')
        response = await signer.sendTransaction(tx)
        console.timeEnd('tx')
      } catch (err) {
        console.timeEnd('tx')
        reportError(network, err, TransactionStage.Submit, toastId, txName)
        onError(err as Error)
        return null
      }

      if (options?.onSubmitted) {
        options.onSubmitted(response)
      }

      const defaultTimeout = DEFAULT_OPTIMISM_TRANSACTION_TIMEOUT
      const transactionTimeout = options?.timeout ?? defaultTimeout
      const autoClose = transactionTimeout + POLL_INTERVAL // add buffer
      const txHref = getExplorerUrl(network, response.hash)

      updatePendingToast(toastId, {
        description: `Your ${description} is pending, click to view on etherscan`,
        href: txHref,
        target: '_blank',
        autoClose,
      })

      try {
        console.debug('tx', tx)
        console.time('waitForTransaction')
        // Poll for transaction receipt (can lead to faster results than .wait())
        const receipt = await new Promise<TransactionReceipt>(resolve => {
          let n = 0
          const pollReceipt = async () => {
            const receipt = await provider.getTransactionReceipt(response.hash)
            if (receipt) {
              resolve(receipt)
            } else if (n < 100) {
              n++
              setTimeout(pollReceipt, 500)
            } else {
              console.warn('Max retries exceeded')
            }
          }
          setTimeout(pollReceipt, 500)
        })
        console.debug('receipt', receipt)
        console.timeEnd('waitForTransaction')

        if (receipt && receipt.status === TransactionStatus.Failure) {
          try {
            const transaction = await provider.getTransaction(response.hash)
            await provider.call(transaction as any, response.blockNumber)
          } catch (err) {
            reportError(network, err, TransactionStage.Failure, toastId, txName, receipt)
          }
          return null
        }

        if (receipt && receipt.status === TransactionStatus.Success) {
          // Transaction was polled successfully
          if (options?.onComplete != null) {
            // Execute middleware mutation for successful transactions
            console.time('onComplete')
            await options.onComplete(receipt)
            console.timeEnd('onComplete')
          }

          if (isScreeningEnabled()) {
            postTransaction(network, txName, receipt.transactionHash)
          }

          const args: CreateToastOptions = {
            variant: 'success',
            description: `Your ${description} was successful`,
            href: txHref,
            target: '_blank',
            autoClose: DEFAULT_TOAST_TIMEOUT,
            icon: IconType.Check,
          }
          updateToast(toastId, args)
          return receipt
        } else {
          // Transaction timed out
          const args: CreateToastOptions = {
            variant: 'warning',
            description: `Your ${description} took longer than ${Math.floor(
              transactionTimeout / 1000
            )} seconds, view your transaction progress`,
            href: txHref,
            target: '_blank',
            autoClose: DEFAULT_TOAST_TIMEOUT,
            icon: IconType.AlertTriangle,
          }
          updateToast(toastId, args)
          onError(new Error('Transaction timed out'))
          return null
        }
      } catch (e) {
        // Capture error
        try {
          const receipt = await provider.getTransactionReceipt(response.hash)
          const transaction = await provider.getTransaction(response.hash)
          try {
            await provider.call(transaction as any, receipt.blockNumber)
            return null // Should never happen
          } catch (err) {
            reportError(network, err, TransactionStage.Failure, toastId, txName, receipt)
            onError(e as Error)
            return null
          }
        } catch (e) {
          reportError(
            network,
            new Error('Failed to fetch transaction receipt'),
            TransactionStage.Failure,
            toastId,
            txName
          )
          onError(e as Error)
          return null
        }
      }
    },
    [signer, network]
  )
}

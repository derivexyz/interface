import { BigNumber } from '@ethersproject/bignumber'
import { PopulatedTransaction } from '@ethersproject/contracts'
import { TransactionReceipt } from '@ethersproject/providers'
import { Network } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import getIsOwnerMultiSig from '@/app/utils/getIsOwnerMultiSig'
import getMultiSigWalletContract from '@/app/utils/getMultiSigWalletContract'

import useTransaction, { TransactionOptions } from '../account/useTransaction'
import useWallet from '../account/useWallet'
import useMutateAdminTransaction from '../mutations/useMutateAdminTransaction'

export default function useAdminTransaction(
  network: Network,
  owner: string
): (tx: PopulatedTransaction, options?: TransactionOptions) => Promise<TransactionReceipt | null> {
  const execute = useTransaction(network)
  const mutateAdminTransaction = useMutateAdminTransaction()
  const { signer, account } = useWallet()
  return useCallback(
    async (tx: PopulatedTransaction, options?: TransactionOptions) => {
      const { to, from, data } = tx
      if (!signer || !account || !to || !from || !data) {
        return null
      }
      // Check if owner is Multisig
      const isOwnerMultisig = await getIsOwnerMultiSig(network, owner)

      if (!isOwnerMultisig) {
        return execute(tx, options)
      }

      const multiSigWalletContract = getMultiSigWalletContract(network, owner, signer)
      // Encode the multisig submitTransaction data
      const multisigData = multiSigWalletContract.interface.encodeFunctionData('submitTransaction', [
        // Destination - actual contract (e.g. OptionMarket)
        to,
        // ETH transferred, always 0
        ZERO_BN,
        // Actual tx data (e.g. addBoard)
        data,
      ])

      // Encode your transaction to the multisig
      const multisigTx = {
        // Submitting from your wallet
        from: account,
        // Submitting to multisig
        to: multiSigWalletContract.address,
        // Raw calldata to execute
        data: multisigData,
        gasLimit: BigNumber.from(10_000_000), // Hardcode to 10m
      }

      return await execute(multisigTx, {
        ...options,
        onComplete: async receipt => {
          await mutateAdminTransaction()
          if (options?.onComplete) {
            await options.onComplete(receipt)
          }
        },
      })
    },
    [signer, account, network, owner, execute, mutateAdminTransaction]
  )
}

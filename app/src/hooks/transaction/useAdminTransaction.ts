import { BigNumber } from '@ethersproject/bignumber'
import { PopulatedTransaction } from '@ethersproject/contracts'
import { TransactionReceipt } from '@ethersproject/providers'
import { Network } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import getIsOwnerMultiSig from '@/app/utils/getIsOwnerMultiSig'
import getMultiSigWalletContract from '@/app/utils/getMultiSigWalletContract'

import useWallet from '../wallet/useWallet'
import useTransaction, { TransactionOptions } from './useTransaction'

export default function useAdminTransaction(
  network: Network,
  owner: string | null
): (tx: PopulatedTransaction, options?: TransactionOptions) => Promise<TransactionReceipt | null> {
  const execute = useTransaction(network)
  const { signer } = useWallet()
  return useCallback(
    async (tx: PopulatedTransaction, options?: TransactionOptions) => {
      const { to, from, data } = tx
      if (!signer || !owner || !to || !from || !data) {
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
        from: tx.from,
        // Submitting to multisig
        to: multiSigWalletContract.address,
        // Raw calldata to execute
        data: multisigData,
        gasLimit: BigNumber.from(10_000_000), // Hardcode to 10m
      }

      return await execute(multisigTx, options)
    },
    [signer, execute, owner]
  )
}

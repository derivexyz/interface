import { BigNumber } from '@ethersproject/bignumber'
import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Flex from '@lyra/ui/components/Flex'
import Icon, { IconType } from '@lyra/ui/components/Icon'
import ListItem from '@lyra/ui/components/List/ListItem'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import React, { useCallback } from 'react'

import AdminAddStrikeToBoardTransactionListItem from '@/app/components/admin/AdminAddStrikeToBoardTransactionListItem'
import AdminCreateOptionBoardTransactionListItem from '@/app/components/admin/AdminCreateOptionBoardTransactionListItem'
import useAdmin from '@/app/hooks/admin/useAdmin'
import useAdminGlobalOwner from '@/app/hooks/admin/useAdminGlobalOwner'
import useMultiSigTransaction, {
  AddStrikeToBoardTransaction,
  CreateOptionBoardTransaction,
  useMutateMultiSigTransaction,
} from '@/app/hooks/admin/useMultiSigTransaction'
import withSuspense from '@/app/hooks/data/withSuspense'
import useTransaction from '@/app/hooks/transaction/useTransaction'
import useWallet from '@/app/hooks/wallet/useWallet'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getMultiSigWalletContract from '@/app/utils/getMultiSigWalletContract'

// Filter out anything less than 10^-10, i.e. 10^8/10^18
const BN_CONVERSION_THRESHOLD = 10 ** 8

const AdminTransactionListItem = withSuspense(
  ({ transactionId, onConfirm }: { transactionId: BigNumber; onConfirm: () => void }) => {
    const { account, isConnected, signer } = useWallet()
    const admin = useAdmin()
    const owner = useAdminGlobalOwner()
    const transaction = useMultiSigTransaction(owner, transactionId)
    const mutateTransaction = useMutateMultiSigTransaction(owner, transactionId)
    const execute = useTransaction()
    const confirmTransaction = useCallback(
      async (transactionId: BigNumber) => {
        if (!admin || !owner || !account) {
          return
        }
        const multiSigWallet = getMultiSigWalletContract(owner, signer)
        const calldata = multiSigWallet.interface.encodeFunctionData('confirmTransaction', [transactionId])
        execute(
          { to: owner, from: account, data: calldata, gasLimit: BigNumber.from(10_000_000) },
          { onComplete: onConfirm }
        )
      },
      [admin, owner, account, execute, onConfirm, signer]
    )

    if (!transaction) {
      return null
    }

    const isNamedKeys =
      transaction.decodedData && !!Object.keys(transaction.decodedData).some(key => isNaN(parseInt(key)))
    let sublabel

    if (transaction.methodName?.includes('createOptionBoard')) {
      const props = (transaction as CreateOptionBoardTransaction).decodedData
      sublabel = <AdminCreateOptionBoardTransactionListItem {...props} />
    } else if (transaction.methodName?.includes('addStrikeToBoard')) {
      const props = (transaction as AddStrikeToBoardTransaction).decodedData
      sublabel = <AdminAddStrikeToBoardTransactionListItem {...props} />
    } else {
      sublabel = transaction.decodedData ? (
        <Box overflow="auto">
          {Object.entries(transaction.decodedData)
            .filter(([key]) => isNamedKeys && isNaN(parseInt(key)))
            .map(([key, val]) => {
              if (typeof val === 'object' && !BigNumber.isBigNumber(val)) {
                return (
                  <Box key={key} overflow="auto">
                    <Text variant="secondary" color="secondaryText">
                      {key}: {'{'}
                    </Text>
                    {Object.entries(val)
                      .filter(([key]) => isNamedKeys && isNaN(parseInt(key)))
                      .map(([key, val]) => {
                        return (
                          <Flex ml={4} key={transaction.contractId + key} flexWrap="wrap">
                            <Text variant="secondary" color="secondaryText">
                              {key}:
                            </Text>
                            <Text ml={1} variant="secondary" color="secondaryText">
                              {val.toString()}{' '}
                              {val._isBigNumber &&
                              (val.gt(BN_CONVERSION_THRESHOLD) || val.lt(-1 * BN_CONVERSION_THRESHOLD))
                                ? `(${fromBigNumber(val)})`
                                : null}
                            </Text>
                          </Flex>
                        )
                      })}
                    <Text variant="secondary" color="secondaryText">
                      {'}'}
                    </Text>
                  </Box>
                )
              }
              return (
                <Flex key={transaction.contractId + key} flexWrap="wrap">
                  <Text variant="secondary" color="secondaryText">
                    {key}:
                  </Text>
                  <Text ml={1} variant="secondary" color="secondaryText">
                    {val.toString()}{' '}
                    {BigNumber.isBigNumber(val) &&
                    (val.gt(BN_CONVERSION_THRESHOLD) || val.lt(-1 * BN_CONVERSION_THRESHOLD))
                      ? `(${fromBigNumber(val)})`
                      : null}
                  </Text>
                </Flex>
              )
            })}
        </Box>
      ) : (
        <Box overflow="scroll">
          <Text variant="secondary" color="secondaryText">
            {transaction.data}
          </Text>
        </Box>
      )
    }

    return (
      <ListItem
        key={transactionId.toString()}
        label={
          <Flex flexDirection="column">
            <Text>{transaction.methodName ?? transaction.destination}</Text>
            <Text color="primaryText" mr={transaction.contractId ? 1 : 0}>
              {transaction.contractId ?? ''}
            </Text>
          </Flex>
        }
        sublabel={sublabel}
        rightContent={
          !transaction.executed ? (
            <Box minWidth="fit-content">
              <Button
                variant="primary"
                size="sm"
                label="Confirm"
                isDisabled={!isConnected}
                onClick={() => {
                  mutateTransaction()
                  confirmTransaction(transactionId)
                }}
              />
            </Box>
          ) : (
            <Icon icon={IconType.Check} size={24} color="success" />
          )
        }
      />
    )
  },
  () => <ListItem label={<TextShimmer width="25%" />} sublabel={<TextShimmer width="50%" />} />
)

export default AdminTransactionListItem

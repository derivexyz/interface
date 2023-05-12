import Box from '@lyra/ui/components/Box'
import Text from '@lyra/ui/components/Text'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import React from 'react'

import TokenAmountText from '@/app/components/common/TokenAmountText'
import EscrowTable from '@/app/components/escrow/EscrowTable'
import { ZERO_BN } from '@/app/constants/bn'
import { AppNetwork } from '@/app/constants/networks'
import { TransactionType } from '@/app/constants/screen'
import ConnectWalletButton from '@/app/containers/common/ConnectWalletButton'
import useTransaction from '@/app/hooks/account/useTransaction'
import useWallet from '@/app/hooks/account/useWallet'
import { EscrowEventData } from '@/app/hooks/escrow/useEscrowPageData'
import { useMutateEscrowPageData } from '@/app/hooks/escrow/useEscrowPageData'
import { claimEscrow } from '@/app/utils/escrow/claimEscrow'

import Page from '../common/Page'

export type EscrowPageHelperProps = {
  escrowPageData: EscrowEventData[] | null
} & MarginProps &
  LayoutProps

export default function EscrowPageHelper({ escrowPageData }: EscrowPageHelperProps) {
  const { account } = useWallet()
  const mutateEscrowPageData = useMutateEscrowPageData(escrowPageData)

  const execute = useTransaction(AppNetwork.Ethereum)

  async function handleClaimEscrow(escrowProxy: string | null) {
    if (!escrowProxy || !account) {
      return
    }
    const tx = claimEscrow(escrowProxy, account)
    await execute(tx, TransactionType.ClaimEscrow, {
      onComplete: async () => {
        await mutateEscrowPageData()
      },
    })
  }

  return (
    <Page title="Escrow" subtitle="View escrowed tokens">
      {account ? (
        <Box>
          <Text> Total Locked:</Text>
          <TokenAmountText
            tokenNameOrAddress="lyra"
            amount={escrowPageData?.reduce((total, event) => (total += event.amount), 0) ?? ZERO_BN}
          />
          <EscrowTable escrowEvents={escrowPageData ?? []} handleClaimEscrow={handleClaimEscrow} />
        </Box>
      ) : (
        <Box>
          <Text marginBottom={4}>Connect with a beneficiary wallet of the escrow</Text>
          <ConnectWalletButton network={AppNetwork.Ethereum} size="lg" width={200} />
        </Box>
      )}
    </Page>
  )
}

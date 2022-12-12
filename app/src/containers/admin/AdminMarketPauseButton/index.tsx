import Button from '@lyra/ui/components/Button'
import Flex from '@lyra/ui/components/Flex'
import { Market } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'

import useAdmin from '@/app/hooks/admin/useAdmin'
import useIsMarketPaused, { useMutateIsMarketPaused } from '@/app/hooks/admin/useIsMarketPaused'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAdminTransaction from '@/app/hooks/transaction/useAdminTransaction'
import useWallet from '@/app/hooks/wallet/useWallet'

type Props = {
  market: Market
  owner: string
}

const AdminMarketPauseButton = withSuspense(({ market, owner }: Props) => {
  const admin = useAdmin()
  const { isConnected, account } = useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const isPaused = useIsMarketPaused(market.address)
  const mutateIsPaused = useMutateIsMarketPaused(market.address)
  const execute = useAdminTransaction(owner)
  return (
    <Flex mx={8} mt={4}>
      <Button
        isDisabled={!isConnected}
        isLoading={isLoading}
        variant={isPaused ? 'primary' : 'error'}
        label={isPaused ? `Unpause ${market.name} market` : `Pause ${market.name} market`}
        onClick={async () => {
          if (!owner || !account || !admin) {
            return
          }
          setIsLoading(true)
          const tx = admin.setMarketPaused(account, market.address, !isPaused)
          if (tx) {
            execute(tx, {
              onComplete: () => {
                mutateIsPaused()
                setIsLoading(false)
              },
            })
          } else {
            setIsLoading(false)
          }
        }}
      />
    </Flex>
  )
})

export default AdminMarketPauseButton

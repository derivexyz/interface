import Button from '@lyra/ui/components/Button'
import Flex from '@lyra/ui/components/Flex'
import { Market } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'

import useAdmin from '@/app/hooks/admin/useAdmin'
import useIsMarketPaused, { useMutateIsMarketPaused } from '@/app/hooks/admin/useIsMarketPaused'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAdminTransaction from '@/app/hooks/transaction/useAdminTransaction'
import useWallet from '@/app/hooks/wallet/useWallet'
import getMarketDisplayName from '@/app/utils/getMarketDisplayName'

type Props = {
  market: Market
  owner: string
}

const AdminMarketPauseButton = withSuspense(({ market, owner }: Props) => {
  const admin = useAdmin(market.lyra.network)
  const { isConnected, account } = useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const isPaused = useIsMarketPaused(market)
  const mutateIsPaused = useMutateIsMarketPaused(market)
  const execute = useAdminTransaction(market.lyra.network, owner)
  return (
    <Flex mx={8} mt={4}>
      <Button
        isDisabled={!isConnected}
        isLoading={isLoading}
        variant={isPaused ? 'primary' : 'error'}
        label={
          isPaused ? `Unpause ${getMarketDisplayName(market)} market` : `Pause ${getMarketDisplayName(market)} market`
        }
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

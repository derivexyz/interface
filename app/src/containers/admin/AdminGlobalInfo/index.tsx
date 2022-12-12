import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import React, { useState } from 'react'

import useAdmin from '@/app/hooks/admin/useAdmin'
import useAdminGlobalOwner from '@/app/hooks/admin/useAdminGlobalOwner'
import useIsGlobalPaused, { useMutateIsGlobalPaused } from '@/app/hooks/admin/useIsGlobalPaused'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAdminTransaction from '@/app/hooks/transaction/useAdminTransaction'
import useWallet from '@/app/hooks/wallet/useWallet'
import getExplorerUrl from '@/app/utils/getExplorerUrl'
import getOptimismChainId from '@/app/utils/getOptimismChainId'

const AdminGlobalInfo = withSuspense(
  () => {
    const { account, isConnected } = useWallet()
    const globalOwner = useAdminGlobalOwner()
    const admin = useAdmin()
    const isGlobalPaused = useIsGlobalPaused()
    const mutateIsGlobalPaused = useMutateIsGlobalPaused()
    const execute = useAdminTransaction(globalOwner)
    const [isLoading, setIsLoading] = useState(false)
    return (
      <Box mt={4} mx={8}>
        {globalOwner ? (
          <Flex mb={2}>
            <Button
              label={`Global Owner: ${globalOwner}`}
              target="_blank"
              href={getExplorerUrl(getOptimismChainId(), globalOwner)}
              rightIcon={IconType.ExternalLink}
            />
          </Flex>
        ) : null}
        <Flex>
          <Button
            isDisabled={!isConnected}
            isLoading={isLoading}
            variant={isGlobalPaused ? 'primary' : 'error'}
            label={isGlobalPaused ? 'Unpause Global' : 'Pause Global'}
            onClick={async () => {
              if (!globalOwner || !admin || !account) {
                return
              }
              setIsLoading(true)
              const tx = await admin.setGlobalPaused(account, !isGlobalPaused)
              if (tx) {
                execute(tx, {
                  onComplete: () => {
                    mutateIsGlobalPaused()
                    setIsLoading(false)
                  },
                })
              } else {
                setIsLoading(false)
              }
            }}
          />
        </Flex>
      </Box>
    )
  },
  () => (
    <Flex mt={4} mx={8}>
      <ButtonShimmer width={120} />
    </Flex>
  )
)

export default AdminGlobalInfo

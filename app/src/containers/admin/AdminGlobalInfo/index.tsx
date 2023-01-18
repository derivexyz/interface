import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import Text from '@lyra/ui/components/Text'
import { Network } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'

import useAdmin from '@/app/hooks/admin/useAdmin'
import useAdminGlobalOwner from '@/app/hooks/admin/useAdminGlobalOwner'
import useIsGlobalPaused, { useMutateIsGlobalPaused } from '@/app/hooks/admin/useIsGlobalPaused'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAdminTransaction from '@/app/hooks/transaction/useAdminTransaction'
import useNetwork from '@/app/hooks/wallet/useNetwork'
import useWallet from '@/app/hooks/wallet/useWallet'
import getExplorerUrl from '@/app/utils/getExplorerUrl'

const AdminGlobalInfo = withSuspense(
  () => {
    const { account, isConnected } = useWallet()
    const network = useNetwork()
    const globalOwnerOptimism = useAdminGlobalOwner(Network.Optimism)
    const globalOwnerArbitrum = useAdminGlobalOwner(Network.Arbitrum)
    const admin = useAdmin(network)
    const isGlobalPaused = useIsGlobalPaused(network)
    const mutateIsGlobalPaused = useMutateIsGlobalPaused(network)
    const execute = useAdminTransaction(network, globalOwnerOptimism)
    const [isLoading, setIsLoading] = useState(false)
    return (
      <Box mt={4} mx={8}>
        {globalOwnerOptimism ? (
          <Flex mb={2} flexDirection="column">
            <Text>Optimism</Text>
            <Flex>
              <Button
                label={`Global Owner: ${globalOwnerOptimism}`}
                target="_blank"
                href={getExplorerUrl(Network.Optimism, globalOwnerOptimism)}
                rightIcon={IconType.ExternalLink}
              />
            </Flex>
          </Flex>
        ) : null}
        {globalOwnerArbitrum ? (
          <Flex mb={2} flexDirection="column">
            <Text>Arbitrum</Text>
            <Flex>
              <Button
                label={`Global Owner: ${globalOwnerArbitrum}`}
                target="_blank"
                href={getExplorerUrl(Network.Optimism, globalOwnerArbitrum)}
                rightIcon={IconType.ExternalLink}
              />
            </Flex>
          </Flex>
        ) : null}
        <Flex>
          <Button
            isDisabled={!isConnected}
            isLoading={isLoading}
            variant={isGlobalPaused ? 'primary' : 'error'}
            label={isGlobalPaused ? 'Unpause Global' : 'Pause Global'}
            onClick={async () => {
              if (!globalOwnerOptimism || !admin || !account) {
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

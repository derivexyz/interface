import withSuspense from '@lyra/app/hooks/data/withSuspense'
import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import { LayoutProps, MarginProps, PaddingProps } from '@lyra/ui/types'
import React from 'react'

import VaultsIndexMarketsTableOrList from '@/app/components/vaults_index/VaultsIndexMarketsTableOrList'
import { PageId } from '@/app/constants/pages'
import useVaults from '@/app/hooks/vaults/useVaults'
import useVaultsHistory from '@/app/hooks/vaults/useVaultsHistory'
import getPagePath from '@/app/utils/getPagePath'

type Props = MarginProps & LayoutProps & PaddingProps

const VaultsIndexMarketsCard = withSuspense(
  ({ ...styleProps }: Props) => {
    const vaults = useVaults()
    const vaultHistory = useVaultsHistory()
    return (
      <Card {...styleProps} overflow="hidden">
        <CardBody noPadding>
          <Flex>
            <Text variant="heading" mx={6} mt={6} mb={[3, 0]}>
              Vaults
            </Text>
            {vaultHistory.deposits.length > 0 || vaultHistory.withdrawals.length > 0 ? (
              <Button
                ml="auto"
                variant="light"
                label="History →"
                href={getPagePath({ page: PageId.VaultsHistory })}
                mr={6}
                mt={6}
                mb={[3, 0]}
              />
            ) : null}
          </Flex>
          <VaultsIndexMarketsTableOrList vaults={vaults} />
        </CardBody>
      </Card>
    )
  },
  ({ ...styleProps }) => (
    <Card {...styleProps} height={[134, 190]}>
      <CardBody height="100%">
        <Center height="100%">
          <Spinner />
        </Center>
      </CardBody>
    </Card>
  )
)

export default VaultsIndexMarketsCard

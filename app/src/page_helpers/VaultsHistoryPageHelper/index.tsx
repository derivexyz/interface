import IconButton from '@lyra/ui/components/Button/IconButton'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import { LayoutProps, MarginProps, PaddingProps } from '@lyra/ui/types'
import React, { useMemo } from 'react'
import { CSVLink } from 'react-csv'
import { useNavigate } from 'react-router-dom'

import VaultEventsTable from '@/app/components/common/VaultEventsTable'
import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import useVaultsHistory from '@/app/hooks/vaults/useVaultsHistory'
import getPagePath from '@/app/utils/getPagePath'
import { getVaultsHistoryCSV } from '@/app/utils/getVaultsHistoryCSV'

import Layout from '../common/Layout'
import LayoutGrid from '../common/Layout/LayoutGrid'

type Props = MarginProps & LayoutProps & PaddingProps

const DownloadVaultsHistory = withSuspense(
  () => {
    const vaultBalances = useVaultsHistory()
    const { headers, data } = useMemo(() => getVaultsHistoryCSV(vaultBalances), [vaultBalances])
    return data.length > 0 ? (
      <Flex ml="auto">
        <CSVLink data={data} headers={headers} filename={'lyra_vault_history.csv'}>
          <IconButton icon={IconType.Download} variant="light" />
        </CSVLink>
      </Flex>
    ) : null
  },
  () => <ButtonShimmer ml="auto" maxWidth={40} />
)

const VaultsHistory = withSuspense(
  ({ ...styleProps }: Props) => {
    const vaultBalances = useVaultsHistory()
    const navigate = useNavigate()
    return vaultBalances.deposits.length > 0 || vaultBalances.withdrawals.length > 0 ? (
      <VaultEventsTable
        events={[...vaultBalances.deposits, ...vaultBalances.withdrawals]}
        pageSize={10}
        onClick={event => navigate(getPagePath({ page: PageId.Vaults, marketAddressOrName: event.market().name }))}
        {...styleProps}
      />
    ) : (
      <Flex p={6}>
        <Text color="secondaryText">You have no vault history</Text>
      </Flex>
    )
  },
  ({ ...styleProps }) => (
    <Center {...styleProps} height="100%" minHeight={120}>
      <Spinner />
    </Center>
  )
)

export default function VaultsHistoryPageHelper(): JSX.Element {
  return (
    <Layout mobileHeader="History" desktopHeader="History" showBackButton mobileCollapsedHeader="History">
      <LayoutGrid>
        <Card overflow="hidden">
          <CardBody noPadding>
            <Flex p={4}>
              <DownloadVaultsHistory />
            </Flex>
            <VaultsHistory />
          </CardBody>
        </Card>
      </LayoutGrid>
    </Layout>
  )
}

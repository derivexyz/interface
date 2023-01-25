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
import useVaultsTableData from '@/app/hooks/vaults/useVaultsPageData'
import getPagePath from '@/app/utils/getPagePath'
import { getVaultsHistoryCSV } from '@/app/utils/getVaultsHistoryCSV'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

type Props = MarginProps & LayoutProps & PaddingProps

const DownloadVaultsHistory = withSuspense(
  () => {
    const rows = useVaultsTableData()
    const { headers, data } = useMemo(() => getVaultsHistoryCSV(rows), [rows])
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
    const rows = useVaultsTableData()
    const navigate = useNavigate()
    const depositsAndWithdrawals = useMemo(() => {
      return [...rows.flatMap(r => r.allDeposits), ...rows.flatMap(r => r.allWithdrawals)]
    }, [rows])
    return depositsAndWithdrawals.length > 0 ? (
      <VaultEventsTable
        events={depositsAndWithdrawals}
        pageSize={10}
        onClick={event =>
          navigate(
            getPagePath({
              page: PageId.Vaults,
              network: event.market().lyra.network,
              marketAddressOrName: event.market().name,
            })
          )
        }
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
    <Page header="History" showBackButton backHref={getPagePath({ page: PageId.VaultsIndex })}>
      <PageGrid>
        <Card overflow="hidden">
          <CardBody noPadding>
            <Flex p={4}>
              <DownloadVaultsHistory />
            </Flex>
            <VaultsHistory />
          </CardBody>
        </Card>
      </PageGrid>
    </Page>
  )
}

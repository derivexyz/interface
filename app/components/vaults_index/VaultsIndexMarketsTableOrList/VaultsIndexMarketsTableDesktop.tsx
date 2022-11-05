import MarketImage from '@lyra/app/components/common/MarketImage'
import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Table, { TableCellProps, TableColumn, TableData, TableElement } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'

import { VaultsIndexMarketsTableOrListProps } from '@/app/components/vaults_index/VaultsIndexMarketsTableOrList'
import { PageId } from '@/app/constants/pages'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getMarketDisplayName from '@/app/utils/getMarketDisplayName'
import getPagePath from '@/app/utils/getPagePath'

import MMVPerfTooltip from '../../common/MMVPerfTooltip'
import TokenAPYRangeText from '../../common/TokenAPYRangeText'
import VaultAPYTooltip from '../../common/VaultAPYTooltip'

type VaultsIndexMarketsTableData = TableData<{
  market: string
  marketQuoteSymbol: string
  marketBaseSymbol: string
  tvl: number
  tvlChange: number
  apy: number
  maxApy: number
  lyraApy: number
  opApy: number
  tokenPrice30DChange: number
  tokenPrice30DChangeAnnualized: number
  onClick?: () => void
}>

const VaultsIndexMarketsTableDesktop = ({
  vaults,
  ...styleProps
}: VaultsIndexMarketsTableOrListProps): TableElement<VaultsIndexMarketsTableData> => {
  const { push } = useRouter()
  const rows: VaultsIndexMarketsTableData[] = useMemo(() => {
    return vaults.map(vault => {
      const market = vault.market
      return {
        market: market.name,
        marketQuoteSymbol: market.quoteToken.symbol,
        marketBaseSymbol: market.baseToken.symbol,
        tvl: vault.tvl,
        tvlChange: vault.tvlChange,
        volume: vault.tradingVolume30D,
        openInterest: fromBigNumber(market.openInterest),
        openInterestDollars: fromBigNumber(market.openInterest) * fromBigNumber(market.spotPrice),
        tokenPrice30DChange: vault.tokenPrice30DChange,
        tokenPrice30DChangeAnnualized: vault.tokenPrice30DChangeAnnualized,
        apy: vault.minApy,
        lyraApy: vault.minLyraApy,
        opApy: vault.minOpApy,
        maxApy: vault.maxApy,
        onClick: () => push(getPagePath({ page: PageId.Vaults, marketAddressOrName: market.name })),
      }
    })
  }, [push, vaults])
  const columns = useMemo<TableColumn<VaultsIndexMarketsTableData>[]>(
    () => [
      {
        accessor: 'market',
        Header: 'Market',
        Cell: (props: TableCellProps<VaultsIndexMarketsTableData>) => {
          const market = getMarketDisplayName(props.cell.value)
          return (
            <Flex alignItems="center">
              <MarketImage size={32} name={props.cell.value} />
              <Box ml={2}>
                <Text variant="secondaryMedium">{market}</Text>
                <Text variant="small" color="secondaryText">
                  {props.row.original.marketBaseSymbol}-{props.row.original.marketQuoteSymbol}
                </Text>
              </Box>
            </Flex>
          )
        },
      },
      {
        accessor: 'tvl',
        Header: 'TVL',
        Cell: (props: TableCellProps<VaultsIndexMarketsTableData>) => {
          return props.cell.value > 0 ? (
            <Text variant="secondary">{formatTruncatedUSD(props.cell.value)}</Text>
          ) : (
            <Text variant="secondary" color="secondaryText">
              -
            </Text>
          )
        },
      },
      {
        accessor: 'apy',
        Header: 'Rewards APY',
        Cell: ({ cell }: TableCellProps<VaultsIndexMarketsTableData>) => {
          return cell.value > 0 ? (
            <VaultAPYTooltip
              alignItems="center"
              marketName={cell.row.original.market}
              opApy={cell.row.original.opApy}
              lyraApy={cell.row.original.lyraApy}
            >
              <TokenAPYRangeText
                tokenNameOrAddress={['stkLyra', 'OP']}
                variant="secondary"
                color="primaryText"
                leftValue={formatPercentage(cell.row.original.apy, true)}
                rightValue={formatPercentage(cell.row.original.maxApy, true)}
              />
            </VaultAPYTooltip>
          ) : (
            <Text variant="secondary" color="secondaryText">
              -
            </Text>
          )
        },
      },
      {
        accessor: 'tokenPrice30DChangeAnnualized',
        Header: '30D Perf. (Annualized)',
        Cell: ({ cell }: TableCellProps<VaultsIndexMarketsTableData>) => {
          return cell.value ? (
            <MMVPerfTooltip
              alignItems="center"
              marketName={cell.row.original.market}
              tokenPrice30DChange={cell.row.original.tokenPrice30DChange}
              tokenPrice30DChangeAnnualized={cell.value}
            >
              <Text variant="secondary" color={cell.value >= 0 ? 'primaryText' : 'errorText'}>
                {formatPercentage(cell.value, cell.value === 0)}
              </Text>
            </MMVPerfTooltip>
          ) : (
            <Text variant="secondary" color="secondaryText">
              -
            </Text>
          )
        },
      },
      {
        accessor: 'id',
        Header: '',
        width: 100,
        Cell: (props: TableCellProps<VaultsIndexMarketsTableData>) => (
          <Flex justifyContent={'flex-end'} width="100%">
            <Button
              variant="primary"
              label="Deposit"
              rightIcon={IconType.ArrowRight}
              href={getPagePath({ page: PageId.Vaults, marketAddressOrName: props.row.original.market })}
              minWidth={100}
            />
          </Flex>
        ),
      },
    ],
    []
  )
  return <Table width="100%" data={rows} columns={columns} {...styleProps} />
}

export default VaultsIndexMarketsTableDesktop

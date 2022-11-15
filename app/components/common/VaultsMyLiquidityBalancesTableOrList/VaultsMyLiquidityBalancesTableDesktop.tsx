import Button from '@lyra/ui/components/Button'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Table, { TableCellProps, TableColumn, TableData, TableElement } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import React, { useMemo } from 'react'

import { PageId } from '@/app/constants/pages'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getPagePath from '@/app/utils/getPagePath'

import MarketLabel from '../MarketLabel'
import TokenAmountText from '../TokenAmountText'
import VaultAPYTooltip from '../VaultAPYTooltip'
import { VaultsMyLiquidityBalancesTableOrListProps } from '.'

type VaultsMyLiquidityBalancesTableOrListData = TableData<{
  market: string
  tvl: number
  value: number
  tokenPrice90DChange: number
  tokenPrice90DChangeAnnualized: number
  apy: number
  apyMultiplier: number
  opApy: number
  lyraApy: number
  pnl: number
  pnlPercent: number
  stakedLyraBalance: number
}>

const VaultsMyLiquidityBalancesTableDesktop = ({
  vaultBalances,
  onClick,
  ...styleProps
}: VaultsMyLiquidityBalancesTableOrListProps): TableElement<VaultsMyLiquidityBalancesTableOrListData> => {
  const rows: VaultsMyLiquidityBalancesTableOrListData[] = useMemo(() => {
    return vaultBalances.map(vaultBalance => {
      const { balance, vault, myApy, myApyMultiplier, myPnl, myPnlPercent, accountRewardEpoch } = vaultBalance
      return {
        market: balance.market.name,
        tvl: fromBigNumber(balance.market.tvl),
        value: fromBigNumber(balance.value),
        tokenPrice90DChange: vault.tokenPrice90DChange,
        tokenPrice90DChangeAnnualized: vault.tokenPrice90DChangeAnnualized,
        apy: myApy.total,
        apyMultiplier: myApyMultiplier,
        opApy: myApy.op,
        lyraApy: myApy.lyra,
        pnl: myPnl,
        pnlPercent: myPnlPercent,
        stakedLyraBalance: accountRewardEpoch?.stakedLyraBalance ?? 0,
        onClick: onClick ? () => onClick(vaultBalance) : undefined,
      }
    })
  }, [onClick, vaultBalances])

  const stakedLyraBalance = vaultBalances.length > 0 ? vaultBalances[0].accountRewardEpoch?.stakedLyraBalance ?? 0 : 0
  const isBoostedApy = stakedLyraBalance > 0

  const columns = useMemo<TableColumn<VaultsMyLiquidityBalancesTableOrListData>[]>(() => {
    const columns: TableColumn<VaultsMyLiquidityBalancesTableOrListData>[] = [
      {
        accessor: 'market',
        Header: 'Market',
        Cell: (props: TableCellProps<VaultsMyLiquidityBalancesTableOrListData>) => {
          return <MarketLabel marketName={props.cell.value} />
        },
      },
      {
        accessor: 'value',
        Header: 'Balance',
        Cell: (props: TableCellProps<VaultsMyLiquidityBalancesTableOrListData>) => {
          return (
            <Text variant="secondary" color={props.cell.value > 0 ? 'text' : 'secondaryText'}>
              {props.cell.value > 0 ? formatTruncatedUSD(props.cell.value) : '-'}
            </Text>
          )
        },
      },
      {
        accessor: 'apy',
        Header: isBoostedApy ? 'Boosted APY' : 'My APY',
        Cell: ({ cell }: TableCellProps<VaultsMyLiquidityBalancesTableOrListData>) => {
          return cell.value > 0 ? (
            <VaultAPYTooltip
              alignItems="center"
              marketName={cell.row.original.market}
              opApy={cell.row.original.opApy}
              lyraApy={cell.row.original.lyraApy}
              apyMultiplier={cell.row.original.apyMultiplier}
              stakedLyraBalance={cell.row.original.stakedLyraBalance}
            >
              <TokenAmountText
                tokenNameOrAddress={['stkLyra', 'OP']}
                amount={cell.value}
                isPercentage
                variant="secondary"
                color="primaryText"
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
        accessor: 'pnl',
        Header: 'Profit / Loss',
        Cell: ({ cell }: TableCellProps<VaultsMyLiquidityBalancesTableOrListData>) => {
          const { pnl, value } = cell.row.original
          return (
            <Text
              variant="secondary"
              color={pnl === 0 || value === 0 ? 'secondaryText' : pnl > 0 ? 'primaryText' : 'errorText'}
            >
              {value > 0 ? formatTruncatedUSD(pnl, { showSign: true }) : '-'}
            </Text>
          )
        },
      },
      {
        accessor: 'id',
        Header: '',
        width: 100,
        Cell: ({ cell }: TableCellProps<VaultsMyLiquidityBalancesTableOrListData>) => {
          return (
            <Flex width={100} justifyContent="flex-end">
              <Button
                href={getPagePath({ page: PageId.Vaults, marketAddressOrName: cell.row.original.market })}
                rightIcon={IconType.ArrowRight}
                label="View"
                minWidth={100}
              />
            </Flex>
          )
        },
      },
    ]
    return columns
  }, [isBoostedApy])
  return <Table width="100%" data={rows} columns={columns} {...styleProps} />
}

export default VaultsMyLiquidityBalancesTableDesktop

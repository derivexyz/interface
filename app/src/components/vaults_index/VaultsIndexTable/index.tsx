import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Table, { TableCellProps, TableColumn, TableData, TableElement } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import formatBalance from '@lyra/ui/utils/formatBalance'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedDuration from '@lyra/ui/utils/formatTruncatedDuration'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Market } from '@lyrafinance/lyra-js'
import React, { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { IGNORE_VAULTS_LIST } from '@/app/constants/ignore'
import { PageId } from '@/app/constants/pages'
import VaultsDepositFormModal from '@/app/containers/vaults/VaultsDepositFormModal'
import { VaultTableRowData } from '@/app/hooks/vaults/useVaultsTableData'
import filterNulls from '@/app/utils/filterNulls'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'
import getPagePath from '@/app/utils/getPagePath'

import VaultsBoostFormModal from '../../../containers/vaults/VaultsBoostFormModal'
import MarketImage from '../../common/MarketImage'

export type VaultsIndexTableProps = {
  vaultData: VaultTableRowData[]
} & MarginProps &
  LayoutProps

type VaultsIndexTableData = TableData<{
  vaultData: VaultTableRowData
  vaultName: string
  balance: number
  tvl: number
  apy: number
  depositing: number
  withdrawing: number
  onClick?: () => void
}>

const VaultsIndexTable = ({ vaultData, ...styleProps }: VaultsIndexTableProps): TableElement<VaultsIndexTableData> => {
  const navigate = useNavigate()
  const [depositModalMarket, setDepositModalMarket] = useState<Market | null>(null)
  const [boostModalMarket, setBoostModalMarket] = useState<Market | null>(null)
  const onModalClose = useCallback(() => {
    setDepositModalMarket(null)
    setBoostModalMarket(null)
  }, [])

  const pendingDeposits = useMemo(() => vaultData.flatMap(s => s.pendingDeposits), [vaultData])
  const pendingWithdrawals = useMemo(() => vaultData.flatMap(s => s.pendingWithdrawals), [vaultData])
  const balance = useMemo(
    () => vaultData.reduce((sum, s) => sum + fromBigNumber(s.liquidityToken.balance), 0),
    [vaultData]
  )

  const rows: VaultsIndexTableData[] = useMemo(() => {
    return vaultData
      .filter(
        vaultData =>
          !IGNORE_VAULTS_LIST.find(
            ({ marketName, chain }) => marketName === vaultData.market.name && chain === vaultData.market.lyra.chain
          ) || vaultData.liquidityToken.balance.gt(0)
      )
      .map(vaultData => {
        const { market, tvl, apy, liquidityTokenBalanceValue, pendingDeposits, pendingWithdrawals } = vaultData
        return {
          vaultData,
          vaultName: market.baseToken.symbol,
          balance: liquidityTokenBalanceValue,
          tvl,
          apy: apy.total,
          depositing: pendingDeposits.reduce((sum, d) => sum + fromBigNumber(d.value), 0),
          withdrawing: pendingWithdrawals.reduce((sum, d) => sum + fromBigNumber(d.balance), 0),
          onClick: () => {
            if (!depositModalMarket) {
              navigate(
                getPagePath({ page: PageId.Vaults, network: market.lyra.network, marketAddressOrName: market.name })
              )
            }
          },
        }
      })
  }, [navigate, vaultData, depositModalMarket])
  const columns = useMemo<TableColumn<VaultsIndexTableData>[]>(
    () =>
      filterNulls([
        {
          accessor: 'vaultName',
          Header: 'Vault',
          Cell: (props: TableCellProps<VaultsIndexTableData>) => {
            const {
              vaultData: { market },
            } = props.row.original
            return (
              <Flex alignItems="center">
                <MarketImage market={market} />
                <Box ml={2}>
                  <Text variant="secondaryMedium">{props.cell.value}</Text>
                  <Text variant="small" color="secondaryText">
                    {getNetworkDisplayName(market.lyra.network)}
                  </Text>
                </Box>
              </Flex>
            )
          },
        },
        {
          accessor: 'balance',
          Header: 'Your Liquidity',
          Cell: (props: TableCellProps<VaultsIndexTableData>) => {
            const {
              vaultData: { market },
            } = props.row.original
            return (
              <Box>
                <Text variant={props.cell.value > 0 ? 'secondaryMedium' : 'secondary'}>
                  {formatUSD(props.cell.value)}
                </Text>
                <Text variant="small" color="secondaryText">
                  {market.quoteToken.symbol}
                </Text>
              </Box>
            )
          },
        },
        pendingDeposits.length
          ? {
              accessor: 'depositing',
              Header: 'Your Deposits',
              Cell: (props: TableCellProps<VaultsIndexTableData>) => {
                const {
                  depositing,
                  vaultData: { market, pendingDeposits },
                } = props.row.original
                if (!depositing || !pendingDeposits.length) {
                  return (
                    <Text variant="secondary" color="secondaryText">
                      -
                    </Text>
                  )
                }
                const latestDepositTimestamp = Math.max(...pendingDeposits.map(d => d.depositTimestamp))
                return (
                  <Box>
                    <Text variant="secondary">{formatUSD(depositing)}</Text>
                    <Text variant="small" color="secondaryText">
                      in {formatTruncatedDuration(Math.max(0, latestDepositTimestamp - market.block.timestamp))}
                    </Text>
                  </Box>
                )
              },
            }
          : null,
        pendingWithdrawals.length
          ? {
              accessor: 'withdrawing',
              Header: 'Your Withdrawals',
              Cell: (props: TableCellProps<VaultsIndexTableData>) => {
                const {
                  withdrawing,
                  vaultData: { market, pendingWithdrawals },
                } = props.row.original
                if (!withdrawing || !pendingWithdrawals.length) {
                  return (
                    <Text variant="secondary" color="secondaryText">
                      -
                    </Text>
                  )
                }
                const latestWithdrawTimestamp = Math.max(...pendingWithdrawals.map(d => d.withdrawalTimestamp))
                return (
                  <Box>
                    <Text variant="secondary">{formatBalance(withdrawing, market.liquidityToken.symbol)}</Text>
                    <Text variant="small" color="secondaryText">
                      in {formatTruncatedDuration(Math.max(0, latestWithdrawTimestamp - market.block.timestamp))}
                    </Text>
                  </Box>
                )
              },
            }
          : null,
        {
          accessor: 'tvl',
          Header: 'TVL',
          Cell: (props: TableCellProps<VaultsIndexTableData>) => {
            return <Text variant="secondary">{formatTruncatedUSD(props.cell.value)}</Text>
          },
        },
        {
          accessor: 'apy',
          Header: 'Rewards APY',
          Cell: ({ cell }: TableCellProps<VaultsIndexTableData>) => {
            const { vaultData } = cell.row.original
            const { market } = vaultData
            if (
              IGNORE_VAULTS_LIST.find(
                ({ marketName, chain }) => marketName === market.name && chain === market.lyra.chain
              )
            ) {
              return (
                <Text variant="secondary" color="secondaryText">
                  -
                </Text>
              )
            }
            return (
              <Box>
                <Flex alignItems="center">
                  <Text
                    variant="secondary"
                    color={
                      vaultData.apy.total > 0 && vaultData.apy.total > vaultData.minApy.total ? 'primaryText' : 'text'
                    }
                  >
                    {formatPercentage(cell.row.original.apy, true)}
                  </Text>
                </Flex>
                {vaultData.apy.total > 0 ? (
                  <Text variant="small" color="secondaryText">
                    {formatPercentage(vaultData.minApy.total, true)}
                    {' - '}
                    {formatPercentage(vaultData.maxApy.total, true)}
                    {vaultData.minApy.op ? ' OP' : ''}
                    {vaultData.minApy.lyra ? ', stkLYRA' : ''}
                  </Text>
                ) : null}
              </Box>
            )
          },
        },
        {
          id: 'deposit',
          width: 110,
          Cell: (props: TableCellProps<VaultsIndexTableData>) => {
            const {
              vaultData: { market },
            } = props.cell.row.original
            return (
              <>
                <Button
                  label="Deposit"
                  variant="primary"
                  isDisabled={
                    !!IGNORE_VAULTS_LIST.find(
                      ({ marketName, chain }) => marketName === market.name && chain === market.lyra.chain
                    )
                  }
                  onClick={e => {
                    setDepositModalMarket(market)
                    e.stopPropagation()
                    e.preventDefault()
                  }}
                  width="100%"
                />
              </>
            )
          },
        },
        balance > 0
          ? {
              id: 'boost',
              width: 105,
              Cell: (props: TableCellProps<VaultsIndexTableData>) => {
                const {
                  vaultData: { market, apy, maxApy },
                } = props.cell.row.original

                // Check for max boost with 1% buffer
                const isMaxBoost = maxApy.total > 0 && apy.total * 1.01 > maxApy.total
                return (
                  <>
                    <Button
                      label="Boost"
                      rightIcon={isMaxBoost ? IconType.Check : null}
                      variant="primary"
                      isDisabled={
                        !!IGNORE_VAULTS_LIST.find(
                          ({ marketName, chain }) => marketName === market.name && chain === market.lyra.chain
                        ) ||
                        isMaxBoost ||
                        maxApy.total === 0
                      }
                      onClick={e => {
                        setBoostModalMarket(market)
                        e.stopPropagation()
                        e.preventDefault()
                      }}
                      width="100%"
                    />
                  </>
                )
              },
            }
          : null,
      ]),
    [pendingDeposits.length, pendingWithdrawals.length, balance]
  )
  return (
    <>
      <Table width="100%" data={rows} columns={columns} {...styleProps} />
      {boostModalMarket ? (
        <VaultsBoostFormModal isOpen={!!boostModalMarket} onClose={onModalClose} market={boostModalMarket} />
      ) : null}
      {depositModalMarket ? (
        <VaultsDepositFormModal isOpen={!!depositModalMarket} onClose={onModalClose} market={depositModalMarket} />
      ) : null}
    </>
  )
}

export default VaultsIndexTable

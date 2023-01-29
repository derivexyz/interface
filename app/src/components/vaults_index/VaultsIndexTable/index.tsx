import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Table, { TableCellProps, TableColumn, TableData, TableElement } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import formatBalance from '@lyra/ui/utils/formatBalance'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatTruncatedDuration from '@lyra/ui/utils/formatTruncatedDuration'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import formatUSD from '@lyra/ui/utils/formatUSD'
import React, { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { IGNORE_VAULTS_LIST } from '@/app/constants/ignore'
import { PageId } from '@/app/constants/pages'
import { Vault } from '@/app/constants/vault'
import VaultsDepositFormModal from '@/app/containers/vaults/VaultsDepositFormModal'
import filterNulls from '@/app/utils/filterNulls'
import formatAPY from '@/app/utils/formatAPY'
import formatAPYRange from '@/app/utils/formatAPYRange'
import formatTokenName from '@/app/utils/formatTokenName'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'
import getPagePath from '@/app/utils/getPagePath'

import VaultsBoostFormModal from '../../../containers/vaults/VaultsBoostFormModal'
import MarketImage from '../../common/MarketImage'

export type VaultsIndexTableProps = {
  vaults: Vault[]
} & MarginProps &
  LayoutProps

type VaultsIndexTableData = TableData<{
  vault: Vault
  vaultName: string
  balance: number
  tvl: number
  apy: number
  depositing: number
  withdrawing: number
  onClick?: () => void
}>

const VaultsIndexTable = ({ vaults, ...styleProps }: VaultsIndexTableProps): TableElement<VaultsIndexTableData> => {
  const navigate = useNavigate()
  const [depositModalVault, setDepositModalVault] = useState<Vault | null>(null)
  const [boostModalVault, setBoostModalVault] = useState<Vault | null>(null)
  const onModalClose = useCallback(() => {
    setDepositModalVault(null)
    setBoostModalVault(null)
  }, [])

  const pendingDeposits = useMemo(() => vaults.flatMap(s => s.pendingDeposits), [vaults])
  const pendingWithdrawals = useMemo(() => vaults.flatMap(s => s.pendingWithdrawals), [vaults])
  const balance = useMemo(() => vaults.reduce((sum, s) => sum + fromBigNumber(s.liquidityToken.balance), 0), [vaults])

  const rows: VaultsIndexTableData[] = useMemo(() => {
    return vaults.map(vault => {
      const { market, tvl, apy, liquidityTokenBalanceValue, pendingDeposits, pendingWithdrawals } = vault
      const totalApy = apy.reduce((total, token) => total + token.amount, 0)
      return {
        vault,
        vaultName: formatTokenName(market.baseToken),
        balance: liquidityTokenBalanceValue,
        tvl,
        apy: totalApy,
        depositing: pendingDeposits.reduce((sum, d) => sum + fromBigNumber(d.value), 0),
        withdrawing: pendingWithdrawals.reduce((sum, d) => sum + fromBigNumber(d.balance), 0),
        onClick: () => {
          if (!depositModalVault) {
            navigate(
              getPagePath({ page: PageId.Vaults, network: market.lyra.network, marketAddressOrName: market.name })
            )
          }
        },
      }
    })
  }, [navigate, vaults, depositModalVault])
  const columns = useMemo<TableColumn<VaultsIndexTableData>[]>(
    () =>
      filterNulls([
        {
          accessor: 'vaultName',
          Header: 'Vault',
          Cell: (props: TableCellProps<VaultsIndexTableData>) => {
            const {
              vault: { market, globalRewardEpoch },
            } = props.row.original

            const isNew = globalRewardEpoch && globalRewardEpoch.id <= 1

            return (
              <Flex alignItems="center">
                <MarketImage market={market} />
                <Box ml={2}>
                  <Text variant="secondaryMedium">{props.cell.value} Vault</Text>
                  <Text variant="small" color="secondaryText">
                    {isNew ? (
                      <>
                        <Text variant="smallMedium" as="span" color="primaryText">
                          NEW
                        </Text>{' '}
                        ·{' '}
                      </>
                    ) : (
                      ''
                    )}
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
              vault: { market },
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
                  vault: { market, pendingDeposits },
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
                  vault: { market, pendingWithdrawals },
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
            const { vault } = cell.row.original
            const totalApy = vault.apy.reduce((total, token) => total + token.amount, 0)
            const minTotalApy = vault.minApy.reduce((total, token) => total + token.amount, 0)
            const { apyMultiplier } = vault
            return (
              <Box>
                <Flex alignItems="center">
                  <Text variant="secondary" color={totalApy > 0 && totalApy > minTotalApy ? 'primaryText' : 'text'}>
                    {formatAPY(totalApy > 0 ? vault.apy : vault.minApy, { showSymbol: false, showEmptyDash: true })}
                    {apyMultiplier > 1.01 ? ` (${formatNumber(apyMultiplier)}x)` : ''}
                  </Text>
                </Flex>
                {totalApy > 0 ? (
                  <Text variant="small" color="secondaryText">
                    {formatAPYRange(vault.minApy, vault.maxApy)}
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
            const { vault } = props.cell.row.original
            const { market } = vault
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
                    setDepositModalVault(vault)
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
                const { balance, vault } = props.cell.row.original

                const { market } = vault
                // Check for max boost with 1% buffer
                const maxTotalApy = vault.maxApy.reduce((total, apy) => total + apy.amount, 0)
                const totalApy = vault.apy.reduce((total, apy) => total + apy.amount, 0)
                const isMaxBoost = maxTotalApy > 0 && totalApy * 1.01 > maxTotalApy
                return (
                  <>
                    <Button
                      label={isMaxBoost ? 'Boosted' : 'Boost'}
                      rightIcon={isMaxBoost ? IconType.Check : null}
                      variant="primary"
                      isDisabled={
                        isMaxBoost ||
                        maxTotalApy === 0 ||
                        !!IGNORE_VAULTS_LIST.find(
                          ({ marketName, chain }) => marketName === market.name && chain === market.lyra.chain
                        ) ||
                        balance === 0
                      }
                      onClick={e => {
                        setBoostModalVault(vault)
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
      {boostModalVault ? (
        <VaultsBoostFormModal isOpen={!!boostModalVault} onClose={onModalClose} vault={boostModalVault} />
      ) : null}
      {depositModalVault ? (
        <VaultsDepositFormModal isOpen={!!depositModalVault} onClose={onModalClose} vault={depositModalVault} />
      ) : null}
    </>
  )
}

export default VaultsIndexTable

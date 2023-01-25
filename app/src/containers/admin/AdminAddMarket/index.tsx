import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import Input from '@lyra/ui/components/Input'
import Text from '@lyra/ui/components/Text'
import React, { useState } from 'react'

import NetworkDropdownButton from '@/app/components/common/NetworkDropdownButton/NetworkDropdownButton'
import { TransactionType } from '@/app/constants/screen'
import useNetwork from '@/app/hooks/account/useNetwork'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import useAdmin from '@/app/hooks/admin/useAdmin'
import useAdminTransaction from '@/app/hooks/admin/useAdminTransaction'

import TransactionButton from '../../common/TransactionButton'

type OptionMarketContracts = {
  liquidityPool: string
  liquidityToken: string
  greekCache: string
  optionMarket: string
  optionMarketPricer: string
  optionToken: string
  poolHedger: string
  shortCollateral: string
  gwavOracle: string
  quoteAsset: string
  baseAsset: string
}

const OPTION_MARKET_CONTRACTS: (keyof OptionMarketContracts)[] = [
  'liquidityPool',
  'liquidityToken',
  'greekCache',
  'optionMarket',
  'optionMarketPricer',
  'optionToken',
  'poolHedger',
  'shortCollateral',
  'gwavOracle',
  'quoteAsset',
  'baseAsset',
]

const AdminAddMarket = ({ globalOwner }: { globalOwner: string }) => {
  const [addresses, setAddresses] = useState<OptionMarketContracts>({
    liquidityPool: '',
    liquidityToken: '',
    greekCache: '',
    optionMarket: '',
    optionMarketPricer: '',
    optionToken: '',
    poolHedger: '',
    shortCollateral: '',
    gwavOracle: '',
    quoteAsset: '',
    baseAsset: '',
  })
  const [id, setId] = useState<number>(0)
  const network = useNetwork()
  const [addMarketNetwork, setAddMarketNetwork] = useState(network)
  const account = useWalletAccount()
  const admin = useAdmin(network)
  const execute = useAdminTransaction(network, globalOwner)
  return (
    <Card>
      <CardBody>
        <Text mb={6} variant="heading">
          Add Market
        </Text>
        <NetworkDropdownButton mb={6} selectedNetwork={addMarketNetwork} onSelectNetwork={setAddMarketNetwork} />
        <Input label="Market ID" mb={6} type="number" value={id} onChange={e => setId(parseInt(e.target.value))} />
        {OPTION_MARKET_CONTRACTS.map(contract => (
          <Input
            mb={6}
            key={contract}
            label={contract}
            value={addresses[contract]}
            onChange={e => {
              setAddresses(addresses => ({ ...addresses, [contract]: e.target.value }))
            }}
          />
        ))}
        <Flex>
          <TransactionButton
            mr={3}
            width={200}
            transactionType={TransactionType.Admin}
            network={network}
            label="Add To Registry"
            onClick={async () => {
              if (account && admin) {
                await execute(await admin.addMarketToRegistry(addresses))
              }
            }}
          />
          <TransactionButton
            width={200}
            transactionType={TransactionType.Admin}
            network={network}
            label="Add To Viewer"
            onClick={async () => {
              if (account && admin) {
                await execute(await admin.addMarketToViewer(addresses))
              }
            }}
          />
        </Flex>
      </CardBody>
    </Card>
  )
}

export default AdminAddMarket

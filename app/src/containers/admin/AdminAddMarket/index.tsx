import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import Input from '@lyra/ui/components/Input'
import Text from '@lyra/ui/components/Text'
import React, { useState } from 'react'

import NetworkDropdownButton from '@/app/components/common/NetworkDropdownButton/NetworkDropdownButton'
import useAdmin from '@/app/hooks/admin/useAdmin'
import useAdminGlobalOwner from '@/app/hooks/admin/useAdminGlobalOwner'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAdminTransaction from '@/app/hooks/transaction/useAdminTransaction'
import useNetwork from '@/app/hooks/wallet/useNetwork'
import useWalletAccount from '@/app/hooks/wallet/useWalletAccount'

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

const AdminAddMarket = withSuspense(() => {
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
  const globalOwner = useAdminGlobalOwner(network)
  const [addMarketNetwork, setAddMarketNetwork] = useState(network)
  const account = useWalletAccount()
  const admin = useAdmin(network)
  const execute = useAdminTransaction(network, globalOwner)
  return (
    <Card mt={8} mx={8}>
      <CardBody>
        <Text mb={4} variant="heading">
          Add Market
        </Text>
        <Flex>
          <NetworkDropdownButton mb={4} selectedNetwork={addMarketNetwork} onSelectNetwork={setAddMarketNetwork} />
        </Flex>
        <Input label="Market ID" mb={4} type="number" value={id} onChange={e => setId(parseInt(e.target.value))} />
        {OPTION_MARKET_CONTRACTS.map(contract => (
          <Input
            mb={4}
            key={contract}
            label={contract}
            value={addresses[contract]}
            onChange={e => {
              setAddresses(addresses => ({ ...addresses, [contract]: e.target.value }))
            }}
          />
        ))}
        <Flex pt={6}>
          <Button
            label="addMarketToRegistry"
            onClick={() => (account && admin ? execute(admin.addMarketToRegistry(account, addresses)) : null)}
          />
          <Button
            label="addMarketToViewer"
            onClick={() => (account && admin ? execute(admin.addMarketToViewer(account, addresses)) : null)}
          />
        </Flex>
      </CardBody>
    </Card>
  )
})

export default AdminAddMarket

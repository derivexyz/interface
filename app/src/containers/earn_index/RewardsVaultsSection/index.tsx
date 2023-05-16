import { CardElement } from '@lyra/ui/components/Card'
import Grid from '@lyra/ui/components/Grid'
import React from 'react'

import { Vault } from '@/app/constants/vault'

import RewardsVaultsMarketCard from './RewardsVaultsMarketCard'

type Props = {
  vaults: Vault[]
}

const RewardsVaultsSection = ({ vaults }: Props): CardElement => {
  return (
    <Grid sx={{ gridTemplateColumns: '1fr', gridRowGap: 4 }}>
      {vaults.map(vault => (
        <RewardsVaultsMarketCard key={vault.market.address} vault={vault} />
      ))}
    </Grid>
  )
}

export default RewardsVaultsSection

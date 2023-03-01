import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Spinner from '@lyra/ui/components/Spinner'
import React from 'react'

import withSuspense from '@/app/hooks/data/withSuspense'
import useLyraStakingAccount from '@/app/hooks/rewards/useLyraAccountStaking'

import UnstakeCardBodyRequestUnstakeSection from './UnstakeCardBodyRequestSection'
import UnstakeCardBodyUnstakeSection from './UnstakeCardBodyUnstakeSection'

type Props = {
  onClose: () => void
}

const UnstakeCardBody = withSuspense(
  ({ onClose }: Props) => {
    const lyraAccountStaking = useLyraStakingAccount()
    return (
      <>
        {lyraAccountStaking?.isInUnstakeWindow ? (
          <UnstakeCardBodyUnstakeSection onClose={onClose} />
        ) : (
          <UnstakeCardBodyRequestUnstakeSection />
        )}
      </>
    )
  },
  () => {
    return (
      <CardBody justifyContent="center" alignItems="center">
        <Center>
          <Spinner />
        </Center>
      </CardBody>
    )
  }
)

export default UnstakeCardBody

import Center from '@lyra/ui/components/Center'
import Spinner from '@lyra/ui/components/Spinner'
import React from 'react'

const PageLoading = (): JSX.Element => {
  return (
    <Center width="100%" height="100%">
      <Spinner />
    </Center>
  )
}

export default PageLoading

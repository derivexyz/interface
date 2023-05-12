import Center from '@lyra/ui/components/Center'
import Text from '@lyra/ui/components/Text'
import React from 'react'

import Layout from '../Layout'

type Props = {
  errorCode?: '404' | '500'
  error: string | React.ReactNode
}

const PageError = ({ errorCode = '404', error }: Props): JSX.Element => {
  return (
    <Layout>
      <Center alignSelf="stretch" height="100%" flexDirection="column">
        <Text variant="title">{errorCode}</Text>
        {typeof error === 'string' ? <Text color="secondaryText">{error}</Text> : error}
      </Center>
    </Layout>
  )
}

export default PageError

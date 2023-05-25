import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import React from 'react'

type Props = {
  children?: React.ReactNode
  rightColumn?: React.ReactNode
}

export default function PageGrid({ children, rightColumn }: Props): JSX.Element {
  const isMobile = useIsMobile()
  return (
    <Flex flexGrow={1} width="100%">
      <Flex pb={[0, 12]} flexGrow={1} pr={rightColumn && !isMobile ? 6 : 0} flexDirection="column">
        <Grid
          flexGrow={1}
          sx={{
            gridTemplateColumns: '1fr',
            gap: [3, 6],
            alignContent: 'start',
            justifyContent: 'start',
          }}
        >
          {children}
        </Grid>
      </Flex>
      {rightColumn && !isMobile ? rightColumn : null}
    </Flex>
  )
}

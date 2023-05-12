import Box from '@lyra/ui/components/Box'
import Card, { CardElement } from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import { IconType } from '@lyra/ui/components/Icon'
import List from '@lyra/ui/components/List'
import ListItem from '@lyra/ui/components/List/ListItem'
import Text from '@lyra/ui/components/Text'
import Token from '@lyra/ui/components/Token'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'

export default function ListDemoCard({ ...marginProps }: MarginProps): CardElement {
  return (
    <Card {...marginProps}>
      <CardSection noPadding isHorizontal flexGrow={1}>
        <List>
          <ListItem icon={IconType.Check} label="First item" />
          <ListItem icon={IconType.ExternalLink} href="https://www.google.com" target="_blank" label="Link item" />
          <ListItem
            icon={IconType.Ethereum}
            href="https://www.google.com"
            target="_blank"
            label="Ethereum"
            rightContent={
              <Box>
                <Text>$2562.21</Text>
                <Text variant="small" color="primaryText">
                  +2.43%
                </Text>
              </Box>
            }
          />
          <ListItem
            href="https://www.google.com"
            target="_blank"
            label="Title"
            sublabel="Secondary"
            rightContent={<Token label="Token" variant="primary" />}
          />
          <ListItem isDisabled label="Disabled item" />
        </List>
      </CardSection>
    </Card>
  )
}

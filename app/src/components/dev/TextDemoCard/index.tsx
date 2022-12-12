import Card, { CardElement } from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Flex from '@lyra/ui/components/Flex'
import Link from '@lyra/ui/components/Link'
import Text from '@lyra/ui/components/Text'
import Token from '@lyra/ui/components/Token'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'

export default function TextDemoCard({ ...marginProps }: MarginProps): CardElement {
  return (
    <Card {...marginProps}>
      <CardSection>
        <Text variant="largeTitle">Large Title</Text>
        <Text mt={4} variant="title">
          Dark Title
        </Text>
        <Text variant="title" color="secondaryText">
          Light Title
        </Text>
      </CardSection>
      <CardSection>
        <Text variant="heading">Dark Heading</Text>
        <Text variant="heading" color="secondaryText">
          Light Heading
        </Text>
      </CardSection>
      <CardSection>
        <Text mt={4} variant="bodyMedium">
          Some medium body text
        </Text>
        <Text variant="bodyMedium" color="secondaryText">
          Some light and medium body text
        </Text>
        <Text>Some body text</Text>
        <Text variant="secondary">Secondary text</Text>
      </CardSection>
      <CardSection>
        <Text variant="heading">Tokens</Text>
        <Flex my={4}>
          <Token label="Default" mr={2} />
          <Token label="Primary" mr={2} variant="primary" />
          <Token label="Error" mr={2} variant="error" />
          <Token label="Warning" variant="warning" />
        </Flex>
      </CardSection>
      <CardSection>
        <Text variant="heading">Text Link</Text>
        <Link href="/" showRightIcon>
          Internal Link
        </Link>
        <Link href="https://www.lyra.finance" showRightIcon>
          External link
        </Link>
      </CardSection>
    </Card>
  )
}

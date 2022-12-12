import Box from '@lyra/ui/components/Box'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Icon, { IconType } from '@lyra/ui/components/Icon'
import Tooltip from '@lyra/ui/components/Tooltip'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'
import { Flex } from 'rebass'

export default function CardDemo({ ...marginProps }: MarginProps) {
  return (
    <Box {...marginProps} width="100%">
      <Card>
        <CardBody>
          <Flex>
            Card body{' '}
            <Tooltip
              ml={1}
              title="Tooltip"
              tooltip="Here is a tooltip in a card"
              href="https://www.lyra.finance"
              target="_blank"
            >
              <Icon icon={IconType.Info} size={18} />
            </Tooltip>
          </Flex>
        </CardBody>
      </Card>
      <Card my={2}>
        <CardSection>Vertical card sections</CardSection>
        <CardSeparator />
        <CardSection>Vertical card sections</CardSection>
      </Card>
      <Card flexDirection="row">
        <CardSection flexGrow={1} isHorizontal>
          Horizontal card sections
        </CardSection>
        <CardSeparator isVertical />
        <CardSection flexGrow={1} isHorizontal>
          Horizontal card sections
        </CardSection>
      </Card>
      <Card my={2}>
        <Flex flexDirection="row">
          <CardSection flexGrow={1}>Horizontal and vertical card sections </CardSection>
          <CardSeparator isVertical />
          <CardSection flexGrow={1}>Horizontal and vertical card sections</CardSection>
        </Flex>
        <CardSeparator />
        <CardSection>Horizontal and vertical card sections</CardSection>
        <CardSeparator />
        <Flex flexDirection="row">
          <CardSection flexGrow={1}>Horizontal and vertical card sections </CardSection>
          <CardSeparator isVertical />
          <CardSection flexGrow={1}>Horizontal and vertical card sections</CardSection>
        </Flex>
      </Card>
    </Box>
  )
}

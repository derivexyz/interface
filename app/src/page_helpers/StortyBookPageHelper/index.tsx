import IconButton from '@lyra/ui/components/Button/IconButton'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import useIsDarkMode from '@lyra/ui/hooks/useIsDarkMode'
import React from 'react'

import CardDemo from '@/app/components/dev/CardDemo'
import ChartDemoCard from '@/app/components/dev/ChartDemoCard'
import SocketDemoCard from '@/app/components/dev/SocketDemoCard'
import TooltipDemoCard from '@/app/components/dev/TooltipDemoCard'

import AlertDemoCard from '../../components/dev/AlertDemoCard'
import ButtonDemoCard from '../../components/dev/ButtonDemoCard'
import InputDemoCard from '../../components/dev/InputDemoCard'
import ListDemoCard from '../../components/dev/ListDemoCard'
import LoadingDemoCard from '../../components/dev/LoadingDemoCard'
import ModalDemoCard from '../../components/dev/ModalDemoCard'
import TableDemoCard from '../../components/dev/TableDemoCard'
import TextDemoCard from '../../components/dev/TextDemoCard'
import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

export default function StortyBookPageHelper(): JSX.Element {
  const [isDarkMode, setIsDarkMode] = useIsDarkMode()
  return (
    <Page header="Storybook" mobileCollapsedHeader="Components">
      <PageGrid>
        <Card>
          <CardBody>
            <Flex alignItems="center">
              <Text>Dark Mode</Text>
              <IconButton
                ml={2}
                icon={isDarkMode ? IconType.ToggleLeft : IconType.ToggleRight}
                onClick={() => setIsDarkMode(!isDarkMode)}
              />
            </Flex>
          </CardBody>
        </Card>
        <Text ml={6} variant="title">
          Cards
        </Text>
        <CardDemo />
        <Text ml={6} variant="title">
          Buttons
        </Text>
        <ButtonDemoCard />
        <Text ml={6} variant="title">
          Inputs
        </Text>
        <InputDemoCard />
        <Text ml={6} variant="title">
          Alerts
        </Text>
        <AlertDemoCard />
        <Text ml={6} variant="title">
          Modals
        </Text>
        <ModalDemoCard />
        <Text ml={6} variant="title">
          Lists
        </Text>
        <ListDemoCard />
        <Text ml={6} variant="title">
          Tables
        </Text>
        <TableDemoCard />
        <Text ml={6} variant="title">
          Charts
        </Text>
        <ChartDemoCard />
        <Text ml={6} variant="title">
          Text
        </Text>
        <TextDemoCard />
        <Text ml={6} variant="title">
          Tooltips
        </Text>
        <TooltipDemoCard />
        <Text ml={6} variant="title">
          Loading
        </Text>
        <LoadingDemoCard />
        <Text ml={6} variant="title">
          Socket
        </Text>
        <SocketDemoCard />
      </PageGrid>
    </Page>
  )
}

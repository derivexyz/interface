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
import SentryDemoCard from '@/app/components/dev/SentryDemoCard'
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

export default function StoryBookPageHelper(): JSX.Element {
  const [isDarkMode, setIsDarkMode] = useIsDarkMode()
  return (
    <Page title="Storybook" subtitle="UI components for design system">
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
        <Text variant="heading">Cards</Text>
        <CardDemo />
        <Text variant="heading">Buttons</Text>
        <ButtonDemoCard />
        <Text variant="heading">Inputs</Text>
        <InputDemoCard />
        <Text variant="heading">Alerts</Text>
        <AlertDemoCard />
        <Text variant="heading">Modals</Text>
        <ModalDemoCard />
        <Text variant="heading">Lists</Text>
        <ListDemoCard />
        <Text variant="heading">Tables</Text>
        <TableDemoCard />
        <Text variant="heading">Charts</Text>
        <ChartDemoCard />
        <Text variant="heading">Text</Text>
        <TextDemoCard />
        <Text variant="heading">Tooltips</Text>
        <TooltipDemoCard />
        <Text variant="heading">Loading</Text>
        <LoadingDemoCard />
        <Text variant="heading">Socket</Text>
        <SocketDemoCard />
        <Text variant="heading">Sentry</Text>
        <SentryDemoCard />
      </PageGrid>
    </Page>
  )
}

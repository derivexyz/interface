import Button from '@lyra/ui/components/Button'
import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import DropdownIconButton from '@lyra/ui/components/Button/DropdownIconButton'
import IconButton from '@lyra/ui/components/Button/IconButton'
import ToggleButton from '@lyra/ui/components/Button/ToggleButton'
import ToggleButtonItem from '@lyra/ui/components/Button/ToggleButtonItem'
import Card, { CardElement } from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import Toggle from '@lyra/ui/components/Toggle'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import React, { useCallback, useState } from 'react'

export default function ButtonDemoCard({ ...marginProps }: MarginProps): CardElement {
  const isMobile = useIsMobile()
  const [selectedTab, setSelectedTab] = useState(1)
  const [isOpen, setIsOpen] = useState(false)
  const [isOpen2, setIsOpen2] = useState(false)
  const [isOpen3, setIsOpen3] = useState(false)
  const onClose = useCallback(() => setIsOpen(false), [])
  const onClose2 = useCallback(() => setIsOpen2(false), [])
  const onClose3 = useCallback(() => setIsOpen3(false), [])
  const [selectedItemId, setSelectedItemId] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  return (
    <Card {...marginProps}>
      <CardSection>
        <Text variant="heading">Default</Text>
        <Flex mb={2} alignItems="center" flexDirection={isMobile ? 'column' : 'row'}>
          <Button mr={2} label="Large" size={'large'} />
          <Button
            href="https://www.google.com"
            target="_blank"
            rightIcon={IconType.ExternalLink}
            mx={2}
            label="Medium"
            size={'medium'}
          />
          <Button mr={2} label="Small" size={'small'} />
          <Button mr={2} isOutline label="Outlined" size={'medium'} />
          <Button mr={2} isTransparent label="Transparent" size={'medium'} />
          <Button mr={2} label="Loading" size={'medium'} isLoading />
          <Button mr={2} isDisabled label="Disabled" size={'medium'} />
          <IconButton mr={2} icon={IconType.Expand} size={'medium'} />
          <IconButton mr={2} isOutline icon={IconType.Expand} size={'medium'} />
        </Flex>
      </CardSection>
      <CardSection>
        <Text variant="heading" color="secondaryText">
          Light
        </Text>
        <Flex mb={2} alignItems="center" flexDirection={isMobile ? 'column' : 'row'}>
          <Button mr={2} variant={'light'} label="Large" size={'large'} />
          <Button
            variant={'light'}
            href="https://www.google.com"
            target="_blank"
            rightIcon={IconType.ExternalLink}
            mx={2}
            label="Medium"
            size={'medium'}
          />
          <Button variant={'light'} mr={2} label="Small" size={'small'} />
          <Button variant={'light'} mr={2} isOutline label="Outlined" size={'medium'} />
          <Button variant={'light'} mr={2} isTransparent label="Transparent" size={'medium'} />
          <Button variant={'light'} mr={2} isDisabled label="Disabled" size={'medium'} />
          <IconButton variant={'light'} mr={2} icon={IconType.Expand} size={'medium'} />
          <IconButton variant={'light'} mr={2} isOutline icon={IconType.Expand} size={'medium'} />
        </Flex>
      </CardSection>
      <CardSection>
        <Text variant="heading" color="primaryText">
          Primary
        </Text>
        <Flex mb={2} alignItems="center" flexDirection={isMobile ? 'column' : 'row'}>
          <Button mr={2} variant={'primary'} label="Large" size={'large'} />
          <Button
            variant={'primary'}
            href="https://www.google.com"
            target="_blank"
            rightIcon={IconType.ExternalLink}
            mx={2}
            label="Medium"
            size={'medium'}
          />
          <Button variant={'primary'} mr={2} label="Small" size={'small'} />
          <Button variant={'primary'} mr={2} isOutline label="Outlined" size={'medium'} />
          <Button variant={'primary'} mr={2} isTransparent label="Transparent" size={'medium'} />
          <Button variant={'primary'} mr={2} isDisabled label="Disabled" size={'medium'} />
          <Button variant={'primary'} mr={2} label="Loading..." size={'large'} isLoading />
          <IconButton variant={'primary'} mr={2} icon={IconType.Expand} size={'medium'} />
          <IconButton variant={'primary'} mr={2} isOutline icon={IconType.Expand} size={'medium'} />
        </Flex>
      </CardSection>
      <CardSection>
        <Text variant="heading" color="errorText">
          Error
        </Text>
        <Flex mb={2} alignItems="center" flexDirection={isMobile ? 'column' : 'row'}>
          <Button mr={2} variant={'error'} label="Large" size={'large'} />
          <Button
            variant={'error'}
            href="https://www.google.com"
            target="_blank"
            rightIcon={IconType.ExternalLink}
            mx={2}
            label="Medium"
            size={'medium'}
          />
          <Button variant={'error'} mr={2} label="Small" size={'small'} />
          <Button variant={'error'} mr={2} isOutline label="Outlined" size={'medium'} />
          <Button variant={'error'} mr={2} isTransparent label="Transparent" size={'medium'} />
          <Button variant={'error'} mr={2} isDisabled label="Disabled" size={'medium'} />
          <IconButton variant={'error'} mr={2} icon={IconType.Expand} size={'medium'} />
          <IconButton variant={'error'} mr={2} isOutline icon={IconType.Expand} size={'medium'} />
        </Flex>
      </CardSection>
      <CardSection>
        <Text variant="heading" color="warningText">
          Warning
        </Text>
        <Flex mb={2} alignItems="center" flexDirection={isMobile ? 'column' : 'row'}>
          <Button mr={2} variant={'warning'} label="Large" size={'large'} />
          <Button
            variant={'warning'}
            href="https://www.google.com"
            target="_blank"
            rightIcon={IconType.ExternalLink}
            mx={2}
            label="Medium"
            size={'medium'}
          />
          <Button variant={'warning'} mr={2} label="Small" size={'small'} />
          <Button variant={'warning'} mr={2} isOutline label="Outlined" size={'medium'} />
          <Button variant={'warning'} mr={2} isTransparent label="Transparent" size={'medium'} />
          <Button variant={'warning'} mr={2} isDisabled label="Disabled" size={'medium'} />
          <Button variant={'warning'} mr={2} label="Loading..." size={'large'} isLoading />
          <IconButton variant={'warning'} mr={2} icon={IconType.Expand} size={'medium'} />
          <IconButton variant={'warning'} mr={2} isOutline icon={IconType.Expand} size={'medium'} />
        </Flex>
      </CardSection>
      <CardSection>
        <Text variant="heading">Static</Text>
        <Flex alignItems="center">
          <Button mr={2} variant="static" label="Large" size={'large'} />
          <Button mr={2} variant="static" label="Transparent" isTransparent />
        </Flex>
      </CardSection>
      <CardSection>
        <Text variant="heading">Toggle</Text>
        <Toggle isChecked={isChecked} onChange={newIsChecked => setIsChecked(newIsChecked.target.checked)} />
      </CardSection>
      <CardSection>
        <Text variant="heading">Toggle Button</Text>
        <ToggleButton maxWidth={200}>
          {[
            { id: 1, label: '1' },
            { id: 2, label: '2' },
            { id: 3, label: '3' },
          ].map(tab => (
            <ToggleButtonItem
              key={tab.id}
              id={tab.id}
              label={tab.label}
              isSelected={selectedTab === tab.id}
              onSelect={setSelectedTab}
            />
          ))}
        </ToggleButton>
      </CardSection>
      <CardSection>
        <Text variant="heading">Dropdowns</Text>
        <Flex my={4}>
          <DropdownButton
            onClick={() => setIsOpen(true)}
            mr={2}
            label={`Item ${selectedItemId}`}
            isOpen={isOpen}
            onClose={onClose}
          >
            <DropdownButtonListItem
              label="Item 1"
              onClick={() => {
                setSelectedItemId('1')
                onClose()
              }}
              isSelected={selectedItemId === '1'}
            />
            <DropdownButtonListItem
              label="Item 2"
              onClick={() => {
                setSelectedItemId('2')
                onClose()
              }}
              isSelected={selectedItemId === '2'}
            />
            <DropdownButtonListItem
              label="Item 3"
              onClick={() => {
                setSelectedItemId('3')
                onClose()
              }}
              isSelected={selectedItemId === '3'}
            />
            <DropdownButtonListItem
              label="Item 4"
              onClick={() => {
                setSelectedItemId('4')
                onClose()
              }}
              isSelected={selectedItemId === '4'}
            />
          </DropdownButton>
          <DropdownIconButton
            isOpen={isOpen2}
            onClick={() => setIsOpen2(true)}
            mr={2}
            icon={IconType.MoreHorizontal}
            onClose={onClose2}
          >
            <DropdownButtonListItem label="Item 1" onClick={onClose2} />
            <DropdownButtonListItem label="Item 2" onClick={onClose2} />
          </DropdownIconButton>
          <DropdownIconButton
            isOpen={isOpen3}
            onClick={() => setIsOpen3(true)}
            icon={IconType.MoreHorizontal}
            variant="primary"
            onClose={onClose3}
          >
            <DropdownButtonListItem label="Item 1" onClick={onClose3} />
            <DropdownButtonListItem label="Item 2" onClick={onClose3} />
          </DropdownIconButton>
        </Flex>
      </CardSection>
    </Card>
  )
}

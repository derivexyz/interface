import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import Flex from '@lyra/ui/components/Flex'
import Icon, { IconType } from '@lyra/ui/components/Icon'
import List from '@lyra/ui/components/List'
import Modal from '@lyra/ui/components/Modal'
import React, { useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { MOBILE_FOOTER_HEIGHT } from '@/app/constants/layout'
import TABS from '@/app/constants/tabs'
import AccountButton from '@/app/containers/common/AccountButton'
import { getNavPageFromPath } from '@/app/utils/getNavPageFromPath'
import logEvent from '@/app/utils/logEvent'

import LayoutMoreDropdownListItems from './LayoutMoreDropdownListItems'
import LayoutPrivacyModal from './LayoutPrivacyModal'

export default function LayoutMobileBottomNav(): JSX.Element {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)
  const onClose = useCallback(() => setIsOpen(false), [])

  const { pathname } = useLocation()

  const rootPage = getNavPageFromPath(pathname)

  return (
    <>
      <Flex
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: MOBILE_FOOTER_HEIGHT,
          backdropFilter: 'blur(50px)',
          bg: `cardElevatedBg`,
          zIndex: 'bottomNav',
          borderTop: '1px solid',
          borderColor: 'background',
        }}
      >
        <Flex>
          <Flex
            onClick={() => {
              setIsOpen(true)
            }}
            height="100%"
            width={MOBILE_FOOTER_HEIGHT}
            alignItems="center"
            justifyContent="center"
            sx={{
              cursor: 'pointer',
              ':hover': {
                bg: 'hover',
              },
            }}
          >
            <Icon size={32} color="secondaryText" icon={IconType.Menu} />
          </Flex>
        </Flex>
        <Flex flexGrow={1} p={3} alignItems="center" justifyContent="flex-end">
          <AccountButton />
        </Flex>
      </Flex>
      <Modal title="Menu" isOpen={isOpen} onClose={onClose}>
        <List>
          <>
            {TABS.map(tab => (
              <DropdownButtonListItem
                key={tab.path}
                isSelected={tab.rootPageId === rootPage}
                onClick={() => {
                  logEvent(tab.logEvent)
                  navigate(tab.path)
                  onClose()
                }}
                label={tab.name}
              />
            ))}
          </>
          <DropdownButtonListItem
            onClick={() => {
              setIsMoreOpen(true)
              onClose()
            }}
            label="More"
            rightContent={<Icon icon={IconType.ChevronRight}></Icon>}
          />
        </List>
      </Modal>
      <Modal
        title="More"
        isOpen={isMoreOpen}
        onClose={() => {
          setIsMoreOpen(false)
        }}
      >
        <List>
          <LayoutMoreDropdownListItems
            onClose={() => {
              setIsMoreOpen(false)
            }}
            onClickPrivacy={() => {
              setIsMoreOpen(false)
              setIsPrivacyOpen(true)
            }}
          />
        </List>
      </Modal>
      <LayoutPrivacyModal isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
    </>
  )
}

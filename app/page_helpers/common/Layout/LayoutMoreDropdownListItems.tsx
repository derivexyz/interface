import Box from '@lyra/ui/components/Box'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import useIsDarkMode from '@lyra/ui/hooks/useIsDarkMode'
import React from 'react'

import { DISCORD_URL, DOCS_URL, GITHUB_URL, STATS_URL, V1_DAPP_URL } from '@/app/constants/links'
import { LogEvent } from '@/app/constants/logEvents'
import { OptimismChainId } from '@/app/constants/networks'
import isOptimismMainnet from '@/app/utils/isOptimismMainnet'
import logEvent from '@/app/utils/logEvent'
import setOptimismChainId from '@/app/utils/setOptimismChainId'

type Props = {
  onClose: () => void
  onClickPrivacy: () => void
}

const LayoutMoreDropdownListItems = ({ onClose, onClickPrivacy }: Props): JSX.Element => {
  const [isDarkMode, setIsDarkMode] = useIsDarkMode()
  return (
    <>
      <DropdownButtonListItem
        target="_blank"
        href={DOCS_URL}
        label="Docs"
        onClick={() => {
          logEvent(LogEvent.NavDocsClick)
          onClose()
        }}
        icon={IconType.Book}
      />
      <DropdownButtonListItem
        target="_blank"
        href={GITHUB_URL}
        label="GitHub"
        onClick={() => {
          logEvent(LogEvent.NavGithubClick)
          onClose()
        }}
        icon={IconType.GitHub}
      />
      <DropdownButtonListItem
        target="_blank"
        href={DISCORD_URL}
        label="Discord"
        onClick={() => {
          logEvent(LogEvent.NavDiscordClick)
          onClose()
        }}
        icon={IconType.Discord}
      />
      <DropdownButtonListItem
        target="_blank"
        href={STATS_URL}
        label="Stats"
        onClick={() => {
          logEvent(LogEvent.NavStatsClick)
          onClose()
        }}
        icon={IconType.BarChart}
      />
      <DropdownButtonListItem
        onClick={() => {
          onClickPrivacy()
          onClose()
        }}
        label="Privacy"
        icon={IconType.FileText}
      />
      <DropdownButtonListItem
        href={V1_DAPP_URL}
        onClick={() => {
          logEvent(LogEvent.NavV1Click)
          onClose()
        }}
        target="_blank"
        label="V1"
        icon={IconType.ExternalLink}
      />
      <DropdownButtonListItem
        label={isOptimismMainnet() ? 'Testnet' : 'Mainnet'}
        onClick={() => {
          const toChainId = isOptimismMainnet() ? OptimismChainId.OptimismKovan : OptimismChainId.OptimismMainnet
          logEvent(LogEvent.NavNetworkToggle, {
            toChainId,
          })
          setOptimismChainId(toChainId)
          onClose()
        }}
        icon={isOptimismMainnet() ? IconType.ToggleLeft : IconType.ToggleRight}
      />
      <DropdownButtonListItem
        onClick={() => {
          logEvent(LogEvent.NavLightModeToggle, {
            type: !isDarkMode ? 'light' : 'dark',
          })
          setIsDarkMode(!isDarkMode)
          onClose()
        }}
        label={isDarkMode ? 'Light Mode' : 'Dark Mode'}
        icon={isDarkMode ? IconType.Sun : IconType.Moon}
      />
      {process.env.NEXT_PUBLIC_RELEASE_TAG ? (
        <Box px={3} py={2}>
          <Text variant="small" color="secondaryText">
            {process.env.NEXT_PUBLIC_RELEASE_TAG.substring(0, 16)}
          </Text>
        </Box>
      ) : null}
    </>
  )
}

export default LayoutMoreDropdownListItems

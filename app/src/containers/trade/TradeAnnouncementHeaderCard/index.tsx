import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import IconButton from '@lyra/ui/components/Button/IconButton'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Image from '@lyra/ui/components/Image'
import Text from '@lyra/ui/components/Text'
import React, { useCallback, useMemo, useState } from 'react'

import useAnnouncements from '@/app/hooks/local_storage/useAnnouncements'

type Props = {
  blockTimestamp: number
}

export default function TradeAnnouncementHeaderCard({ blockTimestamp }: Props) {
  const { announcements, dismissAnnouncement } = useAnnouncements(blockTimestamp)

  const [displayedId, setDisplayedId] = useState<string | null>(announcements[0]?.id ?? null)
  const displayedIdx = useMemo(() => announcements.findIndex(a => a.id === displayedId), [announcements, displayedId])
  const displayedAnnouncement = displayedIdx != -1 ? announcements[displayedIdx] : null

  const isNextAnnouncement = displayedIdx < announcements.length - 1
  const isPrevAnnouncement = displayedIdx > 0

  const handleNextAnnouncement = useCallback(() => {
    if (displayedId && isNextAnnouncement) {
      console.log(displayedId, announcements[displayedIdx + 1].id, isNextAnnouncement)
      setDisplayedId(announcements[displayedIdx + 1].id)
    }
  }, [announcements, displayedId, displayedIdx, isNextAnnouncement])

  const handlePrevAnnouncement = useCallback(() => {
    if (displayedId && isPrevAnnouncement) {
      setDisplayedId(announcements[displayedIdx - 1].id)
    }
  }, [announcements, displayedId, displayedIdx, isPrevAnnouncement])

  const handleDismissAnnouncement = useCallback(() => {
    const dismissId = displayedId
    if (dismissId) {
      if (isNextAnnouncement) {
        // Go to next announcement
        handleNextAnnouncement()
      } else if (isPrevAnnouncement) {
        // Go to prev announcement
        handlePrevAnnouncement()
      } else {
        // No announcements left
        setDisplayedId(null)
      }

      // Dismiss announcement
      dismissAnnouncement(dismissId)
    }
  }, [
    dismissAnnouncement,
    displayedId,
    handleNextAnnouncement,
    handlePrevAnnouncement,
    isNextAnnouncement,
    isPrevAnnouncement,
  ])

  if (!displayedId) {
    return null
  }

  return displayedAnnouncement ? (
    <Card variant="outline" height={['100%', 230]} width="100%">
      <CardBody height="100%">
        <Flex mb={4} justifyContent="flex-start">
          {displayedAnnouncement.graphic ? (
            <Box
              minWidth={[84, 76]}
              minHeight={[84, 76]}
              width={[84, 76]}
              height={[84, 76]}
              mr={4}
              sx={{ borderRadius: '10px', overflow: 'hidden' }}
            >
              <Image src={displayedAnnouncement.graphic} width="100%" height="100%" />
            </Box>
          ) : null}
          <Box>
            <Flex mb={1}>
              <Text variant="cardHeading">{displayedAnnouncement.title}</Text>
              <Box ml="auto">
                <IconButton onClick={handleDismissAnnouncement} icon={IconType.X} />
              </Box>
            </Flex>
            <Text variant="small" color="secondaryText">
              {displayedAnnouncement.description}
            </Text>
          </Box>
        </Flex>
        <Flex mt="auto">
          <Button
            label={displayedAnnouncement.cta.label}
            href={displayedAnnouncement.cta.href}
            target={displayedAnnouncement.cta.target}
            rightIcon={displayedAnnouncement.cta.target === '_blank' ? IconType.ArrowUpRight : IconType.ArrowRight}
          />
          <Flex ml="auto">
            <IconButton
              icon={IconType.ChevronLeft}
              ml={2}
              isDisabled={!isPrevAnnouncement}
              onClick={handlePrevAnnouncement}
            />
            <IconButton
              icon={IconType.ChevronRight}
              ml={2}
              isDisabled={!isNextAnnouncement}
              onClick={handleNextAnnouncement}
            />
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  ) : null
}

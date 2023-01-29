import IconButton from '@lyra/ui/components/Button/IconButton'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import Image from '@lyra/ui/components/Image'
import Link from '@lyra/ui/components/Link'
import Text from '@lyra/ui/components/Text'
import Countdown from '@lyra/ui/components/Text/CountdownText'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import React, { useCallback } from 'react'

import { Announcement } from '@/app/constants/announcements'
import { LOCAL_STORAGE_ANNOUNCEMENTS_KEY } from '@/app/constants/localStorage'
import { LogEvent } from '@/app/constants/logEvents'
import useLocalStorage from '@/app/hooks/local_storage/useLocalStorage'
import getAssetSrc from '@/app/utils/getAssetSrc'
import logEvent from '@/app/utils/logEvent'

type Props = {
  announcement: Announcement
  numAnnouncements: number
  announcementIdx: number
  onNext: () => void
  onPrev: () => void
}

const PortfolioAnnouncementCardPagination = ({
  announcementIdx,
  numAnnouncements,
  onPrev,
  onNext,
}: Omit<Props, 'announcement'>) => {
  return (
    <Flex ml="auto" alignItems="center" justifyContent="flex-end" minWidth={140}>
      <IconButton variant="light" isTransparent icon={IconType.ChevronLeft} onClick={onPrev} />
      <Text variant="secondary" color="secondaryText" mx={[0, 1]}>
        {announcementIdx + 1} of {numAnnouncements}
      </Text>
      <IconButton variant="light" isTransparent icon={IconType.ChevronRight} onClick={onNext} />
    </Flex>
  )
}

const IMAGE_SIZE = [64, 72]

export default function PortfolioAnnouncementCard({
  announcement,
  announcementIdx,
  numAnnouncements,
  onPrev,
  onNext,
}: Props) {
  const [announcementsLocalStorageStr, setLocalStorage] = useLocalStorage(LOCAL_STORAGE_ANNOUNCEMENTS_KEY)
  const handleClickClose = useCallback(() => {
    const announcementState = JSON.parse(announcementsLocalStorageStr)
    setLocalStorage(
      JSON.stringify({
        ...announcementState,
        [announcement.id]: false,
      })
    )
  }, [announcement, announcementsLocalStorageStr, setLocalStorage])
  const isMobile = useIsMobile()
  return (
    <Card>
      <CardBody flexDirection="row" alignItems="center">
        {announcement.graphic ? (
          <Image
            mr={4}
            src={getAssetSrc(announcement.graphic)}
            height={announcement.graphicSize ?? IMAGE_SIZE}
            minHeight={announcement.graphicSize ?? IMAGE_SIZE}
          />
        ) : null}
        <Flex flexDirection="column" flexGrow={1}>
          <Flex alignItems="center">
            <Text mr={2} variant="heading" color="text">
              {announcement.header}
              {announcement.showCountdown ? (
                <>
                  &nbsp;&nbsp;·&nbsp;&nbsp;
                  <Countdown as="span" variant="heading" timestamp={announcement.expiryTimestamp} showSeconds />
                </>
              ) : null}
            </Text>
            <IconButton ml="auto" variant="light" icon={IconType.X} onClick={handleClickClose} />
          </Flex>
          <Text variant="secondary" mt={2} color="secondaryText">
            {announcement.title}
          </Text>
          <Flex alignItems="center" mt={[2, 1]}>
            {announcement.cta.length > 0 ? (
              <Grid sx={{ gridTemplateColumns: ['1fr 1fr', '1fr 1fr 1fr 1fr'] }}>
                {announcement.cta.map(cta => (
                  <Link
                    key={cta.href}
                    textVariant="secondary"
                    showRightIcon
                    href={cta.href}
                    target={cta.target}
                    onClick={() => logEvent(LogEvent.NavPortfolioAnnouncementCTAClick, { id: announcement.id })}
                  >
                    {cta.label}
                  </Link>
                ))}
              </Grid>
            ) : null}
            {!isMobile ? (
              <PortfolioAnnouncementCardPagination
                numAnnouncements={numAnnouncements}
                announcementIdx={announcementIdx}
                onNext={onNext}
                onPrev={onPrev}
              />
            ) : null}
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  )
}

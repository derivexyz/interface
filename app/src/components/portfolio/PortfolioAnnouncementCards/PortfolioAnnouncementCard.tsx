import Button from '@lyra/ui/components/Button'
import IconButton from '@lyra/ui/components/Button/IconButton'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import Image from '@lyra/ui/components/Image'
import Text from '@lyra/ui/components/Text'
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
    <Flex alignItems="center" justifyContent="flex-end" minWidth={140}>
      <IconButton variant="light" isTransparent icon={IconType.ChevronLeft} onClick={onPrev} />
      <Text variant="secondary" color="secondaryText" mx={[0, 1]}>
        {announcementIdx + 1} of {numAnnouncements}
      </Text>
      <IconButton variant="light" isTransparent icon={IconType.ChevronRight} onClick={onNext} />
    </Flex>
  )
}

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
    <Card height="100%">
      <CardBody flexDirection="row" alignItems="center" height="100%">
        {announcement.graphic ? (
          <Image mr={6} src={getAssetSrc(announcement.graphic)} width={64} minWidth={64} height={64} minHeight={64} />
        ) : null}
        <Flex flexDirection="column" flexGrow={1}>
          <Text variant="heading" color="text" mt={-1}>
            {announcement.header}
          </Text>
          <Text variant="secondary" mt={2} color="secondaryText">
            {announcement.title}
          </Text>
          {announcement.cta.length > 0 ? (
            <Flex>
              <Grid sx={{ gridTemplateColumns: ['1fr 1fr', '1fr 1fr 1fr 1fr'], gap: 2 }} mt={3}>
                {announcement.cta.map(cta => (
                  <Button
                    key={cta.href}
                    label={cta.label}
                    variant={cta.variant}
                    textVariant="secondary"
                    rightIcon={cta.target === '_blank' ? IconType.ArrowUpRight : IconType.ArrowRight}
                    href={cta.href}
                    target={cta.target}
                    px={1}
                    onClick={() => logEvent(LogEvent.NavPortfolioAnnouncementCTAClick, { id: announcement.id })}
                  />
                ))}
              </Grid>
            </Flex>
          ) : null}
        </Flex>
        <Flex flexDirection="column" justifyContent="space-between" alignItems="flex-end" height="100%" ml="auto">
          <IconButton variant="light" icon={IconType.X} onClick={handleClickClose} />
          {!isMobile ? (
            <PortfolioAnnouncementCardPagination
              numAnnouncements={numAnnouncements}
              announcementIdx={announcementIdx}
              onNext={onNext}
              onPrev={onPrev}
            />
          ) : null}
        </Flex>
      </CardBody>
    </Card>
  )
}

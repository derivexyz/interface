import React, { useMemo, useState } from 'react'

import announcements from '@/app/constants/announcements'
import { LOCAL_STORAGE_ANNOUNCEMENTS_KEY } from '@/app/constants/localStorage'
import useLocalStorage from '@/app/hooks/local_storage/useLocalStorage'

import PortfolioAnnouncementCard from './PortfolioAnnouncementCard'

export default function PortfolioAnnouncementCards() {
  const [_displayedIdx, setDisplayedIdx] = useState(0)
  const [announcementsLocalStorageStr] = useLocalStorage(LOCAL_STORAGE_ANNOUNCEMENTS_KEY)
  const displayedAnnouncements = useMemo(() => {
    const announcementState: Record<string, boolean> = JSON.parse(announcementsLocalStorageStr) ?? {}
    const now = Math.floor(Date.now() / 1000)
    return announcements
      .filter(announcement => {
        const isOpen = announcementState[announcement.id] !== undefined ? !!announcementState[announcement.id] : true
        return now > announcement.startTimestamp && now < announcement.expiryTimestamp && isOpen
      })
      .sort((a, b) => b.startTimestamp - a.startTimestamp)
  }, [announcementsLocalStorageStr])
  const displayedIdx =
    _displayedIdx < displayedAnnouncements.length
      ? _displayedIdx
      : displayedAnnouncements.length > 0
      ? displayedAnnouncements.length - 1
      : 0
  const displayedAnnouncement = displayedAnnouncements[displayedIdx]
  return displayedAnnouncement ? (
    <PortfolioAnnouncementCard
      key={displayedAnnouncement.id}
      announcement={displayedAnnouncement}
      numAnnouncements={displayedAnnouncements.length}
      announcementIdx={displayedIdx}
      onNext={() => {
        const nextIdx = displayedIdx + 1
        if (nextIdx < displayedAnnouncements.length) {
          setDisplayedIdx(displayedIdx + 1)
        }
      }}
      onPrev={() => {
        const prevIdx = displayedIdx - 1
        if (prevIdx >= 0) {
          setDisplayedIdx(displayedIdx - 1)
        }
      }}
    />
  ) : null
}

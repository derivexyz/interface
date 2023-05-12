import { useCallback, useMemo } from 'react'

import announcements, { Announcement } from '@/app/constants/announcements'
import { LOCAL_STORAGE_ANNOUNCEMENTS_KEY } from '@/app/constants/localStorage'

import useLocalStorage from './useLocalStorage'

type AnnouncementData = {
  announcements: Announcement[]
  dismissAnnouncement: (id: string) => void
}

export default function useAnnouncements(blockTimestamp: number): AnnouncementData {
  const [announcementsLocalStorageStr, setLocalStorage] = useLocalStorage(LOCAL_STORAGE_ANNOUNCEMENTS_KEY)

  const displayedAnnouncements = useMemo(() => {
    const announcementState: Record<string, boolean> = JSON.parse(announcementsLocalStorageStr) ?? {}
    return announcements
      .filter(announcement => {
        const isOpen = announcementState[announcement.id] !== undefined ? !!announcementState[announcement.id] : true
        return blockTimestamp > announcement.startTimestamp && blockTimestamp < announcement.expiryTimestamp && isOpen
      })
      .sort((a, b) => b.startTimestamp - a.startTimestamp)
  }, [announcementsLocalStorageStr, blockTimestamp])

  const dismissAnnouncement = useCallback(
    (id: string) => {
      const announcementState = JSON.parse(announcementsLocalStorageStr)
      setLocalStorage(
        JSON.stringify({
          ...announcementState,
          [id]: false,
        })
      )
    },
    [announcementsLocalStorageStr, setLocalStorage]
  )

  return useMemo(
    () => ({ announcements: displayedAnnouncements, dismissAnnouncement }),
    [displayedAnnouncements, dismissAnnouncement]
  )
}

import { ButtonVariant } from '@lyra/ui/components/Button'

import announcements from './announcements.json'

export type Announcement = {
  id: string
  header: string
  title: string
  cta: {
    label: string
    href: string
    variant: ButtonVariant
    target?: '_self' | '_blank'
  }[]
  graphic?: string
  graphicSize?: number[]
  startTimestamp: number
  expiryTimestamp: number
  showCountdown?: boolean
}

export default announcements as Announcement[]

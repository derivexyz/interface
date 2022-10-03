import announcements from './announcements.json'

export type Announcement = {
  id: string
  header: string
  title: string
  cta: string
  linkHref: string
  linkTarget?: '_self' | '_blank'
  graphic?: string
  startTimestamp: number
  expiryTimestamp: number
}
export default announcements as Announcement[]
